// src/content/27-file-operations/Animation.revisi-03.jsx
// Revisi-03 (2026-09-16) — lihat revisi/2026-09-16-revisi-03-terminal-grid-motion.md
// VARIAN BARU: tidak menimpa Animation.jsx aktif. resolveTopic.js tetap
// memuat Animation.jsx sampai preview revisi ini disetujui secara eksplisit.
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, COLORS, ZONE, PHASES, CAPTIONS, CAPTION_BY_CMD, TERMINAL_STEPS,
  LINE_COLOR, SFX_MAP, GUI_VERB, CHANGE_BADGE, TILE, RISK_TILE, NESTED_BADGE,
  GRID_GEOMETRY, PROJECT_PATH, INTRO_CATEGORY_LABEL, INTRO_DOMAIN,
  INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  TERM_HEADER_H, TERM_PAD_Y, TERM_ROW_H, terminalHeightFor, truncateTerminalLine,
} from './data.revisi-03'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
} from '../../shared/scene-ui/v1'

const TYPE_DUR = 0.55
const ENTER_DUR = 0.18
const TRAVEL_DUR = 0.55
const APPLY_DUR = 0.35
const EXPLAIN_BASE = 0.78

// ── Ikon inline SVG reusable — tidak ada emoji/logo eksternal ──
const FolderIcon = ({ color }) => (
  <path d="M -16 -6 L -6 -6 L -2 -12 L 16 -12 L 16 10 L -16 10 Z" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
)

const DocBase = ({ color }) => (
  <>
    <path d="M -11 -14 L 5 -14 L 11 -8 L 11 14 L -11 14 Z" fill={COLORS.PANEL} stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M 5 -14 L 5 -8 L 11 -8 Z" fill={color} fillOpacity="0.5" />
  </>
)

const GLYPH_BY_KEY = {
  markdown: (color) => <text x="0" y="9" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9" fill={color}>M</text>,
  config: (color) => (
    <>
      <circle cx="-4" cy="6" r="1.6" fill={color} />
      <circle cx="0" cy="6" r="1.6" fill={color} />
      <circle cx="4" cy="6" r="1.6" fill={color} />
    </>
  ),
  log: (color) => (
    <>
      <line x1="-6" y1="2" x2="6" y2="2" stroke={color} strokeWidth="1.4" />
      <line x1="-6" y1="6" x2="6" y2="6" stroke={color} strokeWidth="1.4" />
      <line x1="-6" y1="10" x2="2" y2="10" stroke={color} strokeWidth="1.4" />
    </>
  ),
  html: (color) => <text x="0" y="9" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="8" fill={color}>{'</>'}</text>,
  image: (color) => (
    <>
      <circle cx="4" cy="1" r="2" fill={color} fillOpacity="0.7" />
      <path d="M -7 10 L -1 2 L 3 7 L 6 3 L 9 10 Z" fill={color} fillOpacity="0.6" />
    </>
  ),
}

const DocumentIcon = ({ glyph, color }) => (
  <g>
    <DocBase color={color} />
    {GLYPH_BY_KEY[glyph] ? GLYPH_BY_KEY[glyph](color) : null}
  </g>
)

const { tileW, tileH } = GRID_GEOMETRY

const TileFrame = ({ x, y, state, focused, dangerOutline, ghost, w = tileW, h = tileH, color, children }) => {
  const pending = state === 'pending'
  const creating = state === 'creating'
  return (
    <g transform={'translate(' + x + ' ' + y + ')'} opacity={ghost ? 0.16 : 1}>
      {focused && (
        <rect x={-w / 2 - 5} y={-h / 2 - 5} width={w + 10} height={h + 10} rx="16"
          fill="none" stroke={dangerOutline ? COLORS.WARNING : COLORS.CREATE} strokeWidth="2" opacity="0.85" />
      )}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="14"
        fill={COLORS.PANEL_ALT}
        stroke={dangerOutline ? COLORS.DANGER : (pending ? COLORS.BORDER : color)}
        strokeWidth={creating ? 2.2 : 1.4}
        strokeDasharray={pending ? '4 4' : undefined}
        opacity={pending ? 0.45 : 1} />
      <g opacity={pending ? 0.4 : 1}>{children}</g>
    </g>
  )
}

