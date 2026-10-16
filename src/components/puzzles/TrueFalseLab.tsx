import React, { useState } from 'react';
import { TrueFalsePuzzle, ValidationFeedback } from '../../types/puzzles';
import { soundEngine } from '../../engine/audio';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TrueFalseLabProps {
  puzzle: TrueFalsePuzzle;
  onValidate: (feedback: ValidationFeedback) => void;
}

export const TrueFalseLab: React.FC<TrueFalseLabProps> = ({ puzzle, onValidate }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSelect = (choice: boolean) => {
    soundEngine.playClick();
    setSelectedAnswer(choice);
  };

  const handleVerify = () => {
    if (selectedAnswer === null) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (selectedAnswer === puzzle.isTrue) {
      soundEngine.playSuccess();
      onValidate({
        isCorrect: true,
        message: `Exakt richtig bewertet! Die Aussage ist tatsächlich ${puzzle.isTrue ? 'WAHR' : 'FALSCH'}.`,
        scientificExplanation: puzzle.didacticExplanation,
        realWorldExample: puzzle.realWorldExample,
        attemptsCount: newAttempts
      });
    } else {
      soundEngine.playHintNotice();
      onValidate({
        isCorrect: false,
        message: `Nicht ganz zutreffend: Wissenschaftlich gesehen ist diese Aussage ${puzzle.isTrue ? 'WAHR' : 'FALSCH'}.`,
        scientificExplanation: puzzle.commonMistakeExplanation,
        hint: puzzle.hint,
        attemptsCount: newAttempts
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Aussagen-Terminal */}
      <div className="p-6 rounded-2xl lab-card border border-cyan-500/30 text-center relative overflow-hidden">
        <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold mb-3">
          Wissenschaftlicher Aussagencheck
        </div>
        <blockquote className="text-lg sm:text-xl font-medium text-white max-w-2xl mx-auto leading-relaxed">
          „{puzzle.statement}“
        </blockquote>
      </div>

      {/* Auswahlbuttons: WAHR vs FALSCH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Button WAHR */}
        <button
          type="button"
          onClick={() => handleSelect(true)}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center gap-3 font-bold text-lg ${
            selectedAnswer === true
              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-slate-850'
          }`}
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <span>Diese Aussage ist WAHR</span>
        </button>

        {/* Button FALSCH */}
        <button
          type="button"
          onClick={() => handleSelect(false)}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center gap-3 font-bold text-lg ${
            selectedAnswer === false
              ? 'bg-red-500/25 border-red-400 text-red-300 ring-2 ring-red-500/40 shadow-lg shadow-red-500/20'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-red-500/40 hover:bg-slate-850'
          }`}
        >
          <XCircle className="w-6 h-6 text-red-400" />
          <span>Diese Aussage ist FALSCH</span>
        </button>
      </div>

      {/* Auswerten Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleVerify}
          disabled={selectedAnswer === null}
          className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            selectedAnswer !== null
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Antwort auswerten</span>
        </button>
      </div>
    </div>
  );
};
