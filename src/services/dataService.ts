// src/services/dataService.ts
import type { Achievement, CalendarNotes, Goal, Skill, Symptoms, WordFile } from '../types/index';
import { supabase } from '../utils/supabase';
import { encryptionService } from './encryptionService';
import * as storageService from './storageService';

/**
 * Healthcare-grade data service with encryption and hybrid storage
 * Provides seamless switching between Supabase and localStorage
 * with automatic fallback and offline support
 */

// Storage backend interface
interface StorageBackend {
  get<T>(key: string, userId: string): Promise<T | null>;
  set<T>(key: string, data: T, userId: string): Promise<void>;
  remove(key: string, userId: string): Promise<void>;
  sync(userId: string): Promise<void>;
}

// Supabase storage backend
class SupabaseStorageBackend implements StorageBackend {
  private async getTableName(key: string): Promise<string> {
    const tableMap: Record<string, string> = {
      goals: 'user_goals',
      achievements: 'user_achievements',
      skills: 'user_skills',
      skillsList: 'user_skills',
      calendarNotes: 'user_calendar_notes',
      symptoms: 'user_symptoms',
      wordFiles: 'user_word_files',
      username: 'user_profiles',
      favorites: 'user_profiles',
      points: 'user_profiles',
    };

    return tableMap[key] || 'user_profiles';
  }

  async get<T>(key: string, userId: string): Promise<T | null> {
    try {
      const tableName = await this.getTableName(key);

      if (tableName === 'user_profiles') {
        return await this.getUserProfileData<T>(key, userId);
      } else {
        return await this.getUserDataFromTable<T>(key, tableName, userId);
      }
    } catch (error) {
      console.error(`Supabase get failed for ${key}:`, error);
      throw error;
    }
  }

  private async getUserProfileData<T>(key: string, userId: string): Promise<T | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    if (!data) return null;

