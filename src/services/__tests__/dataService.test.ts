import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HybridDataService } from '../dataService';
import { encryptionService } from '../encryptionService';
import { supabase } from '../../utils/supabase';

const owner = 'test-user-123';
const session = { data: { session: { user: { id: owner } } }, error: null };
afterEach(() => vi.restoreAllMocks());
beforeEach(() => {
  vi.mocked(supabase.auth.getSession).mockResolvedValue(session as never);
  vi.mocked(supabase.rpc).mockResolvedValue({
    data: null,
    error: { message: 'Encryption unavailable' },
  } as never);
});
function offline() {
  Object.defineProperty(navigator, 'onLine', { writable: true, value: false });
  return new HybridDataService();
}
describe('Account data storage', () => {
  it('blocks replacements after a failed read until existing data loads successfully', async () => {
    const service = new HybridDataService();
    const backend = (
      service as unknown as {
        supabaseBackend: { get: () => Promise<unknown>; set: () => Promise<void> };
      }
    ).supabaseBackend;
    const read = vi.spyOn(backend, 'get').mockRejectedValue(new Error('Decryption failed'));
    const write = vi.spyOn(backend, 'set').mockResolvedValue(undefined);
    expect(await service.getDataSafe('goals', owner, [])).toEqual([]);
    await expect(service.setData('goals', [], owner)).rejects.toThrow(
      'Existing data could not be loaded'
    );
    await expect(service.removeData('goals', owner)).rejects.toThrow(
      'Existing data could not be loaded'
    );
    expect(write).not.toHaveBeenCalled();
    read.mockResolvedValue([]);
    await service.getData('goals', owner);
    await service.setData('goals', [], owner);
    expect(write).toHaveBeenCalledTimes(1);
  });
  it('stores offline records under the account key and restores them', async () => {
    const service = offline();
    const goals = [{ id: 'one', text: 'Read a book', title: '', completed: false }];
    await service.setData('goals', goals, owner);
    expect(await service.getData('goals', owner)).toEqual(goals);
    expect(localStorage.getItem('goals')).toBeNull();
    expect(localStorage.getItem(`melforia_account:${owner}:goals`)).toContain('Read a book');
  });
  it('does not read, write or remove data belonging to another signed-in account', async () => {
    const service = offline();
    await service.setData('points', 25, owner);
    await expect(service.getData('points', 'bob')).rejects.toThrow('Session user ID mismatch');
    await expect(service.setData('points', 100, 'bob')).rejects.toThrow();
    await expect(service.removeData('points', 'bob')).rejects.toThrow();
    expect(await service.getData('points', owner)).toBe(25);
  });
  it('does not inherit ambiguous legacy browser records', async () => {
    localStorage.setItem('goals', JSON.stringify([{ text: 'old account' }]));
    expect(await offline().getData('goals', owner)).toBeNull();
  });
  it('removes only the selected account record', async () => {
    const service = offline();
    await service.setData('points', 25, owner);
    localStorage.setItem('melforia_account:bob:points', '100');
    await service.removeData('points', owner);
    expect(await service.getData('points', owner)).toBeNull();
    expect(localStorage.getItem('melforia_account:bob:points')).toBe('100');
  });
  it('does not claim success or cache a write when online encryption fails', async () => {
    const service = new HybridDataService();
    await expect(
      service.setData('goals', [{ id: 'one', text: 'private', completed: false }], owner)
    ).rejects.toThrow('Secure encryption unavailable');
    expect(localStorage.getItem(`melforia_account:${owner}:goals`)).toBeNull();
  });
  it('preserves existing rows when encryption fails before saving goals', async () => {
    const goalUpdate = vi.fn();
    const original = supabase.from.bind(supabase);
    vi.spyOn(supabase, 'from').mockImplementation((table: string) =>
      table === 'user_goals' ? ({ update: goalUpdate } as never) : original(table)
    );
    const service = new HybridDataService();
    await expect(
      service.setData('goals', [{ id: 'one', text: 'private', completed: false }], owner)
    ).rejects.toThrow();
    expect(goalUpdate).not.toHaveBeenCalled();
  });
  it('does not silently swallow a failed local write', async () => {
    const service = offline();
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });
    await expect(service.setData('points', 5, owner)).rejects.toThrow('Storage full');
  });
  it('uses a fallback for corrupt records without deleting the original', async () => {
    const service = offline();
    localStorage.setItem(`melforia_account:${owner}:goals`, '{broken');
    expect(await service.getDataSafe('goals', owner, [])).toEqual([]);
    expect(localStorage.getItem(`melforia_account:${owner}:goals`)).toBe('{broken');
  });
  it('reports failed encryption health instead of treating base64 as encryption', async () => {
    expect(await encryptionService.testEncryption(owner)).toBe(false);
  });
});
