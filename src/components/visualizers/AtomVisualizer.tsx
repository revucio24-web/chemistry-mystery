import React, { useState, useEffect, useMemo } from 'react';
import { ChemicalElement } from '../../types/chemistry';
import { getElectronShells, getElectronConfiguration } from '../../data/elements';
import { soundEngine } from '../../engine/audio';
import { Play, Pause, Info, Sparkles, Zap, Gauge, Search, X, Atom } from 'lucide-react';
import { AtomVisualizer3D } from './AtomVisualizer3D';

interface AtomVisualizerProps {
  element: ChemicalElement;
  size?: number;
  showControls?: boolean;
  interactive?: boolean;
  className?: string;
  defaultMode?: '3d' | '2d';
}

const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
const BASE_DURATIONS = [8, 14, 22, 30, 38, 48, 58];

const SUBSHELL_DESCRIPTIONS: Record<number, string> = {
  0: '1s-Orbital (max 2e⁻)',
  1: '2s, 2p-Orbitale (max 8e⁻)',
  2: '3s, 3p, 3d-Orbitale (max 18e⁻)',
  3: '4s, 4p, 4d, 4f-Orbitale (max 32e⁻)',
  4: '5s, 5p, 5d, 5f-Orbitale (max 32e⁻)',
  5: '6s, 6p, 6d-Orbitale (max 18e⁻)',
  6: '7s, 7p-Orbitale (max 8e⁻)',
};

