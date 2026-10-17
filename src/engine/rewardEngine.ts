import { PlayerProfile, PlayerRewards, DailyQuest, LabTheme } from '../types/game';

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

export interface TitleDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredCrystals: number;
  requiredPuzzles?: number;
}

export const LAB_THEMES: LabTheme[] = [
  {
    id: 'theme_default',
    name: 'Cyber-Labor',
    description: 'Futuristischer Forschungsraum mit glühenden Neon-Anzeigen & holografischer Konsole.',
    costCrystals: 0,
    accentColor: '#06b6d4',
    bgClass: 'from-slate-950 via-slate-900 to-cyan-950/40',
    borderClass: 'border-cyan-500/40',
    badgeClass: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    previewGradient: 'from-cyan-500 to-blue-600',
    icon: '⚡'
  },
  {
    id: 'theme_alchemist',
    name: 'Alchemisten-Bibliothek',
    description: 'Uralte Folianten, warme Messinginstrumente und mystisch dampfende Elixiere.',
    costCrystals: 150,
    accentColor: '#f59e0b',
    bgClass: 'from-slate-950 via-amber-950/30 to-amber-900/20',
    borderClass: 'border-amber-500/40',
    badgeClass: 'bg-amber-950 text-amber-300 border-amber-800',
    previewGradient: 'from-amber-500 to-orange-600',
    icon: '📜'
  },
  {
    id: 'theme_bio_emerald',
    name: 'Bio-Smaragd Gewächshaus',
    description: 'Lebendige Pflanzenzellen, Chlorophyll-Reaktoren und natürliche Synthesen.',
    costCrystals: 200,
    accentColor: '#10b981',
    bgClass: 'from-slate-950 via-emerald-950/30 to-teal-950/30',
    borderClass: 'border-emerald-500/40',
    badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    previewGradient: 'from-emerald-500 to-teal-600',
    icon: '🌿'
  },
  {
    id: 'theme_cryo_frost',
    name: 'Kryo-Quantenkammer',
    description: 'Tieftemperatur-Forschung nahe dem absoluten Nullpunkt mit schimmernden Eis-Kristallen.',
    costCrystals: 300,
    accentColor: '#38bdf8',
    bgClass: 'from-slate-950 via-sky-950/40 to-blue-950/30',
    borderClass: 'border-sky-400/50',
    badgeClass: 'bg-sky-950 text-sky-200 border-sky-800',
    previewGradient: 'from-sky-400 to-indigo-500',
    icon: '❄️'
  }
];

export const SCIENTIST_TITLES: TitleDefinition[] = [
  {
    id: 'junior_explorer',
    name: 'Junior-Entdecker',
    icon: '🔍',
    description: 'Dein erstes Abenteuer in der faszinierenden Welt der Atome!',
    requiredCrystals: 0,
    requiredPuzzles: 0
  },
  {
    id: 'test_tube_pioneer',
    name: 'Reagenzglas-Pionier',
    icon: '🧪',
    description: 'Sicher im Umgang mit Pipette und Bunsenbrenner.',
    requiredCrystals: 50,
    requiredPuzzles: 3
  },
  {
    id: 'element_wizard',
    name: 'Elementar-Magier',
    icon: '⚡',
    description: 'Kennt die Bausteine der Materie wie seine Westentasche.',
    requiredCrystals: 100,
    requiredPuzzles: 6
  },
  {
    id: 'molecule_master',
    name: 'Molekül-Meister',
    icon: '🔬',
    description: 'Verbindet Atome spielend leicht zu neuen Stoffen.',
    requiredCrystals: 200,
    requiredPuzzles: 10
  },
  {
    id: 'atomic_chemonaut',
    name: 'Atomarer Chemienaut',
    icon: '🪐',
    description: 'Erforscht die Geheimnisse bis tief in den Atomkern.',
    requiredCrystals: 350,
    requiredPuzzles: 15
  },
  {
    id: 'periodic_grandmaster',
    name: 'Großmeister der Elemente',
    icon: '👑',
    description: 'Kein Element im Periodensystem bleibt dir verborgen.',
    requiredCrystals: 500,
    requiredPuzzles: 22
  },
  {
    id: 'cosmic_alchemist',
    name: 'Kosmischer Alchemist',
    icon: '✨',
    description: 'Wandelt Wissen in pure Wissenschaftsmagie um!',
    requiredCrystals: 750,
    requiredPuzzles: 30
  },
  {
    id: 'nobel_sparky',
    name: 'Ehren-Chemiker von Sparky',
    icon: '🏆',
    description: 'Die höchste Auszeichnung im gesamten Sparky-Labor!',
    requiredCrystals: 1000,
    requiredPuzzles: 36
  }
];

