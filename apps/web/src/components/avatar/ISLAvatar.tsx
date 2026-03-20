import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────
export interface ISLAvatarProps {
  glosses?: string[];
  isPlaying?: boolean;
  speed?: number;
  onGlossChange?: (index: number) => void;
  onComplete?: () => void;
  className?: string;
}

// ─── Arm/hand pose definitions ────────────────────────────────────
// Each pose defines: left shoulder→elbow→hand, right shoulder→elbow→hand,
// plus finger splay for each hand.
interface ArmPose {
  // Left arm
  lShoulderAngle: number; // degrees from vertical
  lElbowAngle: number;
  lHandAngle: number;
  lFingerSpread: number; // 0 = closed, 1 = open
  // Right arm
  rShoulderAngle: number;
  rElbowAngle: number;
  rHandAngle: number;
  rFingerSpread: number;
}

const POSES: ArmPose[] = [
  // 0: Rest / neutral
  { lShoulderAngle: 10, lElbowAngle: 15, lHandAngle: 0, lFingerSpread: 0.2, rShoulderAngle: -10, rElbowAngle: -15, rHandAngle: 0, rFingerSpread: 0.2 },
  // 1: Both hands up, palms forward (HELLO)
  { lShoulderAngle: -70, lElbowAngle: -30, lHandAngle: -10, lFingerSpread: 1, rShoulderAngle: 70, rElbowAngle: 30, rHandAngle: 10, rFingerSpread: 1 },
  // 2: Right hand near chin, left at waist (THANK YOU)
  { lShoulderAngle: 15, lElbowAngle: 20, lHandAngle: 5, lFingerSpread: 0.3, rShoulderAngle: 55, rElbowAngle: 90, rHandAngle: -20, rFingerSpread: 0.6 },
  // 3: Both hands center, palms touching (NAMASTE)
  { lShoulderAngle: -45, lElbowAngle: -70, lHandAngle: 15, lFingerSpread: 0, rShoulderAngle: 45, rElbowAngle: 70, rHandAngle: -15, rFingerSpread: 0 },
  // 4: Left hand up pointing, right at side (POINT)
  { lShoulderAngle: -80, lElbowAngle: -20, lHandAngle: -15, lFingerSpread: 0.4, rShoulderAngle: -5, rElbowAngle: -10, rHandAngle: 0, rFingerSpread: 0.1 },
  // 5: Both hands out wide (BIG / LARGE)
  { lShoulderAngle: -60, lElbowAngle: -10, lHandAngle: 5, lFingerSpread: 0.9, rShoulderAngle: 60, rElbowAngle: 10, rHandAngle: -5, rFingerSpread: 0.9 },
  // 6: Crossed arms at center chest (FEEL / HEART)
  { lShoulderAngle: -30, lElbowAngle: -80, lHandAngle: 20, lFingerSpread: 0.3, rShoulderAngle: 30, rElbowAngle: 80, rHandAngle: -20, rFingerSpread: 0.3 },
  // 7: Right fist up, left relaxed (YES / POWER)
  { lShoulderAngle: 12, lElbowAngle: 18, lHandAngle: 0, lFingerSpread: 0.1, rShoulderAngle: 75, rElbowAngle: 60, rHandAngle: 0, rFingerSpread: 0 },
  // 8: Both hands forward, palms down (STOP / CALM)
  { lShoulderAngle: -50, lElbowAngle: -15, lHandAngle: -30, lFingerSpread: 0.7, rShoulderAngle: 50, rElbowAngle: 15, rHandAngle: 30, rFingerSpread: 0.7 },
  // 9: Right hand at ear, left out (LISTEN)
  { lShoulderAngle: -40, lElbowAngle: -5, lHandAngle: 0, lFingerSpread: 0.5, rShoulderAngle: 60, rElbowAngle: 110, rHandAngle: 10, rFingerSpread: 0.4 },
];

const IDLE_POSE: ArmPose = POSES[0]!;

