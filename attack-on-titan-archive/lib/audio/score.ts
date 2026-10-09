// The archive's score: an original piece, synthesized live with the Web
// Audio API. It is written in the spirit of the series' choral, driving
// battle music (a low string ostinato, a wordless choir, taiko on the
// downbeats) but it borrows no melody or recording: the user chose this over
// hosting the real track, which would put the whole repository at risk of a
// copyright takedown.
//
// One loop of four chords, scheduled ahead of the audio clock, in moods that
// follow the archive's three acts:
//   humanity  strings and a soft pulse: the world inside the Walls
//   truth     lower and tighter, the ostinato in front
//   freedom   everything: choir, full strings, drums
//   paths     no pulse and no drums: the choir alone, slow, far away

export type Mood = "humanity" | "truth" | "freedom" | "paths";

type Chord = number[]; // MIDI notes, low to high

// i - VI - III - VII in D minor, then a darker turn for "truth"
const PROGRESSIONS: Record<Mood, Chord[]> = {
  humanity: [
    [50, 57, 62, 65],
    [46, 53, 58, 62],
    [53, 57, 60, 65],
    [48, 55, 60, 64],
  ],
  truth: [
    [50, 57, 62, 65],
    [43, 55, 58, 62],
    [45, 52, 57, 61],
    [50, 57, 62, 65],
  ],
  freedom: [
    [50, 57, 62, 65, 69],
    [46, 53, 58, 62, 65],
    [53, 57, 60, 65, 69],
    [48, 55, 60, 64, 67],
  ],
  paths: [
    [50, 57, 62, 69],
    [46, 53, 62, 65],
    [43, 50, 58, 62],
    [45, 52, 57, 64],
  ],
};

