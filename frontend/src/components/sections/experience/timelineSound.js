/**
 * timelineSound.js
 * 
 * Manages playback of the authentic gun revolver reload & cylinder spin audio:
 * /freesound_community-revolver-spin-96947.mp3
 * 
 * Features:
 * - Plays the exact uploaded revolver spin audio with zero synthetic oscillators.
 * - Dual engine: Web Audio API (pre-decoded AudioBuffer for 0ms latency) + HTML5 Audio fallback.
 * - Audio pool to allow natural sound playback without cutting off.
 * - Resilient autoplay unlocking across pointerdown, click, touch, and scroll.
 * - Responsive 400ms cooldown to keep milestone transitions distinct and clean.
 * - Clearly audible volume (0.65).
 */

const AUDIO_PATH = '/freesound_community-revolver-spin-96947.mp3';
const STORAGE_KEY = 'portfolio_timeline_sound_enabled';

class TimelineSoundManager {
  constructor() {
    this.audioCtx = null;
    this.audioBuffer = null;
    this.isUnlocked = false;
    this.lastPlayTimestamp = 0;
    this.cooldownMs = 400; // Balanced milestone cooldown
    this.volume = 0.65;    // Clear, audible volume
    this.listeners = new Set();

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check stored user preference
    const storedPref =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

    if (storedPref !== null) {
      this.enabled = storedPref === 'true';
    } else {
      this.enabled = !prefersReducedMotion;
    }

    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  init() {
    // 1. Setup Web Audio API and pre-decode revolver audio buffer
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      try {
        this.audioCtx = new AudioContextClass();
        this.loadAudioBuffer();
      } catch (e) {}
    }

    // 2. Setup user interaction unlock listeners
    const unlock = () => {
      this.unlock();
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('wheel', unlock, { passive: true });
    window.addEventListener('scroll', unlock, { passive: true });
  }

  loadAudioBuffer() {
    if (!this.audioCtx) return;
    fetch(AUDIO_PATH)
      .then((res) => {
        if (!res.ok) throw new Error('Audio fetch failed: ' + res.status);
        return res.arrayBuffer();
      })
      .then((arr) => {
        if (this.audioCtx) {
          return this.audioCtx.decodeAudioData(arr);
        }
      })
      .then((decoded) => {
        if (decoded) {
          this.audioBuffer = decoded;
        }
      })
      .catch(() => {});
  }

  unlock() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().then(() => {
        if (this.audioCtx.state === 'running') {
          this.isUnlocked = true;
        }
      }).catch(() => {});
    } else if (this.audioCtx && this.audioCtx.state === 'running') {
      this.isUnlocked = true;
    }

    if (!this.audioBuffer && this.audioCtx) {
      this.loadAudioBuffer();
    }
  }

  isSoundEnabled() {
    return this.enabled;
  }

  setSoundEnabled(val) {
    this.enabled = Boolean(val);
    try {
      localStorage.setItem(STORAGE_KEY, String(this.enabled));
    } catch (e) {}
    this.notifyListeners();

    // If enabling, immediately play the gun revolver spin as instant tactile confirmation
    if (this.enabled) {
      this.unlock();
      this.playSound();
    }
  }

  toggleSound() {
    this.setSoundEnabled(!this.enabled);
    return this.enabled;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.enabled);
      } catch (e) {}
    });
  }

  /**
   * Play the authentic gun revolver reload & cylinder spin sound.
   * Uses pre-decoded Web Audio buffer for 0ms latency, with reliable HTML5 Audio fallback.
   */
  playSound() {
    if (!this.enabled) return;

    const now = Date.now();
    if (now - this.lastPlayTimestamp < this.cooldownMs) {
      return;
    }
    this.lastPlayTimestamp = now;

    // Try Web Audio API first (lowest latency)
    if (this.audioCtx && this.audioBuffer) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().then(() => {
          this.playBuffer();
        }).catch(() => {
          this.playHtmlAudio();
        });
        return;
      }

      this.playBuffer();
      return;
    }

    // Fallback to HTML5 Audio
    this.playHtmlAudio();
  }

  playBuffer() {
    try {
      if (!this.audioCtx || !this.audioBuffer) {
        this.playHtmlAudio();
        return;
      }

      const source = this.audioCtx.createBufferSource();
      source.buffer = this.audioBuffer;

      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);

      source.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      source.start(0);
    } catch (e) {
      this.playHtmlAudio();
    }
  }

  playHtmlAudio() {
    try {
      const sound = new Audio(AUDIO_PATH);
      sound.volume = this.volume;
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {}
  }
}

export const timelineSound = new TimelineSoundManager();
export default timelineSound;
