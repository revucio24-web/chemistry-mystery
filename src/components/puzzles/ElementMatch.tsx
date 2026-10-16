import React, { useState } from 'react';
import { ElementMatchPuzzle, ValidationFeedback } from '../../types/puzzles';
import { soundEngine } from '../../engine/audio';
import { Check, HelpCircle } from 'lucide-react';

interface ElementMatchProps {
  puzzle: ElementMatchPuzzle;
  onValidate: (feedback: ValidationFeedback) => void;
}

export const ElementMatch: React.FC<ElementMatchProps> = ({ puzzle, onValidate }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // symbol -> name
  const [attempts, setAttempts] = useState(0);

  // Mische die Namen für die rechte Spalte einmalig
  const [shuffledNames] = useState(() => {
    return [...puzzle.pairs.map(p => p.name)].sort(() => Math.random() - 0.5);
  });

  const handleSelectSymbol = (symbol: string) => {
    soundEngine.playClick();
    setSelectedSymbol(symbol);
  };

  const handleSelectName = (name: string) => {
    soundEngine.playClick();
    if (!selectedSymbol) return;

    setMatches(prev => ({
      ...prev,
      [selectedSymbol]: name
    }));
    setSelectedSymbol(null);
  };

  const handleRemoveMatch = (symbol: string) => {
    soundEngine.playClick();
    setMatches(prev => {
      const next = { ...prev };
      delete next[symbol];
      return next;
    });
  };

  const handleSubmit = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Prüfen, ob alle Symbole zugeordnet sind
    if (Object.keys(matches).length < puzzle.pairs.length) {
      soundEngine.playHintNotice();
      onValidate({
        isCorrect: false,
        message: 'Du hast noch nicht alle Elementsymbole zugeordnet.',
        scientificExplanation: 'Jedes chemische Element besitzt ein eindeutiges Symbol aus einem oder zwei Buchstaben.',
        hint: puzzle.hint,
        attemptsCount: newAttempts
      });
      return;
    }

    // Prüfe Richtigkeit
    const isAllCorrect = puzzle.pairs.every(p => matches[p.symbol] === p.name);

    if (isAllCorrect) {
      soundEngine.playSuccess();
      onValidate({
        isCorrect: true,
        message: 'Hervorragend! Alle Elementsymbole wurden exakt zugeordnet.',
        scientificExplanation: puzzle.didacticExplanation,
        realWorldExample: puzzle.realWorldExample,
        attemptsCount: newAttempts
      });
    } else {
      soundEngine.playHintNotice();
      onValidate({
        isCorrect: false,
        message: 'Einige Symbole stimmen noch nicht mit den Elementen überein.',
        scientificExplanation: puzzle.commonMistakeExplanation,
        hint: puzzle.hint,
        attemptsCount: newAttempts
      });
    }
  };

  const allAssigned = Object.keys(matches).length === puzzle.pairs.length;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-cyan-200 text-sm flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5 text-cyan-300">Labor-Instruktion:</span>
          Klicke zuerst links auf ein <strong className="text-white">Elementsymbol</strong> und anschließend rechts auf den passenden <strong className="text-white">Namen</strong>.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Linke Spalte: Symbole */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Elementsymbole</span>
            <span>{Object.keys(matches).length} von {puzzle.pairs.length} verknüpft</span>
          </h4>

          <div className="space-y-2.5">
            {puzzle.pairs.map(pair => {
              const isAssigned = !!matches[pair.symbol];
              const isCurrent = selectedSymbol === pair.symbol;

              return (
                <div
                  key={pair.symbol}
                  onClick={() => handleSelectSymbol(pair.symbol)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/30'
                      : isAssigned
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-100'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-lg bg-slate-950 border border-slate-700/80 font-mono text-lg font-bold flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                      {pair.symbol}
                    </span>
                    <div>
                      <div className="text-xs text-slate-400">{pair.clue}</div>
                      {isAssigned && (
                        <div className="text-xs font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{matches[pair.symbol]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isAssigned && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMatch(pair.symbol);
                      }}
                      className="text-xs text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800"
                      title="Zuordnung lösen"
                    >
                      Lösen
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rechte Spalte: Namen */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Elementnamen
          </h4>

          <div className="space-y-2.5">
            {shuffledNames.map(name => {
              const matchedSymbol = Object.entries(matches).find(([_, n]) => n === name)?.[0];

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleSelectName(name)}
                  disabled={!selectedSymbol && !matchedSymbol}
                  className={`w-full p-4 rounded-xl border text-left font-medium transition-all cursor-pointer flex items-center justify-between ${
                    matchedSymbol
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                      : selectedSymbol
                      ? 'border-cyan-500/50 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-100 hover:border-cyan-400'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-semibold">{name}</span>
                  {matchedSymbol && (
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
                      Symbol: {matchedSymbol}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAssigned}
          className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            allAssigned
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Zuordnung überprüfen</span>
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
