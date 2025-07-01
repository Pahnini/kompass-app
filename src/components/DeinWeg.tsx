import React, { useEffect, useState } from 'react';
import { Emoji } from '../data/emojis';
import { Achievement, CalendarNotes, Goal, Symptoms } from '../types';
import { showErrorToast, showSuccessToast } from '../utils/toastUtils';
import BackButton from './BackButton';
import DeleteButton from './DeleteButton';
import ShareButton from './ShareButton';

interface DeinWegProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  calendarNotes: CalendarNotes;
  setCalendarNotes: (notes: CalendarNotes) => void;
  symptoms: Symptoms;
  setSymptoms: (symptoms: Symptoms) => void;
  shareAchievement: (achievement: Achievement) => void;
  showReminder?: boolean;
  emojiList: Emoji[];
  templates?: string[];
}
export default function DeinWeg({
  goals,
  setGoals,
  achievements,
  setAchievements,
  calendarNotes,
  setCalendarNotes,
  symptoms,
  setSymptoms,
  shareAchievement,
  showReminder,
  emojiList,
  templates,
}: DeinWegProps): React.ReactElement {
  const [goalInput, setGoalInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [emoji, setEmoji] = useState('');
  const [noteText, setNoteText] = useState('');
  const [symptomScore, setSymptomScore] = useState(() => {
    const dateSymptoms = symptoms[selectedDate];
    return dateSymptoms && dateSymptoms.length > 0 ? dateSymptoms[0].intensity : 0;
  });
  const [justSelectedEmoji, setJustSelectedEmoji] = useState('');

  const addGoal = () => {
    if (goalInput.trim())
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          text: goalInput,
          completed: false,
          title: '',
        },
      ]);
    setGoalInput('');
  };
  const toggleGoal = (i: number): void =>
    setGoals(goals.map((g, idx) => (idx === i ? { ...g, completed: !g.completed } : g)));
  const addAchievement = () => {
    if (achievementInput.trim())
      setAchievements([
        {
          type: 'achievement',
          id: Date.now().toString(),
          text: achievementInput,
          date: new Date().toISOString().split('T')[0],
          title: '',
        },
        ...achievements,
      ]);
    setAchievementInput('');
  };

  useEffect(() => {
    const note = calendarNotes[selectedDate] || {
      text: '',
      date: selectedDate,
    };
    setNoteText(note.text);

    const dateSymptoms = symptoms[selectedDate];
    setSymptomScore(dateSymptoms && dateSymptoms.length > 0 ? dateSymptoms[0].intensity : 0);
  }, [selectedDate, calendarNotes, symptoms]);

  const saveNote = () => {
    // Validation: Check if there's any meaningful content
    if (!noteText.trim() && symptomScore === 0) {
      showErrorToast('Bitte füge eine Notiz oder einen Symptom-Score hinzu');
      return;
    }

    // Update calendar notes
    const updatedCalendarNotes = {
      ...calendarNotes,
      [selectedDate]: { text: noteText, title: '' /* or provide a title if needed */ },
    };
    setCalendarNotes(updatedCalendarNotes);

    // Update symptoms
    const updatedSymptoms = {
      ...symptoms,
      [selectedDate]: [
        {
          title: 'Allgemein',
          intensity: symptomScore,
        },
      ],
    };
    setSymptoms(updatedSymptoms);

    showSuccessToast('Tagebucheintrag gespeichert! 📝');
  };

  // Helper function to format date in German format (DD.MM.YYYY)
  const formatDateGerman = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Get current note for display
  const currentNote = calendarNotes[selectedDate];
  const hasCurrentNote = currentNote && currentNote.text;

  return (
    <div className="card">
      <BackButton />
      <h2>Mein Kompass</h2>
      {showReminder && <div className="reminder">Ziel für heute: Was möchtest du schaffen? 🚩</div>}
      <div className="stat-banner">
        🎯 Diese Woche geschafft: <b>{goals.filter(g => g.completed).length}</b> Ziel
        {goals.filter(g => g.completed).length !== 1 && 'e'}!
      </div>
      <div className="section">
        <h3>Symptom-Tagebuch</h3>
        <label>
          Datum:
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </label>
        {/* Display existing note if available */}
        {hasCurrentNote && (
          <div
            style={{
              background: '#f0f8ff',
              padding: '10px',
              borderRadius: '8px',
              margin: '10px 0',
              border: '1px solid #d0e7ff',
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', color: '#2c5aa0' }}>
              Gespeicherter Eintrag für {formatDateGerman(selectedDate)}:
            </h4>
            {emoji && <div style={{ fontSize: '24px', marginBottom: '5px' }}>{emoji}</div>}
            {currentNote.text && (
              <div style={{ fontStyle: 'italic', color: '#555' }}>"{currentNote.text}"</div>
            )}
            {symptoms[selectedDate] && symptoms[selectedDate].length > 0 && (
              <div style={{ marginTop: '5px', color: '#666' }}>
                Symptom-Score: {symptoms[selectedDate][0].intensity}/10
              </div>
            )}
          </div>
        )}
        <label>Wie stark waren deine Symptome heute? (0=gar nicht, 10=sehr stark)</label>
        <br />
        <input
          type="range"
          min={0}
          max={10}
          value={symptomScore}
          onChange={e => setSymptomScore(Number(e.target.value))}
          style={{ width: '90%' }}
        />{' '}
        <span style={{ minWidth: 30, display: 'inline-block' }}>{symptomScore}</span>
      </div>
      {emojiList && (
        <div className="emoji-row">
          {emojiList.map(em => (
            <span
              key={em.emoji}
              className={`emoji-selector ${
                emoji === em.emoji ? 'active' : ''
              } ${justSelectedEmoji === em.emoji ? 'just-selected' : ''}`}
              onClick={() => {
                setEmoji(em.emoji);
                setJustSelectedEmoji(em.emoji);
                // Remove animation class after animation completes
                setTimeout(() => setJustSelectedEmoji(''), 300);
              }}
              title={em.label}
              aria-label={em.label}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setEmoji(em.emoji);
                  setJustSelectedEmoji(em.emoji);
                  setTimeout(() => setJustSelectedEmoji(''), 300);
                }
              }}
            >
              {em.emoji}
            </span>
          ))}
        </div>
      )}
      <textarea
        value={noteText}
        onChange={e => setNoteText(e.target.value)}
        placeholder="Wie ging es dir heute? Was war auffällig?"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={saveNote}>Speichern</button>
      </div>
      <div className="section">
        <h3>Ziele</h3>
        <div className="form-row">
          <input
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            placeholder="Neues Ziel..."
          />
          <button aria-label="Ziel hinzufügen" onClick={addGoal}>
            +
          </button>
        </div>
        <ul>
          {goals.map((g, i) => (
            <li key={i} className={g.completed ? 'done' : ''}>
              <input type="checkbox" checked={g.completed} onChange={() => toggleGoal(i)} />
              <span className="text-content">{g.text}</span>
              <div className="actions">
                <DeleteButton
                  onDelete={() => setGoals(goals.filter((_, idx) => idx !== i))}
                  ariaLabel="Ziel entfernen"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h3>Erfolge</h3>
        {templates && (
          <div className="templates">
            {templates.map((value, i) => (
              <button key={i} className="template-btn" onClick={() => setAchievementInput(value)}>
                {value}
              </button>
            ))}
          </div>
        )}
        <div className="form-row">
          <input
            value={achievementInput}
            onChange={e => setAchievementInput(e.target.value)}
            placeholder="Erfolg heute?"
          />
          <button onClick={addAchievement}>+</button>
        </div>
        <ul>
          {achievements.map((achievement, i) => (
            <li key={i}>
              <span className="text-content">
                {formatDateGerman(achievement.date)}: {achievement.text}
              </span>
              <div className="actions">
                <ShareButton
                  onClick={() => shareAchievement(achievement)}
                  ariaLabel="Erfolg teilen"
                />
                <DeleteButton
                  onDelete={() => setAchievements(achievements.filter((_, idx) => idx !== i))}
                  ariaLabel="Erfolg entfernen"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
