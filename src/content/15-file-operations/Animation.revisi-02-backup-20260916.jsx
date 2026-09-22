// src/content/27-file-operations/Animation.jsx
// Eksekusi revisi-02 (2026-09-16) — lihat revisi/2026-09-16-revisi-02-merged-file-workflow.md
// File manager SELALU di atas, terminal ringkas di bawah. Terminal melebar
// sementara untuk less/tail -f/find, lalu kembali pendek pada beat berikutnya.
import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, LABELS, CAPTIONS, SFX_MAP, TERMINAL_STEPS, LINE_COLOR,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  PROJECT_PATH,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
} from '../../shared/scene-ui/v1'

const HISTORY_VISIBLE_DEFAULT = 4
const HISTORY_VISIBLE_EXPANDED = 8
const TERM_DEFAULT_H = 120
const TERM_EXPANDED_H = 235

const CAPTION_BY_CMD = {
  '$ mkdir -p src assets': CAPTIONS.MKDIR,
  '$ touch src/index.html': CAPTIONS.TOUCH,
  '$ cp ~/Downloads/banner-draft.png assets/banner.png': CAPTIONS.CP,
  '$ mv ~/Documents/brief.txt README.md': CAPTIONS.MV,
  '$ rm -i old-draft.txt': CAPTIONS.RM_ASK,
  'rm: remove old-draft.txt? y': CAPTIONS.RM_CONFIRM,
  '$ cat README.md': CAPTIONS.CAT,
  '$ less CHANGELOG.md': CAPTIONS.LESS,
  '$ head config.ini': CAPTIONS.HEAD,
  '$ tail -f app.log': CAPTIONS.TAILF,
  '$ find . -name "banner.png"': CAPTIONS.FIND,
  '$ locate banner.png': CAPTIONS.LOCATE,
}

