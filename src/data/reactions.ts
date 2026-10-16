import { ChemicalReaction } from '../types/chemistry';

export const REACTIONS_DATA: ChemicalReaction[] = [
  {
    id: 'rx_water_synthesis',
    title: 'Die Knallgasreaktion (Wassersynthese)',
    description: 'Wasserstoff reagiert mit Sauerstoff zu flüssigem Wasser. Setze die Koeffizienten so, dass links und rechts gleich viele H- und O-Atome stehen!',
    reactants: [
      { coefficient: 1, formula: 'H₂', name: 'Wasserstoffgas', state: 'g' },
      { coefficient: 1, formula: 'O₂', name: 'Sauerstoffgas', state: 'g' }
    ],
    products: [
      { coefficient: 1, formula: 'H₂O', name: 'Wasser', state: 'l' }
    ],
    correctCoefficients: {
      reactants: [2, 1],
      products: [2]
    },
    explanation: 'Auf der linken Seite stehen bei 2 H₂ vier Wasserstoffatome und bei 1 O₂ zwei Sauerstoffatome. Rechts ergeben 2 H₂O ebenfalls exakt 4 H-Atome und 2 O-Atome! Das Gesetz der Massenerhaltung ist erfüllt.',
    didacticTip: 'Zähle zuerst die Sauerstoffatome: O₂ bringt 2 O-Atome mit. Daher brauchst du rechts mindestens 2 H₂O.',
    realWorldContext: 'Diese saubere Reaktion treibt Wasserstoff-Brennstoffzellen in Zügen und Bussen an; das einzige Abgas ist reines Wasser.'
  },
  {
    id: 'rx_methane_combustion',
    title: 'Vollständige Verbrennung von Erdgas (Methan)',
    description: 'Erdgas verbrennt mit Sauerstoff zu Kohlenstoffdioxid und Wasserdampf. Balanciere Kohlenstoff, Wasserstoff und zuletzt Sauerstoff aus.',
    reactants: [
      { coefficient: 1, formula: 'CH₄', name: 'Methan', state: 'g' },
      { coefficient: 1, formula: 'O₂', name: 'Sauerstoff', state: 'g' }
    ],
    products: [
      { coefficient: 1, formula: 'CO₂', name: 'Kohlenstoffdioxid', state: 'g' },
      { coefficient: 1, formula: 'H₂O', name: 'Wasserdampf', state: 'g' }
    ],
    correctCoefficients: {
      reactants: [1, 2],
      products: [1, 2]
    },
    explanation: '1 CH₄ liefert 1 C (passt zu 1 CO₂) und 4 H (benötigt 2 H₂O). Rechts sind nun insgesamt 2 (aus CO₂) + 2 (aus 2 H₂O) = 4 Sauerstoffatome. Links braucht man dafür 2 O₂.',
    didacticTip: 'Regel: Balanciere reine Elemente wie O₂ immer ganz zum Schluss aus!',
    realWorldContext: 'So brennt die blaue Flamme am Küchen-Gasherd oder in einer modernen Gastherme.'
  },
  {
    id: 'rx_ammonia_synthesis',
    title: 'Haber-Bosch-Synthese (Ammoniak)',
    description: 'Stickstoff aus der Luft wird mit Wasserstoff zu Ammoniak gebunden. Eine der bedeutendsten Reaktionen der modernen Chemiegeschichte.',
    reactants: [
      { coefficient: 1, formula: 'N₂', name: 'Stickstoff', state: 'g' },
      { coefficient: 1, formula: 'H₂', name: 'Wasserstoff', state: 'g' }
    ],
    products: [
      { coefficient: 1, formula: 'NH₃', name: 'Ammoniak', state: 'g' }
    ],
    correctCoefficients: {
      reactants: [1, 3],
      products: [2]
    },
    explanation: 'N₂ liefert 2 Stickstoffatome, deshalb entstehen rechts 2 NH₃. 2 NH₃ enthalten zusammen 6 Wasserstoffatome (2 × 3 = 6). Links benötigt man daher 3 Moleküle H₂ (3 × 2 = 6).',
    didacticTip: 'Suche das kleinste gemeinsame Vielfache von 2 und 3 für den Wasserstoff!',
    realWorldContext: 'Ermöglichte die Massenproduktion von mineralischem Dünger und ernährt heute fast die Hälfte der Menschheit.'
  }
];
