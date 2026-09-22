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
  COMMAND_TEXT, OUTPUT_TEXT, ACT1_BEATS,
  EXT_COMMAND_TEXT, ACT2_BEATS,
  ACT3_CASE, ACT3_BEATS,
  ACT4_CASE, ACT4_BEATS,
  ACT5_CASE, ACT5_BEATS,
  ACT6_CASE, ACT6_BEATS,
  CLOSING_CAPTION,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'
import { ACT_SCENES } from './acts'
import {
  BODY_CX, NARRATION_Y, TERMINAL_TOP, TERMINAL_H, TERMINAL_Y, TERMINAL_W,
  PTY_Y, SHELL_HUB_Y, FORK_Y, SYSTEM_Y, STAGE_TOP,
  SOURCE_X, TARGET_X, PROCESS_Y, ROW2_Y,
} from './acts/common'

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
    const { duration = 0.28, ease = 'power1.in', sfx = true,
      sfxName = SFX_MAP.PLINK.name, sfxCategory = SFX_MAP.PLINK.category, volumeMult = 0.7 } = opts
    if (sfx) {
      tl.add(() => { if (audioUnlockedRef.current) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current * volumeMult, speed: speedRef.current }) }, time)
    }
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
    tl.add(() => { if (audioUnlockedRef.current) sfxLoader.play(SFX_MAP.TYPING.category, SFX_MAP.TYPING.name, { volume: volumeRef.current * 0.8, speed: speedRef.current }) }, time)
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
      const { ease = 'power2.inOut', label, variant, whoosh = true } = opts
      const from = { ...lastPacket }
      const o = { x: from.x, y: from.y }
      if (whoosh) {
        tl.add(() => { if (audioUnlockedRef.current) sfxLoader.play(SFX_MAP.SWOOSH_QUICK.category, SFX_MAP.SWOOSH_QUICK.name, { volume: volumeRef.current * 0.35, speed: speedRef.current }) }, time)
      }
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
      const { ease = 'power1.inOut', color, tick = true } = opts
      const from = { ...lastFlow }
      const o = { x: from.x, y: from.y }
      if (tick) {
        tl.add(() => { if (audioUnlockedRef.current) sfxLoader.play(SFX_MAP.BEEP2.category, SFX_MAP.BEEP2.name, { volume: volumeRef.current * 0.3, speed: speedRef.current }) }, time)
      }
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
    sfxOn(tl, t + 0.15, SFX_MAP.SCAN.category, SFX_MAP.SCAN.name, 0.7)
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
    sfxOn(tl, t + 0.1, SFX_MAP.APPROVAL.category, SFX_MAP.APPROVAL.name, 0.6)
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

    // login-config-flow (revisi-02 §3.2-3.3): chip config travel MASUK ke
    // shellHub sebelum badge muncul — memvisualkan "dibaca sebelum prompt".
    tl.add(() => setAct5({ active: 'login', recap: false }), t)
    tl.add(() => setFlow({ x: 20, y: SHELL_HUB_Y, visible: false, color: COLORS.MODE }), t)
    lastFlow = { x: 20, y: SHELL_HUB_Y }
    say(tl, t, ACT5_BEATS.login)
    sfxOn(tl, t, SFX_MAP.CHIME.category, SFX_MAP.CHIME.name)
    t = travelFlow(t, { x: BODY_CX, y: SHELL_HUB_Y }, 0.6, { color: COLORS.MODE })
    tl.add(() => setFlow((f) => ({ ...f, visible: false })), t)
    popIn(tl, t, 'contextBadge', { fromY: -10 })
    t += 0.8
    popOut(tl, t, 'contextBadge', {})
    t += 0.2

    // noninteractive-batch-flow: 3 capsule mini masuk beruntun langsung ke
    // shellHub (bukan lewat command line) — kontras dgn 'interactive'.
    tl.add(() => setAct5({ active: 'noninteractive', recap: false }), t)
    say(tl, t, ACT5_BEATS.noninteractive)
    sfxOn(tl, t, SFX_MAP.POP2.category, SFX_MAP.POP2.name)
    tl.add(() => setFlow({ x: 700, y: SHELL_HUB_Y - 30, visible: false, color: COLORS.MODE }), t)
    lastFlow = { x: 700, y: SHELL_HUB_Y - 30 }
    let bt = travelFlow(t, { x: BODY_CX, y: SHELL_HUB_Y }, 0.3, { color: COLORS.MODE })
    tl.add(() => setFlow({ x: 700, y: SHELL_HUB_Y, visible: false, color: COLORS.MODE }), bt)
    lastFlow = { x: 700, y: SHELL_HUB_Y }
    bt = travelFlow(bt, { x: BODY_CX, y: SHELL_HUB_Y }, 0.3, { color: COLORS.MODE })
    tl.add(() => setFlow({ x: 700, y: SHELL_HUB_Y + 30, visible: false, color: COLORS.MODE }), bt)
    lastFlow = { x: 700, y: SHELL_HUB_Y + 30 }
    bt = travelFlow(bt, { x: BODY_CX, y: SHELL_HUB_Y }, 0.3, { color: COLORS.MODE })
    tl.add(() => setFlow((f) => ({ ...f, visible: false })), bt)
    popIn(tl, bt, 'contextBadge', { fromY: -10 })
    t = bt + 0.5
    popOut(tl, t, 'contextBadge', {})
    t += 0.2

    // remote-network-travel: packet asli (bukan flow-dot) travel ke node
    // "remote host" baru lalu balik — "shell jalan di host lain".
    tl.add(() => setAct5({ active: 'remote', recap: false }), t)
    say(tl, t, ACT5_BEATS.remote)
    sfxOn(tl, t, SFX_MAP.WHOOSH.category, SFX_MAP.WHOOSH.name)
    popIn(tl, t, 'remoteHost', { fromX: 14 })
    tl.add(() => setPacket({ x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34, label: ACT5_CASE.command, visible: true, variant: 'command' }), t)
    lastPacket = { x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34 }
    let rt = travelPacket(t, { x: BODY_CX + 220, y: SHELL_HUB_Y }, 0.6, { label: 'pwd → remote' })
    tl.add(() => setPacket((p) => ({ ...p, label: OUTPUT_TEXT, variant: 'output' })), rt)
    rt = travelPacket(rt, { x: BODY_CX, y: TERMINAL_TOP + TERMINAL_H - 34 }, 0.5)
    tl.add(() => setPacket((p) => ({ ...p, visible: false })), rt)
    popIn(tl, rt, 'contextBadge', { fromY: -10 })
    t = rt + 0.3
    popOut(tl, t, 'contextBadge', {})
    popOut(tl, t, 'remoteHost', {})
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

    // check-gate-pulse (revisi-02 §3.2-3.3): dash pulse checkNode→gateBox
    // sebelum gateBox muncul — status gagal MENYEBABKAN gerbang berhenti.
    tl.add(() => setAct6((p) => ({ ...p, step: 'gate' })), t)
    tl.add(() => setFlow({ x: 400, y: STAGE_TOP, visible: true, color: COLORS.RISK }), t)
    lastFlow = { x: 400, y: STAGE_TOP }
    t = travelFlow(t, { x: 580, y: STAGE_TOP }, 0.5, { color: COLORS.RISK })
    tl.add(() => setFlow((f) => ({ ...f, visible: false })), t)
    popIn(tl, t, 'gateBox', { fromX: 16, sfx: false })
    sfxOn(tl, t, SFX_MAP.SOFT_DENY.category, SFX_MAP.SOFT_DENY.name, 0.9)
    t += 0.2

    // gate-cleanup-pulse: dash pulse gateBox→cleanupTray — cleanup terjadi
    // SEBAGAI AKIBAT gate berhenti, bukan kebetulan sejajar.
    tl.add(() => setAct6((p) => ({ ...p, step: 'cleanup' })), t)
    say(tl, t, ACT6_BEATS.cleanup)
    tl.add(() => setFlow({ x: 580, y: STAGE_TOP, visible: true, color: COLORS.SCRIPT }), t)
    lastFlow = { x: 580, y: STAGE_TOP }
    t = travelFlow(t, { x: 140, y: STAGE_TOP + 130 }, 0.6, { color: COLORS.SCRIPT })
    tl.add(() => setFlow((f) => ({ ...f, visible: false })), t)
    popIn(tl, t, 'cleanupTray', { fromY: 16 })
    sfxOn(tl, t, SFX_MAP.CHIME.category, SFX_MAP.CHIME.name)
    t += 0.4

    tl.add(() => setAct6((p) => ({ ...p, step: 'targetshell' })), t)
    say(tl, t, ACT6_BEATS.targetshell)
    popIn(tl, t, 'shellBadge', { fromY: 16 })
    t += 0.6
    tl.add(() => setAct6((p) => ({ ...p, targetShell: 'sh' })), t + 0.4)
    sfxOn(tl, t + 0.4, SFX_MAP.SWAP.category, SFX_MAP.SWAP.name, 0.8)
    sfxOn(tl, t + 0.45, SFX_MAP.ALERT_PULSE.category, SFX_MAP.ALERT_PULSE.name, 0.7)
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


  // ── State live yang dikirim ke ACT_SCENES[phaseIdx] (kontrak: prop `state`
  // tunggal, lihat docs/standardizations/07-act-scene-pattern.md) ──
  const liveState = {
    pop, caption, phaseIdx, highlightId, archDim, forkChoice, shellActive, systemActive,
    cmdLineText: `$ ${cmdText.slice(0, cmdTypedLen)}`, outputText, outputTypedLen, statusToken,
    packet, flow, stage, act3, act4, act5, act6,
  }
  const ActiveAct = ACT_SCENES[phaseIdx] || ACT_SCENES[0]

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
        titleLines={[
          [{ label: 'SHELL', color: COLORS.TERMINAL }],
          [{ label: 'EXPLAINED', color: COLORS.SUCCESS }],
        ]}
        subtitle={INTRO_SUBTITLE}
        titleFilter="url(#shell-glow)"
        bg={phaseIdx + 1}
        bgScenes={ACT_SCENES}
        bgDim={0.3}
        testId="shell-terminal-command-line-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="shell-terminal-command-line-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="shell-terminal-command-line-body">
          <ActiveAct state={liveState} />
        </ContentBodyV1>
      )}
    </svg>
  )
}
