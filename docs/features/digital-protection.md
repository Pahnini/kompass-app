# Melforia · Digitaler Schutz

## Produkt und Einstieg

Das optionale Werkzeug ist unter `/schutz`, im Menü „Digitaler Schutz“ und in der Testauswahl erreichbar. Es ist auch ohne Anmeldung verfügbar und blockiert weder Hilfewege noch andere Kernfunktionen.

Die Browseransicht enthält eine Simulation mit erfundenen Kommentaren, einen verschiebbaren Schutzbutton, Kategorien, drei Schutzstärken, eigene Wortregeln, einen Test für manuell eingefügte Texte und eine lokale Sammlung mit Export. Die regelbasierte Erkennung ist kein vollständiger Hassfilter und nimmt keine rechtliche Bewertung vor.

## Android-Erweiterung

Die vorhandene React-/Vite-App bleibt die gemeinsame Oberfläche. Capacitor 8.6.2 ergänzt eine native Android-Hülle mit dem lokalen Plugin `MelforiaProtection` und einem ausdrücklich aktivierten AccessibilityService. Die native App startet im Schutzbereich. Sie lädt ausschließlich lokal gebaute Web-Assets; externe Webseiten erhalten keinen Zugriff auf die Bridge.

Der Dienst zeichnet ein verschiebbares Schutzmenü und einzelne Abdeckungen als `TYPE_ACCESSIBILITY_OVERLAY`. Er verwendet weder automatische Klicks noch Gesten, Screenshot-Zugriff oder ein externes Sprachmodell. Originalkommentare und Konten werden auf Instagram nicht verändert.

Der Bildschirmzugriff ist standardmäßig ausgeschaltet. Zur Aktivierung sind alle drei Schritte erforderlich:

1. Den konkreten Hinweis zum Bildschirmzugriff im Schutzbereich bestätigen.
2. Den Dienst „Melforia · Digitaler Schutz“ persönlich in Android aktivieren.
3. In Melforia „Android-Schutz starten“ auswählen.

Der Dienst wertet nur sichtbare, nicht editierbare Kommentar-Elemente in `com.instagram.android` sowie in der eigenen nativen Testansicht aus. Kommentar-Elemente werden konservativ anhand zugänglicher View-IDs mit `comment` im Element oder nahen Elternknoten begrenzt. Fehlen solche IDs, wird der Text nicht ausgewertet. Passwörter und Eingabefelder werden übersprungen. Auf andere Apps wird nur zur Bestimmung des Vordergrundfensters reagiert; deren Text wird nicht ausgewertet. Beim Sperren, App-Wechsel und Beenden des Dienstes werden eigene Fenster entfernt.

Diese Anbindung ist experimentell. Instagrams Oberfläche und Accessibility-Daten können sich ändern. Korrekte Positionierung, keine unerwünschten Abdeckungen, Interaktion mit Tastaturen und Systemfenstern, App-Wechsel sowie Akkuverhalten müssen auf echten Geräten geprüft werden. Zwischen Darstellung, Erkennung und Abdeckung kann Text sichtbar sein. Ein positives Build-Ergebnis belegt keine zuverlässige Filterwirkung auf Instagram und keine Play-Store-Zulassung.

## Daten und Kontrolle

- Die Web-Sammlung liegt gerätebezogen im lokalen Browserspeicher; die native Sammlung liegt in app-privaten Android-Preferences. Diese Daten werden nicht in Supabase gespeichert, mit Konten synchronisiert oder an Fachkräfte übermittelt.
- Wer denselben Browser oder dasselbe entsperrte Android-Profil verwendet, kann auf die Sammlung zugreifen. Sie ist kein gesondert verschlüsselter Tresor.
- Automatisches Sammeln ist anfangs ausgeschaltet. Manuelles Sichern ist immer eine ausdrückliche Aktion. Die Webansicht sammelt bei Opt-in ausschließlich die dargestellten Beispiele, die native Erweiterung zugängliche erkannte Texte während ihrer Aktivierung.
- Beide Sammlungen sind auf 200 Einträge begrenzt. Eine volle Sammlung verdrängt keine vorhandenen Einträge. Gelöschte automatisch erfasste Texte werden nicht unmittelbar wieder hinzugefügt.
- Ein nativer Eintrag enthält nur Text, Kategorie, Quelle und Sicherungszeitpunkt. Profilnamen, echte Kommentar-IDs und Veröffentlichungszeitpunkte werden nicht erfunden.
- Originaltexte bleiben in der Sammlung zunächst verdeckt. Der JSON-Export enthält die ausgewählten Originaltexte und kennzeichnet Testtexte, manuelle Eingaben und native Erfassungen getrennt. Android verwendet die Dateiauswahl des Systems, der Browser einen Download.
- Sammlung und Export sind keine verifizierte Beweissicherung. Es gibt keine automatische Meldung oder Überwachung bedrohlicher Inhalte.
- Android-Backup und automatischer Datentransfer sind für die Test-App deaktiviert. Die Erweiterung nimmt keine Bildschirmaufnahmen auf und protokolliert keine Kommentartexte.

## Entwickeln und bauen

```sh
npm ci
npm run type-check
npm run test:run
node scripts/check-native-protection.mjs
npm run android:sync
npm run android:open
```

Für die native APK werden JDK 21, Android SDK 36 und die üblichen Android-Buildwerkzeuge benötigt. Der reine Regelvergleich kann ohne Android SDK mit einem Java-Runtime-Image laufen, wenn dieses `jdk.compiler` enthält. Web und Java verwenden dieselbe Datei `public/protection-rules.json`; 18 gemeinsame Fälle prüfen beide Implementierungen.

Der Workflow `Android protection test build` erstellt bei Pull Requests eine Debug-APK als Artefakt `melforia-schutz-android-debug`. Für diesen lokalen Schutztest nutzt er ausdrücklich ungültige Supabase-Platzhalter, damit kein Produktivkonto und keine Produktionsschlüssel im Artefakt benötigt werden. Die anderen Backendfunktionen der Debug-APK sind damit nicht nutzbar; eine reguläre native App benötigt die passende Umgebungskonfiguration und eine gesonderte Prüfung der Anmeldewege. Die Debug-APK hat die getrennte Kennung `io.github.pahnini.melforia.protectiontest`.

## Vor einer Freigabe

Die native Testansicht macht den echten Android-Dienst ohne Instagram-Konto prüfbar. Zusätzlich sind Tests mit den tatsächlich unterstützten Instagram-Versionen und Geräten erforderlich. Die Nutzung der Accessibility API, die offene Einwilligung und die Verteilung über Google Play müssen vor einer Veröffentlichung gesondert geprüft werden. iOS erhält durch diese Android-Erweiterung kein appübergreifendes Overlay.
