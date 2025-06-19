import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";

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
  const [erfolgInput, setErfolgInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [emoji, setEmoji] = useState("");
  const [noteText, setNoteText] = useState("");
  const [symptomScore, setSymptomScore] = useState(
    () => symptome[selectedDate] || 0
  );
  const [saveMsg, setSaveMsg] = useState("");

  const addGoal = () => {
    if (goalInput.trim())
      setGoals([...goals, { text: goalInput, done: false }]);
    setGoalInput("");
  };
  const toggleGoal = (i) =>
    setGoals(goals.map((g, idx) => (idx === i ? { ...g, done: !g.done } : g)));
  const addErfolg = () => {
    if (erfolgInput.trim())
      setAchievements([
        { text: erfolgInput, date: new Date().toISOString().split("T")[0] },
        ...achievements,
      ]);
    setErfolgInput("");
  };

  useEffect(() => {
    const note = calendarNotes[selectedDate] || { emoji: "", text: "" };
    setEmoji(note.emoji);
    setNoteText(note.text);
    setSymptomScore(symptome[selectedDate] || 0);
  }, [selectedDate, calendarNotes, symptome]);
  const saveNote = () => {
    setSaveMsg("Gespeichert!");
    setTimeout(() => setSaveMsg(""), 1200);
    const u = { ...calendarNotes, [selectedDate]: { emoji, text: noteText } };
    setCalendarNotes(u);
    localStorage.setItem("kompass_calendar_notes", JSON.stringify(u));
    const us = { ...symptome, [selectedDate]: symptomScore };
    setSymptome(us);
    localStorage.setItem("kompass_symptome", JSON.stringify(us));
  };
  return (
    <div className="card">
     <button className="back-btn-icon" onClick={onBack} aria-label="Zurück">
  ⬅️ Zurück
</button>
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
        {saveMsg && (
          <span style={{ color: "#0b9444", fontWeight: 600 }}>{saveMsg}</span>
        )}
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
              />{" "}
              {g.text}
              <button
                style={{
                  marginLeft: 8,
                  background: "#ffdddd",
                  color: "#bb2222",
                  border: "none",
                  borderRadius: "6px",
                  padding: "2px 8px",
                }}
                onClick={() => setGoals(goals.filter((_, idx) => idx !== i))}
                aria-label="Ziel entfernen"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h3>
          Erfolge <span style={{ fontSize: "80%" }}>(teilen möglich)</span>
        </h3>
        <div className="templates">
          {vorlagen.map((v, i) => (
            <button
              key={i}
              className="template-btn"
              onClick={() => setErfolgInput(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="form-row">
          <input
            value={erfolgInput}
            onChange={(e) => setErfolgInput(e.target.value)}
            placeholder="Erfolg heute?"
          />
          <button onClick={addErfolg}>+</button>
        </div>
        <ul>
          {achievements.map((a, i) => (
            <li key={i}>
              {a.date}: {a.text}{" "}
              <button className="share-btn" onClick={() => shareErfolg(a)}>
                Teilen
              </button>
              <button
                style={{
                  marginLeft: 8,
                  background: "#ffdddd",
                  color: "#bb2222",
                  border: "none",
                  borderRadius: "6px",
                  padding: "2px 8px",
                }}
                onClick={() =>
                  setAchievements(achievements.filter((_, idx) => idx !== i))
                }
                aria-label="Erfolg entfernen"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
