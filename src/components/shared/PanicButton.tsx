import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './PanicButton.css';

export default function PanicButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => void navigate('/notfall')}
      aria-label={t('panic.buttonLabel')}
      className="melforia-help-fab"
    >
      <AlertTriangle className="w-6 h-6" />
      <span>Hilfe</span>
    </button>
  );
}
