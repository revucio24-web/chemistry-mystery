import { ChemicalReaction, MoleculeDefinition, SubstanceSample } from './chemistry';

export type DifficultyLevel = 'explorer' | 'beginner' | 'advanced' | 'expert';

export const DIFFICULTY_LABELS: Record<DifficultyLevel, { name: string; desc: string; color: string }> = {
  explorer: {
    name: 'Entdecker',
    desc: 'Für Kinder & Neulinge: Anschauliche Bilder, direkte Hilfen & spielerischer Einstieg',
    color: 'emerald'
  },
  beginner: {
    name: 'Anfänger',
    desc: 'Für Schüler: Grundbegriffe der Chemie, erste Formeln und Zusammenhänge',
    color: 'cyan'
  },
  advanced: {
    name: 'Fortgeschritten',
    desc: 'Für Chemie-Kenner: Reaktionsgleichungen, Ionen und tiefere Mechanismen',
    color: 'amber'
  },
  expert: {
    name: 'Chemieexperte',
    desc: 'Für Meister: Anspruchsvolle Stöchiometrie, komplexe Analytik & Detektivfälle',
    color: 'purple'
  }
};

export type PuzzleType =
  | 'element_match'          // Typ 1: Elemente zuordnen
  | 'molecule_builder'       // Typ 2: Molekülbaukasten
  | 'lab_door_cipher'        // Typ 3: Labor entschlüsseln
  | 'equation_balancer'      // Typ 4: Reaktionsgleichungen
  | 'substance_analysis'     // Typ 5: Unbekannte Stoffe
  | 'periodic_table_quiz'    // Typ 6: Periodensystem-Challenge
  | 'mystery_detective'      // Typ 7: Chemie-Detektiv
  | 'true_false';            // Typ 8: Wahr oder Falsch?

import { LearningModuleId } from './modules';

export interface BasePuzzle {
  id: string;
  title: string;
  room: string;
  moduleId?: LearningModuleId;
  rewardElementAtomicNumber?: number;
  type: PuzzleType;
  difficulty: DifficultyLevel;
  missionNumber: number;
  question: string;
  loreContext: string;
  hint: string;
  detailedHint: string; // Wird nach mehreren Fehlversuchen freigeschaltet
  didacticExplanation: string; // Wissenschaftliche Begründung bei korrekter Lösung
  commonMistakeExplanation: string; // Hilfreiche Erklärung bei falscher Antwort
  realWorldExample: string;
  xpReward: number;
}

export interface ElementMatchPuzzle extends BasePuzzle {
  type: 'element_match';
  pairs: Array<{
    symbol: string;
    name: string;
    clue: string;
  }>;
}

export interface MoleculeBuilderPuzzle extends BasePuzzle {
  type: 'molecule_builder';
  targetMolecule: MoleculeDefinition;
  availableAtomPool: Array<{
    symbol: string;
    count: number;
    valency: number;
    color: string;
  }>;
}

export interface LabDoorCipherPuzzle extends BasePuzzle {
  type: 'lab_door_cipher';
  doorName: string;
  cipherClues: string[];
  requiredCode: string;
  keypadType: 'numbers' | 'symbols' | 'elements';
  options?: string[];
  scientificReason: string;
}

export interface EquationBalancerPuzzle extends BasePuzzle {
  type: 'equation_balancer';
  reaction: ChemicalReaction;
}

export interface SubstanceAnalysisPuzzle extends BasePuzzle {
  type: 'substance_analysis';
  sample: SubstanceSample;
  testOptions: Array<{
    id: string;
    testName: string;
    observation: string;
    safeProcedure: string;
  }>;
  candidateChoices: string[];
}

export interface PeriodicTableQuizPuzzle extends BasePuzzle {
  type: 'periodic_table_quiz';
  targetSymbol: string;
  criteriaDescription: string;
  clues: string[];
}

export interface MysteryDetectivePuzzle extends BasePuzzle {
  type: 'mystery_detective';
  caseTitle: string;
  caseReport: string;
  evidenceItems: Array<{
    title: string;
    fact: string;
  }>;
  hypotheses: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    scientificCritique: string;
  }>;
}

export interface TrueFalsePuzzle extends BasePuzzle {
  type: 'true_false';
  statement: string;
  isTrue: boolean;
}

export type Puzzle =
  | ElementMatchPuzzle
  | MoleculeBuilderPuzzle
  | LabDoorCipherPuzzle
  | EquationBalancerPuzzle
  | SubstanceAnalysisPuzzle
  | PeriodicTableQuizPuzzle
  | MysteryDetectivePuzzle
  | TrueFalsePuzzle;

export interface ValidationFeedback {
  isCorrect: boolean;
  message: string;
  scientificExplanation: string;
  realWorldExample?: string;
  hint?: string;
  attemptsCount: number;
}
