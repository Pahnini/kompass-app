import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './PanicButton.css';

export default function PanicButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => void navigate('/panic')}
      aria-label={t('panic.buttonLabel')}
      title={t('panic.buttonLabel')}
      className="melforia-help-fab"
    >
      <span aria-hidden="true">!</span>
    </button>
  );
}
