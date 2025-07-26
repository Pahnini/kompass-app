// components/FailsafeWrapper.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const FailsafeWrapper = ({ children }: Props) => {
  const [confirmed, setConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (confirmed) return <>{children}</>;

  return (
    <div className="card notfall-card text-center space-y-4">
      <h2 className="text-red-500 font-bold text-lg">Bist du sicher?</h2>
      <p>Hast du schon Skills ausprobiert oder mit jemandem gesprochen?</p>
      <button onClick={() => void navigate('/skills')} className="btn-secondary w-full">
        👉 Zu den Skills
      </button>
      <button onClick={() => void navigate('/panic')} className="btn w-full">
        🧘 Beruhigung starten
      </button>
      <button
        disabled={countdown > 0}
        onClick={() => setConfirmed(true)}
        className="btn-danger w-full"
      >
        {countdown > 0 ? `Noch ${countdown}s…` : '🚨 Trotzdem Notfall öffnen'}
      </button>
    </div>
  );
};

export default FailsafeWrapper;