export const DAILY_STREAK_REWARDS = [
  { day: 1, crystals: 10, bonusText: 'Kleine Entdecker-Prämie' },
  { day: 2, crystals: 15, bonusText: 'Lern-Schwung!' },
  { day: 3, crystals: 20, bonusText: 'Super Forscher-Fleiß!' },
  { day: 4, crystals: 25, bonusText: 'Labor-Experte im Anflug!' },
  { day: 5, crystals: 35, bonusText: 'Mega Wissenschafts-Bonus!' },
  { day: 6, crystals: 50, bonusText: 'Genie-Kristallregen!' },
  { day: 7, crystals: 100, bonusText: 'Goldener Meisterkristall 🌟' }
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function checkDailyRewardStatus(rewards: PlayerRewards): {
  canClaim: boolean;
  currentStreak: number;
  nextDay: number;
  crystalsForToday: number;
  bonusText: string;
} {
  const today = getTodayDateString();
  const lastDate = rewards.lastDailyRewardClaimedDate;

  if (!lastDate) {
    const rewardInfo = DAILY_STREAK_REWARDS[0];
    return {
      canClaim: true,
      currentStreak: 0,
      nextDay: 1,
      crystalsForToday: rewardInfo.crystals,
      bonusText: rewardInfo.bonusText
    };
  }

  if (lastDate === today) {
    const currentDay = Math.max(1, ((rewards.dailyRewardStreak - 1) % 7) + 1);
    const rewardInfo = DAILY_STREAK_REWARDS[currentDay - 1];
    return {
      canClaim: false,
      currentStreak: rewards.dailyRewardStreak,
      nextDay: currentDay,
      crystalsForToday: rewardInfo.crystals,
      bonusText: rewardInfo.bonusText
    };
  }

  // Überprüfe, ob gestern beansprucht wurde (oder ob die Serie gerissen ist)
  const lastTime = new Date(lastDate).getTime();
  const todayTime = new Date(today).getTime();
  const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));

  let nextStreak = 1;
  if (diffDays === 1) {
    // Fortlaufende Serie
    nextStreak = rewards.dailyRewardStreak + 1;
  } else {
    // Serie unterbrochen, Neustart bei Tag 1
    nextStreak = 1;
  }

  const cycleDay = ((nextStreak - 1) % 7) + 1;
  const rewardInfo = DAILY_STREAK_REWARDS[cycleDay - 1];

  return {
    canClaim: true,
    currentStreak: rewards.dailyRewardStreak,
    nextDay: cycleDay,
    crystalsForToday: rewardInfo.crystals,
    bonusText: rewardInfo.bonusText
  };
}

export function claimDailyReward(profile: PlayerProfile): {
  updatedProfile: PlayerProfile;
  claimedCrystals: number;
  streakDay: number;
  newUnlockedTitles: string[];
} {
  const status = checkDailyRewardStatus(profile.rewards);
  if (!status.canClaim) {
    return {
      updatedProfile: profile,
      claimedCrystals: 0,
      streakDay: status.nextDay,
      newUnlockedTitles: []
    };
  }

  const today = getTodayDateString();
  const lastDate = profile.rewards.lastDailyRewardClaimedDate;
  let newStreak = 1;
  if (lastDate) {
    const lastTime = new Date(lastDate).getTime();
    const todayTime = new Date(today).getTime();
    const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak = profile.rewards.dailyRewardStreak + 1;
    }
  }

  const cycleDay = ((newStreak - 1) % 7) + 1;
  const rewardInfo = DAILY_STREAK_REWARDS[cycleDay - 1];
  const newCrystals = profile.rewards.crystals + rewardInfo.crystals;

  const updatedRewards: PlayerRewards = {
    ...profile.rewards,
    crystals: newCrystals,
    dailyRewardStreak: newStreak,
    lastDailyRewardClaimedDate: today
  };

  const updatedProfile: PlayerProfile = {
    ...profile,
    rewards: updatedRewards
  };

  const newUnlockedTitles = evaluateAvailableTitles(updatedProfile);
  if (newUnlockedTitles.length > 0) {
    updatedProfile.rewards.unlockedTitles = [
      ...updatedProfile.rewards.unlockedTitles,
      ...newUnlockedTitles
    ];
  }

  return {
    updatedProfile,
    claimedCrystals: rewardInfo.crystals,
    streakDay: cycleDay,
    newUnlockedTitles
  };
}

