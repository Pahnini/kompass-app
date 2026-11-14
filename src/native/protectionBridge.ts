import { Capacitor, registerPlugin } from '@capacitor/core';
import type { ProtectionEntry, ProtectionSettings } from '../utils/protection';

export interface NativeProtectionState {
  enabled: boolean;
  serviceEnabled: boolean;
  connected: boolean;
  consentVersion: number;
  config: ProtectionSettings;
  entries: unknown[];
}
interface ProtectionPlugin {
  getState(): Promise<NativeProtectionState>;
  configure(options: { config: ProtectionSettings }): Promise<NativeProtectionState>;
  acceptDisclosure(options: { version: number }): Promise<NativeProtectionState>;
  openAccessibilitySettings(): Promise<void>;
  setEnabled(options: { enabled: boolean }): Promise<NativeProtectionState>;
  openDemo(): Promise<void>;
  deleteEntry(options: { id: string }): Promise<NativeProtectionState>;
  exportCollection(options: { entries: ProtectionEntry[] }): Promise<void>;
}
export function isNativeProtectionAvailable(): boolean {
  return Capacitor.getPlatform() === 'android' && Capacitor.isPluginAvailable('MelforiaProtection');
}
export const NativeProtection = registerPlugin<ProtectionPlugin>('MelforiaProtection');