const FolderTile = ({ x, y, label, state, focused, color = COLORS.CREATE }) => (
  <TileFrame x={x} y={y} state={state} focused={focused} color={color}>
    <g transform="translate(0 -14)"><FolderIcon color={color} /></g>
    <text x="0" y="28" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.TEXT}>{label}</text>
  </TileFrame>
)

const FileTile = ({ x, y, label, glyph, state = 'ready', focused, dangerOutline, ghost, color = COLORS.READ }) => (
  <TileFrame x={x} y={y} state={state} focused={focused} dangerOutline={dangerOutline} ghost={ghost} color={color}
    w={GRID_GEOMETRY.riskW} h={GRID_GEOMETRY.riskH}>
    <g transform="translate(-52 0)"><DocumentIcon glyph={glyph} color={dangerOutline ? COLORS.DANGER : color} /></g>
    <text x="-24" y="5" textAnchor="start" fontFamily="monospace" fontSize="11.5" fill={COLORS.TEXT}>{label}</text>
  </TileFrame>
)

const GridFileTile = ({ x, y, label, glyph, state = 'ready', focused, color = COLORS.READ }) => (
  <TileFrame x={x} y={y} state={state} focused={focused} color={color}>
    <g transform="translate(0 -14)"><DocumentIcon glyph={glyph} color={color} /></g>
    <text x="0" y="28" textAnchor="middle" fontFamily="monospace" fontSize="11.5" fill={COLORS.TEXT}>{label}</text>
  </TileFrame>
)

const NestedBadge = ({ parentX, parentY, label, glyph, state, color = COLORS.CREATE }) => {
  if (state === 'hidden') return null
  const bx = parentX + tileW / 2 - 6
  const by = parentY + tileH / 2 - 4
  const creating = state === 'creating'
  return (
    <g transform={'translate(' + bx + ' ' + by + ')'} opacity={creating ? 0.6 : 1}>
      <rect x="-58" y="-15" width="60" height="26" rx="8" fill={COLORS.PANEL} stroke={color} strokeWidth={creating ? 2 : 1.4} strokeDasharray={creating ? '3 3' : undefined} />
      <g transform="translate(-46 -1) scale(0.72)"><DocumentIcon glyph={glyph} color={color} /></g>
      <text x="-8" y="4" textAnchor="end" fontFamily="monospace" fontSize="9.5" fill={COLORS.TEXT}>{label}</text>
    </g>
  )
}

const GridToolbar = ({ count }) => (
  <g>
    <text x="36" y="118" fontFamily="monospace" fontWeight="700" fontSize="12.5" fill={COLORS.MUTED}>{PROJECT_PATH}</text>
    <text x="366" y="118" textAnchor="middle" fontFamily="monospace" fontSize="11.5" fill={COLORS.TEXT}>{'\u25A6'} Grid</text>
    <text x="696" y="118" textAnchor="end" fontFamily="monospace" fontSize="11.5" fill={COLORS.MUTED}>{count} file</text>
    <line x1="36" y1="132" x2="696" y2="132" stroke={COLORS.BORDER} strokeWidth="1" />
  </g>
)

const ChangeBadge = ({ x, y, label, color, visible }) => {
  if (!visible || !label) return null
  const w = Math.max(70, label.length * 7.4 + 24)
  return (
    <g transform={'translate(' + x + ' ' + y + ')'}>
      <rect x={-w / 2} y="-14" width={w} height="28" rx="14" fill={COLORS.PANEL} stroke={color} strokeWidth="1.5" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={color}>{label}</text>
    </g>
  )
}