// ─── Helpers ──────────────────────────────────────────────────────
function hashGloss(gloss: string): number {
  let h = 0;
  for (let i = 0; i < gloss.length; i++) {
    h = ((h << 5) - h + gloss.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function getPoseForGloss(gloss: string): ArmPose {
  const idx = (hashGloss(gloss) % (POSES.length - 1)) + 1; // skip rest pose
  return POSES[idx]!;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPose(a: ArmPose, b: ArmPose, t: number): ArmPose {
  return {
    lShoulderAngle: lerp(a.lShoulderAngle, b.lShoulderAngle, t),
    lElbowAngle: lerp(a.lElbowAngle, b.lElbowAngle, t),
    lHandAngle: lerp(a.lHandAngle, b.lHandAngle, t),
    lFingerSpread: lerp(a.lFingerSpread, b.lFingerSpread, t),
    rShoulderAngle: lerp(a.rShoulderAngle, b.rShoulderAngle, t),
    rElbowAngle: lerp(a.rElbowAngle, b.rElbowAngle, t),
    rHandAngle: lerp(a.rHandAngle, b.rHandAngle, t),
    rFingerSpread: lerp(a.rFingerSpread, b.rFingerSpread, t),
  };
}

// Ease-in-out cubic
function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── SVG sub-components ───────────────────────────────────────────

/** Renders a single hand (5 fingers) at origin, facing upward. */
function Hand({ spread, mirror }: { spread: number; mirror: boolean }) {
  const dir = mirror ? -1 : 1;
  // Finger offsets from center: thumb is wider, others narrower
  const fingers = [
    { x: dir * (-8 - spread * 5), y: -10, len: 9, angle: dir * (-20 - spread * 25) },  // thumb
    { x: dir * (-3.5), y: -13 - spread * 2, len: 11, angle: dir * (-5 - spread * 8) }, // index
    { x: dir * 0, y: -14 - spread * 2, len: 12, angle: 0 },                            // middle
    { x: dir * 3.5, y: -13 - spread * 2, len: 11, angle: dir * (5 + spread * 8) },     // ring
    { x: dir * 6.5, y: -11 - spread * 1, len: 9, angle: dir * (10 + spread * 15) },    // pinky
  ];

  return (
    <g>
      {/* Palm */}
      <ellipse cx={0} cy={-4} rx={9} ry={10} fill="#E8B48A" stroke="#D4976B" strokeWidth={0.8} />
      {/* Fingers */}
      {fingers.map((f, i) => (
        <line
          key={i}
          x1={f.x}
          y1={f.y}
          x2={f.x + Math.sin((f.angle * Math.PI) / 180) * f.len}
          y2={f.y - Math.cos((f.angle * Math.PI) / 180) * f.len}
          stroke="#E8B48A"
          strokeWidth={3.2}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

// ─── Main component ──────────────────────────────────────────────
export function ISLAvatar({
  glosses = [],
  isPlaying = false,
  speed = 1,
  onGlossChange,
  onComplete,
  className = "",
}: ISLAvatarProps) {
  const [currentGlossIndex, setCurrentGlossIndex] = useState(-1);
  const [currentPose, setCurrentPose] = useState<ArmPose>(IDLE_POSE);
  const [breathOffset, setBreathOffset] = useState(0);
  const animFrameRef = useRef<number>(0);
  const fromPoseRef = useRef<ArmPose>(IDLE_POSE);
  const toPoseRef = useRef<ArmPose>(IDLE_POSE);
  const transitionStartRef = useRef(0);
  const transitionDuration = 350; // ms for arm transition

  // Breathing animation (always runs)
  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      setBreathOffset(Math.sin(Date.now() / 1200) * 1.5);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { running = false; };
  }, []);

  // Smooth pose interpolation via rAF
  // Keep latest pose ref for animation interpolation
  const latestPoseRef = useRef(currentPose);
  latestPoseRef.current = currentPose;

  const animateTo = useCallback(
    (target: ArmPose) => {
      fromPoseRef.current = { ...latestPoseRef.current };
      toPoseRef.current = target;
      transitionStartRef.current = Date.now();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      const step = () => {
        const elapsed = Date.now() - transitionStartRef.current;
        const t = Math.min(elapsed / transitionDuration, 1);
        const eased = ease(t);
        setCurrentPose(lerpPose(fromPoseRef.current, toPoseRef.current, eased));
        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        }
      };
      animFrameRef.current = requestAnimationFrame(step);
    },
    []
  );

  // Gloss playback sequencer
  useEffect(() => {
    if (!isPlaying || glosses.length === 0) {
      if (!isPlaying) {
        setCurrentGlossIndex(-1);
        animateTo(IDLE_POSE);
      }
      return;
    }

    let idx = 0;
    setCurrentGlossIndex(0);
    onGlossChange?.(0);
    animateTo(getPoseForGloss(glosses[0]!));

    const intervalMs = 800 / speed;
    const timer = setInterval(() => {
      idx += 1;
      if (idx >= glosses.length) {
        clearInterval(timer);
        setCurrentGlossIndex(-1);
        animateTo(IDLE_POSE);
        onComplete?.();
        return;
      }
      setCurrentGlossIndex(idx);
      onGlossChange?.(idx);
      animateTo(getPoseForGloss(glosses[idx]!));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, glosses, speed, onGlossChange, onComplete, animateTo]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // ── Derived arm geometry ──────────────────────────────────────
  const p = currentPose;
  const UPPER_ARM = 40;
  const FOREARM = 36;

  // Shoulder attachment points
  const lShoulderX = 120;
  const lShoulderY = 195 + breathOffset;
  const rShoulderX = 280;
  const rShoulderY = 195 + breathOffset;

  // Left arm
  const lShoulderRad = (p.lShoulderAngle * Math.PI) / 180;
  const lElbowX = lShoulderX + Math.sin(lShoulderRad) * UPPER_ARM;
  const lElbowY = lShoulderY + Math.cos(lShoulderRad) * UPPER_ARM;
  const lElbowRad = ((p.lShoulderAngle + p.lElbowAngle) * Math.PI) / 180;
  const lHandX = lElbowX + Math.sin(lElbowRad) * FOREARM;
  const lHandY = lElbowY + Math.cos(lElbowRad) * FOREARM;

  // Right arm
  const rShoulderRad = (p.rShoulderAngle * Math.PI) / 180;
  const rElbowX = rShoulderX + Math.sin(rShoulderRad) * UPPER_ARM;
  const rElbowY = rShoulderY + Math.cos(rShoulderRad) * UPPER_ARM;
  const rElbowRad = ((p.rShoulderAngle + p.rElbowAngle) * Math.PI) / 180;
  const rHandX = rElbowX + Math.sin(rElbowRad) * FOREARM;
  const rHandY = rElbowY + Math.cos(rElbowRad) * FOREARM;

  const currentGloss = currentGlossIndex >= 0 && currentGlossIndex < glosses.length
    ? glosses[currentGlossIndex]
    : null;

  // Eye blink animation state
  const [blinkPhase, setBlinkPhase] = useState(false);
  useEffect(() => {
    const blink = () => {
      setBlinkPhase(true);
      setTimeout(() => setBlinkPhase(false), 150);
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 420"
        className="w-full h-full max-h-full"
        style={{ maxWidth: 400 }}
        aria-label="ISL Sign Language Avatar"
        role="img"
      >
        <defs>
          {/* Skin gradient */}
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7D4B0" />
            <stop offset="100%" stopColor="#E8B48A" />
          </linearGradient>
          {/* Shirt gradient */}
          <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
          {/* Hair gradient */}
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A3728" />
            <stop offset="100%" stopColor="#2D1F14" />
          </linearGradient>
          {/* Shadow filter */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000020" />
          </filter>
        </defs>

        {/* ── Body / Torso ──────────────────────────── */}
        <g transform={`translate(0, ${breathOffset})`}>
          {/* Torso / shirt */}
          <path
            d="M140,190 Q140,185 145,180 L200,170 L255,180 Q260,185 260,190 L270,310 Q270,320 260,320 L140,320 Q130,320 130,310 Z"
            fill="url(#shirtGrad)"
            stroke="#3730A3"
            strokeWidth={1.2}
            filter="url(#shadow)"
          />
          {/* Collar / V-neck */}
          <path
            d="M170,180 L200,205 L230,180"
            fill="none"
            stroke="#4338CA"
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Collar inner skin */}
          <path
            d="M172,180 L200,202 L228,180 L220,175 L200,170 L180,175 Z"
            fill="url(#skinGrad)"
          />

          {/* ── Neck ────────────────────────────────── */}
          <rect x={186} y={148} width={28} height={28} rx={6} fill="url(#skinGrad)" />

          {/* ── Head ────────────────────────────────── */}
          <g>
            {/* Hair (back) */}
            <ellipse cx={200} cy={95} rx={52} ry={58} fill="url(#hairGrad)" />
            {/* Face */}
            <ellipse cx={200} cy={100} rx={46} ry={52} fill="url(#skinGrad)" stroke="#D4976B" strokeWidth={0.8} />
            {/* Hair (front / bangs) */}
            <path
              d="M154,85 Q160,55 200,48 Q240,55 246,85 Q240,72 200,68 Q160,72 154,85 Z"
              fill="url(#hairGrad)"
            />

            {/* Ears */}
            <ellipse cx={154} cy={105} rx={7} ry={12} fill="url(#skinGrad)" stroke="#D4976B" strokeWidth={0.6} />
            <ellipse cx={246} cy={105} rx={7} ry={12} fill="url(#skinGrad)" stroke="#D4976B" strokeWidth={0.6} />

            {/* Eyebrows */}
            <path d="M176,86 Q183,82 191,85" stroke="#3D2B1F" strokeWidth={1.8} strokeLinecap="round" fill="none" />
            <path d="M209,85 Q217,82 224,86" stroke="#3D2B1F" strokeWidth={1.8} strokeLinecap="round" fill="none" />

            {/* Eyes */}
            {blinkPhase ? (
              <>
                <line x1={179} y1={97} x2={191} y2={97} stroke="#2D1F14" strokeWidth={2} strokeLinecap="round" />
                <line x1={209} y1={97} x2={221} y2={97} stroke="#2D1F14" strokeWidth={2} strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* Left eye */}
                <ellipse cx={185} cy={97} rx={7} ry={6.5} fill="white" stroke="#D4976B" strokeWidth={0.5} />
                <circle cx={186} cy={97} r={3.5} fill="#2D1F14" />
                <circle cx={187.5} cy={95.5} r={1.2} fill="white" />
                {/* Right eye */}
                <ellipse cx={215} cy={97} rx={7} ry={6.5} fill="white" stroke="#D4976B" strokeWidth={0.5} />
                <circle cx={214} cy={97} r={3.5} fill="#2D1F14" />
                <circle cx={215.5} cy={95.5} r={1.2} fill="white" />
              </>
            )}

            {/* Nose */}
            <path d="M198,107 Q200,113 202,107" stroke="#D4976B" strokeWidth={1.2} fill="none" strokeLinecap="round" />

            {/* Mouth — slight smile, wider when signing */}
            <path
              d={currentGloss
                ? "M189,121 Q195,128 200,128 Q205,128 211,121"
                : "M191,122 Q196,126 200,126 Q204,126 209,122"
              }
              stroke="#C4705A"
              strokeWidth={1.8}
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* ── Left Arm ──────────────────────────── */}
        <g>
          {/* Upper arm */}
          <line
            x1={lShoulderX} y1={lShoulderY}
            x2={lElbowX} y2={lElbowY}
            stroke="#4338CA" strokeWidth={16} strokeLinecap="round"
          />
          {/* Forearm (skin) */}
          <line
            x1={lElbowX} y1={lElbowY}
            x2={lHandX} y2={lHandY}
            stroke="#E8B48A" strokeWidth={12} strokeLinecap="round"
          />
          {/* Elbow joint */}
          <circle cx={lElbowX} cy={lElbowY} r={7} fill="#E8B48A" stroke="#D4976B" strokeWidth={0.5} />
          {/* Hand */}
          <g transform={`translate(${lHandX}, ${lHandY}) rotate(${p.lShoulderAngle + p.lElbowAngle + p.lHandAngle})`}>
            <Hand spread={p.lFingerSpread} mirror={false} />
          </g>
        </g>

        {/* ── Right Arm ─────────────────────────── */}
        <g>
          {/* Upper arm */}
          <line
            x1={rShoulderX} y1={rShoulderY}
            x2={rElbowX} y2={rElbowY}
            stroke="#4338CA" strokeWidth={16} strokeLinecap="round"
          />
          {/* Forearm (skin) */}
          <line
            x1={rElbowX} y1={rElbowY}
            x2={rHandX} y2={rHandY}
            stroke="#E8B48A" strokeWidth={12} strokeLinecap="round"
          />
          {/* Elbow joint */}
          <circle cx={rElbowX} cy={rElbowY} r={7} fill="#E8B48A" stroke="#D4976B" strokeWidth={0.5} />
          {/* Hand */}
          <g transform={`translate(${rHandX}, ${rHandY}) rotate(${p.rShoulderAngle + p.rElbowAngle + p.rHandAngle})`}>
            <Hand spread={p.rFingerSpread} mirror={true} />
          </g>
        </g>

        {/* ── Shoulder covers (on top of arm joints) ── */}
        <g transform={`translate(0, ${breathOffset})`}>
          <circle cx={lShoulderX} cy={lShoulderY} r={12} fill="#6366F1" stroke="#4338CA" strokeWidth={1} />
          <circle cx={rShoulderX} cy={rShoulderY} r={12} fill="#6366F1" stroke="#4338CA" strokeWidth={1} />
        </g>
      </svg>

      {/* ── Current gloss badge ────────────────── */}
      <div
        className="mt-1 flex items-center justify-center"
        style={{ minHeight: 32 }}
      >
        {currentGloss ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary,#f3f4f6)] px-3 py-1 text-sm font-semibold text-[var(--text-primary,#111827)] shadow-sm ring-1 ring-inset ring-[var(--border-primary,#e5e7eb)]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {currentGloss}
          </span>
        ) : glosses.length > 0 && !isPlaying ? (
          <span className="text-xs text-[var(--text-muted,#9ca3af)]">
            Press play to begin signing
          </span>
        ) : null}
      </div>
    </div>
  );
}
