import { DifficultyLevel } from './puzzles';

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'elements' | 'molecules' | 'reactions' | 'mastery' | 'streak';
  unlockedAt?: string;
}

export interface ElementCard {
  atomicNumber: number;
  symbol: string;
  name: string;
  latinName?: string;
  atomicMass: number;
  period: number;
  group: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discoveredAt: string;
  funFact: string;
  realWorldUse: string;
  electronShells?: number[];
  colorHex?: string;
}

export interface PlayerStats {
  puzzlesSolvedCount: number;
  correctAnswersTotal: number;
  wrongAnswersTotal: number;
  hintsUsedCount: number;
  currentStreak: number;
  bestStreak: number;
  solvedByType: Record<string, number>;
}

export interface PlayerRewards {
  crystals: number;
  unlockedTitles: string[];
  activeTitle: string;
  dailyRewardStreak: number;
  lastDailyRewardClaimedDate?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  isClaimed?: boolean;
  rewardCrystals: number;
  rewardXP: number;
  icon: string;
}

export interface LabTheme {
  id: string;
  name: string;
  description: string;
  costCrystals: number;
  accentColor: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  previewGradient: string;
  icon: string;
}

export interface PlayerProfile {
  id: string;
  username: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  activeDifficulty: DifficultyLevel;
  unlockedRooms: string[];
  completedPuzzleIds: string[];
  failedPuzzlesToReview: string[]; // Spaced Repetition Queue
  puzzleStars: Record<string, number>; // puzzleId -> 1..3 Sterne
  dailyQuests: DailyQuest[];
  equippedTheme: string;
  unlockedThemes: string[];
  sparkyTipCount: number;
  elementCards: ElementCard[];
  badges: Badge[];
  sandboxSyntheses?: string[]; // Im freien Experimentierlabor entdeckte Formeln
  rewards: PlayerRewards;
  stats: PlayerStats;
  settings: {
    soundEnabled: boolean;
    soundVolume: number;
    reducedMotion: boolean;
    highContrast: boolean;
    ambientSoundEnabled?: boolean;
  };
  lastSavedAt: string;
}

export const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  id: 'player_default',
  username: 'Forscher(in)',
  level: 1,
  currentXP: 0,
  xpToNextLevel: 100,
  activeDifficulty: 'beginner',
  unlockedRooms: ['elemental_lab'], // Erstes Labor sofort freigeschaltet
  completedPuzzleIds: [],
  failedPuzzlesToReview: [],
  puzzleStars: {},
  dailyQuests: [],
  equippedTheme: 'theme_default',
  unlockedThemes: ['theme_default'],
  sparkyTipCount: 0,
  elementCards: [],
  badges: [],
  sandboxSyntheses: [],
  rewards: {
    crystals: 25,
    unlockedTitles: ['Junior-Entdecker'],
    activeTitle: 'Junior-Entdecker',
    dailyRewardStreak: 0
  },
  stats: {
    puzzlesSolvedCount: 0,
    correctAnswersTotal: 0,
    wrongAnswersTotal: 0,
    hintsUsedCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    solvedByType: {}
  },
  settings: {
    soundEnabled: true,
    soundVolume: 0.5,
    reducedMotion: false,
    highContrast: false
  },
  lastSavedAt: new Date().toISOString()
};