export function evaluateAvailableTitles(profile: PlayerProfile): string[] {
  const currentUnlocked = new Set(profile.rewards.unlockedTitles);
  const newlyUnlocked: string[] = [];

  for (const title of SCIENTIST_TITLES) {
    if (!currentUnlocked.has(title.name)) {
      const crystalMatch = profile.rewards.crystals >= title.requiredCrystals;
      const puzzleMatch = (profile.stats.puzzlesSolvedCount || 0) >= (title.requiredPuzzles || 0);
      if (crystalMatch && puzzleMatch) {
        newlyUnlocked.push(title.name);
      }
    }
  }

  return newlyUnlocked;
}

export function awardPuzzleCrystals(
  profile: PlayerProfile,
  isFirstSolve: boolean,
  usedHint: boolean
): {
  updatedProfile: PlayerProfile;
  earnedCrystals: number;
  newUnlockedTitles: string[];
} {
  let earned = 5; // Standard-Belohnung für jedes gelöste Rätsel
  if (isFirstSolve) {
    earned += 10; // Extra-Prämie für das allererste Meistern
  }
  if (!usedHint) {
    earned += 5; // Bonus für eigenständiges Lösen ohne Tipp
  }

  const updatedRewards: PlayerRewards = {
    ...profile.rewards,
    crystals: profile.rewards.crystals + earned
  };

  const updatedProfile: PlayerProfile = {
    ...profile,
    rewards: updatedRewards
  };

  const newUnlockedTitles = evaluateAvailableTitles(updatedProfile);
  if (newUnlockedTitles.length > 0) {
    updatedProfile.rewards.unlockedTitles = [
      ...updatedProfile.rewards.unlockedTitles,
      ...newUnlockedTitles
    ];
  }

  return {
    updatedProfile,
    earnedCrystals: earned,
    newUnlockedTitles
  };
}

export function setActiveTitle(profile: PlayerProfile, titleName: string): PlayerProfile {
  if (!profile.rewards.unlockedTitles.includes(titleName)) {
    return profile;
  }

  return {
    ...profile,
    rewards: {
      ...profile.rewards,
      activeTitle: titleName
    }
  };
}

// 3-Sterne-Berechnung: 3 Sterne bei fehlerfreiem ersten Versuch ohne Tipp
export function calculatePuzzleStars(attemptsCount: number, hintsUsed: number): 1 | 2 | 3 {
  if (attemptsCount <= 1 && hintsUsed === 0) return 3;
  if (attemptsCount <= 2 && hintsUsed <= 1) return 2;
  return 1;
}

// Tägliche Forschungsaufträge generieren
export function generateDailyQuests(dateStr: string, existingQuests?: DailyQuest[]): DailyQuest[] {
  if (existingQuests && existingQuests.length >= 3) {
    const isToday = existingQuests[0].id.includes(dateStr);
    if (isToday) return existingQuests;
  }

  return [
    {
      id: `quest_lab_${dateStr}`,
      title: 'Labor-Einsatz',
      description: 'Löse 2 beliebige Chemie-Rätsel in den Laborräumen.',
      targetCount: 2,
      currentCount: 0,
      isCompleted: false,
      isClaimed: false,
      rewardCrystals: 20,
      rewardXP: 30,
      icon: '🧪'
    },
    {
      id: `quest_pse_${dateStr}`,
      title: 'Quanten-Inspektion',
      description: 'Erforsche das Periodensystem oder mache 1 Quantensprung.',
      targetCount: 1,
      currentCount: 0,
      isCompleted: false,
      isClaimed: false,
      rewardCrystals: 15,
      rewardXP: 25,
      icon: '⚛️'
    },
    {
      id: `quest_streak_${dateStr}`,
      title: 'Genie-Serie',
      description: 'Erreiche eine 2er-Treffer-Serie ohne Fehler.',
      targetCount: 2,
      currentCount: 0,
      isCompleted: false,
      isClaimed: false,
      rewardCrystals: 25,
      rewardXP: 40,
      icon: '🔥'
    }
  ];
}