const CommandPulse = ({ pulse }) => {
  if (!pulse || !pulse.active) return null
  const color = COLORS[pulse.colorKey?.toUpperCase()] || COLORS.CREATE
  if (pulse.kind === 'scan') {
    const found = pulse.progress >= 0.97
    return (
      <g>
        <text x="366" y={ZONE.MOTION.yStart + 14} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>memindai folder nyata</text>
        <rect x="86" y={ZONE.MOTION.yStart + 26} width="560" height="10" rx="5" fill={COLORS.PANEL_ALT} stroke={COLORS.BORDER} />
        <rect x="86" y={ZONE.MOTION.yStart + 26} width={560 * pulse.progress} height="10" rx="5" fill={color} />
        <text x="366" y={ZONE.MOTION.yStart + 58} textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={found ? COLORS.SUCCESS : color}>
          {found ? 'ditemukan: ./assets/banner.png' : 'mencari...'}
        </text>
      </g>
    )
  }
  const railTop = ZONE.MOTION.yStart
  const railBottom = ZONE.MOTION.yEnd
  const dotY = railBottom - (railBottom - railTop) * pulse.progress
  return (
    <g>
      <line x1="366" y1={railBottom} x2="366" y2={railTop} stroke={COLORS.BORDER} strokeWidth="2" strokeDasharray="3 5" />
      <circle cx="366" cy={dotY} r="7" fill={color} />
      <g transform={'translate(366 ' + (railTop + 14) + ')'}>
        <rect x="-58" y="-15" width="116" height="28" rx="14" fill={COLORS.PANEL} stroke={color} strokeWidth="1.5" />
        <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill={color}>{pulse.verb}</text>
      </g>
    </g>
  )
}

const { colCenters, rowCenters, riskCenter, riskH } = GRID_GEOMETRY

function tileCenterFor(id) {
  const map = {
    src: { x: colCenters[0], y: rowCenters[0] },
    assets: { x: colCenters[1], y: rowCenters[0] },
    readme: { x: colCenters[2], y: rowCenters[0] },
    changelog: { x: colCenters[0], y: rowCenters[1] },
    config: { x: colCenters[1], y: rowCenters[1] },
    applog: { x: colCenters[2], y: rowCenters[1] },
    'old-draft': riskCenter,
  }
  return map[id] || { x: 366, y: 200 }
}

