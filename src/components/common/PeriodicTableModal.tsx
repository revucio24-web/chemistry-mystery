import React, { useState } from 'react';
import { ChemicalElement, ElementCategory } from '../../types/chemistry';
import { ELEMENTS_DATA, getElementByNumber } from '../../data/elements';
import { AtomVisualizer } from '../visualizers/AtomVisualizer';
import { soundEngine } from '../../engine/audio';
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
  ArrowRight
} from 'lucide-react';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAtomicNumber?: number;
}

const CATEGORY_DEFINITIONS: Record<ElementCategory, { label: string; color: string; border: string }> = {
  alkali_metal: { label: 'Alkalimetalle', color: 'bg-rose-950/60 text-rose-300', border: 'border-rose-500/50' },
  alkaline_earth: { label: 'Erdalkalimetalle', color: 'bg-orange-950/60 text-orange-300', border: 'border-orange-500/50' },
  transition_metal: { label: 'Übergangsmetalle', color: 'bg-amber-950/60 text-amber-300', border: 'border-amber-500/50' },
  post_transition_metal: { label: 'Metalle', color: 'bg-slate-800/80 text-slate-300', border: 'border-slate-500/50' },
  metalloid: { label: 'Halbmetalle', color: 'bg-emerald-950/60 text-emerald-300', border: 'border-emerald-500/50' },
  reactive_nonmetal: { label: 'Reaktive Nichtmetalle', color: 'bg-cyan-950/60 text-cyan-300', border: 'border-cyan-500/50' },
  noble_gas: { label: 'Edelgase', color: 'bg-purple-950/60 text-purple-300', border: 'border-purple-500/50' },
  lanthanide: { label: 'Lanthanoide', color: 'bg-teal-950/60 text-teal-300', border: 'border-teal-500/50' },
  actinide: { label: 'Actinoide', color: 'bg-lime-950/60 text-lime-300', border: 'border-lime-500/50' }
};

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose,
  initialAtomicNumber = 1
}) => {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(() => {
    return getElementByNumber(initialAtomicNumber) || ELEMENTS_DATA[0];
  });
  const [search, setSearch] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');

  if (!isOpen) return null;

  const handleSelectElement = (elem: ChemicalElement) => {
    soundEngine.playClick();
    soundEngine.playAtomOrbit();
    setSelectedElement(elem);
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'gas':
        return <span title="Aggregatzustand: Gasförmig"><Wind className="w-3 h-3 text-cyan-400" /></span>;
      case 'liquid':
        return <span title="Aggregatzustand: Flüssig"><Droplet className="w-3 h-3 text-blue-400" /></span>;
      default:
        return <span title="Aggregatzustand: Feststoff"><Flame className="w-3 h-3 text-slate-400" /></span>;
    }
  };

  // Filterung
  const filteredElements = ELEMENTS_DATA.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.symbol.toLowerCase().includes(search.toLowerCase()) ||
      e.atomicNumber.toString() === search.trim();

    const matchesCategory = 
      activeCategoryFilter === 'all' || e.category === activeCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-7xl h-[92vh] lab-card rounded-3xl border-2 border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header-Leiste */}
        <div className="p-4 sm:p-6 border-b border-cyan-500/20 bg-slate-950/70 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shadow-md">
              <Atom className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Periodensystem der Elemente (PSE)
                </h2>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {ELEMENTS_DATA.length} Elemente
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Interaktiver Element-Atlas & Bohrsches Schalenmodell
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View-Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Gitter
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Karten
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
              title="Periodensystem schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter- & Suchleiste */}
        <div className="p-3 sm:px-6 bg-slate-900/40 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          {/* Kategorie-Filter-Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Alle ({ELEMENTS_DATA.length})
            </button>

            {Object.entries(CATEGORY_DEFINITIONS).map(([catKey, catDef]) => (
              <button
                key={catKey}
                type="button"
                onClick={() => setActiveCategoryFilter(catKey)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryFilter === catKey
                    ? `${catDef.color} border ${catDef.border} font-bold shadow-sm`
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {catDef.label}
              </button>
            ))}
          </div>

          {/* Suchfeld */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, Symbol oder Ordnungszahl..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Hauptbereich: Links Element-Tabelle/Liste, Rechts Detail-Inspektor */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Linker Bereich: Elemente Raster / Liste */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-2.5">
                {filteredElements.map(elem => {
                  const isSelected = selectedElement.atomicNumber === elem.atomicNumber;
                  const catDef = CATEGORY_DEFINITIONS[elem.category] || CATEGORY_DEFINITIONS.reactive_nonmetal;

                  return (
                    <div
                      key={elem.atomicNumber}
                      onClick={() => handleSelectElement(elem)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between relative group ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-102 ring-1 ring-cyan-400'
                          : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-slate-400 group-hover:text-cyan-300">
                          {elem.atomicNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          {getStateIcon(elem.stateAtRoomTemp)}
                        </div>
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
                        <span>{elem.atomicMass} u</span>
                        <span className={`px-1.5 py-0.2 rounded ${catDef.color}`}>
                          P{elem.period}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Karten / Listenansicht */
              <div className="space-y-2">
                {filteredElements.map(elem => {
                  const isSelected = selectedElement.atomicNumber === elem.atomicNumber;
                  const catDef = CATEGORY_DEFINITIONS[elem.category] || CATEGORY_DEFINITIONS.reactive_nonmetal;

                  return (
                    <div
                      key={elem.atomicNumber}
                      onClick={() => handleSelectElement(elem)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                          : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold text-white shadow-md"
                          style={{ backgroundColor: elem.colorHex || '#06b6d4' }}
                        >
                          {elem.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{elem.name}</span>
                            <span className="text-xs text-slate-400 font-mono">#{elem.atomicNumber}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${catDef.color} ${catDef.border}`}>
                              {catDef.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                            {elem.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0">
                        <div className="text-right hidden sm:block">
                          <div>Masse: {elem.atomicMass} u</div>
                          <div>Periode {elem.period}, Gruppe {elem.group}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Rechter Bereich: Live Atom-Visualizer & Detaillierte Element-Akte */}
          <div className="w-full lg:w-[440px] border-t lg:border-t-0 lg:border-l border-cyan-500/20 bg-slate-950/80 p-6 overflow-y-auto shrink-0 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Titel & Symbole */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-3xl font-bold text-white shadow-xl"
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
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {selectedElement.name}
                    </h3>
                    {selectedElement.latinName && (
                      <p className="text-xs text-slate-400 italic">
                        {selectedElement.latinName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {getStateIcon(selectedElement.stateAtRoomTemp)}
                </div>
              </div>

              {/* Interaktiver Bohr-Atom-Visualizer */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                    <Atom className="w-4 h-4" />
                    <span>Bohrsches Schalenmodell</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Klick auf Schale zur Inspektion
                  </span>
                </div>

                <AtomVisualizer
                  element={selectedElement}
                  size={280}
                  showControls={true}
                  interactive={true}
                />
              </div>

              {/* Wissenschaftliche Parameter-Tabelle */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Kategorie</span>
                  <span className="font-semibold text-slate-200">
                    {CATEGORY_DEFINITIONS[selectedElement.category]?.label || selectedElement.category}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Periode / Gruppe</span>
                  <span className="font-semibold text-cyan-300 font-mono">
                    Periode {selectedElement.period} • Gruppe {selectedElement.group}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Typische Wertigkeit</span>
                  <span className="font-semibold text-amber-300 font-mono">
                    {selectedElement.valency.join(', ')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Zustand bei 20 °C</span>
                  <span className="font-semibold text-slate-200 capitalize">
                    {selectedElement.stateAtRoomTemp === 'gas' ? 'Gasförmig' : selectedElement.stateAtRoomTemp === 'liquid' ? 'Flüssig' : 'Fest'}
                  </span>
                </div>
              </div>

              {/* Didaktische Infoboxen */}
              <div className="space-y-2.5 text-xs">
                <p className="text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  {selectedElement.description}
                </p>

                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Wissenschaftlicher Fun Fact</span>
                  </div>
                  <p className="leading-relaxed">{selectedElement.funFact}</p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-indigo-200">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-300 mb-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Alltags- und Industrie-Anwendung</span>
                  </div>
                  <p className="leading-relaxed">{selectedElement.realWorldUse}</p>
                </div>

                {selectedElement.hazardNote && (
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11px]">{selectedElement.hazardNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Schließen Button */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
