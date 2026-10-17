import { useState, useEffect, useMemo, useRef } from 'react';
import { ChemicalElement } from '../../types/chemistry';
import { getElectronConfiguration } from '../../data/elements';
import { soundEngine } from '../../engine/audio';
import { 
  ZoomIn, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Sparkles, 
  ArrowLeft
} from 'lucide-react';
import { AtomVisualizer3D } from './AtomVisualizer3D';

interface MicrocosmZoomVisualizerProps {
  element: ChemicalElement;
  onClose?: () => void;
  className?: string;
}

export type ZoomStage = 1 | 2 | 3 | 4;

const STAGE_CONFIG: Record<ZoomStage, {
  title: string;
  subtitle: string;
  scaleLabel: string;
  orderOfMagnitude: string;
  icon: string;
}> = {
  1: {
    title: 'Makroschau: Das Periodensystem',
    subtitle: 'Chemische Identität & Makroskopische Welt',
    scaleLabel: '1 Meter bis 1 Dezimeter',
    orderOfMagnitude: '10⁰ m',
    icon: '🗺️'
  },
  2: {
    title: 'Atomschau: Die Elektronenhülle',
    subtitle: 'Quanten-Orbitale & Elektronen-Wolke',
    scaleLabel: '0,1 Nanometer (1 Ångström)',
    orderOfMagnitude: '10⁻¹⁰ m',
    icon: '⚛️'
  },
  3: {
    title: 'Nukleus-Schau: Der Atomkern',
    subtitle: 'Protonen & Neutronen unter der Starken Kernkraft',
    scaleLabel: '1 bis 10 Femtometer',
    orderOfMagnitude: '10⁻¹⁵ m',
    icon: '🔴'
  },
  4: {
    title: 'Subatomare Schau: Quarks & Gluonen',
    subtitle: 'Elementare Bausteine der Materie (QCD)',
    scaleLabel: 'Unter 1 Attometer',
    orderOfMagnitude: '10⁻¹⁸ m',
    icon: '⚡'
  }
};

