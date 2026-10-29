"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { ArrowRight, ArrowsClockwise, Check, Info, Tray, Warning, WifiSlash, X } from "@phosphor-icons/react"
import { Lore, LoreSpeech } from "@/components/Lore"
import type { LoreMood, LoreScene } from "@/components/Lore"
import {
  FALLBACK_WORDS,
  SETS,
  defaultCfg,
  formConflict,
  formRules,
  gen,
  loadEffWords,
  loadHistory,
  metrics,
  saveHistory,
  tier,
} from "@/lib/generator"
import type { Config, GenResult, HistoryEntry, RecipeId } from "@/lib/generator"
import { CopyButton } from "./CopyButton"
import { Drawer } from "./Drawer"
import { LeakCheck } from "./LeakCheck"
import { NextSteps } from "./NextSteps"
import { RecipeDeck } from "./RecipeDeck"
import { RecipePanel } from "./RecipePanel"
import type { SetCfg } from "./RecipePanel"
import { ShareStrength } from "./ShareStrength"
import { ShowBig } from "./ShowBig"
import { StrengthRuler } from "./StrengthRuler"
import { Ticket } from "./Ticket"
import type { TicketError } from "./Ticket"
import { BUILD_ANNOUNCE, DECK, NEXT_STEPS, deckOf, isWordsRecipe, recipeDef, stubNote } from "./recipes"
import type { BuildKind } from "./recipes"
import s from "./Generator.module.css"

type Toast = { kind: "ok" | "error" | "info"; text: string }

type St = {
  recipe: RecipeId
  cfg: Config
  words: string[]
  resultWords: string[]
  result: GenResult
  ready: boolean
  revealed: boolean
  spell: boolean
  copied: boolean
  copiedKey: string
  burst: number
  clearOn: boolean
  clearLeft: number
  note: string
  history: HistoryEntry[]
  drawer: boolean
  showBig: boolean
  toast: Toast | null
  announce: string
  offline: boolean
  roll: number | null
}

const EMPTY: GenResult = { password: "", err: "", bulk: [] }

const INITIAL: St = {
  recipe: "quick",
  cfg: defaultCfg(),
  words: FALLBACK_WORDS,
  resultWords: FALLBACK_WORDS,
  result: EMPTY,
  ready: false,
  revealed: true,
  spell: false,
  copied: false,
  copiedKey: "",
  burst: 0,
  clearOn: false,
  clearLeft: 0,
  note: "",
  history: [],
  drawer: false,
  showBig: false,
  toast: null,
  announce: "",
  offline: false,
  roll: null,
}

const SCRAMBLE_CHARS = SETS.U + SETS.L + SETS.D + SETS.S

async function writeClip(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function readHash(): RecipeId | "words" | null {
  const m = /^#(?:.*&)?r=([a-z]+)/.exec(window.location.hash || "")
  if (!m) return null
  try {
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search)
  } catch {}
  if (m[1] === "words") return "words"
  return DECK.some((d) => d.id === m[1]) ? (m[1] as RecipeId) : null
}

function prefersReduced(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return true
  }
}

