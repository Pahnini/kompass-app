import React, { useState } from 'react';
import type { Skill } from 'src/types/index';

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
      <h3>Gefundene Skills aus dem Dokument</h3>
      <p>Wähle die Skills aus, die du hinzufügen möchtest:</p>
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
        Ausgewählte Skills hinzufügen
      </button>
      <button onClick={onCancel} style={{ marginLeft: '10px' }}>
        Abbrechen
      </button>
    </div>
  );
}
