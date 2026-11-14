import {
  Archive,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Pause,
  Play,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import ProtectionArchive from '../components/protection/ProtectionArchive';
import NativeProtectionPanel from '../components/protection/NativeProtectionPanel';
import { useTheme } from '../hooks/useTheme';
import { useScopedStorage } from '../hooks/useScopedStorage';
import {
  assessProtectionText,
  EMPTY_PROTECTION_RECORD,
  normalizeProtectionText,
  PROTECTION_CATEGORIES,
  PROTECTION_LABELS,
  PROTECTION_STORAGE_KEY,
  validateProtectionRecord,
  type ProtectionEntry,
  type ProtectionRecord,
  type ProtectionSettings,
} from '../utils/protection';
import '../styles/Protection.css';

const EXAMPLES = [
  {
    id: 'schutz-beispiel-1',
    author: 'meerzeit',
    text: 'Danke für diesen schönen Beitrag. Genau das habe ich heute gebraucht. 🌿',
  },
  {
    id: 'schutz-beispiel-2',
    author: 'beispielprofil_27',
    text: 'Frauen haben in diesem Sport nichts verloren.',
  },
  {
    id: 'schutz-beispiel-3',
    author: 'andere.perspektive',
    text: 'Ich sehe das anders: Nicht jede Pause löst Stress. Aber schön, dass es dir hilft.',
  },
  {
    id: 'schutz-beispiel-4',
    author: 'beispielprofil_418',
    text: 'Mit so einem Körper solltest du dich verstecken.',
  },
  { id: 'schutz-beispiel-5', author: 'beispielprofil_91', text: 'Du bist einfach nur dumm.' },
  {
    id: 'schutz-beispiel-6',
    author: 'nordlicht',
    text: 'Ein bisschen Meer und eine kleine Pause. Das klingt gut. ☀️',
  },
];

export default function ProtectionPage() {
  const { theme } = useTheme();
  const [record, writeRecord] = useScopedStorage(
    PROTECTION_STORAGE_KEY,
    EMPTY_PROTECTION_RECORD,
    validateProtectionRecord
  );
  const latest = useRef(record);
  latest.current = record;
  const [tab, setTab] = useState<'preview' | 'archive'>('preview');
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState('');
  const [text, setText] = useState('');
  const [tested, setTested] = useState<string | null>(null);
  const [word, setWord] = useState('');
  const [bubble, setBubble] = useState<{ x: number; y: number } | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const settingsSection = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(
    null
  );
  const suppressClick = useRef(false);
  const seenAutomatically = useRef(new Set<string>());
  const commit = (next: ProtectionRecord, success = '') => {
    if (!writeRecord(next)) {
      setNotice(
        'Dein Browser konnte die Änderung nicht speichern. Es wurde nichts als gesichert übernommen.'
      );
      return false;
    }
    latest.current = next;
    if (success) setNotice(success);
    return true;
  };
  const updateSettings = (next: ProtectionSettings) => {
    if (
      commit(
        { ...latest.current, settings: next },
        'Schutzeinstellungen in diesem Browser gespeichert.'
      )
    )
      setRevealed(new Set());
  };
  const saveText = (id: string, content: string, source: ProtectionEntry['source']) => {
    const current = latest.current;
    if (
      current.entries.some(
        entry => entry.id === id || (entry.text === content && entry.source === source)
      )
    ) {
      setNotice('Dieser Text ist bereits in deiner Sammlung.');
      return;
    }
    if (current.entries.length >= 200) {
      setNotice('Die Sammlung ist voll. Exportiere oder entferne zuerst Einträge.');
      return;
    }
    const entry: ProtectionEntry = {
      id,
      text: content,
      source,
      capturedAt: new Date().toISOString(),
      category: assessProtectionText(content, current.settings) ?? 'manual',
    };
    commit(
      { ...current, entries: [entry, ...current.entries] },
      'Text wurde auf diesem Gerät gesichert.'
    );
  };
  useEffect(() => {
    if (!record.settings.autoCollect || !previewEnabled) return;
    const additions: ProtectionEntry[] = [];
    for (const example of EXAMPLES) {
      const category = assessProtectionText(example.text, record.settings);
      if (
        !category ||
        seenAutomatically.current.has(example.id) ||
        record.dismissedExampleIds.includes(example.id)
      )
        continue;
      seenAutomatically.current.add(example.id);
      if (!record.entries.some(entry => entry.id === example.id))
        additions.push({
          id: example.id,
          text: example.text,
          category,
          source: 'example',
          capturedAt: new Date().toISOString(),
        });
    }
    const accepted = additions.slice(0, Math.max(0, 200 - record.entries.length));
    if (accepted.length && !writeRecord({ ...record, entries: [...accepted, ...record.entries] }))
      setNotice('Die Beispiele konnten nicht automatisch gespeichert werden.');
  }, [record, previewEnabled, writeRecord]);
  const hidden = EXAMPLES.filter(
    example =>
      previewEnabled &&
      assessProtectionText(example.text, record.settings) &&
      !revealed.has(example.id)
  ).length;
  const pointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !frame.current) return;
    const parent = frame.current.getBoundingClientRect();
    const button = event.currentTarget.getBoundingClientRect();
    suppressClick.current = false;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: button.left - parent.left,
      top: button.top - parent.top,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const start = drag.current;
    if (!start || !frame.current) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 7) start.moved = true;
    if (!start.moved) return;
    suppressClick.current = true;
    setMenu(false);
    setBubble({
      x: Math.max(10, Math.min(frame.current.clientWidth - 66, start.left + dx)),
      y: Math.max(10, Math.min(frame.current.clientHeight - 66, start.top + dy)),
    });
  };
  const togglePreview = () => {
    setPreviewEnabled(current => !current);
    setRevealed(new Set());
  };
  const style = {
    '--protection-surface': theme.dark ? '#25394b' : '#fff',
    '--protection-bg': theme.dark ? '#1c2d3d' : '#f3f6ef',
    '--protection-text': theme.dark ? '#f0f6f0' : '#253c34',
    '--protection-muted': theme.dark ? '#b9cbbd' : '#5f7467',
    '--protection-line': theme.dark ? '#4b6359' : '#d8e3d3',
    '--protection-cover': theme.dark ? '#244d3e' : '#edf5e6',
  } as CSSProperties;
  return (
    <div className="protection-page" style={style}>
      <header className="protection-header">
        <Link to="/">
          <ArrowLeft size={17} aria-hidden="true" />
          Zurück zu Melforia
        </Link>
        <span>
          <ShieldCheck size={20} aria-hidden="true" />
          Optionales Werkzeug
        </span>
      </header>
      <div className="protection-hero">
        <span className="protection-kicker">DEIN DIGITALER SCHUTZRAUM</span>
        <h1>Digitaler Schutz</h1>
        <p>
          Mehr Kontrolle darüber, was dich erreicht. Du entscheidest, was du sehen und was du
          behalten möchtest.
        </p>
      </div>
      <div className="protection-explainer">
        <LockKeyhole size={19} aria-hidden="true" />
        <p>
          <strong>Deine Daten bleiben auf diesem Gerät.</strong> Sammlung und Einstellungen werden
          nicht mit Melforia-Konten synchronisiert. Wer denselben Browser oder dasselbe
          Android-Profil verwendet, kann darauf zugreifen.
        </p>
      </div>
      <nav className="protection-tabs" aria-label="Bereiche im digitalen Schutz">
        <button type="button" aria-pressed={tab === 'preview'} onClick={() => setTab('preview')}>
          <ShieldCheck size={18} aria-hidden="true" />
          Ausprobieren
        </button>
        <button type="button" aria-pressed={tab === 'archive'} onClick={() => setTab('archive')}>
          <Archive size={18} aria-hidden="true" />
          Sammlung ({record.entries.length})
        </button>
      </nav>
      {tab === 'archive' ? (
        <section className="protection-card">
          <h2>Deine lokale Sammlung</h2>
          <p>
            Beispiele und selbst eingefügte Texte. Die native Android-Sammlung findest du im
            Android-Bereich weiter unten.
          </p>
          <ProtectionArchive
            entries={record.entries}
            onDelete={id => {
              seenAutomatically.current.add(id);
              commit(
                {
                  ...latest.current,
                  entries: latest.current.entries.filter(entry => entry.id !== id),
                  dismissedExampleIds: id.startsWith('schutz-beispiel-')
                    ? [...new Set([...latest.current.dismissedExampleIds, id])]
                    : latest.current.dismissedExampleIds,
                },
                'Eintrag aus dieser Sammlung gelöscht.'
              );
            }}
          />
        </section>
      ) : (
        <div className="protection-columns">
          <section
            className="protection-card protection-preview"
            aria-labelledby="protection-preview-heading"
          >
            <div className="protection-section-heading">
              <div>
                <span className="protection-kicker">BEDIENUNG AUSPROBIEREN</span>
                <h2 id="protection-preview-heading">Dein Feed. Mit Schutz.</h2>
              </div>
              <span className="protection-badge">Simulation</span>
            </div>
            <p>
              Erfundene Kommentare. Der Testfilter nutzt feste Regeln und erkennt nicht jede Form
              von Hass.
            </p>
            <div className="protection-frame" ref={frame}>
              <div
                className="protection-feed"
                tabIndex={0}
                aria-label="Scrollbare Beispielkommentare"
              >
                <div className="protection-feed-top">
                  <strong>Beispielbeitrag</strong>
                  <span>{previewEnabled ? `${hidden} verdeckt` : 'Beispielschutz pausiert'}</span>
                </div>
                <p className="protection-post">
                  <span aria-hidden="true">🌊</span> Kleine Pause. Ein bisschen Meer. Heute etwas
                  für mich.
                </p>
                {EXAMPLES.map(example => {
                  const category = previewEnabled
                    ? assessProtectionText(example.text, record.settings)
                    : null;
                  const saved = record.entries.some(entry => entry.id === example.id);
                  return (
                    <article className="protection-comment" key={example.id}>
                      <strong>{example.author}</strong>
                      {category && !revealed.has(example.id) ? (
                        <div className="protection-cover">
                          <span>
                            <ShieldCheck size={17} aria-hidden="true" />
                            Für dich verdeckt
                          </span>
                          <small>{PROTECTION_LABELS[category]}</small>
                          <div>
                            <button
                              type="button"
                              aria-label={`Kommentar von ${example.author} anzeigen`}
                              onClick={() =>
                                setRevealed(current => new Set([...current, example.id]))
                              }
                            >
                              <Eye size={16} aria-hidden="true" />
                              Anzeigen
                            </button>
                            <button
                              type="button"
                              disabled={saved}
                              aria-label={`Kommentar von ${example.author} sichern`}
                              onClick={() => saveText(example.id, example.text, 'example')}
                            >
                              {saved ? (
                                <Check size={16} aria-hidden="true" />
                              ) : (
                                <Archive size={16} aria-hidden="true" />
                              )}
                              {saved ? 'Gesichert' : 'Sichern'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p>{example.text}</p>
                          <div className="protection-comment-actions">
                            {category && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealed(current => {
                                    const next = new Set(current);
                                    next.delete(example.id);
                                    return next;
                                  })
                                }
                              >
                                <EyeOff size={15} aria-hidden="true" />
                                Wieder verdecken
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={saved}
                              onClick={() => saveText(example.id, example.text, 'example')}
                            >
                              {saved ? 'Gesichert' : 'Sichern'}
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
              <button
                type="button"
                className={`protection-bubble ${previewEnabled ? '' : 'is-paused'}`}
                style={
                  bubble
                    ? { left: bubble.x, top: bubble.y, right: 'auto', bottom: 'auto' }
                    : undefined
                }
                aria-label="Schwebendes Schutzmenü öffnen; zum Verschieben ziehen"
                aria-expanded={menu}
                onPointerDown={pointerDown}
                onPointerMove={pointerMove}
                onPointerUp={event => {
                  drag.current = null;
                  if (event.currentTarget.hasPointerCapture(event.pointerId))
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={() => {
                  drag.current = null;
                  suppressClick.current = true;
                }}
                onClick={() => {
                  if (!suppressClick.current) setMenu(current => !current);
                  suppressClick.current = false;
                }}
              >
                <ShieldCheck size={29} aria-hidden="true" />
              </button>
              {menu && (
                <div
                  className="protection-floating"
                  role="region"
                  aria-label="Schwebendes Schutzmenü"
                >
                  <div>
                    <strong>Melforia · Schutz</strong>
                    <button
                      type="button"
                      onClick={() => setMenu(false)}
                      aria-label="Schutzmenü schließen"
                    >
                      <X size={19} />
                    </button>
                  </div>
                  <p>
                    {previewEnabled
                      ? 'Der Beispielschutz ist aktiv.'
                      : 'Der Beispielschutz ist pausiert.'}
                  </p>
                  <button
                    type="button"
                    className="protection-button protection-button-primary"
                    onClick={togglePreview}
                  >
                    {previewEnabled ? (
                      <Pause size={17} aria-hidden="true" />
                    ) : (
                      <Play size={17} aria-hidden="true" />
                    )}
                    Beispielschutz {previewEnabled ? 'pausieren' : 'aktivieren'}
                  </button>
                  <button
                    type="button"
                    className="protection-button"
                    onClick={() => {
                      setMenu(false);
                      settingsSection.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }}
                  >
                    <SlidersHorizontal size={16} aria-hidden="true" />
                    Filter einstellen
                  </button>
                </div>
              )}
            </div>
            <p className="protection-small">
              Den schwebenden Button kannst du verschieben. Er bleibt innerhalb dieser Vorschau.
            </p>
          </section>
          <section
            className="protection-card protection-settings"
            ref={settingsSection}
            aria-labelledby="protection-settings-heading"
          >
            <span className="protection-kicker">DEINE ENTSCHEIDUNG</span>
            <h2 id="protection-settings-heading">Was darf leiser werden?</h2>
            <div className="protection-settings-list">
              {Object.entries(PROTECTION_CATEGORIES).map(([category, label]) => (
                <label key={category}>
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={
                      record.settings.categories[category as keyof typeof PROTECTION_CATEGORIES]
                    }
                    onChange={event =>
                      updateSettings({
                        ...record.settings,
                        categories: {
                          ...record.settings.categories,
                          [category]: event.currentTarget.checked,
                        },
                      })
                    }
                  />
                </label>
              ))}
            </div>
            <label className="protection-field">
              Schutzstärke
              <select
                value={record.settings.level}
                onChange={event =>
                  updateSettings({
                    ...record.settings,
                    level: event.currentTarget.value as ProtectionSettings['level'],
                  })
                }
              >
                <option value="gentle">Sanft · nur deutliche Angriffe</option>
                <option value="balanced">Ausgewogen · auch Abwertungen</option>
                <option value="strict">Streng · auch grenzwertige Aussagen</option>
              </select>
            </label>
            <label className="protection-auto">
              <input
                type="checkbox"
                checked={record.settings.autoCollect}
                onChange={event =>
                  updateSettings({ ...record.settings, autoCollect: event.currentTarget.checked })
                }
              />
              <span>
                Verdeckte Beispiele automatisch sammeln
                <small>
                  Nur während diese Ansicht geöffnet ist. Auf Android gilt diese Einstellung erst
                  nach dem Übernehmen.
                </small>
              </span>
            </label>
            <form
              className="protection-word-form"
              onSubmit={event => {
                event.preventDefault();
                const nextWord = word.trim();
                if (!nextWord) return;
                if (record.settings.customWords.length >= 40) {
                  setNotice('Höchstens 40 eigene Wörter sind möglich.');
                  return;
                }
                if (
                  record.settings.customWords.some(
                    item => normalizeProtectionText(item) === normalizeProtectionText(nextWord)
                  )
                ) {
                  setNotice('Dieses Wort ist schon hinterlegt.');
                  return;
                }
                updateSettings({
                  ...record.settings,
                  customWords: [...record.settings.customWords, nextWord],
                });
                setWord('');
              }}
            >
              <label htmlFor="protection-word">Eigene Wörter oder Wortgruppen</label>
              <div>
                <input
                  id="protection-word"
                  value={word}
                  maxLength={60}
                  onChange={event => setWord(event.currentTarget.value)}
                  placeholder="Wort oder Wortgruppe"
                />
                <button
                  type="submit"
                  className="protection-button"
                  aria-label="Wortregel hinzufügen"
                >
                  <Plus size={20} />
                </button>
              </div>
            </form>
            <div className="protection-word-chips">
              {record.settings.customWords.map(item => (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    updateSettings({
                      ...record.settings,
                      customWords: record.settings.customWords.filter(value => value !== item),
                    })
                  }
                  aria-label={`Wortregel ${item} entfernen`}
                >
                  {item}
                  <X size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
          <section className="protection-card protection-test">
            <h2>Eigenen Text prüfen</h2>
            <p>Füge einen Kommentar selbst ein. Die Prüfung findet auf diesem Gerät statt.</p>
            <form
              onSubmit={event => {
                event.preventDefault();
                if (text.trim()) setTested(text.trim());
              }}
            >
              <label className="protection-field" htmlFor="protection-text">
                Kommentartext
                <textarea
                  id="protection-text"
                  rows={3}
                  maxLength={500}
                  value={text}
                  onChange={event => {
                    setText(event.currentTarget.value);
                    setTested(null);
                  }}
                  placeholder="Hier deinen Beispieltext eingeben"
                />
              </label>
              <button
                type="submit"
                className="protection-button protection-button-primary"
                disabled={!text.trim()}
              >
                Text prüfen
              </button>
            </form>
            {tested && (
              <div className="protection-test-result">
                <strong>
                  {assessProtectionText(tested, record.settings)
                    ? `Würde verdeckt: ${PROTECTION_LABELS[assessProtectionText(tested, record.settings)!]}`
                    : 'Keine hinterlegte Regel erkannt'}
                </strong>
                <p>
                  Dies ist keine verlässliche Einschätzung der Unbedenklichkeit oder Strafbarkeit.
                </p>
                <button
                  type="button"
                  className="protection-button"
                  onClick={() => saveText(`manuell-${crypto.randomUUID()}`, tested, 'manual')}
                >
                  <Archive size={17} aria-hidden="true" />
                  Diesen Text sichern
                </button>
              </div>
            )}
          </section>
        </div>
      )}
      <p className="protection-notice" role="status">
        {notice}
      </p>
      <NativeProtectionPanel settings={record.settings} />
      <footer className="protection-footer">
        <ShieldCheck size={17} aria-hidden="true" />
        <p>
          Der Filter unterstützt deine Auswahl. Er bietet keinen vollständigen Schutz. Bedrohliche
          Inhalte werden nicht automatisch gemeldet; die Sammlung wird nicht überwacht.
        </p>
        <Link to="/panic">Eine ruhige Minute nehmen</Link>
      </footer>
    </div>
  );
}