export function Generator({ children }: { children?: ReactNode }) {
  const [st, setSt] = useState<St>(INITIAL)
  const ref = useRef<St>(INITIAL)
  const raf = useRef(0)
  const touched = useRef(false)
  const clearTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const burstTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mbarRef = useRef<HTMLDivElement>(null)
  const [actions, setActions] = useState<HTMLElement | null>(null)

  const update = (patch: Partial<St>) => {
    ref.current = { ...ref.current, ...patch }
    setSt(ref.current)
  }

  const announce = (text: string) => {
    const same = ref.current.announce.replace(/ $/, "") === text
    update({ announce: same && !ref.current.announce.endsWith(" ") ? text + " " : text })
  }

  const toast = (kind: Toast["kind"], text: string) => {
    update({ toast: { kind, text } })
    announce(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => update({ toast: null }), 6000)
  }

  const startRoll = (pw: string) => {
    cancelAnimationFrame(raf.current)
    if (!pw || pw.length > 64 || prefersReduced()) {
      if (ref.current.roll != null) update({ roll: null })
      return
    }
    const t0 = performance.now()
    const step = () => {
      const el = performance.now() - t0
      if (el > 520) {
        update({ roll: null })
        return
      }
      update({ roll: el })
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }

  const apply = (patch: { recipe?: RecipeId; cfg?: Config }, why: string, extra: Partial<St> = {}) => {
    const cur = ref.current
    const r = patch.recipe ?? cur.recipe
    const c = patch.cfg ?? cur.cfg
    const g = gen(r, c, cur.words)
    let note = ""
    if (why) {
      const b = metrics(cur.recipe, cur.cfg, cur.resultWords).bits
      const a = metrics(r, c, cur.words).bits
      if (b && a) {
        const tb = tier(b)
        const ta = tier(a)
        note = why + ": " + Math.round(b) + " → " + Math.round(a) + " bits." + (ta.n !== tb.n ? " Now " + ta.name + " (was " + tb.name + ")." : "")
      }
    }
    touched.current = true
    update({ recipe: r, cfg: c, result: g, resultWords: cur.words, note, copied: false, ...extra })
    startRoll(g.password)
  }

  const setCfg: SetCfg = (key, patch, why) => {
    const cfg = { ...ref.current.cfg, [key]: { ...ref.current.cfg[key], ...patch } }
    if (key === "wifi" && Object.keys(patch).length === 1 && "ssid" in patch) {
      update({ cfg })
      return
    }
    apply({ cfg }, why)
  }

  const addHistory = (value: string, recipe: RecipeId, bits: number) => {
    const list = ref.current.history
    const id = Math.max(Date.now(), (list[0]?.id ?? 0) + 1)
    const next = [{ id, value, recipe, at: Date.now(), bits }, ...list.filter((h) => h.value !== value)].slice(0, 20)
    saveHistory(next)
    update({ history: next })
  }

  const currentValue = (cur: St) => (cur.recipe === "bulk" ? cur.result.bulk.join("\n") : cur.result.password)

  const regen = () => {
    const cur = ref.current
    const g = gen(cur.recipe, cur.cfg, cur.words)
    touched.current = true
    update({ result: g, resultWords: cur.words, copied: false, note: "" })
    if (!g.err) {
      const bits = metrics(cur.recipe, cur.cfg, cur.words).bits
      addHistory(cur.recipe === "bulk" ? g.bulk.join("\n") : g.password, cur.recipe, bits)
      announce((cur.recipe === "bulk" ? g.bulk.length + " new passwords cut. " : "New password cut. ") + tier(bits).name + ".")
    }
    startRoll(g.password)
  }

  const armClear = () => {
    clearInterval(clearTimer.current)
    update({ clearLeft: 60 })
    clearTimer.current = setInterval(() => {
      const left = ref.current.clearLeft - 1
      if (left > 0) {
        update({ clearLeft: left })
        return
      }
      clearInterval(clearTimer.current)
      update({ clearLeft: 0 })
      writeClip(" ").then((ok) =>
        toast(ok ? "ok" : "error", ok ? "Clipboard cleared." : "Couldn’t clear the clipboard — this tab wasn’t in focus. Copy something else to overwrite it."),
      )
    }, 1000)
  }

  const copyText = async (text: string, key: string, label: string, log: boolean) => {
    if (!text) return false
    const ok = await writeClip(text)
    if (!ok) {
      toast("error", "Couldn’t reach the clipboard here. Select the password and copy it yourself.")
      return false
    }
    const cur = ref.current
    touched.current = true
    const patch: Partial<St> = { copiedKey: key }
    if (key === "main") {
      patch.copied = true
      if (!prefersReduced()) {
        patch.burst = cur.burst + 1
        clearTimeout(burstTimer.current)
        burstTimer.current = setTimeout(() => update({ burst: 0 }), 750)
      }
    }
    update(patch)
    announce(label + " copied.")
    if (log) addHistory(text, cur.recipe, metrics(cur.recipe, cur.cfg, cur.resultWords).bits)
    clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => update({ copiedKey: "" }), 2000)
    if (cur.clearOn) armClear()
    return true
  }

  const copyMain = () => {
    const cur = ref.current
    if (cur.recipe === "bulk") copyText(cur.result.bulk.join("\n"), "main", cur.result.bulk.length + " passwords", true)
    else copyText(cur.result.password, "main", "Password", true)
  }

  const toggleClear = () => {
    const on = !ref.current.clearOn
    update({ clearOn: on })
    if (on && ref.current.copied) armClear()
    if (!on) {
      clearInterval(clearTimer.current)
      update({ clearLeft: 0 })
    }
  }

  const pickRecipe = (id: RecipeId) => {
    if (id === deckOf(ref.current.recipe)) return
    apply({ recipe: id }, "", { spell: false })
    announce("Recipe: " + recipeDef(id).name)
  }

  const buildKind: BuildKind | null =
    deckOf(st.recipe) !== "custom" ? null : st.recipe === "form" ? "rules" : st.recipe === "bulk" ? "many" : st.cfg.custom.kind === "words" ? "words" : "random"

  const pickBuild = (k: BuildKind) => {
    if (k === buildKind) return
    if (k === "rules") apply({ recipe: "form" }, "", { spell: false })
    else if (k === "many") apply({ recipe: "bulk" }, "", { spell: false })
    else {
      const cfg = { ...ref.current.cfg, custom: { ...ref.current.cfg.custom, kind: k } }
      apply({ recipe: "custom", cfg }, "", { spell: false })
    }
    announce("Build your own: " + BUILD_ANNOUNCE[k])
  }

  useEffect(() => {
    const cur = ref.current
    let recipe = cur.recipe
    let cfg = cur.cfg
    const fromHash = readHash()
    if (fromHash === "words") {
      recipe = "custom"
      cfg = { ...cfg, custom: { ...cfg.custom, kind: "words" } }
    } else if (fromHash) recipe = fromHash
    const g = gen(recipe, cfg, cur.words)
    update({ recipe, cfg, result: g, resultWords: cur.words, ready: true, history: loadHistory(), offline: !navigator.onLine })
    setActions(document.getElementById("header-actions"))

    let alive = true
    loadEffWords()
      .then((list) => {
        if (!alive || !list.length) return
        const now = ref.current
        const patch: Partial<St> = { words: list }
        // once the user has acted on a password, the full list only applies to the next cut
        if (isWordsRecipe(now.recipe, now.cfg.custom.kind) && !touched.current) {
          patch.result = gen(now.recipe, now.cfg, list)
          patch.resultWords = list
        }
        update(patch)
      })
      .catch(() => {})

    const onOnline = () => update({ offline: false })
    const onOffline = () => update({ offline: true })
    window.addEventListener("online", onOnline)
    window.addEventListener("offline", onOffline)
    const onHash = () => {
      const r = readHash()
      if (r === "words") {
        const cfg2 = { ...ref.current.cfg, custom: { ...ref.current.cfg.custom, kind: "words" as const } }
        apply({ recipe: "custom", cfg: cfg2 }, "", { spell: false })
      } else if (r && r !== deckOf(ref.current.recipe)) {
        apply({ recipe: r }, "", { spell: false })
        announce("Recipe: " + recipeDef(r).name)
      }
    }
    window.addEventListener("hashchange", onHash)
    return () => {
      alive = false
      window.removeEventListener("hashchange", onHash)
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
      cancelAnimationFrame(raf.current)
      clearInterval(clearTimer.current)
      clearTimeout(toastTimer.current)
      clearTimeout(copiedTimer.current)
      clearTimeout(burstTimer.current)
    }
  }, [])

  useEffect(() => {
    const el = mbarRef.current
    const root = document.documentElement
    if (!el) return
    let inView = true
    const measure = () => root.style.setProperty("--dock-h", (inView && el.offsetHeight ? el.offsetHeight + 28 : 0) + "px")
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    // the sticky dock scrolls away with its section, so stop reserving space once it is off screen
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      measure()
    })
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
      root.style.setProperty("--dock-h", "0px")
    }
  }, [])

  const m = useMemo(() => metrics(st.recipe, st.cfg, st.resultWords), [st.recipe, st.cfg, st.resultWords])
  const tr = tier(m.bits)
  const def = recipeDef(st.recipe)
  const isWords = isWordsRecipe(st.recipe, st.cfg.custom.kind)
  const { password, bulk, err } = st.result
  const isBulk = st.recipe === "bulk"

  let error: TicketError | null = null
  if (err === "empty") error = { title: "Nothing left to pick from", text: "Every character type is off or excluded.", fixLabel: "Turn lowercase back on", onFix: () => setCfg("custom", { lower: true, exclude: "" }, "") }
  else if (err === "fixed") error = { title: "Fixed text leaves too little room", text: "Fewer than 4 random characters would be left. Make it longer or the fixed text shorter.", fixLabel: "Make it longer", onFix: () => setCfg("custom", { length: Math.min(128, st.cfg.custom.include.length + 12) }, "") }
  else if (err === "pattern") error = { title: "This pattern has no random slots", text: "Every character is typed as-is, so every password would be identical.", fixLabel: "Use Aaaa-0000-!!!!", onFix: () => setCfg("custom", { pattern: "Aaaa-0000-!!!!" }, "") }
  else if (err === "form") {
    const conflict = formConflict(formRules(st.cfg.form))
    error = conflict
      ? { title: conflict.title, text: conflict.text, fixLabel: conflict.fix, onFix: () => setCfg("form", { ov: { ...st.cfg.form.ov, ...conflict.patch } }, "") }
      : { title: "These rules can’t be met", text: "Passlore couldn’t find a password that satisfies every rule. Loosen one below.", fixLabel: "Clear the rules", onFix: () => setCfg("form", { text: "", ov: {} }, "") }
  }

  let lore: [LoreMood, LoreScene | undefined, string]
  if (error) lore = ["shocked", undefined, err === "form" ? "These rules fight each other — fix one below and I’ll cut again." : "Nothing to cut with these settings — try the fix in the ticket."]
  else if (st.copied) lore = ["proud", "confetti", "Copied! Now paste it where it’s going."]
  else if (!st.revealed) lore = ["wink", undefined, "Hidden from shoulder-surfers. Copy still works."]
  else if (tr.n === 1) lore = ["worried", undefined, "Eek — that’s guessable almost at once."]
  else if (tr.n === 2) lore = ["worried", undefined, "Hmm. That falls fast if a site leaks."]
  else if (tr.n === 3) lore = ["unsure", undefined, "Fine where guesses are limited. Longer is better."]
  else if (tr.n === 4) lore = ["happy", undefined, "Nice — strong enough for almost any account."]
  else lore = ["cool", "sparkles", "Beyond what guessing can reach. Sunglasses on."]

  let shown = password
  if (st.roll != null && password) {
    const pool = isWords ? SETS.L : st.recipe === "pin" ? SETS.D : SCRAMBLE_CHARS
    const per = Math.min(22, 380 / Math.max(1, password.length))
    const frame = Math.floor(st.roll / 45)
    shown = password
      .split("")
      .map((ch, i) => (ch === " " || (isWords && /[-._]/.test(ch)) || st.roll! >= 120 + i * per ? ch : pool[(frame * 31 + i * 17 + i * i) % pool.length]))
      .join("")
  }

  let meta = ""
  if (st.ready && !error) {
    if (isBulk) meta = bulk.length + " passwords · " + st.cfg.bulk.length + " characters each"
    else
      meta =
        (st.revealed ? "" : "Hidden · ") +
        password.length +
        " characters" +
        (isWords ? " · " + password.split(/[ \-._]/).length + " words" : "") +
        (m.pool && !isWords && st.recipe !== "pin" ? " · from " + m.pool : "")
  }

  const noOutput = !!error || !st.ready || (isBulk ? bulk.length === 0 : !password)
  const copyLabel = isBulk ? "Copy all" : "Copy"
  const regenLabel = isBulk ? "Cut " + st.cfg.bulk.count + " new" : "Cut a new one"
  const steps = NEXT_STEPS[st.recipe] ?? NEXT_STEPS._
  const leakPassword = error ? "" : isBulk ? bulk[0] ?? "" : password
  const sep = st.recipe === "wifi" ? st.cfg.wifi.sep : st.recipe === "custom" ? st.cfg.custom.sep : " "
  const bigAllowed = isWords && !error && st.recipe !== "wifi"

  const drawerTrigger = (
    <button
      type="button"
      onClick={() => update({ drawer: true })}
      aria-label={"Open this tab’s drawer, " + st.history.length + " items"}
      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border px-3 text-sm font-semibold"
      style={{ borderColor: "var(--stage-line)", background: "transparent", color: "var(--on-stage)" }}
    >
      <Tray size={20} aria-hidden="true" />
      <span className="hidden min-[720px]:inline">Drawer</span>
      <span
        aria-hidden="true"
        className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-[13px]"
        style={{ background: "var(--on-stage)", color: "var(--stage)" }}
      >
        {st.history.length}
      </span>
    </button>
  )

  return (
    <div className={s.pl}>
      <a href="#ticket" className={s.sr}>Skip to the password</a>
      <div className={s.sr} role="status" aria-live="polite">{st.announce}</div>
      {actions && createPortal(drawerTrigger, actions)}

      {st.offline && (
        <div role="status" className={s.offline}>
          <p className={`${s.wrap} ${s.offlineIn}`}>
            <WifiSlash size={20} aria-hidden="true" style={{ color: "var(--warning)", flex: "none" }} />
            <span><strong>You’re offline.</strong> Every recipe still works; only the leak check needs a connection.</span>
          </p>
        </div>
      )}

      <section className={s.stage} aria-labelledby="h-where">
        <div className={`${s.wrap} ${s.stageIn}`}>
          <div className={s.head}>
            <div className={s.headText}>
              <h1 id="h-where" className={s.h1}>
                <span className={s.loreMini} aria-hidden="true">
                  <Lore mood={lore[0]} size={76} />
                </span>
                Where is this password <mark className={s.hlm}>going?</mark>
              </h1>
              <p className={s.sub}>Pick a place, or just copy the one below. Made on this device, never uploaded.</p>
            </div>
            <div className={`${s.loreSpot} ${s.onlyWide}`}>
              <div style={{ paddingBottom: 46, maxWidth: 230 }}>
                <LoreSpeech tone={error ? "warning" : st.copied ? "success" : "neutral"}>{lore[2]}</LoreSpeech>
              </div>
              <Lore mood={lore[0]} scene={lore[1]} size={150} />
            </div>
          </div>

          <RecipeDeck selected={deckOf(st.recipe)} onPick={pickRecipe} />

          <Ticket
            def={def}
            meta={meta}
            error={error}
            password={password}
            shown={shown}
            bulk={isBulk ? bulk : null}
            isWords={isWords}
            revealed={st.revealed}
            spell={st.spell}
            ready={st.ready}
            copied={st.copied}
            burst={st.burst}
            copyLabel={copyLabel}
            regenLabel={regenLabel}
            note={stubNote(st.recipe)}
            onCopy={copyMain}
            onRegen={regen}
            onToggleReveal={() => {
              const revealed = !ref.current.revealed
              update({ revealed })
              announce(revealed ? "Password shown." : "Password hidden.")
            }}
            onToggleSpell={() => update({ spell: !ref.current.spell })}
            onShowBig={bigAllowed ? () => update({ showBig: true }) : null}
          />

          {st.copied && !error && <NextSteps steps={steps} clearOn={st.clearOn} clearLeft={st.clearLeft} onToggleClear={toggleClear} />}

          <StrengthRuler
            metrics={m}
            hasError={!!error}
            note={st.note}
            share={<ShareStrength bits={m.bits} isWords={isWords} isPin={st.recipe === "pin"} />}
          />
        </div>
      </section>

      <section id="tune" className={`${s.wrap} ${s.work}`} aria-label="Settings and checks">
        <RecipePanel
          recipe={st.recipe}
          cfg={st.cfg}
          password={error ? "" : password}
          bulk={bulk}
          wordCount={st.resultWords.length}
          fullList={st.resultWords.length > FALLBACK_WORDS.length}
          revealed={st.revealed}
          buildKind={buildKind}
          onBuild={pickBuild}
          setCfg={setCfg}
          onCopyValue={(v) => copyText(v, "bulk", v.includes("\n") ? v.split("\n").length + " passwords" : "Password", v.includes("\n"))}
        />
        <div className={s.side}>
          <LeakCheck
            key={leakPassword}
            password={leakPassword}
            subject={isBulk && leakPassword ? "Checks password 1 of the list." : undefined}
            onRegenerate={regen}
          />
          <Link href="/how-it-works" className={s.howLink}>
            How Passlore works
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {children}

      <div className={s.dock}>
        {st.toast && (
          <div className={s.toast}>
            {st.toast.kind === "error" ? <Warning size={20} aria-hidden="true" /> : st.toast.kind === "ok" ? <Check size={20} aria-hidden="true" /> : <Info size={20} aria-hidden="true" />}
            <span className="flex-1 text-[15px]">{st.toast.text}</span>
            <button type="button" className={s.toastBtn} aria-label="Dismiss" onClick={() => update({ toast: null })}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        )}
        <div ref={mbarRef} className={`${s.mbar} ${s.card}`}>
          <CopyButton label={copyLabel} copied={st.copied} burst={st.burst} disabled={noOutput} onCopy={copyMain} style={{ flex: 1.4 }} />
          <button className={`${s.btn} ${s.btnS} ${s.btnLg}`} type="button" aria-label={regenLabel} onClick={regen} style={{ flex: 1 }}>
            <ArrowsClockwise size={20} aria-hidden="true" />
            New
          </button>
        </div>
      </div>

      <Drawer
        open={st.drawer}
        onOpenChange={(open) => update({ drawer: open })}
        entries={st.history}
        copiedKey={st.copiedKey}
        onCopy={(e) => copyText(e.value, "h" + e.id, recipeDef(e.recipe).name + " password", false)}
        onEmpty={() => {
          saveHistory([])
          update({ history: [], drawer: false })
          toast("ok", "Drawer emptied.")
        }}
      />

      {bigAllowed && (
        <ShowBig open={st.showBig} onOpenChange={(open) => update({ showBig: open })} def={def} password={password} isWords={isWords} sep={sep} />
      )}
    </div>
  )
}
