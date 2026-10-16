import React from 'react';
import { LAB_ROOMS } from '../../types/lab';
import { PlayerProfile } from '../../types/game';
import { soundEngine } from '../../engine/audio';
import { 
  Atom, 
  Orbit, 
  Share2, 
  Flame, 
  Gem, 
  Droplets, 
  Leaf, 
  Sparkles, 
  Lock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface LabRoomOverviewProps {
  profile: PlayerProfile;
  onSelectRoom: (roomId: string) => void;
}

export const LabRoomOverview: React.FC<LabRoomOverviewProps> = ({ profile, onSelectRoom }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom': return <Atom className="w-6 h-6" />;
      case 'Orbit': return <Orbit className="w-6 h-6" />;
      case 'Share2': return <Share2 className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Gem': return <Gem className="w-6 h-6" />;
      case 'Droplets': return <Droplets className="w-6 h-6" />;
      case 'Leaf': return <Leaf className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2 py-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Das Forschungsinstitut
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Wähle einen Laborbereich, um chemische Rätsel und wissenschaftliche Missionen zu starten.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {LAB_ROOMS.map(room => {
          const isUnlocked = profile.unlockedRooms.includes(room.id);

          return (
            <div
              key={room.id}
              onClick={() => {
                if (isUnlocked) {
                  soundEngine.playClick();
                  onSelectRoom(room.id);
                } else {
                  soundEngine.playHintNotice();
                }
              }}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden group ${
                isUnlocked
                  ? 'lab-card lab-card-hover border-cyan-500/30 cursor-pointer'
                  : 'bg-slate-950/60 border-slate-900 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Leuchteffekt im Hintergrund bei freigeschalteten Räumen */}
              {isUnlocked && (
                <div 
                  className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: room.accentColor }}
                />
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center border shadow"
                    style={{
                      backgroundColor: `${room.accentColor}15`,
                      borderColor: `${room.accentColor}40`,
                      color: room.accentColor
                    }}
                  >
                    {getIcon(room.iconName)}
                  </div>

                  {!isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                      <Lock className="w-3 h-3 text-amber-500/80" />
                      <span>Level {room.requiredLevel}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Freigeschaltet</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                  {room.subtitle}
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {room.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  {isUnlocked ? `${room.missionsCount} Missionen` : `Erfordert Level ${room.requiredLevel}`}
                </span>

                {isUnlocked && (
                  <span className="text-cyan-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Betreten</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
