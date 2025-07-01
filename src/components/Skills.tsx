import React, { useEffect, useState } from 'react';
import type { Skill, WordFile } from '../types';
import { showSuccessToast } from '../utils/toastUtils';
import { parseWordDocument } from '../utils/wordParser';
import BackButton from './BackButton';
import DeleteButton from './DeleteButton';
import Loading from './Loading';
import ShareButton from './ShareButton';
import WordFilePreview from './WordFilePreview';

interface SkillsProps {
  shareSkill: (skill: string) => void;
  wordFiles: WordFile[];
  setWordFiles: (files: WordFile[]) => void;
  skillsList: Skill[];
  setSkillsList: (skills: Skill[]) => void;
}

interface SkillsDoneState {
  [key: number]: boolean;
}

export default function Skills({
  shareSkill,
  wordFiles,
  setWordFiles,
  skillsList,
  setSkillsList,
}: SkillsProps): React.ReactElement {
  const [done, setDone] = useState<SkillsDoneState>(
    () => JSON.parse(localStorage.getItem('kompass_skills_done') || '{}') || {}
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [parsedLines, setParsedLines] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('kompass_skills_done', JSON.stringify(done));
  }, [done]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
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

    try {
      const lines = await parseWordDocument(file);
      setParsedLines(lines);
    } catch (error) {
      console.error('Error parsing document:', error);
      showSuccessToast('Fehler beim Parsen des Dokuments. 📄');
    } finally {
      setIsUploading(false);
    }
  }

  function handleAddSkills(newSkills: Skill[]): void {
    const updatedSkills = [...skillsList, ...newSkills];
    setSkillsList(updatedSkills);
    setParsedLines([]);

    showSuccessToast('Skills erfolgreich hinzugefügt! 🎉');
  }

  if (isUploading) {
    return <Loading message="Datei wird hochgeladen und verarbeitet..." />;
  }

  if (parsedLines.length > 0) {
    return (
      <WordFilePreview
        parsedLines={parsedLines}
        onAddSkills={handleAddSkills}
        onCancel={() => setParsedLines([])}
      />
    );
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
