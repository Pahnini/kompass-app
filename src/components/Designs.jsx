import BackButton from "./BackButton";

export default function Designs({
  theme,
  setTheme,
  background,
  setBackground,
  themes,
  backgrounds,
}) {
  return (
    <div className="card">
      <BackButton />
      <h2>Designs</h2>
      <div className="section">
        <h3>Farbschema</h3>
        <div className="theme-options">
          {themes.map((t, i) => (
            <button
              key={i}
              className={theme.name === t.name ? "selected" : ""}
              onClick={() => setTheme(t)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Hintergrundbild</h3>
        <div className="background-options">
          {backgrounds.map((bg, i) => (
            <button
              key={i}
              className={background.name === bg.name ? "selected" : ""}
              onClick={() => setBackground(bg)}
            >
              {bg.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
