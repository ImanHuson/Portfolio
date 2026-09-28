// Procedural sound: no audio files, nothing autoplays. Everything is
// synthesized with the Web Audio API after the visitor switches sound on
// (a user gesture, which browsers require before audio can start).
// Brief section 05: "No music. Wind. Distant birds. Very subtle ambience."

export type Cue = "arrival" | "rumble";

type Listener = () => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private wind: { gain: GainNode; stop: () => void } | null = null;
  private birdTimer: number | null = null;
  private listeners = new Set<Listener>();
  enabled = false;

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };
  getSnapshot = () => this.enabled;
  private emit() {
    this.listeners.forEach((l) => l());
  }

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  private noiseBuffer(seconds: number) {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const d = buf.getChannelData(0);
    // brown-ish noise: integrated white noise reads as air, not hiss
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = last * 3.5;
    }
    return buf;
  }

  async toggle() {
    if (this.enabled) this.disable();
    else await this.enable();
  }

  async enable() {
    const ctx = this.ensure();
    await ctx.resume();
    this.enabled = true;
    this.startWind();
    this.scheduleBird();
    this.emit();
  }

  disable() {
    this.enabled = false;
    this.wind?.stop();
    this.wind = null;
    if (this.birdTimer !== null) window.clearTimeout(this.birdTimer);
    this.birdTimer = null;
    void this.ctx?.suspend();
    this.emit();
  }

  /** Wind: looping noise through a bandpass whose centre drifts, so gusts
   * rise and fall instead of hissing at one pitch. */
  private startWind() {
    if (!this.ctx || !this.master || this.wind) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(6);
    src.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 420;
    band.Q.value = 0.7;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(band.frequency);
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 4);
    src.connect(band).connect(gain).connect(this.master);
    src.start();
    lfo.start();
    this.wind = {
      gain,
      stop: () => {
        const t = ctx.currentTime;
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(gain.gain.value, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.6);
        src.stop(t + 0.7);
        lfo.stop(t + 0.7);
      },
    };
  }

  /** A distant bird: two or three quick falling chirps, far away (quiet,
   * high-passed), at irregular intervals. */
  private scheduleBird() {
    if (!this.enabled) return;
    this.birdTimer = window.setTimeout(() => {
      this.bird();
      this.scheduleBird();
    }, 5000 + Math.random() * 9000);
  }

  private bird() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const n = 2 + Math.floor(Math.random() * 2);
    const base = 2600 + Math.random() * 900;
    for (let i = 0; i < n; i++) {
      const t = ctx.currentTime + i * 0.16;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(base * 1.25, t);
      o.frequency.exponentialRampToValueAtTime(base * 0.8, t + 0.09);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.018, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
      o.connect(g).connect(this.master);
      o.start(t);
      o.stop(t + 0.12);
    }
  }

  cue(c: Cue) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(c === "arrival" ? 3 : 5);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = c === "arrival" ? 900 : 120;
    const g = ctx.createGain();
    const peak = c === "arrival" ? 0.9 : 0.7;
    g.gain.setValueAtTime(0, t);
    if (c === "arrival") {
      // the lightning-crack of a transformation: sharp attack, long tail
      g.gain.linearRampToValueAtTime(peak, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 2.8);
    } else {
      // footfalls far away: a slow swell of low end
      g.gain.linearRampToValueAtTime(peak, t + 1.8);
      g.gain.exponentialRampToValueAtTime(0.001, t + 4.8);
    }
    src.connect(lp).connect(g).connect(this.master);
    src.start(t);
  }
}

export const sound = new SoundEngine();
