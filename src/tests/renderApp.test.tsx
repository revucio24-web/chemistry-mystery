import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { App } from '../App';
import { LabRoomOverview } from '../components/lab/LabRoomOverview';
import { MissionList } from '../components/lab/MissionList';
import { PuzzleRunner } from '../components/puzzles/PuzzleRunner';
import { ElementCardAlbum } from '../components/cards/ElementCardAlbum';
import { ReviewCenter } from '../components/review/ReviewCenter';
import { LearningProgressView } from '../components/progress/LearningProgressView';
import { PeriodicTableModal } from '../components/common/PeriodicTableModal';
import { KidsEncyclopediaModal } from '../components/common/KidsEncyclopediaModal';
import { AtomVisualizer } from '../components/visualizers/AtomVisualizer';
import { INITIAL_PLAYER_PROFILE } from '../types/game';
import { LAB_ROOMS } from '../types/lab';
import { ALL_PUZZLES } from '../data/puzzles';
import { ELEMENTS_DATA } from '../data/elements';

describe('All Views Render Test', () => {
  const profile = { ...INITIAL_PLAYER_PROFILE };

  it('renders App cleanly with renderToString', () => {
    const html = renderToString(<App />);
    expect(html).toContain('CHEMISTRY MYSTERY');
  });

  it('renders LabRoomOverview without errors', () => {
    const html = renderToString(
      <LabRoomOverview profile={profile} onSelectRoom={() => {}} />
    );
    expect(html).toContain('Das Elementarlabor');
  });

  it('renders MissionList without errors', () => {
    const room = LAB_ROOMS[0];
    const puzzles = ALL_PUZZLES.filter(p => p.room === room.id);
    const html = renderToString(
      <MissionList
        room={room}
        puzzles={puzzles}
        profile={profile}
        onSelectPuzzle={() => {}}
        onBackToOverview={() => {}}
      />
    );
    expect(html).toContain(room.name);
  });

  it('renders PuzzleRunner for all 36 puzzles without any errors', () => {
    for (const puzzle of ALL_PUZZLES) {
      expect(() => {
        renderToString(
          <PuzzleRunner
            puzzle={puzzle}
            profile={profile}
            onUpdateProfile={() => {}}
            onBackToMissions={() => {}}
          />
        );
      }).not.toThrow();
    }
  });

  it('renders ElementCardAlbum without errors', () => {
    const html = renderToString(
      <ElementCardAlbum collectedCards={profile.elementCards} onClose={() => {}} />
    );
    expect(html).toContain('Sammelalbum');
  });

  it('renders ReviewCenter without errors', () => {
    const html = renderToString(
      <ReviewCenter profile={profile} onSelectPuzzle={() => {}} onBackToMissions={() => {}} />
    );
    expect(html).toContain('Wiederholung');
  });

  it('renders LearningProgressView without errors', () => {
    const html = renderToString(<LearningProgressView profile={profile} />);
    expect(html).toContain('Modul A');
  });

  it('renders PeriodicTableModal without errors', () => {
    const html = renderToString(
      <PeriodicTableModal isOpen={true} onClose={() => {}} />
    );
    expect(html).toContain('Periodensystem');
  });

  it('renders KidsEncyclopediaModal without errors', () => {
    const html = renderToString(
      <KidsEncyclopediaModal isOpen={true} onClose={() => {}} />
    );
    expect(html).toContain('Sparkys Forscherlexikon');
    expect(html).toContain('Was ist ein Atom?');
  });

  it('renders AtomVisualizer for all elements without errors', () => {
    for (const elem of ELEMENTS_DATA) {
      expect(() => {
        renderToString(<AtomVisualizer element={elem} size={300} />);
      }).not.toThrow();
    }
  });
});
