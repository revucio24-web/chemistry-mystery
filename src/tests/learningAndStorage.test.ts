import { describe, it, expect, beforeEach } from 'vitest';
import { calculateLevel, evaluatePuzzleResult } from '../engine/learningEngine';
import { INITIAL_PLAYER_PROFILE } from '../types/game';
import { ELEMENTAL_LAB_PUZZLES } from '../data/puzzles';
import { savePlayerProfile, loadPlayerProfile, exportPlayerSaveData, importPlayerSaveData } from '../engine/storage';

describe('Lern- & Level-System', () => {
  it('berechnet Level und XP-Schwellen korrekt', () => {
    // 0 XP -> Level 1
    const lvl1 = calculateLevel(0);
    expect(lvl1.level).toBe(1);
    expect(lvl1.xpToNextLevel).toBe(100);

    // 100 XP -> Level 2
    const lvl2 = calculateLevel(100);
    expect(lvl2.level).toBe(2);
    expect(lvl2.xpToNextLevel).toBe(150); // bis 250

    // 500 XP -> Level 4
    const lvl4 = calculateLevel(500);
    expect(lvl4.level).toBe(4);
  });

  it('schaltet XP, Level-Up und Badges bei richtiger Lösung frei', () => {
    const profile = { ...INITIAL_PLAYER_PROFILE };
    const puzzle = ELEMENTAL_LAB_PUZZLES[0]; // Typ 1, 30 XP

    const result = evaluatePuzzleResult(profile, puzzle, true, true);
    
    expect(result.xpEarned).toBe(40); // 30 + 10 first try bonus
    expect(result.updatedProfile.currentXP).toBe(40);
    expect(result.updatedProfile.completedPuzzleIds).toContain(puzzle.id);
    expect(result.updatedProfile.stats.currentStreak).toBe(1);
    
    // Badge für erstes gelöstes Rätsel muss vergeben sein
    expect(result.newBadges.some(b => b.id === 'badge_first_spark')).toBe(true);
  });

  it('verwaltet Spaced-Repetition bei falscher Antwort ohne Beschämung', () => {
    const profile = { ...INITIAL_PLAYER_PROFILE };
    const puzzle = ELEMENTAL_LAB_PUZZLES[1];

    const result = evaluatePuzzleResult(profile, puzzle, false, false);
    
    expect(result.xpEarned).toBe(0);
    expect(result.updatedProfile.stats.currentStreak).toBe(0);
    expect(result.updatedProfile.stats.wrongAnswersTotal).toBe(1);
    // Muss in der Wiederholungs-Warteschlange landen
    expect(result.updatedProfile.failedPuzzlesToReview).toContain(puzzle.id);
  });
});

describe('Persistenz & Spielstand', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('speichert und lädt das Spielerprofil fehlerfrei', () => {
    const customProfile = {
      ...INITIAL_PLAYER_PROFILE,
      username: 'Marie Curie',
      currentXP: 120,
      level: 2
    };

    savePlayerProfile(customProfile);
    const loaded = loadPlayerProfile();

    expect(loaded.username).toBe('Marie Curie');
    expect(loaded.currentXP).toBe(120);
    expect(loaded.level).toBe(2);
  });

  it('exportiert und importiert Backups als gültiges JSON', () => {
    const profile = {
      ...INITIAL_PLAYER_PROFILE,
      username: 'Antoine Lavoisier',
      currentXP: 450
    };

    const exportedJson = exportPlayerSaveData(profile);
    expect(exportedJson).toContain('chemistry_mystery_backup');

    const restored = importPlayerSaveData(exportedJson);
    expect(restored).not.toBeNull();
    expect(restored?.username).toBe('Antoine Lavoisier');
    expect(restored?.currentXP).toBe(450);
  });
});
