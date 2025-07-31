# Vergleich: Self-Hosting vs. Managed Hosting (Vercel/Supabase)

## 1. Architektur & Roadmap-Kontext

- Die Kompass-App ist als statische PWA mit React/Vite konzipiert, optimal für statisches Hosting (z.B. Nginx, Vercel, Netlify, S3+CloudFront).
- Datenhaltung aktuell über Supabase (DBaaS, Postgres-basiert), Hybrid-Ansatz möglich.
- CI/CD, Monitoring, Security und Accessibility sind als Pflichtbestandteile in der Roadmap dokumentiert.

---

## 2. Vergleich: Self-Hosting vs. Managed Hosting

| Kriterium                    | Self-Hosting (Docker, Nginx, Ubuntu)             | Managed (Vercel, Supabase)            |
| ---------------------------- | ------------------------------------------------ | ------------------------------------- |
| **Setup & Wartung**          | Aufwendiger, volle Kontrolle, mehr Verantwortung | Sehr einfach, wenig Wartung           |
| **Automatisierung**          | Voll automatisierbar (CI/CD, Ansible, Docker)    | Out-of-the-box CI/CD, Preview Deploy  |
| **Sicherheit**               | Volle Kontrolle, Security by Design möglich      | Gute Defaults, aber weniger Kontrolle |
| **Datenschutz/DSGVO**        | Standort, Verschlüsselung, AVV selbst wählbar    | EU-Region, AVV möglich, aber Vendor   |
| **Kosten**                   | Fixkosten (Server, Wartung), Zeitaufwand         | Pay-as-you-go, evtl. teurer bei Scale |
| **Skalierung**               | Manuell, aber flexibel (später Cloud/K8s)        | Automatisch, aber limitiert           |
| **Monitoring**               | Eigene Tools (Prometheus, Grafana, Loki)         | Eingeschränkt, meist extern nötig     |
| **Backups**                  | Selbst einrichten und testen                     | Automatisch bei Supabase              |
| **Vendor-Lock-in**           | Minimal, volle Migrationsfreiheit                | Höher, Abhängigkeit von Plattform     |
| **Rechtliche Anforderungen** | Volle Kontrolle, ideal für Gesundheitsdaten      | DSGVO-konform, aber weniger flexibel  |
| **Zukunftssicherheit**       | Sehr hoch, da offen für Erweiterungen            | Gut, aber limitiert durch Anbieter    |

---

## 3. Supabase vs. Eigene Postgres-Instanz

| Kriterium              | Supabase (DBaaS)                            | Eigene Postgres-Instanz                  |
| ---------------------- | ------------------------------------------- | ---------------------------------------- |
| **Setup & Wartung**    | Schnell startklar, wenig Wartung            | Aufwendig, volle Kontrolle               |
| **Sicherheit**         | Automatische Patches, Backups, EU-Region    | Volle Kontrolle, aber Eigenverantwortung |
| **DSGVO/AVV**          | Möglich, AVV abschließen, Privacy-Settings  | Volle Kontrolle, AVV mit Hoster          |
| **Kosten**             | Pay-as-you-go, evtl. teuer bei viel Traffic | Fixkosten, aber planbar                  |
| **Monitoring**         | Eingeschränkt, meist extern nötig           | Volle Kontrolle, eigene Tools            |
| **Backups**            | Automatisch                                 | Selbst einrichten                        |
| **Vendor-Lock-in**     | Mittel, API-abhängig                        | Minimal                                  |
| **Zukunftssicherheit** | Gut, aber Plattform-abhängig                | Sehr hoch, volle Flexibilität            |

---

## 4. Rechtliche Anforderungen (DSGVO, BDSG, KJDS, TMG, ISO 27001)

- Datenbank und App in der EU hosten, idealerweise in Deutschland
- AVV mit Supabase oder eigenem Hoster abschließen
- Verschlüsselung (at rest & in transit), Zugriffskontrolle, Logging, regelmäßige Security-Audits
- Kindgerechte, verständliche Datenschutzerklärung und Nutzungsbedingungen
- Datenminimierung, Rechte auf Auskunft/Löschung, Eltern-Einwilligung für Minderjährige

---

## 5. Empfehlung

- **Self-Hosting** ist für maximale Kontrolle, Datenschutz und Anpassbarkeit top – aber nur, wenn Security und Wartung dauerhaft sichergestellt werden können.
- **Supabase** ist für viele Projekte ausreichend sicher und viel einfacher zu betreiben.
- Automatisiere alles (CI/CD, Monitoring, Backups), dokumentiere das Setup und halte Security und Datenschutz immer im Blick.

---

_Erstellt am 31.07.2025 – für Teamdiskussion und Entscheidungsfindung_
