import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BackButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button onClick={() => void navigate('/')} className="back-button">
      <ArrowLeft size={20} />
      {t('buttons.back')}
    </button>
  );
}
