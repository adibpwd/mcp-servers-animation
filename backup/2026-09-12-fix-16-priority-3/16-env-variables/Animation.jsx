// ═══════════════════════════════════════════════════════════════════════════
// src/content/env-variables/Animation.jsx
// ─────────────────────────────────────────────────────────────────────────
// Environment Variables & .env — app jalan mulus di laptop, crash di
// server production (kode identik) → ternyata config di-hardcode →
// solusi: environment variable, tiap mesin baca "catatan" (.env)
// sendiri → catatan itu rahasia, wajib masuk .gitignore. Lihat
// _docs/ENV_VARIABLES_PLAN.md untuk story spine lengkap.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP, INTRO_CATEGORY,
  DEV_LABEL, SERVER_LABEL, CODE_SNIPPET_ACT1, HOOK_QUESTION, HOOK_CLIFFHANGER,
  HARDCODE_LINE, HARDCODE_BADGE, HARDCODE_INSIGHT, ENVVAR_LINE,
  STICKY_DEV_TEXT, STICKY_SERVER_TEXT, ENVVAR_INSIGHT,
  SECRET_LINES, SECRET_BADGE, SCANNER_WARNING, LEAK_CAPTION, GIT_HISTORY_NOTE,
  GITIGNORE_LABEL, ENV_EXAMPLE_TEXT, ENV_EXAMPLE_LABEL,
  CLOSING_PAYOFF, CLOSING_LINE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'

const lerp = (a, b, t) => a + (b - a) * t

const INTRO_TITLE = 'ENV VARIABLES'
const INTRO_SUBTITLE = 'Kode sama, tempat beda, hasil beda'

// ── posisi dasar dev/server machine (dipakai lintas Act 1 & 2) ──
const DEV_X = 210
const SERVER_X = 610
const ROW_Y = 230

