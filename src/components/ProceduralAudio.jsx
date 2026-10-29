import { useEffect, useRef, useState } from "react";

// ============================================
// GRAVEYARD AUDIO ENGINE v3.0
// Procedural Rain + Melancholic Piano
// ============================================

const PROGRESSION = [
  { bass: 38, notes: [62, 65, 69, 72, 76] },
  { bass: 34, notes: [58, 62, 65, 69] },
  { bass: 41, notes: [60, 65, 69, 72] },
  { bass: 36, notes: [60, 62, 67, 72] },
];

const BPM = 52;
const BEAT = 60 / BPM;

const random = (min, max) =>
  min + Math.random() * (max - min);

const midiToFreq = (note) =>
  440 * Math.pow(2, (note - 69) / 12);

// ============================================
// SYNTHESIZE RAINDROP BUFFERS
// ============================================

function createDropBuffer(ctx, type) {
  const sampleRate = ctx.sampleRate;

  let duration;

  if (type === "stone") duration = 0.065;
  else if (type === "water") duration = 0.18;
  else duration = 0.045;

  const length = Math.ceil(duration * sampleRate);

  const buffer = ctx.createBuffer(
    1,
    length,
    sampleRate
  );

  const data = buffer.getChannelData(0);

  let previous = 0;

  const baseFrequency =
    type === "stone"
      ? random(1400, 3500)
      : type === "water"
      ? random(450, 1100)
      : random(350, 900);

  const phase = random(0, Math.PI * 2);

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;

    const progress = t / duration;

    // Быстрая атака и затухание
    const envelope =
      Math.pow(1 - progress, 3) *
      Math.min(1, t * 3000);

    const white = Math.random() * 2 - 1;

    // Сглаженный шум
    previous =
      previous * 0.65 +
      white * 0.35;

    // Короткий резонанс
    const resonance =
      Math.sin(
        2 * Math.PI * baseFrequency * t +
        phase
      ) *
      Math.exp(-t * 45);

    if (type === "stone") {
      data[i] =
        (previous * 0.8 + resonance * 0.2) *
        envelope;
    }

    if (type === "water") {
      const waterTone =
        Math.sin(
          2 *
          Math.PI *
          baseFrequency *
          t *
          (1 - progress * 0.2)
        );

      data[i] =
        (previous * 0.25 + waterTone * 0.75) *
        envelope *
        0.7;
    }

    if (type === "ground") {
      data[i] =
        previous *
        envelope *
        0.5;
    }
  }

  return buffer;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProceduralAudio() {
  const engineRef = useRef(null);
  const schedulerRef = useRef(null);

  const [enabled, setEnabled] = useState(false);

  const [masterVolume, setMasterVolume] =
    useState(0.65);

  const [musicVolume, setMusicVolume] =
    useState(0.65);

  const [rainVolume, setRainVolume] =
    useState(0.6);

  // ============================================
  // CREATE ENGINE
  // ============================================

  function createEngine() {
    if (engineRef.current) {
      return engineRef.current;
    }

    const ctx = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const pianoBus = ctx.createGain();
    pianoBus.gain.value = musicVolume;
    pianoBus.connect(master);

    const rainBus = ctx.createGain();
    rainBus.gain.value = rainVolume;
    rainBus.connect(master);

    // ============================================
    // REVERB
    // ============================================

    const convolver = ctx.createConvolver();

    const impulseLength =
      ctx.sampleRate * 2.5;

    const impulse = ctx.createBuffer(
      2,
      impulseLength,
      ctx.sampleRate
    );

    for (let channel = 0; channel < 2; channel++) {
      const data =
        impulse.getChannelData(channel);

      for (let i = 0; i < impulseLength; i++) {
        const decay = Math.pow(
          1 - i / impulseLength,
          3
        );

        data[i] =
          (Math.random() * 2 - 1) *
          decay;
      }
    }

    convolver.buffer = impulse;

    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.16;

    convolver.connect(reverbGain);
    reverbGain.connect(pianoBus);

    // ============================================
    // DROP LIBRARY
    // ============================================

    const dropBuffers = {
      stone: [],
      water: [],
      ground: [],
    };

    // Создаём 12 вариантов каждого типа
    for (let i = 0; i < 12; i++) {
      dropBuffers.stone.push(
        createDropBuffer(ctx, "stone")
      );

      dropBuffers.water.push(
        createDropBuffer(ctx, "water")
      );

      dropBuffers.ground.push(
        createDropBuffer(ctx, "ground")
      );
    }

    // ============================================
    // ENGINE DATA
    // ============================================

    const engine = {
      ctx,
      master,
      pianoBus,
      rainBus,
      convolver,

      dropBuffers,

      chordIndex: 0,
      step: 0,

      nextNoteTime:
        ctx.currentTime + 0.2,

      nextRainTime:
        ctx.currentTime + 0.02,

      rainIntensity: 0.65,
    };

    engineRef.current = engine;

    return engine;
  }

  // ============================================
  // PLAY ONE RAINDROP
  // ============================================

  function playDrop(engine, time, type) {
    const { ctx, rainBus, dropBuffers } =
      engine;

    const buffers = dropBuffers[type];

    const buffer =
      buffers[
        Math.floor(
          random(0, buffers.length)
        )
      ];

    const source =
      ctx.createBufferSource();

    source.buffer = buffer;

    source.playbackRate.value =
      random(0.75, 1.3);

    const gain = ctx.createGain();

    let volume;

    if (type === "stone") {
      volume = random(0.025, 0.07);
    } else if (type === "water") {
      volume = random(0.018, 0.055);
    } else {
      volume = random(0.012, 0.04);
    }

    gain.gain.value = volume;

    const panner =
      ctx.createStereoPanner();

    panner.pan.value =
      random(-1, 1);

    source.connect(gain);
    gain.connect(panner);
    panner.connect(rainBus);

    source.start(time);

    source.onended = () => {
      source.disconnect();
      gain.disconnect();
      panner.disconnect();
    };
  }

  // ============================================
  // PIANO SYNTHESIS
  // ============================================

  function playPiano(
    engine,
    midi,
    time,
    velocity = 0.5
  ) {
    const { ctx, pianoBus, convolver } =
      engine;

    const frequency =
      midiToFreq(midi);

    const duration =
      random(3.5, 5.5);

    const envelope =
      ctx.createGain();

    envelope.gain.setValueAtTime(
      0.0001,
      time
    );

    envelope.gain.exponentialRampToValueAtTime(
      velocity * 0.18,
      time + 0.008
    );

    envelope.gain.exponentialRampToValueAtTime(
      velocity * 0.07,
      time + 0.3
    );

    envelope.gain.exponentialRampToValueAtTime(
      0.0001,
      time + duration
    );

    const filter =
      ctx.createBiquadFilter();

    filter.type = "lowpass";

    filter.frequency.setValueAtTime(
      3000,
      time
    );

    filter.frequency.exponentialRampToValueAtTime(
      850,
      time + duration
    );

    envelope.connect(filter);

    filter.connect(pianoBus);
    filter.connect(convolver);

    const harmonics = [
      [1, 1],
      [2.002, 0.22],
      [3.006, 0.08],
      [4.01, 0.03],
    ];

    let remaining = harmonics.length;

    harmonics.forEach(
      ([ratio, level]) => {
        const oscillator =
          ctx.createOscillator();

        oscillator.type = "sine";

        oscillator.frequency.value =
          frequency * ratio;

        const gain =
          ctx.createGain();

        gain.gain.value = level;

        oscillator.connect(gain);
        gain.connect(envelope);

        oscillator.start(time);
        oscillator.stop(time + duration + 0.1);

        oscillator.onended = () => {
          oscillator.disconnect();
          gain.disconnect();

          remaining--;

          if (remaining === 0) {
            envelope.disconnect();
            filter.disconnect();
          }
        };
      }
    );
  }

  // ============================================
  // MUSIC SCHEDULER
  // ============================================

  function scheduleMusic(engine) {
    const chord =
      PROGRESSION[engine.chordIndex];

    const time =
      engine.nextNoteTime;

    const step =
      engine.step % 16;

    if (step === 0) {
      playPiano(
        engine,
        chord.bass,
        time,
        0.35
      );
    }

    const melodySteps =
      [0, 3, 6, 10, 13];

    if (melodySteps.includes(step)) {
      const note =
        chord.notes[
          Math.floor(
            random(0, chord.notes.length)
          )
        ];

      playPiano(
        engine,
        note,
        time,
        random(0.25, 0.5)
      );
    }

    if (step === 15) {
      engine.chordIndex =
        (engine.chordIndex + 1) %
        PROGRESSION.length;
    }

    engine.step++;

    engine.nextNoteTime += BEAT;
  }

  // ============================================
  // RAIN SCHEDULER
  // ============================================

  function scheduleRain(engine) {
    const time =
      engine.nextRainTime;

    const choice = Math.random();

    let type;

    if (choice < 0.45) {
      type = "stone";
    } else if (choice < 0.75) {
      type = "water";
    } else {
      type = "ground";
    }

    playDrop(engine, time, type);

    // Варьируем плотность дождя
    const dropsPerSecond =
      35 +
      engine.rainIntensity * 50;

    const interval =
      random(
        0.5 / dropsPerSecond,
        1.5 / dropsPerSecond
      );

    engine.nextRainTime += interval;
  }

  // ============================================
  // MAIN SCHEDULER
  // ============================================

  function startScheduler(engine) {
    if (schedulerRef.current) return;

    schedulerRef.current =
      setInterval(() => {
        const { ctx } = engine;

        const horizon =
          ctx.currentTime + 0.2;

        while (
          engine.nextNoteTime < horizon
        ) {
          scheduleMusic(engine);
        }

        while (
          engine.nextRainTime < horizon
        ) {
          scheduleRain(engine);
        }
      }, 50);
  }

  // ============================================
  // AUDIO CONTROL
  // ============================================

  async function toggleAudio() {
    const engine = createEngine();

    await engine.ctx.resume();

    if (!enabled) {
      engine.master.gain.setTargetAtTime(
        masterVolume,
        engine.ctx.currentTime,
        1
      );

      startScheduler(engine);

      setEnabled(true);
    } else {
      engine.master.gain.setTargetAtTime(
        0,
        engine.ctx.currentTime,
        0.5
      );

      setEnabled(false);
    }
  }

  // ============================================
  // VOLUME UPDATES
  // ============================================

  useEffect(() => {
    const engine =
      engineRef.current;

    if (!engine) return;

    const now =
      engine.ctx.currentTime;

    engine.master.gain.setTargetAtTime(
      enabled ? masterVolume : 0,
      now,
      0.2
    );

    engine.pianoBus.gain.setTargetAtTime(
      musicVolume,
      now,
      0.2
    );

    engine.rainBus.gain.setTargetAtTime(
      rainVolume,
      now,
      0.2
    );
  }, [
    enabled,
    masterVolume,
    musicVolume,
    rainVolume,
  ]);

  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      if (schedulerRef.current) {
        clearInterval(
          schedulerRef.current
        );
      }

      if (engineRef.current) {
        engineRef.current.ctx.close();
        engineRef.current = null;
      }
    };
  }, []);

  // ============================================
  // INTERFACE
  // ============================================

  const sliderStyle = {
    width: "100%",
    marginTop: "6px",
    accentColor: "#aeb7b4",
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "25px",
        right: "25px",
        zIndex: 30,

        background:
          "rgba(13,18,20,0.9)",

        backdropFilter:
          "blur(15px)",

        border:
          "1px solid #424a4c",

        padding: "18px",

        color: "#c6cecc",

        fontFamily:
          "Georgia, serif",

        width: "230px",
      }}
    >
      <button
        onClick={toggleAudio}
        style={{
          width: "100%",
          padding: "10px",

          background:
            "transparent",

          border:
            "1px solid #59615f",

          color: "#d7ddda",

          cursor: "pointer",

          fontFamily:
            "Georgia, serif",

          fontSize: "14px",
        }}
      >
        {enabled
          ? "♫ Атмосфера включена"
          : "♫ Включить атмосферу"}
      </button>

      {enabled && (
        <div
          style={{
            marginTop: "18px",

            display: "flex",
            flexDirection: "column",

            gap: "14px",
          }}
        >
          <label>
            Общая громкость

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) =>
                setMasterVolume(
                  Number(e.target.value)
                )
              }
              style={sliderStyle}
            />
          </label>

          <label>
            Пианино

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={(e) =>
                setMusicVolume(
                  Number(e.target.value)
                )
              }
              style={sliderStyle}
            />
          </label>

          <label>
            Дождь

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={rainVolume}
              onChange={(e) =>
                setRainVolume(
                  Number(e.target.value)
                )
              }
              style={sliderStyle}
            />
          </label>
        </div>
      )}
    </div>
  );
}