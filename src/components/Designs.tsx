import React from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Designs(): React.ReactElement {
  const {
    theme,
    setTheme,
    background,
    setBackground,
    availableThemes,
    availableBackgrounds
  } = useContext(ThemeContext)!;
  return (
    <div className="p-6 space-y-6 text-white">
      <div>
        <h2 className="text-lg font-semibold mb-2">Farbschema</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableThemes.map((t) => (
            <button
              key={t.name}
              onClick={() => setTheme(t)}
              className={`rounded-xl p-4 shadow-inner transition border border-white/10 hover:scale-105 duration-200 ${t.name === theme.name ? 'ring-2 ring-white' : ''}`}
              style={{ backgroundColor: t.bg }}
            >
              <span className="block font-medium text-sm text-white/90">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Hintergrund</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableBackgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setBackground(bg)}
              className={`rounded-xl overflow-hidden shadow-inner border border-white/10 transition hover:scale-105 duration-200 ${bg.id === background.id ? 'ring-2 ring-white' : ''}`}
            >
              {bg.url ? (
                <img src={bg.url} alt={bg.name} className="w-full h-24 object-cover" />
              ) : (
                <div className="w-full h-24 bg-gray-700 flex items-center justify-center text-white text-sm">
                  {bg.name}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
