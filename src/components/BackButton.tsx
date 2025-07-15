import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

export default function BackButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button onClick={() => navigate('/')} className="back-button">
      <ArrowLeft size={20} />
      {t('buttons.back')}
    </button>
  );
}
