import React from "react";
import { BackgroundOptions } from "../data/backgrounds";
import { Theme } from "../data/themes";
import BackButton from "./BackButton";

interface DesignsProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  background: BackgroundOptions;
  setBackground: (background: BackgroundOptions) => void;
  themes: Theme[];
  backgrounds: BackgroundOptions[];
}

export default function Designs({
  theme,
  setTheme,
  background,
  setBackground,
  themes,
  backgrounds,
}: DesignsProps): React.ReactElement {
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
