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
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discoveredAt: string;
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
  elementCards: ElementCard[];
  badges: Badge[];
  stats: PlayerStats;
  settings: {
    soundEnabled: boolean;
    soundVolume: number;
    reducedMotion: boolean;
    highContrast: boolean;
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
  elementCards: [],
  badges: [],
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
