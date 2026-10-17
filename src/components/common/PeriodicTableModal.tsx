import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChemicalElement, ElementCategory } from '../../types/chemistry';
import { ELEMENTS_DATA, getElementByNumber, getElectronConfiguration, getElementPhysics } from '../../data/elements';
import { AtomVisualizer } from '../visualizers/AtomVisualizer';
import { MicrocosmZoomVisualizer } from '../visualizers/MicrocosmZoomVisualizer';
import { soundEngine } from '../../engine/audio';
import { getElementSuperpower } from '../../data/elementSuperpowers';
import { 
  X, 
  Search, 
  Sparkles, 
  Atom, 
  ShieldAlert, 
  Flame, 
  Droplet, 
  Wind, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  LayoutGrid, 
  Table as TableIcon, 
  Thermometer, 
  BookOpen, 
  Binary, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Scan
} from 'lucide-react';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAtomicNumber?: number;
}

export const CATEGORY_DEFINITIONS: Record<ElementCategory, { label: string; color: string; border: string; bgSoft: string }> = {
  alkali_metal: { label: 'Alkalimetalle', color: 'text-rose-300', border: 'border-rose-500/50', bgSoft: 'bg-rose-950/60' },
  alkaline_earth: { label: 'Erdalkalimetalle', color: 'text-orange-300', border: 'border-orange-500/50', bgSoft: 'bg-orange-950/60' },
  transition_metal: { label: 'Übergangsmetalle', color: 'text-amber-300', border: 'border-amber-500/50', bgSoft: 'bg-amber-950/60' },
  post_transition_metal: { label: 'Metalle', color: 'text-blue-300', border: 'border-blue-500/50', bgSoft: 'bg-blue-950/60' },
  metalloid: { label: 'Halbmetalle', color: 'text-emerald-300', border: 'border-emerald-500/50', bgSoft: 'bg-emerald-950/60' },
  reactive_nonmetal: { label: 'Reaktive Nichtmetalle', color: 'text-cyan-300', border: 'border-cyan-500/50', bgSoft: 'bg-cyan-950/60' },
  noble_gas: { label: 'Edelgase', color: 'text-purple-300', border: 'border-purple-500/50', bgSoft: 'bg-purple-950/60' },
  lanthanide: { label: 'Lanthanoide', color: 'text-teal-300', border: 'border-teal-500/50', bgSoft: 'bg-teal-950/60' },
  actinide: { label: 'Actinoide', color: 'text-lime-300', border: 'border-lime-500/50', bgSoft: 'bg-lime-950/60' }
};

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose,
  initialAtomicNumber = 1
}) => {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(() => {
    return getElementByNumber(initialAtomicNumber) || ELEMENTS_DATA[0];
  });

  const elemPhysics = useMemo(() => getElementPhysics(selectedElement.atomicNumber), [selectedElement.atomicNumber]);
  const electronConfig = useMemo(() => selectedElement.electronConfiguration || getElectronConfiguration(selectedElement.atomicNumber), [selectedElement]);
  const electronegativity = selectedElement.electronegativity ?? elemPhysics.en;
  const meltingPoint = selectedElement.meltingPointC ?? elemPhysics.mp;
  const boilingPoint = selectedElement.boilingPointC ?? elemPhysics.bp;
  const density = selectedElement.density || elemPhysics.dens;
  const discoveredYear = selectedElement.discoveredYear || elemPhysics.year;

  const [search, setSearch] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<'all' | 'solid' | 'liquid' | 'gas'>('all');
  const [viewMode, setViewMode] = useState<'iupac' | 'grid' | 'zoom'>('iupac');
  const [tableZoom, setTableZoom] = useState<number>(1.0);

  // Vollbild & Layout-Steuerung
  const modalRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleFullscreen = async () => {
    soundEngine.playClick();
    try {
      if (!document.fullscreenElement) {
        if (modalRef.current?.requestFullscreen) {
          await modalRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else {
          setIsFullscreen(prev => !prev);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch {
      setIsFullscreen(prev => !prev);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const fitToScreen = () => {
    soundEngine.playClick();
    if (typeof window === 'undefined') return;
    const availableWidth = window.innerWidth - (isSidebarOpen ? 480 : 60);
    const calculatedZoom = Math.min(1.3, Math.max(0.75, Number((availableWidth / 1180).toFixed(2))));
    setTableZoom(calculatedZoom);
  };

  const handleSelectElement = (elem: ChemicalElement) => {
    soundEngine.playClick();
    soundEngine.playAtomOrbit();
    setSelectedElement(elem);
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'gas':
        return <span title="Aggregatzustand bei 20°C: Gasförmig"><Wind className="w-2.5 h-2.5 text-cyan-400" /></span>;
      case 'liquid':
        return <span title="Aggregatzustand bei 20°C: Flüssig"><Droplet className="w-2.5 h-2.5 text-blue-400" /></span>;
      default:
        return <span title="Aggregatzustand bei 20°C: Feststoff"><Flame className="w-2.5 h-2.5 text-slate-400" /></span>;
    }
  };

  // Map elements by atomic number for quick lookup in 18-column grid
  const elementsByNumber = useMemo(() => {
    const map = new Map<number, ChemicalElement>();
    for (const el of ELEMENTS_DATA) {
      map.set(el.atomicNumber, el);
    }
    return map;
  }, []);

  // Filter-Funktion zur Prüfung, ob ein Element den Kriterien entspricht
  const isElementMatching = (elem: ChemicalElement): boolean => {
    const matchesSearch = 
      elem.name.toLowerCase().includes(search.toLowerCase()) ||
      elem.symbol.toLowerCase().includes(search.toLowerCase()) ||
      elem.atomicNumber.toString() === search.trim();

    const matchesCategory = 
      activeCategoryFilter === 'all' || elem.category === activeCategoryFilter;

    const matchesState = 
      stateFilter === 'all' || elem.stateAtRoomTemp === stateFilter;

    return matchesSearch && matchesCategory && matchesState;
  };

  // Gefilterte Liste für die Kachel-Ansicht
  const filteredElements = useMemo(() => {
    return ELEMENTS_DATA.filter(isElementMatching);
  }, [search, activeCategoryFilter, stateFilter]);

  // Gruppierung für die klassische 18-Spalten-Tabelle
  // Haupttabelle: Perioden 1-7 ohne Lanthanoide (57-71) und Actinoide (89-103)
  const mainTableElements = useMemo(() => {
    return ELEMENTS_DATA.filter(e => {
      const isLanthanide = e.atomicNumber >= 57 && e.atomicNumber <= 71;
      const isActinide = e.atomicNumber >= 89 && e.atomicNumber <= 103;
      return !isLanthanide && !isActinide;
    });
  }, []);

  const lanthanoids = useMemo(() => {
    return ELEMENTS_DATA.filter(e => e.atomicNumber >= 57 && e.atomicNumber <= 71);
  }, []);

  const actinoids = useMemo(() => {
    return ELEMENTS_DATA.filter(e => e.atomicNumber >= 89 && e.atomicNumber <= 103);
  }, []);

  const handleZoom = (delta: number) => {
    soundEngine.playClick();
    setTableZoom(prev => Math.min(1.4, Math.max(0.75, Number((prev + delta).toFixed(2)))));
  };

  const resetZoom = () => {
    soundEngine.playClick();
    setTableZoom(1.0);
  };

  // Render-Hilfsfunktion für eine einzelne Element-Zelle im 18-Spalten-Gitter (Lehrbuch-Stil)
  const renderGridCell = (elem: ChemicalElement, customCol?: number, customRow?: number) => {
    const isSelected = selectedElement.atomicNumber === elem.atomicNumber;
    const matches = isElementMatching(elem);
    const catDef = CATEGORY_DEFINITIONS[elem.category] || CATEGORY_DEFINITIONS.reactive_nonmetal;

    const gridCol = customCol !== undefined ? customCol : elem.group;
    const gridRow = customRow !== undefined ? customRow : elem.period;

    const physics = getElementPhysics(elem.atomicNumber);
    const enVal = elem.electronegativity ?? physics.en;
    const enStr = enVal !== undefined && enVal > 0 ? enVal.toFixed(1).replace('.', ',') : '–';
    const massStr = elem.atomicMass < 10 
      ? elem.atomicMass.toFixed(3).replace('.', ',') 
      : elem.atomicMass < 100 
      ? elem.atomicMass.toFixed(2).replace('.', ',') 
      : elem.atomicMass.toFixed(1).replace('.', ',');

    return (
      <div
        key={elem.atomicNumber}
        style={{ gridColumn: gridCol, gridRow: gridRow }}
        onClick={() => handleSelectElement(elem)}
        onDoubleClick={() => {
          handleSelectElement(elem);
          soundEngine.playAtomOrbit();
          setViewMode('zoom');
        }}
        title={`${elem.name} (${elem.symbol}, Z=${elem.atomicNumber}, Masse=${elem.atomicMass}u, EN=${enVal ?? '–'}) • Klick: Auswählen • Doppelklick: Zoom in den Atomkern`}
        className={`p-1 sm:p-1.5 rounded-xl border text-center flex flex-col justify-between cursor-pointer select-none transition-all element-cell-hover relative min-h-[56px] ${
          isSelected
            ? 'bg-cyan-950 border-cyan-300 shadow-xl shadow-cyan-500/50 scale-105 z-20 ring-2 ring-cyan-300'
            : matches
            ? `${catDef.bgSoft} border-slate-700/80 hover:border-cyan-400 hover:shadow-lg hover:scale-105 hover:z-10`
            : 'bg-slate-950/40 border-slate-900 opacity-20 grayscale'
        }`}
      >
        {/* Obere Zeile: Ordnungszahl Z (links) & Pauling EN (rechts) */}
        <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono leading-none border-b border-white/10 pb-0.5">
          <span className="font-extrabold text-white text-[9px] sm:text-[10px] tracking-tight">{elem.atomicNumber}</span>
          <span className="text-[7.5px] sm:text-[8px] text-amber-300 font-bold" title="Elektronegativität nach Pauling">{enStr}</span>
        </div>

        {/* Mitte: Großes Symbol & Deutscher Name */}
        <div className="my-0.5">
          <span 
            className="font-mono text-xs sm:text-base font-black tracking-tight block leading-tight drop-shadow-sm"
            style={{ color: elem.colorHex || '#38bdf8' }}
          >
            {elem.symbol}
          </span>
          <span className="text-[7.5px] sm:text-[9px] font-semibold text-slate-100 truncate block leading-tight">
            {elem.name}
          </span>
        </div>

        {/* Untere Zeile: Relative Atommasse (links) & Zustand (rechts) */}
        <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-slate-300 pt-0.5 border-t border-white/10 leading-none">
          <span className="truncate font-medium">{massStr}</span>
          <span className="shrink-0">{getStateIcon(elem.stateAtRoomTemp)}</span>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-0 ${isFullscreen ? '' : 'sm:p-3 bg-black/85 backdrop-blur-md'} animate-fade-in`}>
      <div 
        ref={modalRef}
        className={`w-full flex flex-col overflow-hidden relative ${
          isFullscreen 
            ? 'w-screen h-screen max-w-none max-h-none rounded-none m-0 border-none bg-slate-950' 
            : 'max-w-[1600px] h-[95vh] lab-card rounded-3xl border-2 border-cyan-500/40 shadow-2xl bg-slate-950/95'
        }`}
      >
        
        {/* Header-Leiste */}
        <div className="p-2.5 sm:px-5 py-2.5 border-b border-cyan-500/20 bg-slate-950/95 flex items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide">
                  Periodensystem der Elemente (PSE)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  118 Elemente
                </span>
                <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                  IUPAC Standard
                </span>
                {isFullscreen && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold animate-pulse">
                    ⛶ Vollbild aktiv (Taste F)
                  </span>
                )}
              </div>
              <p className="text-[10.5px] text-slate-400 hidden sm:block">
                Authentisches Lehrbuch-Format • Schalenmodell • Atomkern-Erkundung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View-Toggle: 18-Spalten PSE vs. Kacheln vs. Kern-Zoom */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setViewMode('iupac');
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'iupac' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Klassische 18-Spalten-Tabelle nach IUPAC"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">18-Spalten</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setViewMode('grid');
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Kompakte Kachelübersicht"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kacheln</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  soundEngine.playAtomOrbit();
                  setViewMode('zoom');
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'zoom' ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold shadow-md shadow-rose-500/30' : 'text-slate-400 hover:text-white'
                }`}
                title="Zoom-Reise vom Periodensystem tief in den Atomkern"
              >
                <ZoomIn className="w-3.5 h-3.5 text-rose-300" />
                <span className="hidden sm:inline">Kern-Zoom</span>
              </button>
            </div>

            {/* Zoom Steuerung für IUPAC-Tabelle */}
            {viewMode === 'iupac' && (
              <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => handleZoom(-0.1)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                  title="Verkleinern"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-cyan-300 px-1 font-semibold">
                  {Math.round(tableZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => handleZoom(0.1)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                  title="Vergrößern"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                  title="100% Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={fitToScreen}
                  className="p-1.5 text-cyan-400 hover:text-cyan-200 rounded hover:bg-slate-800 cursor-pointer"
                  title="An Bildschirmgröße anpassen"
                >
                  <Scan className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Sidebar Umschalter (Nur Tabelle vs. Mit Details) */}
            {viewMode !== 'zoom' && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setIsSidebarOpen(prev => !prev);
                }}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isSidebarOpen
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    : 'bg-amber-950/70 border-amber-500/60 text-amber-300 hover:bg-amber-900'
                }`}
                title={isSidebarOpen ? 'Sidebar ausblenden für maximale Tabellenbreite' : 'Details-Sidebar einblenden'}
              >
                {isSidebarOpen ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                <span className="hidden md:inline">{isSidebarOpen ? 'Nur Tabelle' : 'Details'}</span>
              </button>
            )}

            {/* Vollbild-Modus Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              title={isFullscreen ? 'Vollbildmodus beenden (F oder Esc)' : 'Vollbildmodus für maximale Übersicht aktivieren (Taste F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
              <span className="hidden sm:inline font-mono">{isFullscreen ? 'Vollbild aus (F)' : 'Vollbild (F)'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
              title="Periodensystem schließen (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter- & Suchleiste */}
        <div className="px-3 sm:px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          {/* Kategorie-Filter-Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveCategoryFilter('all');
              }}
              className={`px-2.5 py-1 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Alle ({ELEMENTS_DATA.length})
            </button>

            {Object.entries(CATEGORY_DEFINITIONS).map(([catKey, catDef]) => {
              const count = ELEMENTS_DATA.filter(e => e.category === catKey).length;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveCategoryFilter(prev => prev === catKey ? 'all' : catKey);
                  }}
                  className={`px-2.5 py-1 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    activeCategoryFilter === catKey
                      ? `${catDef.bgSoft} ${catDef.color} border ${catDef.border} font-bold shadow-sm ring-1 ring-cyan-400/50`
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <span>{catDef.label}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Aggregatzustand & Suchfeld */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            {/* Aggregatzustand Filter */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setStateFilter('all')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  stateFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Alle Aggregatzustände"
              >
                Alle
              </button>
              <button
                type="button"
                onClick={() => setStateFilter('solid')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  stateFilter === 'solid' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Feststoffe bei 20°C"
              >
                <Flame className="w-3 h-3 text-slate-400" />
                <span className="hidden sm:inline">Fest</span>
              </button>
              <button
                type="button"
                onClick={() => setStateFilter('liquid')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  stateFilter === 'liquid' ? 'bg-slate-800 text-blue-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Flüssigkeiten bei 20°C"
              >
                <Droplet className="w-3 h-3 text-blue-400" />
                <span className="hidden sm:inline">Flüssig</span>
              </button>
              <button
                type="button"
                onClick={() => setStateFilter('gas')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  stateFilter === 'gas' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Gase bei 20°C"
              >
                <Wind className="w-3 h-3 text-cyan-400" />
                <span className="hidden sm:inline">Gas</span>
              </button>
            </div>

            {/* Suchfeld */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, Symbol, Zahl..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Hauptbereich: Entweder 4-Stufen Kern-Zoom Visualizer ODER PSE-Tabelle + Inspektor */}
        {viewMode === 'zoom' ? (
          <div className="flex-1 p-3 sm:p-5 overflow-hidden flex flex-col">
            <MicrocosmZoomVisualizer
              element={selectedElement}
              onClose={() => setViewMode('iupac')}
              className="flex-1"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Linker Bereich: Das echte 18-Spalten IUPAC-Periodensystem */}
            <div className="flex-1 overflow-auto p-3 sm:p-5 flex flex-col justify-between">
            {viewMode === 'iupac' ? (
              <div 
                className="transition-transform origin-top-left pb-6"
                style={{ transform: `scale(${tableZoom})` }}
              >
                {/* 18-Spalten IUPAC Haupttabelle (Perioden 1-7, Gruppen 1-18) */}
                <div className="min-w-[1040px] xl:min-w-[1140px] space-y-3">
                  
                  {/* Spalten-Kopfzeile: Gruppe 1 bis 18 */}
                  <div className="grid grid-cols-18 gap-1 sm:gap-1.5 mb-1 px-1">
                    {Array.from({ length: 18 }).map((_, gIdx) => (
                      <div key={gIdx} className="text-center font-mono text-[9px] text-cyan-400/80 font-bold">
                        {gIdx + 1}
                      </div>
                    ))}
                  </div>

                  {/* 18-Spalten-Gitter der Haupttabelle */}
                  <div 
                    className="grid grid-cols-18 gap-1 sm:gap-1.5"
                    style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
                  >
                    {/* Didaktische Lehrbuch-Musterzelle & Farblegende (Spalten 3 bis 12, Perioden 1 bis 3) */}
                    <div 
                      style={{ gridColumn: '3 / span 10', gridRow: '1 / span 3' }}
                      className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-cyan-950/40 border-2 border-cyan-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 my-1 mx-1 select-none backdrop-blur-sm z-10"
                    >
                      {/* Linke Seite: Große Didaktische Musterzelle wie im Lehrbuch (Eisen Fe) */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="relative p-2.5 sm:p-3 rounded-2xl bg-slate-950 border-2 border-cyan-400 shadow-xl w-32 sm:w-36 h-32 sm:h-36 flex flex-col justify-between text-center ring-2 ring-cyan-500/30">
                          {/* Beschriftungspfeile / Legende */}
                          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
                            <div className="text-left">
                              <span className="font-mono text-sm sm:text-base font-black text-cyan-300">26</span>
                              <span className="block text-[7px] text-cyan-400 font-sans font-bold leading-none">Ordnungszahl Z</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-black text-amber-300">1,83</span>
                              <span className="block text-[7px] text-amber-300 font-sans font-bold leading-none">Elektronegativität</span>
                            </div>
                          </div>

                          <div className="my-0.5">
                            <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">Fe</span>
                            <span className="block text-[9.5px] sm:text-[10px] font-bold text-slate-200">Eisen</span>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-700/80 pt-1">
                            <div className="text-left">
                              <span className="font-mono text-[8.5px] sm:text-[9px] font-bold text-slate-300">55,845</span>
                              <span className="block text-[7px] text-slate-400 font-sans leading-none">Atommasse u</span>
                            </div>
                            <div className="text-right flex items-center gap-1">
                              <Flame className="w-3 h-3 text-slate-400" />
                              <span className="text-[7px] text-slate-400 font-sans leading-none">Feststoff</span>
                            </div>
                          </div>
                        </div>

                        {/* Didaktischer Erklärungstext zur Musterzelle */}
                        <div className="space-y-1.5 max-w-[190px] xl:max-w-[230px] text-left hidden sm:block">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Lehrbuch-Muster</span>
                          </div>
                          <p className="text-[10.5px] text-slate-300 leading-snug">
                            Jede Kachel zeigt <strong className="text-white">Ordnungszahl Z</strong>, <strong className="text-amber-300">Elektronegativität</strong> (Pauling), <strong className="text-white">Symbol & Name</strong>, <strong className="text-white">Atommasse</strong> und <strong className="text-slate-300">Zustand</strong>.
                          </p>
                          <div className="flex items-center gap-2 pt-0.5 text-[9.5px] text-cyan-300 font-mono">
                            <span>💡 Klick = Details</span>
                            <span>•</span>
                            <span>🔬 Doppelklick = Kern</span>
                          </div>
                        </div>
                      </div>

                      {/* Rechte Seite: Kompakte Farblegende der 9 Elementserien (IUPAC) */}
                      <div className="flex-1 grid grid-cols-3 gap-1.5 text-[9px] w-full max-w-[480px]">
                        {Object.entries(CATEGORY_DEFINITIONS).map(([catKey, catDef]) => (
                          <button
                            key={catKey}
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              setActiveCategoryFilter(prev => prev === catKey ? 'all' : catKey);
                            }}
                            className={`px-2 py-1 rounded-lg border text-left truncate transition-all cursor-pointer flex items-center gap-1.5 ${
                              activeCategoryFilter === catKey
                                ? `${catDef.bgSoft} ${catDef.color} border-cyan-400 font-bold ring-1 ring-cyan-400`
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${catDef.bgSoft.replace('bg-', 'bg-').replace('/60', '')} border ${catDef.border}`} />
                            <span className="truncate">{catDef.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Alle Hauptelemente platziert nach (period, group) */}
                    {mainTableElements.map(elem => renderGridCell(elem))}

                    {/* Platzhalter für Lanthanoide (Periode 6, Gruppe 3) */}
                    <div
                      style={{ gridRow: 6, gridColumn: 3 }}
                      onClick={() => {
                        soundEngine.playClick();
                        setActiveCategoryFilter('lanthanide');
                        const el = elementsByNumber.get(57);
                        if (el) setSelectedElement(el);
                      }}
                      className="p-1 rounded-lg border border-teal-500/50 bg-teal-950/40 text-center flex flex-col justify-center cursor-pointer hover:scale-105 transition-transform"
                      title="Lanthanoide (57-71)"
                    >
                      <span className="text-[8px] font-mono text-teal-300 font-bold">57–71</span>
                      <span className="text-[10px] font-mono text-teal-200 font-extrabold">La–Lu</span>
                      <span className="text-[7px] text-teal-400 truncate">Lanthan</span>
                    </div>

                    {/* Platzhalter für Actinoide (Periode 7, Gruppe 3) */}
                    <div
                      style={{ gridRow: 7, gridColumn: 3 }}
                      onClick={() => {
                        soundEngine.playClick();
                        setActiveCategoryFilter('actinide');
                        const el = elementsByNumber.get(89);
                        if (el) setSelectedElement(el);
                      }}
                      className="p-1 rounded-lg border border-lime-500/50 bg-lime-950/40 text-center flex flex-col justify-center cursor-pointer hover:scale-105 transition-transform"
                      title="Actinoide (89-103)"
                    >
                      <span className="text-[8px] font-mono text-lime-300 font-bold">89–103</span>
                      <span className="text-[10px] font-mono text-lime-200 font-extrabold">Ac–Lr</span>
                      <span className="text-[7px] text-lime-400 truncate">Actinium</span>
                    </div>
                  </div>

                  {/* Untere Reihen: Lanthanoide & Actinoide (Spalten 3 bis 17, perfekt ausgerichtet am 18-Spalten-Gitter) */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-2">
                    {/* Reihe Lanthanoide (57 - 71) */}
                    <div className="grid grid-cols-18 gap-1 sm:gap-1.5 items-center">
                      <div 
                        style={{ gridColumn: '1 / span 2', gridRow: 1 }}
                        className="text-right pr-2 text-[10px] font-mono font-bold text-teal-300 select-none"
                      >
                        Lanthanoide:
                      </div>
                      {lanthanoids.map((elem, idx) => renderGridCell(elem, idx + 3, 1))}
                    </div>

                    {/* Reihe Actinoide (89 - 103) */}
                    <div className="grid grid-cols-18 gap-1 sm:gap-1.5 items-center">
                      <div 
                        style={{ gridColumn: '1 / span 2', gridRow: 1 }}
                        className="text-right pr-2 text-[10px] font-mono font-bold text-lime-300 select-none"
                      >
                        Actinoide:
                      </div>
                      {actinoids.map((elem, idx) => renderGridCell(elem, idx + 3, 1))}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* Kachel- / Such-Ansicht */
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-2.5">
                {filteredElements.map(elem => {
                  const isSelected = selectedElement.atomicNumber === elem.atomicNumber;
                  const catDef = CATEGORY_DEFINITIONS[elem.category] || CATEGORY_DEFINITIONS.reactive_nonmetal;

                  return (
                    <div
                      key={elem.atomicNumber}
                      onClick={() => handleSelectElement(elem)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between relative group element-cell-hover ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105 ring-2 ring-cyan-400 z-10'
                          : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-slate-400 group-hover:text-cyan-300">
                          {elem.atomicNumber}
                        </span>
                        <span>{getStateIcon(elem.stateAtRoomTemp)}</span>
                      </div>

                      <div className="my-2 text-center">
                        <span 
                          className="font-mono text-2xl font-bold tracking-tight block group-hover:scale-110 transition-transform"
                          style={{ color: elem.colorHex || '#38bdf8' }}
                        >
                          {elem.symbol}
                        </span>
                        <span className="text-xs font-semibold text-white truncate block mt-0.5">
                          {elem.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-800/80">
                        <span>{elem.atomicMass.toFixed(1)} u</span>
                        <span className={`px-1.5 py-0.2 rounded ${catDef.bgSoft} ${catDef.color}`}>
                          P{elem.period}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Rechter Bereich: Live Atom-Visualizer & Detaillierte Element-Akte */}
          {isSidebarOpen && (
            <div className="w-full lg:w-[460px] border-t lg:border-t-0 lg:border-l border-cyan-500/20 bg-slate-950/95 p-5 sm:p-6 overflow-y-auto shrink-0 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Titel, Symbol & Aggregatzustand */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-3xl font-bold text-white shadow-xl transition-all"
                    style={{
                      backgroundColor: selectedElement.colorHex || '#06b6d4',
                      boxShadow: `0 0 25px ${selectedElement.colorHex || '#06b6d4'}50`
                    }}
                  >
                    {selectedElement.symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        Z = {selectedElement.atomicNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {selectedElement.atomicMass} u
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-0.5">
                      {selectedElement.name}
                    </h3>
                    {selectedElement.latinName && (
                      <p className="text-xs text-slate-400 italic font-mono">
                        {selectedElement.latinName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  {getStateIcon(selectedElement.stateAtRoomTemp)}
                </div>
              </div>

              {/* Interaktiver Bohr-Atom-Visualizer mit Quantensprung & Kern-Zoom */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-inner space-y-3">
                {/* Neuer prominenter Zoom-Button in den Atomkern */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    soundEngine.playAtomOrbit();
                    setViewMode('zoom');
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-600/30 via-red-500/20 to-amber-500/20 hover:from-rose-600/40 hover:to-amber-500/30 border border-rose-500/50 text-white text-xs font-bold flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group"
                  title="4-Stufen-Zoom: Vom Periodensystem tief in den Atomkern und zu den Quarks"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg group-hover:scale-125 transition-transform">🔬</span>
                    <div className="text-left">
                      <span className="block text-white font-bold">In den Atomkern zoomen</span>
                      <span className="block text-[10px] text-rose-300 font-mono font-normal">Tiefenflug: PSE ➔ Hülle ➔ Kern ➔ Quarks</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                    <Atom className="w-4 h-4 text-cyan-400" />
                    <span>Bohrsches Schalenmodell</span>
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-semibold">
                    Klick = Quantensprung ⚡
                  </span>
                </div>

                <AtomVisualizer
                  element={selectedElement}
                  size={290}
                  showControls={true}
                  interactive={true}
                />
              </div>

              {/* Wissenschaftliche Parameter-Tabelle */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Kategorie</span>
                  <span className={`font-semibold ${CATEGORY_DEFINITIONS[selectedElement.category]?.color || 'text-white'}`}>
                    {CATEGORY_DEFINITIONS[selectedElement.category]?.label || selectedElement.category}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Periode / Gruppe</span>
                  <span className="font-semibold text-cyan-300 font-mono">
                    Periode {selectedElement.period} • Gruppe {selectedElement.group}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Typische Wertigkeit</span>
                  <span className="font-semibold text-amber-300 font-mono">
                    {selectedElement.valency.join(', ')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Zustand bei 20 °C</span>
                  <span className="font-semibold text-slate-200 capitalize">
                    {selectedElement.stateAtRoomTemp === 'gas' ? 'Gasförmig' : selectedElement.stateAtRoomTemp === 'liquid' ? 'Flüssig' : 'Feststoff'}
                  </span>
                </div>
              </div>

              {/* 100% Echte Physikalische & Chemische Kennzahlen (NIST / IUPAC) */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
                    <Binary className="w-4 h-4 text-cyan-400" />
                    <span>Wahre Kennzahlen (NIST / IUPAC)</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 font-mono font-semibold border border-cyan-700/50">
                    Geprüfte Daten
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Elektronegativität */}
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Elektronegativität (Pauling)</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">
                      {electronegativity !== undefined ? electronegativity.toFixed(2) : '– (Keine Bindung)'}
                    </span>
                  </div>

                  {/* Dichte */}
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Dichte</span>
                    <span className="font-mono font-bold text-slate-200 text-sm">
                      {density || '–'}
                    </span>
                  </div>

                  {/* Schmelzpunkt */}
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-rose-400" />
                      Schmelzpunkt
                    </span>
                    <span className="font-mono font-bold text-rose-300 text-sm">
                      {meltingPoint !== undefined ? `${meltingPoint} °C` : '–'}
                    </span>
                  </div>

                  {/* Siedepunkt */}
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-400" />
                      Siedepunkt
                    </span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      {boilingPoint !== undefined ? `${boilingPoint} °C` : '–'}
                    </span>
                  </div>
                </div>

                {/* Elektronenkonfiguration & Entdeckung */}
                <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-slate-400">Konfiguration:</span>
                  <span className="font-bold text-cyan-300 text-xs">{electronConfig}</span>
                </div>

                {discoveredYear && (
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-400" />
                      Entdeckung / Historie:
                    </span>
                    <span className="font-semibold text-indigo-200 text-xs">{discoveredYear}</span>
                  </div>
                )}
              </div>

              {/* Didaktische Infoboxen */}
              <div className="space-y-2 text-xs">
                {/* 🐱 Sparkys Element-Superkraft */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 flex items-start gap-2.5 shadow-sm">
                  <span className="text-xl shrink-0">🐱</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                      Sparkys Entdecker-Superkraft:
                    </span>
                    <p className="text-xs font-semibold leading-relaxed">
                      {getElementSuperpower(selectedElement.symbol)}
                    </p>
                  </div>
                </div>

                {/* Beschreibung */}
                <p className="text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  {selectedElement.description}
                </p>

                {/* Fun Fact */}
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Wissenschaftlicher Fun Fact</span>
                  </div>
                  <p className="leading-relaxed">{selectedElement.funFact}</p>
                </div>

                {/* Alltags- & Industrie-Anwendung */}
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-indigo-200">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-300 mb-0.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Alltags- und Industrie-Anwendung</span>
                  </div>
                  <p className="leading-relaxed">{selectedElement.realWorldUse}</p>
                </div>

                {/* Gefahrenhinweis */}
                {selectedElement.hazardNote && (
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11px]">{selectedElement.hazardNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Schließen Button */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors shadow-sm"
              >
                Schließen
              </button>
            </div>
          </div>
          )}
        </div>
      )}

      {/* Kompakte Schnell-Leiste am unteren Rand, wenn Sidebar ausgeblendet ist */}
      {!isSidebarOpen && viewMode !== 'zoom' && (
        <div className="p-3 sm:px-6 py-2.5 bg-slate-950/95 border-t border-cyan-500/30 flex items-center justify-between gap-3 shadow-2xl z-20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xl font-bold text-white shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: selectedElement.colorHex || '#06b6d4' }}
              onClick={() => setViewMode('zoom')}
              title="Klick: Zoom in den Atomkern"
            >
              {selectedElement.symbol}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">{selectedElement.name}</span>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800 font-bold">
                  Z = {selectedElement.atomicNumber}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  {selectedElement.atomicMass} u
                </span>
                <span className="text-xs text-amber-300 font-mono hidden sm:inline">
                  EN: {electronegativity !== undefined ? electronegativity.toFixed(2) : '–'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${CATEGORY_DEFINITIONS[selectedElement.category]?.bgSoft} ${CATEGORY_DEFINITIONS[selectedElement.category]?.color} hidden md:inline`}>
                  {CATEGORY_DEFINITIONS[selectedElement.category]?.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[600px] mt-0.5">
                {selectedElement.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                soundEngine.playAtomOrbit();
                setViewMode('zoom');
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Atomkern-Zoom 🔬</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setIsSidebarOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-cyan-500/40 transition-all hover:text-white"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Details öffnen</span>
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
