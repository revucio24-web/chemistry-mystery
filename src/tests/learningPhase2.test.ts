import { describe, it, expect } from 'vitest';
import { evaluatePuzzleResult, calculateModulesProgress } from '../engine/learningEngine';
import { INITIAL_PLAYER_PROFILE, PlayerProfile } from '../types/game';
import { ELEMENTAL_LAB_PUZZLES } from '../data/puzzles';

describe('Phase 2 Qualitätssicherung: Erweitertes Lern- & Sammelsystem', () => {
  it('schaltet Elementkarten bei erfolgreicher Mission frei', () => {
    const profile = { ...INITIAL_PLAYER_PROFILE };
    const p1 = ELEMENTAL_LAB_PUZZLES[0]; // Belohnung: Wasserstoff (#1)

    const result = evaluatePuzzleResult(profile, p1, true, true);

    expect(result.newCards.length).toBe(1);
    expect(result.newCards[0].atomicNumber).toBe(1);
    expect(result.newCards[0].symbol).toBe('H');
    expect(result.newCards[0].name).toBe('Wasserstoff');
    expect(result.updatedProfile.elementCards.some(c => c.atomicNumber === 1)).toBe(true);
  });

  it('verhindert doppelte Elementkarten und vergibt Collector-Badges bei 3 Karten', () => {
    let profile: PlayerProfile = { ...INITIAL_PLAYER_PROFILE };

    // Löse Puzzle 1 (Wasserstoff)
    profile = evaluatePuzzleResult(profile, ELEMENTAL_LAB_PUZZLES[0], true, true).updatedProfile;
    // Löse Puzzle 1 erneut (keine Duplikate)
    const repeatResult = evaluatePuzzleResult(profile, ELEMENTAL_LAB_PUZZLES[0], true, true);
    expect(repeatResult.newCards.length).toBe(0);
    expect(repeatResult.updatedProfile.elementCards.length).toBe(1);

    // Löse Puzzle 2 (Kohlenstoff) und Puzzle 3 (Helium)
    profile = evaluatePuzzleResult(profile, ELEMENTAL_LAB_PUZZLES[1], true, true).updatedProfile;
    const thirdResult = evaluatePuzzleResult(profile, ELEMENTAL_LAB_PUZZLES[2], true, true);
    
    expect(thirdResult.updatedProfile.elementCards.length).toBe(3);
    // Muss das Badge "badge_element_collector_3" freigeschaltet haben
    expect(thirdResult.newBadges.some(b => b.id === 'badge_element_collector_3')).toBe(true);
  });

  it('vergütet die erfolgreiche Wiederholung aus der Spaced-Repetition-Queue mit Bonus-XP und Badge', () => {
    const p5 = ELEMENTAL_LAB_PUZZLES[4];
    
    // Simuliere einen vorherigen Fehlversuch
    const failedProfile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      failedPuzzlesToReview: [p5.id]
    };

    // Jetzt erfolgreich wiederholen
    const reviewResult = evaluatePuzzleResult(failedProfile, p5, true, false);

    // Sollte XP-Belohnung (45 XP) + Wiederholungs-Bonus (15 XP) = 60 XP erhalten
    expect(reviewResult.xpEarned).toBe(p5.xpReward + 15);
    // Aus der Queue entfernt
    expect(reviewResult.updatedProfile.failedPuzzlesToReview).not.toContain(p5.id);
    // Badge "badge_review_master" vergeben
    expect(reviewResult.newBadges.some(b => b.id === 'badge_review_master')).toBe(true);
  });

  it('berechnet den Lernfortschritt für alle 7 Curriculum-Module A bis G', () => {
    const profile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      completedPuzzleIds: [ELEMENTAL_LAB_PUZZLES[0].id] // 1 Puzzle aus Modul A gelöst
    };

    const modulesProgress = calculateModulesProgress(profile, ELEMENTAL_LAB_PUZZLES);

    expect(modulesProgress.length).toBe(7);
    const modA = modulesProgress.find(m => m.module.id === 'module_a');
    expect(modA).toBeDefined();
    expect(modA?.totalPuzzles).toBeGreaterThan(0);
    expect(modA?.solvedPuzzles).toBe(1);
    expect(modA?.progressPercent).toBeGreaterThan(0);
  });

  it('verleiht Streak-Badges bei 3 und 5 richtigen Antworten in Folge', () => {
    let profile: PlayerProfile = { ...INITIAL_PLAYER_PROFILE };

    // 3 richtige Antworten
    for (let i = 0; i < 3; i++) {
      profile = evaluatePuzzleResult(profile, ELEMENTAL_LAB_PUZZLES[i], true, true).updatedProfile;
    }
    expect(profile.badges.some(b => b.id === 'badge_streak_3')).toBe(true);

    // 2 weitere richtige Antworten (5er Serie)
    for (let i = 3; i < 5; i++) {
      profile = evaluatePuzzleResult(profile, ELEMENTAL_LAB_PUZZLES[i], true, true).updatedProfile;
    }
    expect(profile.badges.some(b => b.id === 'badge_streak_5')).toBe(true);
  });
});
