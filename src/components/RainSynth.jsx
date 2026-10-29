import { useEffect, useRef, useState } from "react";

// ============================================================
// THE LAST FREQUENCY
// SOUNDTRACK PLAYER v5.2
// 10 CINEMATIC ANALOG COMPOSITIONS
// ============================================================

const midi = (n) => 440 * 2 ** ((n - 69) / 12);
const rnd = (a, b) => a + Math.random() * (b - a);

// ============================================================
// COMPOSITIONS
// ============================================================

const TRACKS = [
  {
    name: "LOST MEMORIES",
    mood: "Ностальгия · Светлая печаль",
    bpm: 68,
    root: 50,
    progression: [
      [0, 3, 7, 10, 14],
      [-4, 0, 3, 7, 12],
      [-9, -5, -2, 2, 7],
      [-2, 2, 5, 9, 14],
    ],
    melody: [
      [0, 12, 8],
      [12, 10, 7],
      [24, 7, 8],
      [36, 10, 8],
      [48, 9, 7],
      [60, 7, 4],
    ],
    brightness: 0.55,
    bass: 0.55,
    pulse: 0.2,
    pad: 0.85,
  },
  {
    name: "NEON GRAVES",
    mood: "Тёмный синтвейв · Холод",
    bpm: 76,
    root: 45,
    progression: [
      [0, 3, 7, 10, 15],
      [-2, 2, 5, 9, 12],
      [-5, -2, 2, 7, 10],
      [-7, -3, 0, 5, 9],
    ],
    melody: [
      [0, 15, 7],
      [10, 12, 5],
      [20, 10, 8],
      [34, 7, 9],
      [48, 12, 6],
      [58, 10, 6],
    ],
    brightness: 0.32,
    bass: 0.95,
    pulse: 0.65,
    pad: 0.75,
  },
  {
    name: "THE LAST LIGHT",
    mood: "Космос · Хрупкая надежда",
    bpm: 62,
    root: 53,
    progression: [
      [0, 4, 7, 11, 14],
      [-5, -1, 2, 7, 11],
      [-2, 2, 5, 9, 14],
      [-7, -3, 0, 4, 9],
    ],
    melody: [
      [0, 14, 12],
      [16, 11, 8],
      [30, 9, 10],
      [46, 7, 8],
      [58, 11, 6],
    ],
    brightness: 0.7,
    bass: 0.4,
    pulse: 0.08,
    pad: 1,
  },
  {
    name: "FORGOTTEN CITY",
    mood: "Одиночество · Ночной мегаполис",
    bpm: 72,
    root: 48,
    progression: [
      [0, 3, 7, 10, 14],
      [-3, 0, 5, 7, 12],
      [-7, -3, 0, 3, 7],
      [-5, -2, 2, 5, 10],
    ],
    melody: [
      [0, 12, 8],
      [12, 14, 6],
      [23, 10, 8],
      [36, 7, 8],
      [50, 10, 6],
      [60, 5, 4],
    ],
    brightness: 0.4,
    bass: 0.75,
    pulse: 0.45,
    pad: 0.9,
  },
  {
    name: "AFTER YOU",
    mood: "Скорбь · Воспоминания",
    bpm: 58,
    root: 50,
    progression: [
      [0, 3, 7, 10, 14],
      [-4, 0, 3, 7, 10],
      [-5, -2, 2, 5, 9],
      [-7, -3, 0, 3, 7],
    ],
    melody: [
      [0, 14, 12],
      [18, 12, 10],
      [34, 10, 10],
      [50, 7, 12],
    ],
    brightness: 0.3,
    bass: 0.45,
    pulse: 0.05,
    pad: 0.95,
  },
  {
    name: "EMPTY STREETS",
    mood: "Ночная дорога · Ностальгия",
    bpm: 80,
    root: 45,
    progression: [
      [0, 4, 7, 11, 14],
      [-5, -1, 2, 7, 11],
      [-9, -5, -2, 2, 7],
      [-7, -3, 0, 4, 9],
    ],
    melody: [
      [0, 11, 6],
      [8, 14, 6],
      [18, 16, 8],
      [32, 14, 7],
      [44, 11, 7],
      [56, 9, 8],
    ],
    brightness: 0.65,
    bass: 0.8,
    pulse: 0.7,
    pad: 0.75,
  },
  {
    name: "GHOST SIGNAL",
    mood: "Таинственность · Далёкий сигнал",
    bpm: 66,
    root: 47,
    progression: [
      [0, 3, 7, 10, 15],
      [-2, 2, 5, 9, 14],
      [-6, -2, 1, 5, 10],
      [-4, 0, 3, 7, 12],
    ],
    melody: [
      [0, 15, 10],
      [16, 10, 7],
      [30, 12, 9],
      [46, 7, 8],
      [58, 10, 6],
    ],
    brightness: 0.25,
    bass: 0.7,
    pulse: 0.3,
    pad: 0.95,
  },
  {
    name: "FADING POLAROID",
    mood: "Тёплая ностальгия · Прошлое",
    bpm: 70,
    root: 53,
    progression: [
      [0, 4, 7, 11, 14],
      [-2, 2, 5, 9, 12],
      [-5, -1, 2, 7, 11],
      [-7, -3, 0, 4, 9],
    ],
    melody: [
      [0, 14, 8],
      [12, 16, 6],
      [22, 11, 8],
      [36, 9, 8],
      [50, 7, 7],
      [60, 11, 4],
    ],
    brightness: 0.75,
    bass: 0.45,
    pulse: 0.2,
    pad: 0.95,
  },
  {
    name: "NO ONE RETURNS",
    mood: "Безысходность · Огромная пустота",
    bpm: 54,
    root: 38,
    progression: [
      [0, 3, 7, 10, 14],
      [-2, 2, 5, 9, 12],
      [-5, -2, 2, 5, 10],
      [-7, -3, 0, 3, 7],
    ],
    melody: [
      [0, 14, 14],
      [20, 10, 12],
      [40, 7, 14],
      [58, 3, 6],
    ],
    brightness: 0.18,
    bass: 1,
    pulse: 0.05,
    pad: 1,
  },
  {
    name: "STILL HERE",
    mood: "Светлая грусть · Надежда",
    bpm: 64,
    root: 50,
    progression: [
      [0, 3, 7, 10, 14],
      [-4, 0, 3, 7, 12],
      [-9, -5, -2, 2, 7],
      [-5, -1, 2, 7, 11],
    ],
    melody: [
      [0, 7, 8],
      [12, 10, 8],
      [24, 14, 10],
      [40, 12, 8],
      [54, 10, 8],
    ],
    brightness: 0.65,
    bass: 0.55,
    pulse: 0.15,
    pad: 0.95,
  },
];

