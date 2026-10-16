import { describe, it, expect } from 'vitest';
import { ELEMENTS_DATA, getElementBySymbol, getElementByNumber, getElectronShells } from '../data/elements';
import { soundEngine } from '../engine/audio';

describe('Phase 4: Design & Spielgefühl – Periodensystem & Bohr-Visualizer Tests', () => {
  it('ELEMENTS_DATA should contain distinct and valid chemical elements', () => {
    expect(ELEMENTS_DATA.length).toBeGreaterThanOrEqual(25);

    const symbols = new Set<string>();
    const atomicNumbers = new Set<number>();

    for (const elem of ELEMENTS_DATA) {
      expect(symbols.has(elem.symbol)).toBe(false);
      expect(atomicNumbers.has(elem.atomicNumber)).toBe(false);

      symbols.add(elem.symbol);
      atomicNumbers.add(elem.atomicNumber);

      expect(elem.symbol.length).toBeGreaterThanOrEqual(1);
      expect(elem.name.length).toBeGreaterThan(1);
      expect(elem.atomicMass).toBeGreaterThan(0);
      expect(elem.period).toBeGreaterThanOrEqual(1);
      expect(elem.period).toBeLessThanOrEqual(7);
      expect(elem.group).toBeGreaterThanOrEqual(1);
      expect(elem.group).toBeLessThanOrEqual(18);
      expect(elem.protons).toBe(elem.atomicNumber);
      expect(elem.electrons).toBe(elem.atomicNumber);
      expect(elem.funFact.length).toBeGreaterThan(10);
      expect(elem.realWorldUse.length).toBeGreaterThan(10);
    }
  });

  it('lookup helpers getElementBySymbol and getElementByNumber should resolve accurately', () => {
    const gold = getElementBySymbol('Au');
    expect(gold).toBeDefined();
    expect(gold?.atomicNumber).toBe(79);
    expect(gold?.name).toBe('Gold');

    const carbon = getElementByNumber(6);
    expect(carbon).toBeDefined();
    expect(carbon?.symbol).toBe('C');
    expect(carbon?.protons).toBe(6);
  });

  it('Bohr electron shells getElectronShells should compute correct physical capacities', () => {
    // Wasserstoff: 1 e- in K-Schale
    expect(getElectronShells(1)).toEqual([1]);

    // Helium: 2 e- in K-Schale (Edelgaskonfiguration)
    expect(getElectronShells(2)).toEqual([2]);

    // Lithium: K=2, L=1
    expect(getElectronShells(3)).toEqual([2, 1]);

    // Kohlenstoff: K=2, L=4
    expect(getElectronShells(6)).toEqual([2, 4]);

    // Sauerstoff: K=2, L=6
    expect(getElectronShells(8)).toEqual([2, 6]);

    // Neon: K=2, L=8 (Edelgas)
    expect(getElectronShells(10)).toEqual([2, 8]);

    // Natrium: K=2, L=8, M=1
    expect(getElectronShells(11)).toEqual([2, 8, 1]);

    // Calcium: K=2, L=8, M=8, N=2
    expect(getElectronShells(20)).toEqual([2, 8, 8, 2]);

    // Eisen (Fe, 26): K=2, L=8, M=14, N=2
    expect(getElectronShells(26)).toEqual([2, 8, 14, 2]);

    // Gold (Au, 79): K=2, L=8, M=18, N=32, O=18, P=1
    expect(getElectronShells(79)).toEqual([2, 8, 18, 32, 18, 1]);

    // Die Summe der Schalenelektronen muss immer exakt der Ordnungszahl Z entsprechen
    for (const elem of ELEMENTS_DATA) {
      const shells = getElectronShells(elem.atomicNumber);
      const sumElectrons = shells.reduce((a, b) => a + b, 0);
      expect(sumElectrons).toBe(elem.atomicNumber);
    }
  });

  it('Web Audio sound engine should handle calls gracefully without crashing', () => {
    expect(() => {
      soundEngine.setMuted(true);
      expect(soundEngine.getMuted()).toBe(true);

      soundEngine.playClick();
      soundEngine.playLockKey();
      soundEngine.playSuccess();
      soundEngine.playHintNotice();
      soundEngine.playBubble();
      soundEngine.playReactionHiss();
      soundEngine.playAtomOrbit();
      soundEngine.playCardReveal();
      soundEngine.playLevelUp();

      soundEngine.setMuted(false);
      expect(soundEngine.getMuted()).toBe(false);
      soundEngine.setVolume(0.5);
    }).not.toThrow();
  });
});
