import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { App } from '../App';
import { INITIAL_PLAYER_PROFILE } from '../types/game';

// Inform React that act environment is enabled
// @ts-expect-error global IS_REACT_ACT_ENVIRONMENT
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Interactive App Full-Stack & UI E2E Tests (React 19 & Happy-DOM)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('chemistry_mystery_save_v1', JSON.stringify(INITIAL_PLAYER_PROFILE));
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('1. mountet die App fehlerfrei und zeigt Header & Begrüßung', async () => {
    await act(async () => {
      root.render(<App />);
    });

    expect(container.textContent).toContain('CHEMISTRY MYSTERY');
    expect(container.textContent).toContain('Entdecke die Geheimnisse der chemischen Elemente');
    expect(container.textContent).toContain('Das Elementarlabor');
  });

  it('2. navigiert per Klick ins Elementarlabor und zeigt die Missionsliste', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const enterBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.includes('Elementarlabor betreten')
    );
    expect(enterBtn).toBeDefined();

    await act(async () => {
      enterBtn?.click();
    });

    expect(container.textContent).toContain('Das Elementarlabor');
    expect(container.textContent).toContain('Verfügbare Forschungsmissionen');
    expect(container.textContent).toContain('Elemente zuordnen');
  });

  it('3. startet ein Rätsel, interagiert mit Paaren und liefert didaktisches Feedback', async () => {
    await act(async () => {
      root.render(<App />);
    });

    // 1. Elementarlabor betreten
    const enterBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.includes('Elementarlabor betreten')
    );
    await act(async () => {
      enterBtn?.click();
    });

    // 2. Klicke auf die erste Mission
    const missionCard = Array.from(container.querySelectorAll('div')).find(
      d => d.textContent?.includes('Die Glyphen der Alchemie') && d.className.includes('cursor-pointer')
    );
    expect(missionCard).toBeDefined();

    await act(async () => {
      missionCard?.click();
    });

    // Prüfe, ob Puzzle aktiv ist
    expect(container.textContent).toContain('Die Glyphen der Alchemie');
    expect(container.textContent).toContain('Labor-Instruktion:');

    // 3. Klicke auf Tipp / Hinweis
    const hintBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.includes('Tipp') || b.textContent?.includes('Hinweis')
    );
    if (hintBtn) {
      await act(async () => {
        hintBtn.click();
      });
      expect(container.textContent).toContain('Tipp:');
    }

    // 4. Ordne Paare zu: Klicke links "H" und rechts "Wasserstoff"
    const buttons = Array.from(container.querySelectorAll('button'));
    const hBtn = buttons.find(b => b.textContent?.trim().startsWith('H'));
    const wasserstoffBtn = buttons.find(b => b.textContent?.trim() === 'Wasserstoff');

    if (hBtn && wasserstoffBtn) {
      await act(async () => {
        hBtn.click();
      });
      await act(async () => {
        wasserstoffBtn.click();
      });
      expect(container.textContent).toContain('1 von 4 verknüpft');
    }

    // 5. Klicke auf "Zuordnung überprüfen"
    const checkBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.includes('überprüfen')
    );
    if (checkBtn) {
      await act(async () => {
        checkBtn.click();
      });

      // Es muss didaktisches Feedback geben
      expect(
        container.textContent?.includes('Erklärung') ||
        container.textContent?.includes('Richtig') ||
        container.textContent?.includes('Denkfehler') ||
        container.textContent?.includes('Noch nicht vollständig') ||
        container.textContent?.includes('Regel') ||
        container.textContent?.includes('Lateinische')
      ).toBe(true);
    }
  });

  it('4. öffnet und schließt das Periodensystem-Modal (PSE)', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const pseBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.includes('PSE') || b.textContent?.includes('Periodensystem')
    );
    expect(pseBtn).toBeDefined();

    await act(async () => {
      pseBtn?.click();
    });

    expect(container.textContent).toContain('Periodensystem der Elemente');

    // Schließen
    const closeBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.getAttribute('aria-label') === 'Schließen' || b.textContent?.trim() === '✕'
    );
    if (closeBtn) {
      await act(async () => {
        closeBtn.click();
      });
      expect(container.textContent).not.toContain('Periodensystem der Elemente');
    }
  });

  it('5. öffnet und wechselt zwischen Lernmodulen, Sammelkarten und Wiederholung', async () => {
    await act(async () => {
      root.render(<App />);
    });

    // 1. Karten-Album
    const cardsBtn = Array.from(container.querySelectorAll<HTMLButtonElement>('header button')).find(
      b => b.textContent?.includes('Karten')
    );
    await act(async () => {
      cardsBtn?.click();
    });
    expect(container.textContent).toContain('Sammelalbum');

    // 2. Wiederholungs-Zentrum
    const reviewBtn = Array.from(container.querySelectorAll<HTMLButtonElement>('header button')).find(
      b => b.textContent?.includes('Wiederholen')
    );
    await act(async () => {
      reviewBtn?.click();
    });
    expect(container.textContent).toContain('Wiederholung');

    // 3. Lernmodule Fortschritt
    const progressBtn = Array.from(container.querySelectorAll<HTMLButtonElement>('header button')).find(
      b => b.textContent?.includes('Lernmodule')
    );
    await act(async () => {
      progressBtn?.click();
    });
    expect(container.textContent).toContain('Modul A');
    expect(container.textContent).toContain('Modul G');
  });

  it('6. schaltet Barrierefreiheit / Reduzierte Animationen und Sound um', async () => {
    await act(async () => {
      root.render(<App />);
    });

    // Reduced motion toggle
    const motionBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.getAttribute('title')?.includes('Animationen')
    );
    if (motionBtn) {
      await act(async () => {
        motionBtn.click();
      });
      expect(document.body.classList.contains('reduced-motion')).toBe(true);

      await act(async () => {
        motionBtn.click();
      });
      expect(document.body.classList.contains('reduced-motion')).toBe(false);
    }

    // Sound toggle
    const soundBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.getAttribute('title')?.includes('Sound') || b.getAttribute('title')?.includes('Ton')
    );
    if (soundBtn) {
      await act(async () => {
        soundBtn.click();
      });
      const saved = JSON.parse(localStorage.getItem('chemistry_mystery_save_v1') || '{}');
      expect(saved.settings?.soundEnabled).toBe(false);
    }
  });

  it('7. öffnet das Schwierigkeitsgrad-Modal und ändert die Spielstufe', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const diffBtn = Array.from(container.querySelectorAll<HTMLButtonElement>('header button')).find(
      b => b.textContent?.includes('Anfänger') || b.textContent?.includes('Entdecker')
    );
    expect(diffBtn).toBeDefined();

    await act(async () => {
      diffBtn?.click();
    });

    expect(container.textContent).toContain('Schwierigkeitsgrad anpassen');
    expect(container.textContent).toContain('Chemieexperte');

    // Wähle Fortgeschritten
    const advOption = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.includes('Fortgeschritten') && !b.textContent?.includes('Wiederholen')
    );
    if (advOption) {
      await act(async () => {
        advOption.click();
      });
      const saved = JSON.parse(localStorage.getItem('chemistry_mystery_save_v1') || '{}');
      expect(saved.activeDifficulty).toBe('advanced');
    }
  });
});
