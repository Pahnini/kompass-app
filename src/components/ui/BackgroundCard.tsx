// src/components/BackgroundCard.tsx

import React from 'react';
import { getBackgroundCss, type BackgroundOptions } from '../../data/backgrounds';

interface BackgroundCardProps {
  background: BackgroundOptions;
  isActive: boolean;
  onSelect: () => void;
  fallbackColor: string;
}

export default function BackgroundCard({
  background,
  isActive,
  onSelect,
  fallbackColor,
}: BackgroundCardProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`melforia-background-card ${isActive ? 'is-active' : ''}`}
      aria-pressed={isActive}
      aria-label={`${background.label}${isActive ? ', ausgewählt' : ''}`}
      style={{
        backgroundImage: getBackgroundCss(background, fallbackColor),
        backgroundColor: fallbackColor,
      }}
    >
      <span className="melforia-background-card__label">{background.label}</span>
      {isActive && <span className="melforia-background-card__check">✓</span>}
    </button>
  );
}
