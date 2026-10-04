"use client";

import React, { useState, useEffect, useRef } from "react";

export type AvatarState = "IDLE" | "TALKING" | "LISTENING" | "HAPPY";
export type MouthShape = "closed" | "a" | "i" | "u" | "e" | "o";

interface SenseiAvatarProps {
  state?: AvatarState;
  isSpeaking?: boolean;
  isListening?: boolean;
  className?: string;
  size?: number;
}

export function SenseiAvatar({
  state = "IDLE",
  isSpeaking = false,
  isListening = false,
  className = "",
  size = 180,
}: SenseiAvatarProps) {
  const [mouthShape, setMouthShape] = useState<MouthShape>("closed");
  const [isBlinking, setIsBlinking] = useState(false);
  const talkingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Determine current active state
  const effectiveState: AvatarState = isSpeaking
    ? "TALKING"
    : isListening
    ? "LISTENING"
    : state;

  // Natural Blinking Effect (Blinks every 3.5 - 5.5 seconds)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const scheduleBlink = () => {
      const nextDelay = 3500 + Math.random() * 2000;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, nextDelay);
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Natural Lip-sync Animation when speaking
  useEffect(() => {
    if (effectiveState === "TALKING") {
      const shapes: MouthShape[] = ["a", "o", "i", "e", "u", "a", "closed", "o", "i"];
      let idx = 0;

      talkingIntervalRef.current = setInterval(() => {
        setMouthShape(shapes[idx % shapes.length]);
        idx++;
      }, 110);
    } else if (effectiveState === "HAPPY") {
      setMouthShape("i");
    } else {
      setMouthShape("closed");
      if (talkingIntervalRef.current) {
        clearInterval(talkingIntervalRef.current);
        talkingIntervalRef.current = null;
      }
    }

    return () => {
      if (talkingIntervalRef.current) {
        clearInterval(talkingIntervalRef.current);
      }
    };
  }, [effectiveState]);

  // Mouth SVG paths for different visemes
  const renderMouth = () => {
    switch (mouthShape) {
      case "a":
        // Wide open mouth for A / Ha / Ka
        return (
          <g transform="translate(100, 140)">
            <ellipse cx="0" cy="0" rx="9" ry="8" fill="#e11d48" />
            <path d="M -7 -1 Q 0 -4 7 -1 Q 0 7 -7 -1" fill="#be123c" />
            <ellipse cx="0" cy="4" rx="5" ry="3" fill="#fb7185" />
            <path d="M -9 0 Q 0 -6 9 0" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "i":
        // Stretched smiling mouth for I / Ki / Shi
        return (
          <g transform="translate(100, 140)">
            <path d="M -11 -1 Q 0 -5 11 -1 Q 0 5 -11 -1" fill="#e11d48" />
            <path d="M -10 -1 Q 0 -2 10 -1" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M -12 -1 Q 0 -6 12 -1" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "u":
        // Small puckered mouth for U / Ku / Su
        return (
          <g transform="translate(100, 140)">
            <ellipse cx="0" cy="1" rx="5" ry="5" fill="#e11d48" />
            <path d="M -4 0 Q 0 -3 4 0" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "e":
        // Semi-open mouth for E / Ke / Se
        return (
          <g transform="translate(100, 140)">
            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#e11d48" />
            <path d="M -7 -1 Q 0 -3 7 -1" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M -8 0 Q 0 -4 8 0" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "o":
        // Rounded mouth for O / Ko / So
        return (
          <g transform="translate(100, 140)">
            <ellipse cx="0" cy="1" rx="6" ry="7" fill="#e11d48" />
            <ellipse cx="0" cy="4" rx="4" ry="3" fill="#fb7185" />
            <path d="M -6 0 Q 0 -3 6 0" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "closed":
      default:
        // Gentle smiling closed lips
        return (
          <g transform="translate(100, 140)">
            <path d="M -7 -1 Q 0 4 7 -1" stroke="#be123c" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="-8" cy="-2" r="0.8" fill="#fda4af" />
            <circle cx="8" cy="-2" r="0.8" fill="#fda4af" />
          </g>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Listening Pulse Waves */}
      {effectiveState === "LISTENING" && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-sakura-500/60 animate-ping pointer-events-none" />
          <div className="absolute -inset-2 rounded-full border border-indigo-400/40 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Speaking Glow */}
      {effectiveState === "TALKING" && (
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-sakura-500/25 via-rose-500/20 to-amber-500/20 blur-md pointer-events-none" />
      )}

      {/* Animated Sensei Vector Character */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        /* width/height thuộc buffer nội bộ; hiển thị co lại theo khung chứa
           để avatar 180-190px không tràn ở 360px. */
        style={{ maxWidth: "100%", height: "auto" }}
        className={`transition-transform duration-300 ${
          effectiveState === "TALKING"
            ? "scale-105"
            : effectiveState === "LISTENING"
            ? "rotate-[-2deg] scale-102"
            : effectiveState === "HAPPY"
            ? "scale-105"
            : "hover:scale-102"
        }`}
      >
        <defs>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="60%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </linearGradient>
          <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="kimonoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f6e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <filter id="blushBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Halo Glow Background */}
        <circle cx="100" cy="100" r="90" fill="#fff1f4" className="dark:fill-sumi-900/90" />
        <circle cx="100" cy="100" r="88" stroke="#fda4af" strokeWidth="2" fill="none" opacity="0.5" />

        {/* Back Hair */}
        <path
          d="M 50 80 C 40 130 50 170 70 185 C 130 185 150 170 160 80 Z"
          fill="url(#hairGradient)"
        />

        {/* Kimono Collar / Body */}
        <g transform="translate(100, 165)">
          <path d="M -50 25 C -50 5 -25 -5 0 10 C 25 -5 50 5 50 25 Z" fill="url(#kimonoGradient)" />
          {/* Inner white collar */}
          <path d="M -20 5 L 0 20 L 20 5" stroke="#ffffff" strokeWidth="3" fill="none" />
          <path d="M -15 10 L 0 22 L 15 10" stroke="#fbcfe8" strokeWidth="2" fill="none" />
        </g>

        {/* Head Base (Skin) */}
        <ellipse cx="100" cy="105" rx="42" ry="46" fill="url(#skinGradient)" />

        {/* Cheeks Blush */}
        <circle cx="76" cy="116" r="8" fill="#fb7185" opacity="0.45" filter="url(#blushBlur)" />
        <circle cx="124" cy="116" r="8" fill="#fb7185" opacity="0.45" filter="url(#blushBlur)" />

        {/* Eyes (With Blinking & Expressions) */}
        {isBlinking ? (
          // Closed eyes during blink
          <g stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M 72 104 Q 80 108 88 104" />
            <path d="M 112 104 Q 120 108 128 104" />
          </g>
        ) : effectiveState === "HAPPY" ? (
          // Happy arch eyes
          <g stroke="#312e81" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 72 104 Q 80 96 88 104" />
            <path d="M 112 104 Q 120 96 128 104" />
          </g>
        ) : (
          // Expressive Anime Open Eyes
          <g>
            {/* Left Eye */}
            <g transform="translate(80, 102)">
              <ellipse cx="0" cy="0" rx="8" ry="11" fill="url(#eyeGradient)" />
              <ellipse cx="0" cy="2" rx="6" ry="7" fill="#1e1b4b" />
              {/* Eye Catch Lights */}
              <circle cx="-2" cy="-4" r="3" fill="#ffffff" />
              <circle cx="2" cy="3" r="1.5" fill="#ffffff" />
              {/* Eyelash */}
              <path d="M -10 -10 Q 0 -13 9 -7" stroke="#1e1b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>

            {/* Right Eye */}
            <g transform="translate(120, 102)">
              <ellipse cx="0" cy="0" rx="8" ry="11" fill="url(#eyeGradient)" />
              <ellipse cx="0" cy="2" rx="6" ry="7" fill="#1e1b4b" />
              {/* Eye Catch Lights */}
              <circle cx="-2" cy="-4" r="3" fill="#ffffff" />
              <circle cx="2" cy="3" r="1.5" fill="#ffffff" />
              {/* Eyelash */}
              <path d="M -9 -7 Q 0 -13 10 -10" stroke="#1e1b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* Eyebrows */}
        <g stroke="#4338ca" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M 72 88 Q 80 84 88 88" />
          <path d="M 112 88 Q 120 84 128 88" />
        </g>

        {/* Cute Small Nose */}
        <circle cx="100" cy="124" r="1" fill="#fda4af" />

        {/* Dynamic Mouth (Lip-sync Visemes) */}
        {renderMouth()}

        {/* Front Hair / Bangs */}
        <path
          d="M 58 75 C 65 50 135 50 142 75 C 135 105 125 115 120 95 C 110 115 90 115 80 95 C 75 115 65 105 58 75 Z"
          fill="url(#hairGradient)"
        />

        {/* Hair Side Strands */}
        <path d="M 58 75 C 50 100 52 140 60 150 C 65 140 62 100 68 85 Z" fill="url(#hairGradient)" />
        <path d="M 142 75 C 150 100 148 140 140 150 C 135 140 138 100 132 85 Z" fill="url(#hairGradient)" />

        {/* Sakura Hair Accessory */}
        <g transform="translate(136, 68) scale(0.9)">
          <path d="M 0 0 C -4 -10 4 -10 0 0" fill="#fda4af" />
          <path d="M 0 0 C 10 -4 10 4 0 0" fill="#fda4af" />
          <path d="M 0 0 C 4 10 -4 10 0 0" fill="#fda4af" />
          <path d="M 0 0 C -10 4 -10 -4 0 0" fill="#fda4af" />
          <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
        </g>
      </svg>
    </div>
  );
}
