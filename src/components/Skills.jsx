import { useEffect, useState } from "react";
import { showSuccessToast } from "../utils/toastUtils";

export default function Skills({
  shareSkill,
  wordFiles,
  setWordFiles,
  skillsList,
  onBack,
}) {
  const [done, setDone] = useState(
    () => JSON.parse(localStorage.getItem("kompass_skills_done")) || {}
  );
  useEffect(() => {
    localStorage.setItem("kompass_skills_done", JSON.stringify(done));
  }, [done]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setWordFiles([
      ...wordFiles,
      { name: file.name, url: URL.createObjectURL(file) },
    ]);
    showSuccessToast("Datei erfolgreich hochgeladen! 📄");
  }
  return (
    <div className="card">
      <button className="back-btn-icon" onClick={onBack} aria-label="Zurück">
  ⬅️ Zurück
</button>
      <h2>Skills & Achtsamkeit</h2>
      <ul>
        {skillsList.map((s, i) => (
          <li
            key={i}
            className={done[i] ? "done" : ""}
            onClick={() => setDone((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {s}{" "}
            <button className="share-btn" onClick={() => shareSkill(s)}>
              Teilen
            </button>
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
            style={{ display: "block", marginTop: 7 }}
          />
        </label>
        <ul>
          {wordFiles.map((f, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center" }}>
              <a href={f.url} target="_blank" rel="noopener noreferrer">
                {f.name}
              </a>
              <button
                style={{
                  background: "#ffeded",
                  color: "#c22",
                  marginLeft: 6,
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  cursor: "pointer",
                }}
                aria-label="Datei löschen"
                onClick={() => {
                  setWordFiles(wordFiles.filter((_, idx) => idx !== i));
                  // Hier kann ein Feedback (Toast) angezeigt werden, siehe unten
                }}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
