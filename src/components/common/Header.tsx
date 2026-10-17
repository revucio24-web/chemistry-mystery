import React from 'react';
import { PlayerProfile } from '../../types/game';
import { DIFFICULTY_LABELS } from '../../types/puzzles';
import { calculateLevel } from '../../engine/learningEngine';
import { 
  FlaskConical, 
  Volume2, 
  VolumeX, 
  Gauge, 
  Flame, 
  User, 
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  BookOpen,
  LayoutGrid,
  Atom
} from 'lucide-react';

interface HeaderProps {
  profile: PlayerProfile;
  currentView: string;
  onChangeView: (view: 'rooms' | 'cards' | 'review' | 'progress' | 'sandbox') => void;
  onOpenDifficulty: () => void;
  onOpenProfile: () => void;
  onOpenPeriodicTable: () => void;
  onOpenEncyclopedia?: () => void;
  onOpenRewards?: () => void;
  onToggleSound: () => void;
  onToggleReducedMotion: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentView,
  onChangeView,
  onOpenDifficulty,
  onOpenProfile,
  onOpenPeriodicTable,
  onOpenEncyclopedia,
  onOpenRewards,
  onToggleSound,
  onToggleReducedMotion,
  onNavigateHome
}) => {
  const currentDiff = DIFFICULTY_LABELS[profile.activeDifficulty];
  const levelInfo = calculateLevel(profile.currentXP);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo & Titel */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-all">
            <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-6 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-wider text-xs sm:text-sm text-white whitespace-nowrap">
                CHEMISTRY MYSTERY
              </span>
              <span className="hidden 2xl:inline text-[11px] text-amber-300 font-mono font-bold whitespace-nowrap">
                by Tarek Zakaria
              </span>
              <span className="hidden 2xl:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Chemie-Lernspiel
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-cyan-400 font-mono tracking-tight hidden sm:block">
              Das große Chemie-Abenteuer
            </p>
          </div>
        </div>

        {/* Zentrale Hauptnavigation (Labor, Karten, Wiederholung, Module) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => onChangeView('rooms')}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'rooms' || currentView === 'missions' || currentView === 'puzzle'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Labore</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('cards')}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'cards'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Karten</span>
            {profile.elementCards.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {profile.elementCards.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onChangeView('review')}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'review'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Wiederholen</span>
            {profile.failedPuzzlesToReview.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                {profile.failedPuzzlesToReview.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onChangeView('progress')}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'progress'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lernmodule</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('sandbox')}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'sandbox'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <span>Freies Labor</span>
          </button>

          <button
            type="button"
            onClick={onOpenPeriodicTable}
            className="px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-800"
            title="Periodensystem der Elemente (PSE) aufschlagen"
          >
            <Atom className="w-3.5 h-3.5" />
            <span>PSE</span>
          </button>

          {onOpenEncyclopedia && (
            <button
              type="button"
              onClick={onOpenEncyclopedia}
              className="px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-transparent hover:border-emerald-800"
              title="Sparkys Forscherlexikon öffnen"
            >
              <span className="text-sm">🐱</span>
              <span>Lexikon</span>
            </button>
          )}
        </nav>

        {/* Spielerstatus: Level & XP Bar */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
              Lv.{profile.level}
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 gap-4">
                <span>{profile.currentXP} XP</span>
                <span>noch {profile.xpToNextLevel} XP</span>
              </div>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(3, levelInfo.progressPercent))}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Kristall-Konto & Belohnungs-Button */}
          {onOpenRewards && (
            <button
              type="button"
              onClick={onOpenRewards}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm group"
              title="Forscher-Belohnungen & täglicher Bonus"
            >
              <span className="text-sm group-hover:scale-125 transition-transform">💎</span>
              <span>{profile.rewards?.crystals || 0}</span>
              <span className="hidden xl:inline text-[10px] text-amber-200/70 ml-0.5">Bonus</span>
            </button>
          )}

          {/* Sterne-Zähler */}
          <div 
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono shadow-sm"
            title="Gesammelte Sterne aus allen Laborräumen"
          >
            <span className="text-amber-400 text-sm">★</span>
            <span>{Object.values(profile.puzzleStars || {}).reduce((a, b) => a + b, 0)}</span>
          </div>

          {/* Streak Zähler */}
          {profile.stats.currentStreak > 0 && (
            <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-mono font-bold">
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
