import { describe, it, expect } from 'vitest';
import { ELEMENTS_DATA, getElementByNumber, getElementBySymbol } from '../data/elements';
import { soundEngine } from '../engine/audio';

describe('Periodensystem & Bewegung (118 Elemente & Quantenmechanik)', () => {
  it('enthält alle 118 IUPAC Elemente lückenlos von H bis Og', () => {
    expect(ELEMENTS_DATA.length).toBe(118);

    // Prüfe erste und letzte Elemente
    const h = getElementByNumber(1);
    expect(h?.symbol).toBe('H');
    expect(h?.name).toBe('Wasserstoff');
    expect(h?.period).toBe(1);
    expect(h?.group).toBe(1);

    const og = getElementByNumber(118);
    expect(og?.symbol).toBe('Og');
    expect(og?.name).toBe('Oganesson');
    expect(og?.period).toBe(7);
    expect(og?.group).toBe(18);

    // Prüfe lückenlose Ordnungszahlen 1 bis 118
    for (let i = 1; i <= 118; i++) {
      const elem = getElementByNumber(i);
      expect(elem).toBeDefined();
      expect(elem?.atomicNumber).toBe(i);
      expect(elem?.symbol.length).toBeGreaterThanOrEqual(1);
      expect(elem?.name.length).toBeGreaterThan(0);
      expect(elem?.period).toBeGreaterThanOrEqual(1);
      expect(elem?.period).toBeLessThanOrEqual(7);
      expect(elem?.group).toBeGreaterThanOrEqual(1);
      expect(elem?.group).toBeLessThanOrEqual(18);
      expect(elem?.atomicMass).toBeGreaterThan(0);
    }
  });

  it('trennt Lanthanoide (57-71) und Actinoide (89-103) für das klassische 18-Spalten-Layout sauber ab', () => {
    const lanthanoids = ELEMENTS_DATA.filter(e => e.atomicNumber >= 57 && e.atomicNumber <= 71);
    expect(lanthanoids.length).toBe(15);
    expect(lanthanoids[0].symbol).toBe('La');
    expect(lanthanoids[14].symbol).toBe('Lu');

    const actinoids = ELEMENTS_DATA.filter(e => e.atomicNumber >= 89 && e.atomicNumber <= 103);
    expect(actinoids.length).toBe(15);
    expect(actinoids[0].symbol).toBe('Ac');
    expect(actinoids[14].symbol).toBe('Lr');

    const mainTable = ELEMENTS_DATA.filter(e => {
      const isLanthanide = e.atomicNumber >= 57 && e.atomicNumber <= 71;
      const isActinide = e.atomicNumber >= 89 && e.atomicNumber <= 103;
      return !isLanthanide && !isActinide;
    });
    expect(mainTable.length).toBe(118 - 30); // 88 Haupttabellen-Elemente
  });

  it('findet Elemente zuverlässig nach Symbol (case-insensitive)', () => {
    expect(getElementBySymbol('fe')?.name).toBe('Eisen');
    expect(getElementBySymbol('Au')?.name).toBe('Gold');
    expect(getElementBySymbol('u')?.name).toBe('Uran');
    expect(getElementBySymbol('O')?.atomicNumber).toBe(8);
  });

  it('unterstützt Quantensprung- und Orbit-Soundeffekte im Audio-Synthesizer', () => {
    expect(typeof soundEngine.playQuantumJump).toBe('function');
    expect(typeof soundEngine.playAtomOrbit).toBe('function');
    
    // Darf ohne DOM/AudioContext fehlerfrei aufgerufen werden
    expect(() => soundEngine.playQuantumJump()).not.toThrow();
    expect(() => soundEngine.playAtomOrbit()).not.toThrow();
  });
});
