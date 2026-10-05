'use client';

/**
 * Audio Manager – Howler.js
 * اگر فایل صدا موجود نباشد، بدون خطا سکوت می‌کند.
 */

type SfxName = 'click' | 'confirm' | 'error' | 'success' | 'coin' | 'work_start' | 'work_done' | 'levelup';
type MusicName = 'city' | 'work';

const SFX_PATHS: Record<SfxName, string> = {
  click: '/audio/sfx/click.ogg',
  confirm: '/audio/sfx/confirm.ogg',
  error: '/audio/sfx/error.ogg',
  success: '/audio/sfx/success.ogg',
  coin: '/audio/sfx/coin.ogg',
  work_start: '/audio/sfx/work_start.ogg',
  work_done: '/audio/sfx/work_done.ogg',
  levelup: '/audio/sfx/levelup.ogg',
};

const MUSIC_PATHS: Record<MusicName, string> = {
  city: '/audio/music/city_theme.ogg',
  work: '/audio/music/work_theme.ogg',
};

class AudioManagerClass {
  private enabled = true;
  private musicEnabled = true;
  private sfxVolume = 0.5;
  private musicVolume = 0.3;
  private howlCache: Map<string, any> = new Map();
  private currentMusic: any = null;
  private Howl: any = null;
  private loaded = false;

  async init() {
    if (typeof window === 'undefined') return;
    try {
      const howler = await import('howler');
      this.Howl = howler.Howl;
      this.loaded = true;
    } catch {
      console.warn('[Audio] howler not available');
    }
  }

  private getHowl(path: string, loop = false, volume = 0.5): any | null {
    if (!this.Howl || !this.loaded) return null;
    if (this.howlCache.has(path)) return this.howlCache.get(path);
    try {
      const h = new this.Howl({
        src: [path, path.replace('.ogg', '.mp3'), path.replace('.ogg', '.wav')],
        loop,
        volume,
        preload: true,
        onloaderror: () => {
          // فایل هنوز دانلود نشده – نادیده بگیر
        },
      });
      this.howlCache.set(path, h);
      return h;
    } catch {
      return null;
    }
  }

  playSfx(name: SfxName) {
    if (!this.enabled) return;
    const path = SFX_PATHS[name];
    const h = this.getHowl(path, false, this.sfxVolume);
    if (h) {
      try { h.volume(this.sfxVolume); h.play(); } catch { /* missing file */ }
    }
  }

  playMusic(name: MusicName) {
    if (!this.musicEnabled) return;
    this.stopMusic();
    const path = MUSIC_PATHS[name];
    const h = this.getHowl(path, true, this.musicVolume);
    if (h) {
      try {
        h.volume(this.musicVolume);
        h.play();
        this.currentMusic = h;
      } catch { /* missing */ }
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      try { this.currentMusic.stop(); } catch { /* */ }
      this.currentMusic = null;
    }
  }

  setEnabled(v: boolean) { this.enabled = v; if (!v) this.stopMusic(); }
  setMusicEnabled(v: boolean) { this.musicEnabled = v; if (!v) this.stopMusic(); }
  setSfxVolume(v: number) { this.sfxVolume = Math.max(0, Math.min(1, v)); }
  setMusicVolume(v: number) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    if (this.currentMusic) try { this.currentMusic.volume(this.musicVolume); } catch { /* */ }
  }
}

export const AudioManager = new AudioManagerClass();
