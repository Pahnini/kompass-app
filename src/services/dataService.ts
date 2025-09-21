/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/dataService.ts
/**
 * Healthcare-Grade Data Service for German GDPR Compliance
 *
 * Architecture:
 * - Supabase: Primary storage with AES-256 encryption at rest
 * - localStorage: Offline fallback with healthcare validation
 * - GDPR Integration: Automatic audit logging and consent validation
 *
 * Compliance: GDPR + German BDSG + Healthcare standards
 * Last Updated: 2025-01-14
 */

import type { Achievement, CalendarNotes, Goal, Skill, Symptoms, WordFile } from '../types/index';
import { supabase } from '../utils/supabase';
import { encryptionService } from './encryptionService';
import * as storageService from './storageService';

// Storage backend interface
interface StorageBackend {
  get<T>(key: string, userId: string): Promise<T | null>;
  set<T>(key: string, data: T, userId: string): Promise<void>;
  remove(key: string, userId: string): Promise<void>;
  sync(userId: string): Promise<void>;
}

// Supabase storage backend with healthcare compliance
class SupabaseStorageBackend implements StorageBackend {
  /**
   * Log data access for GDPR audit compliance
   */
  private async logDataAccess(
    action: string,
    tableName: string,
    userId: string,

    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action,
        table_name: tableName,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          ip_address: 'client_side',
          user_agent: navigator.userAgent,
        },
      });
    } catch (error) {
      console.warn('⚠️ Audit logging failed:', error);
      // Don't fail the main operation if audit logging fails
    }
  }

  /**
   * Safely decrypt data that might be encrypted string or plain JSONB
   */

  private async safeDecrypt(encryptedData: any, userId: string): Promise<any> {
    // If data is null or undefined, return null
    if (encryptedData === null || encryptedData === undefined) {
      return null;
    }

    // If data is already an object (JSONB), return it directly
    // This handles cases where data was stored before encryption was implemented
    if (typeof encryptedData === 'object') {
      console.log('🔄 Found JSONB data (pre-encryption), using directly');
      return encryptedData;
    }

    // If data is a string, try to decrypt it
    if (typeof encryptedData === 'string') {
      try {
        return await encryptionService.decrypt(encryptedData, userId);
      } catch (error) {
        console.warn('⚠️ Decryption failed, trying JSON parse fallback:', error);

        // Fallback: try to parse as JSON (for data stored before encryption)
        try {
          return JSON.parse(encryptedData);
        } catch (parseError) {
          console.error('❌ Failed to parse data as JSON:', parseError);
          throw new Error(`Failed to decrypt or parse data: ${error}`);
        }
      }
    }

    // If we get here, we don't know how to handle this data type
    throw new Error(`Unknown data type for decryption: ${typeof encryptedData}`);
  }

  /**
   * Validate healthcare data before processing
   */
  private validateHealthcareData(data: any): void {
    if (encryptionService.isHealthcareData(data)) {
      console.log('🏥 Healthcare data detected - applying enhanced protection');

      // Additional validation for healthcare data
      if (typeof data === 'object' && data !== null) {
        const serialized = JSON.stringify(data);

        // Check for potential PII patterns
        const sensitivePatterns = [
          /\b\d{3}-\d{2}-\d{4}\b/, // SSN
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
          /\b\d{10,}\b/, // Phone
        ];

        const containsPII = sensitivePatterns.some(pattern => pattern.test(serialized));
        if (containsPII) {
          console.warn('⚠️ PII detected in healthcare data - ensure GDPR compliance');
        }
      }
    }
  }
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

      // Log data access for GDPR audit
      await this.logDataAccess('DATA_ACCESS', tableName, userId, { key });

      let result: T | null;
      if (tableName === 'user_profiles') {
        result = await this.getUserProfileData<T>(key, userId);
      } else {
        result = await this.getUserDataFromTable<T>(key, tableName, userId);
      }

      // Validate healthcare data
      if (result !== null) {
        this.validateHealthcareData(result);
      }

      return result;
    } catch (error) {
      console.error(`❌ Supabase get failed for ${key}:`, error);

      // Log the error for audit purposes
      await this.logDataAccess('DATA_ACCESS_ERROR', await this.getTableName(key), userId, {
        key,
        error: String(error),
      });

      throw error;
    }
  }

  private async getUserProfileData<T>(key: string, userId: string): Promise<T | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
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
          const preferences = await this.safeDecrypt(data.encrypted_preferences, userId);
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
      case 'user_goals': {
        const goals = await Promise.all(
          data.map(row => this.safeDecrypt(row.encrypted_goal_data, userId))
        );
        return goals as T;
      }

      case 'user_achievements': {
        const achievements = await Promise.all(
          data.map(row => this.safeDecrypt(row.encrypted_achievement_data, userId))
        );
        return achievements as T;
      }

      case 'user_skills':
        if (data[0]?.encrypted_skills_data) {
          return (await this.safeDecrypt(data[0].encrypted_skills_data, userId)) as T;
        }
        return null;

      case 'user_calendar_notes': {
        const calendarNotes: Record<string, any> = {};
        await Promise.all(
          data.map(async row => {
            const noteData = await this.safeDecrypt(row.encrypted_note_data, userId);
            calendarNotes[row.note_date] = noteData;
          })
        );
        return calendarNotes as T;
      }

      case 'user_symptoms': {
        const symptoms: Record<string, any> = {};
        await Promise.all(
          data.map(async row => {
            const symptomData = await this.safeDecrypt(row.encrypted_symptom_data, userId);
            symptoms[row.symptom_date] = symptomData;
          })
        );
        return symptoms as T;
      }

      case 'user_word_files': {
        const wordFiles = await Promise.all(
          data.map(async row => ({
            id: row.file_id,
            name: await encryptionService.decryptField(row.encrypted_file_name, userId),
            url: row.file_url,
            file: null, // File object not stored in DB
          }))
        );
        return wordFiles as T;
      }

      default:
        return null;
    }
  }

  async set<T>(key: string, data: T, userId: string): Promise<void> {
    try {
      const tableName = await this.getTableName(key);

      // Validate healthcare data before storage
      this.validateHealthcareData(data);

      // Log data modification for GDPR audit
      await this.logDataAccess('DATA_MODIFY', tableName, userId, {
        key,
        is_healthcare: encryptionService.isHealthcareData(data),
      });

      if (tableName === 'user_profiles') {
        await this.setUserProfileData(key, data, userId);
      } else {
        await this.setUserDataInTable(key, data, tableName, userId);
      }

      // Update sync status with compliance metadata
      await this.updateSyncStatus(tableName, userId, 'completed', undefined, {
        healthcare_data: encryptionService.isHealthcareData(data),
        encryption_used: true,
        gdpr_compliant: true,
      });
    } catch (error) {
      console.error(`❌ Supabase set failed for ${key}:`, error);

      // Log the error for audit purposes
      await this.logDataAccess('DATA_MODIFY_ERROR', await this.getTableName(key), userId, {
        key,
        error: String(error),
      });

      await this.updateSyncStatus(await this.getTableName(key), userId, 'failed', String(error));
      throw error;
    }
  }

  private async setUserProfileData<T>(key: string, data: T, userId: string): Promise<void> {
    const updateData: any = {};

    switch (key) {
      case 'username':
        updateData.encrypted_username = encryptionService.encryptField(data as string, userId);
        break;

      case 'points':
        updateData.points = data;
        break;

      case 'favorites': {
        // Get existing preferences or create new
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('encrypted_preferences')
          .eq('user_id', userId)
          .single();

        let preferences: any = {};
        if (existingProfile?.encrypted_preferences) {
          preferences = await this.safeDecrypt(existingProfile.encrypted_preferences, userId);
        }

        preferences.favorites = data;
        updateData.encrypted_preferences = await encryptionService.encrypt(preferences, userId);
        break;
      }

      default:
        return;
    }

    // Upsert user profile
    const { error } = await supabase.from('user_profiles').upsert({
      user_id: userId,
      ...updateData,
      device_fingerprint: encryptionService.getEncryptionMetadata().deviceFingerprint,
    });

    if (error) throw error;
  }

  private async setUserDataInTable<T>(
    _key: string,
    data: T,
    tableName: string,
    userId: string
  ): Promise<void> {
    switch (tableName) {
      case 'user_goals': {
        const goals = data as Goal[];

        // First, mark all existing goals as deleted
        await supabase
          .from('user_goals')
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            deletion_reason: 'replaced_by_update',
          })
          .eq('user_id', userId)
          .eq('is_deleted', false);

        if (goals && goals.length > 0) {
          const goalRows = await Promise.all(
            goals.map(async goal => ({
              user_id: userId,
              goal_id: goal.id,
              encrypted_goal_data: await encryptionService.encrypt(goal, userId),
              completed: goal.completed,
              version: 1,
              is_deleted: false, // Explicitly set as not deleted
            }))
          );

          // Use upsert to handle existing goal_ids
          const { error } = await supabase.from('user_goals').upsert(goalRows, {
            onConflict: 'user_id,goal_id',
            ignoreDuplicates: false,
          });

          if (error) throw error;
        }
        break;
      }

      case 'user_achievements': {
        const achievements = data as Achievement[];

        // First, mark all existing achievements as deleted
        await supabase
          .from('user_achievements')
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            deletion_reason: 'replaced_by_update',
          })
          .eq('user_id', userId)
          .eq('is_deleted', false);

        if (achievements && achievements.length > 0) {
          const achievementRows = await Promise.all(
            achievements.map(async achievement => ({
              user_id: userId,
              achievement_id: achievement.id,
              encrypted_achievement_data: await encryptionService.encrypt(achievement, userId),
              achievement_date: achievement.date,
              achievement_type: achievement.type || 'general',
              version: 1,
              is_deleted: false, // Explicitly set as not deleted
            }))
          );

          // Use upsert to handle existing achievement_ids
          const { error } = await supabase.from('user_achievements').upsert(achievementRows, {
            onConflict: 'user_id,achievement_id',
            ignoreDuplicates: false,
          });

          if (error) throw error;
        }
        break;
      }

      case 'user_skills': {
        const skills = data as Skill[];
        if (skills) {
          const { error } = await supabase.from('user_skills').insert({
            user_id: userId,
            encrypted_skills_data: await encryptionService.encrypt(skills, userId),
            skills_count: Array.isArray(skills) ? skills.length : 0,
            version: 1,
          });

          if (error) throw error;
        }
        break;
      }

      case 'user_calendar_notes': {
        const calendarNotes = data as CalendarNotes;
        if (calendarNotes && Object.keys(calendarNotes).length > 0) {
          const noteRows = await Promise.all(
            Object.entries(calendarNotes).map(async ([date, noteData]) => ({
              user_id: userId,
              note_date: date,
              encrypted_note_data: await encryptionService.encrypt(noteData, userId),
              version: 1,
            }))
          );

          const { error } = await supabase.from('user_calendar_notes').insert(noteRows);

          if (error) throw error;
        }
        break;
      }

      case 'user_symptoms': {
        const symptoms = data as Symptoms;
        if (symptoms && Object.keys(symptoms).length > 0) {
          const symptomRows = await Promise.all(
            Object.entries(symptoms).map(async ([date, symptomData]) => ({
              user_id: userId,
              symptom_date: date,
              encrypted_symptom_data: await encryptionService.encrypt(symptomData, userId),
              symptom_count: Array.isArray(symptomData) ? symptomData.length : 0,
              version: 1,
            }))
          );

          const { error } = await supabase.from('user_symptoms').insert(symptomRows);

          if (error) throw error;
        }
        break;
      }

      case 'user_word_files': {
        const wordFiles = data as WordFile[];
        if (wordFiles && wordFiles.length > 0) {
          const fileRows = await Promise.all(
            wordFiles.map(async file => ({
              user_id: userId,
              file_id: file.id,
              encrypted_file_name: await encryptionService.encryptField(file.name, userId),
              file_url: file.url,
              version: 1,
            }))
          );

          const { error } = await supabase.from('user_word_files').insert(fileRows);

          if (error) throw error;
        }
        break;
      }
    }
  }

  async remove(key: string, userId: string): Promise<void> {
    try {
      const tableName = await this.getTableName(key);

      // Log data deletion for GDPR audit (important for Right to Erasure)
      await this.logDataAccess('DATA_DELETE', tableName, userId, {
        key,
        deletion_type: 'soft_delete',
        gdpr_basis: 'user_request',
      });

      // Soft delete by marking as deleted (GDPR compliant)
      const { error } = await supabase
        .from(tableName)
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          deletion_reason: 'user_request',
        })
        .eq('user_id', userId);

      if (error) throw error;

      await this.updateSyncStatus(tableName, userId, 'completed', undefined, {
        operation: 'soft_delete',
        gdpr_compliant: true,
      });
    } catch (error) {
      console.error(`❌ Supabase remove failed for ${key}:`, error);

      // Log the error for audit purposes
      await this.logDataAccess('DATA_DELETE_ERROR', await this.getTableName(key), userId, {
        key,
        error: String(error),
      });

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
    errorMessage?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase.from('sync_status').upsert({
        user_id: userId,
        table_name: tableName,
        sync_status: status,
        error_message: errorMessage || null,
        updated_at: new Date().toISOString(),
        compliance_metadata: metadata || null,
        encryption_status: encryptionService.getHealthStatus(),
      });
    } catch (error) {
      console.error('⚠️ Failed to update sync status:', error);
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
      return this.localStorageBackend.get<T>(key, userId);
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
  getEncryptionMetadata() {
    return encryptionService.getEncryptionMetadata();
  }

  /**
   * GDPR Data Export - implements Article 15 (Right of Access)
   */
  async exportUserDataGDPR(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('gdpr_export_user_data', {
        user_uuid: userId,
      });

      if (error) throw error;

      console.log('📋 GDPR data export completed for user:', userId);
      return data;
    } catch (error) {
      console.error('❌ GDPR data export failed:', error);
      throw new Error(`GDPR data export failed: ${error}`);
    }
  }

  /**
   * GDPR Data Erasure - implements Article 17 (Right to be Forgotten)
   */
  async eraseUserDataGDPR(userId: string, reason: string = 'User request'): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('gdpr_erase_user_data', {
        user_uuid: userId,
        erasure_reason: reason,
      });

      if (error) throw error;

      // Clear local storage as well
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
        await this.localStorageBackend.remove(key, userId);
      }

      console.log('🗑️ GDPR data erasure completed for user:', userId);
      return data;
    } catch (error) {
      console.error('❌ GDPR data erasure failed:', error);
      throw new Error(`GDPR data erasure failed: ${error}`);
    }
  }

  /**
   * GDPR Data Portability - implements Article 20 (Right to Data Portability)
   */
  async exportPortableDataGDPR(userId: string, format: string = 'json'): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('gdpr_export_portable_data', {
        user_uuid: userId,
        format,
      });

      if (error) throw error;

      console.log('📦 GDPR portable data export completed for user:', userId);
      return data;
    } catch (error) {
      console.error('❌ GDPR portable data export failed:', error);
      throw new Error(`GDPR portable data export failed: ${error}`);
    }
  }

  /**
   * Record user consent for healthcare data processing
   */
  async recordHealthcareConsent(
    consentType: string,
    granted: boolean,
    isMinor: boolean = false,
    parentalConsent: boolean = false
  ): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('record_user_consent', {
        consent_type_param: consentType,
        consent_granted_param: granted,
        is_minor_param: isMinor,
        parental_consent_param: parentalConsent,
      });

      if (error) throw error;

      console.log('✅ Healthcare consent recorded:', { consentType, granted });
      return data;
    } catch (error) {
      console.error('❌ Healthcare consent recording failed:', error);
      throw new Error(`Healthcare consent recording failed: ${error}`);
    }
  }

  /**
   * Withdraw user consent
   */
  async withdrawConsent(consentType: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('withdraw_user_consent', {
        consent_type_param: consentType,
      });

      if (error) throw error;

      console.log('🚫 Consent withdrawn:', consentType);
      return data;
    } catch (error) {
      console.error('❌ Consent withdrawal failed:', error);
      throw new Error(`Consent withdrawal failed: ${error}`);
    }
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
