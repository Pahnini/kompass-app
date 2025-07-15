import React, { useState } from 'react';
import type { Skill } from '../types/index';
import { useTranslation } from '../hooks/useTranslation';

interface WordFilePreviewProps {
  parsedLines: string[];
  onAddSkills: (skills: Skill[]) => void;
  onCancel: () => void;
}

export default function WordFilePreview({
  parsedLines,
  onAddSkills,
  onCancel,
}: WordFilePreviewProps): React.ReactElement {
  const { t } = useTranslation();
  const [selectedLines, setSelectedLines] = useState<string[]>([]);

  const handleToggleLine = (line: string) => {
    setSelectedLines(prev =>
      prev.includes(line) ? prev.filter(l => l !== line) : [...prev, line]
    );
  };

  const handleAddSkills = () => {
    onAddSkills(selectedLines);
  };

  return (
    <div className="card">
      <h3>{t('skills.foundSkills')}</h3>
      <p>{t('skills.selectSkills')}</p>
      <ul>
        {parsedLines.map((line, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={selectedLines.includes(line)}
              onChange={() => handleToggleLine(line)}
            />
            {line}
          </li>
        ))}
      </ul>
      <button onClick={handleAddSkills} disabled={selectedLines.length === 0}>
        {t('buttons.addSelectedSkills')}
      </button>
      <button onClick={onCancel} style={{ marginLeft: '10px' }}>
        {t('buttons.cancel')}
      </button>
    </div>
  );
}
