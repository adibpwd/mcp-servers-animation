// 93-reverse-proxy/Animation.jsx
// Timeline GSAP + state + komposisi. Scene per-Act (pure presentational) ada di acts/
// (pola "1 act = 1 file", docs/standardizations/07-act-scene-pattern.md).

import React, { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
} from '../../shared/scene-ui/v1'
import {
  VW,
  VH,
  PHASES,
  COLORS,
  COPY,
  ZONES,
  SFX_MAP,
  INITIAL_VIS,
  INITIAL_ACTORS,
  INITIAL_TXT,
  INTRO_CATEGORY,
  INTRO_TITLE_A,
  INTRO_TITLE_B,
  INTRO_SUBTITLE,
  INTRO_HOLD,
  INTRO_MORPH,
  INTRO_BG_ACT,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { ACT_SCENES } from './acts'

// ───────────────────────── Util state actor ─────────────────────────

const makeActors = () => cloneActors(INITIAL_ACTORS)
function cloneActors(src) {
  return Object.fromEntries(Object.entries(src).map(([k, v]) => [k, { ...v }]))
}

// ───────────────────────── Komponen utama ─────────────────────────

export default function ReverseProxyAnimation({ paused, speed, volume, previewSfx, audioUnlocked }) {
  const [morphP, setMorphP] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(-1)
  const [contentStarted, setContentStarted] = useState(false)
  const [vis, setVis] = useState(INITIAL_VIS)
  const [actors, setActors] = useState(makeActors)
  const [txt, setTxt] = useState(INITIAL_TXT)
  const [clientStatus, setClientStatus] = useState('idle')

  const V = useRef({ ...INITIAL_VIS }).current // nilai animasi mutable (0..1)
  const A = useRef(makeActors()).current // posisi actor mutable
  const tlRef = useRef(null)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  useEffect(() => { volumeRef.current = volume }, [volume])
  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => {
    sfxLoader.setEnabled(Boolean(previewSfx && audioUnlocked))
  }, [previewSfx, audioUnlocked])

  const playSfx = (key) => {
    const entry = SFX_MAP[key]
    if (!entry) return
    sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current })
  }

  useEffect(() => {
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = master
    window.__animationTimeline = master
    window.__flushSync = flushSync

    const syncV = () => setVis({ ...V })
    const syncA = () => setActors(cloneActors(A))

    // Helper timeline (semua memakai waktu absolut pada master)
    const fade = (at, key, to, dur = 0.35, ease = 'power2.out') =>
      master.to(V, { [key]: to, duration: dur, ease, onUpdate: syncV }, at)
    const sfx = (at, key) => master.add(() => playSfx(key), at)
    const pop = (at, key, sfxKey, dur = 0.35) => {
      fade(at, key, 1, dur)
      if (sfxKey) sfx(at, sfxKey)
    }
    const pulse = (at, key, dur = 0.3) => {
      fade(at, key, 1, dur / 2)
      fade(at + dur / 2, key, 0, dur / 2)
    }
    const move = (at, name, props, dur, ease = 'power2.inOut') =>
      master.to(A[name], { ...props, duration: dur, ease, onUpdate: syncA }, at)
    const place = (at, name, vals) =>
      master.add(() => { Object.assign(A[name], vals); syncA() }, at)
    const swapNote = (at, key, txtKey, lines) => {
      fade(at, key, 0, 0.25)
      master.add(() => setTxt((prev) => ({ ...prev, [txtKey]: lines })), at + 0.25)
      fade(at + 0.25, key, 1, 0.4)
    }

    // ── Reset loop (t=0): semua state naratif kembali ke awal ──
    master.add(() => {
      Object.assign(V, INITIAL_VIS)
      Object.entries(INITIAL_ACTORS).forEach(([k, v]) => Object.assign(A[k], v))
      setPhaseIdx(-1)
      setMorphP(0)
      setContentStarted(false)
      setClientStatus('idle')
      setTxt(INITIAL_TXT)
      syncV()
      syncA()
    }, 0)

    // ── Intro: hero → header compact ──
    let time = INTRO_HOLD
    const mo = { p: 0 }
    master.to(mo, { p: 1, duration: INTRO_MORPH, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, time)
    time += INTRO_MORPH
    master.add(() => setContentStarted(true), time)

    // ── Act 1: Satu pintu publik ──
    const a1 = time
    master.add(() => setPhaseIdx(0), a1)
    pop(a1 + 0.3, 'client', 'POP')
    fade(a1 + 1.1, 'nClient', 1, 0.4)
    pop(a1 + 2.1, 'endpoint', 'POP')
    fade(a1 + 2.8, 'nEndpoint', 1, 0.4)
    pop(a1 + 3.8, 'gate', 'CONNECT')
    fade(a1 + 4.4, 'nGate', 1, 0.4)
    // Backend dan cabang muncul redup; sengaja silent karena gate sudah berbunyi (CONNECT, 1,7 detik sebelumnya)
    pop(a1 + 5.5, 'beA', null)
    pop(a1 + 5.5, 'beB', null)
    fade(a1 + 5.5, 'lines', 1, 0.4)
    master.add(() => setClientStatus('loading'), a1 + 6.6)
    sfx(a1 + 6.6, 'CLICK')
    place(a1 + 6.85, 'pk1', { x: ZONES.PACKET_START.x, y: ZONES.PACKET_START.y, s: 0 })
    sfx(a1 + 6.9, 'PACKET_SEND')
    move(a1 + 6.9, 'pk1', { s: 1 }, 0.25, 'power2.out')
    move(a1 + 6.9, 'pk1', { y: ZONES.PACKET_ABOVE_ENDPOINT.y }, 0.5, 'power2.in')
    pulse(a1 + 7.4, 'endpointPulse', 0.35)
    move(a1 + 7.75, 'pk1', { y: ZONES.GATE_ENTRY.y }, 0.7) // melintas di belakang badge endpoint
    // Apply: packet diserap gate, scan dot lahir (overlap)
    sfx(a1 + 8.45, 'CONNECT')
    move(a1 + 8.45, 'pk1', { s: 0 }, 0.25, 'power2.in')
    pulse(a1 + 8.45, 'gatePulse', 0.4)
    place(a1 + 8.4, 'dot', { x: ZONES.SCAN_SPAWN.x, y: ZONES.SCAN_SPAWN.y, s: 0 })
    move(a1 + 8.45, 'dot', { s: 1 }, 0.3, 'power2.out')
    time = a1 + PHASES[0].duration

    // ── Act 2: Proxy memilih tujuan ──
    const a2 = time
    master.add(() => setPhaseIdx(1), a2)
    swapNote(a2 + 0.3, 'nGate', 'gate', COPY.NOTE_GATE_2)
    pop(a2 + 0.9, 'ruleA', 'POP')
    pop(a2 + 1.2, 'ruleB', null) // silent: 0,3 detik setelah POP chip A
    sfx(a2 + 2.4, 'BEAM')
    move(a2 + 2.4, 'dot', { x: ZONES.RULE_B.x, y: ZONES.SCAN_Y }, 0.7)
    sfx(a2 + 3.1, 'TICK')
    fade(a2 + 3.1, 'ruleBMiss', 1, 0.2)
    fade(a2 + 3.3, 'ruleBMiss', 0, 0.3)
    sfx(a2 + 3.9, 'BEAM')
    move(a2 + 3.9, 'dot', { x: ZONES.RULE_A.x, y: ZONES.SCAN_Y }, 0.7)
    sfx(a2 + 4.6, 'MATCH')
    fade(a2 + 4.6, 'ruleAMatch', 1, 0.3)
    swapNote(a2 + 4.6, 'nGate', 'gate', COPY.NOTE_GATE_3)
    sfx(a2 + 5.7, 'BEAM')
    fade(a2 + 5.7, 'lineALit', 1, 0.9, 'power1.inOut')
    sfx(a2 + 6.6, 'POP')
    fade(a2 + 6.6, 'beAActive', 1, 0.4)
    fade(a2 + 6.8, 'nBeA', 1, 0.4)
    fade(a2 + 6.8, 'nBeB', 1, 0.4)
    time = a2 + PHASES[1].duration

    // ── Act 3: Request diteruskan ──
    const a3 = time
    master.add(() => setPhaseIdx(2), a3)
    swapNote(a3 + 0.3, 'nGate', 'gate', COPY.NOTE_GATE_4)
    place(a3 + 1.45, 'pk2', { x: ZONES.EXIT_A.x, y: ZONES.EXIT_A.y, s: 0 })
    sfx(a3 + 1.5, 'PACKET_SEND')
    move(a3 + 1.5, 'pk2', { s: 1 }, 0.25, 'power2.out')
    move(a3 + 1.5, 'dot', { s: 0 }, 0.25, 'power2.in') // overlap: dot menyusut saat packet keluar
    move(a3 + 1.8, 'pk2', { x: ZONES.BACKEND_A.x, y: ZONES.BACKEND_ENTRY_Y }, 1.1)
    sfx(a3 + 2.9, 'CONNECT')
    move(a3 + 2.9, 'pk2', { s: 0 }, 0.25, 'power2.in')
    fade(a3 + 2.9, 'beAProc', 1, 0.4)
    swapNote(a3 + 3.6, 'nBeA', 'beA', COPY.NOTE_BE_A_2)
    time = a3 + PHASES[2].duration

    // ── Act 4: Response kembali ──
    const a4 = time
    master.add(() => setPhaseIdx(3), a4)
    swapNote(a4 + 0.3, 'nBeA', 'beA', COPY.NOTE_BE_A_3)
    place(a4 + 1.55, 'rs1', { x: ZONES.BACKEND_A.x, y: ZONES.BACKEND_ENTRY_Y, s: 0 })
    sfx(a4 + 1.6, 'POP')
    move(a4 + 1.6, 'rs1', { s: 1 }, 0.25, 'power2.out')
    fade(a4 + 1.6, 'beAProc', 0, 0.4)
    sfx(a4 + 2.0, 'PACKET_SEND')
    move(a4 + 2.0, 'rs1', { x: ZONES.EXIT_A.x, y: ZONES.EXIT_A.y + 6 }, 1.1)
    // Handoff di gate: capsule kedua lahir sebelum capsule pertama selesai diserap
    place(a4 + 2.95, 'rs2', { x: ZONES.GATE_ENTRY.x, y: ZONES.GATE_ENTRY.y, s: 0 })
    move(a4 + 3.0, 'rs2', { s: 1 }, 0.3, 'power2.out')
    sfx(a4 + 3.1, 'CONNECT')
    move(a4 + 3.1, 'rs1', { s: 0 }, 0.25, 'power2.in')
    pulse(a4 + 3.1, 'gatePulse', 0.4)
    swapNote(a4 + 3.2, 'nGate', 'gate', COPY.NOTE_GATE_5)
    sfx(a4 + 3.5, 'PACKET_SEND')
    move(a4 + 3.5, 'rs2', { y: ZONES.RESPONSE_END.y }, 1.2) // melintas di belakang badge endpoint
    pulse(a4 + 3.9, 'endpointPulse', 0.35)
    // Apply: client menerima response
    sfx(a4 + 4.7, 'SUCCESS')
    move(a4 + 4.7, 'rs2', { s: 0 }, 0.2, 'power2.in')
    master.add(() => setClientStatus('done'), a4 + 4.7)
    fade(a4 + 4.7, 'clientDone', 1, 0.3)
    swapNote(a4 + 4.7, 'nClient', 'client', COPY.NOTE_CLIENT_DONE)
    pop(a4 + 5.9, 'takeaway', 'TAKEAWAY', 0.4)
    // Penanda akhir: memperpanjang timeline sampai hold Act 4 selesai (tanpa ini hold hilang saat loop)
    master.add(() => {}, a4 + PHASES[3].duration)

    return () => {
      master.kill()
      delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  useEffect(() => {
    if (tlRef.current && speed) tlRef.current.timeScale(speed)
  }, [speed])

  useEffect(() => {
    if (!tlRef.current) return
    if (paused) tlRef.current.pause()
    else tlRef.current.resume()
  }, [paused])

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', height: '100%', background: COLORS.DEEP }}>
      <rect width={VW} height={VH} fill={COLORS.DEEP} />

      {/* Header tetap dirender setelah morph (progress=1 → mode compact) */}
      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[{ label: INTRO_CATEGORY, color: COLORS.MUTED }]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.BLUE },
          { label: INTRO_TITLE_B, color: COLORS.GREEN },
        ]}
        subtitle={INTRO_SUBTITLE}
        bg={INTRO_BG_ACT}
        bgScenes={ACT_SCENES}
      />

      {contentStarted && <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} />}

      {contentStarted && (
        <ContentBodyV1
          debugName="reverse-proxy-body"
          render={() => {
            const Act = ACT_SCENES[phaseIdx]
            return Act ? <Act state={{ vis, actors, txt, clientStatus }} /> : null
          }}
        />
      )}
    </svg>
  )
}
