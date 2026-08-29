// ═══════════════════════════════════════════════════════════════════════════
// src/content/linux-vs-unix/Animation-history.jsx
// ─────────────────────────────────────────────────────────────────────────
// Linux vs Unix — HISTORY TIMELINE narrative
// Act 1: Lahirnya Unix (1969) → Act 2: Unix pecah & POSIX (1970an-80an) →
// Act 3: Lahirnya Linux (1991) → Act 4: Ledakan distro (pohon keluarga) →
// Act 5: Skor akhir 2026 (pemakaian + jumlah varian)
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  UNIX_BIRTH, UNIX_SPLIT_EVENTS, LINUX_BIRTH,
  DISTRO_TREE, DISTRO_COUNT_MILESTONES,
  UNIX_TODAY, LINUX_TODAY, CLOSING_LINE,
} from './data-history'
import sfxLoader from './sfx-loader'
import { getIcon } from './icons/loader'

const lerp = (a, b, t) => a + (b - a) * t

// ── deterministic pseudo-random (seeded) ──
// PENTING: jangan pakai Math.random() di sini. Timeline animasi ini di-build ulang
// (component mount ulang) di beberapa proses Chrome terpisah saat export
// (detectDuration, captureAudio, tiap captureSegment worker). Kalau delay ketik
// pakai Math.random(), tiap proses dapat urutan acak BEDA → total durasi intro beda →
// semua timestamp Act 1 dst (dihitung relatif dari situ) ikut geser beda antara
// audio-pass dan video-pass → hasil export video/audio nggak sinkron.
// Dengan seeded random, hasilnya "kelihatan acak" (gaya ngetik hacker) tapi selalu
// identik persis di setiap mount/proses, sehingga video & audio pasti sinkron.
const seededRandom01 = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x) // 0..1, deterministik untuk seed yang sama
}

// ── Intro (typing → morph) text ──
const INTRO_TITLE = 'UNIX vs LINUX'
const INTRO_SUBTITLE = 'Perjalanan 1969 → 2026: Dari Bell Labs ke Dunia Digital'