const BEAM_LABEL = {
  mkdir: { text: 'mkdir -p \u2014 folder baru', color: COLORS.CREATE },
  touch: { text: 'touch \u2014 file kosong', color: COLORS.CREATE },
  cp: { text: 'cp \u2014 salinan baru, asal tetap ada', color: COLORS.COPY },
  mv: { text: 'mv \u2014 objek sama, alamat baru', color: COLORS.MOVE },
  'rm-ask': { text: 'rm -i \u2014 menunggu konfirmasi', color: COLORS.DANGER },
  'rm-confirm': { text: 'rm -i \u2014 dihapus setelah y', color: COLORS.DANGER },
  cat: { text: 'cat \u2014 tampil singkat', color: COLORS.READ },
  less: { text: 'less \u2014 baca bertahap', color: COLORS.READ },
  head: { text: 'head \u2014 baris awal saja', color: COLORS.READ },
  tailf: { text: 'tail -f \u2014 ikuti baris baru', color: COLORS.READ },
  find: { text: 'find \u2014 scan folder langsung', color: COLORS.FIND },
  locate: { text: 'locate \u2014 baca indeks tersimpan', color: COLORS.FIND },
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
  const [caption, setCaption] = useState('')
  const [pop, setPop] = useState({})
  const [history, setHistory] = useState([])

  const [files, setFiles] = useState({
    src: false, assets: false, indexHtml: false, banner: false,
    readme: false, oldDraftDeleted: false,
  })
  const [activeGui, setActiveGui] = useState(null)
  const [terminalExpanded, setTerminalExpanded] = useState(false)
  const [findScan, setFindScan] = useState(0)

  const P = (id) => pop[id] || { opacity: 0, scale: 0, x: 0, y: 0 }
  const play = (entry) => {
    if (!audioUnlockedRef.current || !entry) return
    sfxLoader.play(entry.category, entry.name, {
      volume: volumeRef.current,
      speed: speedRef.current,
    })
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
    window.__flushSync = flushSync

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

    const addLine = (text, colorKey) => {
      setHistory((prev) => [...prev, { text, colorKey }].slice(-40))
    }

    const applyGui = (event) => {
      setActiveGui(event)
      switch (event) {
        case 'mkdir': setFiles((p) => ({ ...p, src: true, assets: true })); play(SFX_MAP.POP); break
        case 'touch': setFiles((p) => ({ ...p, indexHtml: true })); play(SFX_MAP.POP2); break
        case 'cp': setFiles((p) => ({ ...p, banner: true })); setTerminalExpanded(false); play(SFX_MAP.COPY); break
        case 'mv': setFiles((p) => ({ ...p, readme: true })); setTerminalExpanded(false); play(SFX_MAP.MOVE); break
        case 'rm-ask': setTerminalExpanded(false); play(SFX_MAP.DENY); break
        case 'rm-confirm': setFiles((p) => ({ ...p, oldDraftDeleted: true })); play(SFX_MAP.CONFIRM); break
        case 'cat': setTerminalExpanded(false); play(SFX_MAP.OPEN); break
        case 'less': setTerminalExpanded(true); play(SFX_MAP.SCROLL); break
        case 'head': setTerminalExpanded(false); play(SFX_MAP.OPEN); break
        case 'tailf': setTerminalExpanded(true); play(SFX_MAP.STREAM); break
        case 'find': setTerminalExpanded(true); setFindScan(0); play(SFX_MAP.SCAN); break
        case 'locate': setTerminalExpanded(false); play(SFX_MAP.CATALOG); break
        default: break
      }
    }

    tl.add(() => {
      setPhaseIdx(0); setMorphP(0); setContentStarted(false)
      setCaption(''); setPop({}); setHistory([])
      setFiles({ src: false, assets: false, indexHtml: false, banner: false, readme: false, oldDraftDeleted: false })
      setActiveGui(null); setTerminalExpanded(false); setFindScan(0)
    }, 0)

    const morph = { p: 0 }
    tl.to(morph, { p: 1, duration: 0.9, ease: 'power3.inOut', onUpdate: () => setMorphP(morph.p) }, 0.25)

    tl.add(() => { setContentStarted(true); play(SFX_MAP.CATALOG) }, 1.15)
    tl.add(() => setPop((prev) => ({ ...prev, terminal: { opacity: 1, scale: 1, x: 0, y: 0 } })), 1.15)
    tl.add(() => setPop((prev) => ({ ...prev, 'narration-bubble': { opacity: 1, scale: 1, x: 0, y: 0 } })), 1.15)
    tl.add(() => setPop((prev) => ({ ...prev, filemanager: { opacity: 1, scale: 1, x: 0, y: 0 } })), 1.15)

    const INTRO_DELAY = 1.15
    const actStart = [0, 0, 0, 0]
    actStart[0] = INTRO_DELAY
    for (let i = 1; i < 4; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    // Scheduler generik: tiap step = satu baris terminal. Step dengan
    // `gui: 'find'` juga mendapat tween progress scan 0..1 (findScan).
    const scheduleAct = (actIdx, startAt) => {
      let cursor = startAt + 0.25
      tl.add(() => setPhaseIdx(actIdx), startAt)
      const steps = TERMINAL_STEPS.filter((s) => s.act === actIdx)
      steps.forEach((step) => {
        tl.add(() => {
          addLine(step.text, step.color)
          if (step.kind === 'cmd') play(SFX_MAP.TICK)
          if (CAPTION_BY_CMD[step.text]) setCaption(CAPTION_BY_CMD[step.text])
          if (step.gui) applyGui(step.gui)
        }, cursor)
        if (step.gui === 'find') {
          const scan = { v: 0 }
          tl.to(scan, {
            v: 1, duration: Math.max(0.6, (step.holdExtra || 1) - 0.2), ease: 'power1.inOut',
            onUpdate: () => setFindScan(scan.v),
          }, cursor + 0.1)
        }
        cursor += (step.kind === 'cmd' ? 0.95 : 0.7) + (step.holdExtra || 0)
      })
      return cursor
    }

    scheduleAct(0, actStart[0])
    scheduleAct(1, actStart[1])
    scheduleAct(2, actStart[2])
    const endAct3 = scheduleAct(3, actStart[3])

    popIn(endAct3 + 0.3, 'takeaway', SFX_MAP.SAVE)
    tl.add(() => setCaption(CAPTIONS.TAKEAWAY), endAct3 + 0.35)
    tl.to({}, { duration: 0.01 }, endAct3 + 2.9)

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
    if (paused) tl.pause()
    else tl.resume()
  }, [paused, speed])

  const transform = (id, x, y) => {
    const p = P(id)
    return 'translate(' + (x + p.x) + ' ' + (y + p.y) + ') scale(' + p.scale + ')'
  }

  const termH = terminalExpanded ? TERM_EXPANDED_H : TERM_DEFAULT_H
  const historyVisible = terminalExpanded ? HISTORY_VISIBLE_EXPANDED : HISTORY_VISIBLE_DEFAULT
  const visibleHistory = history.slice(-historyVisible)

  const FileChip = ({ x, y, label, color = COLORS.CREATE, dim, ghost, w = 128 }) => (
    <g transform={'translate(' + x + ' ' + y + ')'} opacity={ghost ? 0.18 : dim ? 0.32 : 1}>
      <rect x={-w / 2} y="-16" width={w} height="32" rx="8" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="1.5" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={color}>{label}</text>
    </g>
  )

  const beam = BEAM_LABEL[activeGui] || null
  const pTerminal = P('terminal')
  const pNarration = P('narration-bubble')
  const pFileManager = P('filemanager')
  const pTakeaway = P('takeaway')

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
          { label: INTRO_DOMAIN, color: COLORS.CREATE },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.CREATE },
          { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
        ]}
        subtitle={INTRO_SUBTITLE}
        testId="file-operations-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="file-operations-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="file-operations-body">
          <g>
            {/* Caption — y 30-95 */}
            <g opacity={pNarration.opacity} transform={transform('narration-bubble', 366, 62)}>
              <rect x="-300" y="-28" width="600" height="56" rx="20" fill={COLORS.PANEL} stroke={PHASES[phaseIdx].badgeColor} strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fontSize="14" fontWeight="700" fill={COLORS.TEXT}>{caption}</text>
            </g>

            {/* GUI file manager — SELALU DI ATAS, y 115-505 */}
            <g opacity={pFileManager.opacity} transform={transform('filemanager', 0, 0)}>
              <rect x="0" y="115" width="732" height="390" rx="16" fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth="1.5" />
              <text x="366" y="142" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.MUTED}>{PROJECT_PATH}</text>

              <FileChip x={105} y={190} label={LABELS.SRC} color={COLORS.CREATE} dim={!files.src} />
              <FileChip x={279} y={190} label={LABELS.ASSETS} color={COLORS.CREATE} dim={!files.assets} />
              <FileChip x={453} y={190} label={LABELS.README} color={COLORS.MOVE} dim={!files.readme} />
              <FileChip x={627} y={190} label={LABELS.CHANGELOG} color={COLORS.READ} />

              <FileChip x={192} y={252} label={LABELS.CONFIG} color={COLORS.READ} />
              <FileChip x={366} y={252} label={LABELS.APP_LOG} color={COLORS.READ} />
              <FileChip x={540} y={252} label={LABELS.OLD_DRAFT} color={COLORS.DANGER} ghost={files.oldDraftDeleted} />

              <FileChip x={105} y={230} w={104} label={LABELS.INDEX_HTML} color={COLORS.CREATE} dim={!files.indexHtml} />
              <FileChip x={279} y={230} w={104} label={LABELS.BANNER} color={COLORS.COPY} dim={!files.banner} />

              {/* Preview / before-after kontekstual — y 300-495 */}
              {activeGui === 'cp' && (
                <g>
                  <text x="200" y="330" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>Downloads/banner-draft.png</text>
                  <rect x="140" y="345" width="120" height="30" rx="7" fill={COLORS.PANEL_ALT} stroke={COLORS.COPY} strokeWidth="1.5" opacity="0.6" />
                  <text x="200" y="365" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.COPY}>banner-draft.png</text>
                  <text x="366" y="365" textAnchor="middle" fontSize="18" fill={COLORS.COPY}>{'\u2192'}</text>
                  <text x="532" y="330" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>assets/banner.png</text>
                  <rect x="472" y="345" width="120" height="30" rx="7" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="2" />
                  <text x="532" y="365" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.SUCCESS}>banner.png</text>
                  <text x="366" y="410" textAnchor="middle" fontSize="12" fill={COLORS.MUTED}>sumber tetap ada — cp membuat salinan</text>
                </g>
              )}

              {activeGui === 'mv' && (
                <g>
                  <text x="200" y="330" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>Documents/brief.txt</text>
                  <rect x="140" y="345" width="120" height="30" rx="7" fill={COLORS.PANEL_ALT} stroke={COLORS.MOVE} strokeWidth="1.5" opacity="0.3" />
                  <text x="200" y="365" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.MOVE} opacity="0.5">brief.txt</text>
                  <text x="366" y="365" textAnchor="middle" fontSize="18" fill={COLORS.MOVE}>{'\u2192'}</text>
                  <text x="532" y="330" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>README.md</text>
                  <rect x="472" y="345" width="120" height="30" rx="7" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="2" />
                  <text x="532" y="365" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.SUCCESS}>README.md</text>
                  <text x="366" y="410" textAnchor="middle" fontSize="12" fill={COLORS.MUTED}>slot asal kosong — objek sama pindah alamat</text>
                </g>
              )}

              {activeGui === 'rm-ask' && (
                <g>
                  <rect x="166" y="315" width="400" height="90" rx="10" fill={COLORS.PANEL_ALT} stroke={COLORS.DANGER} strokeWidth="1.5" />
                  <text x="186" y="338" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT}>{'\u2713'} cek nama file</text>
                  <text x="186" y="358" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT}>{'\u2713'} cek folder aktif</text>
                  <text x="366" y="392" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill={COLORS.DANGER}>old-draft.txt — menunggu (y/N)</text>
                </g>
              )}

              {activeGui === 'rm-confirm' && (
                <g>
                  <rect x="216" y="330" width="300" height="60" rx="10" fill={COLORS.PANEL_ALT} stroke={COLORS.DANGER} strokeWidth="1.5" opacity="0.6" />
                  <text x="366" y="356" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12.5" fill={COLORS.SUCCESS}>y — old-draft.txt dihapus</text>
                  <text x="366" y="376" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>arsip lain tidak terpengaruh</text>
                </g>
              )}

              {activeGui === 'cat' && (
                <g>
                  <rect x="166" y="320" width="400" height="70" rx="10" fill={COLORS.PANEL_ALT} stroke={COLORS.READ} strokeWidth="1.5" />
                  <text x="186" y="344" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT}># Website Demo</text>
                  <text x="186" y="364" fontFamily="monospace" fontSize="10.5" fill={COLORS.MUTED}>Brief singkat project ini...</text>
                </g>
              )}

              {activeGui === 'less' && (
                <g>
                  <rect x="146" y="315" width="420" height="90" rx="10" fill={COLORS.PANEL_ALT} stroke={COLORS.READ} strokeWidth="1.5" />
                  <text x="166" y="338" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT}>## v0.3.0 — perubahan terbaru</text>
                  <text x="166" y="358" fontFamily="monospace" fontSize="10.5" fill={COLORS.MUTED}>- perbaikan tampilan header</text>
                  <text x="366" y="392" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.READ}>{'\u22ee'} lanjut ke bawah</text>
                  <rect x="556" y="318" width="6" height="84" rx="3" fill={COLORS.BORDER} />
                  <rect x="556" y="318" width="6" height="28" rx="3" fill={COLORS.READ} />
                </g>
              )}

              {activeGui === 'head' && (
                <g>
                  <rect x="166" y="315" width="400" height="90" rx="10" fill={COLORS.PANEL_ALT} stroke={COLORS.READ} strokeWidth="1.5" />
                  <text x="186" y="338" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT}>[server]</text>
                  <text x="186" y="356" fontFamily="monospace" fontSize="10.5" fill={COLORS.TEXT}>port = 8080</text>
                  <text x="186" y="374" fontFamily="monospace" fontSize="10.5" fill={COLORS.TEXT}>host = localhost</text>
                  <text x="186" y="394" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>... (baris berikutnya tidak ditampilkan)</text>
                </g>
              )}

              {activeGui === 'tailf' && (
                <g>
                  <rect x="166" y="315" width="400" height="90" rx="10" fill={COLORS.PANEL_ALT} stroke={COLORS.READ} strokeWidth="1.5" />
                  <text x="186" y="338" fontFamily="monospace" fontSize="10.5" fill={COLORS.TEXT}>2026-09-16 10:02 GET /index 200</text>
                  <text x="186" y="356" fontFamily="monospace" fontSize="10.5" fill={COLORS.TEXT}>2026-09-16 10:02 GET /assets 200</text>
                  <circle cx="192" cy="378" r="4" fill={COLORS.SUCCESS} />
                  <text x="204" y="382" fontFamily="monospace" fontSize="10.5" fill={COLORS.SUCCESS}>LIVE — mengikuti baris baru</text>
                </g>
              )}

              {activeGui === 'find' && (
                <g>
                  <text x="366" y="330" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>memindai folder nyata</text>
                  <rect x="120" y="345" width="492" height="10" rx="5" fill={COLORS.PANEL_ALT} stroke={COLORS.BORDER} />
                  <rect x="120" y="345" width={492 * findScan} height="10" rx="5" fill={COLORS.FIND} />
                  <text x="366" y="380" textAnchor="middle" fontFamily="monospace" fontSize="12"
                    fill={findScan >= 0.95 ? COLORS.SUCCESS : COLORS.FIND}>
                    {findScan >= 0.95 ? 'ditemukan: ./assets/banner.png' : 'mencari...'}
                  </text>
                </g>
              )}

              {activeGui === 'locate' && (
                <g>
                  <rect x="216" y="330" width="300" height="60" rx="10" fill={COLORS.PANEL_ALT} stroke={COLORS.FIND} strokeWidth="1.5" />
                  <text x="366" y="352" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.FIND}>index: assets/banner.png</text>
                  <text x="366" y="374" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.MUTED}>indeks bisa tertinggal dari isi folder</text>
                </g>
              )}
            </g>

            {/* Lane benang command — y 525-675 */}
            {beam && (
              <g transform="translate(366 600)">
                <rect x="-280" y="-24" width="560" height="48" rx="24" fill={COLORS.PANEL_ALT} stroke={beam.color} strokeWidth="1.5" />
                <text x="0" y="6" textAnchor="middle" fontFamily="monospace" fontSize="12.5" fontWeight="700" fill={beam.color}>{beam.text}</text>
              </g>
            )}

            {/* Terminal — SELALU DI BAWAH, y mulai 705, tinggi default 120 / expanded 235 */}
            <g opacity={pTerminal.opacity} transform={transform('terminal', 366, 705 + termH / 2)}>
              <rect x="-320" y={-termH / 2} width="640" height={termH} rx="16" fill={COLORS.PANEL_ALT} stroke={COLORS.READ} strokeWidth="2" />
              <circle cx="-296" cy={-termH / 2 + 22} r="6" fill={COLORS.DANGER} />
              <circle cx="-276" cy={-termH / 2 + 22} r="6" fill={COLORS.CREATE} />
              <circle cx="-256" cy={-termH / 2 + 22} r="6" fill={COLORS.SUCCESS} />
              <text x="296" y={-termH / 2 + 27} textAnchor="end" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.SUCCESS}>{PROJECT_PATH}</text>
              <line x1="-296" y1={-termH / 2 + 38} x2="296" y2={-termH / 2 + 38} stroke={COLORS.BORDER} strokeWidth="1" />
              {visibleHistory.map((line, i) => {
                const recent = i >= visibleHistory.length - 3
                const y = -termH / 2 + 62 + i * 22
                return (
                  <text key={i} x="-296" y={y} fontFamily="monospace"
                    fontSize={recent ? 13 : 11.5}
                    opacity={recent ? 0.98 : 0.32}
                    fill={LINE_COLOR[line.colorKey] || COLORS.TEXT}>{line.text}</text>
                )
              })}
            </g>

            {/* Takeaway — y 850-925 */}
            <g opacity={pTakeaway.opacity} transform={transform('takeaway', 366, 887)}>
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
