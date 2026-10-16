import { describe, it, expect } from 'vitest';
import { countAtomsInFormula, verifyEquationMassBalance, verifyMoleculeComposition } from '../engine/chemistryEngine';

describe('Chemie-Engine & Stöchiometrie', () => {
  it('parst und zählt Atome in einfachen Formeln korrekt', () => {
    expect(countAtomsInFormula('H2O')).toEqual({ H: 2, O: 1 });
    expect(countAtomsInFormula('CO2')).toEqual({ C: 1, O: 2 });
    expect(countAtomsInFormula('CH4')).toEqual({ C: 1, H: 4 });
  });

  it('berücksichtigt Koeffizienten und Sonderzeichen/Subskripte', () => {
    // 2 H₂O -> 4 H, 2 O
    expect(countAtomsInFormula('H₂O', 2)).toEqual({ H: 4, O: 2 });
    // 3 CO₂ -> 3 C, 6 O
    expect(countAtomsInFormula('CO₂', 3)).toEqual({ C: 3, O: 6 });
  });

  it('verifiziert ausgeglichene Reaktionsgleichungen nach Massenerhaltung', () => {
    // 2 H2 + 1 O2 -> 2 H2O
    const result = verifyEquationMassBalance(
      [
        { formula: 'H2', coefficient: 2 },
        { formula: 'O2', coefficient: 1 }
      ],
      [
        { formula: 'H2O', coefficient: 2 }
      ]
    );

    expect(result.isBalanced).toBe(true);
    expect(result.discrepancies.length).toBe(0);
    expect(result.reactantCounts).toEqual({ H: 4, O: 2 });
    expect(result.productCounts).toEqual({ H: 4, O: 2 });
  });

  it('erkennt nicht ausgeglichene Gleichungen mit genauer Diskrepanz', () => {
    // 1 H2 + 1 O2 -> 1 H2O (fehlen 1 O links oder rechts zu wenig)
    const result = verifyEquationMassBalance(
      [
        { formula: 'H2', coefficient: 1 },
        { formula: 'O2', coefficient: 1 }
      ],
      [
        { formula: 'H2O', coefficient: 1 }
      ]
    );

    expect(result.isBalanced).toBe(false);
    expect(result.discrepancies.length).toBeGreaterThan(0);
  });

  it('validiert den Molekülbaukasten exakt gegen Zielatome', () => {
    const required = { H: 2, O: 1 };
    
    // Richtig
    const match = verifyMoleculeComposition({ H: 2, O: 1 }, required);
    expect(match.isComplete).toBe(true);
    expect(Object.keys(match.missing).length).toBe(0);

    // Zu wenig Wasserstoff
    const missingH = verifyMoleculeComposition({ H: 1, O: 1 }, required);
    expect(missingH.isComplete).toBe(false);
    expect(missingH.missing['H']).toBe(1);

    // Zu viel Sauerstoff
    const surplusO = verifyMoleculeComposition({ H: 2, O: 2 }, required);
    expect(surplusO.isComplete).toBe(false);
    expect(surplusO.surplus['O']).toBe(1);
  });
});
