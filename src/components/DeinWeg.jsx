import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import BackButton from "./BackButton";
import DeleteButton from "./DeleteButton";
import ShareButton from "./ShareButton";

export default function DeinWeg({
  goals,
  setGoals,
  achievements,
  setAchievements,
  calendarNotes,
  setCalendarNotes,
  symptome,
  setSymptome,
  shareErfolg,
  showReminder,
  emojiList,
  vorlagen,
  onBack,
}) {
  const [goalInput, setGoalInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [emoji, setEmoji] = useState("");
  const [noteText, setNoteText] = useState("");
  const [symptomScore, setSymptomScore] = useState(
    () => symptoms[selectedDate] || 0
  );
  const [justSelectedEmoji, setJustSelectedEmoji] = useState("");

  const addGoal = () => {
    if (goalInput.trim())
      setGoals([...goals, { text: goalInput, done: false }]);
    setGoalInput("");
  };
  const toggleGoal = (i) =>
    setGoals(goals.map((g, idx) => (idx === i ? { ...g, done: !g.done } : g)));
  const addAchievement = () => {
    if (achievementInput.trim())
      setAchievements([
        { text: erfolgInput, date: new Date().toISOString().split("T")[0] },
        ...achievements,
      ]);
    setAchievementInput("");
  };

  useEffect(() => {
    const note = calendarNotes[selectedDate] || { emoji: "", text: "" };
    setEmoji(note.emoji);
    setNoteText(note.text);
    setSymptomScore(symptoms[selectedDate] || 0);
  }, [selectedDate, calendarNotes, symptoms]);
  const saveNote = () => {
    setSaveMsg("Gespeichert!");
    setTimeout(() => setSaveMsg(""), 1200);
    const u = { ...calendarNotes, [selectedDate]: { emoji, text: noteText } };
    setCalendarNotes(u);
    localStorage.setItem("kompass_calendar_notes", JSON.stringify(u));
    const us = { ...symptoms, [selectedDate]: symptomScore };
    setSymptoms(us);
    localStorage.setItem("kompass_symptome", JSON.stringify(us));
  };
  return (
    <div className="card">
      <BackButton />
      <h2>Mein Kompass</h2>
      {showReminder && (
        <div className="reminder">
          Ziel für heute: Was möchtest du schaffen? 🚩
        </div>
      )}
      <div className="stat-banner">
        🎯 Diese Woche geschafft: <b>{goals.filter((g) => g.done).length}</b>{" "}
        Ziel{goals.filter((g) => g.done).length !== 1 && "e"}!
      </div>
      <div className="section">
        <h3>Symptom-Tagebuch</h3>
        <label>
          Datum:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <div style={{ margin: "10px 0", color: "#0b9444" }}>
          Diese Woche geschafft: {goals.filter((g) => g.done).length} Ziele
        </div>
        <label>
          Wie stark waren deine Symptome heute? (0=gar nicht, 10=sehr stark)
        </label>
        <br />
        <input
          type="range"
          min={0}
          max={10}
          value={symptomScore}
          onChange={(e) => setSymptomScore(Number(e.target.value))}
          style={{ width: "90%" }}
        />{" "}
        <span style={{ minWidth: 30, display: "inline-block" }}>
          {symptomScore}
        </span>
      </div>
      <div className="emoji-row">
        {emojiList.map((em) => (
          <span
            key={em.emoji}
            className={emoji === em.emoji ? "active" : ""}
            onClick={() => setEmoji(em.emoji)}
            title={em.label}
            aria-label={em.label}
          >
            {em.emoji}
          </span>
        ))}
      </div>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Wie ging es dir heute? Was war auffällig?"
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={saveNote}>Speichern</button>
      </div>
      <div className="section">
        <h3>Ziele</h3>
        <div className="form-row">
          <input
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="Neues Ziel..."
          />
          <button aria-label="Ziel hinzufügen" onClick={addGoal}>
            +
          </button>
        </div>
        <ul>
          {goals.map((g, i) => (
            <li key={i} className={g.done ? "done" : ""}>
              <input
                type="checkbox"
                checked={g.done}
                onChange={() => toggleGoal(i)}
              />
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
        <div className="templates">
          {vorlagen.map((v, i) => (
            <button
              key={i}
              className="template-btn"
              onClick={() => setErfolgInput(v)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="form-row">
          <input
            value={achievementInput}
            onChange={(e) => setAchievementInput(e.target.value)}
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
                <ShareButton onClick={() => shareAchievement(achievement)} />
                <DeleteButton
                  onDelete={() =>
                    setAchievements(achievements.filter((_, idx) => idx !== i))
                  }
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
