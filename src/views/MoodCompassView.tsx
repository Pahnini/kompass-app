import React, { useState } from 'react';
import MoodCompass from '../components/MoodCompass';

const MoodCompassView: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧭 Dein Stimmungs-Kompass</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1rem', maxWidth: '600px' }}>
        Wie fühlst du dich heute? Wähle eine Richtung.
      </p>

      {/* Zentrierender Wrapper */}
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          padding: '0 1rem',
          boxSizing: 'border-box',
        }}
      >
        <MoodCompass
          selected={selectedMood}
          onSelectMood={handleMoodSelect}
        />
      </div>
    </div>
  );
};

export default MoodCompassView;
