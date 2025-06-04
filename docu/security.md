# Sicherheitsstandards

Das HON-KI-Cockpit (<https://github.com/chmstr/ai-cockpit>) erfüllt die vom BSI entwickelten Sicherheitsstandards wie folgt:

## Analyse von Risiken und Auswahl sowie Umsetzung geeigneter Schutzmaßnahmen gemäß BSI IT-Grundschutz

Die Analyse von Risiken ist elementarer Teil des Vorgehensmodell zum Einsatz des KI-Cockpits, dazu zählen sowohl Risiken, die sich auf das beobachtete KI-System als auch das KI-Cockpit selbst beziehen. Die Dokumentation der Risiken sowie Umsetzung geeigneter Schutzmanßnahmen wird als Maßnahmen im KI-Cockpit vorgenommen und dokumentiert.

## BSI-Leitfaden für sichere KI-Systementwicklung

Das System arbeitet nach dem Prinzip der geringsten Rechte, d.h. es können einzelnen Usern nur Rollen übertragen werden, welche unbedingt nötig sind (z.B. nur Lese oder auch Schreibrechte für einzelne Mandanten).

## Kontinuierliche Überprüfung und Verbesserung

Informationssicherheit ist kein einmaliges Projekt, sondern ein fortlaufender Prozess, d.h. das OpenSource-Projekt stellt sicher, dass jederzeit Audits des kompletten SoureCodes vorgenommen werden können.

## Dokumentation

Die vorhandene Dokumentation zur Installation, Konfiguration und zum technischen Konzept stellt die Nachvollziehbarkeit der getroffenen Entscheidungen sicher. Alle relevante Aktionen im KI-Cockpit selbst werden im Backend mitgeloggt und stehen für sicherheitskritische Auswertungen bereit.

## Informationssicherheits-Managementsystems

Das KI-Cockpit ist vom Betreiber im Rahmen des Einsatzes in der eigenen Systemlandschaft in das Informationssicherheits-Managementsystems (ISMS) einzubinden.

## Zertifizierungen

Das verwendete Backend-Projekt appwrite.io, welche für die Datenpersistenz zuständig ist, verfügt über zahlreiche internationale Zertifizierungen wie: GDPR, PCI, SOC2, HIPAA, CCPA (<https://appwrite.io/docs/advanced/security>)
