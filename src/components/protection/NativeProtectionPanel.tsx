import { CheckCircle2, ExternalLink, Pause, Play, RefreshCw, Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  isNativeProtectionAvailable,
  NativeProtection,
  type NativeProtectionState,
} from '../../native/protectionBridge';
import {
  validateProtectionEntries,
  validateProtectionSettings,
  type ProtectionSettings,
} from '../../utils/protection';
import ProtectionArchive from './ProtectionArchive';

export default function NativeProtectionPanel({ settings }: { settings: ProtectionSettings }) {
  const available = isNativeProtectionAvailable();
  const [native, setNative] = useState<NativeProtectionState | null>(null);
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState('');
  const mounted = useRef(false);
  const pending = useRef(false);
  useEffect(() => {
    mounted.current = true;
    if (!available)
      return () => {
        mounted.current = false;
      };
    const refresh = () => {
      if (pending.current) return;
      pending.current = true;
      void NativeProtection.getState()
        .then(value => {
          if (mounted.current) setNative(value);
        })
        .catch(() => {
          if (mounted.current) setNotice('Der Android-Status konnte nicht geladen werden.');
        })
        .finally(() => {
          pending.current = false;
        });
    };
    refresh();
    window.addEventListener('focus', refresh);
    const visibility = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      mounted.current = false;
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [available]);
  const run = async (operation: () => Promise<NativeProtectionState>) => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setNotice('');
    try {
      const value = await operation();
      if (mounted.current) setNative(value);
    } catch {
      if (mounted.current)
        setNotice(
          'Die Android-Aktion konnte nicht abgeschlossen werden. Prüfe den Dienststatus und versuche es erneut.'
        );
    } finally {
      pending.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  const dirty =
    native &&
    JSON.stringify(validateProtectionSettings(native.config)) !==
      JSON.stringify(validateProtectionSettings(settings));
  const status = !native
    ? 'Status noch nicht geladen'
    : !native.serviceEnabled
      ? 'Android-Berechtigung fehlt'
      : native.enabled && native.connected
        ? 'Android-Schutz ist eingeschaltet'
        : 'Android-Schutz ist pausiert';
  return (
    <section
      className="protection-card protection-native"
      aria-labelledby="native-protection-heading"
    >
      <span className="protection-kicker">
        <Smartphone size={18} aria-hidden="true" /> Über anderen Apps
      </span>
      <h2 id="native-protection-heading">Melforia auf Android</h2>
      {!available ? (
        <>
          <p>
            Hier im Browser funktioniert der Filter für die Beispiele und für Texte, die du selbst
            einfügst.
          </p>
          <p>
            Das Fenster über Instagram gehört zur nativen Android-Testversion. Eine installierte PWA
            allein kann es nicht aktivieren. Auf dem iPhone steht dieser allgemeine Zugriff nicht
            zur Verfügung.
          </p>
        </>
      ) : (
        <>
          <p className="protection-native-status">
            <CheckCircle2 size={18} aria-hidden="true" />
            <strong>{status}</strong>
          </p>
          <p>
            Die Testversion prüft zugängliche Kommentartexte in Instagram. Sie kann Inhalte
            übersehen und Text kurz vor dem Verdecken anzeigen. Bilder, Videos und Nachrichten
            werden nicht ausgewertet.
          </p>
          {!native?.consentVersion && (
            <div className="protection-disclosure">
              <h3>Bevor du den Bildschirmzugriff erlaubst</h3>
              <p>
                Der Android-Dienst erhält Meldungen über App-Wechsel und liest ausschließlich
                zugängliche Kommentartexte in Instagram und der eigenen Android-Testansicht. Er legt
                Abdeckungen über passende Texte. Tastatureingaben, Passwörter und Direktnachrichten
                werden nicht gelesen. Die Prüfung läuft auf deinem Gerät.
              </p>
              <p>
                Texte werden nur auf deinen Wunsch oder bei eingeschaltetem automatischem Sammeln
                lokal gespeichert. Es werden keine Screenshots aufgenommen, Texte an einen KI-Dienst
                gesendet oder Kommentare bei Instagram gelöscht. Du kannst den Dienst jederzeit in
                Android deaktivieren.
              </p>
              <label className="protection-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={event => setConsent(event.currentTarget.checked)}
                />
                Ich möchte diesen optionalen Bildschirmzugriff erlauben.
              </label>
            </div>
          )}
          <div className="protection-native-actions">
            <button
              type="button"
              className="protection-button"
              disabled={busy || !native || (!native.consentVersion && !consent)}
              onClick={() =>
                void run(async () => {
                  if (!native?.consentVersion)
                    await NativeProtection.acceptDisclosure({ version: 1 });
                  await NativeProtection.openAccessibilitySettings();
                  return NativeProtection.getState();
                })
              }
            >
              <ExternalLink size={17} aria-hidden="true" />
              Android-Berechtigung öffnen
            </button>
            <button
              type="button"
              className="protection-button protection-button-primary"
              disabled={
                busy ||
                !native ||
                (!native.enabled && (!native.serviceEnabled || !native.consentVersion))
              }
              onClick={() =>
                void run(async () => {
                  if (!native?.enabled) await NativeProtection.configure({ config: settings });
                  return NativeProtection.setEnabled({ enabled: !native?.enabled });
                })
              }
            >
              {native?.enabled ? (
                <Pause size={17} aria-hidden="true" />
              ) : (
                <Play size={17} aria-hidden="true" />
              )}
              {native?.enabled ? 'Android-Schutz pausieren' : 'Android-Schutz starten'}
            </button>
            <button
              type="button"
              className="protection-button"
              disabled={busy || !native?.serviceEnabled || !native.enabled}
              onClick={() =>
                void run(async () => {
                  await NativeProtection.openDemo();
                  return NativeProtection.getState();
                })
              }
            >
              Echtes Overlay in Testansicht öffnen
            </button>
            <button
              type="button"
              className="protection-button"
              disabled={busy}
              onClick={() => void run(() => NativeProtection.getState())}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Status aktualisieren
            </button>
          </div>
          {dirty && (
            <div className="protection-disclosure">
              <p>
                Die Filtereinstellungen hier unterscheiden sich von den zuletzt auf Android
                übernommenen Regeln.
              </p>
              <button
                type="button"
                className="protection-button"
                disabled={busy}
                onClick={() => void run(() => NativeProtection.configure({ config: settings }))}
              >
                Filter auf Android übernehmen
              </button>
            </div>
          )}
          <p className="protection-small">
            Der Schutz läuft unabhängig von deiner Anmeldung auf diesem Gerät. Es gibt keine
            automatische Weitergabe an Fachkräfte oder andere Konten. Die Sammlung ist keine
            rechtssichere Beweissicherung.
          </p>
          {notice && <p role="status">{notice}</p>}
          <details className="protection-native-archive">
            <summary>
              Android-Sammlung ({validateProtectionEntries(native?.entries).length})
            </summary>
            <ProtectionArchive
              entries={validateProtectionEntries(native?.entries)}
              busy={busy}
              onDelete={id => void run(() => NativeProtection.deleteEntry({ id }))}
            />
          </details>
        </>
      )}
    </section>
  );
}
