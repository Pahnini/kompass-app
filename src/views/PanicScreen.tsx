import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PanicScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [phase, setPhase] = useState<'ein' | 'aus'>('ein');

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p === 'ein' ? 'aus' : 'ein'));

      if (navigator.vibrate) {
        navigator.vibrate(phase === 'ein' ? [500] : [300]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [phase]);

  const color = phase === 'ein' ? '#58d68d' : '#5dade2';
  const text = phase === 'ein' ? t('panic.breatheIn') : t('panic.breatheOut');

  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-center px-6"
      style={{ backgroundColor: '#1c1c1c', color: '#fff' }}
    >
      <div
        className="rounded-full transition-all duration-1000 ease-in-out"
        style={{
          width: phase === 'ein' ? 240 : 140,
          height: phase === 'ein' ? 240 : 140,
          backgroundColor: color,
          marginBottom: '32px',
        }}
      />

      <h1 className="text-2xl font-semibold mb-2">{text}</h1>
      <p className="text-sm text-gray-300 mb-8">{t('panic.focus')}</p>

      <button
        onClick={() => void navigate('/')}
        className="bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-200 transition"
      >
        {t('panic.feelBetter')}
      </button>
    </div>
  );
}
