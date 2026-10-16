export type LabRoomId =
  | 'elemental_lab'        // Das Elementarlabor
  | 'atom_chamber'         // Die Atomkammer
  | 'molecule_workshop'    // Die Molekülwerkstatt
  | 'reaction_room'        // Der Reaktionsraum
  | 'crystal_archive'      // Das Kristallarchiv
  | 'water_station'        // Die Wasserstation
  | 'environmental_lab'    // Das Umweltlabor
  | 'secret_research_lab'; // Das geheime Forschungslabor

export interface LabRoom {
  id: LabRoomId;
  name: string;
  subtitle: string;
  description: string;
  requiredLevel: number;
  themeColor: string;
  accentColor: string;
  iconName: string;
  learningFocus: string;
  missionsCount: number;
  status: 'locked' | 'unlocked' | 'mastered';
}

export const LAB_ROOMS: LabRoom[] = [
  {
    id: 'elemental_lab',
    name: 'Das Elementarlabor',
    subtitle: 'Der Ursprung der Materie',
    description: 'Entdecke die Bausteine des Universums. Lerne Elementsymbole, Ordnungszahlen und die geheimnisvolle Ordnung des Periodensystems kennen.',
    requiredLevel: 1,
    themeColor: 'cyan',
    accentColor: '#06b6d4',
    iconName: 'Atom',
    learningFocus: 'Modul A: Die Welt der Elemente (Symbole, Metalle & Nichtmetalle)',
    missionsCount: 10,
    status: 'unlocked'
  },
  {
    id: 'atom_chamber',
    name: 'Die Atomkammer',
    subtitle: 'Tief im Kern der Dinge',
    description: 'Blicke in das Innere der Atome. Entschlüssele Protonen, Neutronen, Elektronen und erfahre, wie elektrische Ladungen und Ionen entstehen.',
    requiredLevel: 2,
    themeColor: 'indigo',
    accentColor: '#6366f1',
    iconName: 'Orbit',
    learningFocus: 'Modul B: Atome, Ionen & Ladungen',
    missionsCount: 8,
    status: 'locked'
  },
  {
    id: 'molecule_workshop',
    name: 'Die Molekülwerkstatt',
    subtitle: 'Chemische Bindungen knüpfen',
    description: 'Kombiniere Atome zu Molekülen! Baue Wasser, Kohlendioxid und organische Moleküle zusammen und verstehe chemische Formeln.',
    requiredLevel: 3,
    themeColor: 'emerald',
    accentColor: '#10b981',
    iconName: 'Share2',
    learningFocus: 'Modul B & E: Moleküle, Verbindungen & Formeln',
    missionsCount: 8,
    status: 'locked'
  },
  {
    id: 'reaction_room',
    name: 'Der Reaktionsraum',
    subtitle: 'Masse bleibt erhalten',
    description: 'Wo Stoffe sich verwandeln! Gleiche chemische Reaktionsgleichungen stöchiometrisch aus und beobachte die Gesetze der Massenerhaltung.',
    requiredLevel: 4,
    themeColor: 'amber',
    accentColor: '#f59e0b',
    iconName: 'Flame',
    learningFocus: 'Modul C: Chemische Reaktionen & Gleichungen ausgleichen',
    missionsCount: 8,
    status: 'locked'
  },
  {
    id: 'crystal_archive',
    name: 'Das Kristallarchiv',
    subtitle: 'Ordnung der Feststoffe',
    description: 'Erforsche Ionengitter, Salzkristalle und die feinen Unterschiede zwischen physikalischen Aggregatzuständen und chemischen Veränderungen.',
    requiredLevel: 5,
    themeColor: 'violet',
    accentColor: '#8b5cf6',
    iconName: 'Gem',
    learningFocus: 'Modul F: Zustände, Kristallgitter & Stoffeigenschaften',
    missionsCount: 8,
    status: 'locked'
  },
  {
    id: 'water_station',
    name: 'Die Wasserstation',
    subtitle: 'Säuren, Basen & pH-Gleichgewicht',
    description: 'Untersuche wässrige Lösungen, Indikatoren und die pH-Skala von Zitronensaft bis zu Seifenlauge. Was macht Wasser so einzigartig?',
    requiredLevel: 6,
    themeColor: 'sky',
    accentColor: '#0ea5e9',
    iconName: 'Droplets',
    learningFocus: 'Modul D & E: Säuren, Basen, pH-Wert & Wasser',
    missionsCount: 8,
    status: 'locked'
  },
  {
    id: 'environmental_lab',
    name: 'Das Umweltlabor',
    subtitle: 'Nachhaltige Chemie der Zukunft',
    description: 'Löse reale Zukunftsfragen: Batterietechnologie, Wasseraufbereitung, Plastik-Recycling und grüne Synthesen für unseren Planeten.',
    requiredLevel: 7,
    themeColor: 'lime',
    accentColor: '#84cc16',
    iconName: 'Leaf',
    learningFocus: 'Modul G: Zukunftschemie, Akkus & Umweltschutz',
    missionsCount: 8,
    status: 'locked'
  },
  {
    id: 'secret_research_lab',
    name: 'Das geheime Forschungslabor',
    subtitle: 'Das finale Meisterschaftsrätsel',
    description: 'Der Hochsicherheitsbereich für echte Meister! Nur wer alle Disziplinen beherrscht, kann das letzte große Mysterium des Instituts lösen.',
    requiredLevel: 8,
    themeColor: 'fuchsia',
    accentColor: '#d946ef',
    iconName: 'Sparkles',
    learningFocus: 'Finale Meisterprüfung: Synthese aller Module',
    missionsCount: 5,
    status: 'locked'
  }
];