// ============================================================
// AUDIO ENGINE
// ============================================================

class SoundtrackEngine {
  constructor(composition, volume = 0.65) {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error("Web Audio API не поддерживается");
    }

    this.ctx = new AudioContextClass();
    this.composition = composition;

    this.beat = 60 / composition.bpm;
    this.stepDuration = this.beat / 4;
    this.barDuration = this.beat * 4;

    this.running = false;
    this.timer = null;
    this.step = 0;
    this.nextTime = 0;

    this.sources = new Set();

    this.createMaster();
    this.createBuses();
    this.createReverb();
    this.createChorus();
    this.createDelay();
    this.createSaturation();

    // Фиксированные настройки звучания v5.1
    this.setLead(0.5);
    this.setSynth(0.85);
    this.setBass(0.65);
    this.setSpace(0.8);

    this.setVolume(volume);
  }

  createMaster() {
    const ctx = this.ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 25;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 12000;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.knee.value = 24;
    compressor.ratio.value = 2.5;
    compressor.attack.value = 0.035;
    compressor.release.value = 0.4;

    this.master.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(compressor);
    compressor.connect(ctx.destination);
  }

  createBus(value) {
    const gain = this.ctx.createGain();
    gain.gain.value = value;
    gain.connect(this.master);
    return gain;
  }

  createBuses() {
    this.leadBus = this.createBus(0.35);
    this.padBus = this.createBus(0.6);
    this.droneBus = this.createBus(0.35);
    this.bassBus = this.createBus(0.55);
    this.pulseBus = this.createBus(0.12);
    this.warmthBus = this.createBus(0.35);
  }

  createReverb() {
    const ctx = this.ctx;

    const duration = 5;
    const length = Math.floor(ctx.sampleRate * duration);

    const buffer = ctx.createBuffer(
      2,
      length,
      ctx.sampleRate
    );

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);

      let smooth = 0;

      for (let i = 0; i < length; i++) {
        const t = i / ctx.sampleRate;
        const noise = Math.random() * 2 - 1;

        smooth = smooth * 0.72 + noise * 0.28;

        const decay = Math.exp(-t * 0.9);
        const fade = Math.min(1, t * 25);

        data[i] = smooth * decay * fade;
      }
    }

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = buffer;

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 170;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3800;

    this.reverbGain = ctx.createGain();
    this.reverbGain.gain.value = 0.3;

    this.reverb.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(this.reverbGain);
    this.reverbGain.connect(this.master);
  }

  createChorus() {
    const ctx = this.ctx;

    this.chorusInput = ctx.createGain();

    const left = ctx.createDelay(0.1);
    const right = ctx.createDelay(0.1);

    left.delayTime.value = 0.026;
    right.delayTime.value = 0.034;

    const lfoL = ctx.createOscillator();
    const lfoR = ctx.createOscillator();

    lfoL.frequency.value = 0.11;
    lfoR.frequency.value = 0.17;

    const depthL = ctx.createGain();
    const depthR = ctx.createGain();

    depthL.gain.value = 0.0045;
    depthR.gain.value = 0.0055;

    lfoL.connect(depthL);
    lfoR.connect(depthR);

    depthL.connect(left.delayTime);
    depthR.connect(right.delayTime);

    this.chorusInput.connect(left);
    this.chorusInput.connect(right);

    const merger = ctx.createChannelMerger(2);

    left.connect(merger, 0, 0);
    right.connect(merger, 0, 1);

    this.chorusGain = ctx.createGain();
    this.chorusGain.gain.value = 0.25;

    merger.connect(this.chorusGain);
    this.chorusGain.connect(this.master);

    lfoL.start();
    lfoR.start();

    this.trackSource(lfoL);
    this.trackSource(lfoR);
  }

  createDelay() {
    const ctx = this.ctx;

    this.delayL = ctx.createDelay(3);
    this.delayR = ctx.createDelay(3);

    this.delayL.delayTime.value = this.beat * 0.75;
    this.delayR.delayTime.value = this.beat * 1.25;

    const filterL = ctx.createBiquadFilter();
    const filterR = ctx.createBiquadFilter();

    filterL.type = "lowpass";
    filterR.type = "lowpass";

    filterL.frequency.value = 1600;
    filterR.frequency.value = 1300;

    const feedbackL = ctx.createGain();
    const feedbackR = ctx.createGain();

    feedbackL.gain.value = 0.18;
    feedbackR.gain.value = 0.18;

    this.delayL.connect(filterL);
    filterL.connect(feedbackR);
    feedbackR.connect(this.delayR);

    this.delayR.connect(filterR);
    filterR.connect(feedbackL);
    feedbackL.connect(this.delayL);

    const merger = ctx.createChannelMerger(2);

    this.delayL.connect(merger, 0, 0);
    this.delayR.connect(merger, 0, 1);

    this.delayGain = ctx.createGain();
    this.delayGain.gain.value = 0.12;

    merger.connect(this.delayGain);
    this.delayGain.connect(this.master);
  }

  createSaturation() {
    const ctx = this.ctx;

    const samples = 32768;
    const curve = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const x = (i / (samples - 1)) * 2 - 1;
      curve[i] = Math.tanh(x * 1.7);
    }

    const shaper = ctx.createWaveShaper();
    shaper.curve = curve;
    shaper.oversample = "2x";

    this.saturationInput = ctx.createGain();
    this.saturationInput.gain.value = 0.5;

    const output = ctx.createGain();
    output.gain.value = 0.28;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3200;

    this.saturationInput.connect(shaper);
    shaper.connect(lowpass);
    lowpass.connect(output);
    output.connect(this.warmthBus);
  }

  trackSource(source) {
    this.sources.add(source);

    source.addEventListener("ended", () => {
      this.sources.delete(source);
    });
  }

  connectSpace(
    node,
    bus,
    reverb = 0,
    chorus = 0,
    delay = 0,
    warmth = 0
  ) {
    node.connect(bus);

    if (reverb > 0) {
      const gain = this.ctx.createGain();
      gain.gain.value = reverb;
      node.connect(gain);
      gain.connect(this.reverb);
    }

    if (chorus > 0) {
      const gain = this.ctx.createGain();
      gain.gain.value = chorus;
      node.connect(gain);
      gain.connect(this.chorusInput);
    }

    if (delay > 0) {
      const gain = this.ctx.createGain();
      gain.gain.value = delay;
      node.connect(gain);
      gain.connect(this.delayL);
    }

    if (warmth > 0) {
      const gain = this.ctx.createGain();
      gain.gain.value = warmth;
      node.connect(gain);
      gain.connect(this.saturationInput);
    }
  }

  lead(note, time, duration, velocity = 0.6) {
    const ctx = this.ctx;
    const frequency = midi(note);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";

    const brightness = this.composition.brightness;

    filter.frequency.setValueAtTime(
      300 + brightness * 350,
      time
    );

    filter.frequency.linearRampToValueAtTime(
      750 + brightness * 1300,
      time + duration * 0.55
    );

    filter.frequency.linearRampToValueAtTime(
      400 + brightness * 450,
      time + duration
    );

    const envelope = ctx.createGain();
    const peak = 0.105 * velocity;

    envelope.gain.setValueAtTime(0.00001, time);

    envelope.gain.linearRampToValueAtTime(
      peak,
      time + 0.55
    );

    envelope.gain.setValueAtTime(
      peak,
      time + Math.max(0.6, duration - 1)
    );

    envelope.gain.linearRampToValueAtTime(
      0.00001,
      time + duration + 1
    );

    filter.connect(envelope);

    const panner = ctx.createStereoPanner();
    panner.pan.value = rnd(-0.25, 0.25);

    envelope.connect(panner);

    this.connectSpace(
      panner,
      this.leadBus,
      0.7,
      0.25,
      0.2,
      0.2
    );

    const oscillators = [];

    [-6, 0, 7].forEach((detune, index) => {
      const osc = ctx.createOscillator();

      osc.type =
        index === 1 ? "triangle" : "sawtooth";

      osc.frequency.value = frequency;
      osc.detune.value = detune;

      const gain = ctx.createGain();
      gain.gain.value = index === 1 ? 0.65 : 0.17;

      osc.connect(gain);
      gain.connect(filter);

      osc.start(time);
      osc.stop(time + duration + 1.1);

      this.trackSource(osc);
      oscillators.push(osc);
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 4.1;

    const depth = ctx.createGain();

    depth.gain.setValueAtTime(0, time);
    depth.gain.linearRampToValueAtTime(
      4,
      time + 1.2
    );

    lfo.connect(depth);

    oscillators.forEach((osc) => {
      depth.connect(osc.detune);
    });

    lfo.start(time);
    lfo.stop(time + duration + 1);

    this.trackSource(lfo);
  }

  pad(notes, time, duration, intensity = 1) {
    const ctx = this.ctx;

    notes.forEach((note, index) => {
      const frequency = midi(note);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";

      const brightness = this.composition.brightness;

      filter.frequency.setValueAtTime(
        190 + brightness * 180 + index * 30,
        time
      );

      filter.frequency.linearRampToValueAtTime(
        700 + brightness * 950,
        time + duration * 0.55
      );

      filter.frequency.linearRampToValueAtTime(
        300 + brightness * 250,
        time + duration
      );

      const envelope = ctx.createGain();
      const peak =
        0.042 * intensity * this.composition.pad;

      envelope.gain.setValueAtTime(0.00001, time);

      envelope.gain.linearRampToValueAtTime(
        peak,
        time + 2.2
      );

      envelope.gain.setValueAtTime(
        peak,
        time + Math.max(2.3, duration - 2)
      );

      envelope.gain.linearRampToValueAtTime(
        0.00001,
        time + duration + 2
      );

      filter.connect(envelope);

      const panner = ctx.createStereoPanner();
      panner.pan.value = (index - 2) * 0.23;

      envelope.connect(panner);

      this.connectSpace(
        panner,
        this.padBus,
        0.65,
        0.75,
        0,
        0.25
      );

      [-10, -3, 4, 11].forEach((detune, i) => {
        const osc = ctx.createOscillator();

        osc.type =
          i === 3 ? "triangle" : "sawtooth";

        osc.frequency.value = frequency;
        osc.detune.value = detune;

        const gain = ctx.createGain();
        gain.gain.value = i === 3 ? 0.4 : 0.17;

        osc.connect(gain);
        gain.connect(filter);

        osc.start(time);
        osc.stop(time + duration + 2.1);

        this.trackSource(osc);
      });

      const lfo = ctx.createOscillator();
      lfo.frequency.value = rnd(0.025, 0.065);

      const depth = ctx.createGain();
      depth.gain.value = rnd(80, 180);

      lfo.connect(depth);
      depth.connect(filter.frequency);

      lfo.start(time);
      lfo.stop(time + duration + 2);

      this.trackSource(lfo);
    });
  }

  drone(note, time, duration, intensity = 1) {
    const ctx = this.ctx;
    const frequency = midi(note - 12);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;

    const envelope = ctx.createGain();

    envelope.gain.setValueAtTime(0.00001, time);

    envelope.gain.linearRampToValueAtTime(
      0.12 * intensity,
      time + 3
    );

    envelope.gain.setValueAtTime(
      0.12 * intensity,
      time + Math.max(3.1, duration - 3)
    );

    envelope.gain.linearRampToValueAtTime(
      0.00001,
      time + duration + 1
    );

    filter.connect(envelope);

    this.connectSpace(
      envelope,
      this.droneBus,
      0.35,
      0.2,
      0,
      0.15
    );

    [
      ["sine", 1, 0.8],
      ["triangle", 2, 0.25],
      ["sawtooth", 1, 0.1],
    ].forEach(([type, ratio, level], index) => {
      const osc = ctx.createOscillator();

      osc.type = type;
      osc.frequency.value = frequency * ratio;
      osc.detune.value = index * 2 - 2;

      const gain = ctx.createGain();
      gain.gain.value = level;

      osc.connect(gain);
      gain.connect(filter);

      osc.start(time);
      osc.stop(time + duration + 1.1);

      this.trackSource(osc);
    });
  }

  bass(note, time, duration, velocity = 1) {
    const ctx = this.ctx;
    const frequency = midi(note);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";

    filter.frequency.setValueAtTime(190, time);

    filter.frequency.exponentialRampToValueAtTime(
      75,
      time + 0.55
    );

    const envelope = ctx.createGain();

    envelope.gain.setValueAtTime(0.00001, time);

    envelope.gain.exponentialRampToValueAtTime(
      Math.max(
        0.00002,
        0.17 * velocity * this.composition.bass
      ),
      time + 0.055
    );

    envelope.gain.setValueAtTime(
      Math.max(
        0.00002,
        0.13 * velocity * this.composition.bass
      ),
      time + duration * 0.6
    );

    envelope.gain.exponentialRampToValueAtTime(
      0.00001,
      time + duration
    );

    filter.connect(envelope);
    envelope.connect(this.bassBus);

    [
      ["sine", 0.85],
      ["triangle", 0.35],
      ["sawtooth", 0.12],
    ].forEach(([type, level]) => {
      const osc = ctx.createOscillator();

      osc.type = type;
      osc.frequency.value = frequency;

      const gain = ctx.createGain();
      gain.gain.value = level;

      osc.connect(gain);
      gain.connect(filter);

      osc.start(time);
      osc.stop(time + duration + 0.05);

      this.trackSource(osc);
    });
  }

  pulse(time, velocity = 0.4) {
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    osc.type = "sine";

    osc.frequency.setValueAtTime(75, time);

    osc.frequency.exponentialRampToValueAtTime(
      42,
      time + 0.22
    );

    const gain = ctx.createGain();

    gain.gain.setValueAtTime(0.00001, time);

    gain.gain.exponentialRampToValueAtTime(
      Math.max(
        0.00002,
        0.22 * velocity * this.composition.pulse
      ),
      time + 0.025
    );

    gain.gain.exponentialRampToValueAtTime(
      0.00001,
      time + 0.5
    );

    osc.connect(gain);
    gain.connect(this.pulseBus);

    osc.start(time);
    osc.stop(time + 0.52);

    this.trackSource(osc);
  }

  schedule(step, time) {
    const bar = Math.floor(step / 16);
    const position = step % 16;

    const phrase = Math.floor(bar / 4);

    const chordIndex =
      phrase % this.composition.progression.length;

    const offsets =
      this.composition.progression[chordIndex];

    const notes = offsets.map(
      (offset) => this.composition.root + offset
    );

    const bassNote = notes[0] - 12;

    const section = Math.floor((bar % 64) / 8);

    const intro = section === 0;
    const build = section === 1 || section === 2;
    const climax = section === 3 || section === 4;
    const release = section === 5;
    const quiet = section === 6 || section === 7;

    const intensity = intro
      ? 0.6
      : build
      ? 0.8
      : climax
      ? 1
      : release
      ? 0.8
      : 0.55;

    if (position === 0 && bar % 4 === 0) {
      this.pad(
        notes,
        time,
        this.barDuration * 4,
        intensity
      );

      this.drone(
        bassNote,
        time,
        this.barDuration * 4,
        intensity
      );
    }

    if (!intro && !quiet) {
      if (position === 0 && bar % 2 === 0) {
        this.bass(
          bassNote,
          time,
          this.beat * 3,
          intensity
        );
      }

      if (climax && position === 8) {
        this.bass(
          bassNote,
          time,
          this.beat * 1.5,
          intensity * 0.65
        );
      }
    }

    const phrasePosition =
      (bar % 4) * 16 + position;

    for (const event of this.composition.melody) {
      const [eventStep, interval, durationSteps] = event;

      if (eventStep !== phrasePosition) continue;

      let note = this.composition.root + interval;

      const cycle = Math.floor(bar / 64);

      if (cycle > 0 && Math.random() < 0.12) {
        note += Math.random() < 0.5 ? -2 : 2;
      }

      this.lead(
        note,
        time,
        durationSteps * this.stepDuration,
        intensity * 0.7
      );
    }

    if (build || climax || release) {
      if (position === 0) {
        this.pulse(
          time,
          climax ? 0.7 : 0.4
        );
      }

      if (climax && position === 8) {
        this.pulse(time, 0.3);
      }
    }
  }

  scheduler() {
    if (!this.running) return;

    while (
      this.nextTime <
      this.ctx.currentTime + 0.25
    ) {
      this.schedule(this.step, this.nextTime);
      this.step++;
      this.nextTime += this.stepDuration;
    }
  }

  setVolume(value) {
    this.volume = value;

    if (this.ctx.state === "closed") return;

    if (this.running) {
      this.master.gain.setTargetAtTime(
        value * 0.8,
        this.ctx.currentTime,
        0.06
      );
    }
  }

  setLead(value) {
    this.leadBus.gain.value = value * 0.7;
  }

  setSynth(value) {
    this.padBus.gain.value = value * 0.8;
    this.droneBus.gain.value = value * 0.45;
    this.warmthBus.gain.value = value * 0.5;
  }

  setBass(value) {
    this.bassBus.gain.value = value * 0.9;
    this.pulseBus.gain.value = value * 0.22;
  }

  setSpace(value) {
    const now = this.ctx.currentTime;

    this.reverbGain.gain.setTargetAtTime(
      value * 0.48,
      now,
      0.08
    );

    this.chorusGain.gain.setTargetAtTime(
      value * 0.36,
      now,
      0.08
    );

    this.delayGain.gain.setTargetAtTime(
      value * 0.2,
      now,
      0.08
    );
  }

  async start() {
    if (this.running) return;

    await this.ctx.resume();

    if (this.ctx.state !== "running") {
      throw new Error("AudioContext не запустился");
    }

    this.running = true;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.15;

    const now = this.ctx.currentTime;

    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(0, now);

    this.master.gain.linearRampToValueAtTime(
      this.volume * 0.8,
      now + 1.2
    );

    this.scheduler();

    this.timer = setInterval(() => {
      this.scheduler();
    }, 40);
  }

  async stop() {
    if (this.ctx.state === "closed") return;

    this.running = false;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    const now = this.ctx.currentTime;

    this.master.gain.cancelScheduledValues(now);

    this.master.gain.setValueAtTime(
      this.master.gain.value,
      now
    );

    this.master.gain.linearRampToValueAtTime(
      0,
      now + 0.4
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 450)
    );

    if (this.ctx.state === "closed") return;

    for (const source of this.sources) {
      try {
        source.stop();
      } catch {
        // Источник уже остановлен
      }
    }

    this.sources.clear();

    await this.ctx.close();
  }
}

