export type LearningModuleId =
  | 'module_a' // Die Welt der Elemente
  | 'module_b' // Atome und Moleküle
  | 'module_c' // Chemische Reaktionen
  | 'module_d' // Säuren, Basen und pH-Wert
  | 'module_e' // Wasser und Alltagschemie
  | 'module_f' // Zustände und Stoffeigenschaften
  | 'module_g'; // Chemie der Zukunft

export interface LearningModule {
  id: LearningModuleId;
  code: string;
  title: string;
  shortDesc: string;
  topics: string[];
  color: string;
  iconName: string;
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'module_a',
    code: 'Modul A',
    title: 'Die Welt der Elemente',
    shortDesc: 'Grundlagen der Elemente, Periodensystem, Metalle und Nichtmetalle',
    topics: [
      'Was sind chemische Elemente?',
      'Wasserstoff, Sauerstoff, Kohlenstoff, Eisen',
      'Das Periodensystem der Elemente (PSE)',
      'Elementsymbole und Ordnungszahlen',
      'Metalle, Halbmetalle und Nichtmetalle'
    ],
    color: '#06b6d4',
    iconName: 'Atom'
  },
  {
    id: 'module_b',
    code: 'Modul B',
    title: 'Atome und Moleküle',
    shortDesc: 'Atomaufbau, Protonen, Neutronen, Elektronen, Ionen und Molekülbindung',
    topics: [
      'Protonen, Neutronen und Elektronen',
      'Atommodelle & Elektronenhülle',
      'Ionen und elektrische Ladungen (Kationen & Anionen)',
      'Moleküle und chemische Formeln',
      'Unterschied Atom vs. Molekül vs. Verbindung'
    ],
    color: '#6366f1',
    iconName: 'Orbit'
  },
  {
    id: 'module_c',
    code: 'Modul C',
    title: 'Chemische Reaktionen',
    shortDesc: 'Edukte, Produkte, Reaktionsgleichungen und das Gesetz der Massenerhaltung',
    topics: [
      'Edukte und Produkte',
      'Gesetz der Erhaltung der Masse (Lavoisier)',
      'Einfache chemische Reaktionen',
      'Reaktionsgleichungen schrittweise stöchiometrisch ausgleichen'
    ],
    color: '#f59e0b',
    iconName: 'Flame'
  },
  {
    id: 'module_d',
    code: 'Modul D',
    title: 'Säuren, Basen und pH-Wert',
    shortDesc: 'Die pH-Skala, Indikatoren, Neutralisation und Alltagsbeispiele',
    topics: [
      'Säuren und Basen (Protonendonatoren & -akzeptoren)',
      'Die pH-Skala von 0 bis 14',
      'Universalindikatoren und Farbumschläge',
      'Neutrale Lösungen & Neutralisationsreaktion',
      'Alltagsbeispiele: Zitronensaft, Essig, Seife'
    ],
    color: '#0ea5e9',
    iconName: 'Droplets'
  },
  {
    id: 'module_e',
    code: 'Modul E',
    title: 'Wasser und Alltagschemie',
    shortDesc: 'Dipoleigenschaften des Wassers, Löslichkeit, Gemische und Trennverfahren',
    topics: [
      'Besondere Eigenschaften des Wassers (Dipol, H-Brücken)',
      'Lösungen und Gemische (homogen vs. heterogen)',
      'Filtration, Destillation und Verdampfung',
      'Löslichkeit und gesättigte Lösungen',
      'Chemie in Küche, Haushalt und Natur'
    ],
    color: '#10b981',
    iconName: 'Share2'
  },
  {
    id: 'module_f',
    code: 'Modul F',
    title: 'Zustände und Stoffeigenschaften',
    shortDesc: 'Aggregatzustände, Phasenübergänge, Dichte und physikalische vs. chemische Prozesse',
    topics: [
      'Fest, flüssig und gasförmig (Teilchenmodell)',
      'Schmelzen, Verdampfen, Kondensieren, Erstarren',
      'Dichte, Härte und elektrische Leitfähigkeit',
      'Physikalische Veränderung vs. echte chemische Reaktion'
    ],
    color: '#8b5cf6',
    iconName: 'Gem'
  },
  {
    id: 'module_g',
    code: 'Modul G',
    title: 'Chemie der Zukunft',
    shortDesc: 'Batterien, Energiespeicherung, Recycling, Kunststoffe und Nachhaltigkeit',
    topics: [
      'Batterien, Akkus und elektrochemische Energiespeicherung',
      'Recycling und moderne Werkstoffe',
      'Polymere & Kunststoffe',
      'Trinkwasseraufbereitung',
      'Grüne Chemie und Umweltschutz'
    ],
    color: '#84cc16',
    iconName: 'Leaf'
  }
];
