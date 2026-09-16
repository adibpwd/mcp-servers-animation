// src/content/27-file-operations/Animation.jsx
// Revisi-04 (2026-09-16) — lihat revisi/2026-09-16-revisi-04-dynamic-grid-preview-modal.md
// STATUS: entry aktif sejak 2026-09-16 (menggantikan revisi-03).
// Backup revisi-03: Animation.revisi-03.jsx / data.revisi-03.js
// Backup revisi-02: Animation.revisi-02-backup-20260916.jsx
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, COLORS, ZONE, PHASES, CAPTIONS, CAPTION_BY_CMD, TERMINAL_STEPS,
  LINE_COLOR, SFX_MAP, GUI_VERB, CHANGE_BADGE, FILE_CATALOG, INITIAL_IDS,
  orderIds, GRID, computeGridLayout, PREVIEW_CONTENT, NESTED_BADGE,
  PROJECT_PATH, INTRO_CATEGORY_LABEL, INTRO_DOMAIN,
  INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  TERM_HEADER_H, TERM_PAD_Y, TERM_ROW_H, terminalHeightFor, truncateTerminalLine,
} from './data'
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

const tileW = GRID.tileW
const tileH = GRID.tileH

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

// ── Tile grid tunggal: folder & file, dengan `scale` untuk pop-in/shrink-out ──
const GridTile = ({ x, y, scale = 1, item, focused, danger }) => {
  if (!item || x == null || y == null || scale <= 0.01) return null
  const color = COLORS[(item.colorKey || 'read').toUpperCase()] || COLORS.READ
  const isFolder = item.kind === 'folder'
  return (
    <g transform={'translate(' + x + ' ' + y + ') scale(' + scale + ')'}>
      {focused && (
        <rect x={-tileW / 2 - 5} y={-tileH / 2 - 5} width={tileW + 10} height={tileH + 10} rx="16"
          fill="none" stroke={danger ? COLORS.WARNING : COLORS.CREATE} strokeWidth="2" opacity="0.85" />
      )}
      <rect x={-tileW / 2} y={-tileH / 2} width={tileW} height={tileH} rx="14"
        fill={COLORS.PANEL_ALT}
        stroke={danger ? COLORS.DANGER : color}
        strokeWidth={danger ? 2.2 : 1.4} />
      {isFolder ? (
        <g transform="translate(0 -14)"><FolderIcon color={color} /></g>
      ) : (
        <g transform="translate(0 -14)"><DocumentIcon glyph={item.glyph} color={danger ? COLORS.DANGER : color} /></g>
      )}
      <text x="0" y="28" textAnchor="middle" fontFamily="monospace" fontSize="11.5" fill={COLORS.TEXT}>{item.label}</text>
    </g>
  )
}

