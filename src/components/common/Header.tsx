import React from 'react';
import { PlayerProfile } from '../../types/game';
import { DIFFICULTY_LABELS } from '../../types/puzzles';
import { 
  FlaskConical, 
  Volume2, 
  VolumeX, 
  Gauge, 
  Flame, 
  User, 
  Eye,
  EyeOff
} from 'lucide-react';

interface HeaderProps {
  profile: PlayerProfile;
  onOpenDifficulty: () => void;
  onOpenProfile: () => void;
  onToggleSound: () => void;
  onToggleReducedMotion: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenDifficulty,
  onOpenProfile,
  onToggleSound,
  onToggleReducedMotion,
  onNavigateHome
}) => {
  const currentDiff = DIFFICULTY_LABELS[profile.activeDifficulty];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo & Titel */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-all">
            <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-6 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-wider text-sm sm:text-base text-white">
                CHEMISTRY MYSTERY
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Lernspiel
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-cyan-400 font-mono tracking-tight hidden sm:block">
              Das Geheimnis der Elemente
            </p>
          </div>
        </div>

        {/* Spielerstatus: Level & XP Bar */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
              Lv.{profile.level}
            </div>
            <div className="hidden md:block">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 gap-4">
                <span>{profile.currentXP} XP</span>
                <span>noch {profile.xpToNextLevel} XP</span>
              </div>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(5, 100 - (profile.xpToNextLevel / 2)))}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Streak Zähler */}
          {profile.stats.currentStreak > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-mono font-bold">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span>{profile.stats.currentStreak}er Serie</span>
            </div>
          )}

          {/* Schwierigkeitsgrad-Button */}
          <button
            type="button"
            onClick={onOpenDifficulty}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition-all cursor-pointer"
            title="Schwierigkeitsgrad anpassen"
          >
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-medium">{currentDiff.name}</span>
          </button>

          {/* Barrierefreiheit & Sound Toggles */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                profile.settings.soundEnabled
                  ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={profile.settings.soundEnabled ? 'Ton stummschalten' : 'Ton aktivieren'}
            >
              {profile.settings.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onToggleReducedMotion}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                profile.settings.reducedMotion
                  ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={profile.settings.reducedMotion ? 'Volle Animationen einschalten' : 'Animationen reduzieren'}
            >
              {profile.settings.reducedMotion ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenProfile}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Forscher-Akte & Erfolge öffnen"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
