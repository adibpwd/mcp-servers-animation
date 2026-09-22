// ═══════════════════════════════════════════════════════════════════════════
// src/content/http-request-response/Animation.jsx
// ─────────────────────────────────────────────────────────────────────────
// HTTP Request-Response — browser diketik URL (hook: "kok nunggu?") →
// analogi surat + amplop balasan: nulis surat (request) → cari alamat &
// ketuk pintu (DNS + koneksi) → surat dibuka (server proses) → balasan +
// stempel (status code) → amplop dibuka lagi (browser render, payoff).
// Lihat _docs/HTTP_REQUEST_RESPONSE_PLAN.md.
//
// STATUS EKSEKUSI: Intro + Act 1..6 lengkap (full topic pass pertama).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY, INTRO_TITLE, INTRO_SUBTITLE,
  HOOK_URL, HOOK_QUESTION, HOOK_REVEAL, HOOK_CLIFFHANGER,
  REQUEST_ADDRESS, DOMAIN_VS_IP_QUESTION, ENVELOPE_SEALED_CAPTION,
  RESOLVED_IP,
  SERVER_THINKING_CAPTION, REPLY_CLIFFHANGER,
  STATUS_MAIN, STATUS_VARIANTS,
  RENDER_CAPTION,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { getIcon } from './icons/loader'

// ── deterministic pseudo-random (seeded) — WAJIB dipakai (bukan
// Math.random()) karena timeline ini di-build ulang di beberapa proses
// Chrome terpisah saat export. Pola identik container-docker/Animation.jsx.
const seededRandom01 = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const lerp = (a, b, t) => a + (b - a) * t

