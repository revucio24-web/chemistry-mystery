import { INITIAL_PLAYER_PROFILE, PlayerProfile } from '../types/game';

const STORAGE_KEY = 'chemistry_mystery_save_v1';

export function loadPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') {
    return { ...INITIAL_PLAYER_PROFILE };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...INITIAL_PLAYER_PROFILE };
    }

    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    
    // Fallback-Verschmelzung mit Standardwerten, falls Felder neu hinzugefügt wurden
    return {
      ...INITIAL_PLAYER_PROFILE,
      ...parsed,
      stats: {
        ...INITIAL_PLAYER_PROFILE.stats,
        ...(parsed.stats || {})
      },
      settings: {
        ...INITIAL_PLAYER_PROFILE.settings,
        ...(parsed.settings || {})
      },
      unlockedRooms: Array.isArray(parsed.unlockedRooms) && parsed.unlockedRooms.length > 0
        ? parsed.unlockedRooms
        : ['elemental_lab'],
      completedPuzzleIds: Array.isArray(parsed.completedPuzzleIds)
        ? parsed.completedPuzzleIds
        : [],
      failedPuzzlesToReview: Array.isArray(parsed.failedPuzzlesToReview)
        ? parsed.failedPuzzlesToReview
        : [],
      puzzleStars: typeof parsed.puzzleStars === 'object' && parsed.puzzleStars !== null
        ? parsed.puzzleStars
        : {},
      dailyQuests: Array.isArray(parsed.dailyQuests)
        ? parsed.dailyQuests
        : [],
      equippedTheme: typeof parsed.equippedTheme === 'string'
        ? parsed.equippedTheme
        : 'theme_default',
      unlockedThemes: Array.isArray(parsed.unlockedThemes) && parsed.unlockedThemes.length > 0
        ? parsed.unlockedThemes
        : ['theme_default'],
      sparkyTipCount: typeof parsed.sparkyTipCount === 'number'
        ? parsed.sparkyTipCount
        : 0,
      elementCards: Array.isArray(parsed.elementCards)
        ? parsed.elementCards
        : [],
      badges: Array.isArray(parsed.badges)
        ? parsed.badges
        : [],
      sandboxSyntheses: Array.isArray(parsed.sandboxSyntheses)
        ? parsed.sandboxSyntheses
        : [],
      rewards: {
        ...INITIAL_PLAYER_PROFILE.rewards,
        ...(parsed.rewards || {})
      }
    };
  } catch (error) {
    console.warn('Fehler beim Laden des Spielstands aus localStorage, Fallback auf Standardprofil:', error);
    return { ...INITIAL_PLAYER_PROFILE };
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
    const parsed = JSON.parse(jsonString);
    if (!parsed || (parsed.format !== 'chemistry_mystery_backup' && !parsed.username)) {
      throw new Error('Ungültiges Dateiformat für Spielstand');
    }

    const profileData = parsed.data || parsed;
    const validatedProfile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      ...profileData,
      rewards: { ...INITIAL_PLAYER_PROFILE.rewards, ...(profileData.rewards || {}) },
      stats: { ...INITIAL_PLAYER_PROFILE.stats, ...(profileData.stats || {}) },
      settings: { ...INITIAL_PLAYER_PROFILE.settings, ...(profileData.settings || {}) }
    };

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
  return { ...INITIAL_PLAYER_PROFILE };
}
