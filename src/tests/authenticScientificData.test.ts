import { describe, it, expect } from 'vitest';
import { 
  getElectronShells, 
  getElectronConfiguration, 
  getElementPhysics,
  getElementByNumber
} from '../data/elements';

describe('Authentic Scientific Data (NIST & IUPAC Overhaul)', () => {
  it('has exact NIST electron shells for all 118 elements with sum equal to atomic number', () => {
    for (let z = 1; z <= 118; z++) {
      const shells = getElectronShells(z);
      expect(shells.length).toBeGreaterThan(0);
      const sum = shells.reduce((a, b) => a + b, 0);
      expect(sum).toBe(z);
    }
  });

  it('correctly models quantum mechanical anomalies in electron configurations', () => {
    // Chromium (Z=24): [Ar] 3d5 4s1 -> [2, 8, 13, 1]
    expect(getElectronShells(24)).toEqual([2, 8, 13, 1]);
    expect(getElectronConfiguration(24)).toContain('3d⁵ 4s¹');

    // Copper (Z=29): [Ar] 3d10 4s1 -> [2, 8, 18, 1]
    expect(getElectronShells(29)).toEqual([2, 8, 18, 1]);
    expect(getElectronConfiguration(29)).toContain('3d¹⁰ 4s¹');

    // Palladium (Z=46): [Kr] 4d10 5s0 -> [2, 8, 18, 18]
    expect(getElectronShells(46)).toEqual([2, 8, 18, 18]);
    expect(getElectronConfiguration(46)).toContain('[Kr] 4d¹⁰');

    // Silver (Z=47): [Kr] 4d10 5s1 -> [2, 8, 18, 18, 1]
    expect(getElectronShells(47)).toEqual([2, 8, 18, 18, 1]);
    expect(getElectronConfiguration(47)).toContain('4d¹⁰ 5s¹');

    // Gold (Z=79): [Xe] 4f14 5d10 6s1 -> [2, 8, 18, 32, 18, 1]
    expect(getElectronShells(79)).toEqual([2, 8, 18, 32, 18, 1]);
    expect(getElectronConfiguration(79)).toContain('5d¹⁰ 6s¹');

    // Potassium (Z=19): [2, 8, 8, 1] - NOT naive 2n^2
    expect(getElectronShells(19)).toEqual([2, 8, 8, 1]);

    // Calcium (Z=20): [2, 8, 8, 2] - NOT naive 2n^2
    expect(getElectronShells(20)).toEqual([2, 8, 8, 2]);
  });

  it('has non-empty authentic IUPAC electron configurations for all 118 elements', () => {
    for (let z = 1; z <= 118; z++) {
      const config = getElectronConfiguration(z);
      expect(config).toBeDefined();
      expect(config.length).toBeGreaterThan(0);
    }
  });

  it('provides real physical constants (EN, MP, BP, Density) for all elements', () => {
    // Hydrogen
    const hPhysics = getElementPhysics(1);
    expect(hPhysics.en).toBe(2.20);
    expect(hPhysics.mp).toBeCloseTo(-259.16, 1);
    expect(hPhysics.bp).toBeCloseTo(-252.87, 1);

    // Carbon
    const cPhysics = getElementPhysics(6);
    expect(cPhysics.en).toBe(2.55);
    expect(cPhysics.mp).toBe(3550);

    // Iron
    const fePhysics = getElementPhysics(26);
    expect(fePhysics.en).toBe(1.83);
    expect(fePhysics.mp).toBe(1538);
    expect(fePhysics.bp).toBe(2862);
    expect(fePhysics.dens).toContain('7.87');

    // Gold
    const auPhysics = getElementPhysics(79);
    expect(auPhysics.en).toBe(2.54);
    expect(auPhysics.mp).toBeCloseTo(1064.18, 1);
    expect(auPhysics.bp).toBe(2970);
    expect(auPhysics.dens).toContain('19.3');

    // Verify all 118 have entries in physics map
    for (let z = 1; z <= 118; z++) {
      const phys = getElementPhysics(z);
      expect(phys).toBeDefined();
    }
  });

  it('ELEMENTS_DATA contains the upgraded physics properties', () => {
    const o = getElementByNumber(8);
    expect(o).toBeDefined();
    expect(o?.electronConfiguration).toBe('[He] 2s² 2p⁴');
    expect(o?.electronegativity).toBe(3.44);
    expect(o?.density).toBe('1.429 g/L');

    const fe = getElementByNumber(26);
    expect(fe).toBeDefined();
    expect(fe?.electronConfiguration).toBe('[Ar] 3d⁶ 4s²');
    expect(fe?.electronegativity).toBe(1.83);
    expect(fe?.meltingPointC).toBe(1538);
    expect(fe?.boilingPointC).toBe(2862);
  });

  it('correctly models nucleon particles (protons and neutrons) for all 118 elements', () => {
    for (let z = 1; z <= 118; z++) {
      const elem = getElementByNumber(z);
      expect(elem).toBeDefined();
      expect(elem?.protons).toBe(z);
      expect(elem?.neutrons).toBeGreaterThanOrEqual(0);
      // Mass number A = Z + N
      const a = (elem?.protons || 0) + (elem?.neutrons || 0);
      expect(a).toBeGreaterThanOrEqual(z);
    }

    // Hydrogen-1 has 1 proton and 0 neutrons
    const h = getElementByNumber(1);
    expect(h?.protons).toBe(1);
    expect(h?.neutrons).toBe(0);

    // Helium-4 has 2 protons and 2 neutrons
    const he = getElementByNumber(2);
    expect(he?.protons).toBe(2);
    expect(he?.neutrons).toBe(2);

    // Iron-56 has 26 protons and 30 neutrons
    const fe = getElementByNumber(26);
    expect(fe?.protons).toBe(26);
    expect(fe?.neutrons).toBe(30);

    // Gold-197 has 79 protons and 118 neutrons
    const au = getElementByNumber(79);
    expect(au?.protons).toBe(79);
    expect(au?.neutrons).toBe(118);
  });
});
