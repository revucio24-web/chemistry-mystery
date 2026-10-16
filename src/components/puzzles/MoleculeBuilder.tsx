import React, { useState } from 'react';
import { MoleculeBuilderPuzzle, ValidationFeedback } from '../../types/puzzles';
import { verifyMoleculeComposition } from '../../engine/chemistryEngine';
import { soundEngine } from '../../engine/audio';
import { Plus, Minus, Atom, Sparkles } from 'lucide-react';

interface MoleculeBuilderProps {
  puzzle: MoleculeBuilderPuzzle;
  onValidate: (feedback: ValidationFeedback) => void;
}

export const MoleculeBuilder: React.FC<MoleculeBuilderProps> = ({ puzzle, onValidate }) => {
  const [selectedAtoms, setSelectedAtoms] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState(0);

  const target = puzzle.targetMolecule;

  const handleAddAtom = (symbol: string) => {
    soundEngine.playBubble();
    setSelectedAtoms(prev => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + 1
    }));
  };

  const handleRemoveAtom = (symbol: string) => {
    soundEngine.playClick();
    setSelectedAtoms(prev => {
      const next = { ...prev };
      const current = next[symbol] || 0;
      if (current <= 1) {
        delete next[symbol];
      } else {
        next[symbol] = current - 1;
      }
      return next;
    });
  };

  const handleReset = () => {
    soundEngine.playClick();
    setSelectedAtoms({});
  };

  const handleSynthesize = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const check = verifyMoleculeComposition(selectedAtoms, target.requiredAtoms);

    if (check.isComplete) {
      soundEngine.playSuccess();
      onValidate({
        isCorrect: true,
        message: `Molekül-Synthese erfolgreich! Du hast ein stabiles ${target.name} (${target.formula}) erschaffen.`,
        scientificExplanation: puzzle.didacticExplanation,
        realWorldExample: puzzle.realWorldExample,
        attemptsCount: newAttempts
      });
    } else {
      soundEngine.playHintNotice();
      let msg = 'Die Atombilanz des Moleküls ist noch unausgeglichen: ';
      const details: string[] = [];
      Object.entries(check.missing).forEach(([sym, count]) => {
        details.push(`Es fehlen noch ${count} Atom(e) von ${sym}`);
      });
      Object.entries(check.surplus).forEach(([sym, count]) => {
        details.push(`Du hast ${count} Atom(e) von ${sym} zu viel hinzugefügt`);
      });
      msg += details.join(', ') + '.';

      onValidate({
        isCorrect: false,
        message: msg,
        scientificExplanation: puzzle.commonMistakeExplanation,
        hint: puzzle.hint,
        attemptsCount: newAttempts
      });
    }
  };

  const totalAtomsSelected = Object.values(selectedAtoms).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Zielmolekül-Anzeige */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-2xl text-emerald-300 font-mono shrink-0 shadow-lg shadow-emerald-950">
            {target.formula}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{target.name}</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {target.commonName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {target.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
          <Atom className="w-4 h-4 text-cyan-400" />
          <span>Benötigt: {Object.entries(target.requiredAtoms).map(([sym, c]) => `${c}× ${sym}`).join(', ')}</span>
        </div>
      </div>

      {/* Reaktionskammer (Visualisierung der zusammengebauten Atome) */}
      <div className="relative min-h-[220px] rounded-2xl border-2 border-dashed border-cyan-500/30 bg-slate-950/80 p-6 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-lab-grid opacity-30 pointer-events-none" />
        
        {totalAtomsSelected === 0 ? (
          <div className="text-center text-slate-500 z-10 py-8">
            <Atom className="w-12 h-12 mx-auto mb-2 opacity-40 text-cyan-400 animate-pulse" />
            <p className="text-sm">Die Reaktionskammer ist leer.</p>
            <p className="text-xs text-slate-600 mt-1">Füge unten Atome aus dem Vorratsbehälter hinzu.</p>
          </div>
        ) : (
          <div className="z-10 flex flex-wrap items-center justify-center gap-4 p-4">
            {Object.entries(selectedAtoms).map(([symbol, count]) => {
              const atomConfig = puzzle.availableAtomPool.find(a => a.symbol === symbol);
              return Array.from({ length: count }).map((_, i) => (
                <div
                  key={`${symbol}-${i}`}
                  className="flex flex-col items-center animate-in zoom-in-75 duration-200"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-xl text-white shadow-xl relative border-2"
                    style={{
                      backgroundColor: atomConfig?.color || '#38bdf8',
                      borderColor: 'rgba(255,255,255,0.4)',
                      boxShadow: `0 0 20px ${atomConfig?.color || '#38bdf8'}40`
                    }}
                  >
                    <span>{symbol}</span>
                    <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900 text-slate-200 border border-slate-700">
                      V:{atomConfig?.valency || 1}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-1">
                    Atom #{i + 1}
                  </span>
                </div>
              ));
            })}
          </div>
        )}

        {totalAtomsSelected > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute bottom-3 right-3 text-xs text-slate-400 hover:text-slate-200 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 z-10 cursor-pointer"
          >
            Kammer leeren
          </button>
        )}
      </div>

      {/* Atom-Vorratsbehälter */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Verfügbare Elemente im Spender</span>
          <span className="text-cyan-400 font-mono text-xs">{totalAtomsSelected} Atome in der Kammer</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {puzzle.availableAtomPool.map(atom => {
            const currentCount = selectedAtoms[atom.symbol] || 0;
            return (
              <div
                key={atom.symbol}
                className="p-4 rounded-xl lab-card border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-white text-sm border shadow"
                    style={{ backgroundColor: atom.color, borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    {atom.symbol}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{atom.symbol}</div>
                    <div className="text-xs text-slate-400">Valenz: {atom.valency}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleRemoveAtom(atom.symbol)}
                    disabled={currentCount === 0}
                    className="w-7 h-7 rounded flex items-center justify-center text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs font-bold text-cyan-300 w-6 text-center">
                    {currentCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddAtom(atom.symbol)}
                    className="w-7 h-7 rounded flex items-center justify-center text-cyan-300 hover:bg-cyan-950/50 hover:text-cyan-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthese auslösen Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSynthesize}
          disabled={totalAtomsSelected === 0}
          className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            totalAtomsSelected > 0
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Molekül synthetisieren</span>
        </button>
      </div>
    </div>
  );
};
