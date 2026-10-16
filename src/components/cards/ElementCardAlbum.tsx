import React, { useState } from 'react';
import { ElementCard } from '../../types/game';
import { ELEMENTS_DATA, getElementByNumber } from '../../data/elements';
import { AtomVisualizer } from '../visualizers/AtomVisualizer';
import { soundEngine } from '../../engine/audio';
import { getElementSuperpower } from '../../data/elementSuperpowers';
import { 
  Sparkles, 
  Layers, 
  Search, 
  X, 
  Atom,
  ArrowLeft
} from 'lucide-react';

interface ElementCardAlbumProps {
  collectedCards: ElementCard[];
  onClose?: () => void;
}

export const ElementCardAlbum: React.FC<ElementCardAlbumProps> = ({ collectedCards, onClose }) => {
  const [selectedCard, setSelectedCard] = useState<ElementCard | null>(null);
  const [filterRarity, setFilterRarity] = useState<'all' | 'common' | 'rare' | 'legendary'>('all');
  const [search, setSearch] = useState('');

  const totalPossible = ELEMENTS_DATA.length;

  const handleCardClick = (card: ElementCard) => {
    soundEngine.playClick();
    setSelectedCard(card);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return { label: 'Legendär', color: 'bg-amber-500/20 text-amber-300 border-amber-500/50' };
      case 'rare':
        return { label: 'Selten', color: 'bg-purple-500/20 text-purple-300 border-purple-500/50' };
      default:
        return { label: 'Gewöhnlich', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' };
    }
  };

  const filteredCards = collectedCards.filter(c => {
    const matchesRarity = filterRarity === 'all' || c.rarity === filterRarity;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesRarity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Album Header */}
      <div className="p-6 rounded-2xl lab-card border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zurück zur Laborübersicht</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Forschungs-Kollektion</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>Elementkarten-Sammelalbum</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Für jedes gemeisterte Rätsel und jede wissenschaftliche Entdeckung schaltest du holografische Elementkarten mit Hintergrundwissen frei.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono">Entdeckte Elemente</div>
            <div className="text-2xl font-mono font-bold text-cyan-300 mt-0.5">
              {collectedCards.length} / {totalPossible}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold font-mono">
            {totalPossible > 0 ? Math.round((collectedCards.length / totalPossible) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filter & Suche */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'common', 'rare', 'legendary'] as const).map(rarity => (
            <button
              key={rarity}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setFilterRarity(rarity);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterRarity === rarity
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {rarity === 'all' ? 'Alle Karten' : rarity === 'common' ? 'Gewöhnlich' : rarity === 'rare' ? 'Selten' : 'Legendär'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Karte suchen..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Kartenraster */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center lab-card rounded-2xl border border-slate-800">
          <Atom className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white">Noch keine Elementkarten in dieser Kategorie</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Löse Missionen im Elementarlabor, um neue Elementkarten zu entdecken und freizuschalten!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCards.map(card => {
            const badge = getRarityBadge(card.rarity);

            return (
              <div
                key={card.atomicNumber}
                onClick={() => handleCardClick(card)}
                className="lab-card lab-card-hover rounded-2xl p-4 border border-cyan-500/20 cursor-pointer flex flex-col justify-between relative overflow-hidden group transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    #{card.atomicNumber}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="my-3 text-center">
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-mono text-3xl font-bold shadow-lg transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: card.colorHex || '#06b6d4',
                      color: '#ffffff',
                      boxShadow: `0 0 24px ${card.colorHex || '#06b6d4'}40`
                    }}
                  >
                    {card.symbol}
                  </div>
                  <h4 className="font-bold text-white text-sm mt-3 group-hover:text-cyan-300 transition-colors">
                    {card.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {card.atomicMass} u
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 text-center truncate">
                  {card.funFact}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail-Modal bei Klick auf eine Elementkarte */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg lab-card rounded-2xl p-6 border-2 border-cyan-500/50 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-mono text-4xl font-bold text-white shadow-xl shrink-0"
                style={{
                  backgroundColor: selectedCard.colorHex || '#06b6d4',
                  boxShadow: `0 0 30px ${selectedCard.colorHex || '#06b6d4'}60`
                }}
              >
                {selectedCard.symbol}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    Ordnungszahl {selectedCard.atomicNumber}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getRarityBadge(selectedCard.rarity).color}`}>
                    {getRarityBadge(selectedCard.rarity).label}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {selectedCard.name}
                </h3>
                {selectedCard.latinName && (
                  <p className="text-xs text-slate-400 italic">
                    Lateinisch: {selectedCard.latinName}
                  </p>
                )}
              </div>
            </div>

            {/* Live Bohr-Atom-Visualizer */}
            {(() => {
              const fullElement = getElementByNumber(selectedCard.atomicNumber);
              if (!fullElement) return null;
              return (
                <div className="my-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-1 px-1">
                    <span className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                      <Atom className="w-3.5 h-3.5" />
                      <span>Bohrsches Schalenmodell</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Z={fullElement.atomicNumber} • {fullElement.protons}p⁺ / {fullElement.neutrons}n⁰
                    </span>
                  </div>
                  <AtomVisualizer
                    element={fullElement}
                    size={200}
                    showControls={false}
                    interactive={true}
                  />
                </div>
              );
            })()}

            <div className="grid grid-cols-3 gap-2 my-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Atommasse</span>
                <span className="font-mono font-bold text-xs text-cyan-300">{selectedCard.atomicMass} u</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Periode</span>
                <span className="font-mono font-bold text-xs text-cyan-300">{selectedCard.period}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Gruppe</span>
                <span className="font-mono font-bold text-xs text-cyan-300">{selectedCard.group}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* 🐱 Sparkys Element-Superkraft */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 flex items-start gap-2.5">
                <span className="text-xl shrink-0">🐱</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                    Sparkys Element-Superkraft:
                  </span>
                  <p className="text-xs font-semibold leading-relaxed">
                    {getElementSuperpower(selectedCard.symbol)}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
                <span className="font-semibold block mb-0.5 text-cyan-300">Wissenschaftlicher Fun Fact:</span>
                {selectedCard.funFact}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                <span className="font-semibold block mb-0.5 text-indigo-300">Praktische Anwendung im Alltag:</span>
                {selectedCard.realWorldUse}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="px-6 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
