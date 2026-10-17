# Microsoft Store – Einreichung

Stand: 17.10.2026 · App: Chemistry Mystery (`de.aitarek.chemistrymystery`)

---

## 0. Was bereits erledigt ist

| Punkt | Status |
|---|---|
| Entwicklerkonto (Individual, kostenlos) | ✅ von dir angelegt |
| App als installierbare PWA (Service Worker + Manifest) | ✅ `vite-plugin-pwa` eingebaut |
| Icons in allen Store-Größen | ✅ `npm run build` erzeugt sie |
| MSIX-Grafiken (44/50/150/300/310 px, Wide, Splash) | ✅ `store-assets/msix/` |
| Produktions-Build | ✅ `dist/` (957 KiB vorgecacht, offlinefähig) |
| Öffentliche HTTPS-URL | ✅ https://revucio24-web.github.io/chemistry-mystery/ |
| Screenshots fürs Listing | ❌ fehlen |

Icons neu erzeugen: `python scripts/make-store-icons.py`
Build neu erzeugen: `npm run build` (Achtung: braucht freien Zugriff auf Unterprozesse, siehe unten)

---

## 1. Hosting – erledigt (GitHub Pages)

**Live:** https://revucio24-web.github.io/chemistry-mystery/
**Repo:** https://github.com/revucio24-web/chemistry-mystery (öffentlich – bei GitHub Pages im Free-Plan Voraussetzung)

Deployment läuft automatisch: `.github/workflows/deploy.yml` baut bei jedem Push auf `master` und veröffentlicht `dist/`.
Prüfen, ob alles erreichbar ist:

```bash
node scripts/verify-pages.mjs
```

Ergebnis vom 17.10.2026: HTML, Manifest (`application/manifest+json`), Service Worker (9 Precache-Einträge) und beide Icons liefern HTTP 200.

Was auf GitHub Pages geprüft werden musste: `base: './'` sorgt dafür, dass alle Pfade auch im Unterpfad `/chemistry-mystery/` funktionieren – inklusive Service-Worker-Scope. Deshalb ging es ohne Anpassung.

> ⚠️ Die URL steckt **fest im MSIX-Paket** (Start-URL). Ein späterer Wechsel auf eine eigene Domain bedeutet: neues Paket, neue Einreichung. Wenn `aitarek.de` irgendwann läuft, ist ein Umzug über eine Custom Domain bei GitHub Pages möglich – aber eben mit neuer Paketversion.

---

## 2. MSIX-Paket bauen (PWABuilder)

1. https://www.pwabuilder.com → URL eingeben → **Package for stores**
2. Plattform **Windows** → **MSIX**
3. Diese Felder müssen **exakt** zu deinem Partner-Center-Konto passen:

| Feld | Wert | Woher |
|---|---|---|
| Package Identity Name | `Tareksworld.Chemistry-Mystery` | Partner Center → Produktidentität |
| Publisher Display Name | `Tareksworld` | Partner Center → Produktidentität |
| Publisher ID | `CN=C66DC2A2-DC8A-4BA2-B165-6E231E76ECF2` | Partner Center → Produktidentität |
| Version | `1.0.0.0` | frei wählbar, muss steigen |

Eingetragene URL: `https://revucio24-web.github.io/chemistry-mystery/`

4. Herunterladen: `.msixupload` + ein Ordner mit den Store-Grafiken.

> Der Identity Name lässt sich **nach der Veröffentlichung nicht mehr ändern**. Jetzt festlegen.

---

## 3. Store-Listing (fertige Texte)

### Produktname
```
Chemistry Mystery: Chemie-Labor
```
*(identisch zum Google-Play-Namen – Marke konsistent halten)*

### Kurzbeschreibung / Untertitel
```
Chemie für Kinder: Atome, PSE, Moleküle, Reaktionen & tägliche Belohnungen!
```

### Beschreibung (max. 10.000 Zeichen)

