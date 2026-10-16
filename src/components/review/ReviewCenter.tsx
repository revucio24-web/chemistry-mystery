import React from 'react';
import { PlayerProfile } from '../../types/game';
import { ELEMENTAL_LAB_PUZZLES } from '../../data/puzzles';
import { soundEngine } from '../../engine/audio';
import { 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  ArrowRight
} from 'lucide-react';

interface ReviewCenterProps {
  profile: PlayerProfile;
  onSelectPuzzle: (puzzleId: string) => void;
  onBackToMissions: () => void;
}

export const ReviewCenter: React.FC<ReviewCenterProps> = ({
  profile,
  onSelectPuzzle,
  onBackToMissions
}) => {
  const reviewPuzzles = ELEMENTAL_LAB_PUZZLES.filter(p =>
    profile.failedPuzzlesToReview.includes(p.id)
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl lab-card border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
            <RotateCcw className="w-4 h-4" />
            <span>Adaptives Lernsystem</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>Wiederholungs-Labor (Spaced Repetition)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            In der Wissenschaft lernt man am meisten aus Fehlversuchen! Hier findest du alle Rätsel, bei denen du Hilfen oder mehrere Versuche gebraucht hast.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono">Zu wiederholen</div>
            <div className="text-2xl font-mono font-bold text-amber-400 mt-0.5">
              {reviewPuzzles.length} Rätsel
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <RotateCcw className="w-6 h-6 animate-spin-slow" />
          </div>
        </div>
      </div>

      {reviewPuzzles.length === 0 ? (
        <div className="p-12 text-center lab-card rounded-2xl border border-emerald-500/30">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Wissensspeicher vollständig intakt!</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            Großartig! Du hast derzeit keine offenen Fehlversuche in deiner Wiederholungsliste. Alle bearbeiteten chemischen Themen wurden verstanden.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onBackToMissions();
              }}
              className="px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Zurück zu den Missionen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Vorgemerkte chemische Rätsel zur Festigung
            </h3>
            <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+15 Extra-Wiederholungsbonus XP bei Erfolg</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reviewPuzzles.map((puzzle) => (
              <div
                key={puzzle.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectPuzzle(puzzle.id);
                }}
                className="p-4 rounded-xl lab-card lab-card-hover border border-amber-500/30 hover:border-amber-400 cursor-pointer flex items-center justify-between group transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-400 flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      Mission #{puzzle.missionNumber}
                    </span>

                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
                      {puzzle.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {puzzle.question}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{puzzle.xpReward + 15} XP
                  </span>

                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-300 group-hover:border-amber-500/40 transition-all">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
