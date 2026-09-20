// src/content/60-linux-processes/Animation.jsx
// Eksekusi plan awal + revisi-01 (hapus narration bubble global, caption jadi
// badge lokal per elemen, tambah icon accent, perapat dead-time + real-case
// "laptop lambat"). Status: kode + data, BELUM preview manual & export MP4.
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, PROCESSES, BROWSER_SPIKE, PROGRAM_LABEL, CLONE_PID,
  CAPTIONS, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { getIcon } from './icons/loader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
  lerp,
} from '../../shared/scene-ui/v1'

// Posisi statis (local body coordinate — lihat _docs/LINUX_PROCESSES_PLAN.md
// §Layout map V1 + revisi/2026-09-19-revisi-01-*.md §2.3/§3.3/§3.4). Grid
// 3-kolom (150/366/582) konsisten dengan pola topic lain.
const PROGRAM_LANE_X = 170
const PROGRAM_LANE_Y = 210
const ARENA_Y = 460
const METER_Y = 697
const TERMINAL_X = 366
const TERMINAL_Y = 880
const CLONE_X = 150
const CLONE_Y = 365
const LAUNCH_CURSOR_X = 170
const LAUNCH_CURSOR_Y = 145
const PID_REUSE_X = 270
const PID_REUSE_Y = 400
const WARNING_ICON_X = 650
const WARNING_ICON_Y = 660

function LocalCaptionBadge({ x, y, text, opacity, scale, color }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x="-150" y="-24" width="300" height="48" rx="16" fill={COLORS.PANEL} stroke={color} strokeWidth="1.5" />
      <path d="M-14 24 l14 16 l14 -16 z" fill={COLORS.PANEL} stroke={color} strokeWidth="1.5" />
      <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="700" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

function ProgramFileCard({ x, y, opacity, label }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <text x="0" y="-58" textAnchor="middle" fontFamily="monospace" fontSize="10" letterSpacing="1" fill={COLORS.MUTED}>DISK</text>
      <path d="M-34,-46 h48 l20,20 v72 h-88 z" fill={COLORS.PANEL_ALT} stroke={COLORS.PROGRAM} strokeWidth="2" />
      <path d="M14,-46 v20 h20 z" fill={COLORS.PROGRAM} opacity="0.4" />
      <text x="0" y="10" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.TEXT}>{label}</text>
    </g>
  )
}

function LaunchCursorIcon({ x, y, opacity, scale }) {
  const icon = getIcon('icon-launch-cursor')
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <image href={icon} x="-16" y="-16" width="32" height="32" />
      <text x="0" y="26" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>klik</text>
    </g>
  )
}

function WarningLoadIcon({ x, y, opacity }) {
  const icon = getIcon('icon-warning-load')
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <circle cx="0" cy="0" r="22" fill={COLORS.PANEL} stroke={COLORS.WARNING} strokeWidth="1.6" />
      <image href={icon} x="-14" y="-14" width="28" height="28" />
      <text x="0" y="34" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.WARNING}>berat</text>
    </g>
  )
}

function ProcessCard({ x, y, scale = 1, opacity = 1, color, name, pidVisible, pid, highlight, iconId }) {
  const icon = iconId ? getIcon(iconId) : null
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x="-72" y="-52" width="144" height="104" rx="14" fill={COLORS.PANEL_ALT} stroke={highlight ? COLORS.SUCCESS : color} strokeWidth={highlight ? 3 : 2.2} />
      {icon && <image href={icon} x="-64" y="-42" width="24" height="24" />}
      <text x="0" y="-6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="14" fill={COLORS.TEXT}>{name}</text>
      <text x="0" y="16" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.MUTED}>process</text>
      {pidVisible && (
        <g transform="translate(0 40)">
          <rect x="-48" y="-13" width="96" height="26" rx="13" fill={COLORS.PANEL} stroke={COLORS.PID} strokeWidth="1.4" />
          <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.PID}>PID {pid}</text>
        </g>
      )}
      {highlight && (
        <text x="0" y="70" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.SUCCESS}>paling memakai resource</text>
      )}
    </g>
  )
}

