import React, { useState } from 'react';
import { EquationBalancerPuzzle, ValidationFeedback } from '../../types/puzzles';
import { verifyEquationMassBalance } from '../../engine/chemistryEngine';
import { soundEngine } from '../../engine/audio';
import { Plus, Minus, Scale, Check, ArrowRight } from 'lucide-react';

interface EquationBalancerProps {
  puzzle: EquationBalancerPuzzle;
  onValidate: (feedback: ValidationFeedback) => void;
}

export const EquationBalancer: React.FC<EquationBalancerProps> = ({ puzzle, onValidate }) => {
  const rx = puzzle.reaction;

  const [reactantCoeffs, setReactantCoeffs] = useState<number[]>(() =>
    rx.reactants.map(() => 1)
  );
  const [productCoeffs, setProductCoeffs] = useState<number[]>(() =>
    rx.products.map(() => 1)
  );
  const [attempts, setAttempts] = useState(0);

  const handleAdjustReactant = (index: number, delta: number) => {
    soundEngine.playClick();
    setReactantCoeffs(prev => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(6, next[index] + delta));
      return next;
    });
  };

  const handleAdjustProduct = (index: number, delta: number) => {
    soundEngine.playClick();
    setProductCoeffs(prev => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(6, next[index] + delta));
      return next;
    });
  };

  // Berechne aktuelle Atombilanzen in Echtzeit
  const currentReactants = rx.reactants.map((r, i) => ({
    formula: r.formula,
    coefficient: reactantCoeffs[i]
  }));
  const currentProducts = rx.products.map((p, i) => ({
    formula: p.formula,
    coefficient: productCoeffs[i]
  }));

  const balanceCheck = verifyEquationMassBalance(currentReactants, currentProducts);

  const handleCheckEquation = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (balanceCheck.isBalanced) {
      soundEngine.playSuccess();
      onValidate({
        isCorrect: true,
        message: 'Reaktionsgleichung meisterhaft ausgeglichen! Gesetz der Massenerhaltung erfüllt.',
        scientificExplanation: puzzle.didacticExplanation,
        realWorldExample: puzzle.realWorldExample,
        attemptsCount: newAttempts
      });
    } else {
      soundEngine.playHintNotice();
      onValidate({
        isCorrect: false,
        message: `Die Atombilanz stimmt noch nicht: ${balanceCheck.discrepancies.join('; ')}.`,
        scientificExplanation: puzzle.commonMistakeExplanation,
        hint: puzzle.hint,
        attemptsCount: newAttempts
      });
    }
  };

  const allElements = Array.from(
    new Set([...Object.keys(balanceCheck.reactantCounts), ...Object.keys(balanceCheck.productCounts)])
  );

  return (
    <div className="space-y-6">
      {/* Reaktionsbeschreibung */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300">
        <div className="text-white font-semibold mb-1 flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>{rx.title}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {rx.description}
        </p>
      </div>

      {/* Reaktionsgleichung mit Koeffizienten-Reglern */}
      <div className="p-6 rounded-2xl lab-card border border-cyan-500/20 overflow-x-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 min-w-[320px]">
          {/* Edukte (Reactants) */}
          {rx.reactants.map((reactant, idx) => (
            <React.Fragment key={`r-${idx}`}>
              {idx > 0 && <span className="text-slate-400 font-bold text-lg">+</span>}
              <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustReactant(idx, 1)}
                    disabled={reactantCoeffs[idx] >= 6}
                    className="w-7 h-6 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustReactant(idx, -1)}
                    disabled={reactantCoeffs[idx] <= 1}
                    className="w-7 h-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="w-7 text-center font-mono text-xl font-bold text-cyan-300">
                  {reactantCoeffs[idx]}
                </span>
                <span className="font-mono text-lg font-bold text-white px-1">
                  {reactant.formula}
                </span>
              </div>
            </React.Fragment>
          ))}

          {/* Reaktionspfeil */}
          <div className="px-3 flex items-center justify-center text-cyan-400">
            <ArrowRight className="w-7 h-7 stroke-[2.5]" />
          </div>

          {/* Produkte (Products) */}
          {rx.products.map((product, idx) => (
            <React.Fragment key={`p-${idx}`}>
              {idx > 0 && <span className="text-slate-400 font-bold text-lg">+</span>}
              <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustProduct(idx, 1)}
                    disabled={productCoeffs[idx] >= 6}
                    className="w-7 h-6 rounded bg-slate-900 hover:bg-slate-800 text-emerald-400 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustProduct(idx, -1)}
                    disabled={productCoeffs[idx] <= 1}
                    className="w-7 h-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="w-7 text-center font-mono text-xl font-bold text-emerald-300">
                  {productCoeffs[idx]}
                </span>
                <span className="font-mono text-lg font-bold text-white px-1">
                  {product.formula}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Live-Atombilanz (Echtzeit-Feedback für den Lernenden) */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Live-Atombilanz (Massenerhaltung)</span>
          <span className={balanceCheck.isBalanced ? 'text-emerald-400 text-xs' : 'text-amber-400 text-xs'}>
            {balanceCheck.isBalanced ? 'Perfekt im Gleichgewicht' : 'Noch unausgeglichen'}
          </span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {allElements.map(sym => {
            const left = balanceCheck.reactantCounts[sym] || 0;
            const right = balanceCheck.productCounts[sym] || 0;
            const isMatch = left === right;

            return (
              <div
                key={sym}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isMatch
                    ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300'
                    : 'bg-amber-950/20 border-amber-800/50 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                    {sym}
                  </span>
                  <span className="text-xs text-slate-400">Atom:</span>
                </div>
                <div className="font-mono text-xs font-bold flex items-center gap-1">
                  <span>{left}</span>
                  <span className="text-slate-500">↔</span>
                  <span>{right}</span>
                  {isMatch && <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Überprüfen Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleCheckEquation}
          className="px-8 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Scale className="w-4 h-4" />
          <span>Gleichung überprüfen</span>
        </button>
      </div>
    </div>
  );
};
