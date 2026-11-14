import { Download, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { isNativeProtectionAvailable, NativeProtection } from '../../native/protectionBridge';
import {
  exportProtectionEntries,
  PROTECTION_LABELS,
  type ProtectionEntry,
} from '../../utils/protection';

const SOURCE_LABELS = {
  example: 'Beispieltext',
  manual: 'Manuell eingefügt',
  instagram: 'Instagram · Profil nicht ermittelt',
  'native-demo': 'Android-Testansicht',
};
export default function ProtectionArchive({
  entries,
  onDelete,
  busy = false,
}: {
  entries: ProtectionEntry[];
  onDelete: (id: string) => void;
  busy?: boolean;
}) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const filtered = entries.filter(entry =>
    `${PROTECTION_LABELS[entry.category]} ${SOURCE_LABELS[entry.source]}`
      .toLocaleLowerCase('de-DE')
      .includes(query.toLocaleLowerCase('de-DE'))
  );
  return (
    <div className="protection-archive">
      <div className="protection-archive-tools">
        <label>
          Sammlung durchsuchen
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.currentTarget.value)}
            placeholder="Kategorie oder Quelle"
          />
        </label>
        <button
          type="button"
          className="protection-button"
          disabled={!entries.length || exporting}
          onClick={() => {
            setExporting(true);
            setExportError('');
            void Promise.resolve()
              .then(() =>
                isNativeProtectionAvailable()
                  ? NativeProtection.exportCollection({ entries })
                  : exportProtectionEntries(entries)
              )
              .catch(() => setExportError('Der Export konnte nicht gespeichert werden.'))
              .finally(() => setExporting(false));
          }}
        >
          <Download size={17} aria-hidden="true" />
          {exporting ? 'Export wird vorbereitet …' : 'Sammlung exportieren'}
        </button>
      </div>
      <p className="protection-small">
        {entries.length} von höchstens 200 Einträgen. Texte bleiben verdeckt, bis du sie öffnest.
        Ein Export enthält die gesammelten Originaltexte.
      </p>
      {exportError && <p role="status">{exportError}</p>}
      {!filtered.length && (
        <p className="protection-empty">
          {entries.length
            ? 'Keine passenden Einträge gefunden.'
            : 'Noch keine Einträge. Du entscheidest, was du sichern möchtest.'}
        </p>
      )}
      {filtered.map(entry => (
        <article className="protection-entry" key={entry.id}>
          <div className="protection-entry-heading">
            <strong>{PROTECTION_LABELS[entry.category]}</strong>
            <span>{SOURCE_LABELS[entry.source]}</span>
          </div>
          <small>Gesichert: {new Date(entry.capturedAt).toLocaleString('de-DE')}</small>
          {revealed.has(entry.id) ? (
            <p className="protection-original">{entry.text}</p>
          ) : (
            <p className="protection-small">
              <EyeOff size={16} aria-hidden="true" /> Originaltext ist verdeckt.
            </p>
          )}
          <div className="protection-entry-actions">
            <button
              type="button"
              onClick={() =>
                setRevealed(current => {
                  const next = new Set(current);
                  if (next.has(entry.id)) next.delete(entry.id);
                  else next.add(entry.id);
                  return next;
                })
              }
            >
              {revealed.has(entry.id) ? (
                <EyeOff size={16} aria-hidden="true" />
              ) : (
                <Eye size={16} aria-hidden="true" />
              )}
              {revealed.has(entry.id) ? 'Verdecken' : 'Text anzeigen'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onDelete(entry.id)}
              aria-label={`Eintrag ${PROTECTION_LABELS[entry.category]} vom ${new Date(entry.capturedAt).toLocaleString('de-DE')} löschen`}
            >
              <Trash2 size={16} aria-hidden="true" />
              Löschen
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
