import React, { useState } from 'react';
import { Sparkles, Calendar, Award, CheckCircle2, Lock, X, Gift, Palette, Target, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile } from '../../types/game';
import { 
  DAILY_STREAK_REWARDS, 
  SCIENTIST_TITLES, 
  LAB_THEMES,
  checkDailyRewardStatus, 
  claimDailyReward, 
  setActiveTitle,
  claimDailyQuestReward,
  unlockAndEquipTheme
} from '../../engine/rewardEngine';
import { soundEngine } from '../../engine/audio';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'quests' | 'titles' | 'themes'>('daily');
  const [claimCelebration, setClaimCelebration] = useState<{
    crystals: number;
    streakDay: number;
    newTitles: string[];
  } | null>(null);

  if (!isOpen) return null;

  const dailyStatus = checkDailyRewardStatus(profile.rewards);

  const handleClaim = () => {
    soundEngine.playSuccess();
    const result = claimDailyReward(profile);
    if (result.claimedCrystals > 0) {
      onUpdateProfile(result.updatedProfile);
      setClaimCelebration({
        crystals: result.claimedCrystals,
        streakDay: result.streakDay,
        newTitles: result.newUnlockedTitles
      });
    }
  };

  const handleSelectTitle = (titleName: string) => {
    soundEngine.playClick();
    const updated = setActiveTitle(profile, titleName);
    onUpdateProfile(updated);
  };

  const handleClaimQuest = (questId: string) => {
    soundEngine.playSuccess();
    soundEngine.triggerHaptic('success');
    const result = claimDailyQuestReward(profile, questId);
    if (result.claimed) {
      onUpdateProfile(result.updatedProfile);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleEquipTheme = (themeId: string) => {
    soundEngine.playClick();
    const result = unlockAndEquipTheme(profile, themeId);
    if (result.success) {
      soundEngine.playSuccess();
      soundEngine.triggerHaptic('success');
      onUpdateProfile(result.updatedProfile);
    } else {
      soundEngine.playHintNotice();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl shadow-amber-950/40 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-modal-title"
      >
        {/* Header mit Kristall-Bank & Tabs */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 id="reward-modal-title" className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Forscher-Belohnungen
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Sparkys Schatzkiste
                </span>
              </h2>
              <p className="text-xs text-amber-200/80">
                Sammle Kristalle, erfülle Tagesaufträge und gestalte dein Labor!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Kristall-Konto */}
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/40 flex items-center gap-2 text-amber-300 font-bold text-sm shadow-inner">
              <span className="text-lg">💎</span>
              <span>{profile.rewards.crystals}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab-Navigation: 4 Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => { soundEngine.playClick(); setActiveTab('daily'); }}
            className={`py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tages-Bonus</span>
            {dailyStatus.canClaim && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
          </button>

          <button
            type="button"
            onClick={() => { soundEngine.playClick(); setActiveTab('quests'); }}
            className={`py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'quests'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Tagesaufträge</span>
            {(profile.dailyQuests || []).some(q => q.isCompleted && !q.isClaimed) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
            )}
          </button>

          <button
            type="button"
            onClick={() => { soundEngine.playClick(); setActiveTab('titles'); }}
            className={`py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'titles'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Titel ({profile.rewards.unlockedTitles.length}/{SCIENTIST_TITLES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { soundEngine.playClick(); setActiveTab('themes'); }}
            className={`py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Designs</span>
          </button>
        </div>

        {/* Inhalt */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {claimCelebration && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 to-yellow-950/60 border border-amber-500/50 flex items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎉</div>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    Glückwunsch! +{claimCelebration.crystals} 💎 Kristalle eingesammelt!
                  </h4>
                  <p className="text-xs text-amber-100/80">
                    Tag {claimCelebration.streakDay} gemeistert. Komm morgen wieder für noch größere Schätze!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setClaimCelebration(null)}
                className="text-xs text-amber-300 underline font-semibold cursor-pointer"
              >
                Super!
              </button>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 font-mono">Aktuelle Forscher-Serie:</span>
                  <div className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                    <span>🔥 {profile.rewards.dailyRewardStreak} Tage in Folge</span>
                  </div>
                </div>

                {dailyStatus.canClaim ? (
                  <button
                    type="button"
                    onClick={handleClaim}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Belohnung abholen (+{dailyStatus.crystalsForToday} 💎)</span>
                  </button>
                ) : (
                  <div className="py-2.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Heute bereits abgeholt! Morgen geht's weiter.</span>
                  </div>
                )}
              </div>

              {/* 7-Tage-Kalender-Übersicht */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {DAILY_STREAK_REWARDS.map(item => {
                  const isPast = item.day < dailyStatus.nextDay;
                  const isCurrent = item.day === dailyStatus.nextDay;
                  const isClaimedToday = isCurrent && !dailyStatus.canClaim;

                  return (
                    <div
                      key={item.day}
                      className={`relative p-3 rounded-xl border flex flex-col items-center text-center transition ${
                        isClaimedToday
                          ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/40'
                          : isCurrent && dailyStatus.canClaim
                          ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-950/50'
                          : isPast
                          ? 'bg-slate-900/50 border-slate-800 opacity-60'
                          : 'bg-slate-950/60 border-slate-850'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                        Tag {item.day}
                      </span>
                      
                      <div className="w-10 h-10 rounded-lg bg-slate-900/80 flex items-center justify-center text-xl my-1 border border-slate-800">
                        {item.day === 7 ? '🌟' : '💎'}
                      </div>

                      <span className="text-xs font-bold text-amber-300">
                        +{item.crystals}
                      </span>
                      
                      <span className="text-[9px] text-slate-400 leading-tight mt-1 line-clamp-1">
                        {item.bonusText}
                      </span>

                      {isClaimedToday && (
                        <div className="absolute top-1 right-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200/90 flex items-start gap-3">
                <span className="text-xl">🐱</span>
                <p>
                  <strong>Sparkys Forscher-Tipp:</strong> Logge dich jeden Tag kurz ein und löse mindestens ein Rätsel. An Tag 7 wartet der legendäre <strong>Goldene Meisterkristall (+100 💎)</strong> auf dich!
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Tages-Forschungsaufträge */}
          {activeTab === 'quests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Schließe tägliche Forschungsaufträge ab, um zusätzliche Kristalle und Entdecker-XP zu verdienen!
                </p>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Täglich neu
                </span>
              </div>

              <div className="space-y-3">
                {(profile.dailyQuests || []).map(quest => {
                  const percent = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));
                  return (
                    <div
                      key={quest.id}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                        quest.isClaimed
                          ? 'bg-slate-950/40 border-slate-900 opacity-60'
                          : quest.isCompleted
                          ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl mt-0.5">{quest.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">
                              {quest.title}
                            </h4>
                            <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-800">
                              +{quest.rewardCrystals} 💎
                            </span>
                            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                              +{quest.rewardXP} XP
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {quest.description}
                          </p>

                          {/* Fortschrittsbalken */}
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  quest.isCompleted ? 'bg-emerald-400' : 'bg-cyan-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {quest.currentCount} / {quest.targetCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {quest.isClaimed ? (
                          <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                            <Check className="w-4 h-4" />
                            <span>Eingelöst</span>
                          </div>
                        ) : quest.isCompleted ? (
                          <button
                            type="button"
                            onClick={() => handleClaimQuest(quest.id)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span>Einlösen</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">
                            Läuft...
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Forschertitel */}
          {activeTab === 'titles' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Wähle deinen aktiven Titel. Dieser schmückt dein Forscherprofil und wird in deinen Entdecker-Diplomen angezeigt!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SCIENTIST_TITLES.map(title => {
                  const isUnlocked = profile.rewards.unlockedTitles.includes(title.name);
                  const isActive = profile.rewards.activeTitle === title.name;

                  return (
                    <div
                      key={title.id}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition ${
                        isActive
                          ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                          : isUnlocked
                          ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-950/40 border-slate-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{title.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">
                              {title.name}
                            </h4>
                            {isActive && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                                Aktiv
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {title.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-mono">
                            <span>Bedarf: {title.requiredCrystals} 💎</span>
                            {title.requiredPuzzles ? (
                              <span>&bull; {title.requiredPuzzles} Rätsel</span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isActive ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        ) : isUnlocked ? (
                          <button
                            type="button"
                            onClick={() => handleSelectTitle(title.name)}
                            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700 transition cursor-pointer font-medium"
                          >
                            Wählen
                          </button>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-slate-900 text-slate-600">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Labor-Designs & Themes */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Passe das Erscheinungsbild deines Labors an. Schalte neue futuristische oder alchemistische Designs frei!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LAB_THEMES.map(theme => {
                  const unlocked = (profile.unlockedThemes || ['theme_default']).includes(theme.id);
                  const isEquipped = (profile.equippedTheme || 'theme_default') === theme.id;
                  const canAfford = profile.rewards.crystals >= theme.costCrystals;

                  return (
                    <div
                      key={theme.id}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition ${
                        isEquipped
                          ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/50 shadow-md'
                          : unlocked
                          ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-950/40 border-slate-900 opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{theme.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">
                              {theme.name}
                            </h4>
                            {isEquipped && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                                Aktiv
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {theme.description}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <div className={`w-16 h-3 rounded-full bg-gradient-to-r ${theme.previewGradient} shadow`} />
                            {!unlocked && (
                              <span className="text-[10px] text-amber-300 font-mono font-bold">
                                Preis: {theme.costCrystals} 💎
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-800/60">
                        {isEquipped ? (
                          <div className="flex items-center gap-1 text-xs text-cyan-300 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                            <span>Ausgerüstet</span>
                          </div>
                        ) : unlocked ? (
                          <button
                            type="button"
                            onClick={() => handleEquipTheme(theme.id)}
                            className="px-3 py-1 text-xs rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700 transition cursor-pointer font-medium"
                          >
                            Ausrüsten
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => handleEquipTheme(theme.id)}
                            className={`px-3 py-1 text-xs rounded-lg font-bold flex items-center gap-1 cursor-pointer transition ${
                              canAfford
                                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Lock className="w-3 h-3" />
                            <span>Freischalten ({theme.costCrystals} 💎)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
