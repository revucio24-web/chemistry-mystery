import { PlayerProfile, Badge, ElementCard } from '../types/game';
import { Puzzle } from '../types/puzzles';
import { getElementByNumber } from '../data/elements';
import { LEARNING_MODULES, LearningModule } from '../types/modules';

export const LEVEL_THRESHOLDS = [
  0,     // Level 1 (Elementarlabor)
  100,   // Level 2 (Atomkammer)
  250,   // Level 3 (Molekülwerkstatt)
  450,   // Level 4 (Reaktionsraum)
  700,   // Level 5 (Kristallarchiv)
  1000,  // Level 6 (Wasserstation)
  1400,  // Level 7 (Umweltlabor)
  1900   // Level 8 (Geheimes Forschungslabor)
];

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'badge_first_spark',
    title: 'Erster Funke',
    description: 'Löse dein allererstes Chemie-Rätsel im Elementarlabor.',
    iconName: 'Flame',
    category: 'elements'
  },
  {
    id: 'badge_element_collector_3',
    title: 'Element-Sammler',
    description: 'Schalte deine ersten 3 seltenen Elementkarten im Album frei.',
    iconName: 'Layers',
    category: 'elements'
  },
  {
    id: 'badge_element_collector_8',
    title: 'Vollständiges Oktett',
    description: 'Sammle 8 chemische Elementkarten für dein Forschungsalbum.',
    iconName: 'Sparkles',
    category: 'elements'
  },
  {
    id: 'badge_review_master',
    title: 'Wissens-Wiederbelebung',
    description: 'Meistere ein zuvor fehlgeschlagenes Rätsel im Wiederholungsmodus.',
    iconName: 'RotateCcw',
    category: 'mastery'
  },
  {
    id: 'badge_molecule_crafter',
    title: 'Molekül-Konstrukteur',
    description: 'Synthetisiere erfolgreich ein intaktes Molekül im Baukasten.',
    iconName: 'Share2',
    category: 'molecules'
  },
  {
    id: 'badge_balance_master',
    title: 'Hüter der Masse',
    description: 'Gleiche eine chemische Reaktionsgleichung fehlerfrei aus.',
    iconName: 'Scale',
    category: 'reactions'
  },
  {
    id: 'badge_analysis_expert',
    title: 'Analytik-Ass',
    description: 'Führe virtuelle Labor-Tests durch und bestimme eine unbekannte Probe.',
    iconName: 'FlaskConical',
    category: 'mastery'
  },
  {
    id: 'badge_detective_mind',
    title: 'Meister-Detektiv',
    description: 'Kläre einen chemischen Kriminal- oder Laborfall vollständig auf.',
    iconName: 'Search',
    category: 'mastery'
  },
  {
    id: 'badge_streak_3',
    title: 'Im Fluss der Wissenschaft',
    description: 'Beantworte 3 Rätsel in Folge beim ersten Versuch richtig.',
    iconName: 'Zap',
    category: 'streak'
  },
  {
    id: 'badge_streak_5',
    title: 'Genialer Verstand',
    description: 'Meistere 5 Rätsel in Folge ohne einen einzigen Fehlversuch.',
    iconName: 'Award',
    category: 'streak'
  },
  {
    id: 'badge_level_2',
    title: 'Labor-Assistent',
    description: 'Erreiche Level 2 und erhalte Zutritt zur Atomkammer.',
    iconName: 'Orbit',
    category: 'mastery'
  }
];