    // Handle different profile fields
    switch (key) {
      case 'username':
        return data.encrypted_username
          ? (encryptionService.decryptField(data.encrypted_username, userId) as T)
          : null;

      case 'points':
        return data.points as T;

      case 'favorites':
        if (data.encrypted_preferences) {
          const preferences = encryptionService.decrypt(data.encrypted_preferences, userId);
          return (preferences.favorites || null) as T;
        }
        return null;

      default:
        return null;
    }
  }

  private async getUserDataFromTable<T>(
    _key: string,
    tableName: string,
    userId: string
  ): Promise<T | null> {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Decrypt and transform data based on table
    switch (tableName) {
      case 'user_goals':
        const goals = data.map(row => encryptionService.decrypt(row.encrypted_goal_data, userId));
        return goals as T;

      case 'user_achievements':
        const achievements = data.map(row =>
          encryptionService.decrypt(row.encrypted_achievement_data, userId)
        );
        return achievements as T;

      case 'user_skills':
        if (data[0]?.encrypted_skills_data) {
          return encryptionService.decrypt<T>(data[0].encrypted_skills_data, userId);
        }
        return null;

      case 'user_calendar_notes':
        const calendarNotes: Record<string, any> = {};
        data.forEach(row => {
          const noteData = encryptionService.decrypt(row.encrypted_note_data, userId);
          calendarNotes[row.note_date] = noteData;
        });
        return calendarNotes as T;

      case 'user_symptoms':
        const symptoms: Record<string, any> = {};
        data.forEach(row => {
          const symptomData = encryptionService.decrypt(row.encrypted_symptom_data, userId);
          symptoms[row.symptom_date] = symptomData;
        });
        return symptoms as T;

      case 'user_word_files':
        const wordFiles = data.map(row => ({
          id: row.file_id,
          name: encryptionService.decryptField(row.encrypted_file_name, userId),
          url: row.file_url,
          file: null, // File object not stored in DB
        }));
        return wordFiles as T;

      default:
        return null;
    }
  }

  async set<T>(key: string, data: T, userId: string): Promise<void> {
    try {
      const tableName = await this.getTableName(key);

      if (tableName === 'user_profiles') {
        await this.setUserProfileData(key, data, userId);
      } else {
        await this.setUserDataInTable(key, data, tableName, userId);
      }

      // Update sync status
      await this.updateSyncStatus(tableName, userId, 'completed');
    } catch (error) {
      console.error(`Supabase set failed for ${key}:`, error);
      await this.updateSyncStatus(await this.getTableName(key), userId, 'failed', String(error));
      throw error;
    }
  }

  private async setUserProfileData<T>(key: string, data: T, userId: string): Promise<void> {
    let updateData: any = {};

    switch (key) {
      case 'username':
        updateData.encrypted_username = encryptionService.encryptField(data as string, userId);
        break;

      case 'points':
        updateData.points = data;
        break;

      case 'favorites':
        // Get existing preferences or create new
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('encrypted_preferences')
          .eq('user_id', userId)
          .single();

        let preferences: any = {};
        if (existingProfile?.encrypted_preferences) {
          preferences = encryptionService.decrypt(existingProfile.encrypted_preferences, userId);
        }

        preferences.favorites = data;
        updateData.encrypted_preferences = encryptionService.encrypt(preferences, userId);
        break;

      default:
        return;
    }

    // Upsert user profile
    const { error } = await supabase.from('user_profiles').upsert({
      user_id: userId,
      ...updateData,
      device_fingerprint: encryptionService.getEncryptionMetadata(userId).deviceFingerprint,
    });

    if (error) throw error;
  }

  private async setUserDataInTable<T>(
    _key: string,
    data: T,
    tableName: string,
    userId: string
  ): Promise<void> {
    // First, mark existing records as deleted (soft delete)
    await supabase.from(tableName).update({ is_deleted: true }).eq('user_id', userId);

    switch (tableName) {
      case 'user_goals':
        const goals = data as Goal[];
        if (goals && goals.length > 0) {
          const goalRows = goals.map(goal => ({
            user_id: userId,
            goal_id: goal.id,
            encrypted_goal_data: encryptionService.encrypt(goal, userId),
            completed: goal.completed,
            version: 1,
          }));

          const { error } = await supabase.from('user_goals').insert(goalRows);

          if (error) throw error;
        }
        break;

      case 'user_achievements':
        const achievements = data as Achievement[];
        if (achievements && achievements.length > 0) {
          const achievementRows = achievements.map(achievement => ({
            user_id: userId,
            achievement_id: achievement.id,
            encrypted_achievement_data: encryptionService.encrypt(achievement, userId),
            achievement_date: achievement.date,
            achievement_type: achievement.type || 'general',
            version: 1,
          }));

          const { error } = await supabase.from('user_achievements').insert(achievementRows);

          if (error) throw error;
        }
        break;

      case 'user_skills':
        const skills = data as Skill[];
        if (skills) {
          const { error } = await supabase.from('user_skills').insert({
            user_id: userId,
            encrypted_skills_data: encryptionService.encrypt(skills, userId),
            skills_count: Array.isArray(skills) ? skills.length : 0,
            version: 1,
          });

          if (error) throw error;
        }
        break;

      case 'user_calendar_notes':
        const calendarNotes = data as CalendarNotes;
        if (calendarNotes && Object.keys(calendarNotes).length > 0) {
          const noteRows = Object.entries(calendarNotes).map(([date, noteData]) => ({
            user_id: userId,
            note_date: date,
            encrypted_note_data: encryptionService.encrypt(noteData, userId),
            version: 1,
          }));

          const { error } = await supabase.from('user_calendar_notes').insert(noteRows);

          if (error) throw error;
        }
        break;

      case 'user_symptoms':
        const symptoms = data as Symptoms;
        if (symptoms && Object.keys(symptoms).length > 0) {
          const symptomRows = Object.entries(symptoms).map(([date, symptomData]) => ({
            user_id: userId,
            symptom_date: date,
            encrypted_symptom_data: encryptionService.encrypt(symptomData, userId),
            symptom_count: Array.isArray(symptomData) ? symptomData.length : 0,
            version: 1,
          }));

          const { error } = await supabase.from('user_symptoms').insert(symptomRows);

          if (error) throw error;
        }
        break;

      case 'user_word_files':
        const wordFiles = data as WordFile[];
        if (wordFiles && wordFiles.length > 0) {
          const fileRows = wordFiles.map(file => ({
            user_id: userId,
            file_id: file.id,
            encrypted_file_name: encryptionService.encryptField(file.name, userId),
            file_url: file.url,
            version: 1,
          }));

          const { error } = await supabase.from('user_word_files').insert(fileRows);

          if (error) throw error;
        }
        break;
    }
  }

  async remove(key: string, userId: string): Promise<void> {
    try {
      const tableName = await this.getTableName(key);

      // Soft delete by marking as deleted
      const { error } = await supabase
        .from(tableName)
        .update({ is_deleted: true })
        .eq('user_id', userId);

      if (error) throw error;

      await this.updateSyncStatus(tableName, userId, 'completed');
    } catch (error) {
      console.error(`Supabase remove failed for ${key}:`, error);
      throw error;
    }
  }

  async sync(userId: string): Promise<void> {
    // This would implement full sync logic
    console.log(`Syncing all data for user ${userId}`);
  }

  private async updateSyncStatus(
    tableName: string,
    userId: string,
    status: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      await supabase.from('sync_status').upsert({
        user_id: userId,
        table_name: tableName,
        sync_status: status,
        error_message: errorMessage || null,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to update sync status:', error);
    }
  }
}

// localStorage backend (existing implementation with encryption support)
class LocalStorageBackend implements StorageBackend {
  async get<T>(key: string, _userId: string): Promise<T | null> {
    return storageService.get<T>(key);
  }

