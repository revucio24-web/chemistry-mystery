import React, { useState } from 'react';
import { KID_ENCYCLOPEDIA_ARTICLES, KidArticle } from '../../data/kidEncyclopedia';
import { soundEngine } from '../../engine/audio';
import { 
  X, 
  Search, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Home, 
  ArrowRight,
  Atom
} from 'lucide-react';

interface KidsEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArticleId?: string;
}

export const KidsEncyclopediaModal: React.FC<KidsEncyclopediaModalProps> = ({
  isOpen,
  onClose,
  initialArticleId
}) => {
  const [selectedArticle, setSelectedArticle] = useState<KidArticle>(() => {
    return KID_ENCYCLOPEDIA_ARTICLES.find(a => a.id === initialArticleId) || KID_ENCYCLOPEDIA_ARTICLES[0];
  });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'basics' | 'reactions' | 'everyday' | 'future'>('all');

  if (!isOpen) return null;

  const filteredArticles = KID_ENCYCLOPEDIA_ARTICLES.filter(a => {
    const matchesSearch = 
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      a.kidExplanation.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSelectArticle = (art: KidArticle) => {
    soundEngine.playClick();
    setSelectedArticle(art);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl h-[90vh] lab-card rounded-3xl border-2 border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-emerald-500/20 bg-slate-950/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-2xl shadow-lg">
              🐱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                  Sparkys Forscherlexikon
                </h2>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Kinderleicht erklärt
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chemie zum Anfassen, Staunen und Verstehen – mit Kater Chemikus Sparky!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suche & Kategorien */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Thema suchen (z.B. Atom, Wasser, Säure)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {[
              { id: 'all', label: 'Alle Themen 📚' },
              { id: 'basics', label: 'Grundlagen 🧱' },
              { id: 'reactions', label: 'Reaktionen 💥' },
              { id: 'everyday', label: 'Alltag 🍋' },
              { id: 'future', label: 'Zukunft 🌱' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hauptbereich: 2 Spalten */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Linke Liste der Artikel */}
          <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 p-3 overflow-y-auto space-y-2 shrink-0 bg-slate-950/40">
            {filteredArticles.map(art => {
              const isSelected = selectedArticle.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => handleSelectArticle(art)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/70 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/30 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      {art.emoji}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {art.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'}`} />
                </div>
              );
            })}
          </div>

          {/* Rechter Lesebereich */}
          <div className="flex-1 p-5 sm:p-8 overflow-y-auto bg-slate-950/70 space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 shadow-md">
                {selectedArticle.emoji}
              </span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedArticle.title}
                </h3>
                <p className="text-sm font-medium text-emerald-400 mt-1">
                  {selectedArticle.subtitle}
                </p>
              </div>
            </div>

            {/* Sparkys Kindererklärung */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <BookOpen className="w-4 h-4" />
                <span>🐱 Sparkys verständliche Erklärung:</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {selectedArticle.kidExplanation}
              </p>
            </div>

            {/* Bildhafter Vergleich (Analogie) */}
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>🧩 Anschaulicher Vergleich zum Merken:</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
                {selectedArticle.analogy}
              </p>
            </div>

            {/* Alltagsbeispiel */}
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <Home className="w-4 h-4 text-indigo-400" />
                <span>🏡 Wo du das in deinem Alltag erlebst:</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                {selectedArticle.dailyLifeExample}
              </p>
            </div>

            {/* Fun Fact */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                  ✨ Unglaublicher Forscher-Fakt:
                </span>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  {selectedArticle.funFact}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-emerald-400" />
            <span>Chemistry Mystery • Didaktisch geprüft & kinderfreundlich aufbereitet</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer transition-colors shadow-md shadow-emerald-900/30"
          >
            Alles verstanden! Weiterforschen
          </button>
        </div>

      </div>
    </div>
  );
};