export const AtomVisualizer: React.FC<AtomVisualizerProps> = ({
  element,
  size = 360,
  showControls = true,
  interactive = true,
  className = '',
  defaultMode = '3d'
}) => {
  const [viewDimension, setViewDimension] = useState<'3d' | '2d'>(defaultMode);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [selectedShell, setSelectedShell] = useState<number | null>(null);
  const [showNucleusInspector, setShowNucleusInspector] = useState(false);
  const [nucleonFilter, setNucleonFilter] = useState<'all' | 'protons' | 'neutrons'>('all');
  const [inspectedParticle, setInspectedParticle] = useState<{
    type: 'proton' | 'neutron';
    index: number;
  } | null>(null);

  const [quantumEvent, setQuantumEvent] = useState<{
    active: boolean;
    shellIdx: number;
    photonX: number;
    photonY: number;
    message: string;
  } | null>(null);

  const shells = getElectronShells(element.atomicNumber);
  const totalElectrons = shells.reduce((sum, count) => sum + count, 0);
  const valenceElectrons = shells[shells.length - 1];
  const electronConfig = element.electronConfiguration || getElectronConfiguration(element.atomicNumber);

  // Shell-Radien im 400x400 Koordinatenraum (Zentrum 200, 200)
  const baseRadius = 40;
  const radiusStep = Math.min(24, Math.floor(140 / Math.max(shells.length, 1)));

  // Repräsentative Teilchen im Mini-Kern (Standard-Bohr-Visualizer)
  const miniNucleonList = useMemo(() => {
    const protons = element.protons;
    const neutrons = element.neutrons;
    const total = protons + neutrons;
    const count = Math.min(16, total);
    const list: Array<{ x: number; y: number; r: number; type: 'proton' | 'neutron' }> = [];
    let p = protons;
    let n = neutrons;

    for (let i = 0; i < count; i++) {
      const isProton = (p / (p + n)) > (n > 0 ? (i % 2 === 0 ? 0.48 : 0.52) : 0);
      const type: 'proton' | 'neutron' = ((isProton && p > 0) || n === 0) ? 'proton' : 'neutron';
      if (type === 'proton') p--; else n--;

      const dist = i === 0 ? 0 : 5.4 * Math.sqrt(i);
      const angle = i * 2.3999632;
      list.push({
        x: 200 + dist * Math.cos(angle),
        y: 200 + dist * Math.sin(angle),
        r: 2.2,
        type
      });
    }
    return list;
  }, [element.protons, element.neutrons]);

  // Vollständiger Nukleonen-Cluster für die vergrößerte Kernschau
  const nucleonList = useMemo(() => {
    const protons = element.protons;
    const neutrons = element.neutrons;
    const total = protons + neutrons;
    const list: Array<{ id: number; type: 'proton' | 'neutron'; x: number; y: number; r: number }> = [];
    let pCount = protons;
    let nCount = neutrons;

    const baseR = total <= 4 ? 13 : total <= 16 ? 9.5 : total <= 40 ? 6.5 : total <= 80 ? 4.8 : Math.max(2.8, 38 / Math.sqrt(total));
    const c = baseR * 1.8;
    const rawMaxRadius = total > 1 ? c * Math.sqrt(total - 1) : 0;
    const allowedMaxRadius = 66;
    const scale = rawMaxRadius > allowedMaxRadius ? (allowedMaxRadius / rawMaxRadius) : 1;
    const actualR = Math.max(2.4, baseR * scale);

    const cx = 130;
    const cy = 85;

    for (let i = 0; i < total; i++) {
      const isProton = (pCount / (pCount + nCount)) > (nCount > 0 ? (i % 2 === 0 ? 0.48 : 0.52) : 0);
      const type: 'proton' | 'neutron' = ((isProton && pCount > 0) || nCount === 0) ? 'proton' : 'neutron';
      if (type === 'proton') pCount--; else nCount--;

      let x = cx;
      let y = cy;
      if (i > 0) {
        const dist = c * Math.sqrt(i) * scale;
        const angle = i * 2.3999632;
        x = cx + dist * Math.cos(angle);
        y = cy + dist * Math.sin(angle);
      }

      list.push({ id: i, type, x, y, r: actualR });
    }

    return list;
  }, [element.protons, element.neutrons]);

  // Quantum Jump Trigger
  const triggerQuantumJump = (targetShellIdx?: number) => {
    soundEngine.playQuantumJump();
    const sIdx = typeof targetShellIdx === 'number' 
      ? targetShellIdx 
      : Math.max(0, shells.length - 1);
    
    const r = baseRadius + (sIdx + 1) * radiusStep;
    const px = 200 + r * Math.cos(Math.PI / 4);
    const py = 200 + r * Math.sin(Math.PI / 4);

    const nTarget = sIdx + 1;
    const nOrigin = Math.min(7, nTarget + 1);
    const deltaE = (13.6 * Math.abs(1 / (nTarget * nTarget) - 1 / (nOrigin * nOrigin))).toFixed(2);

    setQuantumEvent({
      active: true,
      shellIdx: sIdx,
      photonX: px,
      photonY: py,
      message: `⚡ Quantensprung n=${nOrigin} → n=${nTarget} (${SHELL_NAMES[sIdx]}-Schale)! Photon: ΔE ≈ ${deltaE} eV (h·ν)`
    });

    setTimeout(() => {
      setQuantumEvent(null);
    }, 2200);
  };

  const handleShellClick = (index: number) => {
    if (!interactive) return;
    soundEngine.playAtomOrbit();
    setSelectedShell(prev => (prev === index ? null : index));
    triggerQuantumJump(index);
  };

  const handleNucleusClick = (filter: 'all' | 'protons' | 'neutrons' = 'all') => {
    if (!interactive) return;
    soundEngine.playAtomOrbit();
    setNucleonFilter(filter);
    setShowNucleusInspector(true);
  };

  const togglePause = () => {
    soundEngine.playClick();
    setIsPaused(prev => !prev);
  };

  const cycleSpeed = () => {
    soundEngine.playClick();
    setSpeed(prev => {
      if (prev === 0.5) return 1.0;
      if (prev === 1.0) return 2.0;
      if (prev === 2.0) return 3.0;
      return 0.5;
    });
  };

  // Reset quantum event & inspected particle when element changes
  useEffect(() => {
    setSelectedShell(null);
    setQuantumEvent(null);
    setInspectedParticle(null);
  }, [element.atomicNumber]);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* 2D vs. 3D Umschalter */}
      <div className="mb-2 flex items-center justify-between w-full px-1">
        <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
          <Atom className="w-4 h-4 text-cyan-400" />
          <span>{viewDimension === '3d' ? '3D-Atommodell' : '2D Bohrsches Modell'}</span>
        </span>

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setViewDimension('3d');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              viewDimension === '3d'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Interaktives 3D-Atommodell: Frei im Raum drehbar mit räumlichen Orbitalen"
          >
            <span>🪐 3D</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setViewDimension('2d');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              viewDimension === '2d'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Klassisches 2D-Schalenmodell nach Niels Bohr"
          >
            <span>⚛️ 2D</span>
          </button>
        </div>
      </div>

      {viewDimension === '3d' ? (
        <AtomVisualizer3D
          element={element}
          size={size}
          showControls={showControls}
          interactive={interactive}
          onOpenNucleusInspector={() => setShowNucleusInspector(true)}
        />
      ) : (
        <>
          {/* SVG Canvas mit interaktivem Bohrschem Schalenmodell */}
          <div 
            className="relative flex items-center justify-center p-2 rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl overflow-hidden group"
            style={{ width: size, height: size }}
          >
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full overflow-visible"
            >
          <defs>
            {/* Kern-Farbverlauf */}
            <radialGradient id={`nucleus-grad-${element.symbol}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor={element.colorHex || '#06b6d4'} />
              <stop offset="100%" stopColor="#081022" />
            </radialGradient>

            {/* Elektronen-Glow: Blau (#3b82f6 / #1d4ed8) mit Minus-Zeichen */}
            <radialGradient id="electron-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>

            {/* Valenz-Elektronen-Glow (Kräftiges Blau mit leuchtendem Valenz-Goldrand) */}
            <radialGradient id="valence-electron-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="85%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>

            {/* Photon-Wellen-Verlauf */}
            <radialGradient id="photon-wave-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>

            {/* Filterschein für Kern & Quantensprung */}
            <filter id="core-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Subtile Hintergrund-Gitterringe */}
          <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(6, 182, 212, 0.06)" strokeWidth="1" />
          <line x1="200" y1="15" x2="200" y2="385" stroke="rgba(6, 182, 212, 0.05)" strokeDasharray="3 3" />
          <line x1="15" y1="200" x2="385" y2="200" stroke="rgba(6, 182, 212, 0.05)" strokeDasharray="3 3" />

          {/* Atomhülle: Konzentrische Schalen */}
          {shells.map((electronCount, shellIdx) => {
            const radius = baseRadius + (shellIdx + 1) * radiusStep;
            const isValence = shellIdx === shells.length - 1;
            const isSelected = selectedShell === shellIdx;
            const isQuantumTarget = quantumEvent?.shellIdx === shellIdx;

            const duration = (BASE_DURATIONS[shellIdx % BASE_DURATIONS.length] / speed).toFixed(2);
            const isEven = shellIdx % 2 === 0;
            const animName = isEven ? 'orbit-clockwise' : 'orbit-counter';

            return (
              <g 
                key={`shell-${shellIdx}`}
                onClick={() => handleShellClick(shellIdx)}
                className={interactive ? 'cursor-pointer group/shell' : ''}
              >
                {/* Orbital-Ring (Schale) mit dynamischer Hervorhebung */}
                <circle
                  cx="200"
                  cy="200"
                  r={radius}
                  fill="none"
                  stroke={
                    isQuantumTarget
                      ? '#facc15'
                      : isSelected
                      ? '#38bdf8'
                      : isValence
                      ? 'rgba(234, 179, 8, 0.5)'
                      : 'rgba(56, 189, 248, 0.22)'
                  }
                  strokeWidth={isQuantumTarget ? '3' : isSelected ? '2.5' : isValence ? '1.8' : '1.2'}
                  strokeDasharray={isSelected || isQuantumTarget ? 'none' : '4 4'}
                  className="transition-colors duration-300"
                />

                {/* Schalen-Beschriftung (K, L, M, ...) mit maximaler Kapazität 2n^2 */}
                <text
                  x="200"
                  y={200 - radius - 3}
                  textAnchor="middle"
                  fill={isQuantumTarget ? '#facc15' : isValence ? '#facc15' : '#64748b'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="transition-colors"
                >
                  {SHELL_NAMES[shellIdx]} ({electronCount}e⁻ / max {2 * Math.pow(shellIdx + 1, 2)})
                </text>

                {/* Rotierende Elektronengruppe */}
                <g 
                  style={{
                    transformOrigin: '200px 200px',
                    animation: `${animName} ${duration}s linear infinite`,
                    animationPlayState: isPaused ? 'paused' : 'running'
                  }}
                >
                  {Array.from({ length: electronCount }).map((_, eIdx) => {
                    const angle = (2 * Math.PI * eIdx) / electronCount;
                    const ex = 200 + radius * Math.cos(angle);
                    const ey = 200 + radius * Math.sin(angle);

                    return (
                      <g key={`e-${shellIdx}-${eIdx}`}>
                        {/* Elektronen-Aura: Blau mit Minus-Zeichen */}
                        <circle
                          cx={ex}
                          cy={ey}
                          r={isValence ? 5.8 : 4.8}
                          fill={isValence ? 'url(#valence-electron-glow)' : 'url(#electron-glow)'}
                          stroke={isValence ? '#facc15' : '#bfdbfe'}
                          strokeWidth={isValence ? '1.8' : '1.2'}
                          filter={isValence ? 'url(#core-glow)' : undefined}
                        />
                        {/* Negatives Vorzeichen e⁻ (Minus -) */}
                        <text
                          x={ex}
                          y={ey + 2.6}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize={isValence ? '8' : '7'}
                          fontWeight="900"
                          fontFamily="sans-serif"
                          pointerEvents="none"
                        >
                          -
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}

          {/* Quantensprung-Photonen-Welle (Lichtblitz) */}
          {quantumEvent?.active && (
            <g className="animate-ping" style={{ transformOrigin: `${quantumEvent.photonX}px ${quantumEvent.photonY}px` }}>
              <circle
                cx={quantumEvent.photonX}
                cy={quantumEvent.photonY}
                r="22"
                fill="url(#photon-wave-glow)"
              />
              <circle
                cx={quantumEvent.photonX}
                cy={quantumEvent.photonY}
                r="35"
                fill="none"
                stroke="#fde047"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
              <text
                x={quantumEvent.photonX + 10}
                y={quantumEvent.photonY - 10}
                fill="#fde047"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                h·ν ⚡
              </text>
            </g>
          )}

          {/* Atomkern (Nukleus): Interaktiv mit sichtbaren Teilchen (p⁺ rot, n⁰ cyan) und Klick für Kernschau */}
          <g 
            style={{ transformOrigin: '200px 200px' }}
            onClick={() => handleNucleusClick('all')}
            className={interactive ? 'cursor-pointer group/nucleus' : ''}
          >
            {/* Äußerer Halo mit Pulsieren bei Hover */}
            <circle
              cx="200"
              cy="200"
              r={30}
              fill={element.colorHex || '#06b6d4'}
              opacity="0.35"
              filter="url(#core-glow)"
              className="group-hover/nucleus:opacity-75 transition-opacity"
            />
            {/* Kern-Kugel */}
            <circle
              cx="200"
              cy="200"
              r={25}
              fill={`url(#nucleus-grad-${element.symbol})`}
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="1.5"
              className="group-hover/nucleus:scale-105 transition-transform"
            />

            {/* Dargestellte Kernbausteine (Protonen rot, Neutronen grün) im Mini-Cluster */}
            {miniNucleonList.map((m, mIdx) => (
              <circle
                key={`mini-p-${mIdx}`}
                cx={m.x}
                cy={m.y}
                r={m.r}
                fill={m.type === 'proton' ? '#ef4444' : '#22c55e'}
                stroke="#ffffff"
                strokeWidth="0.4"
                opacity={0.9}
              />
            ))}

            {/* Elementsymbol im Kern (halbtransparent mit Glasmorphismus) */}
            <circle
              cx="200"
              cy="200"
              r={15}
              fill="rgba(15, 23, 42, 0.7)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.8"
            />
            <text
              x="200"
              y="204"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {element.symbol}
            </text>
            <text
              x="200"
              y="214"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="7"
              fontFamily="monospace"
              fontWeight="semibold"
            >
              Z={element.atomicNumber}
            </text>
            {/* Hinweis-Pille bei Hover */}
            <rect
              x="168"
              y="227"
              width="64"
              height="11"
              rx="5.5"
              fill="rgba(15, 23, 42, 0.9)"
              stroke="rgba(244, 63, 94, 0.7)"
              strokeWidth="0.6"
              className="group-hover/nucleus:opacity-100 opacity-80 transition-opacity"
            />
            <text
              x="200"
              y="235"
              textAnchor="middle"
              fill="#fda4af"
              fontSize="6.5"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              🔍 Kernschau
            </text>
          </g>
        </svg>

        {/* Quantensprung-Benachrichtigungs-Badge */}
        {quantumEvent && (
          <div className="absolute top-3 left-3 right-3 p-2 rounded-xl bg-amber-950/90 border border-amber-400 text-amber-200 text-center text-xs font-semibold backdrop-blur-md shadow-xl animate-in fade-in flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>{quantumEvent.message}</span>
          </div>
        )}

        {/* Ausgewählte Schalen-Info */}
        {!quantumEvent && selectedShell !== null && (
          <div className="absolute top-3 left-3 right-3 p-2.5 bg-slate-900/95 border border-cyan-500/60 rounded-xl text-center backdrop-blur-md shadow-xl animate-fade-in">
            <div className="font-mono font-bold text-xs text-cyan-300">
              {SHELL_NAMES[selectedShell]}-Schale (Hauptquantenzahl n={selectedShell + 1}):
            </div>
            <div className="text-xs text-slate-200 mt-0.5">
              Besetzt: <span className="text-cyan-300 font-bold">{shells[selectedShell]} e⁻</span> (Theorie-Limit: {2 * Math.pow(selectedShell + 1, 2)} e⁻)
              {selectedShell === shells.length - 1 ? ' • Valenzschale (Reaktivität!)' : ''}
            </div>
            <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
              {SUBSHELL_DESCRIPTIONS[selectedShell] || 'Orbitale'}
            </div>
          </div>
        )}

        {/* Interaktive Kernschau (Nukleus-Inspektor für Protonen & Neutronen) */}
        {showNucleusInspector && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md p-3 flex flex-col justify-between border border-rose-500/50 shadow-2xl animate-fade-in text-white overflow-hidden rounded-2xl">
            {/* Header: Titel, Massenzahl A & Schließen-Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 font-bold text-xs">
                  ⚛️
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight flex items-center gap-1">
                    <span>Atomkern: {element.name} ({element.symbol})</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 font-mono font-bold border border-rose-800/80">
                      A = {element.protons + element.neutrons}
                    </span>
                  </h4>
                  <span className="text-[9px] text-slate-400 block font-mono">
                    <span className="text-red-400 font-bold">{element.protons} p⁺ (rot)</span> • <span className="text-emerald-400 font-bold">{element.neutrons} n⁰ (grün)</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNucleusInspector(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Kernschau schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter-Tabs: Alle, Nur Protonen (Rot), Nur Neutronen (Grün) */}
            <div className="flex items-center gap-1 py-1 border-b border-slate-800/60 justify-center shrink-0">
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setNucleonFilter('all'); }}
                className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                  nucleonFilter === 'all'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Alle ({element.protons + element.neutrons})
              </button>
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setNucleonFilter('protons'); }}
                className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  nucleonFilter === 'protons'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-red-900/50 text-red-300 hover:bg-red-950/40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                <span>{element.protons} Protonen (p⁺)</span>
              </button>
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setNucleonFilter('neutrons'); }}
                className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  nucleonFilter === 'neutrons'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-emerald-900/50 text-emerald-300 hover:bg-emerald-950/40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>{element.neutrons} Neutronen (n⁰)</span>
              </button>
            </div>

            {/* Vergrößerter Nukleonen-Cluster (SVG) */}
            <div className="relative flex-1 my-1 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center overflow-hidden p-1">
              <svg viewBox="0 0 260 170" className="w-full h-full max-h-[160px]">
                <defs>
                  {/* Proton Radial-Gradient (Rot & Plus) */}
                  <radialGradient id="proton-zoom-grad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fee2e2" />
                    <stop offset="35%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </radialGradient>
                  {/* Neutron Radial-Gradient (Grün & Neutral) */}
                  <radialGradient id="neutron-zoom-grad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#dcfce7" />
                    <stop offset="35%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#14532d" />
                  </radialGradient>
                </defs>

                {/* Gluonen-Kernhalo (Starke Wechselwirkung) */}
                <circle cx="130" cy="85" r="70" fill="rgba(239, 68, 68, 0.06)" filter="url(#core-glow)" />

                {/* Nukleonen zeichnen: Protonen rot mit +, Neutronen grün mit 0 */}
                {nucleonList.map((p, idx) => {
                  const isFilteredOut = 
                    (nucleonFilter === 'protons' && p.type !== 'proton') ||
                    (nucleonFilter === 'neutrons' && p.type !== 'neutron');
                  const isSelected = inspectedParticle?.index === idx;

                  return (
                    <g
                      key={`nucleon-zoom-${idx}`}
                      onClick={() => {
                        soundEngine.playAtomOrbit();
                        setInspectedParticle({ type: p.type, index: idx });
                      }}
                      className="cursor-pointer transition-opacity duration-200"
                      style={{ opacity: isFilteredOut ? 0.15 : 1.0 }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={p.r}
                        fill={p.type === 'proton' ? 'url(#proton-zoom-grad)' : 'url(#neutron-zoom-grad)'}
                        stroke={isSelected ? '#facc15' : '#ffffff'}
                        strokeWidth={isSelected ? 1.8 : 0.8}
                      />
                      {p.r >= 4.2 && (
                        <text
                          x={p.x}
                          y={p.y + p.r * 0.35}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize={Math.max(5.5, p.r * 0.9)}
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          pointerEvents="none"
                        >
                          {p.type === 'proton' ? '+' : '0'}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Wenn Wasserstoff 0 Neutronen hat */}
              {element.neutrons === 0 && nucleonFilter === 'neutrons' && (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-slate-950/80 text-xs text-emerald-200">
                  <span>Wasserstoff (¹H) besitzt keine Neutronen im Kern!</span>
                </div>
              )}
            </div>

            {/* Ausgewähltes Teilchen oder Quark- & Kernkraft-Erklärung */}
            <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono flex items-center justify-between shrink-0">
              {inspectedParticle ? (
                inspectedParticle.type === 'proton' ? (
                  <span className="text-red-400 font-bold">
                    🔴 Proton #{inspectedParticle.index + 1}: Ladung +1e (positiv, rot) • Quarks: Up, Up, Down (uud)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">
                    🟢 Neutron #{inspectedParticle.index + 1}: Ladung 0 (neutral, grün) • Quarks: Up, Down, Down (udd)
                  </span>
                )
              ) : (
                <span className="text-slate-400">
                  Tippe ein Teilchen an • <span className="text-red-400">Protonen (+) rot</span> • <span className="text-emerald-400">Neutronen (0) grün</span>
                </span>
              )}
              <span className="text-[9px] text-amber-300 font-bold shrink-0 ml-1">
                {element.atomicNumber > 82 ? '⚠️ Radioaktiv' : '🟢 Stabil'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Exakte IUPAC-Elektronenkonfiguration */}
      <div className="w-full mt-3 p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between text-xs font-mono shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px]">IUPAC-Konfiguration:</span>
        </div>
        <span className="font-bold text-cyan-200 tracking-wide text-xs">{electronConfig}</span>
      </div>

      {/* Steuerung & Physikalische Parameter */}
      {showControls && (
        <div className="w-full mt-3 space-y-3">
          {/* Interaktive Aktionsleiste: Quantensprung, Kernschau & Speed */}
          <div className="flex items-center justify-between gap-1.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex-wrap">
            <div className="flex items-center gap-1.5">
              {/* Quantensprung-Button */}
              <button
                type="button"
                onClick={() => triggerQuantumJump()}
                className="py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Ein Elektron anregen und einen Quantensprung auslösen"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Quantensprung!</span>
              </button>

              {/* Kernschau Button */}
              <button
                type="button"
                onClick={() => handleNucleusClick('all')}
                className="py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-red-500/20 hover:from-rose-500/30 hover:to-red-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Atomkern anklicken: Protonen & Neutronen im Detail anzeigen"
              >
                <Search className="w-3.5 h-3.5 text-rose-400" />
                <span>Kernschau</span>
              </button>
            </div>

            {/* Geschwindigkeits-Regler */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={cycleSpeed}
                className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Orbit-Geschwindigkeit umschalten"
              >
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>{speed.toFixed(1)}x</span>
              </button>

              {/* Pause / Play */}
              <button
                type="button"
                onClick={togglePause}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                title={isPaused ? 'Animation fortsetzen' : 'Animation anhalten'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Schalen-Klickleiste */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {shells.map((count, idx) => {
              const isValence = idx === shells.length - 1;
              const isSelected = selectedShell === idx;
              return (
                <button
                  key={SHELL_NAMES[idx]}
                  type="button"
                  onClick={() => handleShellClick(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300'
                      : isValence
                      ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title={`${SHELL_NAMES[idx]}-Schale mit ${count} Elektronen inspizieren`}
                >
                  <span>{SHELL_NAMES[idx]}:</span>
                  <span className="font-bold">{count}</span>
                  {isValence && <Sparkles className="w-2.5 h-2.5 text-amber-400" />}
                </button>
              );
            })}
          </div>

          {/* Kernbausteine & Valenzstatus (Klickbar für Kernschau-Filter) */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <button
              type="button"
              onClick={() => handleNucleusClick('protons')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 transition-all text-center cursor-pointer group/prot"
              title="Klick: Nur Protonen im Atomkern anzeigen"
            >
              <span className="text-[10px] text-slate-400 group-hover/prot:text-rose-300 block font-mono">Protonen (p⁺) 🔍</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{element.protons}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNucleusClick('neutrons')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-sky-950/40 border border-slate-800 hover:border-sky-500/50 transition-all text-center cursor-pointer group/neut"
              title="Klick: Nur Neutronen im Atomkern anzeigen"
            >
              <span className="text-[10px] text-slate-400 group-hover/neut:text-sky-300 block font-mono">Neutronen (n⁰) 🔍</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{element.neutrons}</span>
            </button>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-amber-900/40">
              <span className="text-[10px] text-amber-400/80 block font-mono">Valenzelektronen</span>
              <span className="font-mono font-bold text-amber-300 text-sm">{valenceElectrons}</span>
            </div>
          </div>

          {/* Zusammenfassung */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gesamt: {totalElectrons} e⁻ auf {shells.length} Hauptschalen</span>
            </div>
            <span className="text-[10px] text-slate-500">
              Bohr-Modell
            </span>
          </div>

          {/* Hinweis zur Modell-Darstellung */}
          <p className="mt-1 text-[11px] text-slate-400 italic font-mono text-center">
            Atom sieht vielleicht nicht echt aus (didaktisches Modell)
          </p>
        </div>
      )}
        </>
      )}

      {/* Interaktive Kernschau (Nukleus-Inspektor für Protonen & Neutronen) - Wenn aus 3D-Modus geöffnet */}
      {viewDimension === '3d' && showNucleusInspector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-[440px] max-h-[92vh] bg-slate-950 p-4 flex flex-col justify-between border-2 border-rose-500/50 shadow-2xl rounded-3xl overflow-hidden relative">
            {/* Header: Titel, Massenzahl A & Schließen-Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 font-bold text-sm">
                  ⚛️
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                    <span>Atomkern: {element.name} ({element.symbol})</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-mono font-bold border border-rose-800">
                      A = {element.protons + element.neutrons}
                    </span>
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    <span className="text-red-400 font-bold">{element.protons} p⁺ (rot)</span> • <span className="text-emerald-400 font-bold">{element.neutrons} n⁰ (grün)</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNucleusInspector(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Kernschau schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter-Tabs: Alle, Nur Protonen (Rot), Nur Neutronen (Grün) */}
            <div className="flex items-center gap-1.5 py-2 border-b border-slate-800/60 justify-center shrink-0 text-xs">
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setNucleonFilter('all'); }}
                className={`px-3 py-1 rounded-xl font-mono font-bold transition-all cursor-pointer ${
                  nucleonFilter === 'all'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Alle ({element.protons + element.neutrons})
              </button>
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setNucleonFilter('protons'); }}
                className={`px-3 py-1 rounded-xl font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  nucleonFilter === 'protons'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-red-900/50 text-red-300 hover:bg-red-950/40'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                <span>{element.protons} p⁺</span>
              </button>
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setNucleonFilter('neutrons'); }}
                className={`px-3 py-1 rounded-xl font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  nucleonFilter === 'neutrons'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-emerald-900/50 text-emerald-300 hover:bg-emerald-950/40'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>{element.neutrons} n⁰</span>
              </button>
            </div>

            {/* Vergrößerter Nukleonen-Cluster (SVG) */}
            <div className="relative flex-1 my-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center overflow-hidden p-2 min-h-[220px]">
              <svg viewBox="0 0 260 200" className="w-full h-full max-h-[220px]">
                <defs>
                  <radialGradient id="proton-zoom-grad-modal" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fee2e2" />
                    <stop offset="35%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </radialGradient>
                  <radialGradient id="neutron-zoom-grad-modal" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#dcfce7" />
                    <stop offset="35%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#14532d" />
                  </radialGradient>
                </defs>

                <circle cx="130" cy="100" r="85" fill="rgba(239, 68, 68, 0.06)" filter="url(#core-glow)" />

                {nucleonList.map((p, idx) => {
                  const isFilteredOut = 
                    (nucleonFilter === 'protons' && p.type !== 'proton') ||
                    (nucleonFilter === 'neutrons' && p.type !== 'neutron');
                  const isSelected = inspectedParticle?.index === idx;

                  return (
                    <g
                      key={`nucleon-modal-${idx}`}
                      onClick={() => {
                        soundEngine.playAtomOrbit();
                        setInspectedParticle({ type: p.type, index: idx });
                      }}
                      className="cursor-pointer transition-opacity duration-200"
                      style={{ opacity: isFilteredOut ? 0.15 : 1.0 }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y + 15}
                        r={p.r}
                        fill={p.type === 'proton' ? 'url(#proton-zoom-grad-modal)' : 'url(#neutron-zoom-grad-modal)'}
                        stroke={isSelected ? '#facc15' : '#ffffff'}
                        strokeWidth={isSelected ? 2.0 : 0.8}
                      />
                      {p.r >= 4.2 && (
                        <text
                          x={p.x}
                          y={p.y + 15 + p.r * 0.35}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize={Math.max(5.5, p.r * 0.9)}
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          pointerEvents="none"
                        >
                          {p.type === 'proton' ? '+' : '0'}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {element.neutrons === 0 && nucleonFilter === 'neutrons' && (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-slate-950/80 text-xs text-emerald-200">
                  <span>Wasserstoff (¹H) besitzt keine Neutronen im Kern!</span>
                </div>
              )}
            </div>

            {/* Ausgewähltes Teilchen oder Quark-Erklärung */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono flex items-center justify-between shrink-0">
              {inspectedParticle ? (
                inspectedParticle.type === 'proton' ? (
                  <span className="text-red-400 font-bold">
                    🔴 Proton #{inspectedParticle.index + 1}: Ladung +1e (rot) • Quarks: Up, Up, Down (uud)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">
                    🟢 Neutron #{inspectedParticle.index + 1}: Ladung 0 (grün) • Quarks: Up, Down, Down (udd)
                  </span>
                )
              ) : (
                <span className="text-slate-400 text-[11px]">
                  Tippe ein Teilchen an • <span className="text-red-400 font-bold">Proton (+) rot</span> • <span className="text-emerald-400 font-bold">Neutron (0) grün</span>
                </span>
              )}
              <span className="text-[10px] text-amber-300 font-bold shrink-0 ml-1">
                {element.atomicNumber > 82 ? '⚠️ Radioaktiv' : '🟢 Stabil'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
