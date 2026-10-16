import { PlayerProfile, Badge } from '../types/game';
import { Puzzle } from '../types/puzzles';

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
  }
];

export function calculateLevel(totalXP: number): { level: number; currentXP: number; xpToNextLevel: number; progressPercent: number } {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }

  const currentLevelBase = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelThreshold = LEVEL_THRESHOLDS[level] || currentLevelBase + 500;
  const levelXP = totalXP - currentLevelBase;
  const neededXP = nextLevelThreshold - currentLevelBase;
  const progressPercent = Math.min(100, Math.round((levelXP / neededXP) * 100));

  return {
    level,
    currentXP: totalXP,
    xpToNextLevel: Math.max(0, nextLevelThreshold - totalXP),
    progressPercent
  };
}

export function evaluatePuzzleResult(
  profile: PlayerProfile,
  puzzle: Puzzle,
  isCorrect: boolean,
  firstTry: boolean
): { updatedProfile: PlayerProfile; newBadges: Badge[]; xpEarned: number; leveledUp: boolean } {
  const newProfile = { ...profile };
  let xpEarned = 0;
  const newBadges: Badge[] = [];
  const prevLevel = profile.level;

  if (isCorrect) {
    // Grund-XP aus dem Rätsel
    xpEarned = puzzle.xpReward;
    if (firstTry) {
      xpEarned += 10; // Bonus für sofortiges Verstehen
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

    // Aus der Wiederholungs-Queue entfernen, wenn erfolgreich gelöst
    newProfile.failedPuzzlesToReview = newProfile.failedPuzzlesToReview.filter(id => id !== puzzle.id);

    // Typ-Zähler inkrementieren
    newProfile.stats.solvedByType[puzzle.type] = (newProfile.stats.solvedByType[puzzle.type] || 0) + 1;

    // Badges prüfen
    // 1. Erstes gelöstes Rätsel
    if (newProfile.stats.puzzlesSolvedCount === 1) {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_first_spark');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    // 2. Molekül Baukasten
    if (puzzle.type === 'molecule_builder') {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_molecule_crafter');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    // 3. Gleichungs-Meister
    if (puzzle.type === 'equation_balancer') {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_balance_master');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    // 4. Detektiv
    if (puzzle.type === 'mystery_detective') {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_detective_mind');
      if (b && !newProfile.badges.some(x => x.id === b.id)) {
        const unlocked = { ...b, unlockedAt: new Date().toISOString() };
        newProfile.badges.push(unlocked);
        newBadges.push(unlocked);
      }
    }

    // 5. Streak 3
    if (newProfile.stats.currentStreak >= 3) {
      const b = AVAILABLE_BADGES.find(x => x.id === 'badge_streak_3');
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
    xpEarned,
    leveledUp
  };
}
