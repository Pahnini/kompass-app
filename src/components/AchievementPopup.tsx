import React, { useEffect } from 'react';

interface AchievementPopupProps {
  label: string;
  onClose: () => void;
}

export default function AchievementPopup({
  label,
  onClose,
}: AchievementPopupProps): React.ReactElement {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#2f4f4f',
        color: '#fff',
        padding: '14px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        fontSize: '16px',
        zIndex: 9999,
        animation: 'fadeInOut 4s ease-in-out',
      }}
    >
      🎉 Neues Achievement: {label}
    </div>
  );
}
