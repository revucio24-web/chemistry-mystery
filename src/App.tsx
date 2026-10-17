import React, { useState, useEffect } from 'react';
import { PlayerProfile } from './types/game';
import { LAB_ROOMS } from './types/lab';
import { ALL_PUZZLES, getPuzzlesForRoom } from './data/puzzles';
import { loadPlayerProfile, savePlayerProfile } from './engine/storage';
import { soundEngine } from './engine/audio';

import { Header } from './components/common/Header';
import { LabRoomOverview } from './components/lab/LabRoomOverview';
import { MissionList } from './components/lab/MissionList';
import { PuzzleRunner } from './components/puzzles/PuzzleRunner';
import { DifficultyModal } from './components/common/DifficultyModal';
import { ProfileModal } from './components/common/ProfileModal';
import { ElementCardAlbum } from './components/cards/ElementCardAlbum';
import { ReviewCenter } from './components/review/ReviewCenter';
import { LearningProgressView } from './components/progress/LearningProgressView';
import { PeriodicTableModal } from './components/common/PeriodicTableModal';
import { KidsEncyclopediaModal } from './components/common/KidsEncyclopediaModal';
import { RewardModal } from './components/common/RewardModal';

import { ChemistrySandbox } from './components/lab/ChemistrySandbox';
import { SparkyMascot } from './components/common/SparkyMascot';
import { LAB_THEMES, generateDailyQuests, getTodayDateString, advanceDailyQuest } from './engine/rewardEngine';

