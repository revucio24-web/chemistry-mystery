import React, { useState } from 'react';
import { SubstanceAnalysisPuzzle, ValidationFeedback } from '../../types/puzzles';
import { soundEngine } from '../../engine/audio';
import { FlaskConical, Flame, Zap, Droplets, ShieldCheck, Check } from 'lucide-react';

interface SubstanceAnalysisProps {
  puzzle: SubstanceAnalysisPuzzle;
  onValidate: (feedback: ValidationFeedback) => void;
}

export const SubstanceAnalysis: React.FC<SubstanceAnalysisProps> = ({ puzzle, onValidate }) => {
  const [completedTests, setCompletedTests] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [activeTestObservation, setActiveTestObservation] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const sample = puzzle.sample;

  const handleRunTest = (testId: string) => {
    soundEngine.playBubble();
    if (!completedTests.includes(testId)) {
      setCompletedTests(prev => [...prev, testId]);
    }
    const test = puzzle.testOptions.find(t => t.id === testId);
    if (test) {
      setActiveTestObservation(test.observation);
    }
  };

  const handleIdentify = () => {
    if (!selectedCandidate) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (selectedCandidate === sample.correctIdentity) {
      soundEngine.playSuccess();
      onValidate({
        isCorrect: true,
        message: `Exzellente analytische Diagnose! Die Probe wurde zweifelsfrei als ${sample.correctIdentity} identifiziert.`,
        scientificExplanation: puzzle.didacticExplanation,
        realWorldExample: puzzle.realWorldExample,
        attemptsCount: newAttempts
      });
    } else {
      soundEngine.playHintNotice();
      onValidate({
        isCorrect: false,
        message: `Nicht bestätigt: Die beobachteten Messwerte widersprechen "${selectedCandidate}".`,
        scientificExplanation: puzzle.commonMistakeExplanation,
        hint: puzzle.hint,
        attemptsCount: newAttempts
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Laborprobe Übersicht */}
      <div className="p-5 rounded-2xl lab-card border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <FlaskConical className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{sample.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Zustand: {sample.state === 'solid' ? 'Feststoff' : sample.state === 'liquid' ? 'Flüssigkeit' : 'Gas'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Aussehen: <span className="text-slate-200">{sample.appearance}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 px-3 py-2 rounded-xl border border-amber-800/50">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{sample.safeLabWarning}</span>
        </div>
      </div>

      {/* Virtuelle Labor-Teststationen */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Schritt 1: Analytische Labortests durchführen
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {puzzle.testOptions.map(test => {
            const isDone = completedTests.includes(test.id);

            return (
              <button
                key={test.id}
                type="button"
                onClick={() => handleRunTest(test.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isDone
                    ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {test.id === 'flame' && <Flame className="w-4 h-4 text-orange-400" />}
                      {test.id === 'conductivity' && <Zap className="w-4 h-4 text-yellow-400" />}
                      {test.id === 'ph' && <Droplets className="w-4 h-4 text-emerald-400" />}
                      {test.testName}
                    </span>
                    {isDone && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {test.safeProcedure}
                  </p>
                </div>

                <div className="text-xs font-medium text-cyan-400 flex items-center gap-1 pt-1 border-t border-slate-800/80">
                  <span>{isDone ? 'Erneut testen' : 'Test ausführen'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Aktuelle Beobachtung */}
        {activeTestObservation && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-100 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] shrink-0 pt-0.5">
              Laborbefund:
            </span>
            <p className="leading-relaxed">{activeTestObservation}</p>
          </div>
        )}
      </div>

      {/* Identifikations-Auswahl */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Schritt 2: Wissenschaftliche Schlussfolgerung ziehen
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {puzzle.candidateChoices.map(candidate => {
            const isSelected = selectedCandidate === candidate;

            return (
              <button
                key={candidate}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCandidate(candidate);
                }}
                className={`p-4 rounded-xl border text-left font-medium transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white ring-2 ring-cyan-500/30'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-sm font-semibold">{candidate}</span>
                {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bestätigen Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleIdentify}
          disabled={!selectedCandidate}
          className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            selectedCandidate
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Stoffidentität bestätigen</span>
        </button>
      </div>
    </div>
  );
};
