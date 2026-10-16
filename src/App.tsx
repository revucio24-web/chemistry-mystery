import React, { useState, useEffect } from 'react';
import { PlayerProfile } from './types/game';
import { LAB_ROOMS } from './types/lab';
import { ELEMENTAL_LAB_PUZZLES } from './data/puzzles';
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

import { FlaskConical, Atom, Compass, Sparkles, Layers, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [view, setView] = useState<'rooms' | 'missions' | 'puzzle' | 'cards' | 'review' | 'progress'>('rooms');
  const [activeRoomId, setActiveRoomId] = useState<string>('elemental_lab');
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);

  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
    setActivePuzzleId(puzzleId);
    setView('puzzle');
  };

  const handleNextPuzzle = () => {
    const currentIdx = ELEMENTAL_LAB_PUZZLES.findIndex(p => p.id === activePuzzleId);
    if (currentIdx !== -1 && currentIdx < ELEMENTAL_LAB_PUZZLES.length - 1) {
      setActivePuzzleId(ELEMENTAL_LAB_PUZZLES[currentIdx + 1].id);
    } else {
      setView('missions');
    }
  };

  const currentRoom = LAB_ROOMS.find(r => r.id === activeRoomId) || LAB_ROOMS[0];
  const currentPuzzle = ELEMENTAL_LAB_PUZZLES.find(p => p.id === activePuzzleId) || ELEMENTAL_LAB_PUZZLES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hintergrund-Gitter */}
      <div className="fixed inset-0 bg-lab-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <Header
        profile={profile}
        currentView={view}
        onChangeView={(newView) => setView(newView)}
        onOpenDifficulty={() => setIsDifficultyModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
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
                <span>Interaktives Chemie-Rätsellabor</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Entdecke die Geheimnisse der chemischen Elemente
              </h1>
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
                    <RotateCcw className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    <span>{profile.failedPuzzlesToReview.length} Wiederholen</span>
                  </button>
                )}

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
              <Atom className="w-72 h-72 text-cyan-400 animate-spin-slow" />
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
            puzzles={ELEMENTAL_LAB_PUZZLES}
            profile={profile}
            onSelectPuzzle={handleSelectPuzzle}
            onBackToOverview={() => setView('rooms')}
          />
        )}

        {view === 'puzzle' && (
          <PuzzleRunner
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
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 px-4 z-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <FlaskConical className="w-4 h-4 text-cyan-500" />
            <span>Chemistry Mystery – Das Geheimnis der Elemente</span>
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
    </div>
  );
};
