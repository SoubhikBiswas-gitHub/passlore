import type { ReactNode } from "react"

export type LoreMood = "worried" | "unsure" | "happy" | "cool" | "proud" | "shocked" | "wink" | "sleepy"
export type LoreScene = "shield" | "puddle" | "cloud" | "drawer" | "lock" | "dice" | "confetti" | "sparkles"

type LoreProps = {
  mood: LoreMood
  scene?: LoreScene
  size?: number
  label?: string
  animate?: boolean
  className?: string
}

const INK = "#0B0D17"
const VOLT = "#C8FF2E"
const BLUE = "#2447F5"
const NONE = "M0 0"

const eye = (x: number, y: number, r: number) =>
  `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
const OPEN = `${eye(56, 66, 5)} ${eye(84, 66, 5)}`
const BIG = `${eye(56, 64, 6.5)} ${eye(84, 64, 6.5)}`

type Arm = { d: string; hx: number; hy: number; wave: boolean }
const ARMS = {
  wave: { d: "M32 62Q18 48 20 32", hx: 20, hy: 30, wave: true },
  down: { d: "M32 84Q20 94 18 106", hx: 18, hy: 108, wave: false },
  up: { d: "M32 70Q14 64 14 48", hx: 14, hy: 46, wave: false },
  cheer: { d: "M34 56Q22 36 30 22", hx: 30, hy: 20, wave: true },
} satisfies Record<string, Arm>

type Face = {
  arm: keyof typeof ARMS
  eyesFill?: string
  eyesLine?: string
  brows?: string
  glasses?: string
  glint?: string
  mouth?: string
  mouthFill?: string
  tongue?: string
  sweat?: string
}

const FACES: Record<LoreMood, Face> = {
  happy: { eyesFill: OPEN, mouth: "M58 82Q70 94 82 82", arm: "wave" },
  proud: { eyesFill: OPEN, mouthFill: "M56 80Q70 98 84 80Z", tongue: "M64 88q6 5 12 0q-6-3-12 0z", arm: "cheer" },
  cool: {
    glasses:
      "M42 56h22a3 3 0 0 1 3 3v4a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10v-4a3 3 0 0 1 3-3z M74 56h22a3 3 0 0 1 3 3v4a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10v-4a3 3 0 0 1 3-3z M66 60h9",
    glint: "M48 61l5-4 M80 61l5-4",
    mouthFill: "M56 82Q70 98 84 82Z",
    arm: "cheer",
  },
  unsure: { eyesFill: OPEN, mouth: "M60 88H80", brows: "M48 54h12 M80 54h12", arm: "down" },
  worried: {
    eyesFill: BIG,
    brows: "M46 56l12-6 M94 56l-12-6",
    mouth: "M60 90Q70 81 80 90",
    sweat: "M104 34c5 7 5 12 0 14-5-2-5-7 0-14z",
    arm: "up",
  },
  shocked: { eyesFill: BIG, brows: "M48 48q6-6 12 0 M80 48q6-6 12 0", mouthFill: eye(70, 88, 6.5), arm: "up" },
  sleepy: { eyesLine: "M50 68q6 4 12 0 M78 68q6 4 12 0", mouth: "M65 88q5 3 10 0", arm: "down" },
  wink: { eyesFill: eye(56, 66, 5), eyesLine: "M78 67q6-5 12 0", mouth: "M58 82Q70 94 82 82", arm: "wave" },
}

const LORE_CSS = `
.lo{display:inline-block;line-height:0;flex:none}
.lo svg{display:block;overflow:visible;width:100%;height:100%}
.lo-bob{animation:lo-bob 4.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.lo-eye{animation:lo-blink 5.6s infinite;transform-box:fill-box;transform-origin:50% 50%}
.lo-arm{animation:lo-wave 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:100% 100%}
.lo-tw{animation:lo-tw 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
.lo-z{animation:lo-z 3s ease-in-out infinite}
.lo-drip{animation:lo-drip 1.8s ease-in infinite}
.lo-still *{animation:none!important}
@keyframes lo-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes lo-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes lo-wave{0%,100%{transform:rotate(0)}50%{transform:rotate(14deg)}}
@keyframes lo-tw{0%,100%{transform:scale(.7);opacity:.5}50%{transform:scale(1);opacity:1}}
@keyframes lo-z{0%{transform:translate(0,4px);opacity:0}40%{opacity:1}100%{transform:translate(6px,-10px);opacity:0}}
@keyframes lo-drip{0%{transform:translateY(-4px);opacity:0}30%{opacity:1}100%{transform:translateY(10px);opacity:0}}
.lore-bubble{position:relative;max-width:230px;margin:0;padding:10px 14px;border-radius:16px;background:var(--surface);color:var(--text);border:2px solid var(--text);font-size:14px;font-weight:600;line-height:1.35;box-shadow:3px 3px 0 var(--bubble-shadow,var(--primary));animation:lo-pop var(--t-panel,240ms) var(--ease-expo,ease-out)}
.lore-bubble::after{content:'';position:absolute;bottom:14px;width:14px;height:14px;background:var(--surface);border-right:2px solid var(--text);border-bottom:2px solid var(--text)}
.lore-bubble[data-tail=right]::after{right:-9px;transform:rotate(-45deg)}
.lore-bubble[data-tail=left]::after{left:-9px;transform:rotate(135deg)}
@keyframes lo-pop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.lo *,.lore-bubble{animation:none!important}}
`

function LoreStyles() {
  return (
    <style href="passlore-lore" precedence="default">
      {LORE_CSS}
    </style>
  )
}

function SceneBehind({ scene }: { scene?: LoreScene }) {
  if (scene === "drawer") {
    return (
      <g>
        <path d="M8 100h144l-8 36H16z" fill="#E7E9F0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M16 136h128" stroke={INK} strokeWidth="3" />
        <rect x="66" y="112" width="28" height="8" rx="4" fill={INK} />
      </g>
    )
  }
  if (scene === "puddle") {
    return (
      <g>
        <path
          d="M30 130c10-10 40-12 60-8s38 2 44 8-24 12-56 10-56-2-48-10z"
          fill="#FF7A85"
          stroke={INK}
          strokeWidth="3"
        />
        <path className="lo-drip" d="M128 92c4 6 4 10 0 12-4-2-4-6 0-12z" fill="#FF7A85" stroke={INK} strokeWidth="2.5" />
      </g>
    )
  }
  if (scene === "dice") {
    return (
      <g>
        <g transform="rotate(-14 14 112)">
          <rect x="-2" y="96" width="32" height="32" rx="7" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
          <circle cx="6" cy="104" r="3" fill={BLUE} />
          <circle cx="14" cy="112" r="3" fill={BLUE} />
          <circle cx="22" cy="120" r="3" fill={BLUE} />
        </g>
        <g transform="rotate(10 150 116)">
          <rect x="134" y="100" width="30" height="30" rx="7" fill={VOLT} stroke={INK} strokeWidth="3" />
          <circle cx="142" cy="108" r="3" fill={INK} />
          <circle cx="156" cy="108" r="3" fill={INK} />
          <circle cx="142" cy="122" r="3" fill={INK} />
          <circle cx="156" cy="122" r="3" fill={INK} />
        </g>
      </g>
    )
  }
  return null
}

function SceneFront({ scene }: { scene?: LoreScene }) {
  switch (scene) {
    case "sparkles":
      return (
        <g fill={VOLT} stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
          <path className="lo-tw" d="M14 14l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
          <path className="lo-tw" d="M150 4l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z" style={{ animationDelay: ".6s" }} />
          <path className="lo-tw" d="M160 58l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" style={{ animationDelay: "1.1s" }} />
        </g>
      )
    case "shield":
      return (
        <g>
          <path
            d="M138 -4l22 8v15c0 14-10 24-22 29-12-5-22-15-22-29V4z"
            fill="#E1F5E7"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M128 20l7 7 13-14" fill="none" stroke="#1F7A3A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )
    case "cloud":
      return (
        <g>
          <path
            d="M120 34a12 12 0 0 1 2-24 16 16 0 0 1 30 4 11 11 0 0 1 4 20z"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M134 16a5 5 0 1 1 7 4.5c-1.4.7-2 1.7-2 3 M139 29v.5" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
      )
    case "lock":
      return (
        <g>
          <path d="M134 54v-10a14 14 0 0 1 28 0v10" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <rect x="126" y="54" width="44" height="40" rx="9" fill={BLUE} stroke={INK} strokeWidth="3" />
          <circle cx="148" cy="70" r="5" fill={INK} />
          <path d="M146 72h4l1.5 10h-7z" fill={INK} />
        </g>
      )
    case "confetti":
      return (
        <g stroke={INK} strokeWidth="2">
          <rect className="lo-tw" x="4" y="20" width="9" height="9" rx="2" fill={BLUE} transform="rotate(20 8 24)" />
          <rect
            className="lo-tw"
            x="148"
            y="26"
            width="9"
            height="9"
            rx="2"
            fill={VOLT}
            transform="rotate(-18 152 30)"
            style={{ animationDelay: ".5s" }}
          />
          <circle className="lo-tw" cx="132" cy="2" r="5" fill="#FFFFFF" style={{ animationDelay: ".9s" }} />
          <circle className="lo-tw" cx="22" cy="-4" r="4" fill={VOLT} style={{ animationDelay: "1.3s" }} />
        </g>
      )
    default:
      return null
  }
}

export function Lore({ mood, scene, size = 160, label, animate = true, className }: LoreProps) {
  const face = FACES[mood] ?? FACES.happy
  const arm = ARMS[face.arm]
  const armClass = arm.wave ? "lo-arm" : undefined
  const classes = ["lo", animate ? "" : "lo-still", className ?? ""].filter(Boolean).join(" ")

  return (
    <>
      <LoreStyles />
      <span
        className={classes}
        role={label ? "img" : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        style={{ width: size, height: Math.round((size * 158) / 184) }}
      >
        <svg viewBox="-12 -14 184 158" focusable="false" aria-hidden="true">
          <ellipse cx="80" cy="134" rx="46" ry="6" fill={INK} opacity=".12" />
          <SceneBehind scene={scene} />
          <g className="lo-bob">
            <g transform="rotate(-8 80 70)">
              <path
                d="M60 104v14h-9 M80 104v14h9"
                fill="none"
                stroke={INK}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M88 58H142a7 7 0 0 1 7 7v6a7 7 0 0 1-7 7H88Z" fill={BLUE} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
              <path d="M116 78v13h9v-7h7v7h9V78" fill={BLUE} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
              <path className={armClass} d={arm.d} fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
              <circle className={armClass} cx={arm.hx} cy={arm.hy} r="6.5" fill={VOLT} stroke={INK} strokeWidth="3" />
              <circle cx="70" cy="68" r="40" fill={VOLT} stroke={INK} strokeWidth="3.5" />
              <path d="M44 42a34 34 0 0 1 22-11" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity=".8" />
              <circle cx="50" cy="80" r="6" fill={BLUE} opacity=".22" />
              <circle cx="92" cy="80" r="6" fill={BLUE} opacity=".22" />
              <path className="lo-eye" d={face.eyesFill ?? NONE} fill={INK} />
              <path d={face.eyesLine ?? NONE} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
              <path d={face.brows ?? NONE} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
              <path d={face.glasses ?? NONE} fill={INK} />
              <path d={face.glint ?? NONE} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <path
                d={face.mouth ?? NONE}
                fill="none"
                stroke={INK}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d={face.mouthFill ?? NONE} fill={INK} />
              <path d={face.tongue ?? NONE} fill="#FF7A85" />
              <path d={face.sweat ?? NONE} fill="#9AACFF" stroke={INK} strokeWidth="2.5" />
            </g>
          </g>
          <SceneFront scene={scene} />
          {mood === "sleepy" && (
            <g fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path className="lo-z" d="M118 18h10l-10 10h10" />
              <path className="lo-z" d="M134 2h7l-7 7h7" style={{ animationDelay: "1s" }} />
            </g>
          )}
        </svg>
      </span>
    </>
  )
}

export type LoreSpeechTone = "neutral" | "success" | "warning" | "danger"

const TONE_SHADOW: Record<LoreSpeechTone, string> = {
  neutral: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
}

export function LoreSpeech({
  children,
  tone = "neutral",
  tail = "right",
  className,
}: {
  children: ReactNode
  tone?: LoreSpeechTone
  tail?: "left" | "right"
  className?: string
}) {
  return (
    <>
      <LoreStyles />
      <p
        className={["lore-bubble", className ?? ""].filter(Boolean).join(" ")}
        data-tail={tail}
        style={{ ["--bubble-shadow" as string]: TONE_SHADOW[tone] }}
      >
        {children}
      </p>
    </>
  )
}
