// Skills.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash, Pencil } from 'lucide-react';
import { parseWordDocument } from '../utils/wordParser';
import { showSuccessToast } from '../utils/toastUtils';
import { useUserData } from '../context/UserDataContext';
import BackButton from './BackButton';
import Loading from './Loading';
import WordFilePreview from './WordFilePreview';
import type { Skill, WordFile } from '../types/index';

export default function Skills(): React.ReactElement {
  const { t } = useTranslation();
  const { skillsList, setSkillsList, wordFiles, setWordFiles } = useUserData();
  const [doneMap, setDoneMap] = useState<{ [key: number]: boolean }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [parsedLines, setParsedLines] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('kompass_skills_done');
    if (saved) setDoneMap(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('kompass_skills_done', JSON.stringify(doneMap));
  }, [doneMap]);

  const toggleDone = (index: number) => {
    setDoneMap(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDelete = (index: number) => {
    const updated = [...skillsList];
    updated.splice(index, 1);
    setSkillsList(updated);

    const updatedDone: { [key: number]: boolean } = {};
    Object.entries(doneMap).forEach(([key, val]) => {
      const idx = parseInt(key);
      if (idx < index) updatedDone[idx] = val;
      if (idx > index) updatedDone[idx - 1] = val;
    });
    setDoneMap(updatedDone);
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    setSkillsList([...skillsList, { text: trimmed, done: false } as unknown as Skill]);
    setNewSkill('');
    inputRef.current?.focus();
    showSuccessToast(t('success.skillAdded').replace('{skill}', trimmed));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.match(/\.(doc|docx)$/)) {
      showSuccessToast(t('errors.wordFileRequired'));
      return;
    }

    setIsUploading(true);
    try {
      const lines = await parseWordDocument(file);
      setParsedLines(lines);
    } catch (err) {
      console.error(err);
      showSuccessToast(t('errors.documentParsingError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSkillsFromDoc = (newSkills: Skill[]) => {
    setSkillsList([...skillsList, ...newSkills]);
    setParsedLines([]);
    showSuccessToast(t('success.skillsAdded'));
  };

  if (isUploading) return <Loading message={t('loading.fileUploading')} />;
  if (parsedLines.length > 0) {
    return (
      <WordFilePreview
        parsedLines={parsedLines}
        onAddSkills={handleAddSkillsFromDoc}
        onCancel={() => setParsedLines([])}
      />
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto text-white">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">{t('skills.title')}</h1>

      <ul className="space-y-2 mb-6">
        {skillsList.map((skill, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-white/10 border border-white/10 p-3 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={doneMap[i] || false}
                onChange={() => toggleDone(i)}
                className="accent-emerald-500 w-5 h-5"
              />
              <span
                className={`text-sm ${doneMap[i] ? 'line-through text-white/50' : ''
                  }`}
              >
                {skill.text}
              </span>
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="text-white/70 hover:text-red-500 transition"
              aria-label="Löschen"
            >
              <Trash size={16} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mb-6">
        <label className="block font-semibold mb-1">{t('skills.addNewSkill')}</label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
            placeholder={t('skills.new.placeholder')}
            className="flex-1 rounded-lg px-3 py-2 text-black"
          />
          <button
            onClick={handleAddSkill}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
            aria-label={t('ariaLabels.addSkill')}
          >
            ➕
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold">{t('skills.uploadPersonalSkills')}</h3>
        <input
          type="file"
          accept=".doc,.docx,application/msword"
          onChange={handleFile}
          className="mt-2 text-sm text-white"
        />
      </div>

      {wordFiles.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {wordFiles.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-white/10 border border-white/10 p-3 rounded-xl"
              >
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline text-sm"
                >
                  📄 {file.name}
                </a>
                <button
                  onClick={() =>
                    setWordFiles(wordFiles.filter((_, idx) => idx !== i))
                  }
                  aria-label={t('ariaLabels.deleteFile')}
                  className="text-white/70 hover:text-red-500 transition"
                >
                  <Trash size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
