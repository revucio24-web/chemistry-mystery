import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { PeriodicTableModal } from '../components/common/PeriodicTableModal';
import { ELEMENTS_DATA, getElementPhysics } from '../data/elements';

describe('Periodensystem Lehrbuch-Design & Vollbildmodus', () => {
  it('rendert das Periodensystem mit authentischer Lehrbuch-Musterzelle', () => {
    const html = renderToString(<PeriodicTableModal isOpen={true} onClose={() => {}} />);
    
    // Header & Vollbild-Button
    expect(html).toContain('Periodensystem der Elemente (PSE)');
    expect(html).toContain('Vollbild (F)');
    expect(html).toContain('118 Elemente');
    expect(html).toContain('IUPAC Standard');

    // Didaktische Musterzelle (Erklärungskachel wie im Schulbuch)
    expect(html).toContain('Lehrbuch-Muster');
    expect(html).toContain('Ordnungszahl Z');
    expect(html).toContain('Elektronegativität');
    expect(html).toContain('Atommasse u');
    expect(html).toContain('Eisen');
    expect(html).toContain('Fe');
    expect(html).toContain('55,845');
    expect(html).toContain('1,83');

    // Kategorien in der Legende
    expect(html).toContain('Alkalimetalle');
    expect(html).toContain('Übergangsmetalle');
    expect(html).toContain('Edelgase');
  });

  it('zeigt für jedes Element die echten physikalischen Kennzahlen nach Lehrbuch-Standard', () => {
    const iron = ELEMENTS_DATA.find(e => e.atomicNumber === 26);
    expect(iron).toBeDefined();
    expect(iron?.symbol).toBe('Fe');
    expect(iron?.name).toBe('Eisen');
    
    const fePhysics = getElementPhysics(26);
    expect(fePhysics.en).toBe(1.83);
    expect(fePhysics.dens).toBe('7.874 g/cm³');
    expect(fePhysics.mp).toBe(1538);

    const gold = ELEMENTS_DATA.find(e => e.atomicNumber === 79);
    expect(gold).toBeDefined();
    expect(gold?.symbol).toBe('Au');
    expect(gold?.name).toBe('Gold');
    
    const auPhysics = getElementPhysics(79);
    expect(auPhysics.en).toBe(2.54);
  });

  it('enthält den Umschalter zwischen 18-Spalten-Tabelle, Kacheln und 4-Stufen Kern-Zoom', () => {
    const html = renderToString(<PeriodicTableModal isOpen={true} onClose={() => {}} />);
    expect(html).toContain('18-Spalten');
    expect(html).toContain('Kacheln');
    expect(html).toContain('Kern-Zoom');
    expect(html).toContain('Bohrsches Schalenmodell');
  });
});