// Fortschritt einer Tagesquest erhöhen (z.B. PSE-Öffnung, Quantensprung)
export function advanceDailyQuest(
  profile: PlayerProfile,
  questIdPrefix: string,
  amount: number = 1
): PlayerProfile {
  const quests = profile.dailyQuests || [];
  if (quests.length === 0) return profile;

  let changed = false;
  const updatedQuests = quests.map(q => {
    if (q.id.includes(questIdPrefix) && !q.isCompleted) {
      const nextCount = Math.min(q.targetCount, q.currentCount + amount);
      const isCompleted = nextCount >= q.targetCount;
      if (nextCount !== q.currentCount || isCompleted !== q.isCompleted) {
        changed = true;
      }
      return { ...q, currentCount: nextCount, isCompleted };
    }
    return q;
  });

  return changed ? { ...profile, dailyQuests: updatedQuests } : profile;
}

// Belohnung für eine erledigte Tagesquest abholen
export function claimDailyQuestReward(
  profile: PlayerProfile,
  questId: string
): { updatedProfile: PlayerProfile; claimed: boolean; crystals: number; xp: number } {
  const quests = profile.dailyQuests || [];
  const questIdx = quests.findIndex(q => q.id === questId);
  if (questIdx === -1) {
    return { updatedProfile: profile, claimed: false, crystals: 0, xp: 0 };
  }

  const quest = quests[questIdx];
  if (!quest.isCompleted || quest.isClaimed) {
    return { updatedProfile: profile, claimed: false, crystals: 0, xp: 0 };
  }

  const updatedQuests = [...quests];
  updatedQuests[questIdx] = { ...quest, isClaimed: true };

  const newCrystals = profile.rewards.crystals + quest.rewardCrystals;
  const newXP = profile.currentXP + quest.rewardXP;
  const levelInfo = calculateLevel(newXP);

  const updatedProfile: PlayerProfile = {
    ...profile,
    currentXP: newXP,
    level: levelInfo.level,
    xpToNextLevel: levelInfo.xpToNextLevel,
    dailyQuests: updatedQuests,
    rewards: {
      ...profile.rewards,
      crystals: newCrystals
    }
  };

  const newUnlockedTitles = evaluateAvailableTitles(updatedProfile);
  if (newUnlockedTitles.length > 0) {
    updatedProfile.rewards.unlockedTitles = [
      ...updatedProfile.rewards.unlockedTitles,
      ...newUnlockedTitles
    ];
  }

  return {
    updatedProfile,
    claimed: true,
    crystals: quest.rewardCrystals,
    xp: quest.rewardXP
  };
}

// Labor-Theme freischalten und anlegen
export function unlockAndEquipTheme(
  profile: PlayerProfile,
  themeId: string
): { updatedProfile: PlayerProfile; success: boolean; message: string } {
  const theme = LAB_THEMES.find(t => t.id === themeId);
  if (!theme) {
    return { updatedProfile: profile, success: false, message: 'Unbekanntes Labor-Theme.' };
  }

  const unlocked = profile.unlockedThemes || ['theme_default'];
  if (unlocked.includes(themeId)) {
    // Bereits freigeschaltet -> nur anlegen
    return {
      updatedProfile: { ...profile, equippedTheme: themeId },
      success: true,
      message: `${theme.name} wurde als aktives Labor-Design angelegt!`
    };
  }

  // Noch nicht freigeschaltet -> prüfen ob genug Kristalle vorhanden sind
  if (profile.rewards.crystals < theme.costCrystals) {
    return {
      updatedProfile: profile,
      success: false,
      message: `Du benötigst ${theme.costCrystals} Kristalle (du hast ${profile.rewards.crystals}).`
    };
  }

  const updatedProfile: PlayerProfile = {
    ...profile,
    equippedTheme: themeId,
    unlockedThemes: [...unlocked, themeId],
    rewards: {
      ...profile.rewards,
      crystals: profile.rewards.crystals - theme.costCrystals
    }
  };

  return {
    updatedProfile,
    success: true,
    message: `${theme.name} erfolgreich freigeschaltet und angelegt!`
  };
}
