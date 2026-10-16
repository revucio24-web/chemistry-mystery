import React from 'react';
import { PlayerProfile } from '../../types/game';
import { ELEMENTAL_LAB_PUZZLES } from '../../data/puzzles';
import { calculateModulesProgress } from '../../engine/learningEngine';
import { 
  BookOpen, 
  CheckCircle2, 
  Atom, 
  Orbit, 
  Flame, 
  Droplets, 
  Share2, 
  Gem, 
  Leaf, 
  Sparkles,
  Award
} from 'lucide-react';

interface LearningProgressViewProps {
  profile: PlayerProfile;
}

export const LearningProgressView: React.FC<LearningProgressViewProps> = ({ profile }) => {
  const moduleProgress = calculateModulesProgress(profile, ELEMENTAL_LAB_PUZZLES);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom': return <Atom className="w-5 h-5" />;
      case 'Orbit': return <Orbit className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Droplets': return <Droplets className="w-5 h-5" />;
      case 'Share2': return <Share2 className="w-5 h-5" />;
      case 'Gem': return <Gem className="w-5 h-5" />;
      case 'Leaf': return <Leaf className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Übersicht Header */}
      <div className="p-6 rounded-2xl lab-card border border-cyan-500/30">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Curriculum & Didaktik</span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>Lernfortschritt nach Modulen</span>
          <Award className="w-5 h-5 text-cyan-400" />
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Chemistry Mystery gliedert sich in 7 wissenschaftliche Fachmodule. Hier siehst du, welche chemischen Gesetzmäßigkeiten du bereits verstanden hast und welche Themen als Nächstes vertieft werden.
        </p>
      </div>

      {/* Die 7 Module im Raster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moduleProgress.map(({ module, totalPuzzles, solvedPuzzles, progressPercent }) => {
          const isMastered = progressPercent === 100 && totalPuzzles > 0;

          return (
            <div
              key={module.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isMastered
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                  : solvedPuzzles > 0
                  ? 'lab-card border-cyan-500/30'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner"
                      style={{
                        backgroundColor: `${module.color}15`,
                        borderColor: `${module.color}40`,
                        color: module.color
                      }}
                    >
                      {getModuleIcon(module.iconName)}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase">
                        {module.code}
                      </span>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {module.title}
                      </h3>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {solvedPuzzles} / {totalPuzzles > 0 ? totalPuzzles : '1+'} gelöst
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {module.shortDesc}
                </p>

                {/* Fortschrittsbalken */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.max(5, progressPercent)}%` }}
                  />
                </div>

                {/* Themenliste */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                    Kerninhalte des Moduls:
                  </span>
                  {module.topics.map((topic, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-500/70 text-[10px] mt-0.5">•</span>
                      <span className="leading-tight">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isMastered && (
                <div className="mt-4 pt-3 border-t border-emerald-900/40 text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Modul im Elementarlabor gemeistert!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
