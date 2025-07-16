import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { moodMockResponses } from '../data/moodMockResponses';
import { useTranslation } from 'react-i18next';


const getMoods = (t: (key: string) => string) => [
  { label: t('moodCompass.moods.proud'), value: 'proud', color: '#00bfa5', group: 'positive' },
  { label: t('moodCompass.moods.hopeful'), value: 'hopeful', color: '#4caf50', group: 'positive' },
  { label: t('moodCompass.moods.focus'), value: 'focus', color: '#2f4f4f', group: 'neutral' },
  { label: t('moodCompass.moods.tired'), value: 'tired', color: '#757575', group: 'neutral' },
  {
    label: t('moodCompass.moods.overwhelmed'),
    value: 'overwhelmed',
    color: '#ff7043',
    group: 'negative',
  },
  { label: t('moodCompass.moods.angry'), value: 'angry', color: '#e53935', group: 'negative' },
  { label: t('moodCompass.moods.anxious'), value: 'anxious', color: '#5c6bc0', group: 'negative' },
  { label: t('moodCompass.moods.empty'), value: 'empty', color: '#90a4ae', group: 'negative' },
];

interface Props {
  selected: string | null;
  onSelectMood: (value: string) => void;
}

const MoodCompass: React.FC<Props> = ({ selected, onSelectMood }) => {
  const [response, setResponse] = useState('');
  const { t } = useTranslation();
  const moods = getMoods(t);

  const handleClick = (moodValue: string) => {
    onSelectMood(moodValue);
    const responseKey = moodMockResponses[moodValue];
    setResponse(responseKey ? t(responseKey) : t('moodCompass.defaultResponse'));
  };

  return (
    <div
      style={{
        textAlign: 'center',
        color: '#fff',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Kompass-Icon zentriert */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        style={{
          margin: '0 auto 2rem auto',
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '3px solid #66b2ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Compass size={32} stroke="#66b2ff" />
      </motion.div>

      {/* Mood-Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1.2rem',
          marginBottom: '2rem',
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {moods.map(mood => {
          const isActive = selected === mood.value;
          return (
            <motion.button
              key={mood.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(mood.value)}
              style={{
                padding: '1rem 1.2rem',
                fontSize: '1rem',
                borderRadius: '12px',
                border: `2px solid ${isActive ? mood.color : 'rgba(255, 255, 255, 0.2)'}`,
                background: isActive ? mood.color : 'rgba(255, 255, 255, 0.1)',
                color: isActive ? '#fff' : '#fff',
                cursor: 'pointer',
                boxShadow: isActive ? `0 0 12px ${mood.color}` : '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '500',
              }}
            >
              {mood.label}
            </motion.button>
          );
        })}
      </div>

      {/* Skill-Tipp */}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: '#f0fdf4',
            color: '#2f4f4f',
            border: '1px solid #0b9444',
            padding: '1rem',
            borderRadius: '0.75rem',
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '100%',
            width: '100%',
            margin: '1.5rem 0 0 0',
            boxSizing: 'border-box',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            lineHeight: '1.5',
            textAlign: 'left',
          }}
        >
          <strong>{t('moodCompass.skillTip')}</strong> {response}
        </motion.div>
      )}
    </div>
  );
};

export default MoodCompass;
