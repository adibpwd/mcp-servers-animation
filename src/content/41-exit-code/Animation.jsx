// src/content/41-exit-code/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// Eksekusi sesuai src/content/41-exit-code/_docs/EXIT_CODE_PLAN.md.
// Empat Act, scene-ui V1 penuh, koordinat LOCAL, sumbu vertikal AXIS_X.
// Cerita: command dijalankan di shell lalu melempar sinyal angka ke `$?`
// (Act 1) — perbandingan file ditemukan (exit 0) vs file tidak ada
// (exit 1) (Act 2) — logika rantai `&&` (lanjut jika sukses) vs `||`
// (cadangan jika gagal) (Act 3) — exit code dibaca pipeline CI/CD untuk
// menentukan status build hijau/merah (Act 4).
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum
// `ready`, lihat plan § Storyboard).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, TERMINAL_Y, VAR_Y, CASE_ROW_Y, CHAIN_AND_Y, CHAIN_OR_Y, CI_Y,
  TERMINAL_CMD_1, TERMINAL_OUT_1, TERMINAL_CMD_2,
  CASE_SUCCESS, CASE_FAIL, CHAIN_AND_CMD, CHAIN_OR_CMD, CHAIN_OR_FALLBACK,
  CI_STEPS, CI_RESULT_LABEL, CAPTIONS, CAPTION_Y,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function ExitCodeAnimation({
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

  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  // ── Act 1 — sinyal rahasia $? ──
  const [termStep, setTermStep] = useState(0)
  const [varValue, setVarValue] = useState(null)
  // ── Act 2 — sukses 0 vs gagal non-zero ──
  const [caseSuccessDone, setCaseSuccessDone] = useState(false)
  const [caseFailDone, setCaseFailDone] = useState(false)
  // ── Act 3 — rantai && vs || ──
  const [andFlow, setAndFlow] = useState(false)
  const [andContinue, setAndContinue] = useState(false)
  const [orFail, setOrFail] = useState(false)
  const [orFallback, setOrFallback] = useState(false)
  // ── Act 4 — exit code di CI/CD ──
  const [ciStepDone, setCiStepDone] = useState(0)
  const [ciResult, setCiResult] = useState(false)

  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.45, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 0,
      sfxName = SFX_MAP.POP.name, sfxCategory = 'ui', volumeMult = 1 } = opts
    const o = { v: 0 }
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current * volumeMult, speed: speedRef.current }) },
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) } })),
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, category, name, opts = {}) =>
    tl.add(() => audioUnlockedRef.current && sfxLoader.play(category, name, { volume: volumeRef.current * (opts.volumeMult || 1), speed: speedRef.current }), time)

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — intro 1.0s + 7.0 + 7.0 + 9.0 + 7.6s ≈ 31.6s + repeatDelay 1.2s
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setPhaseIdx(0)
      setTermStep(0); setVarValue(null)
      setCaseSuccessDone(false); setCaseFailDone(false)
      setAndFlow(false); setAndContinue(false); setOrFail(false); setOrFallback(false)
      setCiStepDone(0); setCiResult(false)
      setPop({}); setCaption('')
    }, 0)

    // ═══════════════ INTRO ═══════════════════════════════════════
    let t = 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, 'transitions', SFX_MAP.WHOOSH.name)
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Sinyal Rahasia $? (±7.0s) ═══════════
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.05, 'terminalCard', {})
    say(tl, t + 0.1, CAPTIONS.TERMINAL_RUN)
    let t1 = t + 1.2
    tl.add(() => setTermStep(1), t1)
    sfxOn(tl, t1, 'sfx', SFX_MAP.TYPING.name)
    t1 += 1.3
    tl.add(() => setTermStep(2), t1)
    sfxOn(tl, t1, 'ui', SFX_MAP.TICK.name)
    say(tl, t1 + 0.1, CAPTIONS.TERMINAL_DONE)
    t1 += 1.3
    tl.add(() => setTermStep(3), t1)
    sfxOn(tl, t1, 'sfx', SFX_MAP.TYPING.name)
    say(tl, t1 + 0.1, CAPTIONS.CHECK_VAR)
    t1 += 1.3
    popIn(tl, t1, 'varBadge', { sfxName: SFX_MAP.CHIME.name, fromY: -12 })
    tl.add(() => setVarValue(0), t1 + 0.1)
    say(tl, t1 + 0.1, CAPTIONS.VAR_SHOW)
    t1 += 1.6
    let act1End = t1 + 0.3

    // ═══════════════ ACT 2 — Sukses 0 vs Gagal Non-Zero (±7.0s) ══
    tl.add(() => setPhaseIdx(1), act1End)
    popIn(tl, act1End + 0.1, 'caseSuccess', { sfxName: SFX_MAP.POP.name })
    say(tl, act1End + 0.15, CAPTIONS.CASE_FOUND)
    let t2 = act1End + 1.5
    tl.add(() => setCaseSuccessDone(true), t2)
    sfxOn(tl, t2, 'success', SFX_MAP.SUCCESS.name)
    t2 += 1.3
    popIn(tl, t2, 'caseFail', { sfxName: SFX_MAP.POP2.name })
    say(tl, t2 + 0.1, CAPTIONS.CASE_MISSING)
    t2 += 1.5
    tl.add(() => setCaseFailDone(true), t2)
    sfxOn(tl, t2, 'sfx', SFX_MAP.ERROR.name)
    t2 += 1.3
    say(tl, t2, CAPTIONS.RULE_ZERO)
    let act2End = t2 + 1.4

    // ═══════════════ ACT 3 — Rantai Logika && dan || (±9.0s) ═════
    tl.add(() => setPhaseIdx(2), act2End)
    popIn(tl, act2End + 0.1, 'chainAnd', { sfxName: SFX_MAP.POP.name })
    say(tl, act2End + 0.15, CAPTIONS.AND_INTRO)
    let t3 = act2End + 1.6
    tl.add(() => setAndFlow(true), t3)
    sfxOn(tl, t3, 'success', SFX_MAP.SUCCESS.name)
    say(tl, t3 + 0.1, CAPTIONS.AND_RUN)
    t3 += 1.4
    tl.add(() => setAndContinue(true), t3)
    say(tl, t3 + 0.1, CAPTIONS.AND_CONT)
    t3 += 1.5
    popIn(tl, t3, 'chainOr', { sfxName: SFX_MAP.POP2.name })
    say(tl, t3 + 0.1, CAPTIONS.OR_INTRO)
    t3 += 1.6
    tl.add(() => setOrFail(true), t3)
    sfxOn(tl, t3, 'warnings', SFX_MAP.ERROR_BEEP.name)
    say(tl, t3 + 0.1, CAPTIONS.OR_RUN)
    t3 += 1.4
    tl.add(() => setOrFallback(true), t3)
    sfxOn(tl, t3, 'ui', SFX_MAP.TICK.name)
    say(tl, t3 + 0.1, CAPTIONS.OR_FALLBACK)
    let act3End = t3 + 1.5

    // ═══════════════ ACT 4 — Exit Code di CI/CD Pipeline (±7.6s) ═
    tl.add(() => setPhaseIdx(3), act3End)
    popIn(tl, act3End + 0.1, 'ciPanel', { sfxName: SFX_MAP.POP.name })
    say(tl, act3End + 0.15, CAPTIONS.CI_START)
    let t4 = act3End + 1.5
    CI_STEPS.forEach((_, i) => {
      const st = t4 + i * 1.1
      tl.add(() => setCiStepDone(i + 1), st)
      sfxOn(tl, st, 'ui', SFX_MAP.TICK.name)
    })
    say(tl, t4 + 0.2, CAPTIONS.CI_STEP)
    t4 += CI_STEPS.length * 1.1
    tl.add(() => setCiResult(true), t4)
    sfxOn(tl, t4, 'success', SFX_MAP.RELIEF.name)
    say(tl, t4 + 0.1, CAPTIONS.CI_PASS)
    t4 += 1.6
    let act4End = t4 + 1.2

    tl.to({}, { duration: 0.9 }, act4End)

    return () => {
      tl.kill()
      delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
    if (paused) tlRef.current.pause(); else tlRef.current.resume()
  }, [speed, paused])

  // ── render helpers ──
  const T = (id, cx, cy) => {
    const p = P(id)
    return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
  }
  const O = (id) => P(id).opacity

  const TerminalWindow = ({ x, y, step }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-260} y={-70} width={520} height={140} rx={12} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} filter="url(#shadow)" />
      <rect x={-260} y={-70} width={520} height={26} rx={12} fill={COLORS.PANEL} />
      <circle cx={-238} cy={-57} r={5} fill={COLORS.FAIL} />
      <circle cx={-220} cy={-57} r={5} fill="#F59E0B" />
      <circle cx={-202} cy={-57} r={5} fill={COLORS.SUCCESS} />
      <text x={-236} y={-24} fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>{step >= 1 ? TERMINAL_CMD_1 : '$ '}</text>
      {step >= 2 && <text x={-236} y={0} fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>{TERMINAL_OUT_1}</text>}
      {step >= 3 && <text x={-236} y={26} fontSize={11} fontFamily="monospace" fill={COLORS.EXIT}>{TERMINAL_CMD_2}</text>}
    </g>
  )

  const VarBadge = ({ x, y, value }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-90} y={-28} width={180} height={56} rx={12} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={2} filter="url(#shadow)" />
      <text x={0} y={-6} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.MUTED}>REGISTER $?</text>
      <text x={0} y={20} textAnchor="middle" fontSize={22} fontWeight={900} fontFamily="monospace" fill={COLORS.SUCCESS}>{value ?? '·'}</text>
    </g>
  )

  const CaseCard = ({ x, y, data, done, ok }) => {
    const color = ok ? COLORS.SUCCESS : COLORS.FAIL
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect x={-160} y={-60} width={320} height={120} rx={12} fill={COLORS.PANEL} stroke={done ? color : COLORS.BORDER} strokeWidth={2} filter="url(#shadow)" />
        <text x={-138} y={-32} fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>{data.label}</text>
        <text x={-138} y={-14} fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{data.detail}</text>
        <rect x={-138} y={-2} width={92} height={20} rx={8} fill={COLORS.BG} stroke={color} strokeWidth={1} opacity={0.85} />
        <text x={-92} y={12} textAnchor="middle" fontSize={8.5} fontWeight={700} fontFamily="monospace" fill={color}>{data.tag}</text>
        {done && (
          <g transform="translate(112, 18)">
            <circle r={22} fill="none" stroke={color} strokeWidth={2.5} />
            <text x={0} y={7} textAnchor="middle" fontSize={18} fontWeight={900} fontFamily="monospace" fill={color}>{data.code}</text>
          </g>
        )}
      </g>
    )
  }

  const ChainAnd = ({ x, y, flow, cont }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-300} y={-38} width={600} height={76} rx={12} fill={COLORS.PANEL} stroke={COLORS.AND} strokeWidth={1.5} filter="url(#shadow)" />
      <text x={0} y={-12} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={flow ? COLORS.SUCCESS : COLORS.TEXT}>{CHAIN_AND_CMD}</text>
      <rect x={-70} y={4} width={140} height={22} rx={8} fill={COLORS.BG} stroke={COLORS.AND} strokeWidth={1} />
      <text x={0} y={19} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.AND}>OPERATOR &amp;&amp;</text>
      {cont && (
        <text x={130} y={19} fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>→ lanjut</text>
      )}
    </g>
  )

  const ChainOr = ({ x, y, fail, fallback }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-300} y={-38} width={600} height={76} rx={12} fill={COLORS.PANEL} stroke={COLORS.OR} strokeWidth={1.5} filter="url(#shadow)" />
      <text x={0} y={-12} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={fail ? COLORS.FAIL : COLORS.TEXT}>{CHAIN_OR_CMD}</text>
      <rect x={-70} y={4} width={140} height={22} rx={8} fill={COLORS.BG} stroke={COLORS.OR} strokeWidth={1} />
      <text x={0} y={19} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.OR}>OPERATOR ||</text>
      {fallback && (
        <text x={140} y={19} fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.FAIL}>→ {CHAIN_OR_FALLBACK}</text>
      )}
    </g>
  )

  const CiPanel = ({ x, y, stepDone, result }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-300} y={-70} width={600} height={140} rx={12} fill={COLORS.PANEL} stroke={result ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={2} filter="url(#shadow)" />
      <text x={-276} y={-44} fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.MUTED}>CI/CD PIPELINE</text>
      {CI_STEPS.map((step, i) => {
        const done = stepDone >= i + 1
        const sx = -180 + i * 180
        return (
          <g key={step.id} transform={`translate(${sx}, -6)`}>
            <circle r={9} fill={done ? COLORS.SUCCESS : COLORS.BG} stroke={done ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={2} />
            <text x={0} y={30} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={done ? COLORS.SUCCESS : COLORS.MUTED}>{step.label}</text>
            {i < CI_STEPS.length - 1 && <line x1={16} y1={0} x2={164} y2={0} stroke={done ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={2} />}
          </g>
        )
      })}
      {result && (
        <g transform="translate(0, 52)">
          <rect x={-110} y={-14} width={220} height={28} rx={10} fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={1.5} />
          <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={900} fontFamily="monospace" fill={COLORS.SUCCESS}>{CI_RESULT_LABEL}</text>
        </g>
      )}
    </g>
  )

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.04}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.EXIT} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.EXIT} strokeWidth={1} />)}
      </g>

      {/* ── HEADER — scene-ui V1: EXIT (cyan) + CODE (emerald) ── */}
      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.CODE },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.EXIT },
              { label: INTRO_TITLE_B, color: COLORS.CODE },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="exit-code-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            testId="exit-code-act-navigator"
          />

          <ContentBodyV1 debugName="exit-code-body">

            {/* ── Act 1 — terminal + register $? ── */}
            <g transform={T('terminalCard', AXIS_X, TERMINAL_Y)} opacity={O('terminalCard')}>
              <TerminalWindow x={0} y={0} step={termStep} />
            </g>
            <g transform={T('varBadge', AXIS_X, VAR_Y)} opacity={O('varBadge')}>
              <VarBadge x={0} y={0} value={varValue} />
            </g>

            {/* ── Act 2 — sukses 0 vs gagal non-zero ── */}
            <g transform={T('caseSuccess', AXIS_X - 175, CASE_ROW_Y)} opacity={O('caseSuccess')}>
              <CaseCard x={0} y={0} data={CASE_SUCCESS} done={caseSuccessDone} ok={true} />
            </g>
            <g transform={T('caseFail', AXIS_X + 175, CASE_ROW_Y)} opacity={O('caseFail')}>
              <CaseCard x={0} y={0} data={CASE_FAIL} done={caseFailDone} ok={false} />
            </g>

            {/* ── Act 3 — rantai && vs || ── */}
            <g transform={T('chainAnd', AXIS_X, CHAIN_AND_Y)} opacity={O('chainAnd')}>
              <ChainAnd x={0} y={0} flow={andFlow} cont={andContinue} />
            </g>
            <g transform={T('chainOr', AXIS_X, CHAIN_OR_Y)} opacity={O('chainOr')}>
              <ChainOr x={0} y={0} fail={orFail} fallback={orFallback} />
            </g>

            {/* ── Act 4 — pipeline CI/CD ── */}
            <g transform={T('ciPanel', AXIS_X, CI_Y)} opacity={O('ciPanel')}>
              <CiPanel x={0} y={0} stepDone={ciStepDone} result={ciResult} />
            </g>

            {/* ── CAPTION ── */}
            {caption && (
              <g transform={`translate(${AXIS_X}, ${CAPTION_Y[phaseIdx]})`}>
                <rect x={-190} y={-18} width={380} height={34} rx={10} fill={COLORS.BG} opacity={0.88} stroke={COLORS.BORDER} strokeWidth={1.5} />
                <text x={0} y={3} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily="sans-serif" fill={COLORS.TEXT}>{caption}</text>
              </g>
            )}
          </ContentBodyV1>
        </g>
      )}
    </svg>
  )
}
