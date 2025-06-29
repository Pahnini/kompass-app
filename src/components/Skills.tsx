import React, { useEffect, useState } from 'react';
import type { Skill, WordFile } from '../types';
import { showSuccessToast } from '../utils/toastUtils';
import BackButton from './BackButton';
import DeleteButton from './DeleteButton';
import Loading from './Loading';
import ShareButton from './ShareButton';

interface SkillsProps {
  shareSkill: (skill: string) => void;
  wordFiles: WordFile[];
  setWordFiles: (files: WordFile[]) => void;
  skillsList: Skill[];
}

interface SkillsDoneState {
  [key: number]: boolean;
}

export default function Skills({
  shareSkill,
  wordFiles,
  setWordFiles,
  skillsList,
}: SkillsProps): React.ReactElement {
  const [done, setDone] = useState<SkillsDoneState>(
    () => JSON.parse(localStorage.getItem('kompass_skills_done') || '{}') || {}
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('kompass_skills_done', JSON.stringify(done));
  }, [done]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>): void {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    setIsUploading(true);
    if (!file.name.match(/\.(doc|docx)$/)) {
      showSuccessToast('Bitte eine Word-Datei hochladen! 📄');
      setIsUploading(false);
      return;
    }
    setWordFiles([
      ...wordFiles,
      {
        id: crypto.randomUUID(), // oder Date.now().toString()
        name: file.name,
        file: file,
        url: URL.createObjectURL(file),
      },
    ]);
    setIsUploading(false);
    showSuccessToast('Datei erfolgreich hochgeladen! 📄');
  }
  if (isUploading) {
    return <Loading message="Datei wird hochgeladen..." />;
  }

  return (
    <div className="card">
      <BackButton />

      <h2>Skills & Achtsamkeit</h2>
      <ul>
        {skillsList.map((skill, i) => (
          <li key={i} className={done[i] ? 'done' : ''}>
            <input
              type="checkbox"
              checked={done[i] || false}
              onChange={() => setDone(prev => ({ ...prev, [i]: !prev[i] }))}
            />
            <span className="text-content">{skill}</span>
            <div className="actions">
              <ShareButton onClick={() => shareSkill(skill)} ariaLabel="Skill teilen" />
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 14 }}>
        <label>
          Persönliche Skills/Pläne als Word-Dokument hochladen:
          <input
            type="file"
            accept=".doc,.docx,application/msword"
            onChange={handleFile}
            style={{ display: 'block', marginTop: 7 }}
          />
        </label>
        <ul>
          {wordFiles.map((f, i) => (
            <li key={i}>
              <span className="text-content">
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#5dade2', textDecoration: 'none' }}
                >
                  📄 {f.name}
                </a>
              </span>
              <div className="actions">
                <DeleteButton
                  onDelete={() => setWordFiles(wordFiles.filter((_, idx) => idx !== i))}
                  ariaLabel="Datei löschen"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
