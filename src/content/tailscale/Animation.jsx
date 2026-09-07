// ═══════════════════════════════════════════════════════════════════════════
// src/content/tailscale/Animation.jsx
// ─────────────────────────────────────────────────────────────────────────
// Tailscale — cerita: 2 device diblokir NAT (hook) → WireGuard key pair →
// coordination server "mak comblang" → NAT hole punching + DERP relay
// fallback → payoff: mesh network privat. Lihat _docs/TAILSCALE_PLAN.md.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  DEVICES, HOOK_QUESTION, HOOK_CLIFFHANGER,
  KEY_INSIGHT, KEY_CAPTION,
  IP_FLICKER, COORD_QUESTION, COORD_NOTE, COORD_PAYOFF,
  HOLEPUNCH_TENSION, HOLEPUNCH_SUCCESS, RELAY_TENSION, RELAY_FALLBACK, HOLEPUNCH_COMPARE,
  MESH_EXTRA_DEVICES, CLOSING_LINE, CLOSING_BRAND,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
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

const INTRO_TITLE = 'TAILSCALE'
const INTRO_SUBTITLE = 'Nembus NAT tanpa buka port satu pun'

export default function TailscaleAnimation({
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

  // ── ANCHOR icons (rumah/kantor) — objek persistent, id TETAP sepanjang
  // Act 1..5, tidak unmount/remount per-Act. Cuma posisi Y & warna laptop
  // yang di-tween/swap saat transisi Act. Lihat
  // revision/PLAN-CONTINUOUS-ANCHOR-ICONS.md.
  const [anchorY, setAnchorY] = useState({ home: 170, office: 170 })
  const [anchorColor, setAnchorColor] = useState({ home: COLORS.DANGER, office: COLORS.DANGER })

  // ── intro (typing → morph) state ──
  const [showIntro, setShowIntro] = useState(true)
  const [morphP, setMorphP] = useState(0)
  const [typed, setTyped] = useState({ title: '', subtitle: '' })
  const [cursorVisible, setCursorVisible] = useState(true)

  // ── ACT 1 ──
  const [capsulePos, setCapsulePos] = useState({ x: 150, opacity: 0 })
  const [blockedFlash, setBlockedFlash] = useState(false)

  // ── ACT 3 ──
  const [ipText, setIpText] = useState({ home: '???.???', office: '???.???' })
  const [tokenPos, setTokenPos] = useState({ home: 0, office: 0 })

  // ── ACT 4 ──
  const [punchPos, setPunchPos] = useState({ home: 0, office: 0 })
  const [p2pLine, setP2pLine] = useState(0)     // 0..1 line reveal (sim 1)
  const [relayLine, setRelayLine] = useState({ home: 0, office: 0 }) // sim 2

  const phase = PHASES[phaseIdx] || PHASES[0]
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

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
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

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
      // Seeded pitch variation (jangan Math.random — harus deterministik)
      const pitchSeed = seededRandom01(i * 5.1 + (lineKey === 'title' ? 2.3 : 8.7))
      const pitch = 0.98 + pitchSeed * 0.04

      tl.add(() => {
        acc += char
        setTyped(prev => ({ ...prev, [lineKey]: acc }))
        sfxLoader.sfx(SFX_MAP.TYPING.name, { volume: volumeRef.current * 1.6, speed: speedRef.current * pitch, boost: SFX_MAP.TYPING.boost || 1.0 })
      }, time)
      time += delay / 1000
    }
    return time - startTime
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    // Export safety: expose flushSync supaya script export bisa memaksa
    // React 18 commit setState hasil seek (tl.totalTime()) secara SINKRON
    // sebelum screenshot frame diambil. Tanpa ini, popIn yang terjadi
    // berdekatan (mis. 6 garis mesh Act 5, tiap 150ms) berisiko tidak
    // ter-commit ke DOM tepat waktu saat export → elemen hilang di video
    // walau tampil normal di preview. Pola sama seperti virtual-memory
    // (lihat revision/PLAN-FIX-EXPORT-MESHLINE-MISSING.md § 2.3).
    window.__flushSync = flushSync

    let t = 0

    // ═══════════════ INTRO — hacker typing → header morph ═══════════════
    tl.add(() => {
      setShowIntro(true)
      setMorphP(0)
      setTyped({ title: '', subtitle: '' })
      setCursorVisible(true)
    }, t)
    t += 0.3 // jeda kecil sebelum mulai ngetik

    // ── ketik title "TAILSCALE" ──
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

    // ── MORPH: title+subtitle slide naik & mengecil jadi header ──
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

    // ═══════════════ ACT 1 — Dua device, dua tembok (HOOK) ═══════════════
    tl.add(() => {
      setPhaseIdx(0)
      setCapsulePos({ x: DEVICES.home.x, opacity: 0 })
      setBlockedFlash(false)
      sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, 'Laptop rumah mau connect ke kantor.')
    popIn(tl, t + 0.3, 'houseAnchor', { fromX: -30, sfx: true })
    popIn(tl, t + 0.5, 'officeAnchor', { fromX: 30, sfx: true })
    popIn(tl, t + 0.9, 'cloudInternet', { fromY: -15, sfx: false })
    sfxOn(tl, t + 0.9, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volume * 0.7, speed }))
    popIn(tl, t + 1.3, 'wallHome', { sfx: false })
    popIn(tl, t + 1.4, 'wallOffice', { sfx: false })

    say(tl, t + 1.9, 'Coba connect lewat internet...')
    tl.add(() => setCapsulePos({ x: DEVICES.home.x, opacity: 1 }), t + 2.1)
    const capsuleObj = { x: DEVICES.home.x }
    tl.to(capsuleObj, {
      x: DEVICES.office.x - 40, duration: 1.0, ease: 'power1.in',
      onStart: () => sfxLoader.sfx(SFX_MAP.SCAN.name, { volume, speed }),
      onUpdate: () => setCapsulePos({ x: capsuleObj.x, opacity: 1 }),
    }, t + 2.2)

    tl.add(() => {
      setBlockedFlash(true)
      setCapsulePos({ x: DEVICES.office.x - 40, opacity: 1 })
      sfxLoader.warning(SFX_MAP.ERROR_BEEP.name, { volume, speed })
      sfxLoader.impact(SFX_MAP.IMPACT.name, { volume: volume * 0.8, speed })
    }, t + 3.2)
    say(tl, t + 3.3, 'DITOLAK! Firewall kantor nutup rapat.')
    popIn(tl, t + 3.4, 'blockedX', { duration: 0.35, ease: 'back.out(2)', sfx: false })
    sfxOn(tl, t + 3.7, () => sfxLoader.ui(SFX_MAP.POP2.name, { volume, speed }))
    sfxOn(tl, t + 4.2, () => sfxLoader.ui(SFX_MAP.PLINK.name, { volume, speed }))
    say(tl, t + 4.4, HOOK_QUESTION)

    popIn(tl, t + 6.5, 'cliffhanger1', { fromY: 15, sfx: false })
    sfxOn(tl, t + 6.5, () => sfxLoader.sfx(SFX_MAP.MATERIALIZE.name, { volume: volume * 0.8, speed }))
    t += PHASES[0].duration

    // ═══════════════ ACT 2 — WireGuard: kunci, bukan password ═══════════════
    tl.add(() => {
      setPhaseIdx(1)
      setCapsulePos({ x: 0, opacity: 0 })
      setBlockedFlash(false)
      sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, 'Tailscale diinstall.')
    // rumah/kantor: id sama sepanjang cerita, cuma warna laptop di-swap
    // (bukan pop-in ulang) — lihat revision/PLAN-CONTINUOUS-ANCHOR-ICONS.md
    tl.add(() => setAnchorColor({ home: COLORS.CRYPTO, office: COLORS.CRYPTO }), t + 0.3)
    popIn(tl, t + 0.7, 'installIconHome', { duration: 0.4, ease: 'bounce.out', sfx: true })
    popIn(tl, t + 0.85, 'installIconOffice', { duration: 0.4, ease: 'bounce.out', sfx: true })
    sfxOn(tl, t + 0.9, () => sfxLoader.success(SFX_MAP.COMPLETE.name, { volume, speed }))

    say(tl, t + 1.6, 'Device bikin kunci sendiri.')
    popIn(tl, t + 1.9, 'pubKeyHome', { duration: 0.5, fromY: -10, sfx: true })
    popIn(tl, t + 1.95, 'privKeyHome', { duration: 0.5, sfx: false })
    sfxOn(tl, t + 1.95, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume, speed }))
    popIn(tl, t + 2.4, 'pubKeyOffice', { duration: 0.5, fromY: -10, sfx: true })
    popIn(tl, t + 2.45, 'privKeyOffice', { duration: 0.5, sfx: false })
    sfxOn(tl, t + 2.45, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume, speed }))

    say(tl, t + 3.1, 'Kunci publik disebar. Kunci privat disimpan.')
    popIn(tl, t + 4.6, 'keyInsightBadge', { duration: 0.5, ease: 'back.out(2)', sfx: false })
    sfxOn(tl, t + 4.6, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume, speed }))

    popIn(tl, t + 6.3, 'keyCaptionBox', { fromY: 15, sfx: false })
    t += PHASES[1].duration

    // ═══════════════ ACT 3 — Coordination server: si mak comblang ═══════════════
    tl.add(() => {
      setPhaseIdx(2)
      setIpText({ home: IP_FLICKER[0], office: IP_FLICKER[0] })
      setTokenPos({ home: 0, office: 0 })
      sfxLoader.transition(SFX_MAP.GLITCH.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, 'IP rumah & kantor berubah-ubah.')
    // rumah/kantor: swap warna + tween posisi Y (170→190), bukan remount
    tl.add(() => setAnchorColor({ home: COLORS.SERVER, office: COLORS.SERVER }), t + 0.3)
    ;(() => {
      const o = { v: 170 }
      tl.to(o, {
        v: 190, duration: 0.5, ease: 'power2.inOut',
        onUpdate: () => setAnchorY({ home: o.v, office: o.v }),
      }, t + 0.3)
    })()
    popIn(tl, t + 0.7, 'ipLabelHome', { sfx: true })
    popIn(tl, t + 0.8, 'ipLabelOffice', { sfx: true })

    // ── IP flicker: ganti angka beberapa kali biar kerasa "dinamis" ──
    IP_FLICKER.forEach((val, i) => {
      const ft = t + 1.0 + i * 0.35
      tl.add(() => {
        setIpText({ home: val, office: IP_FLICKER[(i + 1) % IP_FLICKER.length] })
        if (audioUnlockedRef.current) sfxLoader.ui(SFX_MAP.TICK.name, { volume: volume * 0.6, speed })
      }, ft)
    })
    sfxOn(tl, t + 2.5, () => sfxLoader.ui(SFX_MAP.PLINK.name, { volume, speed }))
    say(tl, t + 2.7, COORD_QUESTION)

    tl.add(() => {
      sfxLoader.transition(SFX_MAP.SWOOSH2.name, { volume, speed })
    }, t + 4.6)
    popIn(tl, t + 4.7, 'coordServerBox', { duration: 0.5, ease: 'back.out(1.8)', fromY: -20, sfx: true })
    say(tl, t + 4.9, 'Kenalin: Tailscale Coordination Server.')
    popIn(tl, t + 5.4, 'coordDashHome', { duration: 0.4, sfx: false })
    popIn(tl, t + 5.5, 'coordDashOffice', { duration: 0.4, sfx: false })

    // ── token (public key) terbang dari tiap laptop ke coordination server ──
    const tokenObj = { home: 0, office: 0 }
    tl.to(tokenObj, {
      home: 1, office: 1, duration: 0.9, ease: 'power1.inOut',
      onStart: () => sfxLoader.sfx(SFX_MAP.SCAN.name, { volume: volume * 0.8, speed }),
      onUpdate: () => setTokenPos({ home: tokenObj.home, office: tokenObj.office }),
    }, t + 5.8)
    sfxOn(tl, t + 6.7, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume, speed }))

    popIn(tl, t + 6.9, 'coordNoteBadge', { duration: 0.4, ease: 'back.out(2)', sfx: false })

    popIn(tl, t + 8.6, 'coordPayoffCard', { fromY: 15, sfx: false })
    sfxOn(tl, t + 8.6, () => sfxLoader.success(SFX_MAP.DING.name, { volume, speed }))
    t += PHASES[2].duration

    // ═══════════════ ACT 4 — Nembus tembok barengan ═══════════════
    tl.add(() => {
      setPhaseIdx(3)
      setPunchPos({ home: 0, office: 0 })
      setP2pLine(0)
      setRelayLine({ home: 0, office: 0 })
      sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, 'Saatnya nembus tembok.')
    // rumah/kantor: swap warna + tween posisi Y (190→170), bukan remount
    tl.add(() => setAnchorColor({ home: COLORS.SUCCESS, office: COLORS.SUCCESS }), t + 0.3)
    ;(() => {
      const o = { v: 190 }
      tl.to(o, {
        v: 170, duration: 0.5, ease: 'power2.inOut',
        onUpdate: () => setAnchorY({ home: o.v, office: o.v }),
      }, t + 0.3)
    })()
    popIn(tl, t + 0.7, 'wallHome4', { sfx: false })
    popIn(tl, t + 0.8, 'wallOffice4', { sfx: false })

    // ── SIMULASI 1: hole punching sukses ──
    say(tl, t + 1.5, 'Nembak bareng, di waktu sama...')
    const punchObj = { home: 0, office: 0 }
    tl.to(punchObj, {
      home: 1, office: 1, duration: 0.7, ease: 'power2.in',
      onStart: () => {
        sfxLoader.sfx(SFX_MAP.SCAN.name, { volume, speed })
        sfxLoader.sfx(SFX_MAP.SCAN.name, { volume: volume * 0.9, speed: speed * 1.05 })
      },
      onUpdate: () => setPunchPos({ home: punchObj.home, office: punchObj.office }),
    }, t + 1.8)

    popIn(tl, t + 2.6, 'tensionBadge1', { duration: 0.3, sfx: false })
    say(tl, t + 2.7, HOLEPUNCH_TENSION)
    // ── jeda tegangan 1.3s sebelum reveal (aturan 03-tutorial 3.0/3.5) ──
    tl.add(() => {
      sfxLoader.impact(SFX_MAP.UNLOCK.name, { volume, speed })
      sfxLoader.success(SFX_MAP.VICTORY.name, { volume, speed })
    }, t + 4.0)
    const p2pObj = { v: 0 }
    tl.to(p2pObj, { v: 1, duration: 0.5, ease: 'power2.out', onUpdate: () => setP2pLine(p2pObj.v) }, t + 4.0)
    popIn(tl, t + 4.2, 'p2pBadge', { duration: 0.4, ease: 'back.out(2)', sfx: false })

    // ── SIMULASI 2: NAT ketat → fallback DERP relay ──
    say(tl, t + 6.0, 'Firewall satunya kelewat ketat...')
    popIn(tl, t + 6.3, 'wallOfficeStrict', { duration: 0.3, sfx: false })
    sfxOn(tl, t + 6.3, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume, speed }))
    tl.add(() => sfxLoader.sfx(SFX_MAP.ERROR.name, { volume, speed }), t + 7.0)
    say(tl, t + 7.1, RELAY_TENSION)

    tl.add(() => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume, speed }), t + 8.0)
    popIn(tl, t + 8.1, 'derpServerBox', { duration: 0.4, ease: 'back.out(1.8)', fromY: -15, sfx: true })
    const relayObj = { home: 0, office: 0 }
    tl.to(relayObj, {
      home: 1, office: 1, duration: 0.6, ease: 'power1.out',
      onStart: () => sfxLoader.sfx(SFX_MAP.SUCCESS.name, { volume, speed }),
      onUpdate: () => setRelayLine({ home: relayObj.home, office: relayObj.office }),
    }, t + 8.5)
    popIn(tl, t + 9.2, 'relayBadge', { duration: 0.4, sfx: false })
    sfxOn(tl, t + 9.2, () => sfxLoader.success(SFX_MAP.COMPLETE.name, { volume, speed }))

    popIn(tl, t + 10.7, 'compareBox', { fromY: 15, sfx: false })
    t += PHASES[3].duration

    // ═══════════════ ACT 5 — Sekarang berasa 1 jaringan (PAYOFF) ═══════════════
    tl.add(() => {
      setPhaseIdx(4)
      sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, 'Tambah device ke tailnet...')
    // rumah/kantor: morph posisi ke layout mesh (170→300), bukan pop-in ulang
    ;(() => {
      const o = { v: 170 }
      tl.to(o, {
        v: 300, duration: 0.6, ease: 'power2.inOut',
        onUpdate: () => setAnchorY({ home: o.v, office: o.v }),
      }, t + 0.3)
    })()
    popIn(tl, t + 0.9, 'meshPhone', { duration: 0.4, fromY: -15, sfx: true })
    popIn(tl, t + 1.1, 'meshCloud', { duration: 0.4, fromY: -15, sfx: true })
    sfxOn(tl, t + 1.1, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume, speed }))

    say(tl, t + 1.8, 'Semua connect langsung.')
    ;['meshLine-ho', 'meshLine-hp', 'meshLine-hc', 'meshLine-op', 'meshLine-oc', 'meshLine-pc'].forEach((id, i) => {
      popIn(tl, t + 2.1 + i * 0.15, id, { duration: 0.3, sfx: true })
    })
    sfxOn(tl, t + 3.2, () => sfxLoader.success(SFX_MAP.VICTORY.name, { volume, speed }))

    popIn(tl, t + 4.4, 'closingCard', { fromY: 15, sfx: false })
    sfxOn(tl, t + 4.4, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume, speed }))

    popIn(tl, t + 7.0, 'closingBrandBadge', { duration: 0.4, ease: 'back.out(2)', sfx: false })
    sfxOn(tl, t + 7.0, () => sfxLoader.success(SFX_MAP.DING.name, { volume, speed }))
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

  // ── Shape helpers (100% icon-driven — PNG hasil generate, lihat
  // icons/icons.json "usage" per icon-id; bukan lagi SVG primitives) ──
  const LAPTOP_ICON_BY_COLOR = {
    [COLORS.DANGER]: 'laptop-danger',
    [COLORS.CRYPTO]: 'laptop-crypto',
    [COLORS.SERVER]: 'laptop-server',
    [COLORS.SUCCESS]: 'laptop-success',
  }
  const Laptop = ({ x, y, color = COLORS.TEXT, scale = 1 }) => (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <image href={getIcon(LAPTOP_ICON_BY_COLOR[color] || 'laptop-danger')}
        x={-40} y={-28} width={80} height={56} />
    </g>
  )

  const HouseFrame = ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon('house-frame')} x={-65} y={-118} width={130} height={140} />
    </g>
  )

  const BuildingFrame = ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon('building-frame')} x={-55} y={-108} width={110} height={132} />
    </g>
  )

  const CloudShape = ({ x, y, label = 'INTERNET', color = COLORS.MUTED }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon('cloud-internet')} x={-50} y={-38} width={100} height={64} />
      <text textAnchor="middle" y={44} fill={color} fontSize={11} fontFamily="monospace" fontWeight={700}>{label}</text>
    </g>
  )

  const FirewallWall = ({ x, y, strict = false }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon(strict ? 'firewall-strict' : 'firewall-normal')}
        x={-20} y={-78} width={40} height={156} />
    </g>
  )

  // manual word-wrap (bukan foreignObject — tidak reliable di export
  // Puppeteer/FFmpeg, lihat docs/05-svg-text-guide.md)
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

  const Badge = ({ x, y, text, color = COLORS.BRAND, w = 280 }) => {
    const lines = wrapText(text, Math.floor((w - 30) / 7.5))
    const dy = 18
    const h = lines.length * dy + 22
    return (
      <g transform={`translate(${x},${y})`}>
        <path d={`M ${w/2} 0 L ${w/2+8} 8 L ${w} ${h/2-6} L ${w/2+8} ${h-8} L ${w/2} ${h}
          L ${w/2-8} ${h-8} L 0 ${h/2+6} L ${w/2-8} 8 Z`} fill="none" opacity={0} />
        <rect x={0} y={0} width={w} height={h} rx={h/2} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} filter="url(#glow)" />
        <text x={w/2} y={h/2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="sans-serif" fill={color}>
          {lines.map((line, i) => <tspan key={i} x={w/2} dy={i === 0 ? -((lines.length-1)*dy)/2 : dy}>{line}</tspan>)}
        </text>
      </g>
    )
  }

  const KeyToken = ({ x, y, locked = false, color = COLORS.CRYPTO }) => (
    <g transform={`translate(${x},${y})`}>
      <circle r={16} fill={COLORS.PANEL} stroke={color} strokeWidth={2} filter="url(#glow)" />
      <circle cx={-4} cy={-3} r={5} fill="none" stroke={color} strokeWidth={2} />
      <line x1={0} y1={1} x2={7} y2={8} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1={5} y1={6} x2={2} y2={9} stroke={color} strokeWidth={2} strokeLinecap="round" />
      {locked && <path d="M -6 -18 h 12 v 5 h -3 v -2 h -6 v 2 h -3 z" fill={color} opacity={0.9} />}
    </g>
  )

  const ServerBox = ({ x, y, label, color = COLORS.SERVER, w = 220 }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w/2} y={0} width={w} height={64} rx={12} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} filter="url(#shadow)" />
      <rect x={-w/2+14} y={12} width={w-28} height={10} rx={3} fill={color} opacity={0.35} />
      <rect x={-w/2+14} y={28} width={w-28} height={10} rx={3} fill={color} opacity={0.35} />
      <circle cx={w/2-22} cy={17} r={3} fill={color} filter="url(#glow)" />
      <text x={0} y={54} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={color}>{label}</text>
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
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.BRAND} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.BRAND} strokeWidth={1} />)}
      </g>

      {/* ── HEADER (hero thumbnail → compact header morph, teknik lerp Langkah 2) ── */}
      {(() => {
        const mp = morphP
        const thumbWidth = 420
        const startX = (VW / 2) - (thumbWidth / 2)
        const endX = 44
        const taglineX = lerp(startX, endX, mp)
        const taglineY = lerp(550, 50, mp)
        const taglineFs = lerp(18, 13, mp)
        const titleX = lerp(startX, endX, mp)
        const titleY = lerp(640, 100, mp)
        const titleFs = lerp(72, 44, mp)
        const subX = lerp(startX, endX, mp)
        const subY = lerp(716, 130, mp)
        const subFs = lerp(20, 15, mp)

        const titleSplitIdx = 4 // "TAIL" (hijau) | "SCALE" (biru)
        const tt = typed.title
        const cursorColor = tt.length <= titleSplitIdx ? COLORS.CRYPTO : COLORS.SUCCESS

        return (
          <g>
            <text x={taglineX} y={taglineY} textAnchor="start"
              fill={COLORS.MUTED} fontSize={taglineFs} fontFamily="monospace" letterSpacing={3}>
              NETWORKING · <tspan fill={COLORS.SUCCESS} fontWeight={700}>ADIB-DEV.COM</tspan>
            </text>
            <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
              fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} filter="url(#glow)">
              <tspan fill={COLORS.CRYPTO}>{tt.slice(0, titleSplitIdx)}</tspan>
              <tspan fill={COLORS.SUCCESS}>{tt.slice(titleSplitIdx)}</tspan>
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

      {/* ── PHASE BADGE ── */}
      {!showIntro && (
        <g transform="translate(44, 155)">
          <rect width={500} height={40} rx={20} fill={COLORS.PANEL} stroke={phase.badgeColor} strokeWidth={1.8} filter="url(#shadow)" />
          <circle cx={22} cy={20} r={6} fill={phase.badgeColor} filter="url(#glow)" />
          <text x={40} y={26} fill={phase.badgeColor} fontSize={13} fontFamily="monospace" fontWeight={700} letterSpacing={0.5}>
            {phase.badge}
          </text>
          <g transform="translate(620, 12)">
            {PHASES.map((ph, i) => (
              <circle key={ph.id} cx={i * 24} cy={8}
                r={i === phaseIdx ? 7 : 4}
                fill={i === phaseIdx ? phase.badgeColor : COLORS.BORDER}
                stroke={i === phaseIdx ? '#fff' : 'none'} strokeWidth={1.5} />
            ))}
          </g>
        </g>
      )}

      {/* ── CONTENT ── */}
      {!showIntro && (
      <g transform="translate(44, 220)">
        <rect width={732} height={52} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
        <text x={366} y={32} textAnchor="middle" fill={COLORS.TEXT} fontSize={15} fontFamily="sans-serif">
          {caption}
        </text>

        {/* ═══════ ANCHOR — rumah & kantor, persistent Act 1..5 ═══════
            Cuma pop-in SEKALI (id: houseAnchor/officeAnchor), abis itu cuma
            tween posisi Y & swap warna laptop tiap transisi Act — TIDAK
            unmount/remount, TIDAK pop-in ulang. Lihat
            revision/PLAN-CONTINUOUS-ANCHOR-ICONS.md. */}
        <g transform="translate(0, 80)">
          <g transform={T('houseAnchor', DEVICES.home.x, anchorY.home)} opacity={O('houseAnchor')}>
            <HouseFrame x={0} y={0} />
            <Laptop x={0} y={0} color={anchorColor.home} />
            <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={phaseIdx === 4 ? 13 : 14} fontWeight={700}>{DEVICES.home.label}</text>
            {phaseIdx === 0 && <text textAnchor="middle" y={68} fill={COLORS.MUTED} fontSize={11}>{DEVICES.home.sub}</text>}
          </g>
          <g transform={T('officeAnchor', DEVICES.office.x, anchorY.office)} opacity={O('officeAnchor')}>
            <BuildingFrame x={0} y={0} />
            <Laptop x={0} y={0} color={anchorColor.office} />
            <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={phaseIdx === 4 ? 13 : 14} fontWeight={700}>{DEVICES.office.label}</text>
            {phaseIdx === 0 && <text textAnchor="middle" y={68} fill={COLORS.MUTED} fontSize={11}>{DEVICES.office.sub}</text>}
          </g>
        </g>

        {/* ═══════ ACT 1 — DUA DEVICE, DUA TEMBOK ═══════ */}
        {phaseIdx === 0 && (
          <g transform="translate(0, 80)">
            <g transform={T('cloudInternet', 366, 40)} opacity={O('cloudInternet')}>
              <CloudShape x={0} y={0} color={COLORS.MUTED} />
            </g>

            <g transform={T('wallHome', 250, 170)} opacity={O('wallHome')}><FirewallWall x={0} y={0} /></g>
            <g transform={T('wallOffice', 500, 170)} opacity={O('wallOffice')}><FirewallWall x={0} y={0} /></g>

            {capsulePos.opacity > 0 && (
              <circle cx={capsulePos.x} cy={170} r={10}
                fill={blockedFlash ? COLORS.DANGER : COLORS.BRAND} filter="url(#glow)" />
            )}
            {blockedFlash && (
              <g transform={T('blockedX', 500, 170)} opacity={O('blockedX')}>
                <line x1={-14} y1={-14} x2={14} y2={14} stroke={COLORS.DANGER} strokeWidth={5} strokeLinecap="round" />
                <line x1={14} y1={-14} x2={-14} y2={14} stroke={COLORS.DANGER} strokeWidth={5} strokeLinecap="round" />
              </g>
            )}

            <g transform={T('cliffhanger1', 366, 420)} opacity={O('cliffhanger1')}>
              <rect x={-320} y={0} width={640} height={54} rx={14} fill={COLORS.PANEL} stroke={COLORS.BRAND} strokeWidth={1.5} />
              <text x={0} y={33} textAnchor="middle" fill={COLORS.BRAND} fontSize={15} fontWeight={700}>{HOOK_CLIFFHANGER}</text>
            </g>
          </g>
        )}

        {/* ═══════ ACT 2 — WIREGUARD: KUNCI, BUKAN PASSWORD ═══════ */}
        {phaseIdx === 1 && (
          <g transform="translate(0, 80)">
            <g transform={T('installIconHome', 150, 60)} opacity={O('installIconHome')}>
              <circle r={18} fill={COLORS.BRAND_DIM} stroke={COLORS.BRAND} strokeWidth={2} filter="url(#glow)" />
              <image href={getIcon('tailscale-logo')} x={-13} y={-13} width={26} height={26} />
            </g>
            <g transform={T('installIconOffice', 582, 60)} opacity={O('installIconOffice')}>
              <circle r={18} fill={COLORS.BRAND_DIM} stroke={COLORS.BRAND} strokeWidth={2} filter="url(#glow)" />
              <image href={getIcon('tailscale-logo')} x={-13} y={-13} width={26} height={26} />
            </g>

            <g transform={T('pubKeyHome', 96, 118)} opacity={O('pubKeyHome')}>
              <image href={getIcon('wireguard-key')} x={-16} y={-16} width={32} height={32} />
              <text textAnchor="middle" y={-24} fontSize={10} fill={COLORS.CRYPTO} fontWeight={700}>PUBLIC</text>
            </g>
            <g transform={T('privKeyHome', 150, 232)} opacity={O('privKeyHome')}>
              <image href={getIcon('wireguard-key')} x={-16} y={-16} width={32} height={32} />
              <text textAnchor="middle" y={30} fontSize={10} fill={COLORS.CRYPTO} fontWeight={700}>PRIVATE</text>
            </g>
            <g transform={T('pubKeyOffice', 528, 118)} opacity={O('pubKeyOffice')}>
              <image href={getIcon('wireguard-key')} x={-16} y={-16} width={32} height={32} />
              <text textAnchor="middle" y={-24} fontSize={10} fill={COLORS.CRYPTO} fontWeight={700}>PUBLIC</text>
            </g>
            <g transform={T('privKeyOffice', 582, 232)} opacity={O('privKeyOffice')}>
              <image href={getIcon('wireguard-key')} x={-16} y={-16} width={32} height={32} />
              <text textAnchor="middle" y={30} fontSize={10} fill={COLORS.CRYPTO} fontWeight={700}>PRIVATE</text>
            </g>

            <g transform={T('keyInsightBadge', 366, 330)} opacity={O('keyInsightBadge')}>
              <Badge x={-140} y={0} text={KEY_INSIGHT} color={COLORS.CRYPTO} w={280} />
            </g>
            <g transform={T('keyCaptionBox', 366, 400)} opacity={O('keyCaptionBox')}>
              <rect x={-320} y={0} width={640} height={58} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <text x={0} y={24} textAnchor="middle" fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">
                {KEY_CAPTION}
              </text>
            </g>
          </g>
        )}

        {/* ═══════ ACT 3 — COORDINATION SERVER: SI MAK COMBLANG ═══════ */}
        {phaseIdx === 2 && (
          <g transform="translate(0, 80)">
            <g transform={T('ipLabelHome', 150, 240)} opacity={O('ipLabelHome')}>
              <rect x={-46} y={0} width={92} height={22} rx={6} fill="#000" stroke={COLORS.MUTED} strokeWidth={1} />
              <text textAnchor="middle" y={15} fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>{ipText.home}</text>
            </g>
            <g transform={T('ipLabelOffice', 582, 240)} opacity={O('ipLabelOffice')}>
              <rect x={-46} y={0} width={92} height={22} rx={6} fill="#000" stroke={COLORS.MUTED} strokeWidth={1} />
              <text textAnchor="middle" y={15} fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>{ipText.office}</text>
            </g>

            <g transform={T('coordServerBox', 366, 30)} opacity={O('coordServerBox')}>
              <ServerBox x={0} y={0} label="COORDINATION SERVER" color={COLORS.SERVER} w={260} />
              <image href={getIcon('coordination-server')} x={-105} y={4} width={28} height={28} />
            </g>

            <g opacity={O('coordDashHome')}>
              <line x1={150} y1={190} x2={280} y2={94} stroke={COLORS.SERVER} strokeWidth={1.5} strokeDasharray="5,5" opacity={0.6} />
            </g>
            <g opacity={O('coordDashOffice')}>
              <line x1={582} y1={190} x2={452} y2={94} stroke={COLORS.SERVER} strokeWidth={1.5} strokeDasharray="5,5" opacity={0.6} />
            </g>

            {tokenPos.home > 0 && (
              <circle cx={lerp(150, 280, tokenPos.home)} cy={lerp(190, 94, tokenPos.home)} r={7} fill={COLORS.CRYPTO} filter="url(#glow)" />
            )}
            {tokenPos.office > 0 && (
              <circle cx={lerp(582, 452, tokenPos.office)} cy={lerp(190, 94, tokenPos.office)} r={7} fill={COLORS.CRYPTO} filter="url(#glow)" />
            )}

            <g transform={T('coordNoteBadge', 366, 380)} opacity={O('coordNoteBadge')}>
              <rect x={-320} y={0} width={640} height={58} rx={14} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={1.5} />
              <text x={0} y={24} textAnchor="middle" fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">
                {COORD_NOTE}
              </text>
            </g>

            <g transform={T('coordPayoffCard', 366, 460)} opacity={O('coordPayoffCard')}>
              <rect x={-260} y={0} width={520} height={54} rx={14} fill={COLORS.PANEL} stroke={COLORS.CRYPTO} strokeWidth={1.5} />
              <circle cx={-224} cy={27} r={6} fill={COLORS.CRYPTO} filter="url(#glow)" />
              <text x={-10} y={33} textAnchor="middle" fill={COLORS.CRYPTO} fontSize={14} fontWeight={700}>{COORD_PAYOFF}</text>
            </g>
          </g>
        )}

        {/* ═══════ ACT 4 — NEMBUS TEMBOK BARENGAN ═══════ */}
        {phaseIdx === 3 && (
          <g transform="translate(0, 80)">
            <g transform={T('wallHome4', 250, 170)} opacity={O('wallHome4')}><FirewallWall x={0} y={0} /></g>
            <g transform={T('wallOffice4', 500, 170)} opacity={O('wallOffice4')}><FirewallWall x={0} y={0} /></g>

            {punchPos.home > 0 && (
              <circle cx={lerp(150, 366, punchPos.home)} cy={170} r={9} fill={COLORS.SUCCESS} filter="url(#glow)" />
            )}
            {punchPos.office > 0 && (
              <circle cx={lerp(582, 366, punchPos.office)} cy={170} r={9} fill={COLORS.SUCCESS} filter="url(#glow)" />
            )}
            <g transform={T('tensionBadge1', 366, 230)} opacity={O('tensionBadge1')}>
              <text textAnchor="middle" fontSize={15} fontWeight={700} fill={COLORS.MUTED}>{HOLEPUNCH_TENSION}</text>
            </g>

            {p2pLine > 0 && (
              <line x1={150} y1={170} x2={lerp(150, 582, p2pLine)} y2={170}
                stroke={COLORS.SUCCESS} strokeWidth={4} strokeLinecap="round" filter="url(#glow)" />
            )}
            <g transform={T('p2pBadge', 366, 270)} opacity={O('p2pBadge')}>
              <Badge x={-130} y={0} text={HOLEPUNCH_SUCCESS} color={COLORS.SUCCESS} w={260} />
            </g>

            <g transform={T('wallOfficeStrict', 500, 170)} opacity={O('wallOfficeStrict')}>
              <FirewallWall x={0} y={0} strict={true} />
            </g>

            <g transform={T('derpServerBox', 366, 340)} opacity={O('derpServerBox')}>
              <ServerBox x={0} y={0} label="DERP RELAY SERVER" color={COLORS.RELAY} w={240} />
              <image href={getIcon('derp-relay')} x={-95} y={4} width={28} height={28} />
            </g>
            {relayLine.home > 0 && (
              <line x1={150} y1={170} x2={lerp(150, 366, relayLine.home)} y2={lerp(170, 380, relayLine.home)}
                stroke={COLORS.RELAY} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
            )}
            {relayLine.office > 0 && (
              <line x1={582} y1={170} x2={lerp(582, 366, relayLine.office)} y2={lerp(170, 380, relayLine.office)}
                stroke={COLORS.RELAY} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
            )}
            <g transform={T('relayBadge', 366, 440)} opacity={O('relayBadge')}>
              <Badge x={-130} y={0} text={RELAY_FALLBACK} color={COLORS.RELAY} w={260} />
            </g>

            <g transform={T('compareBox', 366, 510)} opacity={O('compareBox')}>
              <rect x={-320} y={0} width={640} height={40} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <text x={0} y={26} textAnchor="middle" fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">{HOLEPUNCH_COMPARE}</text>
            </g>
          </g>
        )}

        {/* ═══════ ACT 5 — SEKARANG BERASA 1 JARINGAN (PAYOFF) ═══════ */}
        {phaseIdx === 4 && (
          <g transform="translate(0, 80)">
            {(() => {
              const nodes = { h: [DEVICES.home.x, anchorY.home], o: [DEVICES.office.x, anchorY.office], p: [366, 120], c: [366, 470] }
              const pairs = [['h','o','ho'], ['h','p','hp'], ['h','c','hc'], ['o','p','op'], ['o','c','oc'], ['p','c','pc']]
              return pairs.map(([a, b, id]) => {
                // NOTE: filter="url(#glow)" pakai filterUnits default (objectBoundingBox),
                // jadi region-nya dihitung persen dari bounding-box elemen. Untuk garis
                // yang PERSIS horizontal (ho) atau PERSIS vertikal (pc), bounding-box-nya
                // punya height=0 / width=0 → filter region ikut collapse ke 0 → garis
                // jadi tidak ter-render sama sekali (bukan soal opacity/timing export,
                // reproduce juga di preview biasa). Fix: nudge sub-pixel di sisi yang
                // degenerate supaya bounding-box selalu punya luas > 0.
                const EPS = 0.5
                let [x1, y1] = nodes[a]
                let [x2, y2] = nodes[b]
                if (x1 === x2) x2 += EPS
                if (y1 === y2) y2 += EPS
                return (
                  <line key={id} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={COLORS.SUCCESS} strokeWidth={2.5} opacity={O(`meshLine-${id}`) * 0.8} filter="url(#glow)" />
                )
              })
            })()}

            <g transform={T('meshPhone', 366, 120)} opacity={O('meshPhone')}>
              <image href={getIcon('mobile-phone')} x={-16} y={-28} width={32} height={56} />
              <text textAnchor="middle" y={46} fill={COLORS.TEXT} fontSize={12} fontWeight={700}>HP</text>
            </g>
            <g transform={T('meshCloud', 366, 470)} opacity={O('meshCloud')}>
              <ServerBox x={0} y={-32} label="SERVER CLOUD" color={COLORS.SUCCESS} w={180} />
            </g>

            <g transform={T('closingCard', 366, 570)} opacity={O('closingCard')}>
              <rect x={-330} y={0} width={660} height={64} rx={16} fill={COLORS.PANEL} stroke={COLORS.BRAND} strokeWidth={2} filter="url(#shadow)" />
              <text x={0} y={26} textAnchor="middle" fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">
                {CLOSING_LINE}
              </text>
            </g>
            <g transform={T('closingBrandBadge', 366, 655)} opacity={O('closingBrandBadge')}>
              <Badge x={-140} y={0} text={CLOSING_BRAND} color={COLORS.BRAND} w={280} />
            </g>
          </g>
        )}
      </g>
      )}
    </svg>
  )
}
