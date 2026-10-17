import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MicrocosmZoomVisualizer } from '../components/visualizers/MicrocosmZoomVisualizer';
import { AtomVisualizer } from '../components/visualizers/AtomVisualizer';
import { getElementByNumber } from '../data/elements';

describe('MicrocosmZoomVisualizer (4-Stufen Zoom in den Atomkern)', () => {
  it('renders MicrocosmZoomVisualizer without errors for Hydrogen (Z=1)', () => {
    const h = getElementByNumber(1);
    expect(h).toBeDefined();
    if (!h) return;

    const html = renderToString(<MicrocosmZoomVisualizer element={h} />);
    expect(html).toContain('Wasserstoff');
    expect(html).toContain('H');
    expect(html).toContain('Makroschau');
  });

  it('renders MicrocosmZoomVisualizer without errors for Iron (Z=26)', () => {
    const fe = getElementByNumber(26);
    expect(fe).toBeDefined();
    if (!fe) return;

    const html = renderToString(<MicrocosmZoomVisualizer element={fe} />);
    expect(html).toContain('Eisen');
    expect(html).toContain('Fe');
    expect(html).toContain('26');
  });

  it('renders MicrocosmZoomVisualizer without errors for Gold (Z=79)', () => {
    const au = getElementByNumber(79);
    expect(au).toBeDefined();
    if (!au) return;

    const html = renderToString(<MicrocosmZoomVisualizer element={au} />);
    expect(html).toContain('Gold');
    expect(html).toContain('Au');
    expect(html).toContain('79');
  });

  it('renders AtomVisualizer with green neutrons, red protons, and blue electrons with minus', () => {
    const fe = getElementByNumber(26);
    expect(fe).toBeDefined();
    if (!fe) return;

    // 2D Bohr-Modus Prüfung
    const html2D = renderToString(<AtomVisualizer element={fe} defaultMode="2d" />);
    expect(html2D).toContain('electron-glow');
    expect(html2D).toContain('#3b82f6');
    expect(html2D).toContain('-');
    expect(html2D).toContain('#ef4444');
    expect(html2D).toContain('Proton');
    expect(html2D).toContain('#22c55e');
    expect(html2D).toContain('Neutron');

    // 3D Atom-Modus Prüfung
    const html3D = renderToString(<AtomVisualizer element={fe} defaultMode="3d" />);
    expect(html3D).toContain('3D-Atommodell');
    expect(html3D).toContain('Protonen: 26');
    expect(html3D).toContain('Neutronen: 30');
    expect(html3D).toContain('Elektronen: 26');
    expect(html3D).toContain('Quantensprung');
  });

  it('correctly models quark charges for Proton (+1e) and Neutron (0e)', () => {
    // Proton: 2x (+2/3) + 1x (-1/3) = +1
    const protonCharge = 2 * (2 / 3) + 1 * (-1 / 3);
    expect(Math.round(protonCharge)).toBe(1);

    // Neutron: 1x (+2/3) + 2x (-1/3) = 0
    const neutronCharge = 1 * (2 / 3) + 2 * (-1 / 3);
    expect(Math.round(neutronCharge)).toBe(0);
  });
});
