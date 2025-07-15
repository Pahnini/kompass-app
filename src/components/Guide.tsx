import React from 'react';
import BackButton from './BackButton';
import { useTranslation } from '../hooks/useTranslation';

export default function Guide(): React.ReactElement {
  const { t } = useTranslation();

  return (
    <div className="card">
      <BackButton />
      <h2>
        {t('guide.title')}{' '}
        <span role="img" aria-label="Kompass">
          🧭
        </span>
      </h2>
      <ul>
        <li>
          <span style={{ marginRight: 4 }}>🔍</span>
          <div>
            <b>{t('guide.onlineSearch')}</b>
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <a
                href="https://www.therapie.de/psychotherapie/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#abebc6', display: 'block' }}
              >
                → therapie.de
              </a>
              <a
                href="https://www.kbv.de/html/arztsuche.php"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#abebc6', display: 'block' }}
              >
                → KBV-Arztsuche
              </a>
            </div>
          </div>
        </li>
        <li>
          <span style={{ marginRight: 4 }}>📞</span>
          {t('guide.insuranceMethod')}
        </li>
        <li>
          <span style={{ marginRight: 4 }}>👩‍⚕️</span>
          {t('guide.directCallMethod')}
        </li>
        <li>
          <span style={{ color: '#cc3366', marginRight: 4 }}>🏥</span>
          {t('guide.clinicSocialService')}
        </li>
        <li>
          <span style={{ marginRight: 4 }}>🚨</span>
          {t('guide.emergencyServices')}
        </li>
      </ul>
      <p style={{ marginTop: 18, color: '#888' }}>
        {t('guide.trustPersonNote')}{' '}
        <span role="img" aria-label="Notruf">
          🚨
        </span>
        .
      </p>
    </div>
  );
}
