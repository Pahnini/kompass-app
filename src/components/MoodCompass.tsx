import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { fetchGPTResponse } from '../services/gptService';

const directions = [
  { label: '🧠 Fokus', value: 'focus' },
  { label: '🌞 Hoffnung', value: 'hopeful' },
  { label: '😖 Überfordert', value: 'overwhelmed' },
  { label: '😴 Erschöpft', value: 'tired' },
  { label: '😡 Wütend', value: 'angry' },
  { label: '🥶 Leer', value: 'empty' },
  { label: '😰 Ängstlich', value: 'anxious' },
  { label: '🥳 Stolz', value: 'proud' },
];

interface Props {
  selected: string | null;
  onSelectMood: (value: string) => void;
}

const MoodCompass: React.FC<Props> = ({ selected, onSelectMood }) => {
  const [response, setResponse] = useState('');

  const radius = 100;

  const handleSelect = async (value: string) => {
    onSelectMood(value);
    setResponse('Lade Skill-Tipp...');
    const gpt = await fetchGPTResponse(value);
    setResponse(gpt);
    localStorage.setItem('moodToday', value);
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div
        style={{
          width: radius * 2 + 40,
          height: radius * 2 + 40,
          position: 'relative',
          background: 'radial-gradient(circle, #b7ffd0 0%, #ffffff 100%)',
          borderRadius: '50%',
          border: '4px solid #2f4f4f',
          margin: '0 auto',
        }}
      >
        {directions.map((dir, i) => {
          const angle = (i / directions.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const isActive = selected === dir.value;

          return (
            <motion.button
              key={dir.value}
              whileTap={{ scale: 1.05 }}
              animate={
                isActive
                  ? {
                      scale: [1, 1.07, 1],
                      boxShadow: [
                        '0 0 0px rgba(11, 148, 68, 0.0)',
                        '0 0 14px rgba(11, 148, 68, 0.6)',
                        '0 0 0px rgba(11, 148, 68, 0.0)',
                      ],
                    }
                  : { scale: 1, boxShadow: 'none' }
              }
              transition={
                isActive
                  ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.3 }
              }
              onClick={() => handleSelect(dir.value)}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                background: isActive ? 'linear-gradient(135deg, #2f4f4f, #0b9444)' : '#ffffff',
                color: isActive ? 'white' : '#2f4f4f',
                border: '2px solid #2f4f4f',
                borderRadius: '999px',
                padding: '0.4rem 0.8rem',
                whiteSpace: 'nowrap',
                fontSize: '1rem',
                cursor: 'pointer',
                zIndex: 2,
              }}
            >
              {dir.label}
            </motion.button>
          );
        })}
      </div>

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: '#f0fdf4',
            color: '#2f4f4f',
            border: '1px solid #0b9444',
            padding: '1rem',
            borderRadius: '0.75rem',
            maxWidth: '90%',
            margin: '1.5rem auto 0 auto',
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <strong>Skill-Tipp:</strong> {response}
        </motion.div>
      )}
    </div>
  );
};

export default MoodCompass;
