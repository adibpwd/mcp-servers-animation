// REVISI-02 (2026-09-13) — lihat revisi/2026-09-13-revisi-02-real-terminal-workflows.md
import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, LABELS, CAPTIONS, SFX_MAP, TERMINAL_STEPS, LINE_COLOR,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  INTRO_ACT_LABEL,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
  DEFAULT_LAYOUT_V1,
} from '../../shared/scene-ui/v1'

const HISTORY_VISIBLE = 8

// Revisi-07 (2026-09-14) — ikon ringkasan 4 Act untuk heroIllustration
// (IntroHeaderMorphV1 UPDATE 4, lihat revisi/2026-09-14-revisi-07-hero-illustration.md).
// Pure presentational, statis di hero — bukan bagian dari timeline GSAP.
// Warna tiap chip mengikuti COLORS/PHASES.badgeColor per Act supaya nyambung
// dengan ActBadgeNavigatorV1 begitu contentStarted.
function HeroWorkflowIllustration() {
  const items = [
    { x: -222, color: COLORS.NAV, label: 'RUTE' },
    { x: -74, color: COLORS.MODIFY, label: 'WORKSPACE' },
    { x: 74, color: COLORS.INSPECT, label: 'KELOLA' },
    { x: 222, color: COLORS.PACKAGE, label: 'JALANKAN' },
  ]
  return (
    <g>
      {items.map((it, i) => (
        <g key={it.label} transform={'translate(' + it.x + ' 0)'}>
          <circle r="34" fill={COLORS.PANEL_ALT} stroke={it.color} strokeWidth="2.5" />
          {i === 0 && (
            <>
              <path d="M0,-13 C7,-13 13,-7 13,0 C13,9 0,19 0,19 C0,19 -13,9 -13,0 C-13,-7 -7,-13 0,-13 Z" fill={it.color} />
              <circle cx="0" cy="-1" r="4" fill={COLORS.PANEL_ALT} />
            </>
          )}
          {i === 1 && (
            <>
              <path d="M-14,-7 L-4,-7 L-1,-3 L14,-3 L14,10 L-14,10 Z" fill="none" stroke={it.color} strokeWidth="2.5" strokeLinejoin="round" />
              <line x1="4" y1="-1" x2="4" y2="7" stroke={it.color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="3" x2="8" y2="3" stroke={it.color} strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
          {i === 2 && (
            <>
              <rect x="-11" y="-14" width="18" height="24" rx="2" fill="none" stroke={it.color} strokeWidth="2.2" />
              <line x1="-7" y1="-7" x2="3" y2="-7" stroke={it.color} strokeWidth="1.6" />
              <line x1="-7" y1="-2" x2="3" y2="-2" stroke={it.color} strokeWidth="1.6" />
              <line x1="6" y1="6" x2="16" y2="-4" stroke={it.color} strokeWidth="2.6" strokeLinecap="round" />
            </>
          )}
          {i === 3 && (
            <>
              <rect x="-15" y="-12" width="30" height="22" rx="3" fill="none" stroke={it.color} strokeWidth="2.2" />
              <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="700" fill={it.color}>{'>_'}</text>
            </>
          )}
          <text x="0" y="54" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="700" fill={COLORS.MUTED} letterSpacing="1">{it.label}</text>
          {i < items.length - 1 && (
            <text x="74" y="6" textAnchor="middle" fontSize="16" fill={COLORS.MUTED}>{'\u203A'}</text>
          )}
        </g>
      ))}
    </g>
  )
}

// Revisi-03 (2026-09-14) — tuning tunggal untuk ambient "ACT 1" di intro.
// Lihat revisi/2026-09-14-revisi-03-act-1-intro-ambient.md. Ubah nilai di
// sini saja saat preview-tuning, jangan sebar ke tempat lain.
const INTRO_ACT_OPACITY = 0.18 // rentang tuning yang diizinkan: 0.15–0.25
const INTRO_ACT_FADE_IN_AT = 0.05
const INTRO_ACT_FADE_IN_DURATION = 0.32
const INTRO_ACT_FADE_OUT_AT = 0.85 // harus selesai sebelum contentStarted (1.15)
const INTRO_ACT_FADE_OUT_DURATION = 0.22
// Revisi-04 (2026-09-14) — x disamakan dengan x intro title/header
// (layout.header.x = 44), bukan lagi offset kanan. Ini juga x yang sama
// dipakai ActBadgeNavigatorV1 (nav.x = 44) sehingga transisi ambient →
// badge terasa menyambung di posisi horizontal yang sama, walau ambient
// ini tetap teks polos tanpa bentuk badge/pill.
const INTRO_ACT_X = DEFAULT_LAYOUT_V1.header.x
const INTRO_ACT_Y = 478 // di atas tagline (y=550), di belakang blok title
const INTRO_ACT_FONT_SIZE = 42 // ~0.6× titleFontSize hero (72)

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
  const [introActOpacity, setIntroActOpacity] = useState(0) // revisi-03 ambient ACT 1
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
      setIntroActOpacity(0)
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

    // Revisi-03 — ambient "ACT 1" pada intro: fade-in lembut, stabil di
    // INTRO_ACT_OPACITY, lalu fade-out sebelum ActBadgeNavigatorV1 muncul
    // (contentStarted @1.15) supaya tidak bertumpuk.
    const introAct = { o: 0 }
    tl.to(introAct, {
      o: INTRO_ACT_OPACITY,
      duration: INTRO_ACT_FADE_IN_DURATION,
      ease: 'power1.out',
      onUpdate: () => setIntroActOpacity(introAct.o),
    }, INTRO_ACT_FADE_IN_AT)
    tl.to(introAct, {
      o: 0,
      duration: INTRO_ACT_FADE_OUT_DURATION,
      ease: 'power1.in',
      onUpdate: () => setIntroActOpacity(introAct.o),
    }, INTRO_ACT_FADE_OUT_AT)

    tl.add(() => { setContentStarted(true); play(SFX_MAP.PACKAGE) }, 1.15)
    // Revisi (2026-09-14) — terminal & narration-bubble muncul di awal Act 1
    // tanpa menunggu action apa pun, jadi langsung full-visible (tanpa pop-in
    // animate). Element lain yang munculnya dipicu action tertentu (mis.
    // takeaway di Act 4) tetap pakai popIn().
    tl.add(() => setPop((prev) => ({ ...prev, terminal: { opacity: 1, scale: 1, x: 0, y: 0 } })), 1.15)
    tl.add(() => setPop((prev) => ({ ...prev, 'narration-bubble': { opacity: 1, scale: 1, x: 0, y: 0 } })), 1.15)

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

      {/* Revisi-03 (2026-09-14) — ambient "ACT 1" chapter marker, murni
          dekoratif, di BELAKANG title/subtitle intro (di-render sebelum
          IntroHeaderMorphV1). Bukan badge aktif — PHASES[0].badge lengkap
          tetap dipakai ActBadgeNavigatorV1 setelah intro.
          Revisi-04 (2026-09-14) — x disamakan dengan x intro title/header
          (kiri, textAnchor start dari layout.header.x), bukan lagi rata
          kanan. Tetap teks polos tanpa rect/pill — badge sungguhan baru
          muncul lewat ActBadgeNavigatorV1 begitu title sudah pindah ke
          posisi header (contentStarted === true). */}
      {!contentStarted && introActOpacity > 0 && (
        <text
          x={INTRO_ACT_X}
          y={INTRO_ACT_Y}
          textAnchor="start"
          fontFamily="sans-serif"
          fontWeight="700"
          fontSize={INTRO_ACT_FONT_SIZE}
          letterSpacing="6"
          fill={COLORS.NAV}
          opacity={introActOpacity}
          style={{ pointerEvents: 'none' }}
          data-testid="terminal-navigation-intro-act-ambient"
        >
          {INTRO_ACT_LABEL}
        </text>
      )}

      <IntroHeaderMorphV1
        progress={morphP}
        // Revisi-05 (2026-09-14) — override "hero" (aman, non-breaking, lihat
        // komentar prop `hero` di IntroHeaderMorphV1) supaya tagline/title/
        // subtitle intro tidak terlalu rapat. Default HERO_DEFAULTS shared
        // (taglineY 550, titleY 640, subtitleY 716) sengaja TIDAK diubah di
        // file component-nya karena itu breaking change untuk semua topic
        // lain yang pakai V1 — jadi override lokal saja di sini.
        hero={{ taglineY: 522, subtitleY: 754 }}
        // Revisi-06 (2026-09-14) — heroBackground (UPDATE 3 di
        // IntroHeaderMorphV1, non-breaking) untuk kebutuhan thumbnail.
        // Warna dari COLORS.NAV (tema "navigasi" topic ini) translucent,
        // fade-out otomatis begitu progress lewat titleMorphSplit (default),
        // compact header tidak berubah sama sekali. Lihat
        // revisi/2026-09-14-revisi-06-hero-background.md.
        heroBackground={{
          fill: 'rgba(56, 189, 248, 0.10)',
          stroke: 'rgba(56, 189, 248, 0.25)',
        }}
        // Revisi-07 (2026-09-14) — heroIllustration (UPDATE 4 di
        // IntroHeaderMorphV1, non-breaking), ringkasan 4 Act jadi ikon di
        // bawah subtitle hero, khusus buat kebutuhan thumbnail (bukan
        // ilustrasi baru per command, cukup satu peta kecil dari keseluruhan
        // workflow topic). Lihat revisi/2026-09-14-revisi-07-hero-illustration.md.
        heroIllustration={{
          content: <HeroWorkflowIllustration />,
        }}
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
