import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { supabase } from '../../utils/supabase';
import { encryptionService } from '../encryptionService';
afterEach(() => vi.restoreAllMocks());
beforeEach(() => {
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: { session: { user: { id: 'test-user-123' } } },
    error: null,
  } as never);
  vi.mocked(supabase.rpc).mockResolvedValue({
    data: null,
    error: { message: 'Encryption unavailable' },
  } as never);
});
describe('Encryption writes fail closed', () => {
  it('does not return ciphertext or empty fields when decryption fails', async () => {
    await expect(
      encryptionService.decryptField('ww0ECQMC' + 'A'.repeat(48), 'test-user-123')
    ).rejects.toThrow('decryption failed');
  });
  it('rejects cross-account reads including legacy data', async () => {
    await expect(encryptionService.decrypt('fallback:e30=', 'other-user')).rejects.toThrow(
      'Authentication'
    );
    await expect(encryptionService.decryptField('legacy name', 'other-user')).rejects.toThrow(
      'Authentication'
    );
    expect(supabase.rpc).not.toHaveBeenCalled();
  });
  it('rejects RPC failure instead of producing base64 fallback', async () => {
    await expect(
      encryptionService.encrypt({ text: 'Private note' }, 'test-user-123')
    ).rejects.toThrow('Secure encryption unavailable');
    await expect(encryptionService.encryptField('Private name', 'test-user-123')).rejects.toThrow(
      'Secure encryption unavailable'
    );
  });
  it('rejects cross-account encryption before invoking the RPC', async () => {
    await expect(encryptionService.encrypt({ text: 'Private note' }, 'other-user')).rejects.toThrow(
      'Authentication'
    );
    expect(supabase.rpc).not.toHaveBeenCalled();
  });
  it('rejects an RPC returning plain text or a legacy fallback', async () => {
    vi.spyOn(supabase, 'rpc').mockResolvedValue({
      data: 'fallback:cHJpdmF0ZQ==',
      error: null,
    } as never);
    await expect(encryptionService.encrypt('private', 'test-user-123')).rejects.toThrow();
  });
  it('still reads legacy stored fallback values without writing new ones', async () => {
    expect(
      await encryptionService.decrypt(
        `fallback:${btoa(JSON.stringify({ note: 'old data' }))}`,
        'test-user-123'
      )
    ).toEqual({ note: 'old data' });
  });
});
