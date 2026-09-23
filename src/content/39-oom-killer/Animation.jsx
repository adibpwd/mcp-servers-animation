// src/content/39-oom-killer/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// Eksekusi sesuai src/content/39-oom-killer/_docs/OOM_KILLER_PLAN.md.
// Empat Act, scene-ui V1 penuh, koordinat LOCAL, sumbu vertikal AXIS_X.
// Cerita: RAM fisik + Swap nyaris 100% penuh — aplikasi rakus terus minta
// memori — Kernel gagal alokasi halaman baru, alarm OOM darurat aktif —
// scan 3 proses & hitung oom_score (Database krusial vs System daemon vs
// Worker memory-leak) — Worker dapat skor tertinggi — SIGKILL (9) dikirim,
// memori langsung lega, jejak tercatat di dmesg.
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum `ready`,
// lihat plan § Storyboard).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, METER_PANEL_Y, APP_CARD_Y, ALARM_Y, PROC_A_Y, PROC_B_Y, PROC_C_Y, LOG_Y,
  METER_LABEL, APP_LABEL, ALARM_LABEL, ALARM_STATUS_IDLE, ALARM_STATUS_ACTIVE,
  LOG_LABEL, PROCESSES, LOG_LINES, CAPTIONS, CAPTION_Y,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function OomKillerAnimation({
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

  // ── Act 1 — tekanan memori ──
  const [ramFill, setRamFill] = useState(0)
  const [swapFill, setSwapFill] = useState(0)
  // ── Act 2 — alarm kernel ──
  const [alarmActive, setAlarmActive] = useState(false)
  // ── Act 3 — hitung oom_score (fraksi 0..1 dari skala 0..1000) ──
  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)
  const [scoreC, setScoreC] = useState(0)
  const [victimHighlight, setVictimHighlight] = useState(false)
  // ── Act 4 — eksekusi SIGKILL + log ──
  const [processDead, setProcessDead] = useState(false)
  const [logLines, setLogLines] = useState([])

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

  const popOut = (tl, time, id, opts = {}) => {
    const { duration = 0.3, ease = 'power1.in' } = opts
    const o = { v: 1 }
    tl.to(o, {
      v: 0, duration, ease,
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v, opacity: o.v } })),
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  const tween = (tl, time, setter, from, to, duration, ease = 'power1.inOut') => {
    const o = { v: from }
    tl.to(o, { v: to, duration, ease, onUpdate: () => setter(o.v) }, time)
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — intro 1.2s + 6.9 + 5.9 + 9.3 + 9.4 s ≈ 32.7s + repeatDelay 1.2s
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setPhaseIdx(0)
      setRamFill(0); setSwapFill(0)
      setAlarmActive(false)
      setScoreA(0); setScoreB(0); setScoreC(0); setVictimHighlight(false)
      setProcessDead(false); setLogLines([])
      setPop({}); setCaption('')
    }, t)

    // ═══════════════ INTRO ═══════════════════════════════════════
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Tekanan Memori Menembus Batas (±6.9s) ═══════
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.05, 'meterPanel', {})
    say(tl, t + 0.1, CAPTIONS.RAM_FULL)
    sfxOn(tl, t + 0.15, () => sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    tween(tl, t + 0.2, setRamFill, 0, 0.999, 1.4, 'power2.out')
    t += 1.8
    popIn(tl, t, 'appCard', { sfxName: SFX_MAP.POP2.name })
    say(tl, t + 0.1, CAPTIONS.APP_HUNGRY)
    t += 1.6
    tween(tl, t, setSwapFill, 0, 1, 1.1, 'power2.out')
    sfxOn(tl, t, () => sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current * 0.8, speed: speedRef.current }))
    say(tl, t + 0.1, CAPTIONS.SWAP_FULL)
    t += 1.6
    say(tl, t, CAPTIONS.NO_ALLOC)
    let act1End = t + 1.3

    // ═══════════════ ACT 2 — Alarm Darurat Kernel Berbunyi (±5.9s) ═══════
    tl.add(() => setPhaseIdx(1), act1End)
    popIn(tl, act1End + 0.1, 'alarmCard', { sfxName: SFX_MAP.CRITICAL_ALERT.name, sfxCategory: 'warnings' })
    say(tl, act1End + 0.15, CAPTIONS.KERNEL_DETECT)
    let t2 = act1End + 1.8
    tl.add(() => setAlarmActive(true), t2)
    sfxOn(tl, t2, () => sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.1, CAPTIONS.ALARM_ON)
    t2 += 1.7
    say(tl, t2, CAPTIONS.PROTECT_OS)
    let act2End = t2 + 1.4

    // ═══════════════ ACT 3 — Menghitung Skor Korban (±9.3s) ═══════════════
    tl.add(() => setPhaseIdx(2), act2End)
    popIn(tl, act2End + 0.1, 'procA', { sfxName: SFX_MAP.POP.name })
    popIn(tl, act2End + 0.25, 'procB', { sfxName: SFX_MAP.POP2.name })
    popIn(tl, act2End + 0.4, 'procC', { sfxName: SFX_MAP.POP.name })
    sfxOn(tl, act2End + 0.1, () => sfxLoader.play('sfx', SFX_MAP.SCAN.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, act2End + 0.15, CAPTIONS.SCAN_START)
    let t3 = act2End + 1.8
    tween(tl, t3, setScoreA, 0, PROCESSES.A.score / 1000, 0.6)
    sfxOn(tl, t3, () => sfxLoader.play('ui', SFX_MAP.NUMBER_TALLY.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.SCORE_DB)
    t3 += 1.3
    tween(tl, t3, setScoreB, 0, PROCESSES.B.score / 1000, 0.6)
    sfxOn(tl, t3, () => sfxLoader.play('ui', SFX_MAP.NUMBER_TALLY.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.SCORE_DAEMON)
    t3 += 1.3
    tween(tl, t3, setScoreC, 0, PROCESSES.C.score / 1000, 1.0, 'power2.out')
    sfxOn(tl, t3, () => sfxLoader.play('ui', SFX_MAP.NUMBER_TALLY.name, { volume: volumeRef.current * 1.1, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.SCORE_WORKER)
    t3 += 1.2
    tl.add(() => setVictimHighlight(true), t3)
    sfxOn(tl, t3, () => sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current * 0.85, speed: speedRef.current }))
    t3 += 1.7
    say(tl, t3, CAPTIONS.PICK_VICTIM)
    let act3End = t3 + 1.4

    // ═══════════════ ACT 4 — Eksekusi SIGKILL & Jejak di dmesg (±9.4s) ════
    tl.add(() => setPhaseIdx(3), act3End)
    popIn(tl, act3End + 0.1, 'killStamp', { sfxName: SFX_MAP.IMPACT.name, sfxCategory: 'impacts' })
    say(tl, act3End + 0.15, CAPTIONS.SEND_SIGKILL)
    let t4 = act3End + 1.3
    tl.add(() => setProcessDead(true), t4)
    sfxOn(tl, t4, () => sfxLoader.play('warnings', SFX_MAP.ERROR_BEEP.name, { volume: volumeRef.current * 0.8, speed: speedRef.current }))
    say(tl, t4 + 0.1, CAPTIONS.PROCESS_DEAD)
    t4 += 1.4
    tween(tl, t4, setRamFill, 0.999, 0.35, 1.0, 'power2.out')
    tween(tl, t4, setSwapFill, 1, 0.1, 1.0, 'power2.out')
    sfxOn(tl, t4, () => sfxLoader.play('success', SFX_MAP.RELIEF.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t4 + 0.1, CAPTIONS.MEMORY_FREED)
    t4 += 1.6
    popIn(tl, t4, 'logPanel', { sfxName: SFX_MAP.TYPING.name, sfxCategory: 'sfx' })
    say(tl, t4 + 0.1, CAPTIONS.LOGGED)
    t4 += 0.5
    LOG_LINES.forEach((line, i) => {
      tl.add(() => setLogLines(prev => [...prev, line]), t4 + i * 0.4)
      sfxOn(tl, t4 + i * 0.4, () => sfxLoader.play('ui', SFX_MAP.TICK.name, { volume: volumeRef.current * 0.6, speed: speedRef.current }))
    })
    t4 += LOG_LINES.length * 0.4
    let act4End = t4 + 1.0

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

  const BAR_W = 560

  const Meter = ({ x, y, label, fill, color, danger }) => (
    <g transform={`translate(${x}, ${y})`}>
      <text x={-BAR_W / 2} y={-12} fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.MUTED}>{label}</text>
      <text x={BAR_W / 2} y={-12} textAnchor="end" fontSize={11} fontWeight={900} fontFamily="monospace" fill={danger ? color : COLORS.TEXT}>{Math.round(fill * 100)}%</text>
      <rect x={-BAR_W / 2} y={0} width={BAR_W} height={20} rx={10} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
      <rect x={-BAR_W / 2} y={0} width={Math.max(0, BAR_W * fill)} height={20} rx={10} fill={color} opacity={danger ? 0.9 : 0.6} />
    </g>
  )

  const AppCard = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-120} y={-26} width={240} height={52} rx={10} fill={COLORS.PANEL} stroke={COLORS.RAM} strokeWidth={1.5} />
      <circle cx={-92} cy={0} r={10} fill={COLORS.BG} stroke={COLORS.RAM} strokeWidth={2} className="pulse-pill" />
      <text x={-72} y={-4} fontSize={9} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.RAM}>{APP_LABEL}</text>
      <text x={-72} y={12} fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>malloc() terus-menerus</text>
    </g>
  )

  const AlarmCard = ({ x, y, active }) => (
    <g transform={`translate(${x}, ${y})`}>
      {active && (
        <g opacity={0.5}>
          <circle r={54} fill="none" stroke={COLORS.KERNEL} strokeWidth={2} className="pulse-ring" />
          <circle r={40} fill="none" stroke={COLORS.KERNEL} strokeWidth={2} opacity={0.6} />
        </g>
      )}
      <rect x={-160} y={-40} width={320} height={80} rx={12} fill={COLORS.PANEL} stroke={active ? COLORS.KERNEL : COLORS.BORDER} strokeWidth={2} filter="url(#shadow)" />
      <text x={0} y={-18} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.MUTED}>{ALARM_LABEL}</text>
      <rect x={-90} y={-4} width={180} height={28} rx={8} fill={COLORS.BG} stroke={active ? COLORS.KERNEL : COLORS.BORDER} strokeWidth={1.5} />
      <text x={0} y={15} textAnchor="middle" fontSize={9} fontWeight={900} fontFamily="monospace" fill={active ? COLORS.KERNEL : COLORS.MUTED}>
        {active ? ALARM_STATUS_ACTIVE : ALARM_STATUS_IDLE}
      </text>
    </g>
  )

  const ProcessCard = ({ x, y, proc, scoreFrac, highlight, dead }) => {
    const color = COLORS[proc.color]
    const scoreMax = 240
    return (
      <g transform={`translate(${x}, ${y})`} opacity={dead ? 0.45 : 1}>
        <rect x={-260} y={-32} width={520} height={64} rx={12}
          fill={COLORS.PANEL} stroke={highlight ? COLORS.DENY : color} strokeWidth={highlight ? 3 : 1.5} filter="url(#shadow)" />
        <text x={-236} y={-10} fontSize={10} fontWeight={900} fontFamily="monospace" fill={color}>{proc.name}</text>
        <text x={-236} y={6} fontSize={8.5} fontFamily="monospace" fill={COLORS.MUTED}>PID {proc.pid} · {proc.mem}</text>
        <rect x={-236} y={12} width={78} height={16} rx={6} fill={COLORS.BG} stroke={color} strokeWidth={1} opacity={0.85} />
        <text x={-197} y={24} textAnchor="middle" fontSize={7.5} fontWeight={700} fontFamily="monospace" fill={color}>{proc.tag}</text>

        <text x={80} y={-14} fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>oom_score</text>
        <text x={230} y={-14} textAnchor="end" fontSize={11} fontWeight={900} fontFamily="monospace" fill={highlight ? COLORS.DENY : COLORS.TEXT}>{Math.round(scoreFrac * 1000)}</text>
        <rect x={30} y={-2} width={scoreMax} height={14} rx={7} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1} />
        <rect x={30} y={-2} width={Math.max(0, scoreMax * scoreFrac)} height={14} rx={7} fill={highlight ? COLORS.DENY : color} />

        {dead && (
          <g transform="translate(220, 8)" opacity={0.9}>
            <line x1={-9} y1={-9} x2={9} y2={9} stroke={COLORS.DENY} strokeWidth={2.5} />
            <line x1={9} y1={-9} x2={-9} y2={9} stroke={COLORS.DENY} strokeWidth={2.5} />
          </g>
        )}
      </g>
    )
  }

  const KillCross = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={34} fill="none" stroke={COLORS.DENY} strokeWidth={2.5} />
      <line x1={-24} y1={0} x2={24} y2={0} stroke={COLORS.DENY} strokeWidth={2.5} />
      <line x1={0} y1={-24} x2={0} y2={24} stroke={COLORS.DENY} strokeWidth={2.5} />
      <text x={0} y={52} textAnchor="middle" fontSize={11} fontWeight={900} fontFamily="monospace" fill={COLORS.DENY}>SIGKILL (9)</text>
    </g>
  )

  const LogPanel = ({ x, y, lines }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-330} y={-14} width={660} height={128} rx={10} fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={1.5} filter="url(#shadow)" />
      <text x={-306} y={8} fontSize={9} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.SUCCESS}>{LOG_LABEL}</text>
      {lines.map((line, i) => (
        <text key={i} x={-306} y={30 + i * 22} fontSize={8.5} fontFamily="monospace" fill={COLORS.TEXT}>{line}</text>
      ))}
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
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.OOM} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.OOM} strokeWidth={1} />)}
      </g>

      {/* ── HEADER — scene-ui V1: OOM (rose) + KILLER (amber) ── */}
      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.KERNEL },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.OOM },
              { label: INTRO_TITLE_B, color: COLORS.KILLER },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="oom-killer-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            testId="oom-killer-act-navigator"
          />

          <ContentBodyV1 debugName="oom-killer-body">

            {/* ── Act 1 — meter RAM + Swap, aplikasi rakus ── */}
            <g transform={T('meterPanel', AXIS_X, METER_PANEL_Y)} opacity={O('meterPanel')}>
              <Meter x={0} y={-20} label={METER_LABEL.ram} fill={ramFill} color={COLORS.RAM} danger={ramFill > 0.9} />
              <Meter x={0} y={40} label={METER_LABEL.swap} fill={swapFill} color={COLORS.SWAP} danger={swapFill > 0.9} />
            </g>
            <g transform={T('appCard', AXIS_X, APP_CARD_Y)} opacity={O('appCard')}>
              <AppCard x={0} y={0} />
            </g>

            {/* ── Act 2 — alarm kernel ── */}
            <g transform={T('alarmCard', AXIS_X, ALARM_Y)} opacity={O('alarmCard')}>
              <AlarmCard x={0} y={0} active={alarmActive} />
            </g>

            {/* ── Act 3 — scan proses + oom_score ── */}
            <g transform={T('procA', AXIS_X, PROC_A_Y)} opacity={O('procA')}>
              <ProcessCard x={0} y={0} proc={PROCESSES.A} scoreFrac={scoreA} highlight={false} dead={false} />
            </g>
            <g transform={T('procB', AXIS_X, PROC_B_Y)} opacity={O('procB')}>
              <ProcessCard x={0} y={0} proc={PROCESSES.B} scoreFrac={scoreB} highlight={false} dead={false} />
            </g>
            <g transform={T('procC', AXIS_X, PROC_C_Y)} opacity={O('procC')}>
              <ProcessCard x={0} y={0} proc={PROCESSES.C} scoreFrac={scoreC} highlight={victimHighlight} dead={processDead} />
            </g>

            {/* ── Act 4 — SIGKILL + dmesg log ── */}
            <g transform={T('killStamp', AXIS_X, PROC_C_Y)} opacity={O('killStamp')}>
              <KillCross x={0} y={0} />
            </g>
            <g transform={T('logPanel', AXIS_X, LOG_Y)} opacity={O('logPanel')}>
              <LogPanel x={0} y={0} lines={logLines} />
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
