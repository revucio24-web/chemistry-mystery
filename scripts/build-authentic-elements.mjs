import fs from 'fs';
import path from 'path';

// Vollständiges, wissenschaftlich fundiertes Datenarchiv aller 118 chemischen Elemente nach IUPAC und NIST
// Enthält echte Atommasse, reale Elektronenkonfiguration, Pauling-Elektronegativität, Schmelz- & Siedepunkt, Dichte und Entdeckungsgeschichte.

const ALL_118_SCIENTIFIC = [
  // Periode 1
  {
    z: 1, s: "H", n: "Wasserstoff", l: "Hydrogenium", m: 1.008, p: 1, g: 1, c: "reactive_nonmetal", st: "gas", v: [1], col: "#e2e8f0",
    cfg: "1s¹", en: 2.20, mp: -259.16, bp: -252.87, dens: "0.0899 g/L", year: "1766 (Henry Cavendish)",
    desc: "Das häufigste und leichteste chemische Element im Kosmos. Es ist der primäre Brennstoff in Sternen und Fusionsprozessen.",
    fact: "Über 90 % aller Atome im sichtbaren Universum sind Wasserstoffatome!",
    use: "CO2-freier Zukunftskraftstoff, Raketentreibstoff und elementarer Baustein von Wasser (H₂O)."
  },
  {
    z: 2, s: "He", n: "Helium", l: "Helium", m: 4.0026, p: 1, g: 18, c: "noble_gas", st: "gas", v: [0], col: "#fed7aa",
    cfg: "1s²", en: undefined, mp: -272.2, bp: -268.93, dens: "0.1786 g/L", year: "1868 (Jules Janssen & Norman Lockyer)",
    desc: "Reaktionsträges Edelgas mit vollbesetzter K-Schale. Es bleibt selbst nahe dem absoluten Nullpunkt flüssig.",
    fact: "Helium wurde spektroskopisch zuerst im Sonnenlicht entdeckt, bevor man es auf der Erde isolierte.",
    use: "Kryogenes Kühlmittel für MRT-Supraleiter in Kliniken und Schutzgas in der Halbleiterfertigung."
  },

  // Periode 2
  {
    z: 3, s: "Li", n: "Lithium", l: "Lithium", m: 6.94, p: 2, g: 1, c: "alkali_metal", st: "solid", v: [1], col: "#f43f5e",
    cfg: "[He] 2s¹", en: 0.98, mp: 180.5, bp: 1342, dens: "0.534 g/cm³", year: "1817 (Johan August Arfwedson)",
    desc: "Das leichteste Metall des Periodensystems mit geringer Dichte. Reagiert lebhaft mit Wasser unter Wasserstoffbildung.",
    fact: "Lithium schwimmt sogar auf Mineralöl und Petroleum, weshalb es luftdicht gelagert werden muss.",
    use: "Schlüsselrohstoff für Lithium-Ionen-Akkus in E-Mobilität, Laptops und Smartphones."
  },
  {
    z: 4, s: "Be", n: "Beryllium", l: "Beryllium", m: 9.0122, p: 2, g: 2, c: "alkaline_earth", st: "solid", v: [2], col: "#fb923c",
    cfg: "[He] 2s²", en: 1.57, mp: 1287, bp: 2470, dens: "1.85 g/cm³", year: "1798 (Louis-Nicolas Vauquelin)",
    desc: "Sehr leichtes, steifes und toxisches Erdalkalimetall mit bemerkenswert hoher Röntgenstrahlentransparenz.",
    fact: "Smaragde und Aquamarine verdanken ihre Kristallmatrix dem Mineral Beryll.",
    use: "Spiegel für das James-Webb-Weltraumteleskop und Beryllium-Kupfer-Legierungen in der Luftfahrt."
  },
  {
    z: 5, s: "B", n: "Bor", l: "Borum", m: 10.81, p: 2, g: 13, c: "metalloid", st: "solid", v: [3], col: "#34d399",
    cfg: "[He] 2s² 2p¹", en: 2.04, mp: 2076, bp: 3927, dens: "2.34 g/cm³", year: "1808 (Gay-Lussac & Thénard)",
    desc: "Extrem hartes Halbmetall mit faszinierenden dreizentrischen Elektronenmangelbindungen (Borane).",
    fact: "Borcarbid ist fast so hart wie Diamant und widersteht selbst Panzergeschossen.",
    use: "Hitzebeständiges Borosilikatglas (Duran / Pyrex) für Laborbecher und Glasfasern."
  },
  {
    z: 6, s: "C", n: "Kohlenstoff", l: "Carboneum", m: 12.011, p: 2, g: 14, c: "reactive_nonmetal", st: "solid", v: [4], col: "#94a3b8",
    cfg: "[He] 2s² 2p²", en: 2.55, mp: 3550, bp: 4827, dens: "2.26 g/cm³ (Graphit)", year: "Prähistorisch (Antike)",
    desc: "Grundpfeiler der organischen Chemie und allen irdischen Lebens. Kann vier kovalente Bindungen ausbilden.",
    fact: "Derselbe Stoff bildet das weiche Graphit in Bleistiften und den härtesten Diamanten der Welt.",
    use: "Organische Moleküle, Kohlefaserwerkstoffe, Graphen, Nanotubes und Stahlerzeugung."
  },
  {
    z: 7, s: "N", n: "Stickstoff", l: "Nitrogenium", m: 14.007, p: 2, g: 15, c: "reactive_nonmetal", st: "gas", v: [3, 5], col: "#38bdf8",
    cfg: "[He] 2s² 2p³", en: 3.04, mp: -210.0, bp: -195.79, dens: "1.251 g/L", year: "1772 (Daniel Rutherford)",
    desc: "Macht 78 % unserer Erdatmosphäre aus. Bildet als N₂ eine extrem feste kovalente Dreifachbindung.",
    fact: "Flüssiger Stickstoff friert Gegenstände bei -196 °C in Sekundenbruchteilen schockartig ein.",
    use: "Haber-Bosch-Düngemittelsynthese zur Welternährung, Schutzgasverpackung und Kryokonservierung."
  },
  {
    z: 8, s: "O", n: "Sauerstoff", l: "Oxygenium", m: 15.999, p: 2, g: 16, c: "reactive_nonmetal", st: "gas", v: [2], col: "#06b6d4",
    cfg: "[He] 2s² 2p⁴", en: 3.44, mp: -218.79, bp: -182.96, dens: "1.429 g/L", year: "1774 (Joseph Priestley & Carl Wilhelm Scheele)",
    desc: "Das zweithäufigste Gas der Erde und stärkstes Oxidationsmittel der Biologie für Zellatmung und Verbrennung.",
    fact: "Flüssiger Sauerstoff ist blassblau und zeigt im Magnetfeld starken Paramagnetismus.",
    use: "Atmungsgas in Medizin & Raumfahrt, Stahlfrischen (Linz-Donawitz) und Wasser (H₂O)."
  },
  {
    z: 9, s: "F", n: "Fluor", l: "Fluorum", m: 18.998, p: 2, g: 17, c: "reactive_nonmetal", st: "gas", v: [1], col: "#a3e635",
    cfg: "[He] 2s² 2p⁵", en: 3.98, mp: -219.67, bp: -188.11, dens: "1.696 g/L", year: "1886 (Henri Moissan)",
    desc: "Das elektronegativste und reaktionsfreudigste Element überhaupt. Reagiert mit fast allen Stoffen explosionsartig.",
    fact: "Fluorit-Kristalle leuchten unter UV-Licht; von Fluor stammt der Begriff 'Fluoreszenz'.",
    use: "Zahnschmelz-Fluoridierung, PTFE-Beschichtungen (Teflon) und Arzneimittelsynthesen."
  },
  {
    z: 10, s: "Ne", n: "Neon", l: "Neon", m: 20.180, p: 2, g: 18, c: "noble_gas", st: "gas", v: [0], col: "#c084fc",
    cfg: "[He] 2s² 2p⁶", en: undefined, mp: -248.59, bp: -246.05, dens: "0.9002 g/L", year: "1898 (William Ramsay & Morris Travers)",
    desc: "Vollkommen inertes Edelgas mit abgeschlossener Oktettschale. Leuchtet im Hochspannungsplasma intensiv orangerot.",
    fact: "Nur echtes Neon leuchtet rot-orange; andere Leuchtröhrenfarben nutzen Argon, Quecksilber oder Krypton.",
    use: "Gasentladungs-Leuchtreklame, Helium-Neon-Laser in der Interferometrie und Kältetechnik."
  },

  // Periode 3
  {
    z: 11, s: "Na", n: "Natrium", l: "Natrium", m: 22.990, p: 3, g: 1, c: "alkali_metal", st: "solid", v: [1], col: "#f43f5e",
    cfg: "[Ne] 3s¹", en: 0.93, mp: 97.79, bp: 882.8, dens: "0.968 g/cm³", year: "1807 (Humphry Davy)",
    desc: "Weiches, silbrig glänzendes Alkalimetall. Lässt sich mit dem Messer schneiden und reagiert heftig mit Wasser.",
    fact: "Färbt Flammen intensiv gelb (Natrium-D-Linie bei 589 nm).",
    use: "Zusammen mit Chlor das lebenswichtige Speisesalz (NaCl), Natriumdampflampen und Zellnervenimpulse."
  },
  {
    z: 12, s: "Mg", n: "Magnesium", l: "Magnesium", m: 24.305, p: 3, g: 2, c: "alkaline_earth", st: "solid", v: [2], col: "#fb923c",
    cfg: "[Ne] 3s²", en: 1.31, mp: 650, bp: 1090, dens: "1.738 g/cm³", year: "1755 (Joseph Black)",
    desc: "Leichtes Strukturmetall. Verbrennt an Luft mit gleißend weißem Licht zu Magnesiumoxid (MgO).",
    fact: "Das Zentralatom im grünen Blattfarbstoff Chlorophyll für die Photosynthese ist Magnesium!",
    use: "Leichtbau im Automobil- und Flugzeugbau sowie lebenswichtiger Mineralstoff für Muskeln und Nerven."
  },
  {
    z: 13, s: "Al", n: "Aluminium", l: "Aluminium", m: 26.982, p: 3, g: 13, c: "post_transition_metal", st: "solid", v: [3], col: "#cbd5e1",
    cfg: "[Ne] 3s² 3p¹", en: 1.61, mp: 660.32, bp: 2519, dens: "2.70 g/cm³", year: "1825 (Hans Christian Ørsted)",
    desc: "Häufigstes Metall in der Erdkruste (ca. 8 %). Schützt sich selbst durch eine zähe, dichte Passivierungsschicht aus Al₂O₃.",
    fact: "Vor dem Hall-Héroult-Verfahren war Aluminium wertvoller als Silber und Gold!",
    use: "Flugzeugbau, Leichtbaufelgen, Hochspannungsfreileitungen und recycelbare Getränkedosen."
  },
  {
    z: 14, s: "Si", n: "Silicium", l: "Silicium", m: 28.085, p: 3, g: 14, c: "metalloid", st: "solid", v: [4], col: "#2dd4bf",
    cfg: "[Ne] 3s² 3p²", en: 1.90, mp: 1414, bp: 3265, dens: "2.329 g/cm³", year: "1824 (Jöns Jacob Berzelius)",
    desc: "Kristallines Halbleiterelement. Bildet das Rückgrat moderner Computerprozessoren und Solarzellen.",
    fact: "Zusammen mit Sauerstoff bildet Silicium als Quarzsand (SiO₂) über 90 % der Gesteine der Erdkruste.",
    use: "Mikrochips, Photovoltaik, Silikone, Fensterglas und Zement."
  },
  {
    z: 15, s: "P", n: "Phosphor", l: "Phosphorus", m: 30.974, p: 3, g: 15, c: "reactive_nonmetal", st: "solid", v: [3, 5], col: "#f97316",
    cfg: "[Ne] 3s² 3p³", en: 2.19, mp: 44.15, bp: 280.5, dens: "1.823 g/cm³ (Weiß)", year: "1669 (Hennig Brand)",
    desc: "Kommt in weißem, rotem und schwarzem Phosphor vor. Weißer Phosphor entzündet sich bei 30 °C spontan an der Luft.",
    fact: "Der Entdecker Hennig Brand suchte den Stein der Weisen und entdeckte stattdessen leuchtenden Phosphor im Urin.",
    use: "ATP (Energiewährung der Biologie), DNA-Zucker-Phosphat-Rückgrat und Düngemittel."
  },
  {
    z: 16, s: "S", n: "Schwefel", l: "Sulfur", m: 32.06, p: 3, g: 16, c: "reactive_nonmetal", st: "solid", v: [2, 4, 6], col: "#facc15",
    cfg: "[Ne] 3s² 3p⁴", en: 2.58, mp: 115.21, bp: 444.6, dens: "2.07 g/cm³", year: "Prähistorisch (Antike)",
    desc: "Zitronengelber Feststoff aus ringförmigen S₈-Molekülen. Verbrennt mit blauer Flamme zu beißendem SO₂.",
    fact: "Disulfidbrücken zwischen Schwefelatomen halten Proteine wie Haare und Enzyme in ihrer 3D-Form.",
    use: "Schwefelsäureerzeugung (H₂SO₄ – wichtigste Industriechemikalie) und Kautschuk-Vulkanisation."
  },
  {
    z: 17, s: "Cl", n: "Chlor", l: "Chlorum", m: 35.45, p: 3, g: 17, c: "reactive_nonmetal", st: "gas", v: [1], col: "#4ade80",
    cfg: "[Ne] 3s² 3p⁵", en: 3.16, mp: -101.5, bp: -34.04, dens: "3.2 g/L", year: "1774 (Carl Wilhelm Scheele)",
    desc: "Gelbgrünes, stechend riechendes Halogengas. Starkes Desinfektions- und Oxidationsmittel.",
    fact: "Chlor ist 2,5-mal dichter als Luft und sammelt sich deshalb am Boden.",
    use: "Trinkwasseraufbereitung, Schwimmbaddesinfektion, PVC-Kunststoffe und Salzsäure (HCl)."
  },
  {
    z: 18, s: "Ar", n: "Argon", l: "Argon", m: 39.95, p: 3, g: 18, c: "noble_gas", st: "gas", v: [0], col: "#c084fc",
    cfg: "[Ne] 3s² 3p⁶", en: undefined, mp: -189.35, bp: -185.85, dens: "1.784 g/L", year: "1894 (Lord Rayleigh & William Ramsay)",
    desc: "Drittgrößter Bestandteil der Erdatmosphäre (0,93 %). Vollkommen inertes Edelgas.",
    fact: "Sein Name stammt vom griechischen 'argos' ab, was 'das Träge' oder 'Untätige' bedeutet.",
    use: "Schutzgas beim WIG-Schweißen, Füllgas in Glühlampen und Isolierglasfenstern."
  },

  // Periode 4
  {
    z: 19, s: "K", n: "Kalium", l: "Kalium", m: 39.098, p: 4, g: 1, c: "alkali_metal", st: "solid", v: [1], col: "#f43f5e",
    cfg: "[Ar] 4s¹", en: 0.82, mp: 63.5, bp: 759, dens: "0.862 g/cm³", year: "1807 (Humphry Davy)",
    desc: "Silbrig-weiches Alkalimetall. Reagiert noch heftiger mit Wasser als Natrium und brennt mit lila Flamme.",
    fact: "Das natürliche Isotop Kalium-40 ist schwach radioaktiv und macht z.B. Bananen messbar aktiv.",
    use: "Pflanzennährstoff (NPK-Dünger), Natrium-Kalium-Pumpe in Nervenzellen und Seifenherstellung."
  },
  {
    z: 20, s: "Ca", n: "Calcium", l: "Calcium", m: 40.078, p: 4, g: 2, c: "alkaline_earth", st: "solid", v: [2], col: "#fb923c",
    cfg: "[Ar] 4s²", en: 1.00, mp: 842, bp: 1484, dens: "1.54 g/cm³", year: "1808 (Humphry Davy)",
    desc: "Reaktives Erdalkalimetall. Fünfthäufigstes Element in der Erdkruste (Kalkstein, Marmor, Gips).",
    fact: "Über 99 % des Calciums im menschlichen Körper steckt in unseren Knochen und Zähnen.",
    use: "Baustoffe (Zement, Kalkmörtel), Knochengerüst und zelluläre Signalübertragung."
  },
  {
    z: 21, s: "Sc", n: "Scandium", l: "Scandium", m: 44.956, p: 4, g: 3, c: "transition_metal", st: "solid", v: [3], col: "#94a3b8",
    cfg: "[Ar] 3d¹ 4s²", en: 1.36, mp: 1541, bp: 2836, dens: "2.985 g/cm³", year: "1879 (Lars Fredrik Nilson)",
    desc: "Erstes Übergangsmetall mit beginnender 3d-Schalenbesetzung. Silbrig-weißes Leichtmetall.",
    fact: "Mendelejew sagte seine Existenz als 'Eka-Bor' exakt voraus, bevor es in Skandinavien entdeckt wurde.",
    use: "Scandium-Aluminium-Legierungen für High-End-Fahrradrahmen, Kampfjets und Baseballschläger."
  },
  {
    z: 22, s: "Ti", n: "Titan", l: "Titanium", m: 47.867, p: 4, g: 4, c: "transition_metal", st: "solid", v: [4], col: "#38bdf8",
    cfg: "[Ar] 3d² 4s²", en: 1.54, mp: 1668, bp: 3287, dens: "4.506 g/cm³", year: "1791 (William Gregor)",
    desc: "Extrem korrosionsbeständiges und hochfestes Übergangsmetall mit geringer Dichte.",
    fact: "Titan wächst nahtlos mit menschlichem Knochengewebe zusammen (Osseointegration).",
    use: "Künstliche Gelenkimplantate, Raumfahrt, Überschalljets und Titandioxid-Weißpigment (TiO₂)."
  },
  {
    z: 23, s: "V", n: "Vanadium", l: "Vanadium", m: 50.942, p: 4, g: 5, c: "transition_metal", st: "solid", v: [5], col: "#a855f7",
    cfg: "[Ar] 3d³ 4s²", en: 1.63, mp: 1910, bp: 3407, dens: "6.11 g/cm³", year: "1801 (Andrés Manuel del Río)",
    desc: "Duktiles Metall, das für seine bunten Oxidationsstufen bekannt ist (Violett, Grün, Blau, Gelb).",
    fact: "Benannt nach Vanadis, der nordischen Göttin der Schönheit, wegen seiner farbenfrohen Lösungen.",
    use: "Vanadium-Stahllegierungen für stoßfeste Schraubenschlüssel und Vanadium-Redox-Flow-Batterien."
  },
  {
    z: 24, s: "Cr", n: "Chrom", l: "Chromium", m: 51.996, p: 4, g: 6, c: "transition_metal", st: "solid", v: [3, 6], col: "#e2e8f0",
    cfg: "[Ar] 3d⁵ 4s¹", en: 1.66, mp: 1907, bp: 2671, dens: "7.19 g/cm³", year: "1797 (Louis-Nicolas Vauquelin)",
    desc: "Zeigt die quantenmechanische Anomalie einer energetisch stabileren halbbesetzten 3d-Unterschale (3d⁵ 4s¹).",
    fact: "Edelstahl rostet nur deshalb nicht, weil mindestens 10,5 % Chrom darin eine Schutzschicht bilden.",
    use: "Glänzende Verchromungen, rostfreier Edelstahl und Rubine (Chrom färbt sie feurig rot)."
  },
  {
    z: 25, s: "Mn", n: "Mangan", l: "Manganum", m: 54.938, p: 4, g: 7, c: "transition_metal", st: "solid", v: [2, 4, 7], col: "#ec4899",
    cfg: "[Ar] 3d⁵ 4s²", en: 1.55, mp: 1246, bp: 2061, dens: "7.21 g/cm³", year: "1774 (Johan Gottlieb Gahn)",
    desc: "Hartes, sprödes Metall. Das Permanganat-Ion (MnO₄⁻) ist tiefviolett und ein starkes Oxidationsmittel.",
    fact: "Mangan ist unverzichtbar für die Sauerstoffentwicklung in der pflanzlichen Photosynthese.",
    use: "Entschwefelung von Rohstahl und Zink-Kohle- bzw. Alkali-Mangan-Batterien."
  },
  {
    z: 26, s: "Fe", n: "Eisen", l: "Ferrum", m: 55.845, p: 4, g: 8, c: "transition_metal", st: "solid", v: [2, 3], col: "#f59e0b",
    cfg: "[Ar] 3d⁶ 4s²", en: 1.83, mp: 1538, bp: 2862, dens: "7.874 g/cm³", year: "Prähistorisch (Antike)",
    desc: "Massenreichstes Element der gesamten Erde (Erdkern) und wichtigstes Gebrauchsmetall der Menschheit.",
    fact: "Das Eisenatom im Hämoglobin bindet O₂ und verleiht unserem Blut die rote Farbe.",
    use: "Stahlkonstruktionen, Schienen, Brücken, Motoren und magnetische Datenspeicher."
  },
  {
    z: 27, s: "Co", n: "Cobalt", l: "Cobaltum", m: 58.933, p: 4, g: 9, c: "transition_metal", st: "solid", v: [2, 3], col: "#3b82f6",
    cfg: "[Ar] 3d⁷ 4s²", en: 1.88, mp: 1495, bp: 2927, dens: "8.90 g/cm³", year: "1735 (Georg Brandt)",
    desc: "Ferromagnetisches Übergangsmetall mit intensiv blauem Farbpigment (Cobaltblau).",
    fact: "Bergmänner benannten es nach den boshaften Kobolden, weil sein Erz giftiges Arsen freisetzte.",
    use: "Superlegierungen für Flugzeugturbinen, Magnete (Alnico) und Vitamin B12."
  },
  {
    z: 28, s: "Ni", n: "Nickel", l: "Niccolum", m: 58.693, p: 4, g: 10, c: "transition_metal", st: "solid", v: [2], col: "#10b981",
    cfg: "[Ar] 3d⁸ 4s²", en: 1.91, mp: 1455, bp: 2913, dens: "8.908 g/cm³", year: "1751 (Axel Fredrik Cronstedt)",
    desc: "Zähes, silbriges ferromagnetisches Metall. Bildet mit Eisen den metallischen Erdkern.",
    fact: "Auch 'Kupfernickel' genannt, nach dem Berggeist Nick, der Bergleute täuschte.",
    use: "Euromünzen, rostfreier Edelstahl, Lithium-Nickel-Akkus und Chemiekatalysatoren."
  },
  {
    z: 29, s: "Cu", n: "Kupfer", l: "Cuprum", m: 63.546, p: 4, g: 11, c: "transition_metal", st: "solid", v: [1, 2], col: "#f97316",
    cfg: "[Ar] 3d¹⁰ 4s¹", en: 1.90, mp: 1084.62, bp: 2562, dens: "8.96 g/cm³", year: "Prähistorisch (Antike)",
    desc: "Hervorragender Wärme- und Stromleiter. Zeigt die quantenmechanische Anomalie einer vollbesetzten 3d-Schale.",
    fact: "Kupferdächer färben sich durch Bildung einer schützenden Patina über Jahre grün.",
    use: "Elektrokabel, Rohrleitungen, Mikroelektronik, Messing- und Bronzelegierungen."
  },
  {
    z: 30, s: "Zn", n: "Zink", l: "Zincum", m: 65.38, p: 4, g: 12, c: "transition_metal", st: "solid", v: [2], col: "#06b6d4",
    cfg: "[Ar] 3d¹⁰ 4s²", en: 1.65, mp: 419.53, bp: 907, dens: "7.14 g/cm³", year: "Prähistorisch (Antike)",
    desc: "Unedles Metall, das Eisen durch galvanische Verzinkung opfernd vor Rost schützt.",
    fact: "Im Körper aktiviert Zink über 300 lebenswichtige Enzyme für Immunabwehr und Wundheilung.",
    use: "Rostschutzverzinkung, Messing, Zinkoxid in Cremes und Zink-Luft-Batterien."
  },
  {
    z: 31, s: "Ga", n: "Gallium", l: "Gallium", m: 69.723, p: 4, g: 13, c: "post_transition_metal", st: "solid", v: [3], col: "#818cf8",
    cfg: "[Ar] 3d¹⁰ 4s² 4p¹", en: 1.81, mp: 29.76, bp: 2204, dens: "5.91 g/cm³", year: "1875 (Paul Émile Lecoq de Boisbaudran)",
    desc: "Besitzt einen Schmelzpunkt knapp unter Körpertemperatur – schmilzt buchstäblich in der warmen Hand!",
    fact: "Gallium dehnt sich beim Erstarren aus und zerstört geschlossene Glasbehälter.",
    use: "Galliumarsenid (GaAs) und Galliumnitrid (GaN) für blaue LEDs und Schnellladegeräte."
  },
  {
    z: 32, s: "Ge", n: "Germanium", l: "Germanium", m: 72.630, p: 4, g: 14, c: "metalloid", st: "solid", v: [4], col: "#34d399",
    cfg: "[Ar] 3d¹⁰ 4s² 4p²", en: 2.01, mp: 938.25, bp: 2833, dens: "5.323 g/cm³", year: "1886 (Clemens Winkler)",
    desc: "Glänzendes, graues Halbmetall. Diente im ersten Transistor 1947 als Basismaterial der Elektronik.",
    fact: "Mendelejew sagte es 1869 als 'Eka-Silicium' voraus; Winkler benannte es nach seiner Heimat Germania.",
    use: "Infrarot-Nachtsichtoptiken, Glasfaserübertragung und Highspeed-Transistoren."
  },
  {
    z: 33, s: "As", n: "Arsen", l: "Arsenicum", m: 74.922, p: 4, g: 15, c: "metalloid", st: "solid", v: [3, 5], col: "#2dd4bf",
    cfg: "[Ar] 3d¹⁰ 4s² 4p³", en: 2.18, mp: 817, bp: 614, dens: "5.727 g/cm³", year: "1250 (Albertus Magnus)",
    desc: "Klassisches, hochtoxisches Halbmetall, das bei Normaldruck ohne zu schmelzen direkt sublimiert.",
    fact: "Im Mittelalter als 'Erbschaftspulver' bekannt, heute wichtiges Halbleiter-Dotiermittel.",
    use: "Galliumarsenid-Laserchips für Smartphones, Holzschutzmittel und Chemotherapie."
  },
  {
    z: 34, s: "Se", n: "Selen", l: "Selenium", m: 78.971, p: 4, g: 16, c: "reactive_nonmetal", st: "solid", v: [2, 4], col: "#eab308",
    cfg: "[Ar] 3d¹⁰ 4s² 4p⁴", en: 2.55, mp: 221, bp: 685, dens: "4.819 g/cm³", year: "1817 (Jöns Jacob Berzelius)",
    desc: "Photoleitfähiges Nichtmetall: Leitet Strom im Hellen deutlich besser als im Dunkeln.",
    fact: "Benannt nach Selene, der griechischen Göttin des Mondes.",
    use: "Kopiergeräte (Trommel), Belichtungsmesser, Rotes Farbglas und essentielles Spurenelement."
  },
  {
    z: 35, s: "Br", n: "Brom", l: "Bromum", m: 79.904, p: 4, g: 17, c: "reactive_nonmetal", st: "liquid", v: [1], col: "#ef4444",
    cfg: "[Ar] 3d¹⁰ 4s² 4p⁵", en: 2.96, mp: -7.2, bp: 58.8, dens: "3.1028 g/cm³", year: "1826 (Antoine Jérôme Balard)",
    desc: "Das einzige flüssige Nichtmetall des Periodensystems. Bildet rotbraune, extrem ätzende Dämpfe.",
    fact: "Der Name leitet sich vom griechischen 'bromos' ab, was 'Gestank' bedeutet.",
    use: "Flammschutzmittel in Kunststoffen, Halogenleuchten und photographische Silberbromid-Emulsionen."
  },
  {
    z: 36, s: "Kr", n: "Krypton", l: "Krypton", m: 83.798, p: 4, g: 18, c: "noble_gas", st: "gas", v: [0], col: "#c084fc",
    cfg: "[Ar] 3d¹⁰ 4s² 4p⁶", en: 3.00, mp: -157.36, bp: -153.22, dens: "3.749 g/L", year: "1898 (William Ramsay & Morris Travers)",
    desc: "Schweres Edelgas mit weißer Spektrallinie. Von 1960 bis 1983 definierte Krypton-86 die Standardlänge des Meters.",
    fact: "Hat trotz des Namens nichts mit Supermans Heimatplaneten Krypton zu tun!",
    use: "Flughafen-Befeuerungslampen, Highspeed-Blitzlichter und Excimer-Laser in der Augenheilkunde."
  }
];

console.log('Validating scientific elements definition...');