```
🧪 Willkommen bei Chemistry Mystery – dem interaktiven Chemie-Rätsellabor für junge Forscherinnen und Entdecker!

Tauche ein in die Welt der Atome, Moleküle und chemischen Reaktionen! Begleite Kater Sparky durch 8 geheimnisvolle Labore, meistere 36 Missionen und lüfte das Geheimnis der chemischen Elemente. Hier wird nicht geraten: Bei jedem Rätsel erfährst du mit verständlichen Erklärungen, wie unsere materielle Welt wirklich funktioniert.

🌟 DAS ERWARTET DICH:

🔬 8 INTERAKTIVE LABORE ZUM FREISCHALTEN
• Elementarlabor – die grundlegenden Bausteine
• Atomkammer – Atome aus Protonen, Neutronen und Elektronen bauen
• Molekülwerkstatt – Wasser, Kohlendioxid, Kochsalz und Methan synthetisieren
• Reaktionsraum – chemische Gleichungen ins Gleichgewicht bringen
• Kristallarchiv – Gitterstrukturen, Edelsteine und Mineralien
• Wasserstation – Dichteanomalie, pH-Werte, Oberflächenspannung
• Umweltlabor – Treibhauseffekt, Ozonschicht, saurer Regen
• Geheimes Forschungslabor – Detektivfälle und spektakuläre Synthesen

🎮 8 RÄTSELTYPEN
1. Element-Zuordnung
2. Molekül-Baukasten
3. Atomschleusen-Code
4. Reaktions-Gleichgewicht
5. Laborstoff-Analytik
6. Periodensystem-Quiz
7. Chemischer Meister-Detektiv
8. Wahr-oder-Falsch-Checks

💎 FORSCHER-BELOHNUNGSSYSTEM
• Forscher-Kristalle bei jeder gelösten Mission
• Täglicher Bonus – an Tag 7 winkt der Goldene Meisterkristall
• Titel und Ränge: vom „Junior-Entdecker" bis zum „Ehren-Chemiker von Sparky"

📚 LEXIKON & PERIODENSYSTEM
• Kindgerechtes Periodensystem der Elemente, jederzeit griffbereit
• Kinderlexikon mit Alltagserklärungen und Element-Superkräften
• Maskottchen Sparky steht bei jeder Mission mit Tipps zur Seite

🛡️ KINDERSICHER
• 0 % Werbung
• 0 % In-App-Käufe – alle Inhalte dauerhaft frei
• 100 % offline spielbar nach dem ersten Start
• Keine Datenerhebung, kein Tracking, keine Registrierung

Geeignet ab 6 Jahren, für Schülerinnen und Schüler der Klassen 3 bis 8 und alle neugierigen Wissenschafts-Fans.
```

### Produktfeatures (Bullet-Liste)
- 36 Missionen in 8 Laboren, 4 Schwierigkeitsgrade
- Didaktisch erklärt statt nur richtig/falsch
- Komplett offline, keine Werbung, keine Käufe
- Kein Tracking, keine Registrierung
- Dein Spielstand bleibt auf deinem Gerät

### Systemanforderungen
```
Windows 10 (Version 1809) oder neuer, x64 / ARM64, 4 GB RAM, 200 MB Speicher
Internet nur beim ersten Start nötig
```

### Weitere Pflichtfelder
| Feld | Wert |
|---|---|
| Kategorie | Bildung (Primary) |
| Preis | Kostenlos |
| Märkte | Alle |
| Altersfreigabe | IARC-Fragebogen → keine Gewalt, kein Glücksspiel, keine Käufe → **USK 0 / PEGI 3** |
| Datenschutz-URL | `https://<deine-domain>/privacy` (Datei: `store-assets/PRIVACY_POLICY.html`) |
| Support-Kontakt | `support@aitarek.de` |
| Website | `https://aitarek.de` |
| Copyright | `© 2026 AITarek` |

---

## 4. Grafiken

| Asset | Datei |
|---|---|
| Store-Logo 300×300 | `store-assets/msix/StoreListingLogo-300.png` |
| MSIX-Assets (alle) | `store-assets/msix/` |
| Feature-Grafik | `store-assets/featured-graphic-1024x500.png` |
| Screenshots | **fehlen** – mind. 1, 1366×768 oder größer |

**Screenshots aufnehmen:** App im Browser öffnen, Fenster auf 1366×768 ziehen, mit `Win + Shift + S` Bereich aufnehmen. Sinnvoll: Startbildschirm, ein Rätsel, Periodensystem, Belohnungs-Screen.

---

## 5. Offene Punkte, die ich mit dir klären muss

1. **Markenname.** Im Code heißen drei Dinge anders: Manifest `Chemistry Mystery`, `<title>` `Elementar – Das große Chemie-Abenteuer`, Play-Listing `Chemistry Mystery: Chemie Labor`. Microsoft prüft, ob Listing und App übereinstimmen. Empfehlung: überall „Chemistry Mystery", „Elementar" als Untertitel.
2. **Google Fonts.** `index.html` lädt Schriften von `fonts.googleapis.com`. Das überträgt die IP jedes Nutzers an Google – im Widerspruch zur Datenschutzerklärung („keine Datenübertragung") und bei einer Kinder-App heikel. Fix: Schriften lokal bündeln (~200 KB).
3. **aitarek.de löst nicht auf.** Die Domain aus der Datenschutzerklärung ist aktuell nicht erreichbar. Datenschutz-URL und Support-Website brauchen aber eine echte, erreichbare Adresse.