const NestedBadge = ({ parentX, parentY, label, glyph, state, color = COLORS.CREATE }) => {
  if (state === 'hidden' || parentX == null || parentY == null) return null
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

// ── Panel preview isi file (cat/less/head/tail -f) — overlay zona grid ──
const FilePreviewPanel = ({ preview }) => {
  if (!preview || !preview.visible) return null
  const { mode, filename, lines, moreAbove, moreBelow } = preview
  const panelX = 40
  const panelY = ZONE.GRID.yStart + 6
  const panelW = 652
  const rowH = 20
  const headerH = 30
  const bodyRows = Math.max(lines.length, 1)
  const panelH = headerH + 16 + bodyRows * rowH + 12
  const verb = GUI_VERB[mode]
  return (
    <g transform={'translate(' + panelX + ' ' + panelY + ')'}>
      <rect x="0" y="0" width={panelW} height={panelH} rx="14" fill={COLORS.PANEL} stroke={COLORS.READ} strokeWidth="2" />
      <rect x="0" y="0" width={panelW} height={headerH} rx="14" fill={COLORS.PANEL_ALT} />
      <rect x="0" y={headerH - 14} width={panelW} height="14" fill={COLORS.PANEL_ALT} />
      <circle cx="18" cy={headerH / 2} r="5" fill={COLORS.DANGER} />
      <circle cx="34" cy={headerH / 2} r="5" fill={COLORS.CREATE} />
      <circle cx="50" cy={headerH / 2} r="5" fill={COLORS.SUCCESS} />
      <text x={panelW / 2} y={headerH / 2 + 4} textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill={COLORS.TEXT}>
        {filename + ' — ' + (verb ? verb.text : mode)}
      </text>
      {mode === 'tailf' && (
        <circle cx={panelW - 20} cy={headerH / 2} r="5" fill={COLORS.SUCCESS}>
          <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
        </circle>
      )}
      {moreAbove && (
        <text x={panelW / 2} y={headerH + 14} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>···</text>
      )}
      {lines.map((line, i) => (
        <text key={i} x="20" y={headerH + 24 + i * rowH} fontFamily="monospace" fontSize="12" fill={COLORS.TEXT}>{line}</text>
      ))}
      {moreBelow && (
        <text x={panelW / 2} y={headerH + 20 + bodyRows * rowH} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>···</text>
      )}
    </g>
  )
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

  const [activeIds, setActiveIds] = useState(() => orderIds(INITIAL_IDS))
  const [positions, setPositions] = useState(() => computeGridLayout(orderIds(INITIAL_IDS)))
  const [popScale, setPopScale] = useState({})
  const [preview, setPreview] = useState({ visible: false, mode: '', filename: '', lines: [], moreAbove: false, moreBelow: false })

  const [nestedBadge, setNestedBadge] = useState({ indexHtml: 'hidden', banner: 'hidden' })
  const [warnId, setWarnId] = useState(null)
  const [focusTarget, setFocusTarget] = useState([])
  const [pulse, setPulse] = useState({ active: false, kind: 'dot', progress: 0, verb: '', colorKey: 'create' })
  const [changeBadge, setChangeBadge] = useState({ x: 366, y: 200, label: '', color: COLORS.CREATE, visible: false })

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

    // ── Snapshot layout build-time: diperbarui synchronous selagi jadwal
    // dibangun, dipakai untuk menghitung reflow & posisi badge yang benar. ──
    let liveIds = orderIds(INITIAL_IDS).slice()
    let liveLayout = computeGridLayout(liveIds)

    const badgePositionFor = (id, layoutSnapshot) => {
      const pos = layoutSnapshot && layoutSnapshot[id]
      if (!pos) return { x: 366, y: 200 }
      return { x: pos.x, y: pos.y - tileH / 2 - 22 }
    }

    // item baru pop-in langsung di posisi target barunya; item lama yang
    // posisinya berubah di-tween slide ke posisi baru (reflow).
    const scheduleAddIds = (newRawIds, applyAt, sound) => {
      const prevIds = liveIds.slice()
      const prevLayout = { ...liveLayout }
      const nextIds = orderIds([...liveIds, ...newRawIds])
      const nextLayout = computeGridLayout(nextIds)

      tl.add(() => {
        setActiveIds(nextIds)
        setPositions((prev) => {
          const np = { ...prev }
          nextIds.forEach((id) => {
            if (!prevIds.includes(id)) np[id] = nextLayout[id]
            else if (!np[id]) np[id] = prevLayout[id]
          })
          return np
        })
        setPopScale((prev) => {
          const np = { ...prev }
          nextIds.forEach((id) => { if (!prevIds.includes(id)) np[id] = 0 })
          return np
        })
        if (sound) play(sound)
      }, applyAt)

      prevIds.forEach((id) => {
        const from = prevLayout[id]
        const to = nextLayout[id]
        if (from && to && (from.x !== to.x || from.y !== to.y)) {
          const proxy = { x: from.x, y: from.y }
          tl.to(proxy, {
            x: to.x, y: to.y, duration: 0.45, ease: 'power2.inOut',
            onUpdate: () => setPositions((prev) => ({ ...prev, [id]: { x: proxy.x, y: proxy.y } })),
          }, applyAt)
        }
      })

      newRawIds.forEach((id) => {
        const proxy = { v: 0 }
        tl.to(proxy, {
          v: 1, duration: 0.32, ease: 'back.out(1.6)',
          onUpdate: () => setPopScale((prev) => ({ ...prev, [id]: proxy.v })),
        }, applyAt)
      })

      liveIds = nextIds
      liveLayout = nextLayout
      return { nextLayout }
    }

    // tile shrink dulu (~0.3s), baru dihapus dari array dan sisanya reflow
    // menutup celah.
    const scheduleRemoveId = (id, shrinkAt, sound) => {
      const prevIds = liveIds.slice()
      const prevLayout = { ...liveLayout }
      const nextIds = prevIds.filter((x) => x !== id)
      const nextLayout = computeGridLayout(nextIds)

      tl.add(() => { if (sound) play(sound) }, shrinkAt)
      const shrinkProxy = { v: 1 }
      tl.to(shrinkProxy, {
        v: 0, duration: 0.3, ease: 'power1.in',
        onUpdate: () => setPopScale((prev) => ({ ...prev, [id]: shrinkProxy.v })),
      }, shrinkAt)

      const removeAt = shrinkAt + 0.3
      tl.add(() => {
        setActiveIds(nextIds)
        setPositions((prev) => { const np = { ...prev }; delete np[id]; return np })
        setPopScale((prev) => { const np = { ...prev }; delete np[id]; return np })
        setWarnId(null)
      }, removeAt)

      nextIds.forEach((rid) => {
        const from = prevLayout[rid]
        const to = nextLayout[rid]
        if (from && to && (from.x !== to.x || from.y !== to.y)) {
          const proxy = { x: from.x, y: from.y }
          tl.to(proxy, {
            x: to.x, y: to.y, duration: 0.4, ease: 'power2.inOut',
            onUpdate: () => setPositions((prev) => ({ ...prev, [rid]: { x: proxy.x, y: proxy.y } })),
          }, removeAt)
        }
      })

      liveIds = nextIds
      liveLayout = nextLayout
      return { nextLayout }
    }

    // Modal isi file: cat → semua baris sekaligus; less → window baris
    // bergeser turun bertahap; head → baris awal saja; tail -f → baris baru
    // menyusul satu-satu (live).
    const schedulePreview = (step, applyAt) => {
      const content = PREVIEW_CONTENT[step.previewId]
      if (!content) return
      const mode = step.gui
      const holdExtra = step.holdExtra || 0.6
      const totalLines = content.lines.length
      const headCount = Math.min(4, totalLines)
      const windowSize = Math.min(4, totalLines)

      tl.add(() => {
        if (mode === 'cat') {
          setPreview({ visible: true, mode, filename: content.filename, lines: content.lines, moreAbove: false, moreBelow: false })
        } else if (mode === 'head') {
          setPreview({ visible: true, mode, filename: content.filename, lines: content.lines.slice(0, headCount), moreAbove: false, moreBelow: totalLines > headCount })
        } else if (mode === 'less') {
          setPreview({ visible: true, mode, filename: content.filename, lines: content.lines.slice(0, windowSize), moreAbove: false, moreBelow: totalLines > windowSize })
        } else if (mode === 'tailf') {
          setPreview({ visible: true, mode, filename: content.filename, lines: [], moreAbove: false, moreBelow: false })
        }
      }, applyAt)

      if (mode === 'less' && totalLines > windowSize) {
        const maxStart = totalLines - windowSize
        const proxy = { v: 0 }
        tl.to(proxy, {
          v: maxStart, duration: Math.max(0.3, holdExtra * 0.8), ease: 'none',
          onUpdate: () => {
            const start = Math.round(proxy.v)
            setPreview((prev) => (prev.visible ? {
              ...prev,
              lines: content.lines.slice(start, start + windowSize),
              moreAbove: start > 0,
              moreBelow: start + windowSize < totalLines,
            } : prev))
          },
        }, applyAt + 0.15)
      } else if (mode === 'tailf') {
        const proxy = { v: 0 }
        tl.to(proxy, {
          v: totalLines, duration: Math.max(0.3, holdExtra * 0.9), ease: 'none',
          onUpdate: () => {
            const count = Math.min(totalLines, Math.round(proxy.v))
            setPreview((prev) => (prev.visible ? { ...prev, lines: content.lines.slice(0, count) } : prev))
          },
        }, applyAt + 0.1)
      }

      tl.add(() => setPreview((prev) => ({ ...prev, visible: false })), applyAt + holdExtra + 0.15)
    }

    const markTravelState = (event) => {
      if (event === 'touch') setNestedBadge((p) => ({ ...p, indexHtml: 'creating' }))
      if (event === 'cp') setNestedBadge((p) => ({ ...p, banner: 'creating' }))
    }

    const applyGui = (event) => {
      switch (event) {
        case 'touch': setNestedBadge((p) => ({ ...p, indexHtml: 'ready' })); play(SFX_MAP.POP2); break
        case 'cp': setNestedBadge((p) => ({ ...p, banner: 'ready' })); play(SFX_MAP.COPY); break
        case 'rm-ask': setWarnId('old-draft'); play(SFX_MAP.DENY); break
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
      const initIds = orderIds(INITIAL_IDS)
      setActiveIds(initIds)
      setPositions(computeGridLayout(initIds))
      setPopScale({})
      setPreview({ visible: false, mode: '', filename: '', lines: [], moreAbove: false, moreBelow: false })
      setNestedBadge({ indexHtml: 'hidden', banner: 'hidden' })
      setWarnId(null); setFocusTarget([])
      setPulse({ active: false, kind: 'dot', progress: 0, verb: '', colorKey: 'create' })
      setChangeBadge({ x: 366, y: 200, label: '', color: COLORS.CREATE, visible: false })
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
          const scanSnapshotIds = liveIds.slice()
          tl.add(() => {
            if (step.gui !== 'find') setFocusTarget(step.target || [])
            markTravelState(step.gui)
            setPulse({ active: true, kind: step.gui === 'find' ? 'scan' : 'dot', progress: 0, verb: (verb && verb.text) || '', colorKey: verbColorKey })
          }, travelAt)

          if (step.gui === 'find' && step.target && step.target[0]) {
            const scanIds = scanSnapshotIds.filter((id) => id !== step.target[0])
            const seq = [...scanIds, step.target[0]]
            const stepDur = TRAVEL_DUR / seq.length
            seq.forEach((id, i) => {
              tl.add(() => setFocusTarget([id]), travelAt + i * stepDur)
            })
          }

          const pulseObj = { v: 0 }
          tl.to(pulseObj, {
            v: 1, duration: TRAVEL_DUR, ease: 'power1.inOut',
            onUpdate: () => setPulse((p) => ({ ...p, progress: pulseObj.v })),
          }, travelAt)

          const applyAt = travelAt + TRAVEL_DUR
          let stepLayoutForBadge = { ...liveLayout }

          if (step.gui === 'mkdir') {
            const result = scheduleAddIds(['src', 'assets'], applyAt, SFX_MAP.POP)
            stepLayoutForBadge = result.nextLayout
          } else if (step.gui === 'mv') {
            const result = scheduleAddIds(['readme'], applyAt, SFX_MAP.MOVE)
            stepLayoutForBadge = result.nextLayout
          } else if (step.gui === 'cat' || step.gui === 'less' || step.gui === 'head' || step.gui === 'tailf') {
            schedulePreview(step, applyAt)
            tl.add(() => applyGui(step.gui), applyAt)
          } else {
            tl.add(() => { if (step.gui) applyGui(step.gui) }, applyAt)
          }
          tl.add(() => setPulse((p) => ({ ...p, active: false })), applyAt)

          const explainAt = applyAt + APPLY_DUR
          tl.add(() => {
            if (badgeLabel) {
              const targetId = (step.target || [])[0]
              const pos = badgePositionFor(targetId, stepLayoutForBadge)
              setChangeBadge({ x: pos.x, y: pos.y, label: badgeLabel, color: COLORS[verbColorKey.toUpperCase()], visible: true })
            }
          }, explainAt)

          cursor = explainAt + EXPLAIN_BASE + (step.holdExtra || 0)
          if (!keepFocus) {
            tl.add(() => { setFocusTarget([]); setChangeBadge((c) => ({ ...c, visible: false })) }, cursor - 0.12)
          }
        } else if (step.full && step.kind === 'out') {
          tl.add(() => { addLine(step.text, step.color) }, cursor)
          const applyAt = cursor + 0.22
          let stepLayoutForBadge = { ...liveLayout }
          if (step.gui === 'rm-confirm') {
            const result = scheduleRemoveId('old-draft', applyAt, SFX_MAP.CONFIRM)
            stepLayoutForBadge = result.nextLayout
          } else {
            tl.add(() => { if (step.gui) applyGui(step.gui) }, applyAt)
          }
          const explainAt = applyAt + APPLY_DUR
          tl.add(() => {
            if (badgeLabel) {
              const targetId = (step.target || [])[0]
              const pos = badgePositionFor(targetId, stepLayoutForBadge)
              setChangeBadge({ x: pos.x, y: pos.y, label: badgeLabel, color: COLORS[verbColorKey.toUpperCase()], visible: true })
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

            {/* File grid — zona 92-468, grid dinamis: item hanya dirender kalau aktif */}
            <g>
              <rect x="0" y={ZONE.GRID.yStart} width="732" height={ZONE.GRID.yEnd - ZONE.GRID.yStart} rx="16" fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth="1.5" />
              <GridToolbar count={activeIds.length} />

              {activeIds.map((id) => {
                const item = FILE_CATALOG[id]
                const pos = positions[id]
                if (!item || !pos) return null
                const scale = popScale[id] ?? 1
                return (
                  <GridTile key={id} x={pos.x} y={pos.y} scale={scale} item={item}
                    focused={isFocused(id)} danger={warnId === id} />
                )
              })}

              {positions.src && (
                <NestedBadge parentX={positions.src.x} parentY={positions.src.y}
                  label={NESTED_BADGE.INDEX_HTML.label} glyph="html" state={nestedBadge.indexHtml} color={COLORS.CREATE} />
              )}
              {positions.assets && (
                <NestedBadge parentX={positions.assets.x} parentY={positions.assets.y}
                  label={NESTED_BADGE.BANNER.label} glyph="image" state={nestedBadge.banner} color={COLORS.COPY} />
              )}

              <FilePreviewPanel preview={preview} />
            </g>

            {/* Motion corridor — zona 495-615, satu motion aktif */}
            <CommandPulse pulse={pulse} />
            <ChangeBadge x={changeBadge.x} y={changeBadge.y} label={changeBadge.label} color={changeBadge.color} visible={changeBadge.visible} />

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
