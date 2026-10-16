import React, { useState } from 'react';
import { PeriodicTableQuizPuzzle, ValidationFeedback } from '../../types/puzzles';
import { ELEMENTS_DATA } from '../../data/elements';
import { ChemicalElement } from '../../types/chemistry';
import { soundEngine } from '../../engine/audio';
import { Search, Check, Sparkles } from 'lucide-react';

interface PeriodicTableQuizProps {
  puzzle: PeriodicTableQuizPuzzle;
  onValidate: (feedback: ValidationFeedback) => void;
}

export const PeriodicTableQuiz: React.FC<PeriodicTableQuizProps> = ({ puzzle, onValidate }) => {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');

  const handleSelect = (el: ChemicalElement) => {
    soundEngine.playClick();
    setSelectedElement(el);
  };

  const handleSubmit = () => {
    if (!selectedElement) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (selectedElement.symbol.toLowerCase() === puzzle.targetSymbol.toLowerCase()) {
      soundEngine.playSuccess();
      onValidate({
        isCorrect: true,
        message: `Hervorragend gefunden! ${selectedElement.name} (${selectedElement.symbol}) passt exakt zu den Vorgaben.`,
        scientificExplanation: puzzle.didacticExplanation,
        realWorldExample: puzzle.realWorldExample,
        attemptsCount: newAttempts
      });
    } else {
      soundEngine.playHintNotice();
      onValidate({
        isCorrect: false,
        message: `Nicht ganz: Du hast "${selectedElement.name}" (${selectedElement.symbol}) gewählt. Prüfe die Kriterien nochmals genau.`,
        scientificExplanation: puzzle.commonMistakeExplanation,
        hint: puzzle.hint,
        attemptsCount: newAttempts
      });
    }
  };

  const filteredElements = ELEMENTS_DATA.filter(el =>
    el.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    el.symbol.toLowerCase().includes(searchFilter.toLowerCase()) ||
    el.atomicNumber.toString().includes(searchFilter)
  );

  return (
    <div className="space-y-6">
      {/* Detektordaten / Kriterien */}
      <div className="p-4 rounded-xl bg-cyan-950/25 border border-cyan-800/40 text-cyan-200 text-sm">
        <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Detektor-Signatur: {puzzle.criteriaDescription}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {puzzle.clues.map((clue, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              • {clue}
            </div>
          ))}
        </div>
      </div>

      {/* Suche & Filter */}
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Wähle das Element im Periodensystem
        </h4>

        <div className="relative w-48 sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Name oder Symbol..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Elementkarten Raster */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredElements.map(el => {
          const isSelected = selectedElement?.atomicNumber === el.atomicNumber;

          return (
            <button
              key={el.atomicNumber}
              type="button"
              onClick={() => handleSelect(el)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[90px] relative ${
                isSelected
                  ? 'bg-cyan-500/25 border-cyan-400 text-white ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{el.atomicNumber}</span>
                <span>Gr.{el.group}</span>
              </div>
              <div className="text-xl font-bold font-mono text-cyan-300 my-0.5">
                {el.symbol}
              </div>
              <div className="text-[11px] font-medium text-slate-200 truncate w-full">
                {el.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailanzeige des ausgewählten Elements */}
      {selectedElement && (
        <div className="p-4 rounded-xl lab-card border border-cyan-500/30 flex items-center justify-between gap-4 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                #{selectedElement.atomicNumber}
              </span>
              <span className="font-bold text-white text-base">
                {selectedElement.name} ({selectedElement.symbol})
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Masse: {selectedElement.atomicMass} u
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {selectedElement.description}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Auswahl einloggen</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
