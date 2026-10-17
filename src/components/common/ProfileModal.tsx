import React, { useState } from 'react';
import { PlayerProfile } from '../../types/game';
import { AVAILABLE_BADGES } from '../../engine/learningEngine';
import { exportPlayerSaveData, importPlayerSaveData, resetPlayerProfile } from '../../engine/storage';
import { soundEngine } from '../../engine/audio';
import { 
  User, 
  Award, 
  Download, 
  Upload, 
  RotateCcw, 
  X, 
  Flame, 
  CheckCircle2, 
  BookOpen
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onUpdateProfile,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'badges' | 'data'>('stats');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    soundEngine.playClick();
    const data = exportPlayerSaveData(profile);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chemistry_mystery_save_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const imported = importPlayerSaveData(text);
      if (imported) {
        soundEngine.playSuccess();
        onUpdateProfile(imported);
        setImportStatus('Spielstand erfolgreich wiederhergestellt!');
      } else {
        soundEngine.playHintNotice();
        setImportStatus('Fehler beim Import: Ungültiges Dateiformat.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Möchtest du deinen Spielstand wirklich auf Anfang zurücksetzen? Alle XP und Abzeichen werden gelöscht.')) {
      soundEngine.playHintNotice();
      const fresh = resetPlayerProfile();
      onUpdateProfile(fresh);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl lab-card rounded-2xl p-6 border border-cyan-500/30 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                <span>Forscher-Akte: {profile.username}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Level {profile.level}
                </span>
                {profile.rewards?.activeTitle && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {profile.rewards.activeTitle}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                <span>{profile.currentXP} Gesamt-XP</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">💎 {profile.rewards?.crystals || 0} Kristalle</span>
                <span>•</span>
                <span>{profile.unlockedRooms.length} Labore freigeschaltet</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab-Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Statistiken & Lernfortschritt
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Abzeichen ({profile.badges.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'data'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Spielstand & Backup
          </button>
        </div>

        {/* Tab-Inhalte */}
        <div className="py-4 overflow-y-auto pr-1 flex-1">
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Gelöste Missionen</div>
                  <div className="text-xl font-mono font-bold text-white mt-1">
                    {profile.stats.puzzlesSolvedCount}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Richtige Antworten</div>
                  <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                    {profile.stats.correctAnswersTotal}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Beste Serie</div>
                  <div className="text-xl font-mono font-bold text-amber-400 mt-1 flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{profile.stats.bestStreak}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Wiederholungsbedarf</div>
                  <div className="text-xl font-mono font-bold text-cyan-400 mt-1">
                    {profile.failedPuzzlesToReview.length}
                  </div>
                </div>
              </div>

              {/* Spaced-Repetition Notiz */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Adaptives Wiederholungssystem</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Themen, bei denen du Fehlversuche hattest, werden automatisch vorgemerkt. Sobald du sie meisterst, erhältst du zusätzlichen Erfahrungs-Bonus!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_BADGES.map(badge => {
                const isUnlocked = profile.badges.some(b => b.id === badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
                        : 'bg-slate-900/40 border-slate-800/80 opacity-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      isUnlocked ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{badge.title}</span>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Dein Spielstand wird standardmäßig lokal in deinem Browser gespeichert. Du kannst ihn als Backup-Datei auf deinen Computer exportieren oder auf ein anderes Gerät übertragen.
              </div>

              {importStatus && (
                <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-800 text-xs text-cyan-300">
                  {importStatus}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExport}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Spielstand als JSON exportieren</span>
                </button>

                <label className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Backup importieren</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 border border-red-900/40 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Spielstand vollständig zurücksetzen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
