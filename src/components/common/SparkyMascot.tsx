import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../engine/audio';
import { X, Lightbulb, Smile, BookOpen } from 'lucide-react';
import { PlayerProfile } from '../../types/game';

interface SparkyMascotProps {
  profile: PlayerProfile;
  currentRoomId?: string;
  onOpenPse?: () => void;
  onOpenEncyclopedia?: () => void;
}

const SPARKY_TIPS = [
  'Wusstest du? Wasser (H₂O) dehnt sich beim Gefrieren aus – deshalb schwimmt Eis auf dem Wasser!',
  'Gold (Au) rostet niemals, weil es ein extrem edles und reaktionsträges Metall ist.',
  'Helium (He) ist so leicht, dass es sogar der Schwerkraft der Erde entweichen kann!',
  'Kohlenstoff (C) kann weich wie Graphit im Bleistift oder ultrahart wie ein Diamant sein.',
  'Atome bestehen zu über 99,9999999 % aus leerem Raum – unglaublich, oder?',
  'Natrium (Na) brennt heftig auf Wasser, aber zusammen mit giftigem Chlor (Cl) ergibt es leckeres Speisesalz (NaCl)!',
  'Eisen (Fe) färbt unser Blut rot, weil es im Hämoglobin den Sauerstoff transportiert.',
  'Wenn du bei einem Rätsel festhängst: Öffne das Periodensystem und zähle die Außenelektronen!'
];

const SPARKY_JOKES = [
  'Warum sind Edelgase so schlechte Gesprächspartner? Weil sie auf gar nichts reagieren! 😂',
  'Was macht ein Chemiker, wenn er friert? Er setzt sich in die Ecke – da sind immer 90 Grad! 🌡️',
  'Ein Proton und ein Elektron gehen spazieren. Sagt das Proton: "Ich habe mein Elektron verloren!" Sagt das andere: "Bist du dir positiv sicher?" ⚡',
  'Sauerstoff ging mit Kalium aus. Es war voll OK! 💨'
];

export const SparkyMascot: React.FC<SparkyMascotProps> = ({
  profile,
  currentRoomId,
  onOpenPse,
  onOpenEncyclopedia
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [mode, setMode] = useState<'tip' | 'joke'>('tip');
  const [mood, setMood] = useState<'happy' | 'curious' | 'celebrate' | 'thinking'>('happy');
  const [hasNewTip, setHasNewTip] = useState(true);

  // Reagiere auf Siegesserien
  useEffect(() => {
    if (profile.stats.currentStreak >= 3) {
      setMood('celebrate');
    } else {
      setMood('happy');
    }
  }, [profile.stats.currentStreak]);

  const handleToggle = () => {
    if (!isOpen) {
      soundEngine.playSparkyChirp('curious');
      soundEngine.triggerHaptic('light');
      setHasNewTip(false);
    } else {
      soundEngine.playClick();
    }
    setIsOpen(!isOpen);
  };

  const handleNextTip = () => {
    soundEngine.playSparkyChirp('thinking');
    soundEngine.triggerHaptic('light');
    setMode('tip');
    setTipIndex((prev) => (prev + 1) % SPARKY_TIPS.length);
  };

  const handleJoke = () => {
    soundEngine.playSparkyChirp('celebrate');
    soundEngine.triggerHaptic('medium');
    setMode('joke');
    setTipIndex((prev) => (prev + 1) % SPARKY_JOKES.length);
  };

  const currentText = mode === 'tip' 
    ? (currentRoomId === 'atom-bau' && tipIndex === 0
        ? 'Labor-Tipp: Protonen (+) und Elektronen (-) halten das Atom im Gleichgewicht!'
        : currentRoomId === 'periodensystem' && tipIndex === 0
        ? 'Labor-Tipp: Die Periode (Zeile) verrät die Schalen, die Hauptgruppe die Außenelektronen!'
        : SPARKY_TIPS[tipIndex])
    : SPARKY_JOKES[tipIndex];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
      {/* Ausklappbare Sprechblase */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-84 p-4 rounded-3xl lab-card border-2 border-cyan-400/50 shadow-2xl backdrop-blur-xl pointer-events-auto animate-in zoom-in-95 duration-200 relative">
          {/* Schließen Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Sparky Kopfzeile */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-xl">🐱⚡</span>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>Chemikus Sparky</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Labor-Assistent
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {mode === 'tip' ? 'Wissenschaftlicher Forscher-Tipp' : 'Wissenschafts-Humor'}
              </p>
            </div>
          </div>

          {/* Text-Inhalt */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-cyan-100 leading-relaxed min-h-[64px] flex items-center">
            {currentText}
          </div>

          {/* Aktionsleiste */}
          <div className="flex items-center justify-between gap-1.5 mt-3 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleNextTip}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 text-cyan-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tipp</span>
            </button>

            <button
              type="button"
              onClick={handleJoke}
              className="px-2.5 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800 text-amber-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span>Witz</span>
            </button>

            {onOpenPse && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenPse();
                }}
                className="px-2 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800 text-purple-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>PSE</span>
              </button>
            )}

            {onOpenEncyclopedia && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenEncyclopedia();
                }}
                className="px-2 py-1.5 rounded-xl bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800 text-blue-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Lexikon</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Runder Maskottchen-Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="pointer-events-auto relative group cursor-pointer focus:outline-none transition-transform active:scale-95"
        title="Sprich mit Chemikus Sparky für Tipps und Chemie-Witze!"
      >
        {/* Äußerer Glüh-Effekt */}
        <div className={`absolute -inset-1 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse ${
          mood === 'celebrate'
            ? 'bg-gradient-to-r from-amber-400 to-purple-600'
            : 'bg-gradient-to-r from-cyan-400 to-blue-600'
        }`} />

        <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-xl flex items-center justify-center text-2xl sm:text-3xl select-none group-hover:scale-105 transition-transform">
          <span>🐱</span>

          {/* Spark-Blitz */}
          <span className="absolute -top-1 -right-1 text-xs animate-bounce">
            ⚡
          </span>

          {/* Benachrichtigungs-Punkt */}
          {hasNewTip && !isOpen && (
            <span className="absolute top-0 left-0 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-950 animate-ping" />
          )}
        </div>
      </button>
    </div>
  );
};
