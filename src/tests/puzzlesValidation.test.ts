import { describe, it, expect } from 'vitest';
import { ELEMENTAL_LAB_PUZZLES } from '../data/puzzles';
import { verifyEquationMassBalance, verifyMoleculeComposition } from '../engine/chemistryEngine';

describe('Qualitätssicherung: Alle 10 Missionen des Elementarlabors', () => {
  it('enthält mindestens 10 vollständig ausgearbeitete Rätsel', () => {
    expect(ELEMENTAL_LAB_PUZZLES.length).toBeGreaterThanOrEqual(10);
  });

  it('jedes Rätsel besitzt didaktische Begründung, Alltagsbeispiel und Hinweise', () => {
    ELEMENTAL_LAB_PUZZLES.forEach(puzzle => {
      expect(puzzle.title).toBeTruthy();
      expect(puzzle.question).toBeTruthy();
      expect(puzzle.loreContext).toBeTruthy();
      expect(puzzle.hint).toBeTruthy();
      expect(puzzle.detailedHint).toBeTruthy();
      expect(puzzle.didacticExplanation).toBeTruthy();
      expect(puzzle.realWorldExample).toBeTruthy();
      expect(puzzle.xpReward).toBeGreaterThan(0);
    });
  });

  it('Rätsel 1 (Elemente zuordnen): Alle Paare sind eindeutig', () => {
    const p1 = ELEMENTAL_LAB_PUZZLES[0];
    if (p1.type === 'element_match') {
      expect(p1.pairs.length).toBe(4);
      const symbols = p1.pairs.map(p => p.symbol);
      expect(new Set(symbols).size).toBe(symbols.length);
    }
  });

  it('Rätsel 4 (Molekülbaukasten): Zielmolekül H2O ist chemisch valide und lösbar', () => {
    const p4 = ELEMENTAL_LAB_PUZZLES[3];
    if (p4.type === 'molecule_builder') {
      expect(p4.targetMolecule.formula).toBe('H₂O');
      const check = verifyMoleculeComposition({ H: 2, O: 1 }, p4.targetMolecule.requiredAtoms);
      expect(check.isComplete).toBe(true);
    }
  });

  it('Rätsel 5 (Codeschloss): Code 611 ist atomar begründet und eindeutig', () => {
    const p5 = ELEMENTAL_LAB_PUZZLES[4];
    if (p5.type === 'lab_door_cipher') {
      expect(p5.requiredCode).toBe('611');
      expect(p5.cipherClues.length).toBe(3);
    }
  });

  it('Rätsel 6 (Stoffanalyse): NaCl ist eindeutig als Probe identifizierbar', () => {
    const p6 = ELEMENTAL_LAB_PUZZLES[5];
    if (p6.type === 'substance_analysis') {
      expect(p6.sample.correctIdentity).toContain('Natriumchlorid');
      expect(p6.candidateChoices).toContain(p6.sample.correctIdentity);
      expect(p6.testOptions.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('Rätsel 7 (Reaktionsgleichung): Knallgasreaktion ist stöchiometrisch exakt balanciert', () => {
    const p7 = ELEMENTAL_LAB_PUZZLES[6];
    if (p7.type === 'equation_balancer') {
      const rx = p7.reaction;
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
      expect(balance.discrepancies.length).toBe(0);
    }
  });

  it('Rätsel 8 (Detektivfall): Mindestens eine Hypothese ist wissenschaftlich korrekt', () => {
    const p8 = ELEMENTAL_LAB_PUZZLES[7];
    if (p8.type === 'mystery_detective') {
      const correctHypotheses = p8.hypotheses.filter(h => h.isCorrect);
      expect(correctHypotheses.length).toBe(1);
      expect(correctHypotheses[0].text).toContain('Silbersulfid');
    }
  });
});