export default function EnvVariablesAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const svgRef = useRef(null)
  const tlRef = useRef(null)
  const audioUnlockedRef = useRef(audioUnlocked)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [caption, setCaption] = useState('')
  const [pop, setPop] = useState({})

  // ── ANCHOR persisten: devAnchor & serverAnchor, 1 id tetap dari Act 1
  // s.d. Act 3 (04-referensi-gsap.md § "Persistent Anchor Object").
  // appVisible/appColor ikut nempel di anchor ini (bukan di-reset unmount
  // per-Act), cuma warnanya yang berubah lewat setState biasa.
  const [appColor, setAppColor] = useState({ dev: COLORS.SUCCESS, server: COLORS.SUCCESS })
  const [appVisible, setAppVisible] = useState({ dev: false, server: false })

  // ── intro (fade → morph header, tanpa efek ketik — scope topic kecil) ──
  const [showIntro, setShowIntro] = useState(true)
  const [morphP, setMorphP] = useState(0)

  // ── ACT 1 ──
  const [movingApp, setMovingApp] = useState({ x: DEV_X, opacity: 0, color: COLORS.SUCCESS })
  const [crashVisible, setCrashVisible] = useState(false)
  const [codeText, setCodeText] = useState('')

  // ── ACT 2 ──
  const [codeStage, setCodeStage] = useState('hardcode') // 'hardcode' | 'envvar'
  const [linkVisible, setLinkVisible] = useState({ dev: false, server: false })

  // ── ACT 3 ──
  const [movingSecret, setMovingSecret] = useState({ p: 0, opacity: 0 })
  const [threatOpacity, setThreatOpacity] = useState(0)
  const [secretBlocked, setSecretBlocked] = useState(false)
  const [movingExample, setMovingExample] = useState({ p: 0, opacity: 0 })

  const phase = PHASES[phaseIdx] || PHASES[0]
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── generic reveal helper (pop-in), sfxCategory eksplisit — lihat
  // 04-referensi-gsap.md § "popIn() dengan sfxCategory Eksplisit" ──
  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.45, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 0,
      sfxName = SFX_MAP.POP.name, sfxCategory = 'ui', volumeMult = 1 } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volume * volumeMult, speed }) },
      onUpdate: () => setPop(prev => ({
        ...prev,
        [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) },
      })),
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    // Export safety WAJIB — lihat 04-referensi-gsap.md § "Export Safety".
    window.__flushSync = flushSync

    let t = 0

    // ═══════════════ INTRO — fade-in judul → morph jadi header ═══════════
    tl.add(() => { setShowIntro(true); setMorphP(0) }, t)
    sfxOn(tl, t + 0.1, () => sfxLoader.success(SFX_MAP.CHARGE.name, { volume, speed }))
    t += 1.2

    tl.add(() => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume, speed }), t)
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    t += 0.8
    tl.add(() => setShowIntro(false), t)
    t += 0.3

    // ═══════════ ACT 1 — Kode Sama, Kenapa Beda Hasil? (hook, 8.0s) ═══════
    tl.add(() => {
      setPhaseIdx(0)
      setAppColor({ dev: COLORS.SUCCESS, server: COLORS.SUCCESS })
      setAppVisible({ dev: false, server: false })
      setMovingApp({ x: DEV_X, opacity: 0, color: COLORS.SUCCESS })
      setCrashVisible(false)
      setCodeText('')
    }, t)
    popIn(tl, t + 0.1, 'devAnchor', { fromX: -20, sfxName: SFX_MAP.POP.name })
    popIn(tl, t + 0.3, 'serverAnchor', { fromX: 20, sfxName: SFX_MAP.POP2.name })
    say(tl, t + 0.4, 'App jalan mulus di laptop developer.')

    tl.add(() => setAppVisible(v => ({ ...v, dev: true })), t + 0.7)
    sfxOn(tl, t + 0.7, () => sfxLoader.sfx(SFX_MAP.TYPING.name, { volume, speed }))
    tl.add(() => setCodeText(CODE_SNIPPET_ACT1), t + 1.1)
    popIn(tl, t + 1.4, 'devCheckmark', { sfxName: SFX_MAP.CHIME.name })

    say(tl, t + 1.9, 'Kode yang sama di-deploy ke server.')
    tl.add(() => setMovingApp({ x: DEV_X, opacity: 1, color: COLORS.SUCCESS }), t + 2.1)
    const moveObj1 = { x: DEV_X }
    tl.to(moveObj1, {
      x: SERVER_X, duration: 1.2, ease: 'power2.inOut',
      onStart: () => sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume, speed }),
      onUpdate: () => setMovingApp(prev => ({ ...prev, x: moveObj1.x })),
    }, t + 2.2)

    tl.add(() => {
      setMovingApp({ x: SERVER_X, opacity: 0, color: COLORS.DANGER })
      setAppVisible(v => ({ ...v, server: true }))
      setAppColor(c => ({ ...c, server: COLORS.DANGER }))
      setCrashVisible(true)
      sfxLoader.sfx(SFX_MAP.ERROR.name, { volume, speed })
    }, t + 3.4)
    // crashIcon & ERROR sfx sama-sama trigger di t+3.4 — 1 sfx mewakili
    // 2 elemen yang muncul bareng (04 § "Policy: sfx: false Wajib Ada Alasan").
    popIn(tl, t + 3.5, 'crashIcon', { duration: 0.35, ease: 'back.out(2)', sfx: false })
    popIn(tl, t + 3.8, 'faceConfused', { sfxName: SFX_MAP.POP2.name })
    popIn(tl, t + 4.2, 'speechHook', { fromY: 10, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: 'sfx' })

    popIn(tl, t + 6.6, 'cliffhanger1', { fromY: 15, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: 'sfx' })
    t += PHASES[0].duration

    // ═══════════ ACT 2 — Catatan Beda, Kode Tetap Sama (10.5s) ════════════
    tl.add(() => {
      setPhaseIdx(1)
      setCodeStage('hardcode')
      setLinkVisible({ dev: false, server: false })
      setAppColor({ dev: COLORS.SUCCESS, server: COLORS.SUCCESS })
    }, t)
    say(tl, t + 0.1, 'Buka kode, cari kenapa bisa beda.')
    popIn(tl, t + 0.5, 'codePanel', { sfxName: SFX_MAP.BOUNCE.name })
    popIn(tl, t + 0.9, 'hardcodeBadge', { sfxName: SFX_MAP.CLICK.name, sfxCategory: 'sfx' })
    popIn(tl, t + 1.5, 'hardcodeInsight', { sfxName: SFX_MAP.CHIME.name })

    tl.add(() => {
      setCodeStage('envvar')
      sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume, speed })
    }, t + 2.7)

    say(tl, t + 3.0, 'File .env itu konvensi, bukan aturan baku.')
    popIn(tl, t + 3.3, 'stickyDev', { fromY: -10, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: 'sfx' })
    popIn(tl, t + 3.7, 'stickyServer', { fromY: -10, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: 'sfx' })

    tl.add(() => setLinkVisible({ dev: true, server: true }), t + 4.2)
    sfxOn(tl, t + 4.2, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volume * 0.8, speed }))
    tl.add(() => {
      setAppColor({ dev: COLORS.SUCCESS, server: COLORS.SUCCESS })
      sfxLoader.success(SFX_MAP.CONFIRM.name, { volume, speed })
    }, t + 4.8)
    popIn(tl, t + 5.6, 'envInsight', { sfxName: SFX_MAP.DING.name, sfxCategory: 'success' })
    say(tl, t + 6.6, 'Production bisa set lewat Docker atau cloud.')
    // prodNoteCard dekoratif, elaborasi caption di atas — sengaja silent
    // (04 § "Policy: sfx: false Wajib Ada Alasan" poin 2).
    popIn(tl, t + 6.9, 'prodNoteCard', { sfx: false })
    t += PHASES[1].duration

    // ═══════════ ACT 3 — Jangan Titip Rahasia ke Git (10.5s) ═══════════════
    tl.add(() => {
      setPhaseIdx(2)
      setMovingSecret({ p: 0, opacity: 0 })
      setThreatOpacity(0)
      setSecretBlocked(false)
      setMovingExample({ p: 0, opacity: 0 })
    }, t)
    say(tl, t + 0.1, 'Catatan makin banyak isinya.')
    popIn(tl, t + 0.4, 'secretSticky', { sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: 'sfx' })
    popIn(tl, t + 1.6, 'gitBox', { sfxName: SFX_MAP.POP.name })

    tl.add(() => setMovingSecret({ p: 0, opacity: 1 }), t + 2.0)
    const secretObj = { v: 0 }
    tl.to(secretObj, {
      v: 1, duration: 1.0, ease: 'power2.in',
      onStart: () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed }),
      onUpdate: () => setMovingSecret(prev => ({ ...prev, p: secretObj.v })),
    }, t + 2.1)