export default function HttpRequestResponseAnimation({
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
  const [pop, setPop] = useState({})

  // ── ANCHOR objects — browser frame persisten Act 1..6 (03 §3.1). Cuma
  // Act 1 yang dibangun sekarang; anchor-nya sudah disiapkan supaya Act
  // lanjutan tinggal nambah tween, bukan bikin ulang.
  const [loadingSpin, setLoadingSpin] = useState(0)
  const [showPage, setShowPage] = useState(false)

  // ── ANCHOR — amplop request, persisten Act 2..4 (03 §3.1). Posisi
  // ditween langsung (bukan cuma pop-in offset) supaya bisa "terbang"
  // jarak jauh lintas zona (client → DNS → server).
  // Revisi-08 §C: default y digeser 380→330 (posisi ISTIRAHAT amplop di
  // beat "Nulis Surat", dipakai juga sebagai titik AWAL tween "fly ke
  // DNS" di Act 2 — lihat `fly1` closure). 330 dipilih supaya gak nimpa
  // NodeLabel browser (y=375, revisi-07 §B).
  const [reqEnvelopePos, setReqEnvelopePos] = useState({ x: 410, y: 700 })
  const [reqEnvelopeSealed, setReqEnvelopeSealed] = useState(false)
  const [reqEnvelopeOpen, setReqEnvelopeOpen] = useState(false)

  // ── ANCHOR — buku alamat DNS + IP hasil resolve (Act 3 saja) ──
  const [dnsFound, setDnsFound] = useState(false)

  // ── ANCHOR — gedung/karakter server, persisten Act 3..5 ──
  const [doorOpen, setDoorOpen] = useState(false)
  const [officerHappy, setOfficerHappy] = useState(false)
  const [officerThinking, setOfficerThinking] = useState(false)

  // ── ANCHOR — amplop response (objek BEDA dari amplop request per
  // plan §Persistent Anchor Objects), persisten Act 5..6 ──
  const [replyEnvelopePos, setReplyEnvelopePos] = useState({ x: 410, y: 950 })
  const [replyEnvelopeSealed, setReplyEnvelopeSealed] = useState(false)
  const [replyEnvelopeOpen, setReplyEnvelopeOpen] = useState(false)
  const [stampShown, setStampShown] = useState(false)

  // ── intro (typing → morph) state — pola sama seperti tailscale/
  // container-docker ──
  const [showIntro, setShowIntro] = useState(true)
  const [morphP, setMorphP] = useState(0)
  const [typed, setTyped] = useState({ title: '', subtitle: '' })
  const [cursorVisible, setCursorVisible] = useState(true)

  // ── "Maximum Animation" (revisi-02 §B) — state efek visual tambahan.
  // Semua array pakai id unik (bukan index) supaya aman di-filter pas
  // animasi selesai walau ada beberapa instance aktif bersamaan.
  const [starBursts, setStarBursts] = useState([])
  const [shockWaves, setShockWaves] = useState([])
  const [flashOpacity, setFlashOpacity] = useState(0)
  const [flashColor, setFlashColor] = useState('#ffffff')
  const [thinkProg, setThinkProg] = useState(0)
  const [envelopeTrail, setEnvelopeTrail] = useState([])
  const [pathProgress, setPathProgress] = useState(0)
  const [browserPulse, setBrowserPulse] = useState(0)
  const [confettiPieces, setConfettiPieces] = useState([])

  // ── Revisi-03 "Flowchart Storytelling" state (checklist §1.4/§2.2/§7.2).
  // Koordinat node FlowchartSpine PAKAI anchor asli yang sudah ada di
  // codebase ini (bukan placeholder cx=120/700 di revisi-03.md — itu
  // contoh generik, project ini portrait VW=820/VH=1340 dgn layout
  // vertikal: browser atas, DNS di kanan-tengah, server bawah).
  const [activeNode, setActiveNode] = useState(null) // null | 'browser' | 'dns' | 'server'
  const [forwardPathPct, setForwardPathPct] = useState(0) // 0-1, Browser→amplop→Server (via sisi kanan)
  const [dnsReturnPct, setDnsReturnPct] = useState(0)    // 0-1, garis IP balik DNS→amplop (kuning, zona DNS)
  const [returnPathPct, setReturnPathPct] = useState(0)  // 0-1, Server→Browser (via sisi kiri)
  const [pathFlash, setPathFlash] = useState(false)
  const [thoughtBubbleIcon, setThoughtBubbleIcon] = useState(null) // null | icon id
  const [browserFilled, setBrowserFilled] = useState(false)
  const [browserLoadingShown, setBrowserLoadingShown] = useState(false)
  const [dnsResolvedShown, setDnsResolvedShown] = useState(false)
  const [serverActiveShown, setServerActiveShown] = useState(false)

  // ── Revisi-06 state — fix icon numpuk (impact-ray) + storytelling SVG
  // tambahan (radar-ping DNS). Tidak ada icon PNG baru, murni SVG.
  const [impactRays, setImpactRays] = useState([])
  const [dnsSearching, setDnsSearching] = useState(false)

  // ── Revisi-14 §B — DNS gerbang routing visual
  const [dnsGatewayShown, setDnsGatewayShown] = useState(false)
  const [dnsRoutingPct, setDnsRoutingPct] = useState(0)

  // ── Revisi-07 state — Act 1 lebih kontekstual (konteks visual SEBELUM
  // text muncul, sesuai plan revisi-07.md Proposal A) + kontinuitas icon
  // antar-Act (Proposal C, jangan langsung ilang pas ganti phaseIdx).
  const [urlHighlight, setUrlHighlight] = useState(0) // 0-1, progress highlight rect di address bar
  const [cursorBlinkOn, setCursorBlinkOn] = useState(false) // kursor berkedip di address bar
  const [browserArrowShown, setBrowserArrowShown] = useState(false) // panah tipis browser→bawah
  const [browserToBlobLine, setBrowserToBlobLine] = useState(0) // 0-1, progress garis putus-putus browser→amplop
  const [blobArrowShown, setBlobArrowShown] = useState(false) // arrowhead kecil amplop→caption
  // Proposal C — kontinuitas icon lintas-Act, default false, di-set true
  // di timeline Act 1 (bareng popIn asli), di-set false + popOut di Act 2
  // sesuai timing yang disepakati (bukan langsung ilang pas phaseIdx ganti).
  const [methodBadgeVisible, setMethodBadgeVisible] = useState(false)
  const [addressLabelVisible, setAddressLabelVisible] = useState(false)
  const [envelopeSealedVisible, setEnvelopeSealedVisible] = useState(false)
  const [hookCliffhangerVisible, setHookCliffhangerVisible] = useState(false)
  const [domainQuestionVisible, setDomainQuestionVisible] = useState(false)

  const burstIdRef = useRef(0)
  const waveIdRef = useRef(0)
  const confettiIdRef = useRef(0)
  const rayIdRef = useRef(0)
  const envelopeTrailRef = useRef([])

  const phase = PHASES[phaseIdx] || PHASES[0]
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── generic reveal helper (pop-in) ──
  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.45, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 0, sfxName = SFX_MAP.POP.name, sfxCategory = 'ui', volumeMult = 1 } = opts
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

  // Batch-3 (revisi-02 addendum): kebalikan popIn, buat icon yang cuma
  // numpang lewat sebentar (dns-magnify, tcp-handshake) — shrink+fade
  // balik ke 0, bukan cuma unmount instan.
  const popOut = (tl, time, id, opts = {}) => {
    const { duration = 0.3, ease = 'power1.in' } = opts
    const o = { v: 1 }
    tl.to(o, {
      v: 0, duration, ease,
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v, opacity: o.v } })),
    }, time)
  }

  // say() (caption bar bawah) DIHAPUS TOTAL — revisi-04 §4, keputusan
  // user 2026-09-10. Semua narasi teks sekarang lewat IconCaption
  // (nempel di bawah icon) atau PathLabel (nempel di path berjalan).
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  // ── "Maximum Animation" helpers (revisi-02 §B/§C) — semua deterministic
  // (seededRandom01, bukan Math.random) ikut aturan project ini. ──

  // 12 bintang (default) terbang radial keluar dari (cx,cy), fade 0.8s.
  const triggerBurst = (tl, time, cx, cy, colors = [COLORS.SUCCESS], count = 12) => {
    const id = burstIdRef.current++
    const particles = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + seededRandom01(id * 7.7 + i) * 0.5
      const dist = 46 + seededRandom01(id * 3.3 + i) * 42
      return { pid: i, angle, dist, color: colors[i % colors.length] }
    })
    tl.add(() => setStarBursts(prev => [...prev, { id, cx, cy, particles, p: 0 }]), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration: 0.8, ease: 'power2.out',
      onUpdate: () => setStarBursts(prev => prev.map(b => (b.id === id ? { ...b, p: o.v } : b))),
      onComplete: () => setStarBursts(prev => prev.filter(b => b.id !== id)),
    }, time)
  }

  // 3 ring expanding-fade, time-offset 0/0.15/0.3s, tiap ring fade 0.7s.
  const triggerShockWave = (tl, time, cx, cy, color) => {
    [0, 0.15, 0.3].forEach((offset) => {
      const id = waveIdRef.current++
      tl.add(() => setShockWaves(prev => [...prev, { id, cx, cy, color, p: 0 }]), time + offset)
      const o = { v: 0 }
      tl.to(o, {
        v: 1, duration: 0.7, ease: 'power1.out',
        onUpdate: () => setShockWaves(prev => prev.map(w => (w.id === id ? { ...w, p: o.v } : w))),
        onComplete: () => setShockWaves(prev => prev.filter(w => w.id !== id)),
      }, time + offset)
    })
  }

  // Revisi-06 A.1 — impact-ray (garis radiasi gaya komik "BAM"), dipakai
  // supaya stempel-jatuh-di-amplop kebaca sebagai SATU momen yang
  // disengaja, bukan 2 icon numpuk asal. Lebih tahan lama (default 1.0s)
  // drpd triggerShockWave (0.7s) — 8-10 garis lurus menyebar radial dari
  // titik jatuh, fade + memanjang seiring waktu. Murni SVG, no new icon.
  const triggerImpactRays = (tl, time, cx, cy, color, count = 10, duration = 1.0) => {
    const id = rayIdRef.current++
    const rays = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + seededRandom01(id * 5.5 + i) * 0.4
      return { rid: i, angle }
    })
    tl.add(() => setImpactRays(prev => [...prev, { id, cx, cy, color, rays, p: 0 }]), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease: 'power2.out',
      onUpdate: () => setImpactRays(prev => prev.map(r => (r.id === id ? { ...r, p: o.v } : r))),
      onComplete: () => setImpactRays(prev => prev.filter(r => r.id !== id)),
    }, time)
  }

  // Flash rect seluruh canvas, fade dari `opacity` ke 0.
  const triggerFlash = (tl, time, color = '#ffffff', opacity = 0.4, duration = 0.3) => {
    tl.add(() => setFlashColor(color), time)
    const o = { v: opacity }
    tl.to(o, {
      v: 0, duration, ease: 'power1.out',
      onUpdate: () => setFlashOpacity(o.v),
    }, time)
  }

  // Confetti celebration — pieces terbang keluar + gravity turun, fade 1.6s.
  const triggerConfetti = (tl, time, cx, cy, count = 20) => {
    const id = confettiIdRef.current++
    const colors = [COLORS.SUCCESS, COLORS.CLIENT, COLORS.TECHNICAL, COLORS.SERVER, '#FBBF24']
    const pieces = Array.from({ length: count }).map((_, i) => {
      const angle = seededRandom01(id * 9.1 + i) * Math.PI * 2
      const spd = 60 + seededRandom01(id * 4.4 + i) * 80
      return {
        pid: i,
        vx: Math.cos(angle) * spd * 0.5,
        vy: -Math.abs(Math.sin(angle) * spd) - 40,
        rot: seededRandom01(id * 2.2 + i) * 360,
        color: colors[i % colors.length],
      }
    })
    tl.add(() => setConfettiPieces(prev => [...prev, { id, cx, cy, pieces, p: 0 }]), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration: 1.6, ease: 'power1.out',
      onUpdate: () => setConfettiPieces(prev => prev.map(c => (c.id === id ? { ...c, p: o.v } : c))),
      onComplete: () => setConfettiPieces(prev => prev.filter(c => c.id !== id)),
    }, time)
  }

  // Comet trail — simpan 8 posisi terakhir amplop yang lagi terbang, pakai
  // ref (bukan cuma state) supaya gak stale closure di onUpdate GSAP.
  const pushTrail = (x, y) => {
    envelopeTrailRef.current = [...envelopeTrailRef.current, { x, y }].slice(-8)
    setEnvelopeTrail(envelopeTrailRef.current)
  }

  // ── hacker-typing helper for intro — pola identik container-docker ──
  const typeLine = (tl, startTime, lineKey, fullText, opts = {}) => {
    const { minDelay = 40, maxDelay = 100, avgDelay = 60 } = opts
    const lineSeed = lineKey === 'title' ? 1.7 : 9.3
    let acc = ''
    let time = startTime
    for (let i = 0; i < fullText.length; i++) {
      const char = fullText[i]
      const rand = seededRandom01(i * 12.9898 + lineSeed)
      const variance = (rand - 0.5) * (maxDelay - minDelay)
      const delay = Math.max(minDelay, Math.min(maxDelay, avgDelay + variance))
      const pitchSeed = seededRandom01(i * 5.1 + (lineKey === 'title' ? 2.3 : 8.7))
      const pitch = 0.98 + pitchSeed * 0.04

      tl.add(() => {
        acc += char
        setTyped(prev => ({ ...prev, [lineKey]: acc }))
        sfxLoader.sfx(SFX_MAP.TYPING.name, { volume: volumeRef.current * 1.6, speed: speedRef.current * pitch })
      }, time)
      time += delay / 1000
    }
    return time - startTime
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — Intro + Act 1 (Act 2–6 nyusul, lihat plan §Next Steps)
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    // ═══════════════ INTRO — hacker typing → header morph ═══════════════
    tl.add(() => {
      setShowIntro(true)
      setMorphP(0)
      setTyped({ title: '', subtitle: '' })
      setCursorVisible(true)
    }, t)
    t += 0.3

    t += typeLine(tl, t, 'title', INTRO_TITLE, { minDelay: 40, maxDelay: 100, avgDelay: 60 })
    t += 0.3
    t += typeLine(tl, t, 'subtitle', INTRO_SUBTITLE, { minDelay: 35, maxDelay: 85, avgDelay: 55 })

    for (let i = 0; i < 3; i++) {
      tl.add(() => {
        setCursorVisible(v => !v)
        if (audioUnlockedRef.current) sfxLoader.ui(SFX_MAP.TICK.name, { volume: volume * 0.9, speed })
      }, t + i * 0.35)
    }
    t += 1.05
    t += 0.35

    tl.add(() => {
      setCursorVisible(false)
      sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume, speed })
      if (audioUnlockedRef.current) sfxLoader.success(SFX_MAP.CHARGE.name, { volume: volumeRef.current, speed })
    }, t)
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    t += 0.8

    tl.add(() => setShowIntro(false), t)
    t += 0.3

    // ═══════════════ ACT 1 — Kok Nyuruh Nunggu? (HOOK) ═══════════════
    tl.add(() => {
      setPhaseIdx(0)
      envelopeTrailRef.current = []
      setEnvelopeTrail([])
      setPathProgress(0)
      setActiveNode('browser')
      setForwardPathPct(0)
      setDnsReturnPct(0)
      sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume, speed })
    }, t)

    // beat 1: SETUP — browser muncul, url udah keketik, cursor loading muter
    popIn(tl, t + 0.1, 'browserAnchor', { fromY: -20, sfx: true, sfxName: SFX_MAP.MATERIALIZE.name })
    const spinObj = { v: 0 }
    tl.to(spinObj, {
      v: 720, duration: 3.0, ease: 'none',
      onStart: () => {
        sfxLoader.ui(SFX_MAP.CLICK.name, { volume, speed })
        setBrowserLoadingShown(true)
      },
      onUpdate: () => setLoadingSpin(spinObj.v),
    }, t + 0.5)
    // PulseRing loop di browser selama spinner muter (browserPulse 0→1
    // berulang, dipakai modulo di render — bukan repeat:-1 nested biar
    // gampang berhenti pas Act 1 selesai)
    const pulseObj = { v: 0 }
    tl.to(pulseObj, {
      v: 4, duration: 3.0, ease: 'none',
      onUpdate: () => setBrowserPulse(pulseObj.v % 1),
    }, t + 0.5)

    // Revisi-07 §1.1/1.2 — konteks SEBELUM "Bisa dapet halaman langsung?"
    // muncul: URL di-highlight dulu (browser "mau sesuatu"), cursor
    // berkedip, baru panah tipis nunjuk ke bawah (arah internet), BARU
    // pertanyaannya sendiri nongol. Urutan: highlight → cursor → panah → text.
    const urlHlObj = { v: 0 }
    tl.to(urlHlObj, {
      v: 1, duration: 0.4, ease: 'power1.out',
      onUpdate: () => setUrlHighlight(urlHlObj.v),
    }, t + 0.5)
    tl.add(() => setCursorBlinkOn(true), t + 0.6)
    tl.add(() => setCursorBlinkOn(false), t + 0.85)
    tl.add(() => setCursorBlinkOn(true), t + 1.0)
    tl.add(() => setCursorBlinkOn(false), t + 1.25)
    tl.add(() => setBrowserArrowShown(true), t + 1.3)
    tl.add(() => setBrowserArrowShown(false), t + 1.6)

    // beat 2: TEGANGAN — speech bubble pertanyaan retoris, kasih jeda mikir
    popIn(tl, t + 1.6, 'hookBubble', { fromY: -10, sfx: true, sfxName: SFX_MAP.CHIME.name, duration: 0.4, ease: 'back.out(2)' })

    // beat 3: TITIK BALIK — amplop terbang TURUN dari browser (portrait:
    // arah bawah, bukan samping), masih samar/blur — belum full reveal.
    // envelopeTrail comet dots ikut turun (tween paralel, posisi absolut
    // sama seperti popIn envelopeAnchor: base y=700, fromY=-300).
    // Revisi-07 §1.4 — garis putus-putus dari browser MUNCUL DULU
    // (sebelum amplop turun di t+3.3), supaya penonton paham "sesuatu
    // keluar dari browser" begitu amplop (blur, TIDAK diubah) nongol.
    const blobLineObj = { v: 0 }
    tl.to(blobLineObj, {
      v: 1, duration: 0.3, ease: 'power1.out',
      onUpdate: () => setBrowserToBlobLine(blobLineObj.v),
    }, t + 3.0)

    popIn(tl, t + 3.3, 'envelopeAnchor', { fromY: -300, duration: 0.9, ease: 'power2.in', sfx: true, sfxName: SFX_MAP.WHOOSH.name })
    tl.add(() => setBrowserLoadingShown(false), t + 3.3)
    // Revisi-12 §B — benang forward menyala seiring amplop turun dari browser
    const fwd0 = { v: 0 }
    tl.to(fwd0, {
      v: 0.33, duration: 0.9, ease: 'power2.in',
      onUpdate: () => setForwardPathPct(fwd0.v),
    }, t + 3.3)
    const trailObj = { v: 0 }
    tl.to(trailObj, {
      v: 1, duration: 0.9, ease: 'power2.in',
      onUpdate: () => pushTrail(410, 700 + (-300) * (1 - trailObj.v)),
    }, t + 3.3)
    sfxOn(tl, t + 4.1, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volume * 0.6, speed }))
    triggerBurst(tl, t + 4.2, 410, 700, [COLORS.CLIENT, COLORS.NETWORK], 8)

    // Revisi-07 §1.5 — garis fade out begitu amplop sudah nyampe, ganti
    // jadi arrowhead kecil dari amplop menunjuk ke arah caption yang mau
    // muncul (t+5.0), biar "Browser = Tukang Pos" kebaca sebagai
    // kelanjutan visual, bukan text yang muncul sendirian.
    const blobLineOutObj = { v: 1 }
    tl.to(blobLineOutObj, {
      v: 0, duration: 0.3, ease: 'power1.in',
      onUpdate: () => setBrowserToBlobLine(blobLineOutObj.v),
    }, t + 4.2)
    tl.add(() => setBlobArrowShown(true), t + 4.3)

    // beat 4: PAYOFF (cliffhanger, bukan jawaban penuh)
    popIn(tl, t + 5.0, 'hookRevealCard', { fromY: 10, sfx: true, sfxName: SFX_MAP.CONFIRM.name, sfxCategory: 'success' })
    tl.add(() => setBlobArrowShown(false), t + 5.0)
    // Revisi-08 §A — fade out hookBubble BARENGAN hookRevealCard muncul:
    // pertanyaan "Bisa dapet halaman langsung?" udah "terjawab" begitu
    // reveal "Browser = Tukang Pos!" nongol, gak perlu numpuk berdua.
    popOut(tl, t + 5.0, 'hookBubble', { duration: 0.3 })
    // Revisi-07 §1.6 — wiggle amplop + cliffhanger "Isi suratnya apa?"
    // diposisikan dekat amplop (bukan x=235 yang jauh), biar pertanyaan
    // ini kebaca sebagai "menunjuk ke amplop", bukan text lepas.
    tl.add(() => setHookCliffhangerVisible(true), t + 5.8)
    tl.to({}, {
      duration: 0.4,
      onUpdate: function () {
        const p = this.progress()
        setPop(prev => ({
          ...prev,
          envelopeAnchor: { ...(prev.envelopeAnchor || {}), x: Math.sin(p * Math.PI * 4) * 6 },
        }))
      },
      onComplete: () => setPop(prev => ({ ...prev, envelopeAnchor: { ...(prev.envelopeAnchor || {}), x: 0 } })),
    }, t + 5.8)
    popIn(tl, t + 6.1, 'hookCliffhangerBadge', { duration: 0.4, ease: 'back.out(2)', sfx: true, sfxName: SFX_MAP.CHIME.name })
    // Revisi-08 §A — fade out hookRevealCard ~1s setelah cliffhanger
    // muncul (kasih jeda baca dulu: reveal → cliffhanger → reveal fade),
    // supaya pas masuk beat "Nulis Surat" cuma hookCliffhangerBadge yang
    // masih ada (memang sengaja persist ke Act 2, revisi-07 §C).
    popOut(tl, t + 7.1, 'hookRevealCard', { duration: 0.3 })

    // revisi-05: Act 1(lama)+Act 2(lama) digabung jadi Act BARU 1.
    // Seam dipangkas 7.0s→6.7s (buffer nganggur 0.5s→0.2s) — beat
    // berikutnya "dimajukan", isi & urutan tiap beat TIDAK diubah.
    t += 6.7

    // ── lanjutan Act baru 1: Nulis Surat (dulu Act 2 tersendiri) ──
    // phaseIdx TETAP 0 — masih Act baru 1 yang sama, bukan Act baru,
    // jadi TIDAK ada setPhaseIdx/sfx transition kedua di sini lagi.
    tl.add(() => {
      setReqEnvelopeSealed(false)
      setReqEnvelopeOpen(false)
      // Revisi-08 §B — morph: mulai di posisi envelopeAnchor (410,700),
      // BUKAN langsung di posisi final nulis-surat (330) — biar transisi
      // envelopeAnchor→reqEnvelope kebaca sebagai SATU amplop yang sama
      // "berubah wujud", bukan 2 amplop beda muncul bersamaan (masalah 3).
      setReqEnvelopePos({ x: 410, y: 700 })
    }, t)

    // Revisi-08 §B — crossfade morph: envelopeAnchor (amplop misterius
    // blur) pudar PAS BARENGAN reqEnvelope (amplop nulis-surat) muncul,
    // di titik yang SAMA (410,700) — daripada popIn/popOut independen di
    // 2 posisi beda (dulu bikin 2 amplop kelihatan bersamaan).
    popOut(tl, t, 'envelopeAnchor', { duration: 0.4 })
    // beat 1: SETUP — amplop "berubah wujud" jadi surat yang mau ditulis
    popIn(tl, t + 0.1, 'reqEnvelope', { duration: 0.4, sfx: true, sfxName: SFX_MAP.MATERIALIZE.name })

    // Revisi-14 §A — morphObj (amplop naik ke y=330) DIHAPUS.
    // Amplop tetap di y=700 (posisi landed), tidak balik ke atas lagi.

    // beat 2: TEGANGAN — komponen surat muncul satu-satu. headerNoteLabel
    // (User-Agent note) DIHAPUS TOTAL — revisi-04 §4, dianggap detail
    // teknis kurang esensial, ikut prinsip "minim text box".
    popIn(tl, t + 1.0, 'methodBadge', { duration: 0.5, ease: 'elastic.out(1.2, 0.4)', sfx: true, sfxName: SFX_MAP.POP.name })
    tl.add(() => setMethodBadgeVisible(true), t + 1.0) // revisi-07 §C — kontinuitas lintas-Act
    popIn(tl, t + 1.6, 'addressLabel', { duration: 0.3, sfx: true, sfxName: SFX_MAP.TICK.name })
    tl.add(() => setAddressLabelVisible(true), t + 1.6) // revisi-07 §C

    // beat 3: TITIK BALIK — nama domain vs IP asli
    popIn(tl, t + 3.5, 'domainQuestionBubble', { fromY: -10, duration: 0.4, ease: 'back.out(2)', sfx: true, sfxName: SFX_MAP.CHIME.name })
    tl.add(() => setDomainQuestionVisible(true), t + 3.5) // revisi-07 §C

    // beat 4: PAYOFF — amplop tersegel
    tl.add(() => {
      setReqEnvelopeSealed(true)
      sfxLoader.impact(SFX_MAP.LOCK.name, { volume, speed })
    }, t + 5.3)
    triggerBurst(tl, t + 5.3, 410, 380, [COLORS.SUCCESS], 8)
    triggerShockWave(tl, t + 5.3, 410, 380, COLORS.SUCCESS)
    popIn(tl, t + 5.3, 'sealedDot', { duration: 0.3, sfx: false })
    popIn(tl, t + 5.8, 'envelopeSealedCard', { fromY: 10, sfx: true, sfxName: SFX_MAP.CONFIRM.name, sfxCategory: 'success' })
    tl.add(() => setEnvelopeSealedVisible(true), t + 5.8) // revisi-07 §C

    // revisi-05: ini seam ASLI (Act baru 1 → Act baru 2), bukan seam
    // yang digabung — jarak & tail buffer TIDAK dipangkas, dipertahankan
    // 9.0s persis seperti dulu (dulu PHASES[1].duration).
    t += 9.0

    // ═══════════════ ACT BARU 2 — Nyari Alamat & Ketuk Pintu (DNS + Koneksi) ═══════════════
    // (dulu Act 3 — konten & timing TIDAK diubah, cuma nomor Act di-reindex)
    tl.add(() => {
      setPhaseIdx(1)
      setDnsFound(false)
      setDoorOpen(false)
      setPathProgress(0)
      envelopeTrailRef.current = []
      setEnvelopeTrail([])
      setActiveNode('browser')
      setDnsResolvedShown(false)
      setServerActiveShown(false)
      sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed })
    }, t)
    // 'Cari alamat!' — DIHAPUS, sudah tercakup PathLabel segment
    // Browser→DNS ("cari alamat") yang nempel di path itu sendiri.

    // Revisi-07 §C — fade out icon Act 1 yang sudah "selesai tugasnya"
    // di Act 2, TIDAK langsung ilang pas phaseIdx ganti. Timing sesuai
    // plan: methodBadge & envelopeSealedCard duluan (amplop sudah mulai
    // terbang), addressLabel/hookCliffhangerBadge/domainQuestionBubble
    // nyambung sampai DNS resolve selesai (t+3.4, bareng dnsFound t+3.2).
    popOut(tl, t + 1.0, 'methodBadge', { duration: 0.3 })
    tl.add(() => setMethodBadgeVisible(false), t + 1.3)
    popOut(tl, t + 2.0, 'envelopeSealedCard', { duration: 0.3 })
    tl.add(() => setEnvelopeSealedVisible(false), t + 2.3)
    popOut(tl, t + 3.4, 'addressLabel', { duration: 0.3 })
    tl.add(() => setAddressLabelVisible(false), t + 3.7)
    popOut(tl, t + 3.4, 'hookCliffhangerBadge', { duration: 0.3 })
    tl.add(() => setHookCliffhangerVisible(false), t + 3.7)
    popOut(tl, t + 3.4, 'domainQuestionBubble', { duration: 0.3 })
    tl.add(() => setDomainQuestionVisible(false), t + 3.7)

    // beat 1: SETUP — amplop terbang ke buku alamat (DNS)
    const fly1 = { x: reqEnvelopePos.x, y: reqEnvelopePos.y }
    tl.to(fly1, {
      x: 410, y: 620, duration: 1.0, ease: 'power2.inOut',
      onStart: () => setActiveNode('dns'),
      onUpdate: () => {
        setReqEnvelopePos({ x: fly1.x, y: fly1.y })
        pushTrail(fly1.x, fly1.y)
      },
    }, t)
    popIn(tl, t + 0.3, 'addressBook', { fromY: -15, sfx: true, sfxName: SFX_MAP.MATERIALIZE.name })
    // forwardPathPct: segmen Amplop→DNS menyala seiring amplop terbang (Revisi-12)
    const fwd1 = { v: 0.33 }
    tl.to(fwd1, {
      v: 0.67, duration: 1.0, ease: 'power2.inOut',
      onUpdate: () => setForwardPathPct(fwd1.v),
    }, t)

    // Batch-3 (revisi-02 addendum): packet-fly kecil nempel di belakang
    // amplop pas terbang beat 1 (client → address book), kesan "network
    // traffic" bukan cuma 1 amplop sendirian.
    popIn(tl, t + 0.25, 'packetFly1', { duration: 0.25, sfx: false })
    const packet1 = { x: 410, y: 380 }
    tl.to(packet1, {
      x: 410, y: 620, duration: 0.9, ease: 'power2.inOut',
      onUpdate: () => setPop(prev => ({ ...prev, packetFly1: { ...(prev.packetFly1 || {}), x: packet1.x - 410, y: packet1.y - 380 - 30 } })),
    }, t + 0.3)
    popOut(tl, t + 1.0, 'packetFly1', { duration: 0.3 })

    // beat 2: TEGANGAN — nyari di buku alamat (delay, bukan instan)
    tl.add(() => sfxLoader.sfx(SFX_MAP.SCAN.name, { volume, speed }), t + 1.6)
    // DNS_LOOKUP_LABEL ('DNS nyari...') — DIHAPUS, masih segment
    // Browser→DNS yang sama, sudah kebaca lewat PathLabel "cari alamat".
    // dns-magnify: nongol scan di atas buku alamat selama pencarian,
    // fade sebelum IP badge muncul (t+3.2)
    popIn(tl, t + 1.6, 'dnsMagnify', { fromY: -10, duration: 0.3, sfx: false })
    popOut(tl, t + 3.0, 'dnsMagnify', { duration: 0.25 })
    // Revisi-06 B.2 — radar-ping SVG (ring mengembang gaya sinyal/radar)
    // nyala bareng dns-magnify, biar kesan "lagi nyari" lebih hidup drpd
    // cuma icon statis. Murni SVG, gak nambah icon.
    tl.add(() => setDnsSearching(true), t + 1.6)
    tl.add(() => setDnsSearching(false), t + 3.0)

    // beat 3: TITIK BALIK — IP ketemu. ipBadge (Badge terpisah) DIHAPUS —
    // revisi-04 §3: IP-nya sekarang tampil sebagai IconCaption langsung
    // di bawah icon dns-resolved (lihat render, gated `dnsResolvedShown`).
    tl.add(() => { setDnsFound(true); setPathProgress(1); setDnsResolvedShown(true) }, t + 3.2)
    triggerBurst(tl, t + 3.2, 470, 540, [COLORS.SUCCESS, COLORS.NETWORK], 10)
    // Revisi-16: garis kuning DNS→amplop menyala 0→1 (0.45s)
    const dnsRet = { v: 0 }
    tl.to(dnsRet, {
      v: 1, duration: 0.45, ease: 'power2.out',
      onUpdate: () => setDnsReturnPct(dnsRet.v),
    }, t + 3.2)
    // Revisi-17: packet kecil animasi terbang DNS(610,620)→surat(410,620)
    // seiring garis kuning menyala — baru setelah landing di surat (t+3.65),
    // ipRider pop-in (IP "sampai"), dan surat baru boleh jalan ke server.
    popIn(tl, t + 3.2, 'dnsPacketReturn', { duration: 0.2, sfx: false })
    const dnsPacket = { x: 610, y: 620 }
    tl.to(dnsPacket, {
      x: 410, y: 620, duration: 0.45, ease: 'power2.in',
      onUpdate: () => setPop(prev => ({
        ...prev,
        dnsPacketReturn: { ...(prev.dnsPacketReturn || {}), x: dnsPacket.x - 610, y: dnsPacket.y - 620 },
      })),
    }, t + 3.2)
    popOut(tl, t + 3.65, 'dnsPacketReturn', { duration: 0.2 })
    // IP sampai ke surat — ipRider nempel, trigger burst kecil di posisi surat
    popIn(tl, t + 3.65, 'ipRider', { duration: 0.3, ease: 'back.out(1.8)', sfx: true, sfxName: SFX_MAP.TICK.name })
    triggerBurst(tl, t + 3.65, 410, 620, [COLORS.NETWORK, COLORS.SUCCESS], 7)
    // Revisi-14 §B — DNS gerbang: tampilkan kandidat server selama 0.7s
    // Revisi-17: digeser ke t+3.7, hide di t+3.85 (sebelum fly2 jalan di t+3.9)
    tl.add(() => { setDnsGatewayShown(true); setDnsRoutingPct(0) }, t + 3.7)
    const routeObj = { v: 0 }
    tl.to(routeObj, {
      v: 1, duration: 0.15, ease: 'power1.inOut',
      onUpdate: () => setDnsRoutingPct(routeObj.v),
    }, t + 3.7)
    tl.add(() => setDnsGatewayShown(false), t + 3.85)

    // beat 4: PAYOFF — surat sudah dapet IP, lanjut ke gedung server
    // Revisi-17: digeser dari t+4.5 ke t+3.9 (gap 0.25s setelah IP landing
    // di t+3.65 — cukup buat penonton baca "IP dapet, surat siap jalan",
    // tidak perlu nunggu lama lagi setelah packet mendarat di surat)
    tl.add(() => { setPathProgress(2); setActiveNode('server'); setDnsResolvedShown(false); setServerActiveShown(true) }, t + 3.9)
    popIn(tl, t + 3.9, 'serverBuilding', { fromY: 15, sfx: true, sfxName: SFX_MAP.MATERIALIZE.name })
    const fly2 = { x: 410, y: 620 }
    tl.to(fly2, {
      x: 410, y: 850, duration: 1.0, ease: 'power2.in',
      onStart: () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed }),
      onUpdate: () => {
        setReqEnvelopePos({ x: fly2.x, y: fly2.y })
        pushTrail(fly2.x, fly2.y)
      },
    }, t + 3.9)
    // forwardPathPct: segmen DNS→Server menyala seiring amplop terbang (Revisi-12)
    const fwd2 = { v: 0.67 }
    tl.to(fwd2, {
      v: 1.0, duration: 1.0, ease: 'power2.in',
      onUpdate: () => setForwardPathPct(fwd2.v),
    }, t + 3.9)
    // packet-fly kedua nempel amplop beat 4 (address book → pintu server)
    popIn(tl, t + 3.95, 'packetFly2', { duration: 0.25, sfx: false })
    const packet2 = { x: 410, y: 620 }
    tl.to(packet2, {
      x: 410, y: 850, duration: 1.0, ease: 'power2.in',
      onUpdate: () => setPop(prev => ({ ...prev, packetFly2: { ...(prev.packetFly2 || {}), x: packet2.x - 410, y: packet2.y - 620 - 30 } })),
    }, t + 4.0)
    popOut(tl, t + 4.9, 'packetFly2', { duration: 0.25 })
    tl.add(() => {
      setDoorOpen(true)
      sfxLoader.impact(SFX_MAP.LOCK.name, { volume, speed })
    }, t + 5.6)
    triggerShockWave(tl, t + 5.6, 410, 900, COLORS.SERVER)
    // Revisi-13 §D — amplop masuk gedung, fade out setelah pintu kebuka
    popOut(tl, t + 5.8, 'reqEnvelope', { duration: 0.4 })
    // Revisi-15: ipRider ikut fade bareng amplop — tugas IP-nya kelar
    // begitu koneksi ke server tersambung (tcp-handshake sebelahnya)
    popOut(tl, t + 5.8, 'ipRider', { duration: 0.4 })
    // KNOCK_CAPTION ('Server terima surat!') — DIHAPUS, masih segment
    // DNS→Server yang sama, sudah kebaca lewat PathLabel "connect".
    // tcp-handshake: kedip singkat pas pintu pertama kali kebuka,
    // simbolis "koneksi TCP tersambung" sebelum amplop masuk
    popIn(tl, t + 5.6, 'tcpHandshake', { fromY: 8, duration: 0.35, ease: 'back.out(2)', sfx: false })
    popOut(tl, t + 6.9, 'tcpHandshake', { duration: 0.3 })

    // revisi-05: seam ASLI (Act baru 2 → Act baru 3), dipertahankan
    // 10.0s persis seperti dulu (dulu PHASES[2].duration).
    t += 10.0

    // ═══════════════ ACT BARU 3 — Surat Diproses & Distempel ═══════════════
    // (dulu Act 4 — konten & timing TIDAK diubah, cuma nomor Act di-reindex)
    tl.add(() => {
      setPhaseIdx(2)
      setOfficerHappy(false)
      setOfficerThinking(false)
      setActiveNode('server')
      sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume, speed })
    }, t)
    // 'Server terima!' — DIHAPUS, pintu server kebuka (Act 3 payoff) +
    // officer muncul di bawah ini sudah cukup jelas jadi icon-nya sendiri.

    // beat 1: SETUP — amplop dibuka, petugas muncul
    tl.add(() => setReqEnvelopeOpen(true), t + 0.3)
    popIn(tl, t + 0.5, 'officer', { fromY: 10, sfx: true, sfxName: SFX_MAP.MATERIALIZE.name })

    // beat 2: TEGANGAN — mikir/processing (ThinkingDotsAnim, bounce wave —
    // thinkProg jalan 0→3 (3 siklus) selama beat mikir berlangsung).
    // ThoughtBubble (revisi-03 §2): muncul bareng mikir, icon default di
    // dalam bubble jadi placeholder "belum tau isinya apa".
    tl.add(() => { setOfficerThinking(true); setThoughtBubbleIcon('default-icon') }, t + 1.3)
    popIn(tl, t + 1.3, 'thinkingDots', { duration: 0.3, sfx: true, sfxName: SFX_MAP.TICK.name })
    popIn(tl, t + 1.3, 'thoughtBubble', { duration: 0.35, ease: 'back.out(1.8)', sfx: false })
    const thinkObj = { v: 0 }
    tl.to(thinkObj, { v: 3, duration: 1.9, ease: 'none', onUpdate: () => setThinkProg(thinkObj.v) }, t + 1.3)
    // SERVER_THINKING_CAPTION ('Lagi mikir...') — pindah jadi IconCaption
    // di bawah ThoughtBubble (revisi-04 §3.4, gated pop id 'thoughtBubble'
    // yang sama, lihat render).

    // beat 3: TITIK BALIK — data ketemu, reaksi senang. Icon dalam
    // ThoughtBubble swap ke html-document (data ketemu), lalu bubble
    // "pecah" jadi sparkle burst bareng officer-happy.
    tl.add(() => setThoughtBubbleIcon('html-document'), t + 2.9)
    tl.add(() => {
      setOfficerThinking(false)
      setOfficerHappy(true)
      setServerActiveShown(false)
      sfxLoader.success(SFX_MAP.CONFIRM.name, { volume, speed })
    }, t + 3.2)
    popIn(tl, t + 3.2, 'foundCheck', { duration: 0.35, ease: 'back.out(2)', sfx: false })
    popOut(tl, t + 3.2, 'thoughtBubble', { duration: 0.25 })
    tl.add(() => setThoughtBubbleIcon(null), t + 3.45)
    triggerBurst(tl, t + 3.2, 410, 780, [COLORS.SUCCESS, '#FBBF24'], 10)
    triggerBurst(tl, t + 3.2, 410, 860, [COLORS.SUCCESS, '#FBBF24'], 10)
    triggerFlash(tl, t + 3.2, '#ffffff', 0.25, 0.25)
    // 'Data ketemu! 🎯' — pindah jadi IconCaption di bawah icon foundCheck
    // (revisi-04 §3, gated pop id 'foundCheck' yang sama, lihat render).

    // beat 4: PAYOFF — mulai nulis balasan. replyCliffhangerBadge render
    // diganti dari Badge (box) jadi icon + IconCaption di bawah officer
    // (revisi-04 §3, tetap gated pop id 'replyCliffhangerBadge' yang sama).
    popIn(tl, t + 5.0, 'replyCliffhangerBadge', { duration: 0.4, ease: 'back.out(2)', sfx: true, sfxName: SFX_MAP.CHIME.name })

    // revisi-05: Act 4(lama)+Act 5(lama) digabung jadi Act BARU 3.
    // Seam dipangkas 9.0s→5.7s (buffer nganggur 3.6s→0.3s — badge
    // cliffhanger dulu "nahan" lama, sekarang beat balasan dimajukan
    // jauh lebih cepat). Isi & urutan tiap beat TIDAK diubah.
    t += 5.7

    // ── lanjutan Act baru 3: Balasan & Stempel (dulu Act 5 tersendiri) ──
    // phaseIdx TETAP 2 — masih Act baru 3 yang sama, jadi TIDAK ada
    // setPhaseIdx/sfx transition kedua di sini lagi.
    tl.add(() => {
      setReplyEnvelopeSealed(false)
      setReplyEnvelopeOpen(false)
      setStampShown(false)
      setReplyEnvelopePos({ x: 410, y: 950 })
      envelopeTrailRef.current = []
      setEnvelopeTrail([])
    }, t)
    // Act 5 sengaja TIDAK ditambah IconCaption baru (revisi-04 §5) — ini
    // pola acuan yang paling disukai user apa adanya: full-icon, stamp
    // slam jadi fokus utama tanpa teks pengalih perhatian.

    // beat 1: SETUP — amplop balasan baru (objek beda dari amplop request)
    popIn(tl, t + 0.2, 'replyEnvelope', { fromY: -15, sfx: true, sfxName: SFX_MAP.MATERIALIZE.name })

    // beat 2: TEGANGAN — server kumpulkan asset (HTML/CSS/JS) dan
    // masukkan ke amplop response (revisi-11: fix gap "file muncul
    // tiba-tiba di browser" — harus kelihatan BERASAL dari server).
    // 3 icon fly keluar dari posisi server (~410,850) ke amplop (~410,950),
    // staggered 0.25s, lalu scale+fade ke titik amplop (kesan "masuk ke
    // dalam amplop"). Icon yang dipakai: html-document, css-document,
    // js-document — sudah ada di icons/, dipakai juga di Act 4.
    tl.add(() => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed }), t + 1.4)
    // html-document — fly pertama
    popIn(tl, t + 1.4, 'responseHtml', { duration: 0.3, fromY: -30, ease: 'back.out(1.8)', sfx: true, sfxName: SFX_MAP.TICK.name })
    const htmlFly = { x: 340, y: 830 }
    tl.to(htmlFly, {
      x: 390, y: 950, duration: 0.5, ease: 'power2.in',
      onUpdate: () => setPop(prev => ({ ...prev, responseHtml: { ...(prev.responseHtml || {}), x: htmlFly.x - 340, y: htmlFly.y - 830 } })),
    }, t + 1.7)
    popOut(tl, t + 2.2, 'responseHtml', { duration: 0.25 })
    // css-document — fly kedua
    popIn(tl, t + 1.65, 'responseCss', { duration: 0.3, fromY: -30, ease: 'back.out(1.8)', sfx: true, sfxName: SFX_MAP.TICK.name })
    const cssFly = { x: 410, y: 830 }
    tl.to(cssFly, {
      x: 410, y: 950, duration: 0.5, ease: 'power2.in',
      onUpdate: () => setPop(prev => ({ ...prev, responseCss: { ...(prev.responseCss || {}), x: cssFly.x - 410, y: cssFly.y - 830 } })),
    }, t + 1.95)
    popOut(tl, t + 2.45, 'responseCss', { duration: 0.25 })
    // js-document — fly ketiga
    popIn(tl, t + 1.9, 'responseJs', { duration: 0.3, fromY: -30, ease: 'back.out(1.8)', sfx: true, sfxName: SFX_MAP.TICK.name })
    const jsFly = { x: 480, y: 830 }
    tl.to(jsFly, {
      x: 430, y: 950, duration: 0.5, ease: 'power2.in',
      onUpdate: () => setPop(prev => ({ ...prev, responseJs: { ...(prev.responseJs || {}), x: jsFly.x - 480, y: jsFly.y - 830 } })),
    }, t + 2.2)
    popOut(tl, t + 2.7, 'responseJs', { duration: 0.25 })

    // beat 3: TITIK BALIK — STEMPEL jatuh (200 utama, 404 & 500 varian).
    // MOMEN PALING EPIK: shockwave 3-ring + starburst + screen flash.
    // Revisi-06 A.1: titik jatuh digeser dari (410,950) → (410,935) —
    // amplop closed persis di (410,950), jadi stempel yang tadinya numpuk
    // penuh di atas badan amplop sekarang sedikit naik (lipatan amplop
    // masih "mengintip" di bawah, lihat render `stampMain` + Stamp
    // size 1.15→0.9). Ditambah impact-ray biar jatuhnya kebaca 1 momen
    // yang disengaja, bukan 2 icon numpuk asal.
    tl.add(() => {
      setStampShown(true)
      sfxLoader.impact(SFX_MAP.IMPACT.name, { volume, speed })
    }, t + 3.0)
    popIn(tl, t + 3.0, 'stampMain', { duration: 0.5, ease: 'back.out(2.2)', sfx: false })
    triggerShockWave(tl, t + 3.0, 410, 935, COLORS.SUCCESS)
    triggerBurst(tl, t + 3.0, 410, 935, [COLORS.SUCCESS, '#FBBF24'], 12)
    triggerImpactRays(tl, t + 3.0, 410, 935, COLORS.SUCCESS, 10, 1.1)
    triggerFlash(tl, t + 3.0, '#ffffff', 0.5, 0.4)
    tl.add(() => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume, speed }), t + 3.4)
    popIn(tl, t + 3.6, 'stampVariant0', { duration: 0.3, sfx: true, sfxName: SFX_MAP.ERROR_BEEP.name, sfxCategory: 'warnings', volumeMult: 0.5 })
    triggerShockWave(tl, t + 3.6, 250, 1010, COLORS.ERROR)
    popIn(tl, t + 3.8, 'stampVariant1', { duration: 0.3, sfx: true, sfxName: SFX_MAP.ERROR_BEEP.name, sfxCategory: 'warnings', volumeMult: 0.5 })
    // Caption kode status — DIHAPUS, Stamp sudah render code+label-nya
    // sendiri langsung di bawah icon stempel (lihat komponen `Stamp`).

    // Revisi-13 §F — popOut stamp sebelum amplop tersegel & terbang
    popOut(tl, t + 5.2, 'stampMain',     { duration: 0.3 })
    popOut(tl, t + 5.2, 'stampVariant0', { duration: 0.3 })
    popOut(tl, t + 5.2, 'stampVariant1', { duration: 0.3 })

    // Revisi-15: stempel besar tadi cuma "slam" lalu ilang gitu aja —
    // kode statusnya sendiri gak pernah ikut balik ke browser. Sekarang
    // versi mini-nya (stampRider) nempel di pojok amplop response dan
    // ikut terbang sampai browser (render: AnchorG mengikuti
    // replyEnvelopePos), baru popOut pas amplop dibuka lagi di Act 4.
    popIn(tl, t + 5.3, 'stampRider', { duration: 0.3, ease: 'back.out(1.8)', sfx: false })

    // beat 4: PAYOFF — amplop tersegel, terbang balik ke client
    tl.add(() => {
      setReplyEnvelopeSealed(true)
      setPathProgress(3)
      sfxLoader.impact(SFX_MAP.LOCK.name, { volume, speed })
    }, t + 5.4)
    // Revisi-15: dulu lurus vertikal (410,950)→(410,400), padahal garis
    // hijau (RETURN_POINTS) lewat kiri dulu via (210,620). Amplop sekarang
    // dipecah 2 tween ngikutin waypoint yang sama biar gak "bolong ke
    // atas" nyimpang dari benangnya sendiri.
    const fly3a = { x: 410, y: 950 }
    tl.to(fly3a, {
      x: 210, y: 620, duration: 0.5, ease: 'power2.inOut',
      onStart: () => {
        sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed })
        setActiveNode('browser')
      },
      onUpdate: () => {
        setReplyEnvelopePos({ x: fly3a.x, y: fly3a.y })
        pushTrail(fly3a.x, fly3a.y)
      },
    }, t + 5.6)
    const fly3b = { x: 210, y: 620 }
    tl.to(fly3b, {
      x: 410, y: 400, duration: 0.5, ease: 'power2.out',
      onUpdate: () => {
        setReplyEnvelopePos({ x: fly3b.x, y: fly3b.y })
        pushTrail(fly3b.x, fly3b.y)
      },
    }, t + 6.1)
    // returnPathPct: Server→Browser menyala hijau seiring amplop terbang balik
    const ret1 = { v: 0 }
    tl.to(ret1, {
      v: 1.0, duration: 1.0, ease: 'power2.out',
      onUpdate: () => setReturnPathPct(ret1.v),
    }, t + 5.6)
    // REPLY_SEALED_CAPTION ('Terbang balik!') — DIHAPUS, sudah tercakup
    // PathLabel return path "balesan jalan" yang nempel di segment ini.

    // revisi-05: seam ASLI (Act baru 3 → Act baru 4), dipertahankan
    // 10.0s persis seperti dulu (dulu PHASES[4].duration).
    t += 10.0

    // ═══════════════ ACT BARU 4 — Amplop Dibuka Lagi (Browser Render, Payoff) ═══════════════
    // (dulu Act 6 — konten & timing TIDAK diubah, cuma nomor Act di-reindex)
    tl.add(() => {
      setPhaseIdx(3)
      setShowPage(false)
      setBrowserFilled(false)
      sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume, speed })
    }, t)
    // 'Buka amplop!' — DIHAPUS, animasi amplop kebuka sudah self-evident.

    // beat 1: SETUP — amplop dibuka lagi. Chip terbang keluar dengan
    // fromY beda-beda (staggered, bukan seragam) biar keliatan "muncrat"
    // dari amplop, bukan pop-in statis.
    tl.add(() => setReplyEnvelopeOpen(true), t + 0.3)
    // Revisi-15: stampRider yang nempel di amplop sejak Act 3 di-popOut
    // pas amplop dibuka lagi — tugasnya "bawa kode status" selesai,
    // gantiin ke rawStatusChip yang muncul beriringan.
    popOut(tl, t + 0.4, 'stampRider', { duration: 0.3 })
    popIn(tl, t + 0.5, 'rawStatusChip', { duration: 0.35, fromY: -35, ease: 'back.out(1.8)', sfx: true, sfxName: SFX_MAP.TICK.name })
    popIn(tl, t + 0.8, 'rawHeaderChip', { duration: 0.35, fromY: -20, ease: 'back.out(1.8)', sfx: true, sfxName: SFX_MAP.TICK.name })
    popIn(tl, t + 1.1, 'rawBodyChip', { duration: 0.35, fromY: -45, ease: 'back.out(1.8)', sfx: true, sfxName: SFX_MAP.TICK.name })

    // beat 2: TEGANGAN — masih data mentah. 'Status, header, body!'
    // DIHAPUS, diganti 3x IconCaption kecil ("HTML"/"CSS"/"JS") langsung
    // di bawah tiap chip icon (revisi-04 §3.5, lihat render).

    // beat 3: TITIK BALIK — browser susun jadi halaman + confetti celebration
    tl.add(() => {
      setShowPage(true)
      setBrowserFilled(true)
      sfxLoader.success(SFX_MAP.RELIEF.name, { volume, speed })
    }, t + 3.0)
    popIn(tl, t + 3.0, 'pageContent', { duration: 0.5, ease: 'power2.out', sfx: false })
    triggerFlash(tl, t + 3.0, '#ffffff', 0.2, 0.3)
    triggerConfetti(tl, t + 3.05, 410, 620, 20)
    triggerBurst(tl, t + 3.05, 410, 620, [COLORS.CLIENT, COLORS.SUCCESS, COLORS.TECHNICAL], 10)
    // pathFlash (checklist §7.5): seluruh jalur (forward biru + return
    // hijau) nyala penuh sejenak lalu dim — "journey complete" payoff.
    tl.add(() => setPathFlash(true), t + 3.1)
    tl.add(() => setPathFlash(false), t + 3.9)

    // beat 4: PAYOFF — jawab hook Act 1
    popIn(tl, t + 4.6, 'renderCaptionCard', { fromY: 10, sfx: true, sfxName: SFX_MAP.CONFIRM.name, sfxCategory: 'success' })

    // revisi-05: satu-satunya sisa referensi `PHASES[idx]` di timeline —
    // Act baru 4 (dulu Act 6) sekarang punya entry sendiri di PHASES
    // array baru (index 3), dipertahankan 8.0s persis seperti dulu.
    t += PHASES[3].duration

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

  // Anchor helper — sama seperti T()/O() tapi base position (cx, cy) BOLEH
  // dinamis (state, mis. reqEnvelopePos), dipakai buat objek yang "terbang"
  // lintas Act (amplop request/response) — bukan cuma pop-in di titik tetap.
  const AnchorG = ({ id, x, y, children }) => {
    const p = P(id)
    return (
      <g transform={`translate(${x + p.x}, ${y + p.y}) scale(${p.scale})`} opacity={p.opacity}>
        {children}
      </g>
    )
  }

  // manual word-wrap (bukan foreignObject — 05-svg-text-guide.md)
  const wrapText = (text, maxChars) => {
    const words = text.split(' ')
    const lines = []
    let cur = ''
    words.forEach(w => {
      const next = cur ? `${cur} ${w}` : w
      if (next.length > maxChars && cur) { lines.push(cur); cur = w } else { cur = next }
    })
    if (cur) lines.push(cur)
    return lines
  }

  // TextCard/Badge/SpeechBubble (box-style caption) DIHAPUS TOTAL —
  // revisi-04 §3/§5, sudah 0 pemakaian setelah semua migrasi ke
  // IconCaption/PathLabel. `wrapText` di atas masih dipakai IconCaption.

  // IconCaption (revisi-04 §3) — teks kecil TANPA box, nempel tepat di
  // bawah icon terkait. Dipakai buat ganti TextCard/Badge/SpeechBubble
  // yang tadinya berdiri sendiri (revisi-04: "minim text box, lebih
  // banyak icon"). Outline gelap (paintOrder stroke) dipakai supaya tetap
  // kebaca di atas background apapun tanpa perlu rect/pill.
  const IconCaption = ({ x, y, text, color = COLORS.TEXT, fontSize = 13, width = 220 }) => {
    const lines = wrapText(text, Math.floor(width / 7))
    const dy = 16
    return (
      <text x={x} y={y} textAnchor="middle" fontSize={fontSize} fontWeight={700} fontFamily="sans-serif"
        fill={color} style={{ paintOrder: 'stroke', stroke: COLORS.BG, strokeWidth: 4, strokeLinejoin: 'round' }}>
        {lines.map((line, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : dy}>{line}</tspan>)}
      </text>
    )
  }

  // BrowserWindow — anchor persisten Act 1..6 (03 §3.1): "rumah" client,
  // tempat amplop keluar-masuk. Muka simple (bingung/kaget) di titlebar.
  // Batch-2 (revisi-02 addendum): base rect-stacking → icon PNG
  // (tab strip + "www." bar + nav arrow udah baked-in di icon). URL text
  // asli tetap dioverlay di atas bar icon (icon-nya cuma placeholder
  // "www.", teks dinamis harus tetap SVG <text>). Spinner tetap overlay
  // SVG di pojok kanan bar. Muka client (mata+mulut) di bawah icon
  // dipertahankan — bukan bagian dari icon browser-frame, ini reaksi
  // wajah terpisah, bukan rect-stacking yang dimaksud plan buat diganti.
  const BrowserWindow = ({ x, y, url, spinDeg }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon('browser-frame')} x={-170} y={-100} width={340} height={200} filter="url(#shadow)" />
      <text x={-80} y={-79} fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>{url}</text>
      <g transform="translate(70, -78)" stroke={COLORS.CLIENT} strokeWidth={3} fill="none" strokeLinecap="round">
        <g transform={`rotate(${spinDeg})`}>
          <path d="M 0 -10 A 10 10 0 0 1 8 6" opacity={0.9} />
        </g>
        <circle r={10} stroke={COLORS.BORDER} strokeWidth={2} opacity={0.4} />
      </g>
    </g>
  )

  // Envelope — anchor object, dipakai lagi Act 2–6 (request & response,
  // 2 instance beda per plan §Persistent Anchor Objects). Icon PNG
  // (`envelope-closed`/`envelope-open`) netral abu-abu, `color` di-tint
  // per-instance via SVG feColorMatrix filter (request = CLIENT biru,
  // response = SUCCESS hijau, biar gak ketuker) — TEKNIK BARU, belum ada
  // preseden di codebase lain, cek hasilnya pas preview manual.
  const hexToRgb01 = (hex) => {
    const n = parseInt(hex.replace('#', ''), 16)
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
  }
  const Envelope = ({ x, y, blurred = false, open = false, sealed = false, color = COLORS.NETWORK }) => {
    const [r, g, b] = hexToRgb01(color)
    const filterId = `envelopeTint-${color.replace('#', '')}`
    return (
      <g transform={`translate(${x},${y})`} opacity={blurred ? 0.55 : 1}>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feColorMatrix type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 1 0`} />
        </filter>
        {open ? (
          <image href={getIcon('envelope-open')} x={-55} y={-78} width={110} height={116} filter={`url(#${filterId})`} />
        ) : (
          <image href={getIcon('envelope-closed')} x={-55} y={-38} width={110} height={76} filter={`url(#${filterId})`} />
        )}
        {/* revisi-06 B.5 — wax-seal ribbon: cuma nongol pas tertutup &
            tersegel, kesan "surat resmi" tanpa nambah PNG baru. */}
        {!open && sealed && (
          <g>
            <path d="M -9 2 Q 0 17 9 2" fill="none" stroke={COLORS.TEXT} strokeWidth={2} opacity={0.5} strokeLinecap="round" />
            <circle cx={0} cy={0} r={6} fill={color} stroke={COLORS.BG} strokeWidth={1.5} />
          </g>
        )}
      </g>
    )
  }

  // AddressBook — buku alamat DNS, Act 3 saja (bukan anchor persisten,
  // tidak dilist di plan §Persistent Anchor Objects). Icon PNG netral,
  // tetap 100×80 sesuai footprint shape lama (§6.2 centering formula).
  const AddressBook = ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon('address-book')} x={-50} y={-40} width={100} height={80} />
    </g>
  )

  // ServerBuilding — anchor persisten Act 3..5 (plan: "Gedung/karakter
  // server"). Batch-2 (revisi-02 addendum): base jadi icon PNG
  // (rack-server + antena udah baked-in di icon). Pintu ketuk (Act 3)
  // dipertahankan sebagai overlay SVG rotate — icon-nya sendiri gak punya
  // slot pintu, jadi ini "pintu imajiner" yang nempel di sisi kiri-bawah
  // icon; kalau kurang pas posisinya pas preview manual, tinggal geser
  // offset -22/40 di bawah ini.
  const ServerBuilding = ({ x, y, open }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon('server-building')} x={-70} y={-90} width={140} height={140} filter="url(#shadow)" />
      {open && <image href={getIcon('server-active')} x={-70} y={-90} width={140} height={140} opacity={0.6} />}
    </g>
  )

  // Officer — karakter petugas server, anchor persisten Act 4..5. Batch-2
  // (revisi-02 addendum): 3 ekspresi PNG (neutral/thinking/happy) di-swap
  // via opacity, bukan inline SVG muka lagi — swap instan (bukan GSAP
  // tween cross-fade) karena state boolean cuma flip di 1 titik waktu per
  // Act, cross-fade halus bisa jadi tambahan kalau kepakai di preview.
  const Officer = ({ x, y, thinking, happy }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon('officer-neutral')} x={-40} y={-40} width={80} height={80}
        opacity={!thinking && !happy ? 1 : 0} />
      <image href={getIcon('officer-thinking')} x={-40} y={-40} width={80} height={80}
        opacity={thinking ? 1 : 0} />
      <image href={getIcon('officer-happy')} x={-40} y={-40} width={80} height={80}
        opacity={happy ? 1 : 0} />
    </g>
  )

  // Stamp — stempel status code, "aha moment" paling penting Act 5.
  // Batch-2 (revisi-02 addendum): ganti drawing lingkaran+text jadi icon
  // PNG stempel (APPROVED/REJECTED sudah ada teksnya di icon sendiri).
  // Kode angka (200/404/500) TIDAK dioverlay di tengah icon — center icon
  // sudah penuh sama checkmark/X besar, numpuk teks di situ bakal susah
  // dibaca. Kode + label taruh di badge kecil di BAWAH stempel instead.
  const Stamp = ({ x, y, code, label, color, size = 1, rotate = -8 }) => {
    const approved = color === COLORS.SUCCESS
    return (
      <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${size})`}>
        <image href={getIcon(approved ? 'stamp-approved' : 'stamp-rejected')}
          x={-46} y={-46} width={92} height={92} />
        <g transform="translate(0, 62)">
          <rect x={-30} y={-14} width={60} height={28} rx={14} fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
          <text textAnchor="middle" y={-1} fontSize={14} fontWeight={900} fontFamily="'Arial Black', Impact, sans-serif" fill={color}>{code}</text>
          <text textAnchor="middle" y={11} fontSize={7} fontWeight={700} fontFamily="sans-serif" fill={color}>{label}</text>
        </g>
      </g>
    )
  }

  // ── "Maximum Animation" render components (revisi-02 §B/§D) ──

  // StarField — 30 bintang background statik, opacity rendah, posisi
  // deterministic (seededRandom01, bukan Math.random).
  const StarField = () => (
    <g opacity={0.35}>
      {Array.from({ length: 30 }).map((_, i) => {
        const sx = seededRandom01(i * 3.1) * VW
        const sy = seededRandom01(i * 7.7 + 1) * VH
        const r = 0.8 + seededRandom01(i * 5.3 + 2) * 1.4
        return <circle key={i} cx={sx} cy={sy} r={r} fill={COLORS.TEXT} />
      })}
    </g>
  )

  const StarBurstsLayer = () => (
    <g>
      {starBursts.map(b => (
        <g key={b.id} transform={`translate(${b.cx},${b.cy})`}>
          {b.particles.map(p => {
            const dist = p.dist * b.p
            const px = Math.cos(p.angle) * dist
            const py = Math.sin(p.angle) * dist
            const op = 1 - b.p
            return (
              <path key={p.pid}
                d="M 0 -4 L 1.2 -1 L 4 0 L 1.2 1 L 0 4 L -1.2 1 L -4 0 L -1.2 -1 Z"
                fill={p.color} opacity={op}
                transform={`translate(${px},${py}) scale(${0.6 + b.p * 0.6})`} />
            )
          })}
        </g>
      ))}
    </g>
  )

  const ShockWavesLayer = () => (
    <g>
      {shockWaves.map(w => (
        <circle key={w.id} cx={w.cx} cy={w.cy} r={10 + w.p * 70}
          fill="none" stroke={w.color} strokeWidth={3} opacity={1 - w.p} />
      ))}
    </g>
  )

  // Revisi-06 A.1 — impact-ray layer (garis radiasi gaya komik "BAM"),
  // dipicu bareng stempel jatuh supaya numpuknya stempel×amplop kebaca
  // sebagai 1 momen impact, bukan 2 icon nabrak. Murni SVG, no new icon.
  const ImpactRaysLayer = () => (
    <g>
      {impactRays.map(r => (
        <g key={r.id} transform={`translate(${r.cx},${r.cy})`}>
          {r.rays.map(ray => {
            const innerR = 16 + r.p * 8
            const outerR = 16 + r.p * (48 + Math.sin(ray.angle * 3) * 5)
            const x1 = Math.cos(ray.angle) * innerR
            const y1 = Math.sin(ray.angle) * innerR
            const x2 = Math.cos(ray.angle) * outerR
            const y2 = Math.sin(ray.angle) * outerR
            const op = Math.max(0, 1 - r.p * 1.2)
            return (
              <line key={ray.rid} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={r.color} strokeWidth={3} strokeLinecap="round" opacity={op} />
            )
          })}
        </g>
      ))}
    </g>
  )

  // DualColorPath (revisi-03 §1.5 → revisi-16 rework).
  // Revisi-16: jalur forward dipisah jadi 3 bagian logis:
  //   1. FORWARD main  : Browser(410,260) → waypoint(410,700) → stop(410,620) → Server(410,900)
  //      = biru CLIENT, lurus vertikal sisi kanan, gak nyerong ke DNS icon
  //   2. DNS request   : surat(410,620) → DNS(610,620) (mendatar ke kanan)
  //      = biru putus-putus tipis, hanya muncul saat amplop ada di DNS zone
  //   3. DNS return IP : DNS(610,620) → surat(410,620) (balik ke kiri)
  //      = kuning NETWORK, muncul setelah IP ketemu (dnsReturnPct 0→1)
  //   4. RETURN        : Server(410,900) → via kiri(210,620) → Browser(410,260)
  //      = hijau SUCCESS
  // `forwardPathPct`/`dnsReturnPct`/`returnPathPct` kontrol per-jalur.
  // `pathFlash` override semua opacity ke 1 (Act 6 payoff).
  const FORWARD_POINTS = [
    { x: 410, y: 260 },  // Browser
    { x: 410, y: 700 },  // Amplop Act 1 waypoint (Revisi-12)
    { x: 410, y: 620 },  // Stop zone DNS (surat berhenti, bukan DNS icon-nya)
    { x: 410, y: 900 },  // Server
  ]
  // Dua sub-garis DNS (horizontal): minta IP dan return IP
  const DNS_REQUEST_LINE = [{ x: 410, y: 620 }, { x: 610, y: 620 }]
  const DNS_RETURN_LINE  = [{ x: 610, y: 620 }, { x: 410, y: 620 }]
  const RETURN_POINTS = [
    { x: 410, y: 900 },
    { x: 210, y: 620 },
    { x: 410, y: 260 },
  ]
  const DualColorPath = () => {
    const renderSegments = (points, pct, color, arrowIcon) => points.slice(0, -1).map((pt, i) => {
      const next = points[i + 1]
      const segStart = i / (points.length - 1)
      const segEnd = (i + 1) / (points.length - 1)
      const segPct = Math.max(0, Math.min(1, (pct - segStart) / (segEnd - segStart)))
      const lit = segPct > 0
      const mx = (pt.x + next.x) / 2
      const my = (pt.y + next.y) / 2
      const angle = Math.atan2(next.y - pt.y, next.x - pt.x) * (180 / Math.PI)
      return (
        <g key={i}>
          <line x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
            stroke={COLORS.BORDER} strokeWidth={2} strokeDasharray="6 6" opacity={0.2} />
          <line x1={pt.x} y1={pt.y} x2={lerp(pt.x, next.x, segPct)} y2={lerp(pt.y, next.y, segPct)}
            stroke={color} strokeWidth={3} strokeDasharray="6 6"
            opacity={pathFlash ? 1 : (lit ? 0.85 : 0)} />
          {lit && (
            <image href={getIcon(arrowIcon)} x={mx - 12} y={my - 12} width={24} height={24}
              opacity={pathFlash ? 1 : 0.8} transform={`rotate(${angle}, ${mx}, ${my})`} />
          )}
        </g>
      )
    })

    // Sub-garis DNS — satu segmen horizontal, pct langsung (0..1)
    const renderDnsLine = (pts, pct, color, arrowIcon, dash = '5 4', label = '') => {
      const [a, b] = pts
      if (pct <= 0 && !pathFlash) return null
      const p = pathFlash ? 1 : pct
      const mx = (a.x + b.x) / 2
      const my = (a.y + b.y) / 2
      const angle = Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI)
      // label offset: selalu di atas garis (y-16), di tengah segmen
      const labelOpacity = Math.min(1, p * 4)
      return (
        <g>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={COLORS.BORDER} strokeWidth={1.5} strokeDasharray={dash} opacity={0.15} />
          <line x1={a.x} y1={a.y} x2={lerp(a.x, b.x, p)} y2={lerp(a.y, b.y, p)}
            stroke={color} strokeWidth={2.5} strokeDasharray={dash}
            opacity={pathFlash ? 1 : 0.8} />
          {p > 0.4 && (
            <image href={getIcon(arrowIcon)} x={mx - 11} y={my - 11} width={22} height={22}
              opacity={pathFlash ? 1 : 0.75} transform={`rotate(${angle}, ${mx}, ${my})`} />
          )}
          {label && labelOpacity > 0 && (
            <text x={mx} y={my - 16} textAnchor="middle" fontSize={12} fontWeight={700}
              fontFamily="sans-serif" fill={color} opacity={labelOpacity}
              style={{ paintOrder: 'stroke', stroke: COLORS.BG, strokeWidth: 4, strokeLinejoin: 'round' }}>
              {label}
            </text>
          )}
        </g>
      )
    }

    return (
      <g>
        {renderSegments(FORWARD_POINTS, forwardPathPct, COLORS.CLIENT, 'path-forward-arrow')}
        {/* DNS request: surat→DNS (biru, label "minta IP") */}
        {renderDnsLine(DNS_REQUEST_LINE, forwardPathPct >= 0.5 ? 1 : 0, COLORS.CLIENT, 'path-forward-arrow', '5 4', 'minta IP')}
        {/* DNS return IP: DNS→surat (kuning, label "dapat IP!") */}
        {renderDnsLine(DNS_RETURN_LINE, dnsReturnPct, COLORS.NETWORK, 'path-return-arrow', '5 4', 'dapat IP!')}
        {renderSegments(RETURN_POINTS, returnPathPct, COLORS.SUCCESS, 'path-return-arrow')}
      </g>
    )
  }

  // PathLabel (revisi-04 §2) — teks pendek yang nempel & bergerak di
  // titik segment path yang lagi menyala, ikut `pct` (forwardPathPct /
  // returnPathPct). Konsep: penonton yang lagi ngikutin "benang" jalan
  // otomatis lewatin teks ini, jadi gak perlu lirik ke caption bar bawah.
  // Teks per-segment dikonfirmasi user 2026-09-10 (buka Open Questions
  // revisi-04.md): "cari alamat" / "connect" (forward), "balesan jalan"
  // (return, segment tunggal).
  const PathLabel = ({ points, pct, labels, color }) => {
    if (pct <= 0) return null
    const segCount = points.length - 1
    let segIdx = Math.min(segCount - 1, Math.floor(pct * segCount))
    const segStart = segIdx / segCount
    const segEnd = (segIdx + 1) / segCount
    const segPct = Math.max(0, Math.min(1, (pct - segStart) / (segEnd - segStart)))
    const text = labels[segIdx]
    if (!text || segPct <= 0) return null
    const pt = points[segIdx]
    const next = points[segIdx + 1]
    const mx = lerp(pt.x, next.x, 0.5)
    const my = lerp(pt.y, next.y, 0.5)
    const fadeIn = Math.min(1, segPct * 5)
    const fadeOut = segPct > 0.85 ? Math.max(0, (1 - segPct) / 0.15) : 1
    const opacity = Math.min(fadeIn, fadeOut)
    return (
      <text x={mx} y={my - 18} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="sans-serif"
        fill={color} opacity={opacity}
        style={{ paintOrder: 'stroke', stroke: COLORS.BG, strokeWidth: 4, strokeLinejoin: 'round' }}>
        {text}
      </text>
    )
  }
  // Revisi-16: label ikut FORWARD_POINTS baru — seg 0: Browser→700,
  // seg 1: 700→620 (turun ke stop zone, amplop berhenti di DNS zone),
  // seg 2: 620→Server (koneksi setelah IP dapet).
  // "cari alamat" sudah di garis DNS horizontal (renderDnsLine inline).
  // Revisi-17: seg 0 = 'surat keluar' (amplop baru aja berangkat dari
  // browser), seg 1 = '' (kosong, stop zone — amplop diam nunggu DNS),
  // seg 2 = 'nyambung ke server' (lebih deskriptif dari 'connect').
  const FORWARD_PATH_LABELS = ['surat keluar', '', 'nyambung ke server']
  const RETURN_PATH_LABELS = ['balesan jalan']

  // Revisi-06 B.4 — "you are here" pin: satu titik fokus (pin segitiga)
  // yang gerak persis di ujung segmen yang lagi menyala, di atas
  // DualColorPath yang cuma "garis nyala" tanpa 1 penanda posisi jelas.
  const pointOnPath = (points, pct) => {
    const segCount = points.length - 1
    const segIdxF = Math.max(0, Math.min(0.999999, pct)) * segCount
    const segIdx = Math.min(segCount - 1, Math.floor(segIdxF))
    const segPct = segIdxF - segIdx
    const pt = points[segIdx]
    const next = points[segIdx + 1]
    return { x: lerp(pt.x, next.x, segPct), y: lerp(pt.y, next.y, segPct) }
  }
  const PathPin = ({ points, pct, color }) => {
    if (pct <= 0 || pct >= 1) return null
    const { x, y } = pointOnPath(points, pct)
    return (
      <g transform={`translate(${x},${y})`} filter="url(#glow)">
        <path d="M 0 -13 L 7 1 L 0 -3 L -7 1 Z" fill={color} stroke={COLORS.BG} strokeWidth={1.2} />
      </g>
    )
  }

  // NodeGlow (revisi-03 §1.2) — wrap di atas node icon existing (browser/
  // dns/server), scale-pulse + drop-shadow pas node lagi aktif
  // (`activeNode` match). Dipakai sebagai overlay ring, BUKAN ganti icon
  // node yang sudah ada (biar gak perlu rombak BrowserWindow dkk).
  const [nodeGlowPulse, setNodeGlowPulse] = useState(0)
  useEffect(() => {
    let raf
    const tick = () => {
      setNodeGlowPulse((Date.now() / 500) % (Math.PI * 2))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const NodeGlow = ({ x, y, active, color, r = 78 }) => {
    if (!active) return null
    const pulse = 1 + Math.sin(nodeGlowPulse) * 0.06
    return (
      <circle cx={x} cy={y} r={r * pulse} fill="none" stroke={color} strokeWidth={3}
        opacity={0.5 + Math.sin(nodeGlowPulse) * 0.15} filter="url(#glow)" />
    )
  }

  // Revisi-07 §B — NodeLabel: teks kecil monospace di bawah node
  // flowchart (Browser/DNS/Server), biar jelas "garis ini hubungin
  // siapa ke siapa" tanpa perlu badge pill baru. Murni SVG <text>.
  const NodeLabel = ({ x, y, text, color, opacity = 1 }) => (
    <text x={x} y={y} textAnchor="middle" fontSize={10} fontFamily="monospace"
      fill={color} opacity={opacity * 0.85} letterSpacing={0.5}>
      {text}
    </text>
  )

  // Revisi-14 §B — DnsGateway: visual "gerbang routing" DNS.
  // 3 server kandidat muncul dari DNS, satu terpilih (tengah = server kita),
  // yang lain dim fade. dnsRoutingPct 0→1: fase 0→0.4 semua nongol,
  // 0.4→0.7 tengah highlight, 0.7→1.0 kiri/kanan fade out.
  const DnsGateway = () => {
    if (!dnsGatewayShown) return null
    const p = dnsRoutingPct
    // kandidat: kiri dim, tengah = terpilih, kanan dim
    const allIn = Math.min(1, p / 0.4)
    const midHL = p > 0.4 ? Math.min(1, (p - 0.4) / 0.3) : 0
    const sidesOut = p > 0.7 ? Math.min(1, (p - 0.7) / 0.3) : 0
    const sideOp = allIn * (1 - sidesOut * 0.85)
    const midOp = allIn
    // posisi relatif ke DNS center (610, 620) — di translate(0,90) wrapper
    // jadi absolut (610, 710)
    const DNS = { x: 610, y: 620 }
    const candidates = [
      { x: DNS.x - 120, y: DNS.y + 140, label: 'server-2', op: sideOp, selected: false },
      { x: DNS.x,       y: DNS.y + 160, label: 'server-1', op: midOp,  selected: true  },
      { x: DNS.x + 120, y: DNS.y + 140, label: 'server-3', op: sideOp, selected: false },
    ]
    return (
      <g>
        {candidates.map((c) => {
          const color = c.selected ? COLORS.SERVER : COLORS.BORDER
          const pulse = c.selected ? (1 + Math.sin(nodeGlowPulse * 2) * 0.1 * midHL) : 1
          return (
            <g key={c.label} opacity={c.op}>
              {/* garis putus dari DNS ke kandidat */}
              <line x1={DNS.x} y1={DNS.y + 45} x2={c.x} y2={c.y - 18}
                stroke={c.selected ? COLORS.SERVER : COLORS.BORDER}
                strokeWidth={c.selected ? 2.5 : 1.5}
                strokeDasharray={c.selected ? 'none' : '5 5'}
                opacity={c.selected ? (0.5 + midHL * 0.5) : 0.4} />
              {/* node kandidat */}
              <circle cx={c.x} cy={c.y} r={18 * pulse} fill={COLORS.PANEL}
                stroke={color} strokeWidth={c.selected ? 2.5 : 1.5}
                opacity={c.selected ? (0.6 + midHL * 0.4) : 1} />
              {/* server icon mini inline */}
              <rect x={c.x - 7} y={c.y - 8} width={14} height={5} rx={1}
                fill={color} opacity={c.selected ? (0.5 + midHL * 0.5) : 0.3} />
              <rect x={c.x - 7} y={c.y - 1} width={14} height={5} rx={1}
                fill={color} opacity={c.selected ? (0.5 + midHL * 0.5) : 0.3} />
              <rect x={c.x - 7} y={c.y + 6} width={14} height={5} rx={1}
                fill={color} opacity={c.selected ? (0.5 + midHL * 0.5) : 0.3} />
              {/* label kecil */}
              <text x={c.x} y={c.y + 30} textAnchor="middle" fontSize={8}
                fontFamily="monospace" fill={color}
                opacity={c.selected ? (0.4 + midHL * 0.6) : 0.35}>
                {c.label}
              </text>
              {/* glow terpilih */}
              {c.selected && midHL > 0 && (
                <circle cx={c.x} cy={c.y} r={28 * pulse} fill="none"
                  stroke={COLORS.SERVER} strokeWidth={2} opacity={midHL * 0.4}
                  filter="url(#glow)" />
              )}
            </g>
          )
        })}
        {/* label "routing..." di tengah atas */}
        <text x={DNS.x} y={DNS.y + 80} textAnchor="middle" fontSize={9}
          fontFamily="monospace" fill={COLORS.NETWORK}
          opacity={allIn * (1 - sidesOut)}>
          routing...
        </text>
      </g>
    )
  }

  // Revisi-06 B.2 — RadarPing: 3 ring mengembang-fade bergantian (gaya
  // sinyal Wi-Fi/radar), nyala selama `active` (gated `dnsSearching`,
  // hidup barengan icon dns-magnify). Reuse `nodeGlowPulse` yang sudah
  // ada (rAF loop), gak nambah loop baru. Murni SVG, no new icon.
  const RadarPing = ({ x, y, color, active }) => {
    if (!active) return null
    const base = nodeGlowPulse / (Math.PI * 2)
    return (
      <g transform={`translate(${x},${y})`}>
        {[0, 0.33, 0.66].map((offset, i) => {
          const p = (base + offset) % 1
          return (
            <circle key={i} r={18 + p * 60} fill="none" stroke={color} strokeWidth={2}
              opacity={Math.max(0, 0.55 - p * 0.55)} />
          )
        })}
      </g>
    )
  }

  // ThoughtBubble (revisi-03 §2) — SVG bubble organik di atas officer,
  // satu slot icon di tengah, di-swap via `thoughtBubbleIcon` state.
  const ThoughtBubble = ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      <circle cx={6} cy={38} r={5} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.5} />
      <circle cx={16} cy={26} r={8} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.5} />
      <ellipse cx={0} cy={0} rx={46} ry={36} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={2} />
      {thoughtBubbleIcon && (
        <image href={getIcon(thoughtBubbleIcon)} x={-18} y={-18} width={36} height={36} />
      )}
    </g>
  )

  const PulseRing = ({ x, y, p, color }) => (
    <circle cx={x} cy={y} r={20 + p * 40} fill="none" stroke={color} strokeWidth={2} opacity={(1 - p) * 0.6} />
  )

  const ConfettiLayer = () => (
    <g>
      {confettiPieces.map(c => (
        <g key={c.id}>
          {c.pieces.map(p => {
            const px = c.cx + p.vx * c.p
            const py = c.cy + p.vy * c.p + 220 * c.p * c.p
            const op = 1 - c.p
            return (
              <rect key={p.pid} x={-3} y={-3} width={6} height={6} fill={p.color} opacity={op}
                transform={`translate(${px},${py}) rotate(${p.rot + c.p * 360})`} />
            )
          })}
        </g>
      ))}
    </g>
  )

  // ThinkingDotsAnim — 3 dots bounce naik-turun bergelombang (bukan
  // statis), digerakkan `thinkProg` (0→3, dipakai modulo per-dot).
  const ThinkingDotsAnim = ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      {[0, 1, 2].map(i => {
        const localPhase = (thinkProg + i * 0.25) % 1
        const bounce = Math.sin(localPhase * Math.PI * 2) * 6
        return <circle key={i} cx={(i - 1) * 14} cy={bounce} r={4} fill={COLORS.MUTED} />
      })}
    </g>
  )

  // EnvelopeTrail — comet dots di belakang amplop yang lagi terbang.
  const EnvelopeTrail = ({ color }) => (
    <g>
      {envelopeTrail.map((pt, i) => {
        const op = ((i + 1) / envelopeTrail.length) * 0.5
        const r = 3 + (i / Math.max(1, envelopeTrail.length)) * 4
        return <circle key={i} cx={pt.x} cy={pt.y} r={r} fill={color} opacity={op} />
      })}
    </g>
  )

  // Revisi-06 B.3 — MotionStreaks: garis penghubung antar titik trail
  // (reuse `envelopeTrail` yang sama, gak nambah state/timeline baru),
  // nambahin kesan "kecepatan" di atas comet-dots yang sudah ada. Murni
  // SVG, no new icon.
  const MotionStreaks = ({ color }) => {
    if (envelopeTrail.length < 2) return null
    return (
      <g>
        {envelopeTrail.slice(0, -1).map((pt, i) => {
          const next = envelopeTrail[i + 1]
          const op = ((i + 1) / envelopeTrail.length) * 0.3
          const w = 1 + (i / Math.max(1, envelopeTrail.length)) * 3
          return (
            <line key={i} x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
              stroke={color} strokeWidth={w} strokeLinecap="round" opacity={op} />
          )
        })}
      </g>
    )
  }

  // PageContent — halaman web hasil render, payoff Act 6 (nutup loop
  // Act 1): baris teks sederhana mensimulasikan halaman jadi.
  const PageContent = ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-140} y={-52} width={280} height={104} rx={6} fill={COLORS.BG} stroke={COLORS.CLIENT} strokeWidth={1.5} />
      <rect x={-124} y={-38} width={140} height={12} rx={3} fill={COLORS.CLIENT} opacity={0.7} />
      <rect x={-124} y={-16} width={248} height={7} rx={2} fill={COLORS.MUTED} opacity={0.5} />
      <rect x={-124} y={-2} width={248} height={7} rx={2} fill={COLORS.MUTED} opacity={0.5} />
      <rect x={-124} y={12} width={180} height={7} rx={2} fill={COLORS.MUTED} opacity={0.5} />
      <rect x={-124} y={28} width={90} height={18} rx={9} fill={COLORS.SUCCESS} opacity={0.8} />
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
        {/* Revisi-06 B.1 — ambient zone-tint radial gradient, satu per
            "lokasi cerita" (Browser/DNS/Server). Pakai COLORS yang sudah
            ada, bukan palet baru. Murni SVG, no new icon. */}
        <radialGradient id="zoneTintClient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.CLIENT} stopOpacity={1} />
          <stop offset="100%" stopColor={COLORS.CLIENT} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="zoneTintNetwork" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.NETWORK} stopOpacity={1} />
          <stop offset="100%" stopColor={COLORS.NETWORK} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="zoneTintServer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.SERVER} stopOpacity={1} />
          <stop offset="100%" stopColor={COLORS.SERVER} stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.CLIENT} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.CLIENT} strokeWidth={1} />)}
      </g>

      {/* ── HEADER (hero thumbnail → compact header morph) ── */}
      {(() => {
        const mp = morphP
        const thumbWidth = 460
        const startX = (VW / 2) - (thumbWidth / 2)
        const endX = 44
        const taglineX = lerp(startX, endX, mp)
        const taglineY = lerp(550, 50, mp)
        const taglineFs = lerp(16, 13, mp)
        const titleX = lerp(startX, endX, mp)
        const titleY = lerp(640, 100, mp)
        const titleFs = lerp(40, 32, mp)
        const subX = lerp(startX, endX, mp)
        const subY = lerp(716, 130, mp)
        const subFs = lerp(18, 15, mp)

        const titleSplitIdx = 4 // "HTTP" (hijau, standar warna intro project) | " REQUEST-RESPONSE" (biru)
        const tt = typed.title
        const cursorColor = tt.length <= titleSplitIdx ? COLORS.SUCCESS : COLORS.CLIENT

        return (
          <g>
            <text x={taglineX} y={taglineY} textAnchor="start"
              fill={COLORS.MUTED} fontSize={taglineFs} fontFamily="monospace" letterSpacing={3}>
              {INTRO_CATEGORY} · <tspan fill={COLORS.SUCCESS} fontWeight={700}>ADIB-DEV.COM</tspan>
            </text>
            <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
              fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} filter="url(#glow)">
              <tspan fill={COLORS.SUCCESS}>{tt.slice(0, titleSplitIdx)}</tspan>
              <tspan fill={COLORS.CLIENT}>{tt.slice(titleSplitIdx)}</tspan>
              {showIntro && tt.length < INTRO_TITLE.length && cursorVisible && (
                <tspan fill={cursorColor} fontWeight={900}>█</tspan>
              )}
            </text>
            <text x={subX} y={subY} textAnchor="start" fontSize={subFs}
              fontFamily="sans-serif" fill={COLORS.MUTED}>
              {typed.subtitle}
              {showIntro && tt.length === INTRO_TITLE.length &&
                typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
                <tspan fill={COLORS.SUCCESS} fontWeight={900}>█</tspan>
              )}
            </text>
          </g>
        )
      })()}

      {!showIntro && (
      <g>
        <StarField />
        {/* Revisi-06 B.1 — ambient zone-tint: penonton "merasa" pindah
            lokasi (Browser/DNS/Server) lewat warna latar, gak cuma baca
            badge teks. Opacity naik dikit pas `activeNode` lagi di zona
            itu, biar nyambung sama NodeGlow yang sudah ada. */}
        <g transform="translate(0, 90)" style={{ transition: 'opacity 0.4s' }}>
          <ellipse cx={410} cy={260} rx={340} ry={260} fill="url(#zoneTintClient)"
            opacity={activeNode === 'browser' ? 0.14 : 0.05} />
          <ellipse cx={610} cy={620} rx={300} ry={240} fill="url(#zoneTintNetwork)"
            opacity={activeNode === 'dns' ? 0.16 : 0.05} />
          <ellipse cx={410} cy={900} rx={340} ry={280} fill="url(#zoneTintServer)"
            opacity={activeNode === 'server' ? 0.16 : 0.05} />
        </g>
        <g transform="translate(0, 90)">
          <DualColorPath />
          <PathLabel points={FORWARD_POINTS} pct={forwardPathPct} labels={FORWARD_PATH_LABELS} color={COLORS.CLIENT} />
          <PathLabel points={RETURN_POINTS} pct={returnPathPct} labels={RETURN_PATH_LABELS} color={COLORS.SUCCESS} />
          {/* revisi-06 B.4: 1 titik fokus "posisi surat sekarang" */}
          <PathPin points={FORWARD_POINTS} pct={forwardPathPct} color={COLORS.CLIENT} />
          <PathPin points={RETURN_POINTS} pct={returnPathPct} color={COLORS.SUCCESS} />
        </g>

        {/* ── PHASE BADGE + dot navigator ── */}
        <g transform="translate(44, 155)">
          <rect width={560} height={40} rx={20} fill={COLORS.PANEL} stroke={phase.badgeColor} strokeWidth={1.8} filter="url(#shadow)" />
          <circle cx={22} cy={20} r={6} fill={phase.badgeColor} filter="url(#glow)" />
          <text x={40} y={26} fill={phase.badgeColor} fontSize={12} fontFamily="monospace" fontWeight={700} letterSpacing={0.3}>
            {phase.badge}
          </text>
          {/* dot navigator — di LUAR pill/badge (bukan di dalam badge),
              nempel di sebelah kanan pill dengan gap, bukan overlap teks */}
          <g transform="translate(584, 20)">
            {PHASES.map((ph, i) => (
              <circle key={ph.id} cx={i * 20} cy={0}
                r={i === phaseIdx ? 7 : 4}
                fill={i === phaseIdx ? phase.badgeColor : COLORS.BORDER}
                stroke={i === phaseIdx ? '#fff' : 'none'} strokeWidth={1.5} />
            ))}
          </g>
        </g>

        {/* ═══════ BROWSER FRAME — anchor persisten Act 1..6, render di
            luar blok phaseIdx supaya gak unmount/remount tiap ganti Act
            (03 §3.1). Untuk sekarang cuma kepakai di Act 1. ═══════ */}
        <g transform="translate(0, 90)">
          <NodeGlow x={410} y={260} active={activeNode === 'browser'} color={COLORS.CLIENT} />
          <g transform={T('browserAnchor', 410, 260)} opacity={O('browserAnchor')}>
            <BrowserWindow x={0} y={0} url={HOOK_URL} spinDeg={loadingSpin} />
            {/* browser-loading (revisi-03): overlay di atas frame selama
                nunggu, browser-filled: fade in pas halaman jadi (Act 6) */}
            <image href={getIcon('browser-loading')} x={-170} y={-100} width={340} height={200}
              opacity={browserLoadingShown ? 1 : 0} style={{ transition: 'opacity 0.3s' }} />
            <image href={getIcon('browser-filled')} x={-170} y={-100} width={340} height={200}
              opacity={browserFilled ? 1 : 0} style={{ transition: 'opacity 0.4s' }} />
            {/* Revisi-07 §1.1 — highlight URL bar (browser "mau sesuatu"),
                muncul SEBELUM pertanyaan hookBubble. Posisi ngikutin teks
                URL BrowserWindow (x=-80,y=-79). Murni SVG, no new icon. */}
            <rect x={-84} y={-90} width={150} height={16} rx={3}
              fill={COLORS.CLIENT} opacity={urlHighlight * 0.25} />
            {/* cursor berkedip di ujung URL */}
            <rect x={62} y={-89} width={2} height={14}
              fill={COLORS.CLIENT} opacity={cursorBlinkOn ? 0.9 : 0} />
            {/* panah tipis browser→bawah, "browser mau sesuatu di luar
                sana" — sebelum HOOK_QUESTION muncul */}
            <g opacity={browserArrowShown ? 0.7 : 0}>
              <line x1={0} y1={55} x2={0} y2={95} stroke={COLORS.CLIENT} strokeWidth={2} strokeDasharray="4 3" />
              <path d="M -6 88 L 0 98 L 6 88" fill="none" stroke={COLORS.CLIENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
          {/* Revisi-07 §B — node label flowchart, teks kecil monospace
              di bawah node, gated ikut opacity browserAnchor sendiri. */}
          <NodeLabel x={410} y={260 + 115} text="Browser / Kamu" color={COLORS.CLIENT} opacity={O('browserAnchor')} />
        </g>

        {/* ═══════ ACT 1 only — speech bubble, amplop, reveal & cliffhanger ═══════ */}
        {phaseIdx === 0 && (
          <g transform="translate(0, 90)">
            {/* PulseRing di browser selama spinner muter (browserPulse loop) */}
            <PulseRing x={410} y={260} p={browserPulse} color={COLORS.CLIENT} />
            {/* revisi-04 §3.2: SpeechBubble/TextCard/Badge (box) → icon
                mandiri + IconCaption di bawahnya (minim text box). */}
            <g transform={T('hookBubble', 410, 430)} opacity={O('hookBubble')}>
              {/* Revisi-10 — question-icon diganti inline SVG info-circle:
                  caption sekarang declarative (ngasih tau), bukan nanya. */}
              <circle r={16} fill="none" stroke={COLORS.TECHNICAL} strokeWidth={2.5} />
              <circle cx={0} cy={-7} r={1.8} fill={COLORS.TECHNICAL} />
              <line x1={0} y1={-2} x2={0} y2={9} stroke={COLORS.TECHNICAL} strokeWidth={2.5} strokeLinecap="round" />
              <IconCaption x={0} y={38} text={HOOK_QUESTION} color={COLORS.TECHNICAL} />
            </g>
            {/* Revisi-07 §1.4 — garis putus-putus browser→amplop, muncul
                SEBELUM amplop blur turun, biar penonton paham "sesuatu
                keluar dari browser". strokeDashoffset animasi pakai
                browserToBlobLine (0-1), bukan cuma opacity statis. */}
            <line x1={410} y1={340} x2={410} y2={640} stroke={COLORS.CLIENT} strokeWidth={2}
              strokeDasharray="6 5" strokeDashoffset={(1 - browserToBlobLine) * 300}
              opacity={browserToBlobLine * 0.6} />
            <EnvelopeTrail color={COLORS.CLIENT} />
            <MotionStreaks color={COLORS.CLIENT} />
            <g transform={T('envelopeAnchor', 410, 700)} opacity={O('envelopeAnchor')}>
              <Envelope x={0} y={0} blurred />
              {/* Revisi-07 §1.5 — arrowhead kecil amplop→caption, nyala
                  SETELAH garis browser→amplop fade out, nunjuk ke arah
                  hookRevealCard yang mau muncul (analogi "Tukang Pos"). */}
              <g opacity={blobArrowShown ? 0.7 : 0}>
                <line x1={0} y1={45} x2={0} y2={80} stroke={COLORS.CLIENT} strokeWidth={2} strokeDasharray="4 3" />
                <path d="M -6 73 L 0 83 L 6 73" fill="none" stroke={COLORS.CLIENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
            <g transform={T('hookRevealCard', 410, 830)} opacity={O('hookRevealCard')}>
              <image href={getIcon('insight-icon')} x={-18} y={-18} width={36} height={36} />
              <IconCaption x={0} y={38} text={HOOK_REVEAL} color={COLORS.CLIENT} />
            </g>
          </g>
        )}

        {/* Revisi-07 §1.6/§C — hookCliffhangerBadge DIPINDAH keluar dari
            blok phaseIdx===0: gated `hookCliffhangerVisible` (bukan
            phaseIdx) supaya bisa persist sampai Act 2 (DNS resolve,
            t+3.7), baru fade — sesuai plan §C kontinuitas lintas-Act.
            Revisi-09 §rapikan — digeser dari x=410 (center) ke x=250,
            sejajar HORIZONTAL dengan domainQuestionBubble (x=570) di
            y=950 yang sama, bukan numpuk vertikal terpisah 320px kayak
            sebelumnya. Keduanya memang overlap on-screen ±8.9s
            (t=10.2s–19.1s), jadi aman dipasangkan sebagai "dua
            pertanyaan terbuka" yang tampil bareng. Jarak anchor
            |570-250|=320 >= (220/2)+(220/2)+gap=240 → aman (formula
            05-svg-text-guide.md §Overlap Horizontal). */}
        {hookCliffhangerVisible && (
          <g transform="translate(0, 90)">
            <g transform={T('hookCliffhangerBadge', 230, 700)} opacity={O('hookCliffhangerBadge')}>
              {/* Revisi-10 — question-icon diganti inline SVG padlock:
                  "belum terungkap" = masih terkunci, bukan nanya. */}
              <rect x={-10} y={-2} width={20} height={16} rx={3} fill="none" stroke={COLORS.TECHNICAL} strokeWidth={2.5} />
              <path d="M -6 -2 L -6 -8 A 6 6 0 0 1 6 -8 L 6 -2" fill="none" stroke={COLORS.TECHNICAL} strokeWidth={2.5} strokeLinecap="round" />
              <circle cx={0} cy={6} r={1.8} fill={COLORS.TECHNICAL} />
              <IconCaption x={0} y={38} text={HOOK_CLIFFHANGER} color={COLORS.TECHNICAL} />
            </g>
          </g>
        )}

        {/* ═══════ AMPLOP REQUEST — anchor persisten Act 2..4 (03 §3.1).
            Render di luar blok phaseIdx supaya gak pop-in ulang tiap ganti
            Act; posisi ikutin reqEnvelopePos (ditween pas "terbang" di
            Act 3), "dibuka" (flap+garis isi) begitu reqEnvelopeOpen true
            di Act 4. Default scale/opacity 0 sampai di-popIn Act 2. ═══════ */}
        <g transform="translate(0, 90)">
          <AnchorG id="reqEnvelope" x={reqEnvelopePos.x} y={reqEnvelopePos.y}>
            <Envelope x={0} y={0} open={reqEnvelopeOpen} sealed={reqEnvelopeSealed} color={COLORS.CLIENT} />
          </AnchorG>
          {/* Revisi-15: badge "IP" nempel pojok amplop request begitu DNS
              nemuin alamatnya, ikut posisi reqEnvelopePos jadi otomatis
              kebawa pas amplop terbang DNS→server (fly2). */}
          <AnchorG id="ipRider" x={reqEnvelopePos.x + 26} y={reqEnvelopePos.y - 32}>
            <circle r={13} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={2} />
            <text textAnchor="middle" y={4} fontSize={9} fontWeight={800} fontFamily="sans-serif" fill={COLORS.SUCCESS}>IP</text>
          </AnchorG>
        </g>

        {/* ═══════ ACT 2 lama (Nulis Surat) — sekarang bagian Act BARU 1.
            Revisi-07 §C: methodBadge/addressLabel/domainQuestionBubble/
            envelopeSealedCard DIPINDAH dari gate `phaseIdx===0` ke gate
            state boolean masing-masing, supaya bisa PERSIST ke Act 2
            (bukan langsung ilang pas ganti Act) — cuma `sealedDot` yang
            tetap gate phaseIdx===0 (bukan bagian list persist §C). ═══════ */}
        {methodBadgeVisible && (
          <g transform="translate(0, 90)">
            {/* Batch-3 (revisi-02 addendum): badge teks GET → icon PNG
                method-get (pill ungu udah baked-in teks GET-nya). */}
            <g transform={T('methodBadge', 160, 700)} opacity={O('methodBadge')}>
              <image href={getIcon('method-get')} x={0} y={-14} width={70} height={70} />
            </g>
            {/* Revisi-14 §C — garis tipis penghubung methodBadge → amplop (sekarang di y=700) */}
            <line x1={215} y1={700} x2={reqEnvelopePos.x - 35} y2={reqEnvelopePos.y}
              stroke={COLORS.CLIENT} strokeWidth={1.5} strokeDasharray="4 4"
              opacity={O('methodBadge') * 0.5} />
          </g>
        )}
        {addressLabelVisible && (
          <g transform="translate(0, 90)">
            {/* revisi-04 §3.3: TextCard/SpeechBubble → icon + IconCaption.
                headerNoteLabel (User-Agent note) dihapus total (§4.2). */}
            <g transform={T('addressLabel', 410, 800)} opacity={O('addressLabel')}>
              <image href={getIcon('address-book')} x={-25} y={-20} width={50} height={40} />
              <IconCaption x={0} y={38} text={REQUEST_ADDRESS} color={COLORS.CLIENT} />
            </g>
          </g>
        )}
        {/* Revisi-09 §rapikan — digeser dari (410,630) ke (570,950),
            sejajar horizontal dengan hookCliffhangerBadge (250,950).
            Sebelumnya numpuk vertikal di bawah addressLabel (410,470);
            karena sekarang jaraknya lebih jauh (480px turun, bukan
            160px), ditambah garis putus-putus penghubung tipis ke
            addressLabel biar konteks "pertanyaan soal alamat yang baru
            ditulis" tidak hilang cuma karena posisi digeser. */}
        {domainQuestionVisible && (
          <g transform="translate(0, 90)">
            {/* Revisi-14 §C — kanan amplop, garis dari amplop ke badge */}
            <line x1={reqEnvelopePos.x + 35} y1={reqEnvelopePos.y} x2={555} y2={700}
              stroke={COLORS.TECHNICAL} strokeWidth={1.5}
              strokeDasharray="4 4" opacity={O('domainQuestionBubble') * 0.4} />
            <g transform={T('domainQuestionBubble', 580, 700)} opacity={O('domainQuestionBubble')}>
              {/* Revisi-10 — question-icon diganti inline SVG magnifier:
                  foreshadow "akan dicari" (DNS Act 2), bukan nanya.
                  Sengaja beda dari PNG dns-magnify biar tidak duplikat
                  visual pas DNS beneran muncul nanti. */}
              <circle cx={-3} cy={-4} r={9} fill="none" stroke={COLORS.TECHNICAL} strokeWidth={2.5} />
              <line x1={4} y1={3} x2={11} y2={10} stroke={COLORS.TECHNICAL} strokeWidth={2.5} strokeLinecap="round" />
              <IconCaption x={0} y={38} text={DOMAIN_VS_IP_QUESTION} color={COLORS.TECHNICAL} />
            </g>
          </g>
        )}
        {phaseIdx === 0 && (
          <g transform="translate(0, 90)">
            <g transform={T('sealedDot', 460, 415)} opacity={O('sealedDot')}>
              <circle r={13} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={2.5} />
              <image href={getIcon('checkmark-icon')} x={-8} y={-8} width={16} height={16} />
            </g>
          </g>
        )}
        {envelopeSealedVisible && (
          <g transform="translate(0, 90)">
            <g transform={T('envelopeSealedCard', 590, 680)} opacity={O('envelopeSealedCard')}>
              <image href={getIcon('insight-icon')} x={-18} y={-18} width={36} height={36} />
              <IconCaption x={0} y={38} text={ENVELOPE_SEALED_CAPTION} color={COLORS.SUCCESS} />
            </g>
          </g>
        )}

        {/* ═══════ GEDUNG SERVER — anchor persisten Act 3..5 (03 §3.1) ═══════ */}
        <g transform="translate(0, 90)">
          <NodeGlow x={410} y={900} active={activeNode === 'server'} color={COLORS.SERVER} />
          <g transform={T('serverBuilding', 410, 900)} opacity={O('serverBuilding')}>
            <ServerBuilding x={0} y={0} open={doorOpen} />
            {/* server-active (revisi-03): overlay nyala pas server lagi
                proses request (Act 3 beat4 s/d Act 4 data ketemu) */}
            <image href={getIcon('server-active')} x={-70} y={-90} width={140} height={140}
              opacity={serverActiveShown ? 1 : 0} style={{ transition: 'opacity 0.3s' }} />
          </g>
          {/* Revisi-07 §B — node label server */}
          <NodeLabel x={410} y={900 + 100} text="Web Server" color={COLORS.SERVER} opacity={O('serverBuilding')} />
        </g>

        {/* ═══════ ACT 3 lama (DNS + Ketuk Pintu) — sekarang Act BARU 2,
            revisi-05: kondisi diganti dari phaseIdx===2 ke phaseIdx===1
            (standalone, tidak digabung Act lain). ═══════ */}
        {phaseIdx === 1 && (
          <g transform="translate(0, 90)">
            <NodeGlow x={610} y={620} active={activeNode === 'dns'} color={COLORS.NETWORK} />
            {/* revisi-06 B.2: radar-ping nyala selama dnsSearching (bareng
                dns-magnify), kesan "lagi nyari" lebih hidup drpd icon
                statis doang. */}
            <RadarPing x={610} y={620} color={COLORS.NETWORK} active={dnsSearching} />
            {/* Revisi-14 §B — DNS gerbang routing: kandidat server muncul saat IP ketemu */}
            <DnsGateway />
            <EnvelopeTrail color={COLORS.CLIENT} />
            <MotionStreaks color={COLORS.CLIENT} />
            <g transform={T('addressBook', 610, 620)} opacity={O('addressBook')}>
              <AddressBook x={0} y={0} />
            </g>
            {/* Revisi-07 §B — node label DNS */}
            <NodeLabel x={610} y={620 + 70} text="DNS / Buku Alamat" color={COLORS.NETWORK} opacity={O('addressBook')} />
            <g transform={T('addressBook', 610, 620)} opacity={dnsResolvedShown ? O('addressBook') : 0} style={{ transition: 'opacity 0.3s' }}>
              <image href={getIcon('dns-resolved')} x={-50} y={-40} width={100} height={80} />
              {/* revisi-04 §3: IP tampil sebagai IconCaption di bawah
                  icon dns-resolved, gantiin ipBadge (Badge box) lama. */}
              <IconCaption x={0} y={58} text={RESOLVED_IP} color={COLORS.SUCCESS} />
            </g>
            {/* Batch-3 (revisi-02 addendum): dns-magnify, tcp-handshake,
                packet-fly — augmentasi visual jalur network Act 3, biar
                "rame" kayak plan §Batch-3 Prioritas. */}
            <g transform={T('dnsMagnify', 610, 590)} opacity={O('dnsMagnify')}>
              <image href={getIcon('dns-magnify')} x={-24} y={-24} width={48} height={48} />
            </g>
            <g transform={T('tcpHandshake', 410, 780)} opacity={O('tcpHandshake')}>
              <image href={getIcon('tcp-handshake')} x={-26} y={-26} width={52} height={52} />
            </g>
            <g transform={T('packetFly1', 410, 380)} opacity={O('packetFly1')}>
              <image href={getIcon('packet-fly')} x={-16} y={-16} width={32} height={32} />
            </g>
            {/* Revisi-17: packet IP terbang balik DNS→surat (base 610,620,
                offset digerakkan tween dnsPacket di timeline).
                Flip horizontal pakai SVG transform (bukan CSS style) karena
                CSS transform tidak reliable di <image> dalam <svg> cross-browser. */}
            <g transform={T('dnsPacketReturn', 610, 620)} opacity={O('dnsPacketReturn')}>
              <g transform="scale(-1,1) translate(-0,0)">
                <image href={getIcon('packet-fly')} x={-14} y={-14} width={28} height={28} />
              </g>
            </g>
            <g transform={T('packetFly2', 410, 620)} opacity={O('packetFly2')}>
              <image href={getIcon('packet-fly')} x={-16} y={-16} width={32} height={32} />
            </g>
          </g>
        )}

        {/* ═══════ ACT 4 lama (Petugas Mikir, Data Ketemu) — sekarang
            bagian Act BARU 3, revisi-05: kondisi diganti dari
            phaseIdx===3 ke phaseIdx===2 (merge sama ACT 5 lama). ═══════ */}
        {phaseIdx === 2 && (
          <g transform="translate(0, 90)">
            <g transform={T('thinkingDots', 410, 810)} opacity={O('thinkingDots')}>
              <ThinkingDotsAnim x={0} y={0} />
            </g>
            <g transform={T('thoughtBubble', 490, 800)} opacity={O('thoughtBubble')}>
              <ThoughtBubble x={0} y={0} />
              {/* revisi-04 §3.4: caption "Lagi mikir..." di bawah bubble
                  (dikonfirmasi user "di bawah gpp"). */}
              <IconCaption x={0} y={62} text={SERVER_THINKING_CAPTION} color={COLORS.SERVER} />
            </g>
            {/* revisi-06 A.2: digeser dari (448,850) → (470,815) — posisi
                lama nangkring ±16px di pinggir kanan Officer (80×80 @
                410,860), sekarang full di luar bounding box-nya. Garis
                kecil ditambah biar tetap kebaca "badge notif nempel ke
                Officer", bukan badge ngambang sendirian. */}
            <g transform={T('foundCheck', 470, 815)} opacity={O('foundCheck')}>
              <path d="M -10 10 Q -22 20 -34 30" fill="none" stroke={COLORS.SUCCESS} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
              <circle r={14} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={2.5} />
              <image href={getIcon('checkmark-icon')} x={-9} y={-9} width={18} height={18} />
              <IconCaption x={0} y={36} text="Data ketemu! 🎯" color={COLORS.SUCCESS} />
            </g>
            {/* revisi-04 §3: Badge (box) → icon + IconCaption */}
            <g transform={T('replyCliffhangerBadge', 230, 1000)} opacity={O('replyCliffhangerBadge')}>
              {/* Revisi-10 — question-icon diganti inline SVG padlock
                  (sama shape dgn hookCliffhangerBadge, warna SERVER):
                  disamakan sengaja, dua-duanya fungsi "cliffhanger
                  belum terjawab" jadi bahasa visualnya konsisten. */}
              <rect x={-10} y={-2} width={20} height={16} rx={3} fill="none" stroke={COLORS.SERVER} strokeWidth={2.5} />
              <path d="M -6 -2 L -6 -8 A 6 6 0 0 1 6 -8 L 6 -2" fill="none" stroke={COLORS.SERVER} strokeWidth={2.5} strokeLinecap="round" />
              <circle cx={0} cy={6} r={1.8} fill={COLORS.SERVER} />
              <IconCaption x={0} y={38} text={REPLY_CLIFFHANGER} color={COLORS.SERVER} />
            </g>
          </g>
        )}

        {/* ═══════ ICON FLY "MASUK AMPLOP" — revisi-11: HTML/CSS/JS keluar
            dari gedung server → masuk ke amplop response, biar penonton
            tahu file-file ini BERASAL dari server (bukan muncul tiba-tiba
            di browser). Render di luar phaseIdx guard karena amplitude-nya
            lintas state, tapi gated opacity pop — kalau belum di-popIn
            otomatis opacity 0 jadi tidak kelihatan. ═══════ */}
        <g transform="translate(0, 90)">
          <g transform={T('responseHtml', 340, 830)} opacity={O('responseHtml')}>
            <image href={getIcon('html-document')} x={-22} y={-22} width={44} height={44} />
          </g>
          <g transform={T('responseCss', 410, 830)} opacity={O('responseCss')}>
            <image href={getIcon('css-document')} x={-22} y={-22} width={44} height={44} />
          </g>
          <g transform={T('responseJs', 480, 830)} opacity={O('responseJs')}>
            <image href={getIcon('js-document')} x={-22} y={-22} width={44} height={44} />
          </g>
        </g>

        {/* ═══════ AMPLOP RESPONSE — anchor persisten Act 5..6 (objek BEDA
            dari amplop request, 03 §3.1 + plan §Persistent Anchor Objects).
            Warna SUCCESS (hijau) biar gak ketuker sama amplop request. ═══════ */}
        <g transform="translate(0, 90)">
          <AnchorG id="replyEnvelope" x={replyEnvelopePos.x} y={replyEnvelopePos.y}>
            <Envelope x={0} y={0} open={replyEnvelopeOpen} sealed={replyEnvelopeSealed} color={COLORS.SUCCESS} />
          </AnchorG>
          {/* Revisi-15: mini stempel status (200 ijo / varian error merah)
              nempel pojok amplop response, ikut replyEnvelopePos jadi
              otomatis kebawa pas amplop terbang balik ke browser (fly3),
              gak lagi ilang begitu aja di server. */}
          <AnchorG id="stampRider" x={replyEnvelopePos.x + 28} y={replyEnvelopePos.y - 44}>
            <image href={getIcon(STATUS_MAIN.color === COLORS.SUCCESS ? 'stamp-approved' : 'stamp-rejected')}
              x={-18} y={-18} width={36} height={36} />
          </AnchorG>
        </g>

        {/* ═══════ ACT 5 lama (Stempel Status Code) — sekarang bagian
            Act BARU 3, revisi-05: kondisi diganti dari phaseIdx===4 ke
            phaseIdx===2, SEBARIS sama blok ACT 4 lama di atas (merged,
            bukan tabrakan sama Act baru 4 yang sekarang phaseIdx===3). ═══════ */}
        {phaseIdx === 2 && (
          <g transform="translate(0, 90)">
            <EnvelopeTrail color={COLORS.SUCCESS} />
            <MotionStreaks color={COLORS.SUCCESS} />
            {/* revisi-06 A.1: posisi 950→935 + size 1.15→0.9 — sebelumnya
                stempel menutupi ~100% badan amplop closed di titik yang
                sama persis, sekarang lipatan amplop ikut "mengintip" di
                bawah stempel, dibantu ImpactRaysLayer (lihat trigger). */}
            <g transform={T('stampMain', 410, 935)} opacity={O('stampMain')}>
              <Stamp x={0} y={0} code={STATUS_MAIN.code} label={STATUS_MAIN.label} color={STATUS_MAIN.color} size={0.9} />
            </g>
            <g transform={T('stampVariant0', 310, 1010)} opacity={O('stampVariant0')}>
              <Stamp x={0} y={0} code={STATUS_VARIANTS[0].code} label={STATUS_VARIANTS[0].label} color={STATUS_VARIANTS[0].color} size={0.6} rotate={10} />
            </g>
            <g transform={T('stampVariant1', 510, 1010)} opacity={O('stampVariant1')}>
              <Stamp x={0} y={0} code={STATUS_VARIANTS[1].code} label={STATUS_VARIANTS[1].label} color={STATUS_VARIANTS[1].color} size={0.6} rotate={-10} />
            </g>
          </g>
        )}

        {/* ═══════ ACT 6 lama (Chip HTML/CSS/JS, Render Halaman, Payoff)
            — sekarang Act BARU 4, revisi-05: kondisi diganti dari
            phaseIdx===5 ke phaseIdx===3 (standalone, terakhir). ═══════ */}
        {phaseIdx === 3 && (
          <g transform="translate(0, 90)">
            {/* Batch-3 (revisi-02 addendum): 3 badge teks (status/headers/
                body) → icon PNG html/css/js document. Ganti makna dari
                "Status, Headers, Body" jadi "isinya HTML, CSS, JS" —
                lebih konkret buat anak 10 tahun (langsung lihat 3 jenis
                file, bukan istilah teknis). Kode status (200 OK) sendiri
                masih kelihatan di stamp Act 5, gak hilang infonya. */}
            {/* revisi-04 §3.5: tambah IconCaption "HTML"/"CSS"/"JS" di
                bawah tiap chip, gantiin say('Status, header, body!') */}
            <g transform={T('rawStatusChip', 210, 470)} opacity={O('rawStatusChip')}>
              <image href={getIcon('html-document')} x={-30} y={-30} width={60} height={60} />
              <IconCaption x={0} y={44} text="HTML" color={COLORS.CLIENT} fontSize={12} />
            </g>
            <g transform={T('rawHeaderChip', 420, 470)} opacity={O('rawHeaderChip')}>
              <image href={getIcon('css-document')} x={-30} y={-30} width={60} height={60} />
              <IconCaption x={0} y={44} text="CSS" color={COLORS.TECHNICAL} fontSize={12} />
            </g>
            <g transform={T('rawBodyChip', 590, 470)} opacity={O('rawBodyChip')}>
              <image href={getIcon('js-document')} x={-30} y={-30} width={60} height={60} />
              <IconCaption x={0} y={44} text="JS" color={'#FBBF24'} fontSize={12} />
            </g>
            <g transform={T('pageContent', 410, 620)} opacity={O('pageContent')}>
              <PageContent x={0} y={0} />
            </g>
            {/* revisi-04 §3.5: TextCard/Badge (box) → icon + IconCaption */}
            <g transform={T('renderCaptionCard', 410, 770)} opacity={O('renderCaptionCard')}>
              <image href={getIcon('insight-icon')} x={-18} y={-18} width={36} height={36} />
              <IconCaption x={0} y={38} text={RENDER_CAPTION} color={COLORS.CLIENT} />
            </g>

          </g>
        )}

        {/* ═══════ EFEK OVERLAY (revisi-02 §B) — starburst/shockwave/
            confetti, render paling atas (di luar blok phaseIdx) supaya
            gak numpang di antara elemen Act dan gak ke-unmount pas
            phaseIdx ganti pas efeknya masih fade-out. ═══════ */}
        <g transform="translate(0, 90)">
          <ShockWavesLayer />
          <StarBurstsLayer />
          <ImpactRaysLayer />
          <ConfettiLayer />
        </g>
      </g>
      )}

      {/* ── Screen flash (triggerFlash), di luar showIntro gate biar bisa
          nutup transisi showIntro juga kalau kepakai nanti — opacity 0
          default jadi harmless kalau gak dipicu ── */}
      <rect x={0} y={0} width={VW} height={VH} fill={flashColor} opacity={flashOpacity} style={{ pointerEvents: 'none' }} />
    </svg>
  )
}