export const MicrocosmZoomVisualizer: React.FC<MicrocosmZoomVisualizerProps> = ({
  element,
  onClose,
  className = ''
}) => {
  const [currentStage, setCurrentStage] = useState<ZoomStage>(1);
  const [isAutoFlying, setIsAutoFlying] = useState(false);
  const [selectedNucleonType, setSelectedNucleonType] = useState<'proton' | 'neutron'>('proton');
  const [activeNucleonFilter, setActiveNucleonFilter] = useState<'all' | 'protons' | 'neutrons'>('all');
  const [inspectedQuark, setInspectedQuark] = useState<string | null>(null);

  const electronConfig = useMemo(() => element.electronConfiguration || getElectronConfiguration(element.atomicNumber), [element]);
  const totalNucleons = element.protons + element.neutrons;

  const autoFlyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-Flight Zyklus: Sanfter Flug von Stufe 1 bis 4
  useEffect(() => {
    if (isAutoFlying) {
      autoFlyTimerRef.current = setTimeout(() => {
        setCurrentStage(prev => {
          if (prev < 4) {
            soundEngine.playAtomOrbit();
            return (prev + 1) as ZoomStage;
          } else {
            setIsAutoFlying(false);
            soundEngine.playSuccess();
            return 4;
          }
        });
      }, 3200);
    }
    return () => {
      if (autoFlyTimerRef.current) clearTimeout(autoFlyTimerRef.current);
    };
  }, [isAutoFlying, currentStage]);

  const setStage = (stage: ZoomStage) => {
    soundEngine.playClick();
    soundEngine.playAtomOrbit();
    setIsAutoFlying(false);
    setCurrentStage(stage);
  };

  const nextStage = () => {
    if (currentStage < 4) setStage((currentStage + 1) as ZoomStage);
  };

  const prevStage = () => {
    if (currentStage > 1) setStage((currentStage - 1) as ZoomStage);
  };

  const toggleAutoFly = () => {
    soundEngine.playClick();
    if (isAutoFlying) {
      setIsAutoFlying(false);
    } else {
      if (currentStage === 4) setCurrentStage(1);
      setIsAutoFlying(true);
      soundEngine.playAtomOrbit();
    }
  };

  // Rechnerische Nukleonen-Koordinaten für die Kernschau (Stufe 3)
  const nucleonCluster = useMemo(() => {
    const list: Array<{ id: number; type: 'proton' | 'neutron'; x: number; y: number; r: number }> = [];
    let p = element.protons;
    let n = element.neutrons;
    const total = p + n;

    const baseR = total <= 4 ? 22 : total <= 16 ? 16 : total <= 40 ? 11 : total <= 80 ? 8 : Math.max(4.5, 60 / Math.sqrt(total));
    const c = baseR * 1.8;
    const rawMaxRadius = total > 1 ? c * Math.sqrt(total - 1) : 0;
    const allowedMax = 120;
    const scale = rawMaxRadius > allowedMax ? (allowedMax / rawMaxRadius) : 1;
    const actualR = Math.max(3.8, baseR * scale);

    const cx = 200;
    const cy = 200;

    for (let i = 0; i < total; i++) {
      const isProton = (p / (p + n)) > (n > 0 ? (i % 2 === 0 ? 0.48 : 0.52) : 0);
      const type: 'proton' | 'neutron' = ((isProton && p > 0) || n === 0) ? 'proton' : 'neutron';
      if (type === 'proton') p--; else n--;

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

  return (
    <div className={`flex flex-col h-full bg-slate-950 text-white rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl ${className}`}>
      
      {/* Kopfzeile mit Stufen-Navigator & Maßstabsanzeige */}
      <div className="p-3 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold"
              title="Zurück zur Tabelle"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Zurück</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{STAGE_CONFIG[currentStage].icon}</span>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>{STAGE_CONFIG[currentStage].title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                  {element.name} ({element.symbol}, Z={element.atomicNumber})
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {STAGE_CONFIG[currentStage].subtitle} • Größenordnung: <span className="font-mono text-cyan-300 font-bold">{STAGE_CONFIG[currentStage].orderOfMagnitude}</span> ({STAGE_CONFIG[currentStage].scaleLabel})
            </p>
          </div>
        </div>

        {/* Zoom-Steuerung: Stufen 1-4, Vor/Zurück & Auto-Flug */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Stufen-Tabs */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs font-mono">
            {([1, 2, 3, 4] as ZoomStage[]).map(stage => {
              const isActive = currentStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  data-zoom-stage={stage}
                  onClick={() => setStage(stage)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={STAGE_CONFIG[stage].title}
                >
                  <span>{stage}</span>
                  <span className="hidden md:inline text-[10px] font-normal">
                    {' '}{stage === 1 ? 'PSE' : stage === 2 ? 'Hülle' : stage === 3 ? 'Kern' : 'Quarks'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Vor / Zurück Buttons */}
          <button
            type="button"
            onClick={prevStage}
            disabled={currentStage === 1}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Rauszoomen"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextStage}
            disabled={currentStage === 4}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Reinzoomen"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Automatischer Zoom-Kameraflug Button */}
          <button
            type="button"
            onClick={toggleAutoFly}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
              isAutoFlying
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-gradient-to-r from-rose-600 to-amber-600 text-white hover:brightness-110'
            }`}
            title="Automatischen Kameraflug durch alle 4 Zoomstufen starten"
          >
            {isAutoFlying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAutoFlying ? 'Flug anhalten' : 'Auto-Zoomflug'}</span>
          </button>
        </div>
      </div>

      {/* Hauptbühne: Zoom-Darstellung der gewählten Stufe */}
      <div className="relative flex-1 min-h-[380px] p-4 sm:p-6 flex items-center justify-center overflow-hidden bg-radial from-slate-900 via-slate-950 to-slate-950">
        
        {/* ========================================================
            STUFE 1: PERIODENSYSTEM-MAKROSCHAU (10⁰ m)
            ======================================================== */}
        {currentStage === 1 && (
          <div className="flex flex-col items-center justify-center max-w-lg text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="relative p-8 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 group hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setStage(2)}
              title="Klicke hier, um in die Elektronenhülle zu zoomen"
            >
              <div className="absolute top-3 left-4 font-mono font-bold text-xs text-cyan-400">
                Z = {element.atomicNumber}
              </div>
              <div className="absolute top-3 right-4 font-mono text-xs text-slate-400">
                {element.atomicMass} u
              </div>

              <div 
                className="font-mono text-6xl sm:text-7xl font-bold tracking-tight my-2 drop-shadow-lg"
                style={{ color: element.colorHex || '#38bdf8' }}
              >
                {element.symbol}
              </div>

              <h2 className="text-2xl font-bold text-white mt-1">
                {element.name}
              </h2>
              {element.latinName && (
                <p className="text-xs text-slate-400 italic font-mono mb-2">
                  {element.latinName}
                </p>
              )}

              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Periode {element.period} • Gruppe {element.group}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {element.stateAtRoomTemp === 'gas' ? 'Gasförmig' : element.stateAtRoomTemp === 'liquid' ? 'Flüssig' : 'Feststoff'}
                </span>
              </div>

              <div className="mt-4 py-1.5 px-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold flex items-center justify-center gap-1.5 group-hover:bg-cyan-500/30">
                <ZoomIn className="w-4 h-4 text-cyan-300 animate-bounce" />
                <span>Klick: In die Atomhülle zoomen (10 Milliarden x)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Im Periodensystem ordnet sich <strong className="text-white">{element.name}</strong> nach seiner Kernladungszahl $Z={element.atomicNumber}$. Tauche jetzt tiefer ein, um die Quantenhülle und den Atomkern zu erforschen!
            </p>
          </div>
        )}

        {/* ========================================================
            STUFE 2: ELEKTRONENHÜLLE & 3D ATOM (10⁻¹⁰ m = 0,1 nm)
            ======================================================== */}
        {currentStage === 2 && (
          <div className="relative flex flex-col items-center justify-center w-full max-w-xl animate-in fade-in zoom-in duration-500">
            <AtomVisualizer3D
              element={element}
              size={340}
              showControls={true}
              interactive={true}
              onOpenNucleusInspector={() => setStage(3)}
            />

            {/* Infobanner & Weiter-Button */}
            <div className="mt-2 text-center space-y-2">
              <div className="py-1 px-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono inline-block">
                <span>Konfiguration: </span>
                <span className="font-bold text-cyan-300">{electronConfig}</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                99,999999999 % des Atoms sind leerer Raum! Der Atomkern im Zentrum ist 100.000-mal kleiner als die Hülle.
              </p>
              <button
                type="button"
                onClick={() => setStage(3)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-1.5 mx-auto transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-rose-900/40"
              >
                <ZoomIn className="w-4 h-4" />
                <span>Tiefer in den Atomkern zoomen (100.000x) ➔</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STUFE 3: NUKLEUS-SCHAU (ATOMKERN 10⁻¹⁵ m = 1 fm)
            ======================================================== */}
        {currentStage === 3 && (
          <div className="flex flex-col items-center justify-center w-full max-w-xl animate-in fade-in zoom-in duration-500">
            {/* Filter-Buttons für Übersichtlichkeit: Protonen rot (+), Neutronen grün (0) */}
            <div className="flex items-center gap-1.5 mb-2 justify-center flex-wrap">
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setActiveNucleonFilter('all'); }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeNucleonFilter === 'all'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Alle Nukleonen ({totalNucleons})
              </button>
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setActiveNucleonFilter('protons'); }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeNucleonFilter === 'protons'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-900 border border-red-900/50 text-red-300 hover:bg-red-950/40'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>{element.protons} Protonen (p⁺, rot)</span>
              </button>
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setActiveNucleonFilter('neutrons'); }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeNucleonFilter === 'neutrons'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 border border-emerald-900/50 text-emerald-300 hover:bg-emerald-950/40'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span>{element.neutrons} Neutronen (n⁰, grün)</span>
              </button>
            </div>

            {/* Große SVG-Kernansicht mit Nukleonen-Cluster */}
            <svg viewBox="0 0 400 400" className="w-full max-w-[360px] h-auto select-none overflow-visible">
              <defs>
                {/* Proton Radial-Gradient: Rot & Plus */}
                <radialGradient id="stage3-proton-grad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fee2e2" />
                  <stop offset="35%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </radialGradient>
                {/* Neutron Radial-Gradient: Grün & Neutral */}
                <radialGradient id="stage3-neutron-grad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#dcfce7" />
                  <stop offset="35%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#14532d" />
                </radialGradient>
              </defs>

              {/* Pulsierendes Gluonen-Kraftfeld (Starke Kernkraft) */}
              <circle cx="200" cy="200" r={140} fill="rgba(239, 68, 68, 0.08)" filter="url(#core-glow)" />
              <circle cx="200" cy="200" r={120} fill="none" stroke="rgba(250, 204, 21, 0.25)" strokeWidth="1.5" strokeDasharray="6 4" className="animate-spin" style={{ animationDuration: '40s' }} />

              {/* Dargestellte Nukleonen im dichten Kernverband: Protonen rot mit +, Neutronen grün mit 0 */}
              {nucleonCluster.map(p => {
                const isFilteredOut = 
                  (activeNucleonFilter === 'protons' && p.type !== 'proton') ||
                  (activeNucleonFilter === 'neutrons' && p.type !== 'neutron');

                return (
                  <g 
                    key={`stage3-p-${p.id}`}
                    onClick={() => {
                      soundEngine.playAtomOrbit();
                      setSelectedNucleonType(p.type);
                      setStage(4);
                    }}
                    className="cursor-pointer group/particle transition-opacity duration-300"
                    style={{ opacity: isFilteredOut ? 0.15 : 1.0 }}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={p.r}
                      fill={p.type === 'proton' ? 'url(#stage3-proton-grad)' : 'url(#stage3-neutron-grad)'}
                      stroke="#ffffff"
                      strokeWidth={p.r > 10 ? '1.5' : '0.8'}
                      className="group-hover/particle:scale-125 transition-transform"
                    />
                    {p.r >= 6.5 && (
                      <text
                        x={p.x}
                        y={p.y + p.r * 0.35}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={Math.max(6.5, p.r * 0.9)}
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

            {/* Kennzahlen & Sprung in Quarks */}
            <div className="mt-3 text-center space-y-2">
              <div className="flex items-center justify-center gap-3 text-xs font-mono flex-wrap">
                <span className="text-red-400 font-bold">🔴 Protonen: {element.protons} p⁺ (+{element.protons}e, rot)</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">🟢 Neutronen: {element.neutrons} n⁰ (0e, grün)</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">A = {totalNucleons} Nukleonen</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Tippe ein Proton (<span className="text-red-400">rot mit +</span>) oder Neutron (<span className="text-emerald-400">grün mit 0</span>) an, um in das Innere eines Teilchens zu zoomen!
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => { setSelectedNucleonType('proton'); setStage(4); }}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>🔴 Proton öffnen (Quarks uud, rot) ➔</span>
                </button>
                {element.neutrons > 0 && (
                  <button
                    type="button"
                    onClick={() => { setSelectedNucleonType('neutron'); setStage(4); }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>🟢 Neutron öffnen (Quarks udd, grün) ➔</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STUFE 4: SUBATOMARE SCHAU (QUARKS & GLUONEN 10⁻¹⁸ m)
            ======================================================== */}
        {currentStage === 4 && (
          <div className="flex flex-col items-center justify-center w-full max-w-xl text-center animate-in fade-in zoom-in duration-500">
            {/* Umschalter: Proton (Rot) vs. Neutron (Grün) */}
            <div className="flex items-center gap-2 mb-3 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setSelectedNucleonType('proton'); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedNucleonType === 'proton'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🔴 Proton (p⁺, rot)</span>
                <span className="text-[10px] opacity-90">Quarks: u u d (+1e)</span>
              </button>
              <button
                type="button"
                onClick={() => { soundEngine.playClick(); setSelectedNucleonType('neutron'); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedNucleonType === 'neutron'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🟢 Neutron (n⁰, grün)</span>
                <span className="text-[10px] opacity-90">Quarks: u d d (0e)</span>
              </button>
            </div>

            {/* SVG Visualisierung des Nukleons mit 3 Quarks & Gluonen-Feld */}
            <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
              <svg viewBox="0 0 320 320" className="w-full h-full select-none overflow-visible">
                <defs>
                  {/* Gluonen-Farbfeld */}
                  <radialGradient id="gluon-field" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Nukleon-Grenzmembran */}
                <circle cx="160" cy="160" r={130} fill="url(#gluon-field)" stroke="rgba(250, 204, 21, 0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: '30s' }} />

                {/* Gluonen-Verbindungslinien zwischen den 3 Quarks (Dreiecks-Kraftfeld) */}
                <line x1="160" y1="80" x2="90" y2="210" stroke="#facc15" strokeWidth="4" strokeDasharray="3 3" />
                <line x1="160" y1="80" x2="230" y2="210" stroke="#facc15" strokeWidth="4" strokeDasharray="3 3" />
                <line x1="90" y1="210" x2="230" y2="210" stroke="#facc15" strokeWidth="4" strokeDasharray="3 3" />

                {/* Die 3 Quarks */}
                {selectedNucleonType === 'proton' ? (
                  <>
                    {/* Quark 1: Up (+2/3 e, Rot) */}
                    <g className="cursor-pointer" onClick={() => setInspectedQuark('Up (u) #1: Ladung +2/3 e, Farbladung Rot')}>
                      <circle cx="160" cy="80" r="28" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                      <text x="160" y="85" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">u</text>
                      <text x="160" y="97" textAnchor="middle" fill="#fee2e2" fontSize="9" fontWeight="bold">+2/3</text>
                    </g>
                    {/* Quark 2: Up (+2/3 e, Grün) */}
                    <g className="cursor-pointer" onClick={() => setInspectedQuark('Up (u) #2: Ladung +2/3 e, Farbladung Grün')}>
                      <circle cx="90" cy="210" r="28" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="90" y="215" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">u</text>
                      <text x="90" y="227" textAnchor="middle" fill="#d1fae5" fontSize="9" fontWeight="bold">+2/3</text>
                    </g>
                    {/* Quark 3: Down (-1/3 e, Blau) */}
                    <g className="cursor-pointer" onClick={() => setInspectedQuark('Down (d): Ladung -1/3 e, Farbladung Blau')}>
                      <circle cx="230" cy="210" r="28" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                      <text x="230" y="215" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">d</text>
                      <text x="230" y="227" textAnchor="middle" fill="#dbeafe" fontSize="9" fontWeight="bold">-1/3</text>
                    </g>
                  </>
                ) : (
                  <>
                    {/* Quark 1: Up (+2/3 e, Rot) */}
                    <g className="cursor-pointer" onClick={() => setInspectedQuark('Up (u): Ladung +2/3 e, Farbladung Rot')}>
                      <circle cx="160" cy="80" r="28" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                      <text x="160" y="85" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">u</text>
                      <text x="160" y="97" textAnchor="middle" fill="#fee2e2" fontSize="9" fontWeight="bold">+2/3</text>
                    </g>
                    {/* Quark 2: Down (-1/3 e, Grün) */}
                    <g className="cursor-pointer" onClick={() => setInspectedQuark('Down (d) #1: Ladung -1/3 e, Farbladung Grün')}>
                      <circle cx="90" cy="210" r="28" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="90" y="215" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">d</text>
                      <text x="90" y="227" textAnchor="middle" fill="#d1fae5" fontSize="9" fontWeight="bold">-1/3</text>
                    </g>
                    {/* Quark 3: Down (-1/3 e, Blau) */}
                    <g className="cursor-pointer" onClick={() => setInspectedQuark('Down (d) #2: Ladung -1/3 e, Farbladung Blau')}>
                      <circle cx="230" cy="210" r="28" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                      <text x="230" y="215" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">d</text>
                      <text x="230" y="227" textAnchor="middle" fill="#dbeafe" fontSize="9" fontWeight="bold">-1/3</text>
                    </g>
                  </>
                )}

                {/* Gluonen-Label im Zentrum */}
                <text x="160" y="165" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  Gluonen ⚡
                </text>
              </svg>
            </div>

            {/* Quark-Detailbanner & physikalische Erklärung */}
            <div className="mt-2 space-y-1.5 max-w-md">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
                {inspectedQuark || (
                  <span>
                    Ladungsrechnung: {selectedNucleonType === 'proton' ? '(+2/3) + (+2/3) + (-1/3) = +1 e' : '(+2/3) + (-1/3) + (-1/3) = 0 e'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Quarks sind unteilbare Elementarteilchen. Sie tauschen kontinuierlich Gluonen aus. Wegen des <em>Confinements</em> können Quarks niemals isoliert existieren!
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setStage(1)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Zurück zum Periodensystem (Makroschau)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Fußzeile mit Maßstabs-Fortschrittsbalken */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zoom-Fahrt: Stufe {currentStage} von 4</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500">Maßstab:</span>
          <span className="text-cyan-300 font-bold">{STAGE_CONFIG[currentStage].orderOfMagnitude}</span>
        </div>
      </div>
    </div>
  );
};
