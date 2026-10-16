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
  onChangeView: (view: 'rooms' | 'cards' | 'review' | 'progress') => void;
  onOpenDifficulty: () => void;
  onOpenProfile: () => void;
  onOpenPeriodicTable: () => void;
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
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-all">
            <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-6 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-wider text-sm sm:text-base text-white">
                CHEMISTRY MYSTERY
              </span>
              <span className="hidden xl:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Lernspiel
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-cyan-400 font-mono tracking-tight hidden sm:block">
              Das Geheimnis der Elemente
            </p>
          </div>
        </div>

        {/* Zentrale Hauptnavigation (Labor, Karten, Wiederholung, Module) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => onChangeView('rooms')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
            onClick={onOpenPeriodicTable}
            className="px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-800"
            title="Periodensystem der Elemente (PSE) aufschlagen"
          >
            <Atom className="w-3.5 h-3.5" />
            <span>PSE</span>
          </button>
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
                    width: `${Math.min(100, Math.max(5, 100 - (profile.xpToNextLevel / 2)))}%`
                  }}
                />
              </div>
            </div>
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

      {/* Mobile Navigationsleiste (unten fixiert auf Smartphones) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-900 bg-slate-950/95 py-2 px-3 text-xs">
        <button
          type="button"
          onClick={() => onChangeView('rooms')}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'rooms' || currentView === 'missions' || currentView === 'puzzle'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[10px]">Labore</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeView('cards')}
          className={`flex flex-col items-center gap-0.5 relative ${
            currentView === 'cards' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">Karten</span>
          {profile.elementCards.length > 0 && (
            <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onChangeView('review')}
          className={`flex flex-col items-center gap-0.5 relative ${
            currentView === 'review' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span className="text-[10px]">Wiederholen</span>
          {profile.failedPuzzlesToReview.length > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onChangeView('progress')}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'progress' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px]">Module</span>
        </button>

        <button
          type="button"
          onClick={onOpenPeriodicTable}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-cyan-400 cursor-pointer"
        >
          <Atom className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px]">PSE</span>
        </button>
      </div>
    </header>
  );
};
