// Chemische Berechnungs- und Validierungsengine

export interface ParsedAtomCounts {
  [elementSymbol: string]: number;
}

/**
 * Parst einfache und zusammengesetzte chemische Formeln
 * Unterstützt z.B. H2O, CO2, NaCl, Ca(OH)2, Fe2O3, CH4
 */
export function countAtomsInFormula(formula: string, coefficient: number = 1): ParsedAtomCounts {
  const result: ParsedAtomCounts = {};
  
  // Normalisiere Subskripte (z.B. ₂ -> 2, ₄ -> 4)
  const normalized = formula
    .replace(/₀/g, '0')
    .replace(/₁/g, '1')
    .replace(/₂/g, '2')
    .replace(/₃/g, '3')
    .replace(/₄/g, '4')
    .replace(/₅/g, '5')
    .replace(/₆/g, '6')
    .replace(/₇/g, '7')
    .replace(/₈/g, '8')
    .replace(/₉/g, '9');

  // Regex für Element gefolgt von optionaler Zahl
  const elementRegex = /([A-Z][a-z]*)(\d*)/g;
  let match: RegExpExecArray | null;

  while ((match = elementRegex.exec(normalized)) !== null) {
    const symbol = match[1];
    const count = match[2] ? parseInt(match[2], 10) : 1;
    result[symbol] = (result[symbol] || 0) + count * coefficient;
  }

  return result;
}

/**
 * Verifiziert das Gesetz der Massenerhaltung bei einer Reaktionsgleichung
 * Links und rechts muss die Gesamtzahl jedes Elements identisch sein
 */
export function verifyEquationMassBalance(
  reactants: Array<{ formula: string; coefficient: number }>,
  products: Array<{ formula: string; coefficient: number }>
): { isBalanced: boolean; reactantCounts: ParsedAtomCounts; productCounts: ParsedAtomCounts; discrepancies: string[] } {
  const reactantCounts: ParsedAtomCounts = {};
  const productCounts: ParsedAtomCounts = {};

  // Zähle Atome auf Edukt-Seite
  reactants.forEach(item => {
    const atoms = countAtomsInFormula(item.formula, Math.max(1, item.coefficient));
    Object.entries(atoms).forEach(([sym, cnt]) => {
      reactantCounts[sym] = (reactantCounts[sym] || 0) + cnt;
    });
  });

  // Zähle Atome auf Produkt-Seite
  products.forEach(item => {
    const atoms = countAtomsInFormula(item.formula, Math.max(1, item.coefficient));
    Object.entries(atoms).forEach(([sym, cnt]) => {
      productCounts[sym] = (productCounts[sym] || 0) + cnt;
    });
  });

  // Vergleiche alle vorkommenden Elemente
  const allSymbols = Array.from(new Set([...Object.keys(reactantCounts), ...Object.keys(productCounts)]));
  const discrepancies: string[] = [];

  allSymbols.forEach(sym => {
    const left = reactantCounts[sym] || 0;
    const right = productCounts[sym] || 0;
    if (left !== right) {
      discrepancies.push(`${sym}: links ${left} Atom(e), aber rechts ${right} Atom(e)`);
    }
  });

  return {
    isBalanced: discrepancies.length === 0,
    reactantCounts,
    productCounts,
    discrepancies
  };
}

/**
 * Überprüft, ob ein zusammengestellter Satz von Atomen exakt zur Zielformel passt
 */
export function verifyMoleculeComposition(
  chosenAtoms: Record<string, number>,
  requiredAtoms: Record<string, number>
): { isComplete: boolean; missing: Record<string, number>; surplus: Record<string, number> } {
  const missing: Record<string, number> = {};
  const surplus: Record<string, number> = {};
  let isComplete = true;

  const allKeys = Array.from(new Set([...Object.keys(chosenAtoms), ...Object.keys(requiredAtoms)]));

  for (const sym of allKeys) {
    const chosen = chosenAtoms[sym] || 0;
    const req = requiredAtoms[sym] || 0;

    if (chosen < req) {
      missing[sym] = req - chosen;
      isComplete = false;
    } else if (chosen > req) {
      surplus[sym] = chosen - req;
      isComplete = false;
    }
  }

  return { isComplete, missing, surplus };
}
