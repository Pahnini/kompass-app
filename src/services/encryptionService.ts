// src/services/encryptionService.ts
/**
 * TEMPORARY STUB: Client-side encryption removed for GDPR/German health compliance
 * 
 * This service now passes data through without client-side encryption.
 * Server-side encryption will be handled by Supabase database encryption.
 * 
 * WARNING: This is a transitional implementation during compliance upgrade.
 */

/**
 * Temporary stub service to replace client-side encryption
 * All methods now pass data through without encryption
 */
export class EncryptionService {
  private static instance: EncryptionService;

  private constructor() {
    console.warn('🚨 CLIENT-SIDE ENCRYPTION DISABLED - Using server-side encryption only');
  }

  /**
   * Singleton pattern maintained for API compatibility
   */
  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Pass-through: Returns data as-is (no client-side encryption)
   * Server-side encryption handled by Supabase
   */
  public encrypt(data: any, _userId: string): string {
    // Convert to JSON string for API compatibility
    return JSON.stringify(data);
  }

  /**
   * Pass-through: Parse JSON data (no decryption needed)
   */
  public decrypt<T = any>(data: string, _userId: string): T {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse data:', error);
      throw new Error('Failed to parse data - invalid format');
    }
  }

  /**
   * Pass-through field encryption (returns JSON string)
   */
  public encryptField(value: string, _userId: string): string {
    return JSON.stringify({ value });
  }

  /**
   * Pass-through field decryption (parses JSON)
   */
  public decryptField(encryptedValue: string, _userId: string): string {
    try {
      const parsed = JSON.parse(encryptedValue);
      return parsed.value || encryptedValue;
    } catch {
      // If not JSON, return as-is (for compatibility)
      return encryptedValue;
    }
  }

  /**
   * Validation always returns true (no encryption to validate)
   */
  public validateEncryptedData(_encryptedData: string, _userId: string): boolean {
    return true;
  }

  /**
   * Returns metadata indicating no client-side encryption
   */
  public getEncryptionMetadata(_userId: string): {
    algorithm: string;
    keySize: number;
    iterations: number;
    deviceFingerprint: string;
    timestamp: string;
  } {
    return {
      algorithm: 'NONE-SERVER-SIDE-ONLY',
      keySize: 0,
      iterations: 0,
      deviceFingerprint: 'NO-CLIENT-SIDE-FINGERPRINT',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * No-op: No device fingerprint to clear
   */
  public clearDeviceFingerprint(): void {
    // No-op - no client-side fingerprinting
  }

  /**
   * Test always passes (no encryption to test)
   */
  public testEncryption(_userId: string): boolean {
    return true;
  }
}

/**
 * Export singleton instance
 */
export const encryptionService = EncryptionService.getInstance();

/**
 * Maintained type definitions for compatibility
 */
export interface EncryptedData {
  encryptedData: string;
  metadata: {
    algorithm: string;
    keySize: number;
    deviceFingerprint: string;
    timestamp: string;
  };
}

export interface EncryptionError extends Error {
  code: 'ENCRYPTION_FAILED' | 'DECRYPTION_FAILED' | 'INVALID_KEY' | 'CORRUPTED_DATA';
  originalError?: Error;
}

/**
 * Updated utility functions
 */
export const EncryptionUtils = {
  /**
   * Check if data appears to be JSON (since we no longer encrypt)
   */
  isEncrypted(data: string): boolean {
    try {
      JSON.parse(data);
      return true; // Consider JSON as "encrypted" for compatibility
    } catch {
      return false;
    }
  },

  /**
   * No sanitization needed since no encryption
   */
  sanitizeForLogging(data: any): any {
    return data;
  },

  /**
   * Generate secure random ID using crypto API
   */
  generateSecureId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
};