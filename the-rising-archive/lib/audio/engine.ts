// Procedural sound: no audio files, nothing autoplays. Everything is
// synthesized with the Web Audio API after the reader switches sound on
// (a user gesture, which browsers require before audio can start).

type Cue = "heartbeat" | "strike" | "seal" | "howl";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private drone: { stop: () => void } | null = null;
  enabled = false;

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  async enable() {
    const ctx = this.ensure();
    await ctx.resume();
    this.enabled = true;
    this.startDrone();
  }

  disable() {
    this.enabled = false;
    this.drone?.stop();
    this.drone = null;
    void this.ctx?.suspend();
  }

  /** A low, barely-there Martian drone: two detuned saws through a lowpass. */
  private startDrone() {
    if (!this.ctx || !this.master || this.drone) return;
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 3);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;
    const oscs = [43.65, 43.9, 87.3].map((f) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.connect(filter);
      o.start();
      return o;
    });
    filter.connect(out);
    out.connect(this.master);
    this.drone = {
      stop: () => {
        const t = ctx.currentTime;
        out.gain.cancelScheduledValues(t);
        out.gain.setValueAtTime(out.gain.value, t);
        out.gain.linearRampToValueAtTime(0, t + 0.6);
        oscs.forEach((o) => o.stop(t + 0.7));
      },
    };
  }

  play(cue: Cue) {
    if (!this.enabled || !this.ctx || !this.master) return;
    if (cue === "heartbeat") {
      this.thump(0);
      this.thump(0.26, 0.7);
    } else if (cue === "strike") {
      this.metal();
    } else if (cue === "seal") {
      this.thump(0, 0.5, 38);
    } else if (cue === "howl") {
      this.howl();
    }
  }

  /** Lorn's old wolf: one distant howl, a sine rising and falling through a
   * bandpass with a slow vibrato, far back in the mix. */
  private howl() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(330, t);
    o.frequency.linearRampToValueAtTime(560, t + 0.9);
    o.frequency.linearRampToValueAtTime(520, t + 2.1);
    o.frequency.linearRampToValueAtTime(380, t + 2.9);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 7;
    lfo.connect(lfoGain);
    lfoGain.connect(o.frequency);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 520;
    band.Q.value = 1.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09, t + 0.5);
    g.gain.setValueAtTime(0.09, t + 2.2);
    g.gain.linearRampToValueAtTime(0, t + 3.1);
    o.connect(band);
    band.connect(g);
    g.connect(this.master);
    o.start(t);
    lfo.start(t);
    o.stop(t + 3.2);
    lfo.stop(t + 3.2);
  }

  private thump(delay: number, level = 1, freq = 58) {
    const ctx = this.ctx!;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.55, t + 0.18);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.9 * level, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    o.connect(g).connect(this.master!);
    o.start(t);
    o.stop(t + 0.35);
  }

  /** A pick against rock, far down a shaft: filtered noise + a metallic ping. */
  private metal() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    const ng = ctx.createGain();
    ng.gain.value = 0.25;
    noise.connect(bp).connect(ng).connect(this.master!);
    noise.start(t);
    const ping = ctx.createOscillator();
    const pg = ctx.createGain();
    ping.type = "triangle";
    ping.frequency.value = 1870;
    pg.gain.setValueAtTime(0.08, t);
    pg.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    ping.connect(pg).connect(this.master!);
    ping.start(t);
    ping.stop(t + 1);
  }
}

export const sound = new SoundEngine();
