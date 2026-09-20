// src/content/48-shell-terminal-command-line/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-01: full 6-Act. EKSEKUSI-02 (revisi-01): Act 1 jadi command
// journey nyata (pwd), anchor lahir di Act 1, tidak pernah reset canvas.
// EKSEKUSI-03 (revisi-02): Act 3-6 diganti dari row/chip istilah menjadi
// SATU kasus kausal per Act (before → intent → travel → apply → after):
//   Act 3 — echo "$HOME"/notes/*.txt  (quote shield, expand, builtin resolve)
//   Act 4 — grep error atas app.log/missing.log (stdin/stdout/redirect/stderr)
//   Act 5 — pwd dipakai ulang di 4 konteks (interactive/login/non-interactive/remote)
//   Act 6 — "April Report.txt" (quote shield vs ghost split, exit status gagal,
//           cleanup, target-shell badge)
// Anchor (terminal, PTY, shell, system) dari Act 1-2 tetap ter-mount di
// seluruh Act 3-4 (tidak di-popOut, hanya diredupkan lewat archDim).
// Icon: inline SVG saja.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  ARCH_LABELS, COMMAND_TEXT, OUTPUT_TEXT, ACT1_BEATS,
  EXT_COMMAND_TEXT, ACT2_BEATS,
  ACT3_CASE, ACT3_BEATS,
  ACT4_CASE, ACT4_BEATS,
  ACT5_CASE, ACT5_BEATS,
  ACT6_CASE, ACT6_BEATS,
  CLOSING_CAPTION,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

// ── Layout lokal (local coordinate ContentBodyV1, body 732×965) ──
const BODY_CX = 366
const NARRATION_Y = 40
const TERMINAL_TOP = 135
const TERMINAL_H = 220
const TERMINAL_Y = TERMINAL_TOP + TERMINAL_H / 2
const TERMINAL_W = 620
const PTY_Y = 397
const SHELL_HUB_Y = 475
const FORK_Y = 555
const SYSTEM_Y = 640
const STAGE_TOP = 700
// Act 4 — layout kasus grep
const SOURCE_X = 100
const TARGET_X = 620
const PROCESS_Y = STAGE_TOP + 50
const ROW2_Y = STAGE_TOP + 100

export default function ShellTerminalCommandLineAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const tlRef = useRef(null)
  const audioUnlockedRef = useRef(audioUnlocked)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [morphP, setMorphP] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [caption, setCaption] = useState('')
  const [pop, setPop] = useState({})

  const [stage, setStage] = useState('idle')
  const [highlightId, setHighlightId] = useState(null)

  const [archDim, setArchDim] = useState(false)
  const [forkChoice, setForkChoice] = useState(null) // 'builtin' | 'exec'
  const [shellActive, setShellActive] = useState(false)
  const [systemActive, setSystemActive] = useState(false)

  // ── terminal line state (dipakai ulang lintas Act — tidak reset canvas) ──
  const [cmdText, setCmdText] = useState('')
  const [cmdTypedLen, setCmdTypedLen] = useState(0)
  const [outputText, setOutputText] = useState('')
  const [outputTypedLen, setOutputTypedLen] = useState(0)
  const [statusToken, setStatusToken] = useState(null) // '0' | '1' | null

  const [packet, setPacket] = useState({ x: BODY_CX, y: TERMINAL_Y, label: '', visible: false, variant: 'command' })
  const [flow, setFlow] = useState({ x: 0, y: 0, visible: false, color: COLORS.STDOUT })

  // ── state per-Act (revisi 02: satu kasus kausal) ──
  const [act3, setAct3] = useState({ step: 'idle', matched: { todo: false, idea: false, image: false }, homeExpanded: false })
  const [act4, setAct4] = useState({ step: 'idle', stdinOn: false, stdoutOn: false, redirectOn: false, stderrOn: false })
  const [act5, setAct5] = useState({ active: null, recap: false })
  const [act6, setAct6] = useState({ step: 'idle', targetShell: 'bash' })

  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    sfxLoader.setEnabled(Boolean(previewSfx && audioUnlocked))
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.42, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 12,
      sfxName = SFX_MAP.POP.name, sfxCategory = SFX_MAP.POP.category, volumeMult = 1 } = opts
    tl.add(() => setPop((prev) => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current * volumeMult, speed: speedRef.current }) },
      onUpdate: () => setPop((prev) => ({
        ...prev,
        [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) },
      })),
    }, time)
  }

  const popOut = (tl, time, id, opts = {}) => {
    const { duration = 0.28, ease = 'power1.in' } = opts
    const o = { v: 1 }
    tl.to(o, {
      v: 0, duration, ease,
      onUpdate: () => setPop((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v, opacity: o.v } })),
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, category, name, volumeMult = 1) =>
    tl.add(() => { if (audioUnlockedRef.current) sfxLoader.play(category, name, { volume: volumeRef.current * volumeMult, speed: speedRef.current }) }, time)
  const goStage = (tl, time, id) => tl.add(() => setStage(id), time)
  const highlight = (tl, time, id) => tl.add(() => setHighlightId(id), time)
  const typeText = (tl, time, text, setLen, duration, steps = 5) => {
    const o = { n: 0 }
    tl.to(o, { n: text.length, duration, ease: `steps(${steps})`, onUpdate: () => setLen(Math.round(o.n)) }, time)
    return time + duration
  }

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let lastPacket = { x: BODY_CX, y: TERMINAL_Y }
    const travelPacket = (time, to, duration, opts = {}) => {
      const { ease = 'power2.inOut', label, variant } = opts
      const from = { ...lastPacket }
      const o = { x: from.x, y: from.y }
      tl.to(o, {
        x: to.x, y: to.y, duration, ease,
        onUpdate: () => setPacket((p) => ({
          ...p, x: o.x, y: o.y,
          label: label !== undefined ? label : p.label,
          variant: variant !== undefined ? variant : p.variant,
          visible: true,
        })),
      }, time)
      lastPacket = to
      return time + duration
    }

    let lastFlow = { x: 0, y: 0 }
    const travelFlow = (time, to, duration, opts = {}) => {
      const { ease = 'power1.inOut', color } = opts
      const from = { ...lastFlow }
      const o = { x: from.x, y: from.y }
      tl.to(o, {
        x: to.x, y: to.y, duration, ease,
        onUpdate: () => setFlow((f) => ({ ...f, x: o.x, y: o.y, color: color !== undefined ? color : f.color, visible: true })),
      }, time)
      lastFlow = to
      return time + duration
    }

    let t = 0

    // ── reset ──
    tl.add(() => {
      setMorphP(0); setContentStarted(false); setPhaseIdx(0)
      setStage('idle'); setHighlightId(null)
      setArchDim(false); setForkChoice(null)
      setShellActive(false); setSystemActive(false)
      setCmdText(''); setCmdTypedLen(0); setOutputText(''); setOutputTypedLen(0); setStatusToken(null)
      setPacket({ x: BODY_CX, y: TERMINAL_Y, label: '', visible: false, variant: 'command' })
      setFlow({ x: 0, y: 0, visible: false, color: COLORS.STDOUT })
      setAct3({ step: 'idle', matched: { todo: false, idea: false, image: false }, homeExpanded: false })
      setAct4({ step: 'idle', stdinOn: false, stdoutOn: false, redirectOn: false, stderrOn: false })
      setAct5({ active: null, recap: false })
      setAct6({ step: 'idle', targetShell: 'bash' })
      setPop({}); setCaption('')
    }, t)
    lastPacket = { x: BODY_CX, y: TERMINAL_Y }
    lastFlow = { x: SOURCE_X, y: STAGE_TOP }

    // ── INTRO ──
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.85, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, SFX_MAP.SWOOSH_QUICK.category, SFX_MAP.SWOOSH_QUICK.name)
    t += 0.85
    tl.add(() => setContentStarted(true), t)
    t += 0.15

    // ═══════════ ACT 1 — Satu Command Bekerja (revisi 01) ═══════════
    tl.add(() => setPhaseIdx(0), t)
    goStage(tl, t, 'overview')
    popIn(tl, t + 0.05, 'terminalWin', { fromY: -14, sfxName: SFX_MAP.PAPER_OPEN.name, sfxCategory: SFX_MAP.PAPER_OPEN.category })
    t += 0.7

    tl.add(() => setCmdText(COMMAND_TEXT), t)
    sfxOn(tl, t, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
    sfxOn(tl, t + 0.3, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
    t = typeText(tl, t, COMMAND_TEXT, setCmdTypedLen, 0.6, 3)
    t += 0.05

    sfxOn(tl, t, SFX_MAP.POP.category, SFX_MAP.POP.name)
    tl.add(() => setPacket({ x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34, label: COMMAND_TEXT, visible: true, variant: 'command' }), t)
    lastPacket = { x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34 }
    t += 0.2

    popIn(tl, t, 'ptyCable', { fromY: -8, sfx: false })
    t = travelPacket(t, { x: BODY_CX, y: PTY_Y }, 0.45)
    t += 0.15

    popIn(tl, t, 'shellHub', { fromY: 10, sfxName: SFX_MAP.CONNECTOR_SNAP.name, sfxCategory: SFX_MAP.CONNECTOR_SNAP.category })
    tl.add(() => setShellActive(true), t)
    t = travelPacket(t, { x: BODY_CX, y: SHELL_HUB_Y }, 0.4)
    t += 0.5

    tl.add(() => setShellActive(false), t)
    popIn(tl, t, 'systemNode', { fromY: 10, sfxName: SFX_MAP.LOCK.name, sfxCategory: SFX_MAP.LOCK.category })
    tl.add(() => setSystemActive(true), t)
    t = travelPacket(t, { x: BODY_CX, y: SYSTEM_Y }, 0.45)
    t += 0.55

    sfxOn(tl, t, SFX_MAP.CONFIRM.category, SFX_MAP.CONFIRM.name)
    tl.add(() => { setSystemActive(false); setPacket((p) => ({ ...p, label: OUTPUT_TEXT, variant: 'output', visible: true })) }, t)
    lastPacket = { x: BODY_CX, y: SYSTEM_Y }
    t += 0.2

    tl.add(() => setShellActive(true), t)
    t = travelPacket(t, { x: BODY_CX, y: SHELL_HUB_Y }, 0.4)
    tl.add(() => setShellActive(false), t)
    t = travelPacket(t, { x: BODY_CX, y: PTY_Y }, 0.35)
    t = travelPacket(t, { x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34 }, 0.35)
    t += 0.1

    tl.add(() => { setPacket((p) => ({ ...p, visible: false })); setOutputText(OUTPUT_TEXT) }, t)
    sfxOn(tl, t, SFX_MAP.DING.category, SFX_MAP.DING.name)
    t = typeText(tl, t, OUTPUT_TEXT, setOutputTypedLen, 0.5, 4)

    ;['terminal', 'cmdline', 'shell'].forEach((id) => {
      highlight(tl, t, id)
      sfxOn(tl, t, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
      t += 0.22
    })
    tl.add(() => setHighlightId(null), t)
    say(tl, t, ACT1_BEATS.closing)
    sfxOn(tl, t, SFX_MAP.CHIME.category, SFX_MAP.CHIME.name)
    t += 1.3
    say(tl, t, '')
    t += 0.2

    // ═══════════ ACT 2 — Builtin vs Executable (tanpa reset canvas) ═══════════
    tl.add(() => setPhaseIdx(1), t)
    goStage(tl, t, 'builtin-vs-exec')
    say(tl, t + 0.05, ACT2_BEATS.question)
    t += 1.0
    say(tl, t, ACT2_BEATS.builtinRecap)
    popIn(tl, t, 'forkBuiltin', { fromX: -14 })
    popIn(tl, t, 'forkExec', { fromX: 14 })
    t += 1.3

    say(tl, t, ACT2_BEATS.lookup)
    tl.add(() => { setOutputText(''); setOutputTypedLen(0); setStatusToken(null); setCmdText(EXT_COMMAND_TEXT) }, t)
    sfxOn(tl, t, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
    sfxOn(tl, t + 0.35, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
    t = typeText(tl, t, EXT_COMMAND_TEXT, setCmdTypedLen, 0.7, 5)
    t += 0.05

    sfxOn(tl, t, SFX_MAP.POP.category, SFX_MAP.POP.name)
    tl.add(() => setPacket({ x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34, label: EXT_COMMAND_TEXT, visible: true, variant: 'command' }), t)
    lastPacket = { x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34 }
    t += 0.2
    t = travelPacket(t, { x: BODY_CX, y: PTY_Y }, 0.4)
    tl.add(() => setShellActive(true), t)
    t = travelPacket(t, { x: BODY_CX, y: SHELL_HUB_Y }, 0.4)
    t += 0.3

    tl.add(() => { setShellActive(false); setForkChoice('exec') }, t)
    t = travelPacket(t, { x: BODY_CX + 130, y: FORK_Y }, 0.5, { label: `${EXT_COMMAND_TEXT} → PATH` })
    say(tl, t, ACT2_BEATS.path)
    t += 1.0

    tl.add(() => setSystemActive(true), t)
    t = travelPacket(t, { x: BODY_CX, y: SYSTEM_Y }, 0.45, { label: 'process' })
    say(tl, t, ACT2_BEATS.system)
    sfxOn(tl, t, SFX_MAP.CONFIRM.category, SFX_MAP.CONFIRM.name)
    t += 1.2

    tl.add(() => { setSystemActive(false); setPacket((p) => ({ ...p, visible: false })); setArchDim(true) }, t)
    popOut(tl, t, 'forkBuiltin', {})
    popOut(tl, t, 'forkExec', {})
    tl.add(() => setForkChoice(null), t)
    say(tl, t, ACT2_BEATS.payoff)
    sfxOn(tl, t, SFX_MAP.DING.category, SFX_MAP.DING.name)
    t += 1.3

    // ═══════════ ACT 3 — Shell Membaca Struktur (revisi 02) ═══════════
    // Kasus: echo "$HOME"/notes/*.txt — quote shield, expand, resolve builtin.
    tl.add(() => setPhaseIdx(2), t)
    goStage(tl, t, 'act3')
    say(tl, t + 0.05, ACT3_BEATS.question)
    t += 0.6

    tl.add(() => { setCmdText(ACT3_CASE.command); setOutputText(''); setOutputTypedLen(0); setStatusToken(null) }, t)
    sfxOn(tl, t, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
    sfxOn(tl, t + 0.5, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
    t = typeText(tl, t, ACT3_CASE.command, setCmdTypedLen, 1.0, 6)
    t += 0.05

    sfxOn(tl, t, SFX_MAP.POP.category, SFX_MAP.POP.name)
    tl.add(() => setPacket({ x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34, label: ACT3_CASE.command, visible: true, variant: 'command' }), t)
    lastPacket = { x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34 }
    t += 0.2
    t = travelPacket(t, { x: BODY_CX, y: PTY_Y }, 0.4)
    t = travelPacket(t, { x: BODY_CX, y: SHELL_HUB_Y }, 0.4)
    tl.add(() => setPacket((p) => ({ ...p, visible: false })), t)
    t += 0.1

    tl.add(() => setAct3((p) => ({ ...p, step: 'split' })), t)
    say(tl, t, ACT3_BEATS.quote)
    sfxOn(tl, t, SFX_MAP.CONNECTOR_SNAP.category, SFX_MAP.CONNECTOR_SNAP.name)
    t += 1.0

    popIn(tl, t, 'folderRow', { fromY: 16 })
    tl.add(() => setAct3((p) => ({ ...p, step: 'expand' })), t)
    say(tl, t, ACT3_BEATS.expand)
    sfxOn(tl, t, SFX_MAP.SWOOSH_QUICK.category, SFX_MAP.SWOOSH_QUICK.name)
    tl.add(() => setAct3((p) => ({ ...p, homeExpanded: true })), t + 0.15)
    tl.add(() => setAct3((p) => ({ ...p, matched: { ...p.matched, todo: true } })), t + 0.4)
    sfxOn(tl, t + 0.4, SFX_MAP.POP2.category, SFX_MAP.POP2.name)
    tl.add(() => setAct3((p) => ({ ...p, matched: { ...p.matched, idea: true } })), t + 0.75)
    sfxOn(tl, t + 0.75, SFX_MAP.POP2.category, SFX_MAP.POP2.name)
    t += 1.2

    tl.add(() => setAct3((p) => ({ ...p, step: 'resolve' })), t)
    say(tl, t, ACT3_BEATS.resolve)
    popIn(tl, t, 'forkBuiltin', { fromX: -14 })
    popIn(tl, t, 'forkExec', { fromX: 14 })
    tl.add(() => setForkChoice('builtin'), t + 0.1)
    tl.add(() => setPacket({ x: BODY_CX, y: SHELL_HUB_Y, label: 'echo', visible: true, variant: 'command' }), t + 0.1)
    lastPacket = { x: BODY_CX, y: SHELL_HUB_Y }
    t = travelPacket(t + 0.1, { x: BODY_CX - 130, y: FORK_Y }, 0.45, { label: 'echo (builtin)' })
    t += 0.5
    t = travelPacket(t, { x: BODY_CX, y: SHELL_HUB_Y }, 0.4, { label: 'todo.txt  idea.txt', variant: 'output' })
    t += 0.15
    t = travelPacket(t, { x: BODY_CX, y: PTY_Y }, 0.35)
    t = travelPacket(t, { x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34 }, 0.35)
    t += 0.1

    tl.add(() => { setPacket((p) => ({ ...p, visible: false })); setOutputText('todo.txt  idea.txt') }, t)
    t = typeText(tl, t, 'todo.txt  idea.txt', setOutputTypedLen, 0.5, 4)
    tl.add(() => { setAct3((p) => ({ ...p, step: 'status' })); setStatusToken('0') }, t)
    say(tl, t, ACT3_BEATS.status)
    sfxOn(tl, t, SFX_MAP.DING.category, SFX_MAP.DING.name)
    t += 1.0

    say(tl, t, ACT3_BEATS.payoff)
    sfxOn(tl, t, SFX_MAP.CHIME.category, SFX_MAP.CHIME.name)
    t += 1.2

    popOut(tl, t, 'folderRow', {})
    popOut(tl, t, 'forkBuiltin', {})
    popOut(tl, t, 'forkExec', {})
    tl.add(() => {
      setAct3({ step: 'idle', matched: { todo: false, idea: false, image: false }, homeExpanded: false })
      setForkChoice(null)
    }, t)
    t += 0.4

    // ═══════════ ACT 4 — Data Punya Jalur (revisi 02) ═══════════
    // Kasus: grep error atas app.log (ok) dan missing.log (gagal).
    tl.add(() => setPhaseIdx(3), t)
    goStage(tl, t, 'act4')
    say(tl, t + 0.05, ACT4_BEATS.question)
    popIn(tl, t + 0.15, 'act4Diagram', { fromY: 16, sfx: false })
    tl.add(() => setFlow({ x: SOURCE_X, y: STAGE_TOP, visible: false, color: COLORS.STDIN }), t + 0.15)
    lastFlow = { x: SOURCE_X, y: STAGE_TOP }
    t += 0.9

    tl.add(() => setAct4((p) => ({ ...p, step: 'stdin' })), t)
    say(tl, t, ACT4_BEATS.stdin)
    sfxOn(tl, t, SFX_MAP.POP2.category, SFX_MAP.POP2.name)
    t = travelFlow(t, { x: BODY_CX, y: PROCESS_Y }, 0.5, { color: COLORS.STDIN })
    tl.add(() => { setAct4((p) => ({ ...p, stdinOn: true })); setFlow((f) => ({ ...f, visible: false })) }, t)
    t += 0.3

    tl.add(() => setAct4((p) => ({ ...p, step: 'stdout' })), t)
    say(tl, t, ACT4_BEATS.stdout)
    sfxOn(tl, t, SFX_MAP.POP2.category, SFX_MAP.POP2.name)
    t = travelFlow(t, { x: TARGET_X, y: STAGE_TOP }, 0.5, { color: COLORS.STDOUT })
    tl.add(() => { setAct4((p) => ({ ...p, stdoutOn: true })); setFlow((f) => ({ ...f, visible: false })) }, t)
    t += 0.4

    sfxOn(tl, t, SFX_MAP.SWOOSH.category, SFX_MAP.SWOOSH.name)
    tl.add(() => setAct4((p) => ({ ...p, redirectOn: true })), t)
    tl.add(() => setFlow({ x: TARGET_X, y: STAGE_TOP, visible: false, color: COLORS.STDOUT }), t)
    lastFlow = { x: BODY_CX, y: PROCESS_Y }
    t = travelFlow(t, { x: TARGET_X, y: ROW2_Y }, 0.5, { color: COLORS.STDOUT })
    tl.add(() => setFlow((f) => ({ ...f, visible: false })), t)
    t += 0.4

    tl.add(() => setAct4((p) => ({ ...p, step: 'stderr' })), t)
    say(tl, t, ACT4_BEATS.stderr)
    sfxOn(tl, t, SFX_MAP.ALERT_PULSE.category, SFX_MAP.ALERT_PULSE.name)
    lastFlow = { x: SOURCE_X, y: ROW2_Y }
    tl.add(() => setFlow({ x: SOURCE_X, y: ROW2_Y, visible: false, color: COLORS.STDERR }), t)
    t = travelFlow(t, { x: TARGET_X, y: STAGE_TOP }, 0.55, { color: COLORS.STDERR })
    tl.add(() => { setAct4((p) => ({ ...p, stderrOn: true })); setFlow((f) => ({ ...f, visible: false })) }, t)
    t += 0.5

    say(tl, t, ACT4_BEATS.payoff)
    sfxOn(tl, t, SFX_MAP.DING.category, SFX_MAP.DING.name)
    t += 1.3

    popOut(tl, t, 'act4Diagram', {})
    tl.add(() => setAct4({ step: 'idle', stdinOn: false, stdoutOn: false, redirectOn: false, stderrOn: false }), t)
    t += 0.4

    // ═══════════ ACT 5 — Konteks Shell Mengubah Perilaku (revisi 02) ═══════════
    // Kasus: pwd dipakai ulang di 4 konteks berurutan.
    tl.add(() => setPhaseIdx(4), t)
    goStage(tl, t, 'act5')
    say(tl, t + 0.05, ACT5_BEATS.question)
    t += 0.6

    tl.add(() => setAct5({ active: 'interactive', recap: false }), t)
    popIn(tl, t, 'contextBadge', { fromY: -10 })
    say(tl, t, ACT5_BEATS.interactive)
    tl.add(() => { setCmdText(ACT5_CASE.command); setOutputText(''); setOutputTypedLen(0); setStatusToken(null) }, t)
    t = typeText(tl, t, ACT5_CASE.command, setCmdTypedLen, 0.4, 3)
    t += 0.1
    sfxOn(tl, t, SFX_MAP.POP.category, SFX_MAP.POP.name)
    tl.add(() => setPacket({ x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34, label: ACT5_CASE.command, visible: true, variant: 'command' }), t)
    lastPacket = { x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34 }
    t = travelPacket(t, { x: BODY_CX, y: PTY_Y }, 0.3)
    tl.add(() => setShellActive(true), t)
    t = travelPacket(t, { x: BODY_CX, y: SHELL_HUB_Y }, 0.3)
    t += 0.2
    tl.add(() => { setShellActive(false); setPacket((p) => ({ ...p, label: OUTPUT_TEXT, variant: 'output' })) }, t)
    t = travelPacket(t, { x: BODY_CX, y: PTY_Y }, 0.25)
    t = travelPacket(t, { x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34 }, 0.25)
    tl.add(() => { setPacket((p) => ({ ...p, visible: false })); setOutputText(OUTPUT_TEXT) }, t)
    t = typeText(tl, t, OUTPUT_TEXT, setOutputTypedLen, 0.3, 3)
    t += 0.5
    popOut(tl, t, 'contextBadge', {})
    t += 0.2

    tl.add(() => setAct5({ active: 'login', recap: false }), t)
    popIn(tl, t, 'contextBadge', { fromY: -10 })
    say(tl, t, ACT5_BEATS.login)
    sfxOn(tl, t, SFX_MAP.CHIME.category, SFX_MAP.CHIME.name)
    t += 1.4
    popOut(tl, t, 'contextBadge', {})
    t += 0.2

    tl.add(() => setAct5({ active: 'noninteractive', recap: false }), t)
    popIn(tl, t, 'contextBadge', { fromY: -10 })
    say(tl, t, ACT5_BEATS.noninteractive)
    sfxOn(tl, t, SFX_MAP.POP2.category, SFX_MAP.POP2.name)
    t += 1.4
    popOut(tl, t, 'contextBadge', {})
    t += 0.2

    tl.add(() => setAct5({ active: 'remote', recap: false }), t)
    popIn(tl, t, 'contextBadge', { fromY: -10 })
    say(tl, t, ACT5_BEATS.remote)
    sfxOn(tl, t, SFX_MAP.WHOOSH.category, SFX_MAP.WHOOSH.name)
    t += 1.4
    popOut(tl, t, 'contextBadge', {})
    t += 0.2

    tl.add(() => setAct5({ active: null, recap: true }), t)
    popIn(tl, t, 'recapRow', { fromY: 16 })
    say(tl, t, ACT5_BEATS.payoff)
    sfxOn(tl, t, SFX_MAP.SHIMMER.category, SFX_MAP.SHIMMER.name)
    t += 1.4
    popOut(tl, t, 'recapRow', {})
    tl.add(() => setAct5({ active: null, recap: false }), t)
    t += 0.4

    // ═══════════ ACT 6 — Script Aman dan Portable (revisi 02) ═══════════
    // Kasus: "April Report.txt" — quote shield vs ghost split, exit status, cleanup.
    tl.add(() => setPhaseIdx(5), t)
    goStage(tl, t, 'act6')
    say(tl, t + 0.05, ACT6_BEATS.question)
    popIn(tl, t + 0.15, 'dataChip', { fromY: 16 })
    t += 0.9

    tl.add(() => setAct6((p) => ({ ...p, step: 'shield' })), t)
    say(tl, t, ACT6_BEATS.shield)
    sfxOn(tl, t, SFX_MAP.LOCK.category, SFX_MAP.LOCK.name)
    tl.add(() => setPacket({ x: 140, y: STAGE_TOP, label: ACT6_CASE.filename, visible: true, variant: 'output' }), t + 0.1)
    lastPacket = { x: 140, y: STAGE_TOP }
    t = travelPacket(t + 0.1, { x: 400, y: STAGE_TOP }, 0.5, { label: ACT6_CASE.filename })
    t += 0.3

    tl.add(() => setAct6((p) => ({ ...p, step: 'ghost' })), t)
    say(tl, t, ACT6_BEATS.ghost)
    sfxOn(tl, t, SFX_MAP.ALERT_PULSE.category, SFX_MAP.ALERT_PULSE.name)
    popIn(tl, t, 'ghostChips', { fromY: 10, sfx: false })
    t += 0.6
    popOut(tl, t, 'ghostChips', {})
    t += 0.5

    tl.add(() => setAct6((p) => ({ ...p, step: 'check' })), t)
    say(tl, t, ACT6_BEATS.check)
    popIn(tl, t, 'checkNode', { fromY: 16 })
    tl.add(() => setStatusToken('1'), t + 0.3)
    sfxOn(tl, t + 0.3, SFX_MAP.ALERT_PULSE.category, SFX_MAP.ALERT_PULSE.name)
    t += 1.0

    tl.add(() => setAct6((p) => ({ ...p, step: 'gate' })), t)
    popIn(tl, t, 'gateBox', { fromX: 16 })
    t += 0.7

    tl.add(() => setAct6((p) => ({ ...p, step: 'cleanup' })), t)
    say(tl, t, ACT6_BEATS.cleanup)
    popIn(tl, t, 'cleanupTray', { fromY: 16 })
    sfxOn(tl, t, SFX_MAP.CHIME.category, SFX_MAP.CHIME.name)
    t += 1.0

    tl.add(() => setAct6((p) => ({ ...p, step: 'targetshell' })), t)
    say(tl, t, ACT6_BEATS.targetshell)
    popIn(tl, t, 'shellBadge', { fromY: 16 })
    t += 0.6
    tl.add(() => setAct6((p) => ({ ...p, targetShell: 'sh' })), t + 0.4)
    sfxOn(tl, t + 0.4, SFX_MAP.ALERT_PULSE.category, SFX_MAP.ALERT_PULSE.name)
    t += 0.8

    say(tl, t, ACT6_BEATS.payoff)
    sfxOn(tl, t, SFX_MAP.SHIMMER.category, SFX_MAP.SHIMMER.name)
    t += 1.3

    say(tl, t, CLOSING_CAPTION)
    sfxOn(tl, t, SFX_MAP.SHIMMER.category, SFX_MAP.SHIMMER.name)
    t += 2.4

    return () => {
      tl.kill()
      if (window.__animationTimeline === tl) delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    tl.timeScale(speed)
    if (paused) tl.pause(); else tl.resume()
  }, [paused, speed])

  const T = (id, cx, cy) => {
    const p = P(id)
    return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
  }
  const O = (id) => P(id).opacity
  const glow = (id) => highlightId === id
  const cmdLineText = `$ ${cmdText.slice(0, cmdTypedLen)}`

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{
      width: '100%', height: '100%', maxHeight: '100vh',
      maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none',
    }}>
      <defs>
        <filter id="shell-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shell-shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
        </filter>
        <style>{`
          @keyframes shellSpin { to { transform: rotate(360deg); } }
          @keyframes cursorBlink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
        `}</style>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.TERMINAL} strokeWidth={1} />
        ))}
        {Array.from({ length: 34 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.TERMINAL} strokeWidth={1} />
        ))}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: `${INTRO_CATEGORY_LABEL} · `, color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.TERMINAL },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.TERMINAL },
          { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
        ]}
        subtitle={INTRO_SUBTITLE}
        titleFilter="url(#shell-glow)"
        testId="shell-terminal-command-line-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="shell-terminal-command-line-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="shell-terminal-command-line-body">
          <g>
            {caption && (
              <g transform={`translate(${BODY_CX}, ${NARRATION_Y})`}>
                <rect x={-320} y={-28} width={640} height={56} rx={20} fill={COLORS.PANEL}
                  stroke={PHASES[phaseIdx]?.badgeColor || COLORS.TERMINAL} strokeWidth={1.5} />
                <text x={0} y={6} textAnchor="middle" fontSize={13.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
                  {caption}
                </text>
              </g>
            )}

            <g opacity={archDim ? 0.4 : 1}>
              <g transform={T('terminalWin', BODY_CX, TERMINAL_Y)} opacity={O('terminalWin')}>
                <rect x={-TERMINAL_W / 2} y={-TERMINAL_H / 2} width={TERMINAL_W} height={TERMINAL_H} rx={14}
                  fill={COLORS.PANEL_ALT}
                  stroke={glow('terminal') ? COLORS.SUCCESS : COLORS.TERMINAL}
                  strokeWidth={glow('terminal') ? 3 : 2}
                  filter="url(#shell-shadow)" />
                <circle cx={-TERMINAL_W / 2 + 24} cy={-TERMINAL_H / 2 + 20} r={6} fill={COLORS.STDERR} />
                <circle cx={-TERMINAL_W / 2 + 44} cy={-TERMINAL_H / 2 + 20} r={6} fill={COLORS.SHELL} />
                <circle cx={-TERMINAL_W / 2 + 64} cy={-TERMINAL_H / 2 + 20} r={6} fill={COLORS.SUCCESS} />
                <text x={0} y={-TERMINAL_H / 2 + 24} textAnchor="middle" fontSize={11} fontFamily="monospace"
                  fill={COLORS.MUTED} letterSpacing={2}>{ARCH_LABELS.terminal.toUpperCase()}</text>

                <text x={-TERMINAL_W / 2 + 24} y={TERMINAL_H / 2 - 46}
                  fontFamily="monospace" fontSize={16} fontWeight={700}
                  fill={glow('cmdline') ? COLORS.SUCCESS : COLORS.TERMINAL}>
                  {cmdLineText}
                </text>
                <rect x={-TERMINAL_W / 2 + 24 + cmdLineText.length * 9.6} y={TERMINAL_H / 2 - 58} width={9} height={16}
                  fill={COLORS.TERMINAL} style={{ animation: 'cursorBlink 1s step-end infinite' }} />
                <text x={-TERMINAL_W / 2 + 24} y={TERMINAL_H / 2 - 20}
                  fontFamily="monospace" fontSize={14} fill={COLORS.SUCCESS}>
                  {outputText.slice(0, outputTypedLen)}
                </text>
                {statusToken && (
                  <text x={TERMINAL_W / 2 - 20} y={TERMINAL_H / 2 - 20} textAnchor="end"
                    fontFamily="monospace" fontSize={12} fontWeight={700}
                    fill={statusToken === '0' ? COLORS.SUCCESS : COLORS.RISK}>
                    exit {statusToken}
                  </text>
                )}
                <text x={TERMINAL_W / 2 - 20} y={TERMINAL_H / 2 - 46} textAnchor="end"
                  fontFamily="sans-serif" fontSize={9.5} fontWeight={700} fill={COLORS.MUTED} letterSpacing={1}>
                  {ARCH_LABELS.commandLine.toUpperCase()}
                </text>
              </g>

              <g transform={T('ptyCable', BODY_CX, PTY_Y)} opacity={O('ptyCable')}>
                <line x1={0} y1={-38} x2={0} y2={38} stroke={COLORS.PTY} strokeWidth={3} strokeDasharray="2 6" />
                <text x={18} y={5} fontSize={12} fontFamily="monospace" fontWeight={700} fill={COLORS.PTY}>{ARCH_LABELS.pty}</text>
              </g>

              <g transform={T('shellHub', BODY_CX, SHELL_HUB_Y)} opacity={O('shellHub')}>
                <circle r={52} fill={COLORS.PANEL}
                  stroke={glow('shell') ? COLORS.SUCCESS : COLORS.SHELL} strokeWidth={glow('shell') ? 3.5 : 2.5}
                  filter={shellActive ? 'url(#shell-glow)' : undefined} />
                {shellActive && (
                  <circle r={40} fill="none" stroke={COLORS.SHELL} strokeWidth={2} strokeDasharray="10 8"
                    style={{ animation: 'shellSpin 1.4s linear infinite', transformOrigin: 'center' }} />
                )}
                {act3.step === 'split' || act3.step === 'expand' || act3.step === 'resolve' ? (
                  <>
                    <text x={0} y={-8} textAnchor="middle" fontSize={10} fontWeight={800} fontFamily="monospace" fill={COLORS.BUILTIN}>
                      echo
                    </text>
                    <rect x={-42} y={-2} width={84} height={15} rx={6} fill="none"
                      stroke={COLORS.PTY} strokeWidth={1.2} strokeDasharray="3 3"
                      opacity={act3.step === 'split' ? 1 : 0} />
                    <text x={0} y={9} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.PTY}>
                      {act3.homeExpanded ? ACT3_CASE.homeValue : ACT3_CASE.homeVar}/notes/*.txt
                    </text>
                  </>
                ) : (
                  <text x={0} y={4} textAnchor="middle" fontSize={12} fontWeight={800} fontFamily="sans-serif" fill={COLORS.SHELL}>
                    {ARCH_LABELS.shell.toUpperCase()}
                  </text>
                )}
                <text x={0} y={22} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill={COLORS.MUTED}>decoder</text>
              </g>

              <g transform={T('forkBuiltin', BODY_CX - 130, FORK_Y)} opacity={O('forkBuiltin')}>
                <rect x={-90} y={-24} width={180} height={48} rx={10} fill={COLORS.PANEL}
                  stroke={COLORS.BUILTIN} strokeWidth={1.5} opacity={forkChoice === 'builtin' ? 1 : 0.4} />
                <text x={0} y={5} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.BUILTIN}>
                  {ARCH_LABELS.builtin}
                </text>
              </g>
              <g transform={T('forkExec', BODY_CX + 130, FORK_Y)} opacity={O('forkExec')}>
                <rect x={-90} y={-24} width={180} height={48} rx={10}
                  fill={forkChoice === 'exec' ? COLORS.EXEC : COLORS.PANEL}
                  stroke={COLORS.EXEC} strokeWidth={forkChoice === 'exec' ? 0 : 1.5}
                  opacity={forkChoice === 'exec' ? 1 : 0.55} />
                <text x={0} y={5} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily="sans-serif"
                  fill={forkChoice === 'exec' ? COLORS.BG : COLORS.EXEC}>
                  {ARCH_LABELS.exec}
                </text>
              </g>

              <g transform={T('systemNode', BODY_CX, SYSTEM_Y)} opacity={O('systemNode')}>
                <rect x={-140} y={-26} width={280} height={52} rx={12} fill={COLORS.PANEL}
                  stroke={COLORS.SYSTEM} strokeWidth={systemActive ? 3 : 1.8}
                  filter={systemActive ? 'url(#shell-glow)' : undefined} />
                <text x={0} y={6} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.SYSTEM}>
                  {ARCH_LABELS.system.toUpperCase()}
                </text>
              </g>
            </g>

            {packet.visible && (
              <g transform={`translate(${packet.x}, ${packet.y})`}>
                <rect x={-95} y={-18} width={190} height={36} rx={10}
                  fill={COLORS.BG}
                  stroke={packet.variant === 'output' ? COLORS.SUCCESS : COLORS.TERMINAL}
                  strokeWidth={2} filter="url(#shell-shadow)" />
                <text x={0} y={5} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily="monospace"
                  fill={packet.variant === 'output' ? COLORS.SUCCESS : COLORS.TERMINAL}>
                  {packet.label}
                </text>
              </g>
            )}

            {flow.visible && (
              <circle cx={flow.x} cy={flow.y} r={7} fill={flow.color} filter="url(#shell-shadow)" />
            )}

            {/* ── ACT 3 — folder tiles (echo "$HOME"/notes/*.txt) ── */}
            {stage === 'act3' && (
              <g opacity={O('folderRow')}>
                {ACT3_CASE.files.map((f, i) => {
                  const w = 210, gap = 20
                  const x0 = (700 - (w * 3 + gap * 2)) / 2 + 16
                  const x = x0 + i * (w + gap)
                  const matched = act3.matched[f.id]
                  const isImage = f.id === 'image'
                  return (
                    <g key={f.id} transform={`translate(${x}, ${STAGE_TOP})`}>
                      <rect width={w} height={72} rx={10}
                        fill={matched ? COLORS.EXEC : COLORS.PANEL}
                        stroke={matched ? COLORS.EXEC : COLORS.BORDER} strokeWidth={matched ? 0 : 1.5}
                        opacity={isImage && act3.step === 'expand' ? 0.35 : 1} />
                      <text x={w / 2} y={30} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700}
                        fill={matched ? COLORS.BG : COLORS.TEXT}>
                        {f.name}
                      </text>
                      <text x={w / 2} y={50} textAnchor="middle" fontSize={9} fontFamily="sans-serif"
                        fill={matched ? COLORS.BG : COLORS.MUTED}>
                        {matched ? 'match *.txt' : isImage ? 'tidak cocok' : 'notes/'}
                      </text>
                    </g>
                  )
                })}
              </g>
            )}

            {/* ── ACT 4 — grep error: source files → process → terminal / errors.txt ── */}
            {stage === 'act4' && (
              <g opacity={O('act4Diagram')}>
                <line x1={SOURCE_X} y1={STAGE_TOP} x2={BODY_CX - 70} y2={PROCESS_Y}
                  stroke={COLORS.STDIN} strokeWidth={1.5} opacity={act4.stdinOn ? 0.8 : 0.3} />
                <line x1={SOURCE_X} y1={ROW2_Y} x2={BODY_CX - 70} y2={PROCESS_Y}
                  stroke={COLORS.RISK} strokeWidth={1.5} opacity={act4.stderrOn ? 0.8 : 0.25} strokeDasharray="4 4" />
                <line x1={BODY_CX + 70} y1={PROCESS_Y} x2={TARGET_X} y2={STAGE_TOP}
                  stroke={COLORS.STDOUT} strokeWidth={1.5} opacity={act4.stdoutOn && !act4.redirectOn ? 0.8 : 0.25} />
                <line x1={BODY_CX + 70} y1={PROCESS_Y} x2={TARGET_X} y2={ROW2_Y}
                  stroke={COLORS.STDOUT} strokeWidth={1.5} opacity={act4.redirectOn ? 0.8 : 0.25} />
                <line x1={BODY_CX + 70} y1={PROCESS_Y} x2={TARGET_X} y2={STAGE_TOP}
                  stroke={COLORS.STDERR} strokeWidth={1.5} opacity={act4.stderrOn ? 0.8 : 0} strokeDasharray="4 4" />

                <g transform={`translate(${SOURCE_X}, ${STAGE_TOP})`}>
                  <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.5} />
                  <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700} fill={COLORS.TEXT}>
                    {ACT4_CASE.sources[0].name}
                  </text>
                </g>
                <g transform={`translate(${SOURCE_X}, ${ROW2_Y})`}>
                  <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL}
                    stroke={act4.stderrOn ? COLORS.RISK : COLORS.BORDER} strokeWidth={1.5} />
                  <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700}
                    fill={act4.stderrOn ? COLORS.RISK : COLORS.TEXT}>
                    {ACT4_CASE.sources[1].name}
                  </text>
                </g>

                <g transform={`translate(${BODY_CX}, ${PROCESS_Y})`}>
                  <rect x={-90} y={-26} width={180} height={52} rx={12} fill={COLORS.PANEL} stroke={COLORS.SHELL} strokeWidth={2} />
                  <text x={0} y={-2} textAnchor="middle" fontSize={11.5} fontWeight={800} fontFamily="monospace" fill={COLORS.SHELL}>
                    {ACT4_CASE.command}
                  </text>
                  <text x={0} y={14} textAnchor="middle" fontSize={8} fontFamily="sans-serif" fill={COLORS.MUTED}>
                    stdin · stdout · stderr
                  </text>
                </g>

                <g transform={`translate(${TARGET_X}, ${STAGE_TOP})`}>
                  <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL}
                    stroke={act4.stderrOn ? COLORS.RISK : COLORS.TERMINAL} strokeWidth={1.5} />
                  <text x={0} y={-2} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
                    TERMINAL
                  </text>
                  <text x={0} y={14} textAnchor="middle" fontSize={8.5} fontFamily="monospace"
                    fill={act4.stderrOn ? COLORS.RISK : COLORS.MUTED}>
                    {act4.stderrOn ? ACT4_CASE.errorLine : act4.stdoutOn && !act4.redirectOn ? ACT4_CASE.matchLines[0] : ''}
                  </text>
                </g>
                <g transform={`translate(${TARGET_X}, ${ROW2_Y})`}>
                  <rect x={-70} y={-24} width={140} height={48} rx={10} fill={act4.redirectOn ? COLORS.STDOUT : COLORS.PANEL}
                    stroke={COLORS.STDOUT} strokeWidth={act4.redirectOn ? 0 : 1.5} opacity={act4.redirectOn ? 1 : 0.55} />
                  <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace"
                    fill={act4.redirectOn ? COLORS.BG : COLORS.STDOUT}>
                    {ACT4_CASE.redirectTarget}
                  </text>
                </g>
              </g>
            )}

            {/* ── ACT 5 — satu context badge yang berganti isi per konteks ── */}
            {stage === 'act5' && act5.active && (
              <g transform={T('contextBadge', BODY_CX, STAGE_TOP + 20)}>
                <rect x={-160} y={-30} width={320} height={60} rx={14} fill={COLORS.PANEL}
                  stroke={COLORS.MODE} strokeWidth={2} filter="url(#shell-shadow)" />
                <text x={0} y={-6} textAnchor="middle" fontSize={13} fontWeight={800} fontFamily="sans-serif" fill={COLORS.MODE}>
                  {ACT5_CASE.contexts.find((c) => c.id === act5.active)?.label}
                </text>
                <text x={0} y={14} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={700} fill={COLORS.TEXT}>
                  {ACT5_CASE.contexts.find((c) => c.id === act5.active)?.badge}
                </text>
              </g>
            )}

            {stage === 'act5' && act5.recap && (
              <g opacity={O('recapRow')}>
                {ACT5_CASE.contexts.map((c, i) => {
                  const w = 160, gap = 20
                  const x0 = (700 - (w * 4 + gap * 3)) / 2 + 16
                  const x = x0 + i * (w + gap)
                  return (
                    <g key={c.id} transform={`translate(${x}, ${STAGE_TOP + 20})`}>
                      <rect width={w} height={56} rx={10} fill={COLORS.PANEL} stroke={COLORS.MODE} strokeWidth={1.5} opacity={0.7} />
                      <text x={w / 2} y={24} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
                        {c.label}
                      </text>
                      <text x={w / 2} y={40} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={COLORS.MUTED}>
                        {c.badge}
                      </text>
                    </g>
                  )
                })}
              </g>
            )}

            {/* ── ACT 6 — "April Report.txt": quote shield, ghost split, check, gate, cleanup ── */}
            {stage === 'act6' && (
              <g>
                <g transform={T('dataChip', 140, STAGE_TOP)} opacity={O('dataChip')}>
                  <rect x={-90} y={-24} width={180} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.SCRIPT} strokeWidth={1.5} />
                  <text x={0} y={5} textAnchor="middle" fontSize={10.5} fontWeight={700} fontFamily="monospace" fill={COLORS.SCRIPT}>
                    {ACT6_CASE.filename}
                  </text>
                </g>

                <g transform={T('ghostChips', 140, STAGE_TOP + 70)} opacity={O('ghostChips')}>
                  {ACT6_CASE.ghostParts.map((part, i) => (
                    <g key={part} transform={`translate(${i === 0 ? -55 : 55}, 0)`}>
                      <rect x={-48} y={-18} width={96} height={36} rx={8} fill="none" stroke={COLORS.RISK} strokeWidth={1.5} strokeDasharray="3 3" />
                      <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={COLORS.RISK}>{part}</text>
                    </g>
                  ))}
                  <text x={0} y={34} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fontWeight={700} fill={COLORS.RISK}>
                    ✕ terbelah tanpa quote
                  </text>
                </g>

                <g transform={T('checkNode', 400, STAGE_TOP)} opacity={O('checkNode')}>
                  <rect x={-80} y={-24} width={160} height={48} rx={10} fill={COLORS.PANEL}
                    stroke={statusToken === '1' ? COLORS.RISK : COLORS.BORDER} strokeWidth={1.8} />
                  <text x={0} y={-3} textAnchor="middle" fontSize={10.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
                    CHECK
                  </text>
                  <text x={0} y={13} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily="monospace"
                    fill={statusToken === '1' ? COLORS.RISK : COLORS.MUTED}>
                    {statusToken === '1' ? 'exit 1' : '…'}
                  </text>
                </g>

                <g transform={T('gateBox', 580, STAGE_TOP)} opacity={O('gateBox')}>
                  <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.RISK} strokeWidth={1.8} />
                  <text x={0} y={-3} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily="sans-serif" fill={COLORS.RISK}>
                    STOP
                  </text>
                  <text x={0} y={13} textAnchor="middle" fontSize={8.5} fontFamily="sans-serif" fill={COLORS.MUTED}>
                    publish locked
                  </text>
                </g>

                <g transform={T('cleanupTray', 140, STAGE_TOP + 130)} opacity={O('cleanupTray')}>
                  <rect x={-90} y={-22} width={180} height={44} rx={10} fill={COLORS.PANEL} stroke={COLORS.SCRIPT} strokeWidth={1.5} />
                  <text x={0} y={5} textAnchor="middle" fontSize={10.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.SCRIPT}>
                    cleanup ✓ tray kosong
                  </text>
                </g>

                <g transform={T('shellBadge', 420, STAGE_TOP + 130)} opacity={O('shellBadge')}>
                  <rect x={-70} y={-22} width={140} height={44} rx={10} fill={COLORS.PANEL} stroke={COLORS.MODE} strokeWidth={1.5} />
                  <text x={0} y={5} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily="monospace" fill={COLORS.MODE}>
                    {act6.targetShell}
                  </text>
                  <text x={130} y={5} textAnchor="middle" fontSize={9} fontFamily="monospace"
                    fill={COLORS.MUTED} opacity={act6.targetShell === 'bash' ? 1 : 0.3}>
                    {ACT6_CASE.syntaxFlag}
                  </text>
                </g>
              </g>
            )}
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
