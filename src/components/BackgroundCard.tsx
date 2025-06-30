// src/components/BackgroundCard.tsx

import React from 'react';
import type { BackgroundOptions } from '../data/backgrounds';

interface BackgroundCardProps {
  background: BackgroundOptions;
  isActive: boolean;
  onSelect: () => void;
}

export default function BackgroundCard({
  background,
  isActive,
  onSelect,
}: BackgroundCardProps): React.ReactElement {
  return (
    <button
      onClick={onSelect}
      className={`background-card ${isActive ? 'active' : ''}`}
      style={{
        border: isActive ? '3px solid #2f4f4f' : '1px solid #ccc',
        padding: 0,
        borderRadius: '10px',
        overflow: 'hidden',
        width: '160px',
        height: '90px',
        backgroundImage: `url(${background.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          position: 'absolute',
          bottom: 4,
          left: 6,
          right: 6,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          fontSize: '0.8rem',
          padding: '2px 6px',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        {background.name}
      </span>
    </button>
  );
}
