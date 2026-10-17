import React from 'react';
import { LabRoom } from '../../types/lab';
import { Puzzle, DIFFICULTY_LABELS } from '../../types/puzzles';
import { PlayerProfile } from '../../types/game';
import { soundEngine } from '../../engine/audio';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  RotateCcw,
  BookOpen,
  Atom
} from 'lucide-react';

interface MissionListProps {
  room: LabRoom;
  puzzles: Puzzle[];
  profile: PlayerProfile;
  onSelectPuzzle: (puzzleId: string) => void;
  onBackToOverview: () => void;
}

export const MissionList: React.FC<MissionListProps> = ({
  room,
  puzzles,
  profile,
  onSelectPuzzle,
  onBackToOverview
}) => {
  const getPuzzleTypeLabel = (type: string) => {
    switch (type) {
      case 'element_match': return 'Elemente zuordnen';
      case 'molecule_builder': return 'Molekülbaukasten';
      case 'lab_door_cipher': return 'Labor-Codeschloss';
      case 'equation_balancer': return 'Reaktionsgleichung';
      case 'substance_analysis': return 'Stoffanalyse';
      case 'periodic_table_quiz': return 'Periodensystem';
      case 'mystery_detective': return 'Chemie-Detektiv';
      case 'true_false': return 'Wahr oder Falsch?';
      default: return 'Chemie-Rätsel';
    }
  };

  const completedCount = puzzles.filter(p => profile.completedPuzzleIds.includes(p.id)).length;
  const roomStars = puzzles.reduce((acc, p) => acc + (profile.puzzleStars?.[p.id] || (profile.completedPuzzleIds.includes(p.id) ? 1 : 0)), 0);
  const maxRoomStars = puzzles.length * 3;

  return (
    <div className="space-y-6">
      {/* Zurück-Navigation & Raum-Banner */}
      <div className="p-6 rounded-2xl lab-card border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onBackToOverview();
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück zur Labor-Übersicht</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {room.name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              {completedCount} / {puzzles.length} gelöst
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/60 font-mono flex items-center gap-1 font-bold">
              <span className="text-amber-400">★</span>
              <span>{roomStars} / {maxRoomStars} Sterne</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {room.description}
          </p>

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>{room.learningFocus}</span>
          </div>
        </div>

        {/* Fortschritts-Ring / Prozent */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono">Raum-Fortschritt</div>
            <div className="text-2xl font-mono font-bold text-cyan-300 mt-0.5">
              {puzzles.length > 0 ? Math.round((completedCount / puzzles.length) * 100) : 0}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Atom className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Liste der 10 Missionen */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Verfügbare Forschungsmissionen</span>
          <span className="text-slate-500 font-mono">Schwierigkeit: {DIFFICULTY_LABELS[profile.activeDifficulty].name}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {puzzles.map((puzzle) => {
            const isCompleted = profile.completedPuzzleIds.includes(puzzle.id);
            const needsReview = profile.failedPuzzlesToReview.includes(puzzle.id);

            return (
              <div
                key={puzzle.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectPuzzle(puzzle.id);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    : needsReview
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                    : 'lab-card lab-card-hover border-cyan-500/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5 border ${
                    isCompleted
                      ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400'
                      : needsReview
                      ? 'bg-amber-950/60 border-amber-700/60 text-amber-400'
                      : 'bg-cyan-950 border-cyan-800 text-cyan-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : needsReview ? (
                      <RotateCcw className="w-4 h-4 text-amber-400" />
                    ) : (
                      `#${puzzle.missionNumber}`
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {getPuzzleTypeLabel(puzzle.type)}
                      </span>
                      {needsReview && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          Wiederholung
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                      {puzzle.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {puzzle.question}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {/* Sterne-Anzeige */}
                  {isCompleted && (
                    <div className="flex items-center gap-0.5 text-sm" title={`${profile.puzzleStars?.[puzzle.id] || 1} von 3 Sternen`}>
                      {[1, 2, 3].map(s => (
                        <span key={s} className={s <= (profile.puzzleStars?.[puzzle.id] || 1) ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]' : 'text-slate-700 opacity-30'}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="text-xs font-mono font-semibold text-cyan-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{puzzle.xpReward} XP</span>
                  </span>

                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-all">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
