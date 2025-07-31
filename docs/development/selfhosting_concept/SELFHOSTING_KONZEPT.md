# Self-Hosting Architektur & Betriebsplan – Kompass-App

## 1. Zielsetzung & Rahmenbedingungen

- Maximale Kontrolle über Datenschutz, Security und Betrieb
- DSGVO, BDSG, KJDS, TMG, ISO 27001 als Leitplanken
- Automatisierung, Monitoring, Backups und Wartbarkeit als Pflicht
- App muss 24/7 verfügbar sein, Wartungsfenster nachts, Notfallmodus bei Ausfällen

---

## 2. Hardware- & Hosting-Empfehlung

- **Produktivserver:**
  - 4 vCPU, 16 GB RAM, 250 GB SSD (NVMe, RAID1 empfohlen)
  - Standort: Deutschland/EU, zertifiziertes Rechenzentrum
- **Backup-Server (Offsite):**
  - 2 vCPU, 4 GB RAM, 100 GB SSD, anderer Standort/Provider

---

## 3. Architekturübersicht (Docker Compose)

- **Nginx** (Reverse Proxy, TLS, IPv6, Security)
- **App-Container** (statisches Frontend, React/Vite)
- **Postgres-DB** (persistente Daten, lokale SSD)
- **Prometheus, Grafana, Alertmanager** (Monitoring, Alarme, Dashboards)
- **Mailserver/SMTP-Relay** (msmtp/Postfix, nur ausgehend)
- **Backup-Agent** (Borg/Restic, verschlüsselt, versioniert)
- **Security-Tools:**
  - Firewall (ufw), Fail2Ban, automatisierte Updates, zentrale Logs

---

## 4. Backup- & Restore-Konzept

- **Lokal:**
  - Tägliche Snapshots (DB, App-Daten), 2 Wochen Aufbewahrung
- **Offsite:**
  - Wöchentliche, verschlüsselte Backups auf externen Server/S3, 3 Monate Aufbewahrung
- **Automatisierung:**
  - Cronjobs/Backup-Container, Monitoring der Backup-Jobs
- **Restore-Test:**
  - Monatlich, dokumentiert

---

## 5. Secrets-Management

- **.env-Dateien** (600, nicht ins Repo)
- **Zugriff:** Nur Admins/CI, Rotation bei Teamwechsel/Verdacht
- **Optional:** Vault-Lösung für größere Teams

---

## 6. Monitoring & Security

- **Prometheus:** Server, App, DB, Nginx, Backups
- **Grafana:** Dashboards für Health, Traffic, Fehler, Security
- **Alertmanager:** E-Mail/Push bei Ausfällen, Backup-Fehlern, Security-Events
- **Security:**
  - Firewall (nur 80/443/25/587 offen), Fail2Ban, regelmäßige Updates, Let’s Encrypt, Logging zentral

---

## 7. Mail

- **SMTP-Relay** (msmtp/Postfix) für App-Mails
- **DNS:** SPF, DKIM, DMARC beim Domain-Anbieter
- **Monitoring:** Mail-Queue, Zustellung

---

## 8. Wartung & Verfügbarkeit

- **Wartungsfenster:** Automatisierte Updates nachts (3 Uhr), Rolling-Deploys
- **Notfall-Funktionen:** Offline-Modus (PWA), Failsafe-Seite bei DB-Ausfall

---

## 9. Beispiel: Docker Compose Struktur

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:stable
    # ...Konfiguration...
  app:
    image: kompass-app:latest
    # ...Konfiguration...
  db:
    image: postgres:16
    # ...Konfiguration...
  prometheus:
    image: prom/prometheus
    # ...Konfiguration...
  grafana:
    image: grafana/grafana
    # ...Konfiguration...
  alertmanager:
    image: prom/alertmanager
    # ...Konfiguration...
  mail:
    image: bytemark/smtp
    # ...Konfiguration...
  backup:
    image: borgbackup/borg
    # ...Konfiguration...
```

_(Details und Beispiel-Konfigurationen können nach Bedarf ergänzt werden.)_

---

## 10. Betrieb & Dokumentation

- **Onboarding-Doku:** Setup, Secrets, Backup/Restore, Monitoring, Wartung
- **Checklisten:** Security, Datenschutz, Release, Backup-Test
- **Automatisierung:** CI/CD für Deploy, Tests, Linting, Security-Checks

---

## 11. Rechtliches & Datenschutz

- **AVV** mit Hoster abschließen
- **Daten in EU/DE** speichern
- **Verschlüsselung** (at rest & in transit)
- **Kindgerechte Datenschutzerklärung**
- **Datenminimierung, Eltern-Einwilligung, Auskunft/Löschung**

---

## 12. Fazit & Empfehlung

- Self-Hosting ist für maximale Kontrolle und Datenschutz ideal, aber nur mit konsequenter Automatisierung und Security.
- Regelmäßige Audits, Backup-Tests und Doku sind Pflicht.
- Bei Ressourcen- oder Knowhow-Engpässen ist Supabase/Managed Hosting eine valide Alternative.

---

**Letzte Aktualisierung: 31.07.2025 – für Teamdiskussion, Umsetzung und Audits**
