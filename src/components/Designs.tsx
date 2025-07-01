import React from 'react';

import useTheme from 'src/hooks/useTheme';
import BackButton from './BackButton';

export default function Designs(): React.ReactElement {
  const { theme, setTheme, background, setBackground, availableThemes, availableBackgrounds } =
    useTheme();

  return (
    <div className="card">
      <BackButton />
      <h2>Designs</h2>

      <div className="theme-selector">
        <label>🎨 Theme wählen:</label>
        <div className="theme-options">
          {availableThemes.map(t => (
            <button
              key={t.name}
              onClick={() => setTheme(t)}
              style={{
                backgroundColor: t.bg,
                fontFamily: t.font,
                color: t.dark ? '#fff' : '#000',
                border: theme.name === t.name ? `3px solid ${t.accent}` : '1px solid #ccc',
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="background-selector">
        <label>🖼️ Hintergrund wählen:</label>
        <div className="background-options">
          {availableBackgrounds.map(bg => (
            <button
              key={bg.id}
              className={`bg-button ${background.id === bg.id ? 'active' : ''}`}
              onClick={() => setBackground(bg)}
              style={{ backgroundColor: bg.color, color: '#000' }} //171, 235, 198)
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
