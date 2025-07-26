import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PanicButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => void navigate('/panic')}
      aria-label={t('panic.buttonLabel')}
      className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition"
    >
      <AlertTriangle className="w-6 h-6" />
    </button>
  );
}
