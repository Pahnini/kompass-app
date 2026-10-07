# App-Start bei Verbindungsproblemen

Stand: 7. Oktober 2026

## Ursache und Wiederherstellung

Die öffentliche App blieb bei „Verbindung wird hergestellt ...“ hängen. Der veröffentlichte Client versuchte eine Sitzung beim Supabase-Projekt `xwqrqakhzgkmoawfkdpf` zu erneuern. Dieses Projekt meldete `INACTIVE`. Der bestehende App-Start wartete auf `getSession()` ohne Fehlerpfad oder begrenzte Wartezeit.

Die ausdrücklich genehmigte Wiederherstellung wurde über Supabase ausgelöst. Danach meldete das Projekt `ACTIVE_HEALTHY`; eine harmlose Abfrage `select 1 as connection_ok` war erfolgreich. Die öffentliche App öffnete sich anschließend wieder mit der bereits vorhandenen Sitzung, ohne die zuvor beobachteten Verbindungsfehler. Kein Tarifwechsel wurde vorgenommen, keine Schlüssel oder Datenbankregeln wurden geändert.

## Lokale Korrektur

- `useStartupSession` begrenzt die anfängliche Wartezeit auf fünf Sekunden und behandelt sowohl abgelehnte Anfragen als auch zurückgegebene Auth-Fehler.
- Die öffentlichen Seiten einschließlich Startseite, Anmeldung und Demo können während der Sitzungsprüfung angezeigt werden. Private Seiten bleiben an eine Sitzung gebunden; bestehende Prüfungen des Datendienstes und der Server-Endpunkte bleiben unverändert.
- Die Atemübung wird unabhängig von der Anmeldung angezeigt. Eine spätere Wiederherstellung der Sitzung startet eine laufende Übung nicht neu.
- Nach einem Verbindungsfehler erscheinen Hinweise sowie Links zur Demo und Atemübung und eine ausdrücklich benannte Aktion zum Neuladen.
- Neuere Auth-Ereignisse haben Vorrang vor verspäteten Ergebnissen der anfänglichen Abfrage. Timer und Abonnements werden beim Entfernen der Komponente bereinigt.
- Die Korrektur löscht weder Sitzungen noch gespeicherte Einträge und gibt bei Fehlern keine private Oberfläche frei.

## Prüfung

99 Tests in 18 Dateien bestanden, davon 14 neue Tests zu Timeout, Fehlern, Auth-Ereignissen, StrictMode, Bereinigung und öffentlichen bzw. privaten Routen. Typprüfung, gezielte Codeprüfung und Produktionsbuild erfolgreich. Die bestehende Buildwarnung für den großen Haupt-Chunk bleibt.

Im lokalen Browser wurden Startseite und Atemübung geprüft. Bei 390 px Breite hatte die Atemübung keinen horizontalen Überlauf und keine `tel:`-Links. Keine Browserfehler beobachtet. Das ist eine Prüfung in Handygröße, keine Installation auf einem echten Android- oder iOS-Gerät.

SDK-Grundlage: [Supabase Auth-Ereignisse](https://supabase.com/docs/reference/javascript/auth-onauthstatechange). React-Prüfliste angewendet: bereinigte Effekte, stabile Abhängigkeiten, keine SDK-Aufrufe innerhalb des Auth-Callbacks, sichtbare Verbindungsmeldung und Tastaturfokus.

## Veröffentlichung und offene Grenzen

Die Supabase-Reaktivierung wirkt bereits auf die öffentliche App. Die zusätzliche Startabsicherung ist nur lokal umgesetzt und noch nicht veröffentlicht.

Die gespeicherte Vercel-Zuordnung zum Projekt `kompass-app` wurde vom verbundenen Konto nicht gefunden. Die Projektübersicht zeigte lediglich ein anderes, älteres Projekt `kompass`, mit anderen Domains und Framework-Einstellungen. Dieses Projekt wurde nicht verändert. Vor einer Veröffentlichung muss die aktuelle Zuordnung zur Domain `kompass-app.vercel.app` bestätigt werden; die lokale Verknüpfung wurde nicht überschrieben.

Das bestehende PWA-Manifest bleibt unverändert. Der bisherige Service Worker dient weiterhin nur der Entfernung alter Caches. Diese Korrektur stellt keinen Offline-Betrieb her. Neue Anmeldung, Registrierung und geräteübergreifende Speicherung wurden in diesem Durchlauf nicht mit neuen Live-Konten getestet.
