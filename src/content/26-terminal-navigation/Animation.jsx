// REVISI-02 (2026-09-13) — lihat revisi/2026-09-13-revisi-02-real-terminal-workflows.md
import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, LABELS, CAPTIONS, SFX_MAP, TERMINAL_STEPS, LINE_COLOR,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
} from '../../shared/scene-ui/v1'

const HISTORY_VISIBLE = 8

export default function TerminalNavigationAnimation({
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
  const [promptPath, setPromptPath] = useState('~')

  // Act 1 — folder yang lagi disorot di rute
  const [routeFolder, setRouteFolder] = useState(null) // 'downloads' | 'projects' | null

  // Act 2 — struktur workspace yang sudah dibuat
  const [tree, setTree] = useState({ src: false, assets: false, readme: false, gitignore: false, showHidden: false })

  // Act 3 — status kelola & edit file
  const [manage, setManage] = useState({ cp: false, mv: false, read: false, edit: false, rmAsk: false, rmDone: false })

  // Act 4 — status workflow (package shelf → chain && → chain ;)
  const [workflowStage, setWorkflowStage] = useState(null) // 'package' | 'chain-and' | 'chain-semi'
  const [chainAndStep, setChainAndStep] = useState(0)
  const [chainSemiStep, setChainSemiStep] = useState(0)

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
        v: 1,
        duration: 0.42,
        ease: 'back.out(1.55)',
        onStart: () => play(entry),
        onUpdate: () => setPop((prev) => ({
          ...prev,
          [id]: { opacity: Math.min(1, obj.v * 1.4), scale: obj.v, x: 0, y: fromY * (1 - obj.v) },
        })),
      }, at)
    }

    const addLine = (text, colorKey) => {
      setHistory((prev) => [...prev, { text, colorKey }].slice(-40))
    }

    const applyGui = (event) => {
      switch (event) {
        case 'cd-downloads': setRouteFolder('downloads'); setPromptPath('~/Downloads'); play(SFX_MAP.SWOOSH); break
        case 'cd-up': setRouteFolder(null); setPromptPath('~'); play(SFX_MAP.SWOOSH); break
        case 'cd-home': setRouteFolder(null); setPromptPath('~'); play(SFX_MAP.SWOOSH); break
        case 'cd-projects': setRouteFolder('projects'); setPromptPath('~/Projects'); play(SFX_MAP.SWOOSH); break
        case 'mkdir': setTree((p) => ({ ...p, src: true, assets: true })); play(SFX_MAP.POP); break
        case 'cd-landing': setPromptPath('~/Projects/landing-page'); play(SFX_MAP.SWOOSH); break
        case 'touch': setTree((p) => ({ ...p, readme: true, gitignore: true })); play(SFX_MAP.POP2); break
        case 'ls-la': setTree((p) => ({ ...p, showHidden: true })); play(SFX_MAP.TICK); break
        case 'cp': setManage((p) => ({ ...p, cp: true })); play(SFX_MAP.COPY); break
        case 'mv': setManage((p) => ({ ...p, mv: true })); play(SFX_MAP.RENAME); break
        case 'read': setManage((p) => ({ ...p, read: true })); play(SFX_MAP.POP); break
        case 'edit': setManage((p) => ({ ...p, edit: true, read: false })); play(SFX_MAP.POP2); break
        case 'rm-ask': setManage((p) => ({ ...p, edit: false, rmAsk: true })); play(SFX_MAP.DENY); break
        case 'rm-confirm': setManage((p) => ({ ...p, rmAsk: false, rmDone: true })); play(SFX_MAP.CONFIRM); break
        case 'apt': setWorkflowStage('package'); play(SFX_MAP.PACKAGE); break
        case 'chain-and': setWorkflowStage('chain-and'); play(SFX_MAP.TICK); break
        case 'chain-semi': setWorkflowStage('chain-semi'); play(SFX_MAP.TICK); break
        default: break
      }
    }

    const CAPTION_BY_CMD = {
      '$ pwd': CAPTIONS.PWD,
      '$ ls': CAPTIONS.LS,
      '$ cd Downloads': CAPTIONS.CD_DOWNLOADS,
      '$ cd ..': CAPTIONS.CD_UP,
      '$ cd ~': CAPTIONS.CD_HOME,
      '$ cd Projects': CAPTIONS.CD_HOME,
      '$ mkdir -p landing-page/{src,assets}': CAPTIONS.MKDIR,
      '$ touch README.md .gitignore': CAPTIONS.TOUCH,
      '$ ls -la': CAPTIONS.LS_LA,
      '$ cp ~/Downloads/screenshot-draft.png assets/': CAPTIONS.CP,
      '$ mv ~/Documents/brief.txt README.md': CAPTIONS.MV,
      '$ cat README.md': CAPTIONS.READ,
      '$ nano README.md': CAPTIONS.EDIT,
      '$ rm -i old-draft.txt': CAPTIONS.RM,
      '$ sudo apt install ripgrep': CAPTIONS.APT,
      '$ mkdir demo && cd demo && touch notes.txt': CAPTIONS.AND,
      '$ pwd; ls': CAPTIONS.SEMI,
    }

    tl.add(() => {
      setPhaseIdx(0)
      setMorphP(0)
      setContentStarted(false)
      setCaption('')
      setPop({})
      setHistory([])
      setPromptPath('~')
      setRouteFolder(null)
      setTree({ src: false, assets: false, readme: false, gitignore: false, showHidden: false })
      setManage({ cp: false, mv: false, read: false, edit: false, rmAsk: false, rmDone: false })
      setWorkflowStage(null)
      setChainAndStep(0)
      setChainSemiStep(0)
    }, 0)

    const morph = { p: 0 }
    tl.to(morph, {
      p: 1, duration: 0.9, ease: 'power3.inOut',
      onUpdate: () => setMorphP(morph.p),
    }, 0.25)
    tl.add(() => { setContentStarted(true); play(SFX_MAP.PACKAGE) }, 1.15)
    popIn(1.25, 'terminal', SFX_MAP.POP)
    popIn(1.30, 'narration-bubble', SFX_MAP.POP2)

    const INTRO_DELAY = 1.15
    const actStart = [0, 0, 0, 0]
    actStart[0] = INTRO_DELAY
    for (let i = 1; i < 4; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    // ── Scheduler generik untuk Act 1–3 (setiap step = satu baris terminal) ──
    const scheduleLinearAct = (actIdx, startAt) => {
      let cursor = startAt + 0.25
      tl.add(() => setPhaseIdx(actIdx), startAt)
      const steps = TERMINAL_STEPS.filter((s) => s.act === actIdx)
      steps.forEach((step) => {
        const colorKey = step.color
        tl.add(() => {
          addLine(step.text, colorKey)
          if (step.kind === 'cmd') play(SFX_MAP.TICK)
          if (CAPTION_BY_CMD[step.text]) setCaption(CAPTION_BY_CMD[step.text])
          if (step.gui) applyGui(step.gui)
        }, cursor)
        cursor += step.kind === 'cmd' ? 0.95 : 0.7
      })
      return cursor
    }

    // Act 1–3 pakai scheduler generik.
    scheduleLinearAct(0, actStart[0])
    scheduleLinearAct(1, actStart[1])
    scheduleLinearAct(2, actStart[2])

    // ── Act 4 — custom: package shelf → chain "&&" (berurutan) → chain ";" (independen) ──
    tl.add(() => setPhaseIdx(3), actStart[3])
    let t4 = actStart[3] + 0.25
    tl.add(() => {
      addLine('$ sudo apt install ripgrep', 'package')
      setCaption(CAPTIONS.APT)
      applyGui('apt')
    }, t4)
    t4 += 1.0
    tl.add(() => addLine('(contoh Debian/Ubuntu — distro lain beda)', 'muted'), t4)
    t4 += 1.4

    tl.add(() => {
      addLine('$ mkdir demo && cd demo && touch notes.txt', 'chain')
      setCaption(CAPTIONS.AND)
      applyGui('chain-and')
      setChainAndStep(1)
      play(SFX_MAP.CHAIN_TICK)
    }, t4)
    t4 += 0.55
    tl.add(() => { setChainAndStep(2); play(SFX_MAP.CHAIN_TICK) }, t4)
    t4 += 0.55
    tl.add(() => { setChainAndStep(3); play(SFX_MAP.SAVE) }, t4)
    t4 += 1.1

    tl.add(() => {
      addLine('$ pwd; ls', 'chain')
      setCaption(CAPTIONS.SEMI)
      applyGui('chain-semi')
      setChainSemiStep(1)
      play(SFX_MAP.CHAIN_TICK)
    }, t4)
    t4 += 0.5
    tl.add(() => {
      addLine('.../demo', 'muted')
      setChainSemiStep(2)
      play(SFX_MAP.CHAIN_TICK)
    }, t4)
    t4 += 0.45
    tl.add(() => addLine('notes.txt', 'muted'), t4)
    t4 += 0.9
    popIn(t4, 'takeaway', SFX_MAP.SAVE)
    tl.add(() => setCaption(CAPTIONS.TAKEAWAY), t4 + 0.05)

    tl.to({}, { duration: 0.01 }, t4 + 2.6)

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

  const visibleHistory = history.slice(-HISTORY_VISIBLE)

  const FolderCard = ({ x, y, label, active }) => (
    <g transform={'translate(' + x + ' ' + y + ')'}>
      <path d="M-58 -18 h40 l10 12 h62 v48 h-112 z" fill={COLORS.PANEL_ALT} stroke={active ? COLORS.SUCCESS : COLORS.NAV} strokeWidth={active ? 3 : 2} />
      <path d="M-58 -18 h40 l10 12 h-50 z" fill={active ? COLORS.SUCCESS : COLORS.NAV} opacity="0.32" />
      <text x="0" y="24" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={active ? COLORS.SUCCESS : COLORS.TEXT}>{label}</text>
    </g>
  )

  const FileChip = ({ x, y, label, dim, color = COLORS.MODIFY }) => (
    <g transform={'translate(' + x + ' ' + y + ')'} opacity={dim ? 0.4 : 1}>
      <rect x="-56" y="-16" width="112" height="32" rx="8" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="1.5" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontSize="11.5" fill={color}>{label}</text>
    </g>
  )

  const pTerminal = P('terminal')
  const pNarration = P('narration-bubble')
  const pTakeaway = P('takeaway')

  return (
    <svg viewBox={'0 0 ' + VW + ' ' + VH} style={{
      width: '100%', height: '100%', maxHeight: '100vh',
      maxWidth: 'calc(100vh * ' + VW + ' / ' + VH + ')',
      background: COLORS.BG, userSelect: 'none',
    }}>
      <defs>
        <filter id="terminal-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width={VW} height={VH} fill={COLORS.BG} />

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.NAV },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.NAV },
          { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
        ]}
        titleLines={[
          [{ label: 'TERMINAL', color: COLORS.NAV }],
          [{ label: 'NAVIGATION', color: COLORS.SUCCESS }],
        ]}
        subtitle={INTRO_SUBTITLE}
        titleFilter="url(#terminal-glow)"
        testId="terminal-navigation-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="terminal-navigation-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="terminal-navigation-body">
          <g>
            <g opacity={pNarration.opacity} transform={transform('narration-bubble', 366, 75)}>
              <rect x="-260" y="-32" width="520" height="64" rx="22" fill={COLORS.PANEL} stroke={PHASES[phaseIdx].badgeColor} strokeWidth="1.5" />
              <path d="M-40 32 l-14 18 l36 -18 z" fill={COLORS.PANEL} stroke={PHASES[phaseIdx].badgeColor} strokeWidth="1.5" />
              <text x="0" y="7" textAnchor="middle" fontSize="15" fontWeight="700" fill={COLORS.TEXT}>{caption}</text>
            </g>

            {/* Terminal — persistent, history bergulir maksimum 8 baris */}
            <g opacity={pTerminal.opacity} transform={transform('terminal', 366, 300)}>
              <rect x="-320" y="-160" width="640" height="320" rx="18" fill={COLORS.PANEL_ALT} stroke={COLORS.NAV} strokeWidth="2" />
              <circle cx="-296" cy="-136" r="6" fill={COLORS.DANGER} />
              <circle cx="-276" cy="-136" r="6" fill={COLORS.MODIFY} />
              <circle cx="-256" cy="-136" r="6" fill={COLORS.SUCCESS} />
              <text x="296" y="-131" textAnchor="end" fontFamily="monospace" fontWeight="700" fontSize="14" fill={COLORS.SUCCESS}>{promptPath}</text>
              <line x1="-296" y1="-112" x2="296" y2="-112" stroke={COLORS.BORDER} strokeWidth="1" />
              {visibleHistory.map((line, i) => {
                const recent = i >= visibleHistory.length - 5
                const y = -78 + i * 24
                return (
                  <text key={i} x="-296" y={y} fontFamily="monospace"
                    fontSize={recent ? 14 : 12}
                    opacity={recent ? 0.98 : 0.32}
                    fill={LINE_COLOR[line.colorKey] || COLORS.TEXT}>{line.text}</text>
                )
              })}
            </g>

            {/* ── GUI Act 1 — folder row, disorot sesuai cd aktif ── */}
            {phaseIdx === 0 && (
              <g transform="translate(0 600)">
                <FolderCard x={150} y={0} label={LABELS.DOWNLOADS} active={routeFolder === 'downloads'} />
                <FolderCard x={366} y={0} label={LABELS.DOCUMENTS} active={false} />
                <FolderCard x={582} y={0} label={LABELS.PROJECTS} active={routeFolder === 'projects'} />
                <text x="366" y="70" textAnchor="middle" fontFamily="monospace" fontSize="13" fill={COLORS.MUTED}>
                  Breadcrumb: {promptPath}
                </text>
              </g>
            )}

            {/* ── GUI Act 2 — tree workspace tumbuh satu per satu ── */}
            {phaseIdx === 1 && (
              <g transform="translate(366 580)">
                <text x="0" y="-30" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.MODIFY}>landing-page/</text>
                <FileChip x={-210} y={30} label={LABELS.SRC + '/'} dim={!tree.src} color={COLORS.MODIFY} />
                <FileChip x={-70} y={30} label={LABELS.ASSETS + '/'} dim={!tree.assets} color={COLORS.MODIFY} />
                <FileChip x={70} y={30} label={LABELS.README} dim={!tree.readme} color={COLORS.INSPECT} />
                <FileChip x={210} y={30} label={LABELS.GITIGNORE} dim={!tree.showHidden} color={COLORS.CHAIN} />
                {tree.showHidden && (
                  <text x="210" y="60" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.CHAIN}>hidden (-a)</text>
                )}
              </g>
            )}

            {/* ── GUI Act 3 — cp & mv (dua kolom permanen) + read/edit/rm (impact card) ── */}
            {phaseIdx === 2 && (
              <g>
                <g transform="translate(190 560)" opacity={manage.cp ? 1 : 0.25}>
                  <text x="0" y="-24" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.MODIFY}>cp — asal tetap ada</text>
                  <FileChip x={-70} y={10} label={LABELS.SCREENSHOT} color={COLORS.MODIFY} />
                  <text x="0" y="14" fontFamily="monospace" fontSize="14" fill={COLORS.MODIFY}>{'\u2192'}</text>
                  <FileChip x={70} y={10} label={'assets/'} color={COLORS.SUCCESS} />
                </g>
                <g transform="translate(542 560)" opacity={manage.mv ? 1 : 0.25}>
                  <text x="0" y="-24" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.MODIFY}>mv — asal hilang</text>
                  <FileChip x={-70} y={10} label={LABELS.BRIEF} dim={manage.mv} color={COLORS.MODIFY} />
                  <text x="0" y="14" fontFamily="monospace" fontSize="14" fill={COLORS.MODIFY}>{'\u2192'}</text>
                  <FileChip x={70} y={10} label={LABELS.README} color={COLORS.SUCCESS} />
                </g>

                {manage.read && (
                  <g transform="translate(366 660)">
                    <rect x="-260" y="-40" width="520" height="80" rx="12" fill={COLORS.PANEL} stroke={COLORS.INSPECT} strokeWidth="1.5" />
                    <text x="0" y="-14" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.MUTED}>README.md</text>
                    <text x="0" y="12" textAnchor="middle" fontFamily="monospace" fontSize="12.5" fill={COLORS.TEXT}>(isi brief project ditampilkan)</text>
                  </g>
                )}

                {manage.edit && (
                  <g transform="translate(366 660)">
                    <rect x="-260" y="-46" width="520" height="92" rx="12" fill={COLORS.PANEL_ALT} stroke={COLORS.CHAIN} strokeWidth="1.5" />
                    <text x="-238" y="-20" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>editor terminal (mis. nano) — README.md</text>
                    <rect x="-238" y="-6" width="200" height="4" fill={COLORS.CHAIN} opacity="0.5" />
                    <text x="-238" y="24" fontFamily="monospace" fontSize="12.5" fill={COLORS.TEXT}># Landing Page{'\u2588'}</text>
                  </g>
                )}

                {(manage.rmAsk || manage.rmDone) && (
                  <g transform="translate(366 660)">
                    <rect x="-230" y="-38" width="460" height="76" rx="12" fill={COLORS.PANEL} stroke={COLORS.DANGER} strokeWidth="1.5" />
                    <text x="0" y="-10" textAnchor="middle" fontFamily="monospace" fontSize="12.5" fill={COLORS.TEXT}>
                      rm: remove {LABELS.OLD_DRAFT}?
                    </text>
                    <text x="0" y="16" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13"
                      fill={manage.rmDone ? COLORS.SUCCESS : COLORS.DANGER}>
                      {manage.rmDone ? 'y — dihapus' : 'menunggu konfirmasi (y/N)'}
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* ── GUI Act 4 — package shelf → chain "&&" → chain ";" (berurutan, tidak bersamaan) ── */}
            {phaseIdx === 3 && workflowStage === 'package' && (
              <g transform="translate(366 620)">
                <text x="0" y="-40" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.MUTED}>tool shelf</text>
                <rect x="-90" y="-20" width="180" height="56" rx="10" fill={COLORS.PANEL_ALT} stroke={COLORS.PACKAGE} strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="14" fill={COLORS.PACKAGE}>{LABELS.RIPGREP}</text>
                <text x="0" y="22" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={COLORS.MUTED}>Debian/Ubuntu example</text>
              </g>
            )}

            {phaseIdx === 3 && workflowStage === 'chain-and' && (
              <g transform="translate(90 610)">
                <text x="188" y="-30" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.CHAIN}>&amp;&amp; — lanjut hanya bila sukses</text>
                {['mkdir demo', 'cd demo', 'touch notes.txt'].map((label, i) => {
                  const active = chainAndStep > i
                  return (
                    <g key={label}>
                      <g transform={'translate(' + i * 190 + ' 0)'} opacity={active ? 1 : 0.28}>
                        <rect x="-78" y="-20" width="156" height="40" rx="8" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="1.5" />
                        <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontSize="11.5" fill={COLORS.SUCCESS}>{label}</text>
                      </g>
                      {i < 2 && (
                        <text x={i * 190 + 95} y="6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="14"
                          fill={chainAndStep > i + 1 ? COLORS.CHAIN : COLORS.MUTED}>&amp;&amp;</text>
                      )}
                    </g>
                  )
                })}
              </g>
            )}

            {phaseIdx === 3 && workflowStage === 'chain-semi' && (
              <g transform="translate(180 610)">
                <text x="93" y="-30" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.CHAIN}>; — tetap jalan, tidak menunggu status</text>
                {['pwd', 'ls'].map((label, i) => (
                  <g key={label}>
                    <g transform={'translate(' + i * 186 + ' 0)'} opacity={chainSemiStep > i ? 1 : 0.28}>
                      <rect x="-78" y="-20" width="156" height="40" rx="8" fill={COLORS.PANEL_ALT} stroke={COLORS.INSPECT} strokeWidth="1.5" />
                      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.INSPECT}>{label}</text>
                    </g>
                    {i < 1 && (
                      <text x={i * 186 + 93} y="6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="16" fill={COLORS.MUTED}>;</text>
                    )}
                  </g>
                ))}
              </g>
            )}

            {/* Takeaway */}
            <g opacity={pTakeaway.opacity} transform={transform('takeaway', 366, 877)}>
              <rect x="-262" y="-31" width="524" height="62" rx="28" fill={COLORS.SUCCESS} opacity="0.16" />
              <rect x="-262" y="-31" width="524" height="62" rx="28" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2" />
              <text x="0" y="7" textAnchor="middle" fontSize="18" fontWeight="700" fill={COLORS.SUCCESS}>{CAPTIONS.TAKEAWAY}</text>
            </g>
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
