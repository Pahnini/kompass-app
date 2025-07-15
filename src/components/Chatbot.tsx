import React from 'react';
import BackButton from './BackButton';
import { useTranslation } from '../hooks/useTranslation';

export default function Chatbot(): React.ReactElement {
  const { t } = useTranslation();

  return (
    <div className="card info-card">
      <BackButton />
      <h2>{t('chatbot.title')}</h2>
      <p>
        {t('chatbot.description')}
        <br />
        {t('chatbot.demoExplanation')}
      </p>
      <p>
        <i>{t('chatbot.crisisNote')}</i>
      </p>
    </div>
  );
}
