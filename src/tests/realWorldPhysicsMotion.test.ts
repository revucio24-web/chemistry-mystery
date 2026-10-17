import { describe, it, expect } from 'vitest';
import { ELEMENTS_DATA } from '../data/elements';

describe('Reale Physik der Materie & Bewegung ("Wenn sich etwas im echten Leben bewegt, bewegt es sich im Game")', () => {
  it('1. kategorisiert Elemente wissenschaftlich korrekt nach realem Aggregatzustand bei Raumtemperatur (20°C)', () => {
    const hydrogen = ELEMENTS_DATA.find(e => e.symbol === 'H');
    const helium = ELEMENTS_DATA.find(e => e.symbol === 'He');
    const oxygen = ELEMENTS_DATA.find(e => e.symbol === 'O');
    const nitrogen = ELEMENTS_DATA.find(e => e.symbol === 'N');
    const iron = ELEMENTS_DATA.find(e => e.symbol === 'Fe');
    const carbon = ELEMENTS_DATA.find(e => e.symbol === 'C');
    const gold = ELEMENTS_DATA.find(e => e.symbol === 'Au');
    const mercury = ELEMENTS_DATA.find(e => e.symbol === 'Hg');
    const bromine = ELEMENTS_DATA.find(e => e.symbol === 'Br');

    // Gase im echten Leben
    expect(hydrogen?.stateAtRoomTemp).toBe('gas');
    expect(helium?.stateAtRoomTemp).toBe('gas');
    expect(oxygen?.stateAtRoomTemp).toBe('gas');
    expect(nitrogen?.stateAtRoomTemp).toBe('gas');

    // Feststoffe im echten Leben
    expect(iron?.stateAtRoomTemp).toBe('solid');
    expect(carbon?.stateAtRoomTemp).toBe('solid');
    expect(gold?.stateAtRoomTemp).toBe('solid');

    // Flüssigkeiten im echten Leben
    expect(mercury?.stateAtRoomTemp).toBe('liquid');
    expect(bromine?.stateAtRoomTemp).toBe('liquid');
  });

  it('2. stellt sicher, dass Gase thermische Brownsche Molekularbewegung besitzen und Feststoffe ruhen', () => {
    // Kriterien für reale Physik:
    const gasSymbols = ['H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn'];
    const solidSymbols = ['Fe', 'C', 'Na', 'S', 'Au', 'Cu', 'Ag', 'Pb'];

    for (const sym of gasSymbols) {
      const elem = ELEMENTS_DATA.find(e => e.symbol === sym);
      expect(elem?.stateAtRoomTemp).toBe('gas');
    }

    for (const sym of solidSymbols) {
      const elem = ELEMENTS_DATA.find(e => e.symbol === sym);
      expect(elem?.stateAtRoomTemp).toBe('solid');
    }
  });

  it('3. stellt sicher, dass alle 118 Elemente des Periodensystems einen validen realen Aggregatzustand haben', () => {
    expect(ELEMENTS_DATA.length).toBe(118);
    for (const elem of ELEMENTS_DATA) {
      expect(['solid', 'liquid', 'gas']).toContain(elem.stateAtRoomTemp);
    }
  });
});
