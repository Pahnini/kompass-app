import React from 'react';

import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import BackButton from './BackButton';

export default function Designs(): React.ReactElement {
  const { t: translate } = useTranslation();
  const {
    theme: currentTheme,
    setTheme,
    background,
    setBackground,
    availableThemes,
    availableBackgrounds,
  } = useTheme();

  return (
    <div className="card">
      <BackButton />
      <h2>{translate('designs.title')}</h2>

      <div className="theme-selector">
        <label>{translate('designs.chooseTheme')}</label>
        <div className="theme-options">
          {availableThemes.map(theme => (
            <button
              key={theme.name}
              onClick={() => setTheme(theme)}
              style={{
                backgroundColor: theme.bg,
                fontFamily: theme.font,
                color: theme.dark ? '#fff' : '#000',
                border:
                  currentTheme.name === theme.name ? `3px solid ${theme.accent}` : '1px solid #ccc',
              }}
            >
              {translate(`designs.themes.${theme.name.toLowerCase().replace(/[^a-z]/g, '')}`) ||
                theme.name}
            </button>
          ))}
        </div>
      </div>

      <div className="background-selector">
        <label>{translate('designs.chooseBackground')}</label>
        <div className="background-options">
          {availableBackgrounds.map(bg => (
            <button
              key={bg.id}
              className={`bg-button ${background.id === bg.id ? 'active' : ''}`}
              onClick={() => setBackground(bg)}
              style={{ backgroundColor: bg.color, color: '#000' }} //171, 235, 198)
            >
              {translate(`designs.backgrounds.${bg.id}`) || bg.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