export default function LinuxVsUnixHistoryAnimation({
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
  const [pop, setPop] = useState({})          // generic reveal state for any node/line
  const [distroCount, setDistroCount] = useState(1)
  const [unixCount, setUnixCount] = useState(0)

  // ── intro (typing → morph) state ──
  const [showIntro, setShowIntro] = useState(true)
  const [morphP, setMorphP] = useState(0)
  const [typed, setTyped] = useState({ title: '', subtitle: '' })
  const [cursorVisible, setCursorVisible] = useState(true)

  const phase = PHASES[phaseIdx] || PHASES[0]
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  // ── distro family-tree coordinate mapping (Act 4) ──
  const TREE_Y0 = 1991, TREE_Y1 = 2017
  const yearToX = (year) => lerp(20, 700, (year - TREE_Y0) / (TREE_Y1 - TREE_Y0))
  const laneToY = (lane) => lane * 78 + 30
  const nodePos = (id) => {
    const n = DISTRO_TREE.find(d => d.id === id)
    return n ? { x: yearToX(n.year), y: laneToY(n.lane) } : { x: 0, y: 0 }
  }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── generic reveal helper (pop-in, optional slide-in via fromX/fromY) ──
  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.45, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 0 } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.ui(SFX_MAP.POP.name, { volume, speed }) },
      onUpdate: () => setPop(prev => ({
        ...prev,
        [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) },
      })),
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)

  // ── hacker-typing helper for intro (types one character at a time) ──
  const typeLine = (tl, startTime, lineKey, fullText, opts = {}) => {
    const { minDelay = 40, maxDelay = 100, avgDelay = 60 } = opts
    const lineSeed = lineKey === 'title' ? 1.7 : 9.3 // beda seed base per baris biar polanya nggak identik
    let acc = ''
    let time = startTime
    for (let i = 0; i < fullText.length; i++) {
      const char = fullText[i]
      // Seeded (bukan Math.random()) → hasil selalu sama di setiap mount/proses,
      // jadi durasi intro & offset semua Act sesudahnya identik antara audio-pass
      // dan video-pass export. Lihat catatan di seededRandom01 di atas.
      const rand = seededRandom01(i * 12.9898 + lineSeed)
      const variance = (rand - 0.5) * (maxDelay - minDelay)
      const delay = Math.max(minDelay, Math.min(maxDelay, avgDelay + variance))
      tl.add(() => {
        acc += char
        setTyped(prev => ({ ...prev, [lineKey]: acc }))
        sfxLoader.sfx(SFX_MAP.TYPING.name, {
          volume: volumeRef.current * 1.6,
          speed: speedRef.current * (0.98 + Math.random() * 0.04)
        })
      }, time)
      time += delay / 1000
    }
    return time - startTime
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl

    let t = 0

    // ═══════════════ INTRO — TYPING lalu MORPH ke header ═══════════════
    tl.add(() => {
      setShowIntro(true)
      setMorphP(0)
      setTyped({ title: '', subtitle: '' })
      setCursorVisible(true)
    }, t)
    t += 0.3 // jeda kecil sebelum mulai ngetik

    // ── ketik title "UNIX vs LINUX" ──
    t += typeLine(tl, t, 'title', INTRO_TITLE, { minDelay: 40, maxDelay: 100, avgDelay: 60 })
    t += 0.3 // jeda, seolah lagi mikir sebelum lanjut subtitle

    // ── ketik subtitle ──
    t += typeLine(tl, t, 'subtitle', INTRO_SUBTITLE, { minDelay: 35, maxDelay: 85, avgDelay: 55 })

    // ── cursor blink, kasih jeda baca sebelum morph ──
    for (let i = 0; i < 3; i++) {
      tl.add(() => {
        setCursorVisible(v => !v)
        if (audioUnlockedRef.current) sfxLoader.ui(SFX_MAP.TICK.name, { volume: volume * 0.9, speed })
      }, t + i * 0.35)
    }
    t += 1.05
    t += 0.35 // pause final sebelum morph mulai

    // ── MORPH: title+subtitle+tagline slide naik & mengecil jadi header ──
    tl.add(() => {
      setCursorVisible(false)
      sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume, speed })
      // Charge sound — semangat! menandai transisi intro → ACT 1
      if (audioUnlockedRef.current) {
        sfxLoader.success(SFX_MAP.CHARGE.name, { volume: volumeRef.current * 1.0, speed })
      }
    }, t)
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    t += 0.8

    tl.add(() => setShowIntro(false), t)
    t += 0.3 // jeda kecil sebelum Act 1 mulai render

    // ═══════════════ ACT 1 — LAHIRNYA UNIX (1969) ═══════════════
    tl.add(() => { setPhaseIdx(0); sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume, speed }) }, t)
    say(tl, t + 0.1, 'Tahun 1969, di sebuah lab riset milik AT&T...')
    popIn(tl, t + 0.4, 'year1969', { duration: 0.6, fromY: -20, sfx: true })
    tl.add(() => audioUnlockedRef.current && sfxLoader.sfx(SFX_MAP.SCAN.name, { volume: volume * 0.8, speed }), t + 0.4)
    popIn(tl, t + 0.9, 'placeLabel')
    say(tl, t + 1.1, 'Dua orang pakai komputer bekas yang nganggur, PDP-7.')
    popIn(tl, t + 1.4, 'machine', { duration: 0.5, sfx: true })
    tl.add(() => audioUnlockedRef.current && sfxLoader.sfx(SFX_MAP.MATERIALIZE.name, { volume: volume * 0.9, speed }), t + 1.4)
    popIn(tl, t + 2.0, 'personKT', { fromX: -40, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volume * 0.7, speed }), t + 2.0)
    popIn(tl, t + 2.3, 'personDR', { fromX: 40, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volume * 0.7, speed }), t + 2.3)
    say(tl, t + 2.7, 'Ken Thompson & Dennis Ritchie — mereka bikin sistem operasi kecil untuk dipakai sendiri. Namanya: Unix.')
    popIn(tl, t + 3.4, 'tlLine')
    popIn(tl, t + 3.6, 'dot1969', { sfx: true })
    tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.PLINK.name, { volume: volume * 0.6, speed }), t + 3.6)
    popIn(tl, t + 4.3, 'dot1971', { sfx: true })
    tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.PLINK.name, { volume: volume * 0.6, speed }), t + 4.3)
    say(tl, t + 4.4, `1971 — manual pertama Unix terbit.`)
    popIn(tl, t + 5.2, 'dot1973', { sfx: true })
    tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.PLINK.name, { volume: volume * 0.6, speed }), t + 5.2)
    say(tl, t + 5.3, `1973 — Unix ditulis ulang pakai bahasa C, biar gampang "pindah rumah" ke komputer lain.`)
    popIn(tl, t + 6.3, 'insight1', { fromY: 20, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.8, speed }), t + 6.3)
    say(tl, t + 6.4, 'Inilah alasan Unix jadi fondasi hampir semua sistem operasi modern.')
    t += PHASES[0].duration

    // ═══════════════ ACT 2 — UNIX PECAH & POSIX (1970an-80an) ═══════════════
    tl.add(() => { setPhaseIdx(1); sfxLoader.transition(SFX_MAP.GLITCH.name, { volume, speed }) }, t)
    say(tl, t + 0.1, 'Unix disebar gratis ke kampus & perusahaan lain...')
    popIn(tl, t + 0.4, 'unixRoot', { duration: 0.5 })

    const splitBeats = [
      { id: 'bsd', delay: 1.1, txt: '1977 — Mahasiswa UC Berkeley mengubah Unix jadi versi mereka sendiri: BSD.' },
      { id: 'gnu', delay: 2.4, txt: '1983 — Richard Stallman memulai proyek GNU: bikin "Unix-tiruan" yang 100% bebas dipakai & diubah.' },
      { id: 'hpux', delay: 3.7, txt: '1984 — HP bikin HP-UX, Unix versi korporat untuk server bisnis.' },
      { id: 'aix', delay: 4.9, txt: '1986 — IBM bikin AIX, untuk mesin-mesin besar mereka.' },
      { id: 'posix', delay: 6.1, txt: '1988 — Semua "Unix" ini sudah beda-beda! IEEE bikin standar POSIX biar semuanya tetap "nyambung".' },
      { id: 'solaris', delay: 7.5, txt: '1992 — Solaris dari Sun Microsystems ikut ramai di dunia perusahaan.' },
    ]
    splitBeats.forEach(b => {
      say(tl, t + b.delay, b.txt)
      popIn(tl, t + b.delay + 0.05, `line-${b.id}`, { duration: 0.35, sfx: false })
      tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.TICK.name, { volume: volume * 1.1, speed }), t + b.delay + 0.05)
      // sfx: true — pakai jalur POP bawaan popIn() yang sudah terbukti reliable di ACT 1,
      // jangan cuma andalkan tl.add() manual di bawah sebagai satu-satunya sumber suara.
      popIn(tl, t + b.delay + 0.15, b.id, { duration: 0.45, sfx: true })
      tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.PLINK.name, { volume: volume * 0.9, speed }), t + b.delay + 0.2)
      // Special sound for POSIX (important milestone)
      if (b.id === 'posix') {
        tl.add(() => audioUnlockedRef.current && sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.8, speed }), t + b.delay + 0.4)
      }
    })
    popIn(tl, t + 8.9, 'insight2', { fromY: 20, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.8, speed }), t + 8.9)
    say(tl, t + 9.0, 'Hasilnya: banyak "Unix" berbeda-beda, dijaga tetap mirip lewat standar POSIX.')
    t += PHASES[1].duration

    // ═══════════════ ACT 3 — LAHIRNYA LINUX (1991) ═══════════════
    tl.add(() => { setPhaseIdx(2); sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume, speed }) }, t)
    say(tl, t + 0.1, 'Sembilan tahun setelah proyek GNU dimulai...')
    popIn(tl, t + 0.4, 'year1991', { duration: 0.6, fromY: -20, sfx: true })
    tl.add(() => audioUnlockedRef.current && sfxLoader.sfx(SFX_MAP.SCAN.name, { volume: volume * 0.8, speed }), t + 0.4)
    popIn(tl, t + 0.9, 'helsinkiLabel')
    say(tl, t + 1.0, 'Di Helsinki, Finlandia — seorang mahasiswa 21 tahun iseng bikin kernel-nya sendiri.')
    popIn(tl, t + 1.5, 'torvalds', { duration: 0.5, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volume * 0.7, speed }), t + 1.5)
    popIn(tl, t + 2.5, 'usenetNote', { fromY: 15, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.sfx(SFX_MAP.MATERIALIZE.name, { volume: volume * 0.7, speed }), t + 2.5)
    say(tl, t + 2.6, 'Diumumkan santai di forum diskusi online — awalnya cuma proyek sampingan, bukan rencana besar.')
    popIn(tl, t + 4.0, 'gnuSlide', { duration: 0.7, ease: 'power2.out', fromX: -260, sfx: false })
    popIn(tl, t + 4.0, 'kernelSlide', { duration: 0.7, ease: 'power2.out', fromX: 260, sfx: false })
    // GNU box & kernel box sliding in dari kiri/kanan — sebelumnya kosong total, gak ada bunyi apa pun di sini
    tl.add(() => audioUnlockedRef.current && sfxLoader.transition(SFX_MAP.SLIDE_IN.name, { volume, speed }), t + 4.0)
    tl.add(() => audioUnlockedRef.current && sfxLoader.impact(SFX_MAP.BRANCH.name, { volume, speed }), t + 4.65)
    popIn(tl, t + 4.9, 'mergeBox', { duration: 0.5, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.sfx(SFX_MAP.SUCCESS.name, { volume, speed }), t + 4.95)
    say(tl, t + 5.0, '1992 — Kernel Linux + tools GNU + lisensi GPL = GNU/Linux, sistem operasi gratis penuh.')
    popIn(tl, t + 6.4, 'gplBadge', { sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.8, speed }), t + 6.4)
    say(tl, t + 6.5, 'Siapa pun boleh pakai, ubah, dan sebarkan ulang — gratis, selamanya.')
    popIn(tl, t + 7.5, 'insight3', { fromY: 20, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.8, speed }), t + 7.5)
    say(tl, t + 7.6, 'Beda banget dengan kebanyakan Unix yang berbayar & tertutup.')
    t += PHASES[2].duration

    // ═══════════════ ACT 4 — LEDAKAN DISTRO LINUX (pohon keluarga) ═══════════════
    tl.add(() => { setPhaseIdx(3); setDistroCount(1); sfxLoader.transition(SFX_MAP.SWOOSH2.name, { volume, speed }) }, t)
    say(tl, t + 0.1, 'Karena kodenya bebas dipakai siapa saja, Linux beranak-pinak...')
    DISTRO_TREE.forEach((node, i) => {
      const dTime = t + 0.5 + i * 0.52
      if (node.parent) {
        popIn(tl, dTime, `treeline-${node.id}`, { duration: 0.3, sfx: false })
        tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.TICK.name, { volume: volume * 0.85, speed }), dTime)
      }
      popIn(tl, dTime + 0.1, `tree-${node.id}`, { duration: 0.4 })
      tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.PLINK.name, { volume: volume * 0.6, speed }), dTime + 0.1)
      say(tl, dTime + 0.1, `${node.year} — ${node.name} lahir.`)
    })
    const lastNodeTime = t + 0.5 + DISTRO_TREE.length * 0.52
    say(tl, lastNodeTime + 0.3, 'Dari 1 kernel, jadi ratusan wajah berbeda...')
    const countObj = { v: 1 }
    tl.to(countObj, {
      v: 600, duration: 2.0, ease: 'power2.out',
      onStart: () => audioUnlockedRef.current && sfxLoader.sfx(SFX_MAP.SCAN.name, { volume, speed }),
      onUpdate: () => setDistroCount(Math.round(countObj.v)),
    }, lastNodeTime + 0.5)
    // ── tick berkala selama angka naik 1→600, pitch makin naik biar berasa "ngebut" ──
    const distroClimbStart = lastNodeTime + 0.5
    const distroTickCount = 14
    for (let i = 1; i <= distroTickCount; i++) {
      const tickTime = distroClimbStart + (2.0 * i) / (distroTickCount + 1)
      tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.TICK.name, {
        volume: volume * 0.6, speed: speed * (1 + i * 0.025),
      }), tickTime)
    }
    tl.add(() => audioUnlockedRef.current && sfxLoader.success(SFX_MAP.VICTORY.name, { volume, speed }), lastNodeTime + 2.3)
    popIn(tl, lastNodeTime + 0.6, 'distroCounterBox', { duration: 0.4 })
    say(tl, lastNodeTime + 2.6, 'DistroWatch mencatat 600+ distro Linux aktif per hari ini.')
    t += PHASES[3].duration

    // ═══════════════ ACT 5 — SKOR AKHIR 2026 ═══════════════
    tl.add(() => { setPhaseIdx(4); setUnixCount(0); sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed }) }, t)
    say(tl, t + 0.1, '57 tahun kemudian... siapa menang di mana?')
    popIn(tl, t + 0.4, 'vsDivider', { duration: 0.4 })
    popIn(tl, t + 0.8, 'unixHeader', { fromX: -50 })
    popIn(tl, t + 0.8, 'linuxHeader', { fromX: 50 })
    say(tl, t + 1.0, 'Unix: sedikit varian, tapi kuat di ceruknya masing-masing.')
    ;[0, 1, 2].forEach(i => {
      popIn(tl, t + 1.6 + i * 0.4, `unixStat-${i}`, { fromY: 15 })
      popIn(tl, t + 1.8 + i * 0.4, `linuxStat-${i}`, { fromY: 15 })
    })
    say(tl, t + 3.4, 'Linux: ratusan varian, mendominasi server, cloud, & saku semua orang.')
    popIn(tl, t + 4.6, 'variantCompare', { fromY: 15, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volume * 0.8, speed }), t + 4.6)
    const uCountObj = { v: 0 }
    tl.to(uCountObj, { v: 5, duration: 1.2, ease: 'power2.out', onStart: () => audioUnlockedRef.current && sfxLoader.sfx(SFX_MAP.SCAN.name, { volume, speed }), onUpdate: () => setUnixCount(Math.round(uCountObj.v)) }, t + 4.8)
    // ── tick per-angka selama hitungan naik 0→5 (rentang kecil, tiap step kerasa) ──
    ;[1, 2, 3, 4, 5].forEach((step, i) => {
      const tickTime = t + 4.8 + (1.2 * step) / 5
      tl.add(() => audioUnlockedRef.current && sfxLoader.ui(SFX_MAP.TICK.name, {
        volume: volume * 0.75, speed: speed * (1 + i * 0.03),
      }), tickTime)
    })
    // ── ding penutup pas hitungan selesai (dulu benar-benar tanpa bunyi) ──
    tl.add(() => audioUnlockedRef.current && sfxLoader.success(SFX_MAP.DING.name, { volume: volume * 0.85, speed }), t + 4.8 + 1.2)
    say(tl, t + 6.2, 'Unix = akar tua yang masih hidup, terutama lewat satu perusahaan: Apple.')
    popIn(tl, t + 7.0, 'closingBox', { duration: 0.5, sfx: false })
    tl.add(() => audioUnlockedRef.current && sfxLoader.success(SFX_MAP.VICTORY.name, { volume, speed }), t + 7.05)
    say(tl, t + 7.4, 'Linux = keturunan bebasnya, yang justru menguasai infrastruktur dunia modern.')
    t += PHASES[4].duration

    return () => {
      tl.kill()
      if (window.__animationTimeline === tl) delete window.__animationTimeline
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

      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke="#F472B6" strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke="#F472B6" strokeWidth={1} />)}
      </g>

      {/* ── HEADER (dinamis: typing besar di tengah → morph jadi header kecil) ── */}
      {(() => {
        const mp = morphP
        const taglineY = lerp(580, 44, mp)
        const taglineFs = lerp(22, 16, mp)
        const titleY = lerp(660, 100, mp)
        const titleFs = lerp(80, 50, mp)
        const subY = lerp(740, 130, mp)
        const subFs = lerp(26, 17, mp)
        const tt = typed.title
        return (
          <g>
            <text x={44} y={taglineY} fill={COLORS.MUTED} fontSize={taglineFs} fontFamily="monospace" letterSpacing={3}>
              LINUX CORE · <tspan fill={COLORS.LINUX} fontWeight={700}>ADIB-DEV.COM</tspan>
            </text>

            <text x={44} y={titleY} fontSize={titleFs} fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900}>
              <tspan fill={COLORS.UNIX}>{tt.slice(0, 4)}</tspan>
              <tspan fill={COLORS.MUTED}>{tt.slice(4, 6)}</tspan>
              <tspan fill={COLORS.GOLD}>{tt.slice(6, 8)}</tspan>
              <tspan fill={COLORS.LINUX}>{tt.slice(8)}</tspan>
              {showIntro && typed.title.length < INTRO_TITLE.length && cursorVisible && (
                <tspan fill={COLORS.LINUX} fontWeight={900}>█</tspan>
              )}
            </text>

            <text x={44} y={subY} fill={COLORS.MUTED} fontSize={subFs} fontFamily="sans-serif">
              {typed.subtitle}
              {showIntro && typed.title.length === INTRO_TITLE.length &&
                typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
                <tspan fill={COLORS.GOLD} fontWeight={900}>█</tspan>
              )}
            </text>
          </g>
        )
      })()}

      {/* ── PHASE BADGE ── */}
      {!showIntro && (
        <g transform="translate(44, 155)">
          <rect width={460} height={40} rx={20} fill={COLORS.PANEL} stroke={phase.badgeColor} strokeWidth={1.8} filter="url(#shadow)" />
          <circle cx={22} cy={20} r={6} fill={phase.badgeColor} filter="url(#glow)" />
          <text x={40} y={26} fill={phase.badgeColor} fontSize={14} fontFamily="monospace" fontWeight={700} letterSpacing={1}>
            {phase.badge}
          </text>
          <g transform="translate(620, 12)">
            {PHASES.map((ph, i) => (
              <circle key={ph.id} cx={i * 24} cy={8}
                r={i === phaseIdx ? 7 : 4}
                fill={i === phaseIdx ? phase.badgeColor : '#334155'}
                stroke={i === phaseIdx ? '#fff' : 'none'} strokeWidth={1.5} />
            ))}
          </g>
        </g>
      )}

      {/* ── CONTENT ── */}
      {!showIntro && (
      <g transform="translate(44, 220)">
        <rect width={732} height={52} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
        <text x={366} y={32} textAnchor="middle" fill={COLORS.TEXT} fontSize={16} fontFamily="sans-serif">
          {caption}
        </text>

        {/* ═══════ ACT 1 — LAHIRNYA UNIX ═══════ */}
        {phaseIdx === 0 && (
          <g transform="translate(0, 80)">
            <g transform={T('year1969', 366, 40)} opacity={O('year1969')}>
              <text textAnchor="middle" fill={COLORS.UNIX} fontSize={72} fontFamily="'Arial Black', sans-serif" fontWeight={900} filter="url(#glow)">1969</text>
            </g>
            <g transform={T('placeLabel', 366, 65)} opacity={O('placeLabel')}>
              <image href={getIcon('bell-labs-v2') || getIcon('bell-labs')} x={-224} y={-28} width={50} height={50} preserveAspectRatio="xMidYMid meet" opacity={0.95} />
              <text textAnchor="middle" fill={COLORS.MUTED} fontSize={14} fontFamily="monospace">{UNIX_BIRTH.place}</text>
            </g>

            <line x1={220} y1={140} x2={286} y2={140} stroke={COLORS.UNIX_DIM} strokeWidth={2} strokeDasharray="4,4" opacity={Math.min(O('machine'), O('personKT'))} />
            <line x1={446} y1={140} x2={512} y2={140} stroke={COLORS.UNIX_DIM} strokeWidth={2} strokeDasharray="4,4" opacity={Math.min(O('machine'), O('personDR'))} />

            <g transform={T('machine', 366, 140)} opacity={O('machine')}>
              <rect x={-80} y={-55} width={160} height={110} rx={14} fill={COLORS.PANEL} stroke={COLORS.UNIX} strokeWidth={2} filter="url(#shadow)" />
              <image href={getIcon('pdp7')} x={-72} y={-52} width={64} height={64} preserveAspectRatio="xMidYMid meet" />
              <text x={20} y={-16} textAnchor="middle" fill={COLORS.UNIX} fontSize={17} fontWeight={800}>PDP-7</text>
              <rect x={-60} y={10} width={120} height={26} rx={5} fill="#000" stroke={COLORS.UNIX_DIM} />
              <text textAnchor="middle" y={27} fill={COLORS.LINUX} fontSize={11} fontFamily="monospace">$ unix</text>
              <text textAnchor="middle" y={48} fill={COLORS.MUTED} fontSize={9} fontFamily="sans-serif">komputer bekas</text>
            </g>

            <g transform={T('personKT', 170, 140)} opacity={O('personKT')}>
              {getIcon('kt-photo') ? (
                <>
                  <clipPath id="clip-kt"><circle r={36} /></clipPath>
                  <image href={getIcon('kt-photo')} x={-36} y={-36} width={72} height={72} preserveAspectRatio="xMidYMid slice" clipPath="url(#clip-kt)" />
                  <circle r={36} fill="none" stroke={COLORS.UNIX} strokeWidth={2} />
                </>
              ) : (
                <>
                  <circle r={36} fill={COLORS.UNIX_DIM} stroke={COLORS.UNIX} strokeWidth={2} />
                  <text textAnchor="middle" y={7} fill="#fff" fontSize={18} fontWeight={800}>KT</text>
                </>
              )}
              <text textAnchor="middle" y={56} fill={COLORS.TEXT} fontSize={11}>Ken Thompson</text>
            </g>
            <g transform={T('personDR', 562, 140)} opacity={O('personDR')}>
              {getIcon('dr-photo') ? (
                <>
                  <clipPath id="clip-dr"><circle r={36} /></clipPath>
                  <image href={getIcon('dr-photo')} x={-36} y={-36} width={72} height={72} preserveAspectRatio="xMidYMid slice" clipPath="url(#clip-dr)" />
                  <circle r={36} fill="none" stroke={COLORS.UNIX} strokeWidth={2} />
                </>
              ) : (
                <>
                  <circle r={36} fill={COLORS.UNIX_DIM} stroke={COLORS.UNIX} strokeWidth={2} />
                  <text textAnchor="middle" y={7} fill="#fff" fontSize={18} fontWeight={800}>DR</text>
                </>
              )}
              <text textAnchor="middle" y={56} fill={COLORS.TEXT} fontSize={11}>Dennis Ritchie</text>
            </g>

            <line x1={100} y1={320} x2={632} y2={320} stroke={COLORS.BORDER} strokeWidth={2} opacity={O('tlLine')} />
            <g transform={T('dot1969', 100, 320)} opacity={O('dot1969')}>
              <circle r={9} fill={COLORS.UNIX} filter="url(#glow)" />
              <text textAnchor="middle" y={-18} fill={COLORS.UNIX} fontSize={13} fontWeight={700}>1969</text>
              <text textAnchor="middle" y={30} fill={COLORS.MUTED} fontSize={10}>Unix lahir</text>
            </g>
            <g transform={T('dot1971', 366, 320)} opacity={O('dot1971')}>
              <circle r={9} fill={COLORS.UNIX} filter="url(#glow)" />
              <text textAnchor="middle" y={-18} fill={COLORS.UNIX} fontSize={13} fontWeight={700}>1971</text>
              <text textAnchor="middle" y={30} fill={COLORS.MUTED} fontSize={10}>Manual pertama</text>
            </g>
            <g transform={T('dot1973', 632, 320)} opacity={O('dot1973')}>
              <image href={getIcon('c-language-v2') || getIcon('c-language')} x={-28} y={-76} width={56} height={56} preserveAspectRatio="xMidYMid meet" />
              <circle r={9} fill={COLORS.UNIX} filter="url(#glow)" />
              <text textAnchor="middle" y={-18} fill={COLORS.UNIX} fontSize={13} fontWeight={700}>1973</text>
              <text textAnchor="middle" y={30} fill={COLORS.MUTED} fontSize={10}>Ditulis pakai C</text>
            </g>

            <g opacity={O('insight1')}>
              <rect x={0} y={370} width={732} height={90} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <text x={30} y={402} fill={COLORS.GOLD} fontSize={14} fontFamily="monospace" fontWeight={800}>💡 KENAPA PENTING:</text>
              <text x={30} y={428} fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">Ditulis ulang pakai bahasa C bikin Unix gampang "pindah rumah" ke</text>
              <text x={30} y={448} fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">banyak jenis komputer — inilah fondasi dunia software modern.</text>
            </g>
          </g>
        )}

        {/* ═══════ ACT 2 — UNIX PECAH & POSIX ═══════ */}
        {phaseIdx === 1 && (
          <g transform="translate(0, 80)">
            <g transform={T('unixRoot', 366, 20)} opacity={O('unixRoot')}>
              <rect x={-70} y={-22} width={140} height={44} rx={22} fill={COLORS.UNIX_DIM} stroke={COLORS.UNIX} strokeWidth={2} />
              <text textAnchor="middle" y={7} fill="#fff" fontSize={16} fontWeight={800}>UNIX</text>
            </g>

            {UNIX_SPLIT_EVENTS.map(ev => {
              const cx = ev.x + 60, cy = 110 + ev.y
              const iconKey = ev.id === 'bsd' ? 'bsd-daemon' : (ev.id === 'gnu' ? 'gnu-fsf' : (ev.id === 'posix' ? 'posix' : (ev.id === 'hpux' ? 'hpux' : (ev.id === 'aix' ? 'aix' : (ev.id === 'solaris' ? 'solaris' : null)))))
              return (
                <g key={ev.id}>
                  <line x1={366} y1={40} x2={cx} y2={cy - 35} stroke={ev.special ? COLORS.GOLD : COLORS.UNIX_DIM}
                    strokeWidth={ev.special ? 2 : 1.5} strokeDasharray={ev.special ? '3,3' : 'none'} opacity={O(`line-${ev.id}`) * 0.7} />
                  <g transform={T(ev.id, cx, cy)} opacity={O(ev.id)}>
                    <rect x={-72} y={-36} width={144} height={72} rx={12} fill={COLORS.PANEL}
                      stroke={ev.special ? COLORS.GOLD : COLORS.UNIX} strokeWidth={ev.special ? 2.5 : 1.8}
                      filter={ev.special ? 'url(#glow)' : 'none'} />
                    {iconKey && (
                      <image href={getIcon(iconKey)} x={-66} y={-34} width={46} height={46} preserveAspectRatio="xMidYMid meet" />
                    )}
                    <text textAnchor="middle" x={iconKey ? 18 : 0} y={-14} fill={ev.special ? COLORS.GOLD : COLORS.UNIX} fontSize={13} fontWeight={800}>{ev.year}</text>
                    <text textAnchor="middle" x={iconKey ? 18 : 0} y={5} fill={COLORS.TEXT} fontSize={13} fontWeight={700}>{ev.name}</text>
                    <text textAnchor="middle" y={24} fill={COLORS.MUTED} fontSize={8}>{ev.org}</text>
                  </g>
                </g>
              )
            })}

            <g opacity={O('insight2')}>
              <rect x={0} y={380} width={732} height={80} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <text x={30} y={410} fill={COLORS.GOLD} fontSize={14} fontFamily="monospace" fontWeight={800}>💡 HASILNYA:</text>
              <text x={30} y={436} fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">Banyak "Unix" berbeda-beda, dijaga tetap nyambung lewat standar POSIX.</text>
              <text x={30} y={454} fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">GNU (kotak emas) beda jalur — independen, terinspirasi Unix tapi bukan turunannya.</text>
            </g>
          </g>
        )}

        {/* ═══════ ACT 3 — LAHIRNYA LINUX ═══════ */}
        {phaseIdx === 2 && (
          <g transform="translate(0, 60)">
            <g transform={T('year1991', 366, 40)} opacity={O('year1991')}>
              <text textAnchor="middle" fill={COLORS.LINUX} fontSize={64} fontFamily="'Arial Black', sans-serif" fontWeight={900} filter="url(#glow)">1991</text>
            </g>
            <g transform={T('helsinkiLabel', 366, 62)} opacity={O('helsinkiLabel')}>
              <text textAnchor="middle" fill={COLORS.MUTED} fontSize={14} fontFamily="monospace">{LINUX_BIRTH.place}</text>
            </g>

            <g transform={T('torvalds', 366, 140)} opacity={O('torvalds')}>
              <circle r={44} fill={COLORS.LINUX_DIM} stroke={COLORS.LINUX} strokeWidth={2.5} filter="url(#shadow)" />
              {getIcon('linus-photo') ? (
                <>
                  <clipPath id="clip-linus"><circle r={42} /></clipPath>
                  <image href={getIcon('linus-photo')} x={-42} y={-42} width={84} height={84} preserveAspectRatio="xMidYMid slice" clipPath="url(#clip-linus)" />
                </>
              ) : (
                <image href={getIcon('linus')} x={-36} y={-36} width={72} height={72} preserveAspectRatio="xMidYMid meet" />
              )}
              <text textAnchor="middle" y={68} fill={COLORS.TEXT} fontSize={13} fontWeight={700}>{LINUX_BIRTH.person}, {LINUX_BIRTH.age} tahun</text>
            </g>

            <g opacity={O('usenetNote')}>
              <rect x={70} y={250} width={620} height={48} rx={12} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <image href={getIcon('terminal-hacker')} x={85} y={255} width={38} height={38} preserveAspectRatio="xMidYMid meet" />
              <text x={395} y={280} textAnchor="middle" fill={COLORS.MUTED} fontSize={12} fontStyle="italic">{LINUX_BIRTH.detail}</text>
            </g>

            <g transform={T('gnuSlide', 210, 360)} opacity={O('gnuSlide')}>
              <rect x={-105} y={-38} width={210} height={76} rx={14} fill={COLORS.PANEL} stroke={COLORS.GOLD} strokeWidth={2} filter="url(#shadow)" />
              <image href={getIcon('gnu-fsf')} x={-95} y={-28} width={56} height={56} preserveAspectRatio="xMidYMid meet" />
              <text textAnchor="middle" x={24} y={-8} fill={COLORS.GOLD} fontSize={15} fontWeight={800}>GNU (1983)</text>
              <text textAnchor="middle" x={24} y={15} fill={COLORS.MUTED} fontSize={10}>tools & compiler bebas</text>
            </g>
            <text x={366} y={368} textAnchor="middle" fill={COLORS.MUTED} fontSize={32} opacity={Math.min(O('gnuSlide'), O('kernelSlide'))}>+</text>
            <g transform={T('kernelSlide', 522, 360)} opacity={O('kernelSlide')}>
              <rect x={-105} y={-38} width={210} height={76} rx={14} fill={COLORS.PANEL} stroke={COLORS.LINUX} strokeWidth={2} filter="url(#shadow)" />
              <image href={getIcon('tux')} x={-95} y={-28} width={56} height={56} preserveAspectRatio="xMidYMid meet" />
              <text textAnchor="middle" x={24} y={-8} fill={COLORS.LINUX} fontSize={15} fontWeight={800}>Linux Kernel (1991)</text>
              <text textAnchor="middle" x={24} y={15} fill={COLORS.MUTED} fontSize={10}>inti sistem operasi</text>
            </g>

            <g opacity={O('mergeBox')}>
              <rect x={100} y={425} width={532} height={80} rx={16} fill={COLORS.PANEL} stroke={COLORS.LINUX} strokeWidth={2.5} filter="url(#glow)" />
              <image href={getIcon('tux')} x={115} y={432} width={65} height={65} preserveAspectRatio="xMidYMid meet" />
              <image href={getIcon('gnu-fsf')} x={550} y={432} width={65} height={65} preserveAspectRatio="xMidYMid meet" />
              <text x={366} y={458} textAnchor="middle" fill={COLORS.LINUX} fontSize={18} fontWeight={900}>GNU/Linux</text>
              <text x={366} y={482} textAnchor="middle" fill={COLORS.TEXT} fontSize={13}>Sistem Operasi Gratis Penuh (1992)</text>
            </g>
            <g transform={T('gplBadge', 366, 520)} opacity={O('gplBadge')}>
              <rect x={-150} y={-18} width={300} height={36} rx={18} fill={COLORS.LINUX_DIM} stroke={COLORS.LINUX} strokeWidth={1.5} />
              <text textAnchor="middle" y={5} fill="#fff" fontSize={12.5} fontWeight={700}>Lisensi GPL — bebas dipakai & disebarkan</text>
            </g>

            <g opacity={O('insight3')}>
              <rect x={0} y={585} width={732} height={70} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <text x={30} y={613} fill={COLORS.GOLD} fontSize={14} fontFamily="monospace" fontWeight={800}>💡 BEDA KUNCI:</text>
              <text x={30} y={639} fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">Kebanyakan Unix berbayar & tertutup. Linux gratis & terbuka sejak lahir.</text>
            </g>
          </g>
        )}

        {/* ═══════ ACT 4 — LEDAKAN DISTRO LINUX ═══════ */}
        {phaseIdx === 3 && (
          <g transform="translate(16, 70)">
            {DISTRO_TREE.map(node => {
              if (!node.parent) return null
              const from = nodePos(node.parent), to = nodePos(node.id)
              return (
                <line key={`ln-${node.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={node.color} strokeWidth={1.5} opacity={O(`treeline-${node.id}`) * 0.6} />
              )
            })}
            {DISTRO_TREE.map(node => {
              const pos = nodePos(node.id)
              const isRoot = !node.parent
              // Map distro-tree ids -> icon keys (fills in as batch-5/6 icons get generated)
              const DISTRO_ICON_MAP = {
                slack: 'slackware', debian: 'debian', redhat: 'redhat', suse: 'suse',
                gentoo: 'gentoo', arch: 'arch', fedora: 'fedora', ubuntu: 'ubuntu',
                centos: 'centos', mint: 'mint', android: 'android',
                manjaro: 'manjaro', popos: 'popos',
              }
              const nodeIcon = isRoot ? getIcon('tux') : getIcon(DISTRO_ICON_MAP[node.id])
              const iconSize = isRoot ? 56 : 36
              return (
                <g key={node.id} transform={T(`tree-${node.id}`, pos.x, pos.y)} opacity={O(`tree-${node.id}`)}>
                  {nodeIcon ? (
                    <image href={nodeIcon} x={-iconSize / 2} y={-iconSize / 2}
                      width={iconSize} height={iconSize} preserveAspectRatio="xMidYMid meet" />
                  ) : (
                    <circle r={12} fill={node.color} filter="url(#shadow)" />
                  )}
                  <text textAnchor="middle" y={isRoot ? -32 : -18} fill={node.color} fontSize={11} fontWeight={700}>{node.name}</text>
                  <text textAnchor="middle" y={isRoot ? 38 : 22} fill={COLORS.MUTED} fontSize={8.5} fontFamily="monospace">{node.year}</text>
                </g>
              )
            })}

            <g transform="translate(0, 390)" opacity={O('distroCounterBox')}>
              <rect width={700} height={105} rx={16} fill={COLORS.PANEL} stroke={COLORS.LINUX} strokeWidth={2} filter="url(#shadow)" />
              <image href={getIcon('distro-tree')} x={565} y={8} width={90} height={90} preserveAspectRatio="xMidYMid meet" opacity={0.95} />
              <text x={30} y={40} fill={COLORS.MUTED} fontSize={13} fontFamily="monospace">DISTRO LINUX AKTIF SAAT INI</text>
              <text x={30} y={85} fill={COLORS.LINUX} fontSize={44} fontFamily="'Arial Black', sans-serif" fontWeight={900}>{distroCount}+</text>
              <text x={245} y={85} fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">menurut catatan DistroWatch</text>
            </g>
          </g>
        )}

        {/* ═══════ ACT 5 — SKOR AKHIR 2026 ═══════ */}
        {phaseIdx === 4 && (
          <g transform="translate(0, 60)">
            <line x1={366} y1={0} x2={366} y2={340} stroke={COLORS.BORDER} strokeWidth={2} opacity={O('vsDivider')} />
            <g transform={T('vsDivider', 366, 170)} opacity={O('vsDivider')}>
              <circle r={24} fill={COLORS.PANEL} stroke={COLORS.GOLD} strokeWidth={2} />
              <text textAnchor="middle" y={6} fill={COLORS.GOLD} fontSize={14} fontWeight={800}>VS</text>
            </g>

            <g transform={T('unixHeader', 183, 20)} opacity={O('unixHeader')}>
              <image href={getIcon('macos')} x={-125} y={-30} width={50} height={50} preserveAspectRatio="xMidYMid meet" />
              <text textAnchor="middle" fill={COLORS.UNIX} fontSize={32} fontWeight={900}>UNIX</text>
              <text textAnchor="middle" y={22} fill={COLORS.MUTED} fontSize={11.5}>{UNIX_TODAY.headline}</text>
            </g>
            <g transform={T('linuxHeader', 549, 20)} opacity={O('linuxHeader')}>
              <image href={getIcon('tux')} x={75} y={-30} width={50} height={50} preserveAspectRatio="xMidYMid meet" />
              <text textAnchor="middle" fill={COLORS.LINUX} fontSize={32} fontWeight={900}>LINUX</text>
              <text textAnchor="middle" y={22} fill={COLORS.MUTED} fontSize={11.5}>{LINUX_TODAY.headline}</text>
            </g>

            {UNIX_TODAY.stats.map((s, i) => {
              const uIcon = i === 0 ? 'macos' : (i === 1 ? 'bsd-daemon' : 'pdp7')
              return (
                <g key={`u${i}`} transform={T(`unixStat-${i}`, 183, 76 + i * 64)} opacity={O(`unixStat-${i}`)}>
                  <rect x={-160} y={-24} width={320} height={52} rx={12} fill={COLORS.PANEL} stroke={COLORS.UNIX} strokeWidth={1.5} />
                  <image href={getIcon(uIcon)} x={-152} y={-21} width={42} height={42} preserveAspectRatio="xMidYMid meet" />
                  <text x={-102} y={-4} fill={COLORS.TEXT} fontSize={11}>{s.label}</text>
                  <text x={-102} y={17} fill={s.color} fontSize={13} fontWeight={800}>{s.value}</text>
                </g>
              )
            })}
            {LINUX_TODAY.stats.map((s, i) => {
              const lIcon = i === 0 ? 'supercomputer' : (i === 1 ? 'cloud-server' : 'android')
              return (
                <g key={`l${i}`} transform={T(`linuxStat-${i}`, 549, 76 + i * 64)} opacity={O(`linuxStat-${i}`)}>
                  <rect x={-160} y={-24} width={320} height={52} rx={12} fill={COLORS.PANEL} stroke={COLORS.LINUX} strokeWidth={1.5} />
                  <image href={getIcon(lIcon)} x={-152} y={-21} width={42} height={42} preserveAspectRatio="xMidYMid meet" />
                  <text x={-102} y={-4} fill={COLORS.TEXT} fontSize={11}>{s.label}</text>
                  <text x={-102} y={17} fill={s.color} fontSize={13} fontWeight={800}>{s.value}</text>
                </g>
              )
            })}

            <g opacity={O('variantCompare')} transform="translate(0, 280)">
              <rect width={732} height={68} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <text x={183} y={26} textAnchor="middle" fill={COLORS.MUTED} fontSize={11.5}>Varian Unix aktif</text>
              <text x={183} y={52} textAnchor="middle" fill={COLORS.UNIX} fontSize={24} fontWeight={900}>~{unixCount}</text>
              <line x1={366} y1={10} x2={366} y2={58} stroke={COLORS.BORDER} strokeWidth={1} />
              <text x={549} y={26} textAnchor="middle" fill={COLORS.MUTED} fontSize={11.5}>Varian Linux aktif</text>
              <text x={549} y={52} textAnchor="middle" fill={COLORS.LINUX} fontSize={24} fontWeight={900}>{distroCount}+</text>
            </g>

            <g opacity={O('closingBox')} transform="translate(0, 360)">
              <rect width={732} height={110} rx={14} fill={COLORS.PANEL} stroke={COLORS.GOLD} strokeWidth={1.8} filter="url(#shadow)" />
              <g>
                {getIcon('bsd-daemon') && (
                  <image href={getIcon('bsd-daemon')} x={18} y={18} width={24} height={24} preserveAspectRatio="xMidYMid meet" />
                )}
                <text x={50} y={38} fill={COLORS.UNIX} fontSize={13.5} fontFamily="sans-serif">{CLOSING_LINE.unix}</text>
              </g>
              <g>
                {getIcon('tux') && (
                  <image href={getIcon('tux')} x={18} y={48} width={24} height={24} preserveAspectRatio="xMidYMid meet" />
                )}
                <text x={50} y={68} fill={COLORS.LINUX} fontSize={13.5} fontFamily="sans-serif">{CLOSING_LINE.linux}</text>
              </g>
              <text x={30} y={96} fill={COLORS.MUTED} fontSize={11.5} fontFamily="monospace">57 tahun. Satu akar. Dua takdir berbeda.</text>
            </g>
          </g>
        )}
      </g>
      )}
    </svg>
  )
}
