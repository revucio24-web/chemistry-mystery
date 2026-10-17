// Chemische Grundtypen für Chemistry Mystery

export type ElementCategory = 
  | 'alkali_metal'
  | 'alkaline_earth'
  | 'transition_metal'
  | 'post_transition_metal'
  | 'metalloid'
  | 'reactive_nonmetal'
  | 'noble_gas'
  | 'lanthanide'
  | 'actinide';

export type StateOfMatter = 'solid' | 'liquid' | 'gas';

export interface ChemicalElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  latinName?: string;
  atomicMass: number;
  period: number;
  group: number;
  category: ElementCategory;
  stateAtRoomTemp: StateOfMatter;
  protons: number;
  neutrons: number;
  electrons: number;
  valency: number[];
  colorHex: string;
  description: string;
  funFact: string;
  realWorldUse: string;
  hazardNote?: string;
  // Wahre wissenschaftliche Daten & Kennzahlen
  electronConfiguration?: string; // z.B. "[Ar] 3d⁶ 4s²"
  electronegativity?: number; // Pauling-Skala (z.B. 3.98 für Fluor)
  meltingPointC?: number; // Schmelzpunkt in °C
  boilingPointC?: number; // Siedepunkt in °C
  density?: string; // z.B. "7.87 g/cm³" oder "0.0899 g/L"
  discoveredYear?: string; // z.B. "1774" oder "Antike"
}

export interface MoleculeAtom {
  id: string;
  elementSymbol: string;
  name: string;
  color: string;
  x?: number;
  y?: number;
}

export interface MoleculeBond {
  fromAtomId: string;
  toAtomId: string;
  order: 1 | 2 | 3; // Einfach-, Doppel-, Dreifachbindung
}

export interface MoleculeDefinition {
  id: string;
  formula: string;
  name: string;
  commonName: string;
  description: string;
  realWorldUsage: string;
  requiredAtoms: Record<string, number>; // z.B. { H: 2, O: 1 }
  bondsCount: number;
  difficulty: 'explorer' | 'beginner' | 'advanced' | 'expert';
}

export interface ReactionSideItem {
  coefficient: number;
  formula: string;
  name: string;
  state?: 's' | 'l' | 'g' | 'aq';
}

export interface ChemicalReaction {
  id: string;
  title: string;
  description: string;
  reactants: ReactionSideItem[];
  products: ReactionSideItem[];
  // Korrekte Koeffizienten für die Stöchiometrie
  correctCoefficients: {
    reactants: number[];
    products: number[];
  };
  explanation: string;
  didacticTip: string;
  realWorldContext: string;
}

export interface SubstanceSample {
  id: string;
  name: string;
  formula: string;
  appearance: string; // z.B. "Farbloses, geruchloses Gas" oder "Weißes Pulver"
  state: StateOfMatter;
  solubilityInWater: 'very_soluble' | 'soluble' | 'insoluble' | 'reacts';
  pHValue: number;
  flameTestColor?: string; // z.B. "Ziegelrot (Calcium)", "Gelb (Natrium)", "Grün (Kupfer)"
  reactionWithAcid?: string; // z.B. "Braust auf (CO2 Entstehung)"
  conductivity: 'isolator' | 'leiter' | 'halbleiter';
  hintClues: string[];
  safeLabWarning: string;
  correctIdentity: string;
}