export function calculateLevel(totalXP: number): { level: number; currentXP: number; xpToNextLevel: number; progressPercent: number } {
  const safeXP = Math.max(0, totalXP);
  let level = 1;

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (safeXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }

  // Für XP oberhalb des vordefinierten Arrays: endlos skalierendes Levelsystem (500 XP pro Level)
  const maxFixedLevel = LEVEL_THRESHOLDS.length;
  const maxFixedXP = LEVEL_THRESHOLDS[maxFixedLevel - 1];
  if (safeXP >= maxFixedXP) {
    const extraXP = safeXP - maxFixedXP;
    const extraLevels = Math.floor(extraXP / 500);
    level = maxFixedLevel + extraLevels;
    const currentBase = maxFixedXP + extraLevels * 500;
    const nextBase = currentBase + 500;
    const needed = nextBase - safeXP;
    const progressPercent = Math.min(100, Math.round(((safeXP - currentBase) / 500) * 100));
    return {
      level,
      currentXP: safeXP,
      xpToNextLevel: Math.max(1, needed),
      progressPercent
    };
  }

  const currentLevelBase = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelThreshold = LEVEL_THRESHOLDS[level] || currentLevelBase + 500;
  const levelXP = safeXP - currentLevelBase;
  const neededXP = nextLevelThreshold - currentLevelBase;
  const progressPercent = Math.min(100, Math.round((levelXP / neededXP) * 100));

  return {
    level,
    currentXP: safeXP,
    xpToNextLevel: Math.max(0, nextLevelThreshold - safeXP),
    progressPercent
  };
}

export interface ModuleProgressItem {
  module: LearningModule;
  totalPuzzles: number;
  solvedPuzzles: number;
  progressPercent: number;
}

export function calculateModulesProgress(
  profile: PlayerProfile,
  allPuzzles: Puzzle[]
): ModuleProgressItem[] {
  return LEARNING_MODULES.map(module => {
    const modulePuzzles = allPuzzles.filter(p => p.moduleId === module.id);
    const totalPuzzles = modulePuzzles.length;
    const solvedPuzzles = modulePuzzles.filter(p => profile.completedPuzzleIds.includes(p.id)).length;
    const progressPercent = totalPuzzles > 0 ? Math.round((solvedPuzzles / totalPuzzles) * 100) : 0;

    return {
      module,
      totalPuzzles,
      solvedPuzzles,
      progressPercent
    };
  });
}

