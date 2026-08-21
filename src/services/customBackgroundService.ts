const DATABASE_NAME = 'melforia-designs';
const DATABASE_VERSION = 1;
const STORE_NAME = 'backgrounds';
const CUSTOM_BACKGROUND_KEY = 'custom-background';

export interface StoredCustomBackground {
  id: string;
  blob: Blob;
  fileName: string;
  updatedAt: string;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('Dieser Browser unterstützt keine lokale Bildspeicherung.'));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Lokale Bildspeicherung nicht verfügbar.'));
  });
}

export async function loadCustomBackground(): Promise<StoredCustomBackground | null> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(CUSTOM_BACKGROUND_KEY);

    request.onsuccess = () =>
      resolve((request.result as StoredCustomBackground | undefined) ?? null);
    request.onerror = () =>
      reject(request.error ?? new Error('Das Hintergrundbild konnte nicht geladen werden.'));
    transaction.oncomplete = () => database.close();
  });
}

export async function saveCustomBackground(blob: Blob, fileName: string): Promise<void> {
  const database = await openDatabase();
  const value: StoredCustomBackground = {
    id: CUSTOM_BACKGROUND_KEY,
    blob,
    fileName,
    updatedAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(value);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(
        transaction.error ?? new Error('Das Hintergrundbild konnte nicht gespeichert werden.')
      );
    };
  });
}

export async function deleteCustomBackground(): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(CUSTOM_BACKGROUND_KEY);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error('Das Hintergrundbild konnte nicht entfernt werden.'));
    };
  });
}
