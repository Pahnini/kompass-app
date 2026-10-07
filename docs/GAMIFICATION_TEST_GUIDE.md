# Lokaler Teststand: Aufgaben und Gamification

Stand: 5. Oktober 2026. Diese Änderungen wurden lokal umgesetzt, nicht veröffentlicht.

## Öffnen

Im Projektordner `npm install` und anschließend `npm run dev` ausführen. Die Installation verändert nicht mehr automatisch alle Quelldateien. Bei npm-10-Auflösungsproblemen kann `npx npm@11.13.0 ci --ignore-scripts` verwendet werden. Node 22 ist vorgesehen.

- `/testen`: Testauswahl mit 13 Aufgaben und Links zu Demoszenarien.
- `/demo`: eigener, kontounabhängiger Demobereich; ohne Anmeldung nutzbar.
- Auf der angemeldeten Startseite: echte Tages- und Wochenaufgaben.
- `/erfolge`: XP, Level und Abzeichen.
- Soforthilfe-Button: jederzeit zur bestehenden Atemübung.

## Testablauf ohne echte persönliche Daten

1. Demo zurücksetzen. Einen Beispiel-Check-in abschließen: 20 XP (5 Aktion + 15 Tagesbonus).
2. Wiederholen: weiterhin 20 XP.
3. Drei verschiedene Demo-Skills abschließen: insgesamt 100 XP, einschließlich des einmaligen Wochenbonus.
4. Nächsten Demotag wählen und einen Check-in abschließen: insgesamt 160 XP. Wochenaufgabe für zwei unterschiedliche Tage erledigt.
5. Neu laden: Fortschritt und simulierter Demotag bleiben erhalten, kein erneuter Bonus.
6. Bis zu drei Tagesaufgaben gleichzeitig auswählen. Gedanken und Ziele ausprobieren. Beispielsätze werden im Demobereich nicht gespeichert.
7. Gamification pausieren: keine neuen Punkte, vorhandene XP und Abzeichen bleiben erhalten.
8. Demo zurücksetzen: nur der getrennte Demofortschritt wird entfernt.

Nur abgeschlossene Übungen, erfolgreich gespeicherte Check-ins/Einträge und erledigte Ziele zählen. Das bloße Öffnen eines Bereichs zählt nicht. Skills und Ziele sind auf drei unterschiedliche Aktionen pro Tag begrenzt, Gedanken und Check-ins auf eine. Pausen führen zu keinem Punkteverlust; Aktivitätstage müssen nicht aufeinanderfolgen.

## Speicherung und Grenzen

- Aufgaben, Auswahlliste, Aktivitätstage und Abzeichen bleiben pro Konto in diesem Browser. Sie sind noch nicht vollständig geräteübergreifend synchronisiert.
- Kontopunkte werden über den bestehenden Datendienst gespeichert. Bei Problemen zeigt die Oberfläche einen Hinweis; eine fehlgeschlagene Online-Speicherung gilt nicht mehr stillschweigend als erfolgreich.
- Scheitert das Laden vorhandener Kontodaten, sind Ersetzen und Löschen dieses Bereichs bis zu einem erfolgreichen erneuten Laden gesperrt. Ein leer angezeigter Ersatz darf keine unlesbaren alten Datensätze überschreiben. Hintergrundsynchronisation prüft dieselben Kontorechte und Sperren.
- Der Demobereich schreibt keine Kontopunkte und speichert keine Gedanken- oder Stimmungsinhalte.
- Check-in-Verlauf, Sicherheitsplan und Testcheckliste sind kontogetrennt. Alte, unklar zugeordnete Browserdaten werden nicht automatisch einem Konto zugewiesen und wurden nicht gelöscht.
- Lokale Kontotrennung ist keine lokale Verschlüsselung. Der vorhandene Offline-Cache kann Daten unverschlüsselt auf dem Gerät enthalten; keine echten Gesundheitsdaten auf gemeinsam verwendeten Testgeräten eingeben.
- Neue Verschlüsselungsfehler erzeugen keinen Base64-Klartext-Ersatz mehr. Alte Formate bleiben für bestehende Daten lesbar. Die bestehende vorhersehbare Schlüsselableitung wurde aus Kompatibilitätsgründen nicht migriert: Für produktive Gesundheitsdaten muss die serverseitige Schlüsselverwaltung fachlich geprüft und umgestellt werden.
- Feedback ist standardmäßig pausiert (`VITE_FEEDBACK_ENABLED=false`). Nicht aktivieren, bevor Datenschutzhinweise, Rechtsgrundlage, Verfahren, Zugriffsrechte und Löschfristen geklärt sind. Eine Frontend-Sperre ersetzt keine Prüfung der Datenbankregeln.
- Keine Änderung am Namen, keine neue generative KI, keine diagnostischen oder therapeutischen Versprechen, keine Änderungen an Live-Datenbankregeln.

## Technische Prüfung

Abschlussprüfung: 64 Tests in 12 Dateien bestanden; Typprüfung und Produktionsbuild erfolgreich. Codeprüfung ohne Fehler, mit 43 bestehenden Typwarnungen in älteren Diensten. Paketprüfung ohne gemeldete bekannte Sicherheitslücken. Im Browser wurden Tages-/Wochenboni, Wiederholungen, Pausieren, Neuladen, Testauswahl, gesperrtes Feedback und die sofort startende Atemhilfe geprüft; keine Browserfehler. Mobile Demo bei 390 px ohne horizontales Überlaufen.

`npm run test:run`, `npm run type-check`, `npm run lint` und `npm run build` ausführen. Der Linter prüft App und API, nicht erzeugte Vercel-Artefakte. Windows-/Unix-Zeilenenden werden akzeptiert. Bestehende Typwarnungen in älteren Diensten bleiben sichtbar.

Automatisierte Kontospeicherungs- und Verschlüsselungstests verwenden isolierte Ersatzdienste, keine Live-Konten. Vor einer Veröffentlichung mit echten Nutzerdaten sind mindestens zwei getrennte Testkonten, Datenbank-Zugriffsregeln, RPC-Berechtigungen, Auth-Wechsel, Offline-Wiederverbindung und geräteübergreifende Konflikte mit harmlosen Beispielen zu prüfen.

Der Produktionsbuild enthält weiterhin ein großes Avatarbild und relativ große JavaScript-Pakete. Weitere Ladezeitoptimierung ist sinnvoll; die Buildwarnung ist keine fehlgeschlagene Erstellung.

GitHub-/Vercel-Veröffentlichung erfolgt erst nach gesonderter Freigabe. Vorhandene fremde Änderungen und gelöschte Dateien im Arbeitsverzeichnis bleiben erhalten; nur die drei für den Build erforderlichen, zuvor vorhandenen Bilddateien wurden aus Git wiederhergestellt.
