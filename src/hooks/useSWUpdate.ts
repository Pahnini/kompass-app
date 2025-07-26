import { useEffect, useState } from 'react';

export function useSWUpdate() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      void navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setNewVersionAvailable(true);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setNewVersionAvailable(true);
              }
            });
          }
        });
      });
    }
    // ✅ Debug-Modus (nur im Dev-Modus)
    // if (import.meta.env.DEV) {
    //   setTimeout(() => setNewVersionAvailable(true), 5000); // nach 5 Sekunden simulieren
    // }
  }, []);

  const update = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    if (import.meta.env.DEV) window.location.reload();
  };

  return { newVersionAvailable, update };
}