  async set<T>(key: string, data: T, _userId: string): Promise<void> {
    storageService.set(key, data);
  }

  async remove(key: string, _userId: string): Promise<void> {
    storageService.remove(key);
  }

  async sync(_userId: string): Promise<void> {
    // No sync needed for localStorage
  }
}

// Main hybrid data service
export class HybridDataService {
  private supabaseBackend: SupabaseStorageBackend;
  private localStorageBackend: LocalStorageBackend;
  private isOnline: boolean = navigator.onLine;
  private syncQueue: Map<string, any> = new Map();

  constructor() {
    this.supabaseBackend = new SupabaseStorageBackend();
    this.localStorageBackend = new LocalStorageBackend();

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Get data with automatic fallback
   */
  async getData<T>(key: string, userId: string): Promise<T | null> {
    try {
      if (this.isOnline) {
        // Try Supabase first
        const supabaseData = await this.supabaseBackend.get<T>(key, userId);
        if (supabaseData !== null) {
          // Cache in localStorage for offline access
          await this.localStorageBackend.set(key, supabaseData, userId);
          return supabaseData;
        }
      }

      // Fallback to localStorage
      return await this.localStorageBackend.get<T>(key, userId);
    } catch (error) {
      console.warn(`Supabase unavailable for ${key}, using localStorage:`, error);
      return await this.localStorageBackend.get<T>(key, userId);
    }
  }

  /**
   * Set data with automatic sync
   */
  async setData<T>(key: string, data: T, userId: string): Promise<void> {
    // Always save locally first (immediate response)
    await this.localStorageBackend.set(key, data, userId);

    if (this.isOnline) {
      try {
        // Try to sync to Supabase immediately
        await this.supabaseBackend.set(key, data, userId);
      } catch (error) {
        console.warn(`Failed to sync ${key} to Supabase:`, error);
        // Queue for later sync
        this.queueForSync(key, data, userId);
      }
    } else {
      // Queue for sync when online
      this.queueForSync(key, data, userId);
    }
  }

  /**
   * Remove data from both storage backends
   */
  async removeData(key: string, userId: string): Promise<void> {
    // Remove from localStorage immediately
    await this.localStorageBackend.remove(key, userId);

    if (this.isOnline) {
      try {
        await this.supabaseBackend.remove(key, userId);
      } catch (error) {
        console.warn(`Failed to remove ${key} from Supabase:`, error);
      }
    }
  }

  /**
   * Force sync all data to Supabase
   */
  async syncAllData(userId: string): Promise<{ success: string[]; failed: string[] }> {
    const results: { success: string[]; failed: string[] } = { success: [], failed: [] };

    // List of all data keys to sync
    const dataKeys = [
      'username',
      'goals',
      'achievements',
      'skills',
      'skillsList',
      'calendarNotes',
      'symptoms',
      'wordFiles',
      'favorites',
      'points',
    ];

    for (const key of dataKeys) {
      try {
        const localData = await this.localStorageBackend.get(key, userId);
        if (localData !== null) {
          await this.supabaseBackend.set(key, localData, userId);
          results.success.push(key);
        }
      } catch (error) {
        console.error(`Failed to sync ${key}:`, error);
        results.failed.push(key);
      }
    }

    return results;
  }

  /**
   * Check sync status for a user
   */
  async getSyncStatus(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('sync_status')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get sync status:', error);
      return [];
    }
  }

  /**
   * Test encryption functionality
   */
  async testEncryption(userId: string): Promise<boolean> {
    return encryptionService.testEncryption(userId);
  }

  /**
   * Get encryption metadata for audit purposes
   */
  getEncryptionMetadata(userId: string) {
    return encryptionService.getEncryptionMetadata(userId);
  }

  private queueForSync(key: string, data: any, userId: string): void {
    this.syncQueue.set(`${userId}:${key}`, { key, data, userId, timestamp: Date.now() });
  }

  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.size === 0) return;

    const entries = Array.from(this.syncQueue.entries());

    for (const [queueKey, queueData] of entries) {
      try {
        await this.supabaseBackend.set(queueData.key, queueData.data, queueData.userId);
        this.syncQueue.delete(queueKey);
        console.log(`Synced queued data: ${queueData.key}`);
      } catch (error) {
        console.error(`Failed to sync queued data ${queueData.key}:`, error);
        // Keep in queue for retry
      }
    }
  }
}

// Export singleton instance
export const dataService = new HybridDataService();

// Export types for use in other files
export type DataKey =
  | 'username'
  | 'goals'
  | 'achievements'
  | 'skills'
  | 'skillsList'
  | 'calendarNotes'
  | 'symptoms'
  | 'wordFiles'
  | 'favorites'
  | 'points';

export interface SyncResult {
  success: string[];
  failed: string[];
}

export interface SyncStatus {
  table_name: string;
  last_sync_at: string;
  sync_status: 'pending' | 'syncing' | 'completed' | 'failed';
  error_message?: string;
}
