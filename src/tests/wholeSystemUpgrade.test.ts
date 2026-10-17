import { describe, it, expect } from 'vitest';
import { 
  calculatePuzzleStars, 
  generateDailyQuests, 
  claimDailyQuestReward, 
  unlockAndEquipTheme, 
  LAB_THEMES 
} from '../engine/rewardEngine';
import { INITIAL_PLAYER_PROFILE, PlayerProfile } from '../types/game';
import { soundEngine } from '../engine/audio';

describe('Ganzheitliches Spielsystem-Upgrade (Stars, Quests, Themes, Audio & Haptik)', () => {
  it('berechnet 3-Sterne-Wertung korrekt nach Didaktik-Kriterien', () => {
    // 1. Versuch ohne Hinweis = 3 Sterne
    expect(calculatePuzzleStars(1, 0)).toBe(3);

    // 2. Versuch oder mit 1 Hinweis = 2 Sterne
    expect(calculatePuzzleStars(2, 0)).toBe(2);
    expect(calculatePuzzleStars(1, 1)).toBe(2);
    expect(calculatePuzzleStars(2, 1)).toBe(2);

    // Mehr als 2 Versuche oder mehrere Hinweise = 1 Stern
    expect(calculatePuzzleStars(3, 0)).toBe(1);
    expect(calculatePuzzleStars(3, 2)).toBe(1);
  });

  it('generiert 3 strukturierte tägliche Forschungsaufträge', () => {
    const quests = generateDailyQuests('2026-10-16');
    expect(quests.length).toBe(3);

    expect(quests[0].title).toBe('Labor-Einsatz');
    expect(quests[0].rewardCrystals).toBeGreaterThan(0);
    expect(quests[0].rewardXP).toBeGreaterThan(0);

    expect(quests[1].title).toBe('Quanten-Inspektion');
    expect(quests[2].title).toBe('Genie-Serie');

    // Behält bestehende Quests bei gleichem Datum
    const cached = generateDailyQuests('2026-10-16', quests);
    expect(cached).toBe(quests);
  });

  it('erlaubt das Einlösen von erfüllten Tagesquests mit Kristall- & XP-Gutschrift', () => {
    const quests = generateDailyQuests('2026-10-16');
    quests[0].currentCount = quests[0].targetCount;
    quests[0].isCompleted = true;

    const profile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      dailyQuests: quests,
      rewards: { ...INITIAL_PLAYER_PROFILE.rewards, crystals: 50 },
      currentXP: 100
    };

    const result = claimDailyQuestReward(profile, quests[0].id);
    expect(result.claimed).toBe(true);
    expect(result.crystals).toBe(quests[0].rewardCrystals);
    expect(result.xp).toBe(quests[0].rewardXP);

    expect(result.updatedProfile.rewards.crystals).toBe(50 + quests[0].rewardCrystals);
    expect(result.updatedProfile.currentXP).toBe(100 + quests[0].rewardXP);
    expect(result.updatedProfile.dailyQuests[0].isClaimed).toBe(true);

    // Zweites Einlösen wird abgewiesen
    const secondTry = claimDailyQuestReward(result.updatedProfile, quests[0].id);
    expect(secondTry.claimed).toBe(false);
  });

  it('verwaltet Labor-Themes mit Kauf- und Ausrüst-Logik', () => {
    expect(LAB_THEMES.length).toBeGreaterThanOrEqual(4);

    const alchemist = LAB_THEMES.find(t => t.id === 'theme_alchemist')!;
    expect(alchemist).toBeDefined();

    // Zu wenig Kristalle
    const poorProfile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      rewards: { ...INITIAL_PLAYER_PROFILE.rewards, crystals: 10 }
    };
    const failBuy = unlockAndEquipTheme(poorProfile, 'theme_alchemist');
    expect(failBuy.success).toBe(false);

    // Genug Kristalle -> Kauf & Ausrüsten
    const richProfile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      rewards: { ...INITIAL_PLAYER_PROFILE.rewards, crystals: 300 }
    };
    const successBuy = unlockAndEquipTheme(richProfile, 'theme_alchemist');
    expect(successBuy.success).toBe(true);
    expect(successBuy.updatedProfile.equippedTheme).toBe('theme_alchemist');
    expect(successBuy.updatedProfile.unlockedThemes).toContain('theme_alchemist');
    expect(successBuy.updatedProfile.rewards.crystals).toBe(300 - alchemist.costCrystals);

    // Bereits freigeschaltet -> kostenloses Anlegen
    const alreadyUnlocked = unlockAndEquipTheme(successBuy.updatedProfile, 'theme_default');
    expect(alreadyUnlocked.success).toBe(true);
    expect(alreadyUnlocked.updatedProfile.equippedTheme).toBe('theme_default');
  });

  it('unterstützt Combo-, Chirp-, Star- und Haptik-Methoden in soundEngine', () => {
    expect(typeof soundEngine.playCombo).toBe('function');
    expect(typeof soundEngine.playSparkyChirp).toBe('function');
    expect(typeof soundEngine.playStarEarned).toBe('function');
    expect(typeof soundEngine.playFlaskBubble).toBe('function');
    expect(typeof soundEngine.triggerHaptic).toBe('function');

    expect(() => soundEngine.playCombo(3)).not.toThrow();
    expect(() => soundEngine.playSparkyChirp('celebrate')).not.toThrow();
    expect(() => soundEngine.playStarEarned(3)).not.toThrow();
    expect(() => soundEngine.playFlaskBubble()).not.toThrow();
    expect(() => soundEngine.triggerHaptic('success')).not.toThrow();
  });
});
