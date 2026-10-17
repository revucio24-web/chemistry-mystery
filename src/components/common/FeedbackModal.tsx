import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, BookOpen, Lightbulb, ArrowRight, RotateCcw, Award, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ValidationFeedback } from '../../types/puzzles';
import { Badge, ElementCard } from '../../types/game';

interface FeedbackModalProps {
  isOpen: boolean;
  feedback: ValidationFeedback | null;
  detailedHint?: string;
  newBadges?: Badge[];
  newCards?: ElementCard[];
  earnedStars?: number;
  onNext?: () => void;
  onRetry: () => void;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  feedback,
  detailedHint,
  newBadges = [],
  newCards = [],
  earnedStars = 3,
  onNext,
  onRetry,
  onClose
}) => {
  const [showDetailedHint, setShowDetailedHint] = React.useState(false);

  useEffect(() => {
    if (isOpen && feedback?.isCorrect) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }
    setShowDetailedHint(false);
  }, [isOpen, feedback]);

  if (!isOpen || !feedback) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-xl rounded-2xl p-6 sm:p-8 lab-card border-2 shadow-2xl ${
          feedback.isCorrect 
            ? 'border-emerald-500/50 shadow-emerald-500/10' 
            : 'border-amber-500/50 shadow-amber-500/10'
        }`}
      >
        {/* Header-Icon & Titel */}
        <div className="flex items-center gap-4 mb-4">
          <div 
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              feedback.isCorrect 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              {feedback.isCorrect ? (
                <>
                  <span className="text-emerald-400 glow-emerald">Laborerfolg!</span>
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </>
              ) : (
                <span className="text-amber-400 glow-amber">Guter Versuch – Noch nicht ganz!</span>
              )}
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              {feedback.isCorrect 
                ? 'Wissenschaftliche Hypothese glänzend bestätigt.' 
                : 'In der Wissenschaft bringt uns jeder Fehlversuch der Wahrheit näher.'}
            </p>
          </div>
        </div>

        {/* 🐱 Chemikus Sparkys Kinderfreundlicher Zuspruch */}
        <div className={`p-3.5 rounded-2xl mb-4 border flex items-start gap-3 animate-in fade-in ${
          feedback.isCorrect
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow">
            🐱
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-90 mb-0.5">
              <span>Chemikus Sparkys Forscher-Funk</span>
              <span>•</span>
              <span className="text-[10px] font-mono">Für junge Entdecker</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {feedback.isCorrect
                ? '"Miau-tastisch kombiniert! Du hast die Naturgesetze der Chemie voll durchschaut!"'
                : '"Kopf hoch, kleiner Forscher! Auch die größten Nobelpreisträger haben hunderte Male experimentiert. Schau dir den Tipp an und probiere es gleich noch einmal!"'}
            </p>
          </div>
        </div>

        {/* 🌟 3-Sterne-Wertung */}
        {feedback.isCorrect && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between animate-in zoom-in-95">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(sIdx => {
                const isEarned = sIdx <= earnedStars;
                return (
                  <span
                    key={sIdx}
                    className={`text-2xl sm:text-3xl transition-all duration-300 ${
                      isEarned
                        ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)] scale-110'
                        : 'text-slate-700 opacity-40'
                    }`}
                  >
                    ★
                  </span>
                );
              })}
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block">
                {earnedStars === 3 ? '★★★ Perfekte Meister-Leistung!' : earnedStars === 2 ? '★★ Sehr gut!' : '★ Erfolgreich gelöst!'}
              </span>
              <span className="text-[10px] text-slate-400">
                {earnedStars === 3 ? 'Beim 1. Versuch ohne Hinweis gemeistert' : 'Aufgabe im Labor abgeschlossen'}
              </span>
            </div>
          </div>
        )}

        {/* Freigeschaltete Belohnungen (Badges & Elementkarten) */}
        {feedback.isCorrect && (newBadges.length > 0 || newCards.length > 0) && (
          <div className="mb-4 space-y-2">
            {newCards.map(card => (
              <div 
                key={card.atomicNumber}
                className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/50 flex items-center gap-3 animate-in zoom-in-95"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white shrink-0 shadow"
                  style={{ backgroundColor: card.colorHex || '#06b6d4' }}
                >
                  {card.symbol}
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Neue Elementkarte freigeschaltet!</span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    {card.name} (#{card.atomicNumber}) • {card.category}
                  </div>
                </div>
              </div>
            ))}

            {newBadges.map(badge => (
              <div 
                key={badge.id}
                className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/50 flex items-center gap-3 animate-in zoom-in-95"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Neues Abzeichen verdient!</span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    {badge.title} – {badge.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hauptnachricht */}
        <div className={`p-4 rounded-xl mb-4 text-sm sm:text-base border ${
          feedback.isCorrect 
            ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200' 
            : 'bg-amber-950/40 border-amber-800/40 text-amber-200'
        }`}>
          {feedback.message}
        </div>

        {/* Didaktischer Wissensblock (Warum ist das so?) */}
        <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Das chemische Prinzip dahinter</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {feedback.scientificExplanation}
            </p>
          </div>

          {/* Alltagsbeispiel */}
          {feedback.realWorldExample && (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Lightbulb className="w-4 h-4" />
                <span>Chemie im Alltag</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                {feedback.realWorldExample}
              </p>
            </div>
          )}

          {/* Detaillierter Schritt-für-Schritt-Tipp (bei Falsch) */}
          {!feedback.isCorrect && detailedHint && (
            <div className="pt-1">
              {!showDetailedHint ? (
                <button
                  type="button"
                  onClick={() => setShowDetailedHint(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 underline decoration-cyan-500/40 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Schritt-für-Schritt-Erklärung anzeigen</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-cyan-200 text-xs sm:text-sm leading-relaxed animate-in fade-in">
                  <span className="font-semibold block mb-1 text-cyan-300">💡 Wissenschaftlicher Leitfaden:</span>
                  {detailedHint}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Aktionsleiste */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-800">
          {!feedback.isCorrect ? (
            <button
              type="button"
              onClick={() => {
                onRetry();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-900/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Erneut versuchen</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNext) onNext();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30 transition-all"
            >
              <span>Nächste Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