function ResourceMeter({ x, y, color, cpu, mem, highlight }) {
  const cpuW = Math.max(0, Math.min(116, (116 * cpu) / 100))
  const memW = Math.max(0, Math.min(116, (116 * mem) / 100))
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-70" y="-38" width="140" height="76" rx="10" fill={COLORS.PANEL} stroke={highlight ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={highlight ? 2 : 1.2} />
      <text x="-58" y="-20" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>CPU</text>
      <rect x="-58" y="-12" width="116" height="8" rx="4" fill={COLORS.BORDER} />
      <rect x="-58" y="-12" width={cpuW} height="8" rx="4" fill={COLORS.CPU} />
      <text x="-58" y="8" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>MEM</text>
      <rect x="-58" y="16" width="116" height="8" rx="4" fill={COLORS.BORDER} />
      <rect x="-58" y="16" width={memW} height="8" rx="4" fill={COLORS.MEM} />
    </g>
  )
}

function PidChip({ x, y, opacity, pid }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <rect x="-58" y="-15" width="116" height="30" rx="15" fill={COLORS.PANEL} stroke={COLORS.PID} strokeWidth="1.4" strokeDasharray="4 3" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.PID}>PID {pid}</text>
    </g>
  )
}

function TerminalPsPanel({ x, y, opacity, scale = 1, promptTyped, psRows, showTakeaway, takeawayText, highlightRowId }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x="-320" y="-85" width="640" height="170" rx="18" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="2" />
      <circle cx="-296" cy="-64" r="5" fill={COLORS.MUSIC} />
      <circle cx="-278" cy="-64" r="5" fill={COLORS.EDITOR} />
      <circle cx="-260" cy="-64" r="5" fill={COLORS.SUCCESS} />
      {promptTyped && (
        <text x="-296" y="-36" fontFamily="monospace" fontWeight="700" fontSize="14" fill={COLORS.SUCCESS}>$ ps</text>
      )}
      <line x1="-296" y1="-22" x2="296" y2="-22" stroke={COLORS.BORDER} strokeWidth="1" />
      <text x="-296" y="-4" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>PID</text>
      <text x="-176" y="-4" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>CMD</text>
      <text x="120" y="-4" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>STAT</text>
      {PROCESSES.slice(0, psRows).map((p, i) => {
        const rowY = 14 + i * 16
        const isCulprit = highlightRowId === p.id
        const rowColor = isCulprit ? COLORS.WARNING : p.color
        return (
          <g key={p.id}>
            {isCulprit && <rect x="-306" y={rowY - 11} width="612" height="15" rx="4" fill={COLORS.WARNING} opacity="0.12" />}
            <text x="-296" y={rowY} fontFamily="monospace" fontWeight={isCulprit ? '700' : '400'} fontSize="12.5" fill={rowColor}>{p.pid}</text>
            <text x="-176" y={rowY} fontFamily="monospace" fontWeight={isCulprit ? '700' : '400'} fontSize="12.5" fill={rowColor}>{p.name}</text>
            <text x="120" y={rowY} fontFamily="monospace" fontSize="12.5" fill={COLORS.MUTED}>S</text>
          </g>
        )
      })}
      <line x1="-296" y1="60" x2="296" y2="60" stroke={COLORS.BORDER} strokeWidth="1" />
      {showTakeaway && (
        <text x="0" y="76" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.WARNING}>{takeawayText}</text>
      )}
    </g>
  )
}

