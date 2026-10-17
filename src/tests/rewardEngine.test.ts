import { describe, it, expect } from 'vitest';
import { INITIAL_PLAYER_PROFILE, PlayerProfile } from '../types/game';
import {
  checkDailyRewardStatus,
  claimDailyReward,
  awardPuzzleCrystals,
  evaluateAvailableTitles,
  setActiveTitle
} from '../engine/rewardEngine';
import { evaluatePuzzleResult } from '../engine/learningEngine';
import { ELEMENTAL_LAB_PUZZLES } from '../data/puzzles';

describe('Reward Engine & Belohnungssystem', () => {
  it('initializes default profile with Junior-Entdecker title and start crystals', () => {
    expect(INITIAL_PLAYER_PROFILE.rewards.crystals).toBe(25);
    expect(INITIAL_PLAYER_PROFILE.rewards.unlockedTitles).toContain('Junior-Entdecker');
    expect(INITIAL_PLAYER_PROFILE.rewards.activeTitle).toBe('Junior-Entdecker');
    expect(INITIAL_PLAYER_PROFILE.rewards.dailyRewardStreak).toBe(0);
  });

  it('allows claiming the first daily bonus when not claimed yet', () => {
    const status = checkDailyRewardStatus(INITIAL_PLAYER_PROFILE.rewards);
    expect(status.canClaim).toBe(true);
    expect(status.nextDay).toBe(1);
    expect(status.crystalsForToday).toBe(10);

    const claimRes = claimDailyReward(INITIAL_PLAYER_PROFILE);
    expect(claimRes.claimedCrystals).toBe(10);
    expect(claimRes.streakDay).toBe(1);
    expect(claimRes.updatedProfile.rewards.crystals).toBe(35);
    expect(claimRes.updatedProfile.rewards.dailyRewardStreak).toBe(1);

    // Can not claim again on the same day
    const statusAfter = checkDailyRewardStatus(claimRes.updatedProfile.rewards);
    expect(statusAfter.canClaim).toBe(false);

    // Claim again should return 0
    const claimRes2 = claimDailyReward(claimRes.updatedProfile);
    expect(claimRes2.claimedCrystals).toBe(0);
  });

  it('awards crystals on solving puzzles', () => {
    const profile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      rewards: {
        ...INITIAL_PLAYER_PROFILE.rewards,
        crystals: 25
      }
    };

    const res = awardPuzzleCrystals(profile, true, false);
    // first solve (5 + 10) + no hint (5) = 20
    expect(res.earnedCrystals).toBe(20);
    expect(res.updatedProfile.rewards.crystals).toBe(45);
  });

  it('evaluates and unlocks titles when conditions are met', () => {
    const highProfile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      stats: {
        ...INITIAL_PLAYER_PROFILE.stats,
        puzzlesSolvedCount: 15
      },
      rewards: {
        ...INITIAL_PLAYER_PROFILE.rewards,
        crystals: 400,
        unlockedTitles: ['Junior-Entdecker']
      }
    };

    const newTitles = evaluateAvailableTitles(highProfile);
    expect(newTitles).toContain('Reagenzglas-Pionier');
    expect(newTitles).toContain('Elementar-Magier');
    expect(newTitles).toContain('Molekül-Meister');
    expect(newTitles).toContain('Atomarer Chemienaut');
  });

  it('allows setting active title among unlocked titles', () => {
    const profile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      rewards: {
        ...INITIAL_PLAYER_PROFILE.rewards,
        unlockedTitles: ['Junior-Entdecker', 'Reagenzglas-Pionier'],
        activeTitle: 'Junior-Entdecker'
      }
    };

    const updated = setActiveTitle(profile, 'Reagenzglas-Pionier');
    expect(updated.rewards.activeTitle).toBe('Reagenzglas-Pionier');

    // Should reject locked titles
    const rejected = setActiveTitle(updated, 'Kosmischer Alchemist');
    expect(rejected.rewards.activeTitle).toBe('Reagenzglas-Pionier');
  });

  it('integrates crystal payout directly into evaluatePuzzleResult', () => {
    const profile = { ...INITIAL_PLAYER_PROFILE };
    const puzzle = ELEMENTAL_LAB_PUZZLES[0];

    const result = evaluatePuzzleResult(profile, puzzle, true, true);
    expect(result.crystalsEarned).toBeGreaterThan(0);
    expect(result.updatedProfile.rewards.crystals).toBeGreaterThan(profile.rewards.crystals);
  });
});