const MOOD = {
  humanity: { bpm: 84, pulse: 0.5, choir: 0.15, strings: 0.8, drums: 0 },
  truth: { bpm: 92, pulse: 0.85, choir: 0.35, strings: 0.7, drums: 0.35 },
  freedom: { bpm: 96, pulse: 1, choir: 0.9, strings: 1, drums: 1 },
  paths: { bpm: 60, pulse: 0, choir: 1, strings: 0.45, drums: 0 },
} as const;

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export class Score {
  private ctx: AudioContext;
  private out: GainNode;
  private hall: ConvolverNode;
  private dry: GainNode;
  private wet: GainNode;
  private mood: Mood = "humanity";
  private next = 0; // audio time of the next beat
  private beat = 0;
  private timer: number | null = null;
  private live = new Set<AudioScheduledSourceNode>();

  constructor(ctx: AudioContext, destination: AudioNode) {
    this.ctx = ctx;
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    this.dry = ctx.createGain();
    this.dry.gain.value = 0.55;
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.7;
    this.hall = ctx.createConvolver();
    this.hall.buffer = this.impulse(3.8);
    this.dry.connect(this.out);
    this.hall.connect(this.wet).connect(this.out);
    this.out.connect(destination);
  }

  /** A large stone hall: decaying stereo noise, darker as it fades. */
  private impulse(seconds: number) {
    const ctx = this.ctx;
    const n = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      let lp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / n;
        lp += ((Math.random() * 2 - 1) - lp) * (0.5 - 0.42 * t); // high end dies first
        d[i] = lp * Math.pow(1 - t, 2.6);
      }
    }
    return buf;
  }

  private send(node: AudioNode, wet = 1) {
    node.connect(this.dry);
    if (wet > 0) {
      const g = this.ctx.createGain();
      g.gain.value = wet;
      node.connect(g).connect(this.hall);
    }
  }

  private track(n: AudioScheduledSourceNode) {
    this.live.add(n);
    n.onended = () => this.live.delete(n);
  }

  start() {
    const t = this.ctx.currentTime;
    this.out.gain.cancelScheduledValues(t);
    this.out.gain.setValueAtTime(this.out.gain.value, t);
    this.out.gain.linearRampToValueAtTime(0.75, t + 3);
    if (this.timer !== null) return;
    this.next = t + 0.1;
    this.beat = 0;
    const tick = () => {
      // schedule everything that starts in the next 0.4 s on the audio clock
      while (this.next < this.ctx.currentTime + 0.4) {
        this.play(this.beat, this.next);
        this.next += 60 / MOOD[this.mood].bpm / 2; // eighth notes
        this.beat++;
      }
      this.timer = window.setTimeout(tick, 100);
    };
    tick();
  }

  stop() {
    const t = this.ctx.currentTime;
    this.out.gain.cancelScheduledValues(t);
    this.out.gain.setValueAtTime(this.out.gain.value, t);
    this.out.gain.linearRampToValueAtTime(0, t + 0.8);
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
    window.setTimeout(() => this.live.forEach((n) => n.stop()), 900);
  }

  setMood(m: Mood) {
    this.mood = m;
  }

  /** One eighth note. Chords change every 16 eighths (two bars of 4/4). */
  private play(b: number, t: number) {
    const m = MOOD[this.mood];
    const prog = PROGRESSIONS[this.mood];
    const chord = prog[Math.floor(b / 16) % prog.length];
    const eighth = 60 / m.bpm / 2;
    const bar = b % 16;
    if (bar === 0) {
      const len = eighth * 16;
      this.strings(chord, t, len, m.strings);
      if (m.choir > 0) this.choir(chord, t, len, m.choir);
      this.drone(chord[0] - 12, t, len, this.mood === "paths" ? 0.5 : 0.8);
    }
    // the ostinato: root and fifth, accented on the beat, the series' driving pulse
    if (m.pulse > 0) {
      const pat = [0, 0, 7, 0, 0, 7, 0, 12];
      const note = chord[0] + pat[b % 8];
      this.pluck(note, t, eighth * 0.9, m.pulse * (b % 2 === 0 ? 1 : 0.6));
    }
    if (m.drums > 0) {
      if (bar === 0 || bar === 8) this.taiko(t, m.drums);
      else if (bar === 6 || bar === 14) this.taiko(t, m.drums * 0.5, true);
      if (this.mood === "freedom" && (bar === 12 || bar === 13)) this.taiko(t, 0.45, true);
    }
  }

  /** Strings: detuned saw pairs, softly filtered, slow bow. */
  private strings(chord: Chord, t: number, len: number, level: number) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1500;
    lp.Q.value = 0.4;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05 * level, t + 1.6);
    g.gain.setValueAtTime(0.05 * level, t + len - 0.6);
    g.gain.linearRampToValueAtTime(0, t + len + 1.4);
    lp.connect(g);
    this.send(g, 0.8);
    for (const note of chord) {
      for (const det of [-7, 6]) {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = hz(note);
        o.detune.value = det;
        o.connect(lp);
        o.start(t);
        o.stop(t + len + 1.5);
        this.track(o);
      }
    }
  }

  /** Choir: saw voices through the formants of a sung "ah", with vibrato. */
  private choir(chord: Chord, t: number, len: number, level: number) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09 * level, t + 2.2);
    g.gain.setValueAtTime(0.09 * level, t + len - 0.8);
    g.gain.linearRampToValueAtTime(0, t + len + 2);
    const sum = ctx.createGain();
    for (const [f, q, a] of [[800, 9, 1], [1150, 10, 0.6], [2900, 12, 0.25]] as const) {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = f;
      bp.Q.value = q;
      const ga = ctx.createGain();
      ga.gain.value = a * 3.2;
      sum.connect(bp).connect(ga).connect(g);
    }
    this.send(g, 1.2);
    const vib = ctx.createOscillator();
    vib.frequency.value = 5.2;
    const vibAmt = ctx.createGain();
    vibAmt.gain.value = 9;
    vib.connect(vibAmt);
    vib.start(t);
    vib.stop(t + len + 2.1);
    this.track(vib);
    // upper voices, an octave above the strings
    for (const note of chord.slice(1)) {
      for (const det of [-9, 0, 8]) {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = hz(note + 12);
        o.detune.value = det;
        vibAmt.connect(o.detune);
        o.connect(sum);
        o.start(t);
        o.stop(t + len + 2.1);
        this.track(o);
      }
    }
  }

  private drone(note: number, t: number, len: number, level: number) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = hz(note);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12 * level, t + 1.2);
    g.gain.linearRampToValueAtTime(0, t + len + 1);
    o.connect(g);
    this.send(g, 0.3);
    o.start(t);
    o.stop(t + len + 1.1);
    this.track(o);
  }

  /** A low plucked string for the ostinato. */
  private pluck(note: number, t: number, len: number, level: number) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = hz(note - 12);
    const o2 = ctx.createOscillator();
    o2.type = "sawtooth";
    o2.frequency.value = hz(note - 12);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(1800, t);
    lp.frequency.exponentialRampToValueAtTime(220, t + len);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16 * level, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    const mix = ctx.createGain();
    mix.gain.value = 0.35;
    o.connect(g);
    o2.connect(mix).connect(lp);
    lp.connect(g);
    this.send(g, 0.35);
    for (const n of [o, o2]) {
      n.start(t);
      n.stop(t + len + 0.05);
      this.track(n);
    }
  }

  /** Taiko: a pitch-dropping body and a skin slap of filtered noise. */
  private taiko(t: number, level: number, light = false) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(light ? 140 : 110, t);
    o.frequency.exponentialRampToValueAtTime(light ? 70 : 42, t + 0.35);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime((light ? 0.35 : 0.7) * level, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (light ? 0.4 : 0.9));
    o.connect(g);
    this.send(g, 0.6);
    o.start(t);
    o.stop(t + 1);
    this.track(o);
    const src = ctx.createBufferSource();
    const n = Math.floor(ctx.sampleRate * 0.12);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    const sg = ctx.createGain();
    sg.gain.value = 0.18 * level;
    src.connect(bp).connect(sg);
    this.send(sg, 0.5);
    src.start(t);
    this.track(src);
  }
}
