if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      .then(registration => registration.update())
      .catch(() => {
        // Die App funktioniert auch ohne Service Worker weiter.
      });
  });
}
