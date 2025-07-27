// src/components/ThemeCard.tsx

import React from 'react';
import type { Theme } from '../../data/themes';

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  onSelect: () => void;
}

export default function ThemeCard({
  theme,
  isActive,
  onSelect,
}: ThemeCardProps): React.ReactElement {
  return (
    <button
      onClick={onSelect}
      className={`theme-card ${isActive ? 'active' : ''}`}
      style={{
        border: isActive ? `3px solid ${theme.primary}` : '1px solid #ccc',
        background: theme.background,
        color: theme.text,
        padding: '1rem',
        borderRadius: '12px',
        width: '180px',
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: isActive ? '0 0 8px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <h4 style={{ margin: 0 }}>{theme.name}</h4>
      <div style={{ marginTop: '0.5rem' }}>
        <div
          style={{
            backgroundColor: theme.primary,
            height: '20px',
            borderRadius: '4px',
            marginBottom: '4px',
          }}
        />
        <div
          style={{
            backgroundColor: theme.secondary,
            height: '20px',
            borderRadius: '4px',
          }}
        />
      </div>
    </button>
  );
}
