// Web Audio API Synthesizer für Chemistry Mystery
// 100% offline, keine externen MP3s/Dateien erforderlich

class LabSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.3;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // Sanfter futuristischer Klick
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(this.masterVolume * 0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio-Fallback ohne Absturz
    }
  }

  // Mechanischer Tasten-Klick für Terminal und Codeschloss
  public playLockKey() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(this.masterVolume * 0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Audio-Fallback
    }
  }

  // Erfolgsmelodie bei richtiger Antwort
  public playSuccess() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (harmonischer Dur-Akkord)

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        const startTime = now + idx * 0.07;
        const endTime = startTime + 0.25;

        gain.gain.setValueAtTime(this.masterVolume * 0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {
      // Audio-Fallback
    }
  }

  // Fehler-Klang: Freundlich und lehrreich, nicht beschämend
  public playHintNotice() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.frequency.linearRampToValueAtTime(293.66, now + 0.15); // D4

      gain.gain.setValueAtTime(this.masterVolume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio-Fallback
    }
  }

  // Labor-Reaktionsblubbern (flüssige Synthese)
  public playBubble() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = now + i * 0.06;
        const startFreq = 400 + Math.random() * 300;
        const endFreq = startFreq + 300;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + 0.08);

        gain.gain.setValueAtTime(this.masterVolume * 0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.08);
      }
    } catch {
      // Audio-Fallback
    }
  }

  // Gas-Zischen bei chemischen Reaktionen (z.B. CO2-Aufbrausen oder Knallgas)
  public playReactionHiss() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2500, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.masterVolume * 0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Audio-Fallback
    }
  }

  // Atom-Orbit-Schwingung beim Laden von Elektronenschalen
  public playAtomOrbit() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(this.masterVolume * 0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Audio-Fallback
    }
  }

  // Harfen-Arpeggio bei Freischaltung seltener Elementkarten
  public playCardReveal() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.5]; // A-Dur Pentatonik Glissando

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        const startTime = now + idx * 0.05;
        const endTime = startTime + 0.3;

        gain.gain.setValueAtTime(this.masterVolume * 0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {
      // Audio-Fallback
    }
  }

  // Große Labor-Freischaltung (Level-Up)
  public playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        [440, 554.37, 659.25], // A-Dur
        [587.33, 739.99, 880]  // D-Dur
      ];

      chords.forEach((chord, chordIdx) => {
        const chordTime = now + chordIdx * 0.18;
        chord.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, chordTime);

          gain.gain.setValueAtTime(this.masterVolume * 0.18, chordTime);
          gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(chordTime);
          osc.stop(chordTime + 0.35);
        });
      });
    } catch {
      // Audio-Fallback
    }
  }

  // Quantensprung-Photonen-Sound (angeregtes Elektron & Lichtblitz)
  public playQuantumJump() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(1480, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.28);

      gain.gain.setValueAtTime(this.masterVolume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Audio-Fallback
    }
  }

  // Combo-Serie Sound (steigende Pentatonik je nach Multiplikator)
  public playCombo(comboMultiplier: number = 2) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreq = 440 * Math.pow(1.12, Math.min(8, comboMultiplier));
      const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(this.masterVolume * 0.16, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.2);
      });
    } catch {
      // Audio-Fallback
    }
  }

  // Niedliche Roboter- / Mascot-Chirps für Sparky
  public playSparkyChirp(mood: 'happy' | 'curious' | 'celebrate' | 'thinking' = 'happy') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';

      if (mood === 'celebrate') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.08);
        osc.frequency.linearRampToValueAtTime(900, now + 0.16);
        osc.frequency.linearRampToValueAtTime(1500, now + 0.25);
      } else if (mood === 'curious') {
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
      } else if (mood === 'thinking') {
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.linearRampToValueAtTime(650, now + 0.08);
        osc.frequency.linearRampToValueAtTime(750, now + 0.16);
      } else {
        // happy
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(1150, now + 0.12);
      }

      gain.gain.setValueAtTime(this.masterVolume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio-Fallback
    }
  }

  // Klang für verdiente Bewertungs-Sterne (1, 2 oder 3)
  public playStarEarned(starIndex: 1 | 2 | 3) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqs = [523.25, 659.25, 1046.5]; // C5, E5, C6
      const freq = freqs[starIndex - 1] || 523.25;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.1);

      gain.gain.setValueAtTime(this.masterVolume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio-Fallback
    }
  }

  // Blubbern im Reaktionskolben
  public playFlaskBubble() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + Math.random() * 150, now);
      osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 200, now + 0.08);

      gain.gain.setValueAtTime(this.masterVolume * 0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio-Fallback
    }
  }

  // Taktile Haptik-Vibration (für Smartphones / Tablets)
  public triggerHaptic(style: 'light' | 'medium' | 'success' | 'heavy' = 'light') {
    if (typeof window === 'undefined') return;
    try {
      if ('navigator' in window && typeof navigator.vibrate === 'function') {
        switch (style) {
          case 'heavy':
            navigator.vibrate([40, 50, 60]);
            break;
          case 'success':
            navigator.vibrate([20, 30, 40]);
            break;
          case 'medium':
            navigator.vibrate(25);
            break;
          case 'light':
          default:
            navigator.vibrate(12);
            break;
        }
      }
    } catch {
      // Ignoriere fehlende Haptik-Unterstützung
    }
  }
}

export const soundEngine = new LabSoundEngine();
