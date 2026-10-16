import { describe, it, expect, beforeEach } from 'vitest';
import { 
  countAtomsInFormula, 
  verifyEquationMassBalance, 
  verifyMoleculeComposition 
} from '../engine/chemistryEngine';
import { 
  calculateLevel, 
  evaluatePuzzleResult,
  AVAILABLE_BADGES 
} from '../engine/learningEngine';
import { 
  loadPlayerProfile, 
  savePlayerProfile, 
  importPlayerSaveData, 
  resetPlayerProfile 
} from '../engine/storage';
import { INITIAL_PLAYER_PROFILE, PlayerProfile } from '../types/game';
import { ALL_PUZZLES } from '../data/puzzles';
import { LAB_ROOMS } from '../types/lab';
import { EquationBalancerPuzzle, MoleculeBuilderPuzzle, PeriodicTableQuizPuzzle, TrueFalsePuzzle, MysteryDetectivePuzzle, SubstanceAnalysisPuzzle } from '../types/puzzles';

describe('Phase 5: Vollständige Qualitätssicherung (Full QA & Stress Tests)', () => {

  describe('1. Stresstests & Edge Cases der Chemie-Engine', () => {
    it('sollte komplexe chemische Formeln mit verschachtelten Klammern exakt zählen', () => {
      // Calciumhydroxid: Ca(OH)2 -> Ca: 1, O: 2, H: 2
      expect(countAtomsInFormula('Ca(OH)2')).toEqual({ Ca: 1, O: 2, H: 2 });

      // Aluminiumsulfat: Al2(SO4)3 -> Al: 2, S: 3, O: 12
      expect(countAtomsInFormula('Al2(SO4)3')).toEqual({ Al: 2, S: 3, O: 12 });

      // Ammoniumphosphat: (NH4)3PO4 -> N: 3, H: 12, P: 1, O: 4
      expect(countAtomsInFormula('(NH4)3PO4')).toEqual({ N: 3, H: 12, P: 1, O: 4 });

      // Essigsäure: CH3COOH -> C: 2, H: 4, O: 2
      expect(countAtomsInFormula('CH3COOH')).toEqual({ C: 2, H: 4, O: 2 });

      // Haushaltszucker (Saccharose): C12H22O11
      expect(countAtomsInFormula('C12H22O11')).toEqual({ C: 12, H: 22, O: 11 });

      // Grenzfälle: Leerstring, Einzelelement
      expect(countAtomsInFormula('')).toEqual({});
      expect(countAtomsInFormula('H')).toEqual({ H: 1 });
      expect(countAtomsInFormula('He')).toEqual({ He: 1 });
    });

    it('sollte Massenerhaltung bei extremen und fehlerhaften Koeffizienten prüfen', () => {
      // Knallgasreaktion: 2 H2 + O2 -> 2 H2O
      const balancedReactants = [
        { formula: 'H2', coefficient: 2, name: 'Wasserstoff' },
        { formula: 'O2', coefficient: 1, name: 'Sauerstoff' }
      ];
      const balancedProducts = [
        { formula: 'H2O', coefficient: 2, name: 'Wasser' }
      ];

      expect(verifyEquationMassBalance(balancedReactants, balancedProducts).isBalanced).toBe(true);

      // Falsche Koeffizienten: 1 H2 + 1 O2 -> 1 H2O
      const wrongReactants = [
        { formula: 'H2', coefficient: 1, name: 'Wasserstoff' },
        { formula: 'O2', coefficient: 1, name: 'Sauerstoff' }
      ];
      const wrongProducts = [
        { formula: 'H2O', coefficient: 1, name: 'Wasser' }
      ];
      expect(verifyEquationMassBalance(wrongReactants, wrongProducts).isBalanced).toBe(false);

      // Ungültige/Negative Koeffizienten
      const negReactants = [
        { formula: 'H2', coefficient: -2, name: 'Wasserstoff' },
        { formula: 'O2', coefficient: 1, name: 'Sauerstoff' }
      ];
      expect(verifyEquationMassBalance(negReactants, balancedProducts).isBalanced).toBe(false);

      const zeroReactants = [
        { formula: 'H2', coefficient: 0, name: 'Wasserstoff' },
        { formula: 'O2', coefficient: 1, name: 'Sauerstoff' }
      ];
      expect(verifyEquationMassBalance(zeroReactants, balancedProducts).isBalanced).toBe(false);
    });

    it('sollte Molekül-Zusammensetzung präzise mit Über- und Unterbesetzung prüfen', () => {
      const required = { H: 2, O: 1 }; // H2O

      // Korrekt
      expect(verifyMoleculeComposition(['H', 'H', 'O'], required).isComplete).toBe(true);
      expect(verifyMoleculeComposition(['O', 'H', 'H'], required).isComplete).toBe(true);

      // Zu wenig Atome
      expect(verifyMoleculeComposition(['H', 'O'], required).isComplete).toBe(false);

      // Zu viele Atome
      expect(verifyMoleculeComposition(['H', 'H', 'H', 'O'], required).isComplete).toBe(false);

      // Falsche Atomsorten
      expect(verifyMoleculeComposition(['H', 'H', 'C'], required).isComplete).toBe(false);
      expect(verifyMoleculeComposition([], required).isComplete).toBe(false);
    });
  });

  describe('2. Robuste Fehlerbehandlung & Speicher-Resilienz (LocalStorage)', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('sollte bei korruptem oder fehlerhaftem JSON im LocalStorage sicher auf Standardwerte zurückfallen', () => {
      // Ungültiges JSON simulieren
      localStorage.setItem('chemistry_mystery_save_v1', '{"malformed": json, 1234');
      
      const profile = loadPlayerProfile();
      expect(profile).toBeDefined();
      expect(profile.username).toBe(INITIAL_PLAYER_PROFILE.username);
      expect(profile.level).toBe(1);
      expect(profile.currentXP).toBe(0);
      expect(profile.unlockedRooms).toContain('elemental_lab');
    });

    it('sollte bei unvollständigen Objekten fehlende Arrays und Unterobjekte automatisch reparieren', () => {
      // Unvollständiges Profil ohne stats, settings oder unlockedRooms
      localStorage.setItem('chemistry_mystery_save_v1', JSON.stringify({
        username: 'Test-Forscher',
        currentXP: 80
      }));

      const profile = loadPlayerProfile();
      expect(profile.username).toBe('Test-Forscher');
      expect(profile.currentXP).toBe(80);
      expect(profile.stats).toBeDefined();
      expect(profile.settings).toBeDefined();
      expect(Array.isArray(profile.unlockedRooms)).toBe(true);
      expect(profile.unlockedRooms).toContain('elemental_lab');
      expect(Array.isArray(profile.badges)).toBe(true);
      expect(Array.isArray(profile.elementCards)).toBe(true);
    });

    it('sollte fehlerhafte Backup-Dateien beim Import abweisen ohne abzustürzen', () => {
      // Unbekanntes Dateiformat
      expect(importPlayerSaveData('{"invalid": true}')).toBeNull();

      // Kaputtes JSON
      expect(importPlayerSaveData('NOT_JSON_AT_ALL')).toBeNull();

      // Leerstring
      expect(importPlayerSaveData('')).toBeNull();
    });

    it('sollte den Spielstand sauber auf den Werkszustand zurücksetzen', () => {
      const advancedProfile: PlayerProfile = {
        ...INITIAL_PLAYER_PROFILE,
        currentXP: 9999,
        level: 15,
        completedPuzzleIds: ['puzzle_1', 'puzzle_2']
      };
      savePlayerProfile(advancedProfile);
      expect(loadPlayerProfile().currentXP).toBe(9999);

      const reset = resetPlayerProfile();
      expect(reset.currentXP).toBe(0);
      expect(reset.level).toBe(1);
      expect(loadPlayerProfile().currentXP).toBe(0);
    });
  });

  describe('3. Level- & Lernsystem Grenzwerte und Raumfreischaltungen', () => {
    it('sollte extrem hohe XP ohne Überlauf oder Endlosschleife berechnen', () => {
      const highLvl = calculateLevel(100000);
      expect(highLvl.level).toBeGreaterThan(30);
      expect(highLvl.xpToNextLevel).toBeGreaterThan(0);
    });

    it('sollte 0 und negative XP sicher abfangen', () => {
      expect(calculateLevel(0).level).toBe(1);
      expect(calculateLevel(-50).level).toBe(1);
    });

    it('sollte Spaced Repetition Queue deduplizieren und beim Meistern abbauen', () => {
      let profile = { ...INITIAL_PLAYER_PROFILE };
      const puzzle = ALL_PUZZLES[0];

      // Zweimal falsch beantwortet -> darf nur 1x in der Liste stehen
      const fail1 = evaluatePuzzleResult(profile, puzzle, false, false);
      profile = fail1.updatedProfile;
      expect(profile.failedPuzzlesToReview).toEqual([puzzle.id]);

      const fail2 = evaluatePuzzleResult(profile, puzzle, false, false);
      profile = fail2.updatedProfile;
      expect(profile.failedPuzzlesToReview.filter(id => id === puzzle.id).length).toBe(1);

      // Jetzt richtig gelöst -> muss aus failedPuzzlesToReview entfernt werden und Spaced-Bonus gewähren
      const successReview = evaluatePuzzleResult(profile, puzzle, true, false);
      expect(successReview.updatedProfile.failedPuzzlesToReview).not.toContain(puzzle.id);
      expect(successReview.xpEarned).toBe(puzzle.xpReward + 15); // +15 Spaced Repetition Bonus!
    });

    it('sollte Raumfreischaltungen schrittweise basierend auf Fortschritt aktivieren', () => {
      const profile: PlayerProfile = { ...INITIAL_PLAYER_PROFILE, completedPuzzleIds: [] };

      // Raum 1 ist initial offen
      expect(profile.unlockedRooms).toContain('elemental_lab');

      // Schließe 3 Rätsel im Elementarlabor ab
      const lab1Puzzles = ALL_PUZZLES.filter(p => p.room === 'elemental_lab').slice(0, 3);
      let updated: PlayerProfile = { ...profile };
      for (const p of lab1Puzzles) {
        const ev = evaluatePuzzleResult(updated, p, true, true);
        updated = ev.updatedProfile;
      }

      // Raum 2 (atom_chamber) muss nun freigeschaltet sein (benötigt Level 2 / 100 XP)!
      expect(updated.level).toBeGreaterThanOrEqual(2);
      expect(updated.unlockedRooms).toContain('atom_chamber');
    });

    it('alle definierten Abzeichen sollten konsistente Metadaten haben', () => {
      expect(AVAILABLE_BADGES.length).toBeGreaterThanOrEqual(10);
      for (const badge of AVAILABLE_BADGES) {
        expect(badge.id).toBeDefined();
        expect(badge.title.length).toBeGreaterThan(3);
        expect(badge.description.length).toBeGreaterThan(5);
        expect(badge.category).toBeDefined();
      }
    });
  });

  describe('4. Vollständige Validierung aller 36 Rätsel aller 8 Laborräume', () => {
    it('alle 36 Rätsel müssen gültig und lösbar sein', () => {
      expect(ALL_PUZZLES.length).toBe(36);

      const roomIds = LAB_ROOMS.map(r => r.id);

      for (const puzzle of ALL_PUZZLES) {
        expect(roomIds).toContain(puzzle.room);
        expect(puzzle.title.length).toBeGreaterThan(3);
        expect(puzzle.question.length).toBeGreaterThan(5);
        expect(puzzle.hint.length).toBeGreaterThan(5);
        expect(puzzle.detailedHint.length).toBeGreaterThan(10);
        expect(puzzle.xpReward).toBeGreaterThan(0);

        // Spezifische Prüfungen nach Rätseltyp
        if (puzzle.type === 'equation_balancer') {
          const eq = puzzle as EquationBalancerPuzzle;
          const { reactants, products, correctCoefficients } = eq.reaction;
          const reactantsWithCoeffs = reactants.map((r, i) => ({
            ...r,
            coefficient: correctCoefficients.reactants[i]
          }));
          const productsWithCoeffs = products.map((p, i) => ({
            ...p,
            coefficient: correctCoefficients.products[i]
          }));
          const isBalanced = verifyEquationMassBalance(reactantsWithCoeffs, productsWithCoeffs).isBalanced;
          expect(isBalanced).toBe(true);
        }

        if (puzzle.type === 'molecule_builder') {
          const mol = puzzle as MoleculeBuilderPuzzle;
          expect(mol.targetMolecule).toBeDefined();
          expect(Object.keys(mol.targetMolecule.requiredAtoms).length).toBeGreaterThan(0);
        }

        if (puzzle.type === 'periodic_table_quiz') {
          const quiz = puzzle as PeriodicTableQuizPuzzle;
          expect(quiz.targetSymbol.length).toBeGreaterThan(0);
          expect(quiz.criteriaDescription.length).toBeGreaterThan(5);
          expect(quiz.clues.length).toBeGreaterThanOrEqual(1);
        }

        if (puzzle.type === 'true_false') {
          const tf = puzzle as TrueFalsePuzzle;
          expect(typeof tf.isTrue).toBe('boolean');
          expect(tf.didacticExplanation.length).toBeGreaterThan(10);
        }

        if (puzzle.type === 'mystery_detective') {
          const det = puzzle as MysteryDetectivePuzzle;
          expect(det.hypotheses.length).toBeGreaterThanOrEqual(2);
          const correctCount = det.hypotheses.filter(h => h.isCorrect).length;
          expect(correctCount).toBe(1);
          expect(det.evidenceItems.length).toBeGreaterThanOrEqual(1);
        }

        if (puzzle.type === 'substance_analysis') {
          const sub = puzzle as SubstanceAnalysisPuzzle;
          expect(sub.candidateChoices).toContain(sub.sample.correctIdentity);
          expect(sub.sample.pHValue).toBeGreaterThanOrEqual(0);
          expect(sub.sample.pHValue).toBeLessThanOrEqual(14);
        }
      }
    });
  });
});
