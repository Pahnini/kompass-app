import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface OnboardingModalProps {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: OnboardingModalProps): React.ReactElement {
  const { t } = useTranslation();
  
  return (
    <div className="ds-modal">
      <div className="ds-box" style={{ maxWidth: 500, textAlign: 'left' }}>
        <h2>{t('onboarding.title')}</h2>
        <ul style={{ lineHeight: 1.6 }}>
          <li>
            <b>{t('onboarding.features.compass.title')}</b> {t('onboarding.features.compass.description')}
          </li>
          <li>
            <b>{t('onboarding.features.skills.title')}</b> {t('onboarding.features.skills.description')}
          </li>
          <li>
            <b>{t('onboarding.features.designs.title')}</b> {t('onboarding.features.designs.description')}
          </li>
          <li>
            <b>{t('onboarding.features.emergency.title')}</b> {t('onboarding.features.emergency.description')}
          </li>
          <li>
            <b>{t('onboarding.features.guide.title')}</b> {t('onboarding.features.guide.description')}
          </li>
          <li>
            <b>{t('onboarding.features.chatbot.title')}</b> {t('onboarding.features.chatbot.description')}
          </li>
          <li>
            {t('onboarding.sidebarExplanation')}
          </li>
        </ul>
        <button onClick={onClose}>{t('buttons.ok')}</button>
      </div>
    </div>
  );
}
