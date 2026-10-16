import React, { useState } from 'react';
import { MysteryDetectivePuzzle, ValidationFeedback } from '../../types/puzzles';
import { soundEngine } from '../../engine/audio';
import { Search, FileText, Check, Award } from 'lucide-react';

interface MysteryDetectiveProps {
  puzzle: MysteryDetectivePuzzle;
  onValidate: (feedback: ValidationFeedback) => void;
}

export const MysteryDetective: React.FC<MysteryDetectiveProps> = ({ puzzle, onValidate }) => {
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSelectHypothesis = (id: string) => {
    soundEngine.playClick();
    setSelectedHypothesisId(id);
  };

  const handleSolveCase = () => {
    if (!selectedHypothesisId) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const chosen = puzzle.hypotheses.find(h => h.id === selectedHypothesisId);
    if (!chosen) return;

    if (chosen.isCorrect) {
      soundEngine.playSuccess();
      onValidate({
        isCorrect: true,
        message: `Fallakte gelöst! ${chosen.scientificCritique}`,
        scientificExplanation: puzzle.didacticExplanation,
        realWorldExample: puzzle.realWorldExample,
        attemptsCount: newAttempts
      });
    } else {
      soundEngine.playHintNotice();
      onValidate({
        isCorrect: false,
        message: `Hypothese widerlegt: ${chosen.scientificCritique}`,
        scientificExplanation: puzzle.commonMistakeExplanation,
        hint: puzzle.hint,
        attemptsCount: newAttempts
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Aktenmappe / Fallbericht */}
      <div className="p-5 rounded-2xl lab-card border border-purple-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
              Chemie-Kriminalistik • Ermittlungsakte
            </span>
            <h3 className="text-lg font-bold text-white">{puzzle.caseTitle}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          {puzzle.caseReport}
        </p>
      </div>

      {/* Gesammelte Beweise */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Wissenschaftliche Beweismittel</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {puzzle.evidenceItems.map((evidence, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300"
            >
              <span className="font-semibold text-cyan-300 block mb-1">
                {evidence.title}
              </span>
              <p className="text-slate-400 leading-relaxed">
                {evidence.fact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hypothesen zur Auswahl */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Welche Hypothese erklärt die Beweise wissenschaftlich korrekt?
        </h4>

        <div className="space-y-2.5">
          {puzzle.hypotheses.map(hyp => {
            const isSelected = selectedHypothesisId === hyp.id;

            return (
              <div
                key={hyp.id}
                onClick={() => handleSelectHypothesis(hyp.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-400 text-white ring-2 ring-purple-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-purple-400 bg-purple-500 text-white' : 'border-slate-600'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-snug">
                    {hyp.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fall abschließen Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSolveCase}
          disabled={!selectedHypothesisId}
          className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            selectedHypothesisId
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Ermittlung abschließen</span>
        </button>
      </div>
    </div>
  );
};
