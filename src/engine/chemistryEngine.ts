// Chemische Berechnungs- und Validierungsengine

export interface ParsedAtomCounts {
  [elementSymbol: string]: number;
}

/**
 * Parst einfache und zusammengesetzte chemische Formeln inklusive Klammern
 * Unterstützt z.B. H2O, CO2, NaCl, Ca(OH)2, Al2(SO4)3, (NH4)3PO4, CH3COOH
 */
export function countAtomsInFormula(formula: string, coefficient: number = 1): ParsedAtomCounts {
  const result: ParsedAtomCounts = {};
  if (!formula || typeof formula !== 'string') return result;
  
  // Normalisiere Subskripte (z.B. ₂ -> 2, ₄ -> 4)
  let normalized = formula
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

  // Rekursiv/iterativ Klammern auflösen: z.B. (OH)2 -> O2H2, (NH4)3 -> N3H12
  const parenRegex = /\(([^()]+)\)(\d*)/;
  let parenMatch: RegExpMatchArray | null;
  while ((parenMatch = normalized.match(parenRegex)) !== null) {
    const inner = parenMatch[1];
    const multiplier = parenMatch[2] ? parseInt(parenMatch[2], 10) : 1;
    
    // Parse innere Elemente und multipliziere mit dem äußeren Index
    const innerElemRegex = /([A-Z][a-z]*)(\d*)/g;
    let innerStr = '';
    let m: RegExpExecArray | null;
    while ((m = innerElemRegex.exec(inner)) !== null) {
      const sym = m[1];
      const count = m[2] ? parseInt(m[2], 10) : 1;
      innerStr += `${sym}${count * multiplier}`;
    }
    normalized = normalized.replace(parenMatch[0], innerStr);
  }

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
  const discrepancies: string[] = [];

  // Prüfe auf ungültige Koeffizienten <= 0
  for (const item of reactants) {
    if (!item.coefficient || item.coefficient <= 0) {
      discrepancies.push(`Ungültiger Koeffizient (${item.coefficient}) für ${item.formula}`);
    }
  }
  for (const item of products) {
    if (!item.coefficient || item.coefficient <= 0) {
      discrepancies.push(`Ungültiger Koeffizient (${item.coefficient}) für ${item.formula}`);
    }
  }

  // Zähle Atome auf Edukt-Seite
  reactants.forEach(item => {
    const coeff = item.coefficient > 0 ? item.coefficient : 0;
    const atoms = countAtomsInFormula(item.formula, coeff);
    Object.entries(atoms).forEach(([sym, cnt]) => {
      reactantCounts[sym] = (reactantCounts[sym] || 0) + cnt;
    });
  });

  // Zähle Atome auf Produkt-Seite
  products.forEach(item => {
    const coeff = item.coefficient > 0 ? item.coefficient : 0;
    const atoms = countAtomsInFormula(item.formula, coeff);
    Object.entries(atoms).forEach(([sym, cnt]) => {
      productCounts[sym] = (productCounts[sym] || 0) + cnt;
    });
  });

  // Vergleiche alle vorkommenden Elemente
  const allSymbols = Array.from(new Set([...Object.keys(reactantCounts), ...Object.keys(productCounts)]));

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
 * Akzeptiert sowohl ein Record<string, number> als auch ein string[] Array
 */
export function verifyMoleculeComposition(
  chosenAtoms: Record<string, number> | string[],
  requiredAtoms: Record<string, number>
): { isComplete: boolean; missing: Record<string, number>; surplus: Record<string, number> } {
  const chosenMap: Record<string, number> = {};
  if (Array.isArray(chosenAtoms)) {
    for (const sym of chosenAtoms) {
      chosenMap[sym] = (chosenMap[sym] || 0) + 1;
    }
  } else {
    Object.assign(chosenMap, chosenAtoms);
  }

  const missing: Record<string, number> = {};
  const surplus: Record<string, number> = {};
  let isComplete = true;

  const allKeys = Array.from(new Set([...Object.keys(chosenMap), ...Object.keys(requiredAtoms)]));

  for (const sym of allKeys) {
    const chosen = chosenMap[sym] || 0;
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
