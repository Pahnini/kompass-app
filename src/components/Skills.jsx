import { useEffect, useState } from "react";
import { showSuccessToast } from "../utils/toastUtils";
import BackButton from "./BackButton";
import DeleteButton from "./DeleteButton";
import ShareButton from "./ShareButton";

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
      <BackButton onClick={onBack} />

      <h2>Skills & Achtsamkeit</h2>
      <ul>
        {skillsList.map((skill, i) => (
          <li key={i} className={done[i] ? "done" : ""}>
            <input
              type="checkbox"
              checked={done[i] || false}
              onChange={() => setDone((prev) => ({ ...prev, [i]: !prev[i] }))}
            />
            <span className="text-content">{skill}</span>
            <div className="actions">
              <ShareButton onClick={() => shareSkill(skill)} />
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
            style={{ display: "block", marginTop: 7 }}
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
                  style={{ color: "#5dade2", textDecoration: "none" }}
                >
                  📄 {f.name}
                </a>
              </span>
              <div className="actions">
                <DeleteButton
                  onDelete={() =>
                    setWordFiles(wordFiles.filter((_, idx) => idx !== i))
                  }
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