export default function LinuxProcessesAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const tlRef = useRef(null)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)
  const audioUnlockedRef = useRef(audioUnlocked)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [morphP, setMorphP] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [caption, setCaption] = useState('')
  const [captionPos, setCaptionPos] = useState({ x: 0, y: 0 })
  const [pop, setPop] = useState({})
  const [handoff, setHandoff] = useState(0)
  const [pidVisible, setPidVisible] = useState({ browser: false, editor: false, music: false })
  const [resourceVal, setResourceVal] = useState({
    browser: { cpu: 0, mem: 0 }, editor: { cpu: 0, mem: 0 }, music: { cpu: 0, mem: 0 },
  })
  const [highlightBrowser, setHighlightBrowser] = useState(false)
  const [psRows, setPsRows] = useState(0)
  const [promptTyped, setPromptTyped] = useState(false)
  const [showTakeaway, setShowTakeaway] = useState(false)
  const [highlightPsRow0, setHighlightPsRow0] = useState(false)

  const P = (id) => pop[id] || { opacity: 0, scale: 0, x: 0, y: 0 }
  const play = (entry) => {
    if (!audioUnlockedRef.current || !entry) return
    sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current })
  }

  useEffect(() => {
    volumeRef.current = volume
    speedRef.current = speed
    audioUnlockedRef.current = audioUnlocked
    sfxLoader.setEnabled(Boolean(previewSfx && audioUnlocked))
  }, [volume, speed, previewSfx, audioUnlocked])

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6 })
    tlRef.current = tl
    window.__animationTimeline = tl

    const popIn = (at, id, entry = SFX_MAP.POP, fromY = 12) => {
      tl.add(() => setPop((prev) => ({ ...prev, [id]: { opacity: 0, scale: 0, x: 0, y: fromY } })), at)
      const obj = { v: 0 }
      tl.to(obj, {
        v: 1, duration: 0.42, ease: 'back.out(1.55)',
        onStart: () => play(entry),
        onUpdate: () => setPop((prev) => ({
          ...prev, [id]: { opacity: Math.min(1, obj.v * 1.4), scale: obj.v, x: 0, y: fromY * (1 - obj.v) },
        })),
      }, at)
    }

    const fadeOut = (at, id) => {
      tl.add(() => setPop((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), opacity: 0 } })), at)
    }

    // caption badge lokal — satu channel, dipindah posisi & teks tiap beat
    // (revisi-01 §2.3, menggantikan narration-bubble global)
    const captionBeat = (at, text, x, y, entry = SFX_MAP.TICK) => {
      tl.add(() => { setCaption(text); setCaptionPos({ x, y }) }, at)
      popIn(at, 'caption', entry, 10)
    }

    tl.add(() => {
      setPhaseIdx(0)
      setMorphP(0)
      setContentStarted(false)
      setCaption('')
      setCaptionPos({ x: 0, y: 0 })
      setPop({})
      setHandoff(0)
      setPidVisible({ browser: false, editor: false, music: false })
      setResourceVal({ browser: { cpu: 0, mem: 0 }, editor: { cpu: 0, mem: 0 }, music: { cpu: 0, mem: 0 } })
      setHighlightBrowser(false)
      setPsRows(0)
      setPromptTyped(false)
      setShowTakeaway(false)
      setHighlightPsRow0(false)
    }, 0)

    const morph = { p: 0 }
    tl.to(morph, { p: 1, duration: 0.9, ease: 'power3.inOut', onUpdate: () => setMorphP(morph.p) }, 0.25)

    tl.add(() => { setContentStarted(true); play(SFX_MAP.SHIMMER) }, 1.15)

    const INTRO_DELAY = 1.15
    const actStart = [0, 0, 0, 0]
    actStart[0] = INTRO_DELAY
    for (let i = 1; i < 4; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    // ── Act 1 — file diam di disk → dijalankan → jadi process ──
    tl.add(() => setPhaseIdx(0), actStart[0])
    captionBeat(actStart[0] + 0.15, CAPTIONS.HOOK, 170, 120)
    popIn(actStart[0] + 1.3, 'launch-cursor', SFX_MAP.POP, 10)
    tl.add(() => play(SFX_MAP.TICK), actStart[0] + 2.0)
    fadeOut(actStart[0] + 2.3, 'launch-cursor')
    captionBeat(actStart[0] + 2.9, CAPTIONS.LAUNCH, 0, 0)
    const handoffObj = { v: 0 }
    tl.to(handoffObj, {
      v: 1, duration: 1.0, ease: 'power2.inOut',
      onStart: () => play(SFX_MAP.SWOOSH),
      onUpdate: () => setHandoff(handoffObj.v),
    }, actStart[0] + 3.0)
    tl.add(() => play(SFX_MAP.POP), actStart[0] + 4.05)
    captionBeat(actStart[0] + 7.0, CAPTIONS.CLIFFHANGER, 150, 380)

    // ── Act 2 — banyak process, tiap dapat PID ──
    tl.add(() => setPhaseIdx(1), actStart[1])
    captionBeat(actStart[1] + 0.15, CAPTIONS.PID, 150, 380)
    popIn(actStart[1] + 0.3, 'editor', SFX_MAP.POP)
    popIn(actStart[1] + 0.9, 'music', SFX_MAP.POP2)
    tl.add(() => { setPidVisible({ browser: true, editor: true, music: true }); play(SFX_MAP.TICK) }, actStart[1] + 1.6)
    captionBeat(actStart[1] + 3.2, CAPTIONS.CLONE, 150, 335)
    popIn(actStart[1] + 3.4, 'clone', SFX_MAP.POP2)
    fadeOut(actStart[1] + 7.0, 'clone')
    captionBeat(actStart[1] + 7.2, CAPTIONS.PID_REUSE, 258, 355)
    popIn(actStart[1] + 7.2, 'pid-reuse', SFX_MAP.POP2)
    fadeOut(actStart[1] + 8.7, 'pid-reuse')

    // ── Act 3 — process memakai resource, lalu "spike" (real case) ──
    tl.add(() => setPhaseIdx(2), actStart[2])
    captionBeat(actStart[2] + 0.15, CAPTIONS.RESOURCE, 366, 642)
    popIn(actStart[2] + 0.3, 'resourcePanels', SFX_MAP.POP)
    const resObj = { bC: 0, bM: 0, eC: 0, eM: 0, mC: 0, mM: 0 }
    tl.to(resObj, {
      bC: PROCESSES[0].cpu, bM: PROCESSES[0].mem,
      eC: PROCESSES[1].cpu, eM: PROCESSES[1].mem,
      mC: PROCESSES[2].cpu, mM: PROCESSES[2].mem,
      duration: 1.3, ease: 'power2.out',
      onStart: () => play(SFX_MAP.TALLY),
      onUpdate: () => setResourceVal({
        browser: { cpu: resObj.bC, mem: resObj.bM },
        editor: { cpu: resObj.eC, mem: resObj.eM },
        music: { cpu: resObj.mC, mem: resObj.mM },
      }),
    }, actStart[2] + 0.9)
    tl.add(() => { setHighlightBrowser(true); play(SFX_MAP.DING) }, actStart[2] + 3.5)
    captionBeat(actStart[2] + 3.5, CAPTIONS.RESOURCE_DIFF, 150, 642)
    popIn(actStart[2] + 4.5, 'warning-icon', SFX_MAP.WARNING)
    const spikeObj = { cpu: PROCESSES[0].cpu, mem: PROCESSES[0].mem }
    tl.to(spikeObj, {
      cpu: BROWSER_SPIKE.cpu, mem: BROWSER_SPIKE.mem, duration: 1.0, ease: 'power2.out',
      onStart: () => play(SFX_MAP.TALLY),
      onUpdate: () => setResourceVal((prev) => ({ ...prev, browser: { cpu: spikeObj.cpu, mem: spikeObj.mem } })),
    }, actStart[2] + 4.7)
    captionBeat(actStart[2] + 5.9, CAPTIONS.SPIKE, 150, 642)
    fadeOut(actStart[2] + 7.5, 'warning-icon')

    // ── Act 4 — lihat process hidup dari terminal, temukan biang lambat ──
    tl.add(() => setPhaseIdx(3), actStart[3])
    captionBeat(actStart[3] + 0.15, CAPTIONS.PS, 366, 765)
    popIn(actStart[3] + 0.3, 'terminal', SFX_MAP.POP)
    tl.add(() => { setPromptTyped(true); play(SFX_MAP.TICK) }, actStart[3] + 1.1)
    tl.add(() => { setPsRows(1); play(SFX_MAP.PAPER) }, actStart[3] + 1.9)
    tl.add(() => { setPsRows(2); play(SFX_MAP.PAPER) }, actStart[3] + 2.5)
    tl.add(() => { setPsRows(3); play(SFX_MAP.PAPER) }, actStart[3] + 3.1)
    tl.add(() => { setHighlightPsRow0(true); play(SFX_MAP.DING) }, actStart[3] + 3.5)
    captionBeat(actStart[3] + 3.9, CAPTIONS.PS_PID, 150, 765)
    tl.add(() => {
      setPop((prev) => ({ ...prev, caption: { ...(prev.caption || {}), opacity: 0 } }))
      setShowTakeaway(true)
    }, actStart[3] + 8.7)

    tl.to({}, { duration: 0.01 }, actStart[3] + PHASES[3].duration)

    return () => {
      tl.kill()
      if (window.__animationTimeline === tl) delete window.__animationTimeline
    }
  }, [])

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    tl.timeScale(speed)
    if (paused) tl.pause()
    else tl.resume()
  }, [paused, speed])

  const transform = (id, x, y) => {
    const p = P(id)
    return `translate(${x + p.x} ${y + p.y}) scale(${p.scale})`
  }

  const pEditor = P('editor')
  const pMusic = P('music')
  const pClone = P('clone')
  const pPidReuse = P('pid-reuse')
  const pResourcePanels = P('resourcePanels')
  const pTerminal = P('terminal')
  const pCaption = P('caption')
  const pLaunchCursor = P('launch-cursor')
  const pWarningIcon = P('warning-icon')

  const browserX = lerp(PROGRAM_LANE_X, PROCESSES[0].slotX, handoff)
  const browserY = lerp(PROGRAM_LANE_Y, ARENA_Y, handoff)
  const browserScale = lerp(0.55, 1, handoff)

  const captionIsLaunch = caption === CAPTIONS.LAUNCH
  const captionX = captionIsLaunch ? browserX : captionPos.x
  const captionY = captionIsLaunch ? browserY - 70 : captionPos.y

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{
      width: '100%', height: '100%', maxHeight: '100vh',
      maxWidth: `calc(100vh * ${VW} / ${VH})`,
      background: COLORS.BG, userSelect: 'none',
    }}>
      <defs>
        <filter id="linux-processes-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width={VW} height={VH} fill={COLORS.BG} />
      <g opacity="0.05">
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.BORDER} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.BORDER} />)}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.PROGRAM },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.PROGRAM },
          { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
        ]}
        subtitle={INTRO_SUBTITLE}
        titleFilter="url(#linux-processes-glow)"
        testId="linux-processes-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="linux-processes-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="linux-processes-body">
          <g>
            <g opacity={pCaption.opacity} transform={transform('caption', captionX, captionY)}>
              <LocalCaptionBadge x={0} y={0} text={caption} opacity={1} scale={1} color={PHASES[phaseIdx].badgeColor} />
            </g>

            <ProgramFileCard x={PROGRAM_LANE_X} y={PROGRAM_LANE_Y} opacity={1 - handoff} label={PROGRAM_LABEL} />
            <g opacity={pLaunchCursor.opacity} transform={transform('launch-cursor', LAUNCH_CURSOR_X, LAUNCH_CURSOR_Y)}>
              <LaunchCursorIcon x={0} y={0} opacity={1} scale={1} />
            </g>
            <text x="366" y="300" textAnchor="middle" fontFamily="monospace" fontSize="10" letterSpacing="1" fill={COLORS.MUTED}>PROCESSES</text>

            <ProcessCard
              x={browserX} y={browserY} scale={browserScale} opacity={handoff}
              color={PROCESSES[0].color} name={PROCESSES[0].name}
              pidVisible={pidVisible.browser} pid={PROCESSES[0].pid}
              highlight={highlightBrowser} iconId={PROCESSES[0].iconId}
            />
            <g opacity={pEditor.opacity} transform={transform('editor', PROCESSES[1].slotX, ARENA_Y)}>
              <ProcessCard x={0} y={0} color={PROCESSES[1].color} name={PROCESSES[1].name} pidVisible={pidVisible.editor} pid={PROCESSES[1].pid} iconId={PROCESSES[1].iconId} />
            </g>
            <g opacity={pMusic.opacity} transform={transform('music', PROCESSES[2].slotX, ARENA_Y)}>
              <ProcessCard x={0} y={0} color={PROCESSES[2].color} name={PROCESSES[2].name} pidVisible={pidVisible.music} pid={PROCESSES[2].pid} iconId={PROCESSES[2].iconId} />
            </g>

            <g opacity={pClone.opacity}>
              <PidChip x={CLONE_X} y={CLONE_Y} opacity={1} pid={CLONE_PID} />
            </g>
            <g opacity={pPidReuse.opacity}>
              <PidChip x={PID_REUSE_X} y={PID_REUSE_Y} opacity={0.6} pid={CLONE_PID} />
            </g>

            {phaseIdx >= 2 && (
              <g opacity={pResourcePanels.opacity}>
                <ResourceMeter x={PROCESSES[0].slotX} y={METER_Y} color={PROCESSES[0].color} cpu={resourceVal.browser.cpu} mem={resourceVal.browser.mem} highlight={highlightBrowser} />
                <ResourceMeter x={PROCESSES[1].slotX} y={METER_Y} color={PROCESSES[1].color} cpu={resourceVal.editor.cpu} mem={resourceVal.editor.mem} />
                <ResourceMeter x={PROCESSES[2].slotX} y={METER_Y} color={PROCESSES[2].color} cpu={resourceVal.music.cpu} mem={resourceVal.music.mem} />
              </g>
            )}

            <g opacity={pWarningIcon.opacity}>
              <WarningLoadIcon x={WARNING_ICON_X} y={WARNING_ICON_Y} opacity={1} />
            </g>

            {phaseIdx === 3 && (
              <TerminalPsPanel
                x={TERMINAL_X} y={TERMINAL_Y} opacity={pTerminal.opacity} scale={pTerminal.scale}
                promptTyped={promptTyped} psRows={psRows} showTakeaway={showTakeaway}
                takeawayText={CAPTIONS.PAYOFF} highlightRowId={highlightPsRow0 ? 'browser' : null}
              />
            )}
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
