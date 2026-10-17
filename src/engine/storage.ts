import { INITIAL_PLAYER_PROFILE, PlayerProfile, PlayerStats, PlayerRewards } from '../types/game';

const STORAGE_KEY = 'chemistry_mystery_save_v1';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

// Vereinheitlicht einen (potenziell unvollständigen oder beschädigten) Spielstand
// gegen das Standardprofil, damit jedes Feld garantiert den erwarteten Typ hat.
// Kopiert verschachtelte Arrays/Objekte, damit das Standardprofil nicht mutiert wird.
export function normalizeProfile(parsed: Partial<PlayerProfile> | null | undefined): PlayerProfile {
  const data = (parsed || {}) as Partial<PlayerProfile>;
  const rawStats = (isPlainObject(data.stats) ? data.stats : {}) as Partial<PlayerStats>;
  const rawSettings = (isPlainObject(data.settings) ? data.settings : {}) as Partial<PlayerProfile['settings']>;
  const rawRewards = (isPlainObject(data.rewards) ? data.rewards : {}) as Partial<PlayerRewards>;

  return {
    ...INITIAL_PLAYER_PROFILE,
    ...data,
    level: safeNumber(data.level, INITIAL_PLAYER_PROFILE.level),
    currentXP: safeNumber(data.currentXP, INITIAL_PLAYER_PROFILE.currentXP),
    xpToNextLevel: safeNumber(data.xpToNextLevel, INITIAL_PLAYER_PROFILE.xpToNextLevel),
    stats: {
      ...INITIAL_PLAYER_PROFILE.stats,
      ...rawStats,
      solvedByType: isPlainObject(rawStats.solvedByType)
        ? { ...(rawStats.solvedByType as Record<string, number>) }
        : {}
    },
    settings: {
      ...INITIAL_PLAYER_PROFILE.settings,
      ...rawSettings
    },
    rewards: {
      ...INITIAL_PLAYER_PROFILE.rewards,
      ...rawRewards,
      unlockedTitles: Array.isArray(rawRewards.unlockedTitles) && rawRewards.unlockedTitles.length > 0
        ? [...(rawRewards.unlockedTitles as string[])]
        : [...INITIAL_PLAYER_PROFILE.rewards.unlockedTitles]
    },
    unlockedRooms: Array.isArray(data.unlockedRooms) && data.unlockedRooms.length > 0
      ? [...data.unlockedRooms]
      : ['elemental_lab'],
    completedPuzzleIds: Array.isArray(data.completedPuzzleIds) ? [...data.completedPuzzleIds] : [],
    failedPuzzlesToReview: Array.isArray(data.failedPuzzlesToReview) ? [...data.failedPuzzlesToReview] : [],
    puzzleStars: isPlainObject(data.puzzleStars) ? { ...(data.puzzleStars as Record<string, number>) } : {},
    dailyQuests: Array.isArray(data.dailyQuests) ? [...data.dailyQuests] : [],
    equippedTheme: typeof data.equippedTheme === 'string' ? data.equippedTheme : 'theme_default',
    unlockedThemes: Array.isArray(data.unlockedThemes) && data.unlockedThemes.length > 0
      ? [...data.unlockedThemes]
      : ['theme_default'],
    sparkyTipCount: safeNumber(data.sparkyTipCount, 0),
    elementCards: Array.isArray(data.elementCards) ? [...data.elementCards] : [],
    badges: Array.isArray(data.badges) ? [...data.badges] : [],
    sandboxSyntheses: Array.isArray(data.sandboxSyntheses) ? [...data.sandboxSyntheses] : []
  };
}

export function loadPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') {
    return normalizeProfile(INITIAL_PLAYER_PROFILE);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return normalizeProfile(INITIAL_PLAYER_PROFILE);
    }

    return normalizeProfile(JSON.parse(raw) as Partial<PlayerProfile>);
  } catch (error) {
    console.warn('Fehler beim Laden des Spielstands aus localStorage, Fallback auf Standardprofil:', error);
    return normalizeProfile(INITIAL_PLAYER_PROFILE);
  }
}

export function savePlayerProfile(profile: PlayerProfile): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const updatedProfile: PlayerProfile = {
      ...profile,
      lastSavedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    return true;
  } catch (error) {
    console.error('Kritischer Fehler beim Speichern des Spielstands:', error);
    return false;
  }
}

export function exportPlayerSaveData(profile: PlayerProfile): string {
  return JSON.stringify({
    format: 'chemistry_mystery_backup',
    version: 1,
    exportDate: new Date().toISOString(),
    data: profile
  }, null, 2);
}

export function importPlayerSaveData(jsonString: string): PlayerProfile | null {
  try {
    const parsed: unknown = JSON.parse(jsonString);
    if (!isPlainObject(parsed) || (parsed.format !== 'chemistry_mystery_backup' && typeof parsed.username !== 'string')) {
      throw new Error('Ungültiges Dateiformat für Spielstand');
    }

    const profileData = isPlainObject(parsed.data) ? parsed.data : parsed;
    const validatedProfile = normalizeProfile(profileData as Partial<PlayerProfile>);

    savePlayerProfile(validatedProfile);
    return validatedProfile;
  } catch (error) {
    console.error('Import des Spielstands fehlgeschlagen:', error);
    return null;
  }
}

export function resetPlayerProfile(): PlayerProfile {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn(e);
  }
  return normalizeProfile(INITIAL_PLAYER_PROFILE);
}
