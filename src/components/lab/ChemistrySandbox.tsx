import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../engine/audio';
import { PlayerProfile } from '../../types/game';
import { savePlayerProfile } from '../../engine/storage';
import { calculateLevel } from '../../engine/learningEngine';
import { FlaskConical, Sparkles, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChemistrySandboxProps {
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onBackToRooms: () => void;
}

interface SandboxElement {
  symbol: string;
  name: string;
  color: string;
  valency: number;
  atomicNumber: number;
  state: 'gas' | 'solid' | 'liquid';
}

const AVAILABLE_SANDBOX_ELEMENTS: SandboxElement[] = [
  { symbol: 'H', name: 'Wasserstoff', color: '#38bdf8', valency: 1, atomicNumber: 1, state: 'gas' },
  { symbol: 'O', name: 'Sauerstoff', color: '#f43f5e', valency: 2, atomicNumber: 8, state: 'gas' },
  { symbol: 'C', name: 'Kohlenstoff', color: '#94a3b8', valency: 4, atomicNumber: 6, state: 'solid' },
  { symbol: 'N', name: 'Stickstoff', color: '#3b82f6', valency: 3, atomicNumber: 7, state: 'gas' },
  { symbol: 'Na', name: 'Natrium', color: '#a855f7', valency: 1, atomicNumber: 11, state: 'solid' },
  { symbol: 'Cl', name: 'Chlor', color: '#22c55e', valency: 1, atomicNumber: 17, state: 'gas' },
  { symbol: 'Fe', name: 'Eisen', color: '#eab308', valency: 2, atomicNumber: 26, state: 'solid' },
  { symbol: 'S', name: 'Schwefel', color: '#f59e0b', valency: 2, atomicNumber: 16, state: 'solid' },
  { symbol: 'He', name: 'Helium', color: '#ec4899', valency: 0, atomicNumber: 2, state: 'gas' }
];

interface SynthesisFormula {
  formula: string;
  name: string;
  composition: Record<string, number>;
  description: string;
  sparkyFact: string;
}

const SYNTHESIS_CATALOG: SynthesisFormula[] = [
  {
    formula: 'H₂O',
    name: 'Wasser',
    composition: { H: 2, O: 1 },
    description: 'Das wichtigste Molekül für alles Leben auf der Erde.',
    sparkyFact: 'Wasser bedeckt über 70 % unseres blauen Planeten!'
  },
  {
    formula: 'CO₂',
    name: 'Kohlenstoffdioxid',
    composition: { C: 1, O: 2 },
    description: 'Gasförmiges Oxid, das Pflanzen für die Photosynthese brauchen.',
    sparkyFact: 'Das prickelt in deiner Limonade und Mineralwasser!'
  },
  {
    formula: 'CH₄',
    name: 'Methan',
    composition: { C: 1, H: 4 },
    description: 'Das einfachste Alkan und Hauptbestandteil von Erdgas.',
    sparkyFact: 'Kühe rülpsen Methan aus – und es brennt mit blauer Flamme!'
  },
  {
    formula: 'NaCl',
    name: 'Natriumchlorid',
    composition: { Na: 1, Cl: 1 },
    description: 'Klassisches Kochsalz mit kubischem Kristallgitter.',
    sparkyFact: 'Aus explosivem Natrium und giftigem Chlorgas wird leckeres Speisesalz!'
  },
  {
    formula: 'NH₃',
    name: 'Ammoniak',
    composition: { N: 1, H: 3 },
    description: 'Stechend riechendes Gas, grundlegend für Pflanzendünger.',
    sparkyFact: 'Stickstoff aus der Luft wird mit Wasserstoff zu Nahrung für Pflanzen!'
  },
  {
    formula: 'FeS',
    name: 'Eisensulfid',
    composition: { Fe: 1, S: 1 },
    description: 'Schwarzer Feststoff aus exothermer Reaktion von Eisen und Schwefel.',
    sparkyFact: 'Wenn Eisen und Schwefel glühend reagieren, entsteht ein neuer Feststoff!'
  },
  {
    formula: 'O₂',
    name: 'Disauerstoff',
    composition: { O: 2 },
    description: 'Molekularer Sauerstoff, den Mensch und Tier einatmen.',
    sparkyFact: 'Jeder Atemzug liefert deinen Zellen frischen O₂!'
  },
  {
    formula: 'N₂',
    name: 'Distickstoff',
    composition: { N: 2 },
    description: 'Sehr stabiles Molekül mit starker Dreifachbindung.',
    sparkyFact: '78 Prozent der Luft, die du gerade atmest, ist reiner Stickstoff!'
  },
  {
    formula: 'H₂O₂',
    name: 'Wasserstoffperoxid',
    composition: { H: 2, O: 2 },
    description: 'Reaktive Flüssigkeit zum Desinfizieren und Bleichen.',
    sparkyFact: 'Das extra Sauerstoffatom macht es extrem reaktionsfreudig!'
  }
];

export const ChemistrySandbox: React.FC<ChemistrySandboxProps> = ({
  profile,
  onUpdateProfile,
  onBackToRooms
}) => {
  const [selectedAtoms, setSelectedAtoms] = useState<string[]>([]);
  const [isReacting, setIsReacting] = useState(false);
  const [lastSynthesis, setLastSynthesis] = useState<SynthesisFormula | null>(null);
  const [reactionMessage, setReactionMessage] = useState<string | null>(null);
  const [discoveredFormulas, setDiscoveredFormulas] = useState<string[]>(() => profile.sandboxSyntheses || []);

  const reactionTimerRef = useRef<number | null>(null);
  const profileRef = useRef(profile);
  const discoveredFormulasRef = useRef(discoveredFormulas);

  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => { discoveredFormulasRef.current = discoveredFormulas; }, [discoveredFormulas]);
  useEffect(() => () => {
    if (reactionTimerRef.current !== null) {
      window.clearTimeout(reactionTimerRef.current);
    }
  }, []);

  const handleAddAtom = (symbol: string) => {
    if (selectedAtoms.length >= 10) return;
    soundEngine.playFlaskBubble();
    soundEngine.triggerHaptic('light');
    setSelectedAtoms([...selectedAtoms, symbol]);
    setReactionMessage(null);
  };

  const handleClear = () => {
    soundEngine.playClick();
    setSelectedAtoms([]);
    setLastSynthesis(null);
    setReactionMessage(null);
  };

  const handleSynthesize = () => {
    if (selectedAtoms.length === 0) return;

    soundEngine.playFlaskBubble();
    soundEngine.triggerHaptic('medium');
    setIsReacting(true);

    if (reactionTimerRef.current !== null) {
      window.clearTimeout(reactionTimerRef.current);
    }

    // Zähle Atome
    const counts: Record<string, number> = {};
    for (const a of selectedAtoms) {
      counts[a] = (counts[a] || 0) + 1;
    }

    reactionTimerRef.current = window.setTimeout(() => {
      reactionTimerRef.current = null;
      setIsReacting(false);

      // Finde passende Synthese
      const match = SYNTHESIS_CATALOG.find(formula => {
        const formulaKeys = Object.keys(formula.composition);
        const countKeys = Object.keys(counts);

        if (formulaKeys.length !== countKeys.length) return false;
        return formulaKeys.every(k => counts[k] === formula.composition[k]);
      });

      if (match) {
        soundEngine.playSuccess();
        soundEngine.triggerHaptic('success');
        setLastSynthesis(match);
        setReactionMessage(`Erfolgreiche Synthese: ${match.name} (${match.formula})!`);

        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        } catch {}

        const currentProfile = profileRef.current;
        const currentFormulas = discoveredFormulasRef.current;
        if (!currentFormulas.includes(match.formula)) {
          const nextFormulas = [...currentFormulas, match.formula];
          setDiscoveredFormulas(nextFormulas);
          discoveredFormulasRef.current = nextFormulas;

          // Belohnung: 15 XP + 5 Kristalle für neue Synthese
          const newXP = currentProfile.currentXP + 15;
          const levelInfo = calculateLevel(newXP);
          const updatedProfile: PlayerProfile = {
            ...currentProfile,
            currentXP: newXP,
            level: levelInfo.level,
            xpToNextLevel: levelInfo.xpToNextLevel,
            sandboxSyntheses: nextFormulas,
            rewards: {
              ...currentProfile.rewards,
              crystals: currentProfile.rewards.crystals + 5
            }
          };
          savePlayerProfile(updatedProfile);
          onUpdateProfile(updatedProfile);
        }
      } else {
        soundEngine.playHintNotice();
        setLastSynthesis(null);

        if (counts['He']) {
          setReactionMessage('Helium ist ein Edelgas mit voller Elektronenschale – es bildet keine Verbindungen!');
        } else {
          setReactionMessage('Die Mischung reagiert nicht stabil. Überprüfe die Valenzen oder probiere z. B. 2x H + 1x O!');
        }
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Kopfzeile */}
      <div className="p-6 rounded-2xl lab-card border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onBackToRooms();
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-2 cursor-pointer"
          >
            ← Zurück zu den Laboren
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Freies Experimentierlabor
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              Sandbox-Modus
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Kombiniere beliebige Elemente im Reaktionskolben und entdecke echte Moleküle und Reaktionen!
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono">Entdeckte Synthesen</div>
            <div className="text-2xl font-mono font-bold text-amber-300 mt-0.5">
              {discoveredFormulas.length} / {SYNTHESIS_CATALOG.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 text-xl">
            🧪
          </div>
        </div>
      </div>

      {/* Haupt-Bereich: Element-Regal und Reaktionskolben */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Element-Regal (Links, 5 Spalten) */}
        <div className="lg:col-span-5 p-5 rounded-2xl lab-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Element-Vorratsregal
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Klicke zum Hinzufügen</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {AVAILABLE_SANDBOX_ELEMENTS.map(elem => (
              <button
                key={elem.symbol}
                type="button"
                onClick={() => handleAddAtom(elem.symbol)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 hover:border-cyan-500/50 flex flex-col items-center justify-between min-h-[96px] cursor-pointer element-cell-hover transition-all"
              >
                <div className="w-full flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>#{elem.atomicNumber}</span>
                  <span className="text-[9px] text-slate-400">
                    {elem.state === 'gas' ? '💨 Gas' : '🪨 Fest'}
                  </span>
                </div>
                <div 
                  className="text-2xl font-black font-mono my-1"
                  style={{ color: elem.color }}
                >
                  {elem.symbol}
                </div>
                <div className="text-[11px] font-medium text-slate-300 truncate w-full text-center">
                  {elem.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Der Reaktionskolben (Rechts, 7 Spalten) */}
        <div className="lg:col-span-7 p-6 rounded-2xl lab-card border border-cyan-500/30 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Reaktionskolben (Inhalt: {selectedAtoms.length}/10 Atome)
                </h3>
              </div>
              {selectedAtoms.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Leeren</span>
                </button>
              )}
            </div>

            {/* Mischzone */}
            <div className={`min-h-[170px] p-6 rounded-2xl border-2 border-dashed flex flex-wrap items-center justify-center gap-3 transition-all relative overflow-hidden ${
              isReacting 
                ? 'border-amber-400 bg-amber-950/30' 
                : selectedAtoms.length > 0 
                ? 'border-cyan-500/50 bg-slate-950/60' 
                : 'border-slate-800 bg-slate-950/40'
            }`}>
              {/* Animierte Flüssigkeitsbläschen */}
              {isReacting && (
                <div className="absolute inset-0 flex items-center justify-center bg-cyan-950/40 backdrop-blur-xs">
                  <div className="text-center space-y-2">
                    <FlaskConical className="w-10 h-10 text-cyan-400 mx-auto animate-bounce" />
                    <span className="text-xs font-mono text-cyan-300 font-bold tracking-wider uppercase block">
                      Reaktion läuft...
                    </span>
                  </div>
                </div>
              )}

              {selectedAtoms.length === 0 ? (
                <div className="text-center text-slate-500 text-xs">
                  Der Kolben ist leer. Wähle Atome aus dem Regal links aus!
                </div>
              ) : (
                selectedAtoms.map((sym, idx) => {
                  const elem = AVAILABLE_SANDBOX_ELEMENTS.find(e => e.symbol === sym);
                  const isGas = elem?.state === 'gas';
                  const isSolid = elem?.state === 'solid';

                  // Physikalische Bewegung nach realer Natur:
                  // - Bei aktiver Reaktion: Starke thermische Kollision / Reaktionskinetik!
                  // - Im Ruhezustand: Gase driften brownsch frei im Raum, Feststoffe ruhen fest auf dem Boden!
                  const motionClass = isReacting 
                    ? 'animate-reaction-agitation' 
                    : isGas 
                    ? 'animate-gas-drift' 
                    : 'solid-stationary';

                  return (
                    <div
                      key={idx}
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-white shadow-lg transition-all ${motionClass}`}
                      style={{ 
                        backgroundColor: elem?.color ? `${elem.color}33` : '#06b6d433',
                        borderColor: elem?.color || '#06b6d4',
                        borderWidth: isSolid ? '3px' : '2px',
                        borderStyle: isSolid ? 'solid' : 'dashed',
                        animationDelay: isReacting ? `${(idx * 0.05).toFixed(2)}s` : `${(idx * 0.25).toFixed(2)}s`
                      }}
                      title={`${elem?.name || sym}: ${isGas ? 'Gasförmig (in freier thermischer Bewegung)' : 'Feststoff (ruhend am Kolbenboden)'}`}
                    >
                      <span className="text-base leading-none">{sym}</span>
                      <span className="text-[7.5px] font-sans font-normal opacity-80 leading-none mt-0.5">
                        {isGas ? '💨 Gas' : '🪨 Fest'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Rückmeldung & Syntheseergebnis */}
          {reactionMessage && (
            <div className={`p-4 rounded-xl border text-xs sm:text-sm animate-in fade-in flex items-start gap-3 ${
              lastSynthesis 
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200' 
                : 'bg-amber-950/50 border-amber-500/50 text-amber-200'
            }`}>
              <div className="text-xl">
                {lastSynthesis ? '✨' : '💡'}
              </div>
              <div className="flex-1">
                <div className="font-bold mb-0.5">{reactionMessage}</div>
                {lastSynthesis ? (
                  <p className="text-xs opacity-90 leading-relaxed">
                    {lastSynthesis.description} <span className="font-semibold text-white">Sparky sagt: "{lastSynthesis.sparkyFact}"</span>
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {/* Aktions-Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={selectedAtoms.length === 0 || isReacting}
              onClick={handleSynthesize}
              className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
                selectedAtoms.length > 0 && !isReacting
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Mischen & Reagieren lassen</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
