import { describe, it, expect } from 'vitest';
import { ALL_PUZZLES, getPuzzlesForRoom } from '../data/puzzles';
import { LAB_ROOMS } from '../types/lab';
import { verifyEquationMassBalance, verifyMoleculeComposition } from '../engine/chemistryEngine';

describe('Phase 3 Qualitätssicherung: Alle 8 Laborbereiche & 36 Missionen', () => {
  it('enthält insgesamt 36 fachlich geprüfte Missionen in ALL_PUZZLES', () => {
    expect(ALL_PUZZLES.length).toBe(36);
  });

  it('jeder der 8 Laborräume besitzt zugeordnete Missionen', () => {
    LAB_ROOMS.forEach(room => {
      const roomPuzzles = getPuzzlesForRoom(room.id);
      expect(roomPuzzles.length).toBeGreaterThanOrEqual(2);
      expect(roomPuzzles.length).toBe(room.missionsCount);
    });
  });

  it('alle 36 Rätsel erfüllen die didaktischen Qualitätsstandards', () => {
    ALL_PUZZLES.forEach(puzzle => {
      expect(puzzle.title).toBeTruthy();
      expect(puzzle.question).toBeTruthy();
      expect(puzzle.loreContext).toBeTruthy();
      expect(puzzle.hint).toBeTruthy();
      expect(puzzle.detailedHint).toBeTruthy();
      expect(puzzle.didacticExplanation).toBeTruthy();
      expect(puzzle.commonMistakeExplanation).toBeTruthy();
      expect(puzzle.realWorldExample).toBeTruthy();
      expect(puzzle.xpReward).toBeGreaterThan(0);
    });
  });

  it('Molekülwerkstatt (Raum 3): CH4, CO2 und NH3 sind mit korrekten Valenzen baubar', () => {
    const r3Puzzles = getPuzzlesForRoom('molecule_workshop');
    const ch4Puzzle = r3Puzzles.find(p => p.id === 'mol_puzzle_01');
    const co2Puzzle = r3Puzzles.find(p => p.id === 'mol_puzzle_02');
    const nh3Puzzle = r3Puzzles.find(p => p.id === 'mol_puzzle_03');

    expect(ch4Puzzle?.type).toBe('molecule_builder');
    expect(co2Puzzle?.type).toBe('molecule_builder');
    expect(nh3Puzzle?.type).toBe('molecule_builder');

    if (ch4Puzzle?.type === 'molecule_builder') {
      const check = verifyMoleculeComposition({ C: 1, H: 4 }, ch4Puzzle.targetMolecule.requiredAtoms);
      expect(check.isComplete).toBe(true);
    }
    if (co2Puzzle?.type === 'molecule_builder') {
      const check = verifyMoleculeComposition({ C: 1, O: 2 }, co2Puzzle.targetMolecule.requiredAtoms);
      expect(check.isComplete).toBe(true);
    }
    if (nh3Puzzle?.type === 'molecule_builder') {
      const check = verifyMoleculeComposition({ N: 1, H: 3 }, nh3Puzzle.targetMolecule.requiredAtoms);
      expect(check.isComplete).toBe(true);
    }
  });

  it('Reaktionsraum & Umweltlabor: Alle Reaktionen sind stöchiometrisch exakt balancierbar', () => {
    const equationPuzzles = ALL_PUZZLES.filter(p => p.type === 'equation_balancer');
    expect(equationPuzzles.length).toBeGreaterThanOrEqual(4);

    equationPuzzles.forEach(ep => {
      if (ep.type === 'equation_balancer') {
        const rx = ep.reaction;
        const reactants = rx.reactants.map((r, i) => ({
          formula: r.formula,
          coefficient: rx.correctCoefficients.reactants[i]
        }));
        const products = rx.products.map((p, i) => ({
          formula: p.formula,
          coefficient: rx.correctCoefficients.products[i]
        }));
        const balance = verifyEquationMassBalance(reactants, products);
        expect(balance.isBalanced).toBe(true);
      }
    });
  });

  it('Geheimes Forschungslabor (Raum 8): Enthält das finale Meisterschaftsrätsel', () => {
    const secretPuzzles = getPuzzlesForRoom('secret_research_lab');
    expect(secretPuzzles.length).toBe(2);

    const masterMystery = secretPuzzles.find(p => p.id === 'sec_puzzle_01');
    const masterCipher = secretPuzzles.find(p => p.id === 'sec_puzzle_02');

    expect(masterMystery).toBeDefined();
    expect(masterMystery?.type).toBe('mystery_detective');
    expect(masterCipher).toBeDefined();
    expect(masterCipher?.type).toBe('lab_door_cipher');
    if (masterCipher?.type === 'lab_door_cipher') {
      expect(masterCipher.requiredCode).toBe('784');
    }
  });
});
