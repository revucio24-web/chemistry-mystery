import React, { useState } from 'react';
import { LabDoorCipherPuzzle, ValidationFeedback } from '../../types/puzzles';
import { soundEngine } from '../../engine/audio';
import { Lock, KeyRound, Delete, ShieldAlert } from 'lucide-react';

interface LabDoorCipherProps {
  puzzle: LabDoorCipherPuzzle;
  onValidate: (feedback: ValidationFeedback) => void;
}

export const LabDoorCipher: React.FC<LabDoorCipherProps> = ({ puzzle, onValidate }) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleKeyPress = (char: string) => {
    if (enteredCode.length >= 6) return;
    soundEngine.playClick();
    setEnteredCode(prev => prev + char);
  };

  const handleBackspace = () => {
    soundEngine.playClick();
    setEnteredCode(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    soundEngine.playClick();
    setEnteredCode('');
  };

  const handleUnlock = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (enteredCode === puzzle.requiredCode) {
      soundEngine.playSuccess();
      onValidate({
        isCorrect: true,
        message: `Sicherheitsriegel entriegelt! Code ${enteredCode} ist autorisiert.`,
        scientificExplanation: puzzle.didacticExplanation,
        realWorldExample: puzzle.realWorldExample,
        attemptsCount: newAttempts
      });
    } else {
      soundEngine.playHintNotice();
      onValidate({
        isCorrect: false,
        message: `Zugriff verweigert! Der eingegebene Code "${enteredCode || '---'}" entspricht nicht den atomaren Parametern.`,
        scientificExplanation: puzzle.commonMistakeExplanation,
        hint: puzzle.hint,
        attemptsCount: newAttempts
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Linke Seite: Labor-Notiz & Hinweise */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200">
            <div className="flex items-center gap-2 font-semibold text-amber-300 text-sm mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Verriegelung: {puzzle.doorName || 'Sicherheits-Schleuse'}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-amber-100/90">
              Der Professor hat das Notschloss mit einer dreistelligen atomaren Sequenz codiert. Analysiere die Hinweise, um die Ziffern zu entschlüsseln:
            </p>
          </div>

          <div className="space-y-2.5">
            {puzzle.cipherClues.map((clue, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 border border-cyan-800">
                  {idx + 1}
                </span>
                <span className="leading-snug pt-0.5">{clue}</span>
              </div>
            ))}
          </div>

          {puzzle.options && (
            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-2">Mögliche Verdachts-Codes:</span>
              <div className="flex flex-wrap gap-2">
                {puzzle.options.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setEnteredCode(opt);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/30 cursor-pointer"
                  >
                    Code {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rechte Seite: Sci-Fi Ziffernblock Terminal */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-xs lab-card p-5 rounded-2xl border border-cyan-500/30 shadow-2xl">
            {/* Terminal Display */}
            <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-cyan-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono text-slate-400 uppercase">Code:</span>
              </div>
              <div className="font-mono text-2xl font-bold tracking-widest text-cyan-300">
                {enteredCode.padEnd(3, '•')}
              </div>
            </div>

            {/* Zifferntasten */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="h-12 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 text-white font-mono font-bold text-lg transition-all active:scale-95 cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="h-12 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-12 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 text-white font-mono font-bold text-lg transition-all active:scale-95 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-12 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-red-400 flex items-center justify-center cursor-pointer"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Entriegeln Button */}
            <button
              type="button"
              onClick={handleUnlock}
              disabled={enteredCode.length === 0}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                enteredCode.length > 0
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Sicherheitscode prüfen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