export default function FileOperationsAnimation({
  paused = false,
  speed = 1,
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
  const [bodyOpacity, setBodyOpacity] = useState(0)
  const [caption, setCaption] = useState('')
  const [history, setHistory] = useState([])
  const [activePrompt, setActivePrompt] = useState('')
  const [typingActive, setTypingActive] = useState(false)
  const [tileState, setTileState] = useState({ src: 'pending', assets: 'pending', readme: 'pending' })
  const [nestedBadge, setNestedBadge] = useState({ indexHtml: 'hidden', banner: 'hidden' })
  const [riskState, setRiskState] = useState('normal')
  const [focusTarget, setFocusTarget] = useState([])
  const [pulse, setPulse] = useState({ active: false, kind: 'dot', progress: 0, verb: '', colorKey: 'create' })
  const [changeBadge, setChangeBadge] = useState({ tileId: null, label: '', color: COLORS.CREATE, visible: false })

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

    const addLine = (text, colorKey) => setHistory((prev) => [...prev, { text: truncateTerminalLine(text), colorKey }].slice(-60))

    const markTiles = (ids, state) => setTileState((prev) => {
      const next = { ...prev }
      ids.forEach((id) => { if (id in next) next[id] = state })
      return next
    })

    const markTravelState = (event) => {
      if (event === 'mkdir') markTiles(['src', 'assets'], 'creating')
      if (event === 'touch') setNestedBadge((p) => ({ ...p, indexHtml: 'creating' }))
      if (event === 'cp') setNestedBadge((p) => ({ ...p, banner: 'creating' }))
      if (event === 'mv') markTiles(['readme'], 'creating')
    }

    const applyGui = (event) => {
      switch (event) {
        case 'mkdir': markTiles(['src', 'assets'], 'ready'); play(SFX_MAP.POP); break
        case 'touch': setNestedBadge((p) => ({ ...p, indexHtml: 'ready' })); play(SFX_MAP.POP2); break
        case 'cp': setNestedBadge((p) => ({ ...p, banner: 'ready' })); play(SFX_MAP.COPY); break
        case 'mv': markTiles(['readme'], 'ready'); play(SFX_MAP.MOVE); break
        case 'rm-ask': setRiskState('warning'); play(SFX_MAP.DENY); break
        case 'rm-confirm': setRiskState('removed'); play(SFX_MAP.CONFIRM); break
        case 'cat': play(SFX_MAP.OPEN); break
        case 'less': play(SFX_MAP.SCROLL); break
        case 'head': play(SFX_MAP.OPEN); break
        case 'tailf': play(SFX_MAP.STREAM); break
        case 'find': play(SFX_MAP.SCAN); break
        case 'locate': play(SFX_MAP.CATALOG); break
        default: break
      }
    }

    tl.add(() => {
      setPhaseIdx(0); setMorphP(0); setContentStarted(false); setBodyOpacity(0)
      setCaption(''); setHistory([]); setActivePrompt(''); setTypingActive(false)
      setTileState({ src: 'pending', assets: 'pending', readme: 'pending' })
      setNestedBadge({ indexHtml: 'hidden', banner: 'hidden' })
      setRiskState('normal'); setFocusTarget([])
      setPulse({ active: false, kind: 'dot', progress: 0, verb: '', colorKey: 'create' })
      setChangeBadge({ tileId: null, label: '', color: COLORS.CREATE, visible: false })
    }, 0)

    const morph = { p: 0 }
    tl.to(morph, { p: 1, duration: 0.9, ease: 'power3.inOut', onUpdate: () => setMorphP(morph.p) }, 0.25)

    const INTRO_DELAY = 1.15
    tl.add(() => { setContentStarted(true); play(SFX_MAP.CATALOG) }, INTRO_DELAY)
    const fadeObj = { v: 0 }
    tl.to(fadeObj, { v: 1, duration: 0.4, onUpdate: () => setBodyOpacity(fadeObj.v) }, INTRO_DELAY)

    const actStart = [0, 0, 0, 0]
    actStart[0] = INTRO_DELAY + 0.3
    for (let i = 1; i < 4; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    const scheduleAct = (actIdx, startAt) => {
      let cursor = startAt + 0.2
      tl.add(() => setPhaseIdx(actIdx), startAt)
      const steps = TERMINAL_STEPS.filter((s) => s.act === actIdx)
      steps.forEach((step) => {
        const verb = GUI_VERB[step.gui]
        const badgeLabel = CHANGE_BADGE[step.gui]
        const keepFocus = step.gui === 'rm-ask'
        const verbColorKey = (verb && verb.color) || 'create'

        if (step.full && step.kind === 'cmd') {
          const typeObj = { v: 0 }
          tl.add(() => setTypingActive(true), cursor)
          tl.to(typeObj, {
            v: step.text.length, duration: TYPE_DUR, ease: 'none',
            onUpdate: () => setActivePrompt(step.text.slice(0, Math.round(typeObj.v))),
          }, cursor)

          const enterAt = cursor + TYPE_DUR
          tl.add(() => {
            setTypingActive(false); setActivePrompt('')
            addLine(step.text, step.color); play(SFX_MAP.TICK)
            if (CAPTION_BY_CMD[step.text]) setCaption(CAPTION_BY_CMD[step.text])
          }, enterAt)

          const travelAt = enterAt + ENTER_DUR
          tl.add(() => {
            setFocusTarget(step.target || [])
            if (step.gui) markTravelState(step.gui)
            setPulse({ active: true, kind: step.gui === 'find' ? 'scan' : 'dot', progress: 0, verb: (verb && verb.text) || '', colorKey: verbColorKey })
          }, travelAt)
          const pulseObj = { v: 0 }
          tl.to(pulseObj, {
            v: 1, duration: TRAVEL_DUR, ease: 'power1.inOut',
            onUpdate: () => setPulse((p) => ({ ...p, progress: pulseObj.v })),
          }, travelAt)

          const applyAt = travelAt + TRAVEL_DUR
          tl.add(() => {
            if (step.gui) applyGui(step.gui)
            setPulse((p) => ({ ...p, active: false }))
          }, applyAt)

          const explainAt = applyAt + APPLY_DUR
          tl.add(() => {
            if (badgeLabel) {
              setChangeBadge({ tileId: (step.target || [])[0], label: badgeLabel, color: COLORS[verbColorKey.toUpperCase()], visible: true })
            }
          }, explainAt)

          cursor = explainAt + EXPLAIN_BASE + (step.holdExtra || 0)
          if (!keepFocus) {
            tl.add(() => { setFocusTarget([]); setChangeBadge((c) => ({ ...c, visible: false })) }, cursor - 0.12)
          }
        } else if (step.full && step.kind === 'out') {
          tl.add(() => { addLine(step.text, step.color) }, cursor)
          const applyAt = cursor + 0.22
          tl.add(() => { if (step.gui) applyGui(step.gui) }, applyAt)
          const explainAt = applyAt + APPLY_DUR
          tl.add(() => {
            if (badgeLabel) {
              setChangeBadge({ tileId: (step.target || [])[0], label: badgeLabel, color: COLORS[verbColorKey.toUpperCase()], visible: true })
            }
          }, explainAt)
          cursor = explainAt + EXPLAIN_BASE + (step.holdExtra || 0)
          tl.add(() => { setFocusTarget([]); setChangeBadge((c) => ({ ...c, visible: false })) }, cursor - 0.12)
        } else {
          tl.add(() => { addLine(step.text, step.color) }, cursor)
          cursor += 0.55 + (step.holdExtra || 0)
        }
      })
      return cursor
    }

    scheduleAct(0, actStart[0])
    scheduleAct(1, actStart[1])
    scheduleAct(2, actStart[2])
    const endAct3 = scheduleAct(3, actStart[3])

    tl.add(() => setCaption(CAPTIONS.TAKEAWAY), endAct3 + 0.3)
    tl.to({}, { duration: 0.01 }, endAct3 + 2.6)

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

  const termHeight = terminalHeightFor(history.length)
  const termTop = ZONE.TERMINAL_BOTTOM - termHeight
  const rowCount = Math.min(6, Math.max(2, history.length + 1))
  const visibleRows = rowCount - 1
  const visibleHistory = history.slice(-visibleRows)
  const rowY = (i) => termTop + TERM_HEADER_H + TERM_PAD_Y + i * TERM_ROW_H + 15

  const fileCount = riskState === 'removed' ? 6 : 7
  const cbCenter = changeBadge.tileId ? tileCenterFor(changeBadge.tileId) : { x: 366, y: 200 }
  const cbHalfH = changeBadge.tileId === 'old-draft' ? riskH / 2 : tileH / 2
  const isFocused = (id) => focusTarget.includes(id)

  return (
    <svg viewBox={'0 0 ' + VW + ' ' + VH} style={{
      width: '100%', height: '100%', maxHeight: '100vh',
      maxWidth: 'calc(100vh * ' + VW + ' / ' + VH + ')',
      background: COLORS.BG, userSelect: 'none',
    }}>
      <rect width={VW} height={VH} fill={COLORS.BG} />

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' \u00b7 ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.INTRO_A },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.INTRO_A },
          { label: INTRO_TITLE_B, color: COLORS.INTRO_B },
        ]}
        subtitle={INTRO_SUBTITLE}
        testId="file-operations-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="file-operations-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="file-operations-body" clip>
          <g opacity={bodyOpacity}>

            {/* Caption — zona 18-68 */}
            <g transform={'translate(366 ' + ((ZONE.CAPTION.yStart + ZONE.CAPTION.yEnd) / 2) + ')'}>
              <rect x="-300" y="-25" width="600" height="50" rx="20" fill={COLORS.PANEL} stroke={PHASES[phaseIdx].badgeColor} strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fontSize="14" fontWeight="700" fill={COLORS.TEXT}>{caption}</text>
            </g>

            {/* File grid — zona 92-468, grid 3x2 stabil + 1 tile berisiko */}
            <g>
              <rect x="0" y={ZONE.GRID.yStart} width="732" height={ZONE.GRID.yEnd - ZONE.GRID.yStart} rx="16" fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth="1.5" />
              <GridToolbar count={fileCount} />

              <FolderTile x={colCenters[0]} y={rowCenters[0]} label={TILE.SRC.label} state={tileState.src} focused={isFocused('src')} color={COLORS.CREATE} />
              <FolderTile x={colCenters[1]} y={rowCenters[0]} label={TILE.ASSETS.label} state={tileState.assets} focused={isFocused('assets')} color={COLORS.CREATE} />
              <GridFileTile x={colCenters[2]} y={rowCenters[0]} label={TILE.README.label} glyph="markdown" state={tileState.readme} focused={isFocused('readme')} color={COLORS.CREATE} />

              <GridFileTile x={colCenters[0]} y={rowCenters[1]} label={TILE.CHANGELOG.label} glyph="markdown" focused={isFocused('changelog')} color={COLORS.READ} />
              <GridFileTile x={colCenters[1]} y={rowCenters[1]} label={TILE.CONFIG.label} glyph="config" focused={isFocused('config')} color={COLORS.READ} />
              <GridFileTile x={colCenters[2]} y={rowCenters[1]} label={TILE.APPLOG.label} glyph="log" focused={isFocused('applog')} color={COLORS.READ} />

              <NestedBadge parentX={colCenters[0]} parentY={rowCenters[0]} label={NESTED_BADGE.INDEX_HTML.label} glyph="html" state={nestedBadge.indexHtml} color={COLORS.CREATE} />
              <NestedBadge parentX={colCenters[1]} parentY={rowCenters[0]} label={NESTED_BADGE.BANNER.label} glyph="image" state={nestedBadge.banner} color={COLORS.COPY} />

              {riskState !== 'removed' && (
                <FileTile x={riskCenter.x} y={riskCenter.y} label={RISK_TILE.label} glyph={RISK_TILE.glyph}
                  focused={isFocused('old-draft')} dangerOutline={riskState === 'warning'} color={COLORS.MUTED} />
              )}
            </g>

            {/* Motion corridor — zona 495-615, satu motion aktif */}
            <CommandPulse pulse={pulse} />
            <ChangeBadge x={cbCenter.x} y={cbCenter.y - cbHalfH - 22} label={changeBadge.label} color={changeBadge.color} visible={changeBadge.visible} />

            {/* Terminal — bottom tetap 858, tinggi ikut jumlah baris (2-6) */}
            <g>
              <rect x="46" y={termTop} width="640" height={termHeight} rx="16" fill={COLORS.PANEL_ALT} stroke={COLORS.READ} strokeWidth="2" />
              <circle cx="70" cy={termTop + 22} r="6" fill={COLORS.DANGER} />
              <circle cx="90" cy={termTop + 22} r="6" fill={COLORS.CREATE} />
              <circle cx="110" cy={termTop + 22} r="6" fill={COLORS.SUCCESS} />
              <text x="662" y={termTop + 27} textAnchor="end" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.SUCCESS}>{PROJECT_PATH}</text>
              <line x1="70" y1={termTop + 38} x2="662" y2={termTop + 38} stroke={COLORS.BORDER} strokeWidth="1" />

              {visibleHistory.map((line, i) => (
                <text key={i} x="70" y={rowY(i)} fontFamily="monospace" fontSize="12.5"
                  fill={LINE_COLOR[line.colorKey] || COLORS.TEXT}>{line.text}</text>
              ))}

              <text x="70" y={rowY(rowCount - 1)} fontFamily="monospace" fontSize="12.5" fill={COLORS.TEXT}>
                {'$ ' + activePrompt.replace(/^\$ /, '')}
                {typingActive && (
                  <tspan fill={COLORS.SUCCESS}>
                    {'\u2588'}
                    <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
                  </tspan>
                )}
              </text>
            </g>

            {/* Takeaway — zona 884-946 */}
            <g transform={'translate(366 ' + ((ZONE.CLOSING.yStart + ZONE.CLOSING.yEnd) / 2) + ')'} opacity={caption === CAPTIONS.TAKEAWAY ? 1 : 0}>
              <rect x="-262" y="-31" width="524" height="62" rx="28" fill={COLORS.SUCCESS} opacity="0.16" />
              <rect x="-262" y="-31" width="524" height="62" rx="28" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2" />
              <text x="0" y="7" textAnchor="middle" fontSize="17" fontWeight="700" fill={COLORS.SUCCESS}>{CAPTIONS.TAKEAWAY}</text>
            </g>
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
