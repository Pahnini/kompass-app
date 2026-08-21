import { ImagePlus, Palette, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import BackButton from '../components/ui/BackButton';
import BackgroundCard from '../components/ui/BackgroundCard';
import { APP_NAME } from '../config/brand';
import type { ThemeName } from '../data/themes';
import { useTheme } from '../hooks/useTheme';
import { prepareBackgroundImage } from '../utils/backgroundImage';
import './DesignsPage.css';

const themeDetails: Record<ThemeName, { label: string; description: string }> = {
  'Modern Blue-Grey': {
    label: 'Melforia Tiefsee',
    description: 'Ruhiges Nachtblau mit einem sanften Kompass-Leuchten.',
  },
  Gruen: {
    label: 'Waldlicht',
    description: 'Frisches Grün mit klaren Kontrasten.',
  },
  Classic: {
    label: 'Leicht & hell',
    description: 'Helles, zurückhaltendes Design.',
  },
  Night: {
    label: 'Nachtmodus',
    description: 'Dunkle Farben für weniger Helligkeit.',
  },
};

export default function Designs(): React.ReactElement {
  const {
    theme: currentTheme,
    setTheme,
    background,
    setBackground,
    customBackground,
    setCustomBackground,
    removeCustomBackground,
    availableThemes,
    availableBackgrounds,
  } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    setIsProcessing(true);
    setFeedback(null);

    try {
      const preparedImage = await prepareBackgroundImage(file);
      await setCustomBackground(preparedImage, file.name);
      setFeedback({
        type: 'success',
        text: 'Dein Foto ist jetzt als Hintergrund ausgewählt und bleibt auf diesem Gerät.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Das Foto konnte nicht gespeichert werden.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePhoto = async () => {
    setFeedback(null);
    try {
      await removeCustomBackground();
      setFeedback({ type: 'success', text: 'Das persönliche Hintergrundbild wurde entfernt.' });
    } catch {
      setFeedback({ type: 'error', text: 'Das Hintergrundbild konnte nicht entfernt werden.' });
    }
  };

  return (
    <div
      className={`melforia-design-page ${currentTheme.dark ? 'is-dark' : ''}`}
      style={{ color: currentTheme.dark ? '#f6fffb' : '#183b3b' }}
    >
      <BackButton />

      <header className="melforia-design-hero">
        <span className="melforia-design-hero__icon" aria-hidden="true">
          <Palette size={24} />
        </span>
        <div>
          <p className="melforia-design-eyebrow">{APP_NAME} gestalten</p>
          <h1>Mach die App zu deinem Ort</h1>
          <p>Wähle eine Farbwelt und einen Hintergrund, der sich für dich angenehm anfühlt.</p>
        </div>
      </header>

      <section className="melforia-design-section" aria-labelledby="theme-heading">
        <div className="melforia-design-section__heading">
          <div>
            <p className="melforia-design-step">1 · Farbwelt</p>
            <h2 id="theme-heading">Design auswählen</h2>
          </div>
          <span>{themeDetails[currentTheme.name].label} ist aktiv</span>
        </div>

        <div className="melforia-theme-grid">
          {availableThemes.map(theme => {
            const details = themeDetails[theme.name];
            const isActive = currentTheme.name === theme.name;
            return (
              <button
                key={theme.name}
                type="button"
                className={`melforia-theme-card ${isActive ? 'is-active' : ''}`}
                onClick={() => setTheme(theme)}
                aria-pressed={isActive}
                style={{
                  backgroundColor: theme.bg,
                  color: theme.dark ? '#ffffff' : '#173636',
                  borderColor: isActive ? theme.accent : 'transparent',
                }}
              >
                <span className="melforia-theme-card__swatches" aria-hidden="true">
                  <i style={{ backgroundColor: theme.primary }} />
                  <i style={{ backgroundColor: theme.accent }} />
                  <i style={{ backgroundColor: theme.dark ? '#11181d' : '#ffffff' }} />
                </span>
                <strong>{details.label}</strong>
                <small>{details.description}</small>
                {isActive && <span className="melforia-theme-card__selected">Ausgewählt</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section className="melforia-design-section" aria-labelledby="background-heading">
        <div className="melforia-design-section__heading">
          <div>
            <p className="melforia-design-step">2 · Hintergrund</p>
            <h2 id="background-heading">Stimmung auswählen</h2>
          </div>
        </div>

        <div className="melforia-background-grid">
          {availableBackgrounds.map(item => (
            <BackgroundCard
              key={item.id}
              background={item}
              fallbackColor={currentTheme.bg}
              isActive={background.id === item.id}
              onSelect={() => setBackground(item)}
            />
          ))}
          {customBackground && (
            <BackgroundCard
              background={customBackground}
              fallbackColor={currentTheme.bg}
              isActive={background.id === customBackground.id}
              onSelect={() => setBackground(customBackground)}
            />
          )}
        </div>
      </section>

      <section className="melforia-upload-section" aria-labelledby="upload-heading">
        <div className="melforia-upload-section__copy">
          <span className="melforia-upload-section__icon" aria-hidden="true">
            <ImagePlus size={25} />
          </span>
          <div>
            <p className="melforia-design-step">3 · Persönlich</p>
            <h2 id="upload-heading">Eigenes Foto verwenden</h2>
            <p>
              JPG, PNG oder WebP bis 12 MB. Das Bild wird verkleinert und ausschließlich in diesem
              Browser gespeichert.
            </p>
          </div>
        </div>

        <div className="melforia-upload-actions">
          <label className={`melforia-upload-button ${isProcessing ? 'is-disabled' : ''}`}>
            <ImagePlus size={18} aria-hidden="true" />
            {isProcessing ? 'Foto wird vorbereitet …' : 'Foto auswählen'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={event => void handlePhotoUpload(event)}
              disabled={isProcessing}
            />
          </label>

          {customBackground && (
            <button
              type="button"
              className="melforia-remove-button"
              onClick={() => void handleRemovePhoto()}
            >
              <Trash2 size={18} aria-hidden="true" />
              Eigenes Foto entfernen
            </button>
          )}
        </div>

        {feedback && (
          <p className={`melforia-design-feedback is-${feedback.type}`} role="status">
            {feedback.text}
          </p>
        )}
      </section>
    </div>
  );
}
