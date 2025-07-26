import { useInstallPrompt } from '../hooks/useInstallPrompt';

export default function InstallPromptBanner() {
  const { deferredPrompt, promptInstall } = useInstallPrompt();

  if (!deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3">
      <span>📲 Kompass-App installieren?</span>
      <button
        onClick={() => void promptInstall()}
        className="bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-gray-100 transition"
      >
        Installieren
      </button>
    </div>
  );
}