import { FlaskConical, Atom, Compass, Sparkles, Layers, RotateCcw, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [view, setView] = useState<'rooms' | 'missions' | 'puzzle' | 'cards' | 'review' | 'progress' | 'sandbox'>('rooms');
  const [activeRoomId, setActiveRoomId] = useState<string>('elemental_lab');
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);

  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPeriodicTableModalOpen, setIsPeriodicTableModalOpen] = useState(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  // Synchronisiere Audio- und Motion-Settings beim Laden
  useEffect(() => {
    soundEngine.setMuted(!profile.settings.soundEnabled);
    soundEngine.setVolume(profile.settings.soundVolume);

    if (profile.settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [profile.settings]);

  // Tagesaufträge initialisieren und bei Tageswechsel automatisch erneuern
  useEffect(() => {
    const syncQuests = () => {
      setProfile(prev => {
        const quests = generateDailyQuests(getTodayDateString(), prev.dailyQuests);
        if (!prev.dailyQuests || prev.dailyQuests.length === 0 || prev.dailyQuests[0]?.id !== quests[0]?.id) {
          const updated = { ...prev, dailyQuests: quests };
          savePlayerProfile(updated);
          return updated;
        }
        return prev;
      });
    };

    syncQuests();

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const timer = window.setTimeout(syncQuests, nextMidnight.getTime() - now.getTime());
    return () => window.clearTimeout(timer);
  }, []);

  const activeTheme = LAB_THEMES.find(t => t.id === profile.equippedTheme) || LAB_THEMES[0];

  const handleUpdateProfile = (newProfile: PlayerProfile) => {
    setProfile(newProfile);
    savePlayerProfile(newProfile);
  };

  const handleToggleSound = () => {
    const updated = !profile.settings.soundEnabled;
    soundEngine.setMuted(!updated);
    if (updated) {
      soundEngine.playClick();
    }
    const newProf = {
      ...profile,
      settings: { ...profile.settings, soundEnabled: updated }
    };
    handleUpdateProfile(newProf);
  };

  const handleToggleReducedMotion = () => {
    const updated = !profile.settings.reducedMotion;
    const newProf = {
      ...profile,
      settings: { ...profile.settings, reducedMotion: updated }
    };
    handleUpdateProfile(newProf);
  };

  const handleSelectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setView('missions');
  };

  const handleSelectPuzzle = (puzzleId: string) => {
    const puzzle = ALL_PUZZLES.find(p => p.id === puzzleId);
    if (puzzle) {
      setActiveRoomId(puzzle.room);
    }
    setActivePuzzleId(puzzleId);
    setView('puzzle');
  };

  const handleOpenPeriodicTable = () => {
    setIsPeriodicTableModalOpen(true);
    const updated = advanceDailyQuest(profile, 'quest_pse_');
    if (updated !== profile) {
      handleUpdateProfile(updated);
    }
  };

  const currentRoomPuzzles = getPuzzlesForRoom(activeRoomId);

  const handleNextPuzzle = () => {
    const currentIdx = currentRoomPuzzles.findIndex(p => p.id === activePuzzleId);
    if (currentIdx !== -1 && currentIdx < currentRoomPuzzles.length - 1) {
      setActivePuzzleId(currentRoomPuzzles[currentIdx + 1].id);
    } else {
      setView('missions');
    }
  };

  const currentRoom = LAB_ROOMS.find(r => r.id === activeRoomId) || LAB_ROOMS[0];
  const currentPuzzle = ALL_PUZZLES.find(p => p.id === activePuzzleId) || currentRoomPuzzles[0] || ALL_PUZZLES[0];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${activeTheme.bgClass} text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200 pb-16 md:pb-0`}>
      {/* Hintergrund-Gitter */}
      <div className="fixed inset-0 bg-lab-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <Header
        profile={profile}
        currentView={view}
        onChangeView={(newView) => setView(newView)}
        onOpenDifficulty={() => setIsDifficultyModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenPeriodicTable={handleOpenPeriodicTable}
        onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
        onOpenRewards={() => setIsRewardModalOpen(true)}
        onToggleSound={handleToggleSound}
        onToggleReducedMotion={handleToggleReducedMotion}
        onNavigateHome={() => setView('rooms')}
      />

      {/* Hauptinhalt */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 z-10">
        {/* Willkommens-Banner bei Erststart auf der Raumübersicht */}
        {view === 'rooms' && (
          <div className="mb-8 p-6 sm:p-8 rounded-3xl lab-card border border-cyan-500/30 relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interaktives Chemie-Abenteuer</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Chemistry Mystery: Das große Chemie-Abenteuer
              </h1>
              <p className="text-xs sm:text-sm text-amber-300 font-mono font-bold mt-1">
                by Tarek Zakaria
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Willkommen im virtuellen Labor! Löse experimentelle Missionen, synthetisiere Moleküle, balanciere Reaktionsgleichungen und knacke verschlüsselte Schleusen – mit wissenschaftlich fundierten Erklärungen statt bloßem Raten.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    handleSelectRoom('elemental_lab');
                  }}
                  className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Atom className="w-4 h-4" />
                  <span>Elementarlabor betreten</span>
                </button>

                <button
                  type="button"
                  onClick={() => setView('cards')}
                  className="px-5 py-3 rounded-xl font-medium text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Karten-Album ({profile.elementCards.length})</span>
                </button>

                {profile.failedPuzzlesToReview.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setView('review')}
                    className="px-5 py-3 rounded-xl font-medium text-xs sm:text-sm bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800 text-amber-300 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>{profile.failedPuzzlesToReview.length} Wiederholen</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    handleOpenPeriodicTable();
                  }}
                  className="px-5 py-3 rounded-xl font-medium text-xs sm:text-sm bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 text-cyan-300 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Atom className="w-4 h-4 text-cyan-400" />
                  <span>Periodensystem (PSE)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsEncyclopediaOpen(true);
                  }}
                  className="px-5 py-3 rounded-xl font-medium text-xs sm:text-sm bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-300 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span className="text-base">🐱</span>
                  <span>Sparkys Forscherlexikon</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsRewardModalOpen(true);
                  }}
                  className="px-5 py-3 rounded-xl font-medium text-xs sm:text-sm bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600/40 text-amber-300 flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Belohnungen (💎 {profile.rewards?.crystals || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDifficultyModalOpen(true)}
                  className="px-5 py-3 rounded-xl font-medium text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Schwierigkeit</span>
                </button>
              </div>
            </div>

            <div className="absolute right-4 -bottom-10 opacity-10 sm:opacity-20 pointer-events-none">
              <Atom className="w-72 h-72 text-cyan-400" />
            </div>
          </div>
        )}

        {/* View-Umschaltung */}
        {view === 'rooms' && (
          <LabRoomOverview
            profile={profile}
            onSelectRoom={handleSelectRoom}
          />
        )}

        {view === 'missions' && (
          <MissionList
            room={currentRoom}
            puzzles={currentRoomPuzzles}
            profile={profile}
            onSelectPuzzle={handleSelectPuzzle}
            onBackToOverview={() => setView('rooms')}
          />
        )}

        {view === 'puzzle' && (
          <PuzzleRunner
            key={currentPuzzle.id}
            puzzle={currentPuzzle}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onBackToMissions={() => setView('missions')}
            onNextPuzzle={handleNextPuzzle}
          />
        )}

        {view === 'cards' && (
          <ElementCardAlbum
            collectedCards={profile.elementCards}
            onClose={() => setView('rooms')}
          />
        )}

        {view === 'review' && (
          <ReviewCenter
            profile={profile}
            onSelectPuzzle={handleSelectPuzzle}
            onBackToMissions={() => setView('missions')}
          />
        )}

        {view === 'progress' && (
          <LearningProgressView
            profile={profile}
          />
        )}

        {view === 'sandbox' && (
          <ChemistrySandbox
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onBackToRooms={() => setView('rooms')}
          />
        )}
      </main>

      {/* Sparky Interaktiver Labor-Begleiter */}
      <SparkyMascot
        profile={profile}
        currentRoomId={activeRoomId}
        onOpenPse={handleOpenPeriodicTable}
        onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar (für Touch, Handys & Tablets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-cyan-500/20 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around text-[10px]">
        <button
          type="button"
          onClick={() => { soundEngine.playClick(); setView('rooms'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition cursor-pointer ${
            view === 'rooms' || view === 'missions' || view === 'puzzle' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Labore</span>
        </button>

        <button
          type="button"
          onClick={() => { soundEngine.playClick(); setView('cards'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition cursor-pointer relative ${
            view === 'cards' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Karten</span>
          {profile.elementCards.length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-cyan-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => { soundEngine.playClick(); setView('review'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition cursor-pointer relative ${
            view === 'review' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Wiederholen</span>
          {profile.failedPuzzlesToReview.length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => { soundEngine.playClick(); setView('progress'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition cursor-pointer ${
            view === 'progress' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Module</span>
        </button>

        <button
          type="button"
          onClick={() => { soundEngine.playClick(); setView('sandbox'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition cursor-pointer ${
            view === 'sandbox' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Sandbox</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 px-4 z-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <FlaskConical className="w-4 h-4 text-cyan-500" />
            <span>Chemistry Mystery – Das große Chemie-Abenteuer</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Didaktisch fundiert</span>
            <span>•</span>
            <span>100% Offline & Lokal</span>
            <span>•</span>
            <span>Keine Datenweitergabe</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DifficultyModal
        isOpen={isDifficultyModalOpen}
        activeDifficulty={profile.activeDifficulty}
        onSelectDifficulty={(level) => {
          const updated = { ...profile, activeDifficulty: level };
          handleUpdateProfile(updated);
        }}
        onClose={() => setIsDifficultyModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Globales Periodensystem Modal */}
      <PeriodicTableModal
        isOpen={isPeriodicTableModalOpen}
        onClose={() => setIsPeriodicTableModalOpen(false)}
      />

      {/* Sparkys Kinder-Forscherlexikon */}
      <KidsEncyclopediaModal
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
      />

      {/* Belohnungssystem & Täglicher Streak */}
      <RewardModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
};