export function evaluatePuzzleResult(
  profile: PlayerProfile,
  puzzle: Puzzle,
  isCorrect: boolean,
  firstTry: boolean
): { updatedProfile: PlayerProfile; newBadges: Badge[]; newCards: ElementCard[]; xpEarned: number; leveledUp: boolean } {
  const newProfile: PlayerProfile = {
    ...profile,
    stats: { ...profile.stats, solvedByType: { ...profile.stats.solvedByType } },
    unlockedRooms: [...profile.unlockedRooms],
    completedPuzzleIds: [...profile.completedPuzzleIds],
    failedPuzzlesToReview: [...profile.failedPuzzlesToReview],
    elementCards: [...profile.elementCards],
    badges: [...profile.badges]
  };

  let xpEarned = 0;
  const newBadges: Badge[] = [];
  const newCards: ElementCard[] = [];
  const prevLevel = profile.level;

  if (isCorrect) {
    // Grund-XP aus dem Rätsel
    xpEarned = puzzle.xpReward;
    if (firstTry) {
      xpEarned += 10; // Bonus für sofortiges Verstehen
    }

    // War das Rätsel in der Spaced-Repetition-Wiederholung?
    const wasInReview = profile.failedPuzzlesToReview.includes(puzzle.id);
    if (wasInReview) {
      xpEarned += 15; // Wiederholungs-Meisterbonus!
      // Badge: Wissens-Wiederbelebung
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_review_master');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    // Statistiken aktualisieren
    newProfile.stats.correctAnswersTotal += 1;
    newProfile.stats.puzzlesSolvedCount += 1;
    newProfile.stats.currentStreak += 1;
    if (newProfile.stats.currentStreak > newProfile.stats.bestStreak) {
      newProfile.stats.bestStreak = newProfile.stats.currentStreak;
    }

    // Puzzle als erledigt markieren
    if (!newProfile.completedPuzzleIds.includes(puzzle.id)) {
      newProfile.completedPuzzleIds.push(puzzle.id);
    }

    // Aus der Wiederholungs-Queue entfernen
    newProfile.failedPuzzlesToReview = newProfile.failedPuzzlesToReview.filter(id => id !== puzzle.id);

    // Typ-Zähler inkrementieren
    newProfile.stats.solvedByType[puzzle.type] = (newProfile.stats.solvedByType[puzzle.type] || 0) + 1;

    // Elementkarte freischalten (falls für dieses Rätsel hinterlegt)
    if (puzzle.rewardElementAtomicNumber) {
      const el = getElementByNumber(puzzle.rewardElementAtomicNumber);
      if (el && !newProfile.elementCards.some(c => c.atomicNumber === el.atomicNumber)) {
        const rarity = el.atomicNumber === 79 ? 'legendary' : el.atomicNumber > 10 ? 'rare' : 'common';
        const card: ElementCard = {
          atomicNumber: el.atomicNumber,
          symbol: el.symbol,
          name: el.name,
          latinName: el.latinName,
          atomicMass: el.atomicMass,
          period: el.period,
          group: el.group,
          category: el.category,
          rarity,
          discoveredAt: new Date().toISOString(),
          funFact: el.funFact,
          realWorldUse: el.realWorldUse,
          colorHex: el.colorHex
        };
        newProfile.elementCards.push(card);
        newCards.push(card);
      }
    }

    // Badges prüfen:
    // 1. Erstes gelöstes Rätsel
    if (newProfile.stats.puzzlesSolvedCount >= 1) {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_first_spark');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    // 2. Elementkarten-Sammler Badges
    if (newProfile.elementCards.length >= 3) {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_element_collector_3');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }
    if (newProfile.elementCards.length >= 8) {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_element_collector_8');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    // 3. Typ-spezifische Badges
    if (puzzle.type === 'molecule_builder') {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_molecule_crafter');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    if (puzzle.type === 'equation_balancer') {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_balance_master');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    if (puzzle.type === 'substance_analysis') {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_analysis_expert');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    if (puzzle.type === 'mystery_detective') {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_detective_mind');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    // 4. Streaks
    if (newProfile.stats.currentStreak >= 3) {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_streak_3');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }
    if (newProfile.stats.currentStreak >= 5) {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_streak_5');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }
  } else {
    // Falsche Antwort: Streak zurücksetzen
    newProfile.stats.wrongAnswersTotal += 1;
    newProfile.stats.currentStreak = 0;

    // Zum Spaced-Repetition System hinzufügen
    if (!newProfile.failedPuzzlesToReview.includes(puzzle.id)) {
      newProfile.failedPuzzlesToReview.push(puzzle.id);
    }
  }

  // XP & Level-Berechnung
  newProfile.currentXP += xpEarned;
  const levelInfo = calculateLevel(newProfile.currentXP);
  newProfile.level = levelInfo.level;
  newProfile.xpToNextLevel = levelInfo.xpToNextLevel;

  const leveledUp = newProfile.level > prevLevel;

  // Level 2 Badge
  if (newProfile.level >= 2) {
    const b = AVAILABLE_BADGES.find(x => x.id === 'badge_level_2');
    if (b && !newProfile.badges.some(x => x.id === b.id)) {
      const unlocked = { ...b, unlockedAt: new Date().toISOString() };
      newProfile.badges.push(unlocked);
      newBadges.push(unlocked);
    }
  }

  // Räume freischalten nach Level
  const ROOM_LEVEL_MAP: Record<number, string> = {
    1: 'elemental_lab',
    2: 'atom_chamber',
    3: 'molecule_workshop',
    4: 'reaction_room',
    5: 'crystal_archive',
    6: 'water_station',
    7: 'environmental_lab',
    8: 'secret_research_lab'
  };

  for (let lvl = 1; lvl <= newProfile.level; lvl++) {
    const roomId = ROOM_LEVEL_MAP[lvl];
    if (roomId && !newProfile.unlockedRooms.includes(roomId)) {
      newProfile.unlockedRooms.push(roomId);
    }
  }

  return {
    updatedProfile: newProfile,
    newBadges,
    newCards,
    xpEarned,
    leveledUp
  };
}
