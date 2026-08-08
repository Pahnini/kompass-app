# Nova 0.1 einrichten

Nova läuft über die Vercel Function `api/nova.ts`. Standardmäßig verwendet sie den kostenlosen
Regelmodus. Dieser Modus braucht keinen externen KI-Anbieter und erzeugt keine Modellkosten.

## Vercel-Umgebungsvariablen

Für den kostenlosen Testmodus:

- `NOVA_MODE=rules` (optional, `rules` ist der sichere Standard)
- `SUPABASE_URL`: URL des vorhandenen Supabase-Projekts
- `SUPABASE_PUBLISHABLE_KEY`: Publishable Key des Supabase-Projekts

Im Browser werden weiterhin `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` benötigt.
Die bisherige Variable `VITE_SUPABASE_ANON_KEY` wird vorübergehend noch als Fallback akzeptiert.

## Optionaler OpenAI-Modus

Der kostenpflichtige Modus wird nur aktiv, wenn beide Bedingungen erfüllt sind:

- `NOVA_MODE=openai`
- ein gültiger `OPENAI_API_KEY` ist serverseitig vorhanden

`OPENAI_MODEL` ist optional; Standard ist `gpt-5.6-luna`. Der OpenAI-Schlüssel darf nie als
`VITE_...`-Variable angelegt werden. Fehlt der Schlüssel, fällt Nova sicher auf den Regelmodus
zurück.

## Datenschutz und Grenzen

- Nova 0.1 speichert keine vollständigen Chats in der App oder Datenbank.
- Im Regelmodus verlassen Nachrichten den geschützten Nova-Endpunkt nicht für einen Modelldienst.
- Der Endpunkt akzeptiert Chat-Anfragen nur von angemeldeten Supabase-Nutzern und begrenzt
  Anfragen pro Nutzer.
- Nova kann genau vier App-Ziele vorschlagen: Skills, Mood-Kompass, Meine Ziele und
  Hilfekontakte. Die Navigation erfolgt erst nach einem Klick.
- Direkte Krisenformulierungen werden vor jeder weiteren Verarbeitung abgefangen und auf echte
  Hilfe sowie 112 verwiesen. Das ist kein Versprechen zuverlässiger Krisenerkennung.
- Der Regelmodus stellt keine Diagnosen und führt keine autonome Therapie durch.

## Lokal testen

Für die vollständige lokale Prüfung inklusive Function Vercel Dev verwenden und die
Supabase-Variablen in einer nicht eingecheckten lokalen Environment-Datei setzen. Für den
Regelmodus wird kein OpenAI-Schlüssel benötigt. Niemals echte Schlüssel in `.env.example`,
Quellcode oder Browser-Variablen eintragen.
