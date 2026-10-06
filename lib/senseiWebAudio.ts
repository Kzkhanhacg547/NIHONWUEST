"use client";

import type { Viseme } from "./senseiLipSync";

/**
 * Web Audio DSP audio player for realistic Japanese Male / Female voice synthesis.
 * Uses real-time frequency analysis to drive accurate mouth visemes.
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export interface WebAudioPlayback {
  stop: () => void;
}

export async function playSenseiAudio(
  text: string,
  gender: "male" | "female",
  onStart: () => void,
  onViseme: (viseme: Viseme) => void,
  onEnd: () => void
): Promise<WebAudioPlayback | null> {
  const ctx = getAudioContext();
  if (!ctx) return null;

  try {
    const res = await fetch(`/api/ai/tts?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error("TTS fetch failed");
    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    let lastNode: AudioNode = source;

    if (gender === "male") {
      // Lower playback pitch to authentic Japanese male vocal register (~120Hz fundamental)
      source.playbackRate.value = 0.82;

      // Low-shelf boost for masculine chest warmth
      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = "lowshelf";
      lowShelf.frequency.value = 220;
      lowShelf.gain.value = 5.0;

      // Peak filter cut to soften feminine high-frequency harmonic peaks
      const midCut = ctx.createBiquadFilter();
      midCut.type = "peaking";
      midCut.frequency.value = 2800;
      midCut.gain.value = -4.5;

      source.connect(lowShelf);
      lowShelf.connect(midCut);
      lastNode = midCut;
    } else {
      source.playbackRate.value = 1.0;
    }

    lastNode.connect(analyser);
    analyser.connect(ctx.destination);

    let isPlaying = true;
    let animId = 0;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkMouth = () => {
      if (!isPlaying) return;
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;

      if (avg < 4) {
        onViseme("closed");
      } else if (avg < 14) {
        onViseme("u");
      } else if (avg < 26) {
        onViseme("i");
      } else if (avg < 38) {
        onViseme("e");
      } else if (avg < 52) {
        onViseme("o");
      } else {
        onViseme("a");
      }
      animId = requestAnimationFrame(checkMouth);
    };

    source.onended = () => {
      if (!isPlaying) return;
      isPlaying = false;
      cancelAnimationFrame(animId);
      onViseme("closed");
      onEnd();
    };

    onStart();
    source.start(0);
    checkMouth();

    return {
      stop: () => {
        isPlaying = false;
        cancelAnimationFrame(animId);
        onViseme("closed");
        try {
          source.stop();
        } catch {}
      },
    };
  } catch {
    return null;
  }
}
