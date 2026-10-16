import React, { useState } from 'react';
import { ChemicalElement } from '../../types/chemistry';
import { getElectronShells } from '../../data/elements';
import { soundEngine } from '../../engine/audio';
import { Play, Pause, Info, Sparkles } from 'lucide-react';

interface AtomVisualizerProps {
  element: ChemicalElement;
  size?: number;
  showControls?: boolean;
  interactive?: boolean;
  className?: string;
}

const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export const AtomVisualizer: React.FC<AtomVisualizerProps> = ({
  element,
  size = 360,
  showControls = true,
  interactive = true,
  className = ''
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedShell, setSelectedShell] = useState<number | null>(null);

  const shells = getElectronShells(element.atomicNumber);
  const totalElectrons = shells.reduce((sum, count) => sum + count, 0);
  const valenceElectrons = shells[shells.length - 1];

  // Shell-Radien im 400x400 Koordinatenraum (Zentrum 200, 200)
  const baseRadius = 40;
  const radiusStep = Math.min(24, Math.floor(140 / Math.max(shells.length, 1)));

  const handleShellClick = (index: number) => {
    if (!interactive) return;
    soundEngine.playAtomOrbit();
    setSelectedShell(prev => (prev === index ? null : index));
  };

  const togglePause = () => {
    soundEngine.playClick();
    setIsPaused(prev => !prev);
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* SVG Canvas */}
      <div 
        className="relative flex items-center justify-center p-2 rounded-2xl bg-slate-950/90 border border-cyan-500/30 shadow-inner"
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
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            {/* Elektronen-Glow */}
            <radialGradient id="electron-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="70%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#083344" />
            </radialGradient>

            {/* Valenz-Elektronen-Glow (Golden / Orange) */}
            <radialGradient id="valence-electron-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#713f12" />
            </radialGradient>

            {/* Subtiler Filterschein für Kern */}
            <filter id="core-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Atomhülle: Konzentrische Schalen */}
          {shells.map((electronCount, shellIdx) => {
            const radius = baseRadius + (shellIdx + 1) * radiusStep;
            const isValence = shellIdx === shells.length - 1;
            const isSelected = selectedShell === shellIdx;
            const animationClass = !isPaused ? `animate-orbit-${(shellIdx % 7) + 1}` : '';

            return (
              <g 
                key={`shell-${shellIdx}`}
                onClick={() => handleShellClick(shellIdx)}
                className={interactive ? 'cursor-pointer' : ''}
              >
                {/* Orbital-Ring */}
                <circle
                  cx="200"
                  cy="200"
                  r={radius}
                  fill="none"
                  stroke={isSelected ? '#38bdf8' : isValence ? 'rgba(234, 179, 8, 0.45)' : 'rgba(56, 189, 248, 0.22)'}
                  strokeWidth={isSelected ? '2.5' : isValence ? '1.8' : '1.2'}
                  strokeDasharray={isSelected ? 'none' : '4 4'}
                  className="transition-colors duration-300"
                />

                {/* Schalen-Beschriftung (K, L, M, ...) */}
                <text
                  x="200"
                  y={200 - radius - 3}
                  textAnchor="middle"
                  fill={isValence ? '#facc15' : '#64748b'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {SHELL_NAMES[shellIdx]} ({electronCount}e⁻)
                </text>

                {/* Rotierende Elektronengruppe */}
                <g className={animationClass}>
                  {Array.from({ length: electronCount }).map((_, eIdx) => {
                    const angle = (2 * Math.PI * eIdx) / electronCount;
                    const ex = 200 + radius * Math.cos(angle);
                    const ey = 200 + radius * Math.sin(angle);

                    return (
                      <g key={`e-${shellIdx}-${eIdx}`}>
                        {/* Elektronen-Aura */}
                        <circle
                          cx={ex}
                          cy={ey}
                          r={isValence ? 5.5 : 4.5}
                          fill={isValence ? 'url(#valence-electron-glow)' : 'url(#electron-glow)'}
                          stroke="#ffffff"
                          strokeWidth="0.8"
                        />
                        {/* Negatives Vorzeichen e- */}
                        <text
                          x={ex}
                          y={ey + 2.5}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="6"
                          fontWeight="bold"
                          fontFamily="sans-serif"
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

          {/* Atomkern (Nukleus) */}
          <g className="animate-pulse-slow">
            {/* Äußerer Halo */}
            <circle
              cx="200"
              cy="200"
              r={28}
              fill={element.colorHex || '#06b6d4'}
              opacity="0.25"
              filter="url(#core-glow)"
            />
            {/* Kern-Kugel */}
            <circle
              cx="200"
              cy="200"
              r={24}
              fill={`url(#nucleus-grad-${element.symbol})`}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
            />
            {/* Elementsymbol im Kern */}
            <text
              x="200"
              y="204"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="16"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {element.symbol}
            </text>
            <text
              x="200"
              y="217"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="8"
              fontFamily="monospace"
            >
              Z={element.atomicNumber}
            </text>
          </g>
        </svg>

        {/* Hover/Klick Detail-Info-Pille */}
        {selectedShell !== null && (
          <div className="absolute top-3 left-3 right-3 p-2 bg-slate-900/95 border border-cyan-500/60 rounded-xl text-center backdrop-blur-md shadow-lg animate-in fade-in">
            <span className="font-mono font-bold text-xs text-cyan-300">
              {SHELL_NAMES[selectedShell]}-Schale (Hauptquantenzahl n={selectedShell + 1}):
            </span>
            <span className="text-xs text-slate-200 ml-1.5">
              {shells[selectedShell]} Elektronen {selectedShell === shells.length - 1 ? '(Valenzschale!)' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Didaktische Schalen-Übersicht & Steuerung */}
      {showControls && (
        <div className="w-full mt-4 space-y-3">
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
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : isValence
                      ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title={`${SHELL_NAMES[idx]}-Schale mit ${count} Elektronen`}
                >
                  <span>{SHELL_NAMES[idx]}:</span>
                  <span className="font-bold">{count}</span>
                  {isValence && <Sparkles className="w-2.5 h-2.5 text-amber-400" />}
                </button>
              );
            })}
          </div>

          {/* Kernbausteine & Valenzstatus */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Protonen (p⁺)</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{element.protons}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Neutronen (n⁰)</span>
              <span className="font-mono font-bold text-slate-300 text-sm">{element.neutrons}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-amber-900/40">
              <span className="text-[10px] text-amber-400/80 block font-mono">Valenzelektronen</span>
              <span className="font-mono font-bold text-amber-300 text-sm">{valenceElectrons}</span>
            </div>
          </div>

          {/* Steuerungsknopf: Animation pausieren / fortsetzen */}
          <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gesamt: {totalElectrons} e⁻ in {shells.length} Schalen</span>
            </div>

            <button
              type="button"
              onClick={togglePause}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              title={isPaused ? 'Orbit-Animation starten' : 'Orbit-Animation anhalten'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span className="text-[10px]">{isPaused ? 'Start' : 'Pause'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
