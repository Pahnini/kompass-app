# Punkte und Arcade – Teststand 7. Oktober 2026

## Was fertig ist

- Konto: Arcade über die Seitenleiste, die Tagesaufgaben oder die Erfolge öffnen (`/arcade`).
- Ohne Anmeldung: getrennte Testversion unter `/arcade-demo`, mit Demopunkten aus `/demo`.
- Orbit Memory wird bei 20 XP, Lichter aus bei 60 XP und Drei gewinnt bei 120 XP freigeschaltet. XP werden nicht ausgegeben; freigeschaltete Spiele bleiben bei Pausen zugänglich.
- Die Spiele haben kein Zeitlimit, keine Werbung, keine Rangliste und vergeben keine XP. Es gibt keinen Anreiz zum endlosen Punkte-Farmen.
- Memory: zwölf Karten, sechs Paare, Züge und Bestwert; falsche Paare werden erst nach Weiter ausgeblendet.
- Lichter aus: neun Felder, garantiert lösbare Startstellungen, optionaler Tipp und Bestwert.
- Drei gewinnt: gegen einen kleinen regelbasierten Computergegner, mit Sieg/Unentschieden/Niederlage und Neustart.
- Spiele werden erst beim Öffnen nachgeladen, keine neuen Abhängigkeiten oder externen Spieleanbieter.
- Klarere Punkterückmeldung, höchstens drei Tagesboni auch nach Wechsel der Auswahl, begrenzte Aktionspunkte und Schutz gegen doppelte Belohnung bei rückwärts gestelltem Gerätedatum.
- Fehlgeschlagene Kontospeicherung bleibt sichtbar und kann erneut versucht werden, ohne neue XP zu vergeben. Bei fehlender Verbindung wird die Punktespeicherung pausiert und beim Online-Ereignis erneut versucht.

## Punkte erklärt

Eine abgeschlossene Aktion bringt 5 XP: ein Check-in oder Gedanke pro Tag; maximal drei unterschiedliche Skills und drei unterschiedliche Ziele pro Tag. Ausgewählte Tagesaufgaben bringen jeweils 15 Bonus-XP, maximal drei Tagesboni. Wochenboni: drei unterschiedliche Skills +50 XP; Check-ins an zwei unterschiedlichen Tagen +40 XP. Auch neutrale Handlungen wie eine Übung oder ein selbst gewähltes Ziel können freischalten: Es müssen keine persönlichen Gesundheitsdaten eingegeben werden.

## Regulärer Demotest

1. Unter `/demo` den eigenen Testfortschritt zurücksetzen.
2. Einen Beispiel-Check-in abschließen: 20 XP. Wiederholung bleibt bei 20 XP.
3. Arcade öffnen: nur Memory ist spielbar, die anderen Spiele gesperrt.
4. Wieder Aufgaben öffnen und drei verschiedene Demo-Skills abschließen: 100 XP. Jetzt ist auch Lichter aus frei.
5. Die Tagesaufgabe „Ein Gedanke für dich“ auswählen, einen harmlosen Beispielsatz tippen und den Demo-Eintrag abschließen: 120 XP. Alle drei Spiele sind frei. Der Satz wird im Demobereich nicht gespeichert.
6. Eine Spielrunde abschließen, schließen und neu laden. XP bleiben unverändert, freigeschaltete Spiele und Spielergebnisse bleiben sichtbar.
7. Gamification pausieren und erneut Arcade öffnen: freigeschaltete Spiele bleiben zugänglich.
8. Tastatur: mit Tab navigieren, mit Enter oder Leertaste spielen; mit „Spiel schließen“ zurück zur auslösenden Schaltfläche.

## Speicherung und Grenzen

Die Kontopunkte benutzen den bestehenden Datendienst. Aktivitätsnachweise, Aufgaben und Arcade-Spielergebnisse sind im Browser pro Konto getrennt; die Demo verwendet einen eigenen Bereich. Spielergebnisse enthalten nur Spielkennung, Zahl gewonnener/gelöster Runden und optional einen Bestwert – keine Notizen, Stimmungswerte oder Chatdaten. Das Zurücksetzen der Demoaufgaben löscht nicht automatisch die separaten Spielergebnisse.

Dies ist weiterhin eine Testimplementierung mit clientseitigen XP, keine serverseitig abgesicherte Prämienwährung. Sie darf nicht für Geld, echte Preise oder Zugriffsrechte auf Hilfe verwendet werden. Parallele Änderungen auf mehreren Geräten sind nicht atomar zusammengeführt. Es gibt keine vollständige geräteübergreifende Synchronisation. LocalStorage ist keine verschlüsselte Speicherung.

Die echte Supabase-Kontospeicherung und die Offline-Wiederverbindung sind in diesem Durchlauf nicht mit Live-Testkonten abgenommen; die automatisierten Tests verwenden isolierte Ersatzdienste. Die zuvor dokumentierte serverseitige Schlüsselverwaltung und Prüfung der Datenbankrechte bleiben offen. Es wurden keine Live-Datenbankregeln oder Geheimnisse geändert und nichts auf GitHub/Vercel veröffentlicht.

## Prüfnachweise

Abschluss: 82 Tests in 15 Dateien bestanden; Typprüfung und Build erfolgreich. Codeprüfung ohne Fehler; 43 bestehende Typwarnungen in älteren Diensten. Spiele als getrennte kleine JavaScript-Pakete erstellt. Der bestehende große Startseiten-Chunk bleibt als Buildwarnung sichtbar.

Die aktuelle Paketprüfung meldet einen moderaten Hinweis über sprintf-js → argparse → mammoth (drei betroffene Pakete, kein neuer Arcade-Baustein): [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c). Laut Advisory gibt es noch keine korrigierte Version. Die npm-Empfehlung ist ein drastisches Downgrade des Word-Imports auf mammoth 0.3.29 und wurde nicht blind ausgeführt. Im untersuchten Frontend-Build wurden weder sprintf noch der argparse-Parser gefunden; die Arcade-Spiele importieren mammoth nicht. Das ersetzt keine umfassende Sicherheitsprüfung des bestehenden Word-Imports.

Die automatisierten Tests decken Freischaltgrenzen, gesperrte Spiele, Punktelimits, Datumsschutz, Lösbarkeit, Computerzüge, Spielabschlüsse, Speicherung, Demo-Kontotrennung, pausierte Gamification und Wiederholung nach Speicherfehlern ab. Im Browser wurden der normale Freischaltweg von 0 bis 120 XP und vollständige Runden aller drei Spiele geprüft; Memory-Ergebnis nach Neuladen erhalten, XP unverändert, keine Browserfehler. Mobile Prüfung mit 390 px Breite sowie Tastaturaktivierung.

Aktuelle SDK-Grundlagen wurden geprüft: [Supabase getSession](https://supabase.com/docs/reference/javascript/auth-getsession), [Supabase Changelog](https://supabase.com/changelog), [React: Effects und Ereignisse](https://react.dev/learn/you-might-not-need-an-effect). Bestehende APIs wurden beibehalten. Verwendete React-Prüfliste: nachgeladene Spiele, reine Spiellogik, Seiteneffekte nur in Ereignissen/gezielten Effekten, Tastatur und lesbare Zustandsbeschriftungen.

Zum Starten im Projektordner: `npm run dev`. Prüfung: `npm run test:run`, `npm run type-check`, `npm run lint`, `npm run build`.