// ============================================================
// COMPACT MUSIC PLAYER
// ============================================================

export default function RainSynth() {
  const engineRef = useRef(null);
  const switchingRef = useRef(false);
  const volumeRef = useRef(0.65);

  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(65);
  const [collapsed, setCollapsed] = useState(false);

  const currentTrack = TRACKS[trackIndex];

  useEffect(() => {
    return () => {
      const engine = engineRef.current;
      engineRef.current = null;

      if (engine) {
        engine.stop().catch(console.error);
      }
    };
  }, []);

  async function startTrack(index) {
    if (switchingRef.current) return;

    switchingRef.current = true;
    setBusy(true);

    try {
      const previous = engineRef.current;
      engineRef.current = null;

      if (previous) {
        await previous.stop();
      }

      const engine = new SoundtrackEngine(
        TRACKS[index],
        volumeRef.current
      );

      engineRef.current = engine;

      await engine.start();

      setPlaying(true);
    } catch (error) {
      console.error("Soundtrack Engine:", error);

      const engine = engineRef.current;
      engineRef.current = null;

      if (engine) {
        await engine.stop().catch(() => {});
      }

      setPlaying(false);
    } finally {
      switchingRef.current = false;
      setBusy(false);
    }
  }

  async function stopMusic() {
    if (switchingRef.current) return;

    switchingRef.current = true;
    setBusy(true);

    try {
      const engine = engineRef.current;
      engineRef.current = null;

      if (engine) {
        await engine.stop();
      }

      setPlaying(false);
    } finally {
      switchingRef.current = false;
      setBusy(false);
    }
  }

  async function selectTrack(index) {
    if (switchingRef.current) return;

    const normalized =
      (index + TRACKS.length) % TRACKS.length;

    setTrackIndex(normalized);

    if (playing) {
      await startTrack(normalized);
    }
  }

  function updateVolume(value) {
    setVolume(value);
    volumeRef.current = value / 100;
    engineRef.current?.setVolume(value / 100);
  }

  const buttonStyle = {
    padding: "10px 14px",
    background: "#202d45",
    border: "1px solid #435578",
    borderRadius: 7,
    color: "#d8dfed",
    cursor: busy ? "wait" : "pointer",
    fontSize: 14,
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        width: 295,
        maxWidth: "calc(100vw - 40px)",
        padding: 17,
        background: "rgba(7, 11, 22, 0.94)",
        border: "1px solid rgba(115, 139, 190, 0.3)",
        borderRadius: 12,
        color: "#d8dfed",
        fontFamily: "Arial, sans-serif",
        zIndex: 9999,
        boxShadow: "0 15px 50px rgba(0,0,0,0.5)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: "bold",
              letterSpacing: 1.3,
            }}
          >
            THE LAST FREQUENCY
          </div>

          <div
            style={{
              fontSize: 10,
              color: "#8194b9",
              marginTop: 5,
            }}
          >
            {playing ? "● NOW PLAYING" : "○ MUSIC PLAYER"}
          </div>
        </div>

        <span style={{ fontSize: 20, color: "#8d9fc1" }}>
          {collapsed ? "+" : "−"}
        </span>
      </div>

      {!collapsed && (
        <>
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "rgba(45, 58, 88, 0.22)",
              border: "1px solid rgba(110,130,180,0.16)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#8194b9",
                fontSize: 10,
                letterSpacing: 1,
              }}
            >
              TRACK {String(trackIndex + 1).padStart(2, "0")} / 10
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 8,
                letterSpacing: 1,
              }}
            >
              {currentTrack.name}
            </div>

            <div
              style={{
                fontSize: 11,
                color: "#9baac5",
                marginTop: 6,
              }}
            >
              {currentTrack.mood}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
            }}
          >
            <button
              disabled={busy}
              onClick={() => selectTrack(trackIndex - 1)}
              style={{ ...buttonStyle, flex: 1 }}
            >
              ◀
            </button>

            <button
              disabled={busy}
              onClick={() =>
                playing ? stopMusic() : startTrack(trackIndex)
              }
              style={{
                ...buttonStyle,
                flex: 2,
                background: playing
                  ? "#303b52"
                  : "linear-gradient(135deg, #52678f, #283952)",
                border: "1px solid #7388b0",
                opacity: busy ? 0.6 : 1,
              }}
            >
              {busy
                ? "..."
                : playing
                ? "■ Стоп"
                : "▶ Играть"}
            </button>

            <button
              disabled={busy}
              onClick={() => selectTrack(trackIndex + 1)}
              style={{ ...buttonStyle, flex: 1 }}
            >
              ▶
            </button>
          </div>

          <div style={{ marginTop: 15 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "#aeb8c9",
                marginBottom: 7,
              }}
            >
              <span>Громкость</span>
              <span>{volume}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) =>
                updateVolume(Number(event.target.value))
              }
              style={{
                width: "100%",
                accentColor: "#96a8d4",
                cursor: "pointer",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}