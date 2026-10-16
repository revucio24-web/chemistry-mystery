import React from 'react';
import { DifficultyLevel, DIFFICULTY_LABELS } from '../../types/puzzles';
import { soundEngine } from '../../engine/audio';
import { Gauge, Check, X, Compass, GraduationCap, Flame, Sparkles } from 'lucide-react';

interface DifficultyModalProps {
  isOpen: boolean;
  activeDifficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  onClose: () => void;
}

export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  isOpen,
  activeDifficulty,
  onSelectDifficulty,
  onClose
}) => {
  if (!isOpen) return null;

  const levels: DifficultyLevel[] = ['explorer', 'beginner', 'advanced', 'expert'];

  const icons: Record<DifficultyLevel, React.ReactNode> = {
    explorer: <Compass className="w-5 h-5 text-emerald-400" />,
    beginner: <GraduationCap className="w-5 h-5 text-cyan-400" />,
    advanced: <Flame className="w-5 h-5 text-amber-400" />,
    expert: <Sparkles className="w-5 h-5 text-purple-400" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg lab-card rounded-2xl p-6 border border-cyan-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Schwierigkeitsgrad anpassen</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Wähle dein bevorzugtes Spielniveau. Du kannst diese Einstellung im Labor jederzeit flexibel ändern, ohne deinen Fortschritt zu verlieren.
        </p>

        <div className="space-y-3">
          {levels.map(lvl => {
            const info = DIFFICULTY_LABELS[lvl];
            const isSelected = activeDifficulty === lvl;

            return (
              <div
                key={lvl}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectDifficulty(lvl);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 text-white ring-2 ring-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {icons[lvl]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{info.name}</span>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                          Aktiv
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      {info.desc}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-5 h-5 text-cyan-400 shrink-0 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
