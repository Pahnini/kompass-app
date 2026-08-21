const CLEANUP_RELOAD_KEY = 'melforia-legacy-cache-cleaned-v1';

export async function retireLegacyServiceWorkers(): Promise<void> {
  const supportsServiceWorkers = 'serviceWorker' in navigator;
  const supportsCacheStorage = 'caches' in window;

  if (!supportsServiceWorkers && !supportsCacheStorage) return;

  const registrations = supportsServiceWorkers
    ? await navigator.serviceWorker.getRegistrations().catch(() => [])
    : [];
  const cacheNames = supportsCacheStorage ? await caches.keys().catch(() => []) : [];
  const hadLegacyState = registrations.length > 0 || cacheNames.length > 0;

  await Promise.all(registrations.map(registration => registration.unregister()));
  await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));

  if (
    hadLegacyState &&
    navigator.serviceWorker?.controller &&
    sessionStorage.getItem(CLEANUP_RELOAD_KEY) !== 'done'
  ) {
    sessionStorage.setItem(CLEANUP_RELOAD_KEY, 'done');
    window.location.reload();
  }
}
