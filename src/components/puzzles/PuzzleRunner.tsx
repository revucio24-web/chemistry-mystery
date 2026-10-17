import React, { useState } from 'react';
import { Puzzle, ValidationFeedback } from '../../types/puzzles';
import { PlayerProfile, Badge, ElementCard } from '../../types/game';
import { evaluatePuzzleResult } from '../../engine/learningEngine';
import { savePlayerProfile } from '../../engine/storage';
import { soundEngine } from '../../engine/audio';

import { ElementMatch } from './ElementMatch';
import { MoleculeBuilder } from './MoleculeBuilder';
import { LabDoorCipher } from './LabDoorCipher';
import { EquationBalancer } from './EquationBalancer';
import { SubstanceAnalysis } from './SubstanceAnalysis';
import { PeriodicTableQuiz } from './PeriodicTableQuiz';
import { MysteryDetective } from './MysteryDetective';
import { TrueFalseLab } from './TrueFalseLab';
import { FeedbackModal } from '../common/FeedbackModal';
import { PeriodicTableModal } from '../common/PeriodicTableModal';
import { KidsEncyclopediaModal } from '../common/KidsEncyclopediaModal';
import { getSparkyTip } from '../../engine/kidExplanations';

import { ArrowLeft, Lightbulb, Sparkles, BookOpen, Atom } from 'lucide-react';

interface PuzzleRunnerProps {
  puzzle: Puzzle;
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onBackToMissions: () => void;
  onNextPuzzle?: () => void;
}

export const PuzzleRunner: React.FC<PuzzleRunnerProps> = ({
  puzzle,
  profile,
  onUpdateProfile,
  onBackToMissions,
  onNextPuzzle
}) => {
  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showHintBanner, setShowHintBanner] = useState(false);
  const [isPseModalOpen, setIsPseModalOpen] = useState(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [newCards, setNewCards] = useState<ElementCard[]>([]);
  const [earnedStars, setEarnedStars] = useState<number>(3);

  const sparkyTip = getSparkyTip(puzzle);

  const handleValidation = (result: ValidationFeedback) => {
    setFeedback(result);
    setShowFeedbackModal(true);

    const isFirstTry = result.attemptsCount === 1;
    const hintsUsed = showHintBanner ? 1 : 0;
    const evaluation = evaluatePuzzleResult(
      profile,
      puzzle,
      result.isCorrect,
      isFirstTry,
      result.attemptsCount || 1,
      hintsUsed
    );
    
    setEarnedStars(evaluation.starsEarned || 1);
    setNewBadges(evaluation.newBadges);
    setNewCards(evaluation.newCards);

    // Spielstand persistieren
    savePlayerProfile(evaluation.updatedProfile);
    onUpdateProfile(evaluation.updatedProfile);

    if (result.isCorrect) {
      if (evaluation.updatedProfile.stats.currentStreak > 1) {
        soundEngine.playCombo(evaluation.updatedProfile.stats.currentStreak);
      } else {
        soundEngine.playSuccess();
      }
      soundEngine.playStarEarned((evaluation.starsEarned || 3) as 1 | 2 | 3);
      soundEngine.triggerHaptic('success');
    } else {
      soundEngine.triggerHaptic('medium');
    }

    if (evaluation.leveledUp) {
      setTimeout(() => {
        soundEngine.playLevelUp();
      }, 400);
    }
  };

  const handleRetry = () => {
    setShowFeedbackModal(false);
  };

  const renderPuzzleInterface = () => {
    switch (puzzle.type) {
      case 'element_match':
        return <ElementMatch puzzle={puzzle} onValidate={handleValidation} />;
      case 'molecule_builder':
        return <MoleculeBuilder puzzle={puzzle} onValidate={handleValidation} />;
      case 'lab_door_cipher':
        return <LabDoorCipher puzzle={puzzle} onValidate={handleValidation} />;
      case 'equation_balancer':
        return <EquationBalancer puzzle={puzzle} onValidate={handleValidation} />;
      case 'substance_analysis':
        return <SubstanceAnalysis puzzle={puzzle} onValidate={handleValidation} />;
      case 'periodic_table_quiz':
        return <PeriodicTableQuiz puzzle={puzzle} onValidate={handleValidation} />;
      case 'mystery_detective':
        return <MysteryDetective puzzle={puzzle} onValidate={handleValidation} />;
      case 'true_false':
        return <TrueFalseLab puzzle={puzzle} onValidate={handleValidation} />;
      default:
        return <div>Rätseltyp wird vorbereitet...</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Aufgabenstellung */}
      <div className="p-6 rounded-2xl lab-card border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onBackToMissions();
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück zur Missionsliste</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              Mission #{puzzle.missionNumber}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{puzzle.xpReward} XP</span>
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {puzzle.title}
        </h2>

        {/* Story & Labor-Kontext */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
          {puzzle.loreContext}
        </p>

        {/* Die zentrale Aufgabenstellung */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/60 text-cyan-100 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base font-semibold">
              {puzzle.question}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setIsEncyclopediaOpen(true);
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-1.5 cursor-pointer"
              title="Sparkys Forscherlexikon öffnen"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lexikon</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setIsPseModalOpen(true);
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 flex items-center gap-1.5 cursor-pointer"
              title="Periodensystem der Elemente (PSE) aufschlagen"
            >
              <Atom className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PSE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setShowHintBanner(prev => !prev);
              }}
              className="text-xs text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/40 flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Labor-Hinweis aufrufen"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tipp</span>
            </button>
          </div>
        </div>

        {/* 🐱 Sparkys kinderleichte Erklärung & Merkhilfe */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 shadow-sm flex flex-col sm:flex-row items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0 shadow">
            🐱
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">{sparkyTip.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">Kinderleicht</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {sparkyTip.simpleExplanation}
            </p>
            <div className="mt-2 text-xs text-amber-200/90 flex items-start gap-1.5 bg-amber-950/30 p-2 rounded-xl border border-amber-800/40">
              <span className="shrink-0 font-semibold text-amber-300">🧩 Merkhilfe:</span>
              <span>{sparkyTip.kidAnalogy}</span>
            </div>
          </div>
        </div>

        {/* Ausklappbarer wissenschaftlicher Hinweis */}
        {showHintBanner && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs sm:text-sm leading-relaxed animate-in fade-in flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5 text-amber-300">Wissenschaftlicher Tipp:</span>
              {puzzle.hint}
            </div>
          </div>
        )}
      </div>

      {/* Die interaktive Rätsel-Komponente */}
      <div className="p-6 rounded-2xl lab-card border border-slate-800">
        {renderPuzzleInterface()}
      </div>

      {/* Didaktisches Feedback-Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        feedback={feedback}
        detailedHint={puzzle.detailedHint}
        newBadges={newBadges}
        newCards={newCards}
        earnedStars={earnedStars}
        onNext={onNextPuzzle}
        onRetry={handleRetry}
        onClose={() => setShowFeedbackModal(false)}
      />

      {/* Globales Periodensystem Nachschlagewerk */}
      <PeriodicTableModal
        isOpen={isPseModalOpen}
        onClose={() => setIsPseModalOpen(false)}
      />

      {/* Sparkys Kinder-Forscherlexikon */}
      <KidsEncyclopediaModal
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
      />
    </div>
  );
};
