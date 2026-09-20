// src/content/65-systemd/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════
// REVISI 04 — eksekusi revisi-02 + revisi-03 (lihat
// revisi/2026-09-20-revisi-04-eksekusi-peta-sistem.md). Ganti dari lajur
// tunggal jadi peta 7 stasiun (STATIONS, data.js) yang lahir lewat garis
// alur (LINES) -- Aturan Asal-Usul, bukan popIn tanpa sumber. Caption
// lama (say()+bar) diganti IconCaption/PathLabel yang menempel ke
// stasiun/garis. Ditambah Path Bar (lokasi Linux nyata per Act). Bug SFX
// ref (volume/speed dari closure beku) diperbaiki -- semua lewat
// volumeRef/speedRef. Cerita 6 Act TIDAK berubah, hanya posisi, cara
// muncul, dan durasi per-Act (12/12/16/12/15/13s, lihat data.js PHASES).
//
// DEVIASI dari plan §9 (icon PNG lewat vm-icon-generator + ChatGPT):
// icon di sini adalah pictogram SVG inline (komponen Icon di bawah),
// bukan PNG hasil AI-generate -- pipeline itu butuh interaksi Chrome
// manual yang di luar jangkauan eksekusi non-interaktif. Bisa diganti
// PNG asli nanti tanpa mengubah posisi/timeline (lihat revisi-04 §Icon).
// ═══════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE, INTRO_SUBTITLE,
  STATIONS, LINES, CLOSING_Y, PATH_ATLAS,
  UNIT_INFO, PROCESS_LABEL, MANAGER_LABEL, MANAGED_PROCESS_LABEL,
  PID_INITIAL, PID_AFTER_RESTART, LIFECYCLE_META,
  BOOT_TARGET, DEPENDENCIES, ENABLE_BADGE, START_BADGE,
  JOURNAL_ENTRIES, SOURCE_COLOR, DIAGNOSIS_STEPS, CLOSING_STAMPS, CAPTIONS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

const STATION_IDS = Object.keys(STATIONS)

export default function SystemdAnimation({
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
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  // ── peta sistem: opacity per stasiun (0 belum lahir, 1 menyala, 0.4 redup) ──
  const [stationOpacity, setStationOpacity] = useState(() =>
    Object.fromEntries(STATION_IDS.map(id => [id, 0])))
  // ── progres gambar tiap garis (0..1) ──
  const [lineProgress, setLineProgress] = useState(() =>
    Object.fromEntries(LINES.map(l => [l.id, 0])))
  // ── pulsa kecil yang berjalan di garis tertentu (journal j1/j2, Act 6 konvergen) ──
  const [pulse, setPulse] = useState({})
  // ── kedip merah di garis tertentu saat failure (Act 4) ──
  const [lineAlert, setLineAlert] = useState({})

  const [unitDeclared, setUnitDeclared] = useState(false)
  const [serviceBorn, setServiceBorn] = useState(false)
  const [lifecycle, setLifecycle] = useState('declared')
  const [pid, setPid] = useState(PID_INITIAL)

  const [enabledOn, setEnabledOn] = useState(false)
  const [startedOn, setStartedOn] = useState(false)
  const [restartAttempt, setRestartAttempt] = useState(0)
  const [journalCount, setJournalCount] = useState(0)
  const [diagnosisStep, setDiagnosisStep] = useState(-1)

  const [caption, setCaption] = useState('')
  const [captionStation, setCaptionStation] = useState(null)
  const [pathText, setPathTextState] = useState('')
  const [pathOpacity, setPathOpacity] = useState(0)
  const [closingOpacity, setClosingOpacity] = useState(0)

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── helper: stasiun & garis (pola baru, ganti popIn/popOut lajur tunggal) ──
  const lineOf = (id) => LINES.find(l => l.id === id)
  const stationOf = (id) => STATIONS[id]
  const pointAt = (lineId, t) => {
    const l = lineOf(lineId)
    const a = stationOf(l.from)
    const b = stationOf(l.to)
    return { x: a.cx + (b.cx - a.cx) * t, y: a.cy + (b.cy - a.cy) * t }
  }

  // Bug SFX ref (temuan d, revisi-03 §10.4): SEMUA sfx di bawah ini WAJIB
  // pakai volumeRef.current/speedRef.current, tidak pernah `volume`/`speed`
  // polos dari closure useEffect deps [] yang beku saat mount.
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)
  const playSfx = (entry, mult = 1) => sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current * mult, speed: speedRef.current })

  const lightStation = (tl, time, id, opts = {}) => {
    const { to = 1, duration = 0.55, sfxEntry = null, sfxMult = 1 } = opts
    const o = { v: stationOpacity[id] || 0 }
    // SFX dijadwalkan langsung di timeline (bukan di dalam callback saat
    // playback -- itu menambah child baru ke timeline yang sedang jalan
    // sehingga bunyi telat/hilang/dobel tiap loop).
    if (sfxEntry) sfxOn(tl, time, () => playSfx(sfxEntry, sfxMult))
    tl.to(o, {
      v: to, duration, ease: 'power2.out',
      onUpdate: () => setStationOpacity(prev => ({ ...prev, [id]: o.v })),
    }, time)
  }

  const dimStation = (tl, time, id, opts = {}) => {
    const { to = 0.4, duration = 0.6 } = opts
    const o = { v: 1 }
    tl.to(o, {
      v: to, duration, ease: 'power1.inOut',
      onUpdate: () => setStationOpacity(prev => ({ ...prev, [id]: o.v })),
    }, time)
  }

  const drawLine = (tl, time, id, opts = {}) => {
    const { duration = 0.6, sfxEntry = null, sfxMult = 1 } = opts
    if (sfxEntry) sfxOn(tl, time, () => playSfx(sfxEntry, sfxMult))
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease: 'power1.inOut',
      onUpdate: () => setLineProgress(prev => ({ ...prev, [id]: o.v })),
    }, time)
  }

  // Pulsa kecil berjalan sepanjang garis -- "dipicu peristiwa" (Aturan
  // Asal-Usul cara 2, revisi-02 §3.2), dipakai utk 2 entri journal
  // pertama (j1/j2) & pulsa dua-arah konvergen di Act 6.
  const pulseAlong = (tl, time, id, lineId, opts = {}) => {
    const { duration = 0.55, sfxEntry = null, sfxMult = 0.7 } = opts
    if (sfxEntry) sfxOn(tl, time, () => playSfx(sfxEntry, sfxMult))
    tl.add(() => setPulse(prev => ({ ...prev, [id]: { lineId, t: 0, opacity: 1 } })), time)
    const o = { t: 0 }
    tl.to(o, {
      t: 1, duration, ease: 'power1.in',
      onUpdate: () => setPulse(prev => ({ ...prev, [id]: { lineId, t: o.t, opacity: 1 - o.t * 0.3 } })),
      onComplete: () => setPulse(prev => { const n = { ...prev }; delete n[id]; return n }),
    }, time)
  }

  // Kedip di garis tertentu -- default merah/cepat (Act 4 failure), atau
  // warna+kecepatan lain (Act 6 highlight lembut saat step diagnosis aktif).
  const blinkLine = (tl, time, id, opts = {}) => {
    const { cycles = 5, stepDuration = 0.18, sfxEntry = null, color = COLORS.FAILED, warn = true } = opts
    if (sfxEntry) {
      if (warn) sfxOn(tl, time, () => sfxLoader.warning(sfxEntry.name, { volume: volumeRef.current, speed: speedRef.current }))
      else sfxOn(tl, time, () => playSfx(sfxEntry))
    }
    const o = { a: 0 }
    tl.to(o, {
      a: 1, duration: stepDuration, yoyo: true, repeat: cycles,
      onUpdate: () => setLineAlert(prev => ({ ...prev, [id]: { opacity: o.a, color } })),
      onComplete: () => setLineAlert(prev => ({ ...prev, [id]: { opacity: 0, color } })),
    }, time)
  }

  const say = (tl, time, text, stationId) => tl.add(() => { setCaption(text); setCaptionStation(stationId) }, time)

  const setPathText = (tl, time, text) => {
    tl.to({}, { duration: 0.12, onComplete: () => setPathOpacity(0) }, time)
    tl.add(() => setPathTextState(text), time + 0.14)
    tl.to({}, { duration: 0.16, onComplete: () => setPathOpacity(1) }, time + 0.16)
  }

  // ═══════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — enam Act, ±80s (intro ~1s + 12+12+16+12+15+13s)
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setStationOpacity(Object.fromEntries(STATION_IDS.map(id => [id, 0])))
      setLineProgress(Object.fromEntries(LINES.map(l => [l.id, 0])))
      setPulse({})
      setLineAlert({})
      setUnitDeclared(false); setServiceBorn(false)
      setLifecycle('declared'); setPid(PID_INITIAL)
      setEnabledOn(false); setStartedOn(false)
      setRestartAttempt(0)
      setJournalCount(0)
      setDiagnosisStep(-1)
      setCaption(''); setCaptionStation(null)
      setPathTextState(''); setPathOpacity(0)
      setClosingOpacity(0)
    }, t)

    // ═══════════════ INTRO — hero centered → header ════════════════
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Dari Process ke Service (12s, §6.1) ═════
    tl.add(() => setPhaseIdx(0), t)
    // 1) Process Manual lahir sendirian -- satu-satunya "asal-usul" tanpa
    //    garis (titik awal cerita), fade polos bukan popIn dramatis.
    lightStation(tl, t + 0.1, 'processManual', { duration: 0.8 })
    say(tl, t + 0.3, CAPTIONS.RAW_PROCESS, 'processManual')
    // 2) Garis Process -> Unit digambar
    drawLine(tl, t + 2.0, 'process-to-unit', { duration: 0.7, sfxEntry: SFX_MAP.SLIDE_IN })
    // 3) Unit File menyala di ujung garis + path tag + Path Bar
    //    (garis selesai di t+2.7 -> station menyala tepat di ujungnya, bunyi POP
    //    sinkron dengan visual, tanpa jeda kosong)
    lightStation(tl, t + 2.7, 'unitFile', { duration: 0.6, sfxEntry: SFX_MAP.POP })
    setPathText(tl, t + 2.85, PATH_ATLAS.unitFile)
    say(tl, t + 2.95, CAPTIONS.UNIT_DECLARED, 'unitFile')
    // 4) Unit fields terisi
    tl.add(() => setUnitDeclared(true), t + 5.5)
    sfxOn(tl, t + 5.5, () => playSfx(SFX_MAP.TICK))
    // service dikenali penuh, tak lama setelah field terisi
    tl.add(() => setServiceBorn(true), t + 5.8)
    sfxOn(tl, t + 5.8, () => playSfx(SFX_MAP.CHIME))
    say(tl, t + 5.9, CAPTIONS.SERVICE_BORN, 'unitFile')
    // 5) Process Manual meredup, TIDAK dihapus (temuan a)
    dimStation(tl, t + 8.5, 'processManual', { to: 0.35 })
    let act1End = t + 12.0

    // ═══════════════ ACT 2 — Manager Menjalankan Lifecycle (12s, §6.2) ═
    let t2 = act1End
    tl.add(() => setPhaseIdx(1), t2)
    // 1) Garis Unit File -> Manager; Manager lahir menyala di ujung garis
    drawLine(tl, t2 + 0.1, 'unit-to-manager', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH_LOW })
    lightStation(tl, t2 + 0.9, 'manager', { duration: 0.6 })
    tl.add(() => setLifecycle('starting'), t2 + 0.9)
    say(tl, t2 + 1.0, CAPTIONS.MANAGER_STARTS, 'manager')
    // 2) starting -> active
    let a2 = t2 + 3.0
    tl.add(() => setLifecycle('active'), a2)
    sfxOn(tl, a2, () => playSfx(SFX_MAP.SUCCESS))
    say(tl, a2 + 0.1, CAPTIONS.BECOMES_ACTIVE, 'manager')
    a2 += 1.0
    // 3) garis pendek Manager -> Managed Process, lahir dgn PID 4021
    drawLine(tl, a2, 'manager-to-managed', { duration: 0.5, sfxEntry: SFX_MAP.POP2 })
    a2 += 0.6
    lightStation(tl, a2, 'managedProcess', { duration: 0.5 })
    setPathText(tl, a2 + 0.1, PATH_ATLAS.managedProcessInitial)
    say(tl, a2 + 0.2, CAPTIONS.PID_NOTE, 'managedProcess')
    let act2End = t2 + 12.0

    // ═══════════════ ACT 3 — Boot & Dependency, Enable ≠ Start (16s, §6.3) ═
    let t3 = act2End
    tl.add(() => setPhaseIdx(2), t3)
    // 1) Garis Manager -> Boot Target; Boot Target lahir menyala
    drawLine(tl, t3 + 0.1, 'manager-to-boot', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH })
    lightStation(tl, t3 + 0.9, 'bootTarget', { duration: 0.6 })
    setPathText(tl, t3 + 1.0, PATH_ATLAS.bootTarget)
    say(tl, t3 + 1.1, CAPTIONS.BOOT_TARGET, 'bootTarget')
    let a3 = t3 + 3.0
    sfxOn(tl, a3, () => playSfx(SFX_MAP.TICK))
    say(tl, a3 + 0.05, CAPTIONS.DEP_CHAIN, 'bootTarget')
    a3 += 2.5
    // ENABLE (boot-time) vs START (sekarang) -- dua badge, dua SFX beda
    tl.add(() => setEnabledOn(true), a3)
    sfxOn(tl, a3, () => playSfx(SFX_MAP.LOCK))
    a3 += 1.5
    tl.add(() => setStartedOn(true), a3)
    sfxOn(tl, a3, () => playSfx(SFX_MAP.POP2))
    say(tl, a3 + 0.1, CAPTIONS.ENABLE_VS_START, 'bootTarget')
    // Boot Target TIDAK diredupkan/dihapus di akhir Act (revisi-02 §3.1:
    // semua stasiun tetap terlihat sampai Act 6)
    let act3End = t3 + 16.0

    // ═══════════════ ACT 4 — Ketika Process Gagal (12s, §6.4) ═════════
    let t4 = act3End
    tl.add(() => setPhaseIdx(3), t4)
    say(tl, t4 + 0.1, CAPTIONS.PROCESS_DIES, 'managedProcess')
    let a4 = t4 + 2.0
    tl.add(() => setLifecycle('failed'), a4)
    blinkLine(tl, a4, 'manager-to-managed', { cycles: 5, stepDuration: 0.18, sfxEntry: SFX_MAP.ALERT_PULSE })
    say(tl, a4 + 0.1, CAPTIONS.STATE_FAILED, 'manager')
    a4 += 2.5
    tl.add(() => { setLifecycle('restarting'); setRestartAttempt(1) }, a4)
    sfxOn(tl, a4, () => playSfx(SFX_MAP.TICK))
    say(tl, a4 + 0.1, CAPTIONS.BOUNDED_RESTART, 'manager')
    a4 += 2.8
    // path tag Managed Process crossfade /proc/4021/ -> /proc/4198/ lewat
    // perubahan `pid` (dibaca langsung di render, tanpa state terpisah)
    tl.add(() => { setLifecycle('active'); setPid(PID_AFTER_RESTART) }, a4)
    sfxOn(tl, a4, () => playSfx(SFX_MAP.CONFIRM))
    say(tl, a4 + 0.1, CAPTIONS.BACK_ACTIVE, 'manager')
    let act4End = t4 + 12.0

    // ═══════════════ ACT 5 — Jejak di Journal (15s, §6.5) ═════════════
    let t5 = act4End
    tl.add(() => setPhaseIdx(4), t5)
    drawLine(tl, t5 + 0.1, 'managed-to-journal', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH_LOW })
    lightStation(tl, t5 + 0.9, 'journal', { duration: 0.6 })
    setPathText(tl, t5 + 1.0, PATH_ATLAS.journal)
    say(tl, t5 + 1.1, CAPTIONS.STDOUT_TO_JOURNAL, 'journal')
    let a5 = t5 + 3.0
    JOURNAL_ENTRIES.forEach((entry, i) => {
      if (i < 2) {
        // dua entri pertama "dipicu peristiwa" -- pulsa berjalan di garis
        pulseAlong(tl, a5, `j-pulse-${i}`, 'managed-to-journal', { duration: 0.5 })
        tl.add(() => setJournalCount(i + 1), a5 + 0.5)
        // TICK di momen pulsa tiba & entri muncul (bukan saat pulsa berangkat)
        sfxOn(tl, a5 + 0.5, () => playSfx(SFX_MAP.TICK))
      } else {
        tl.add(() => setJournalCount(i + 1), a5)
        sfxOn(tl, a5, () => playSfx(SFX_MAP.TICK, 0.7))
      }
      a5 += 0.85
    })
    say(tl, a5 + 0.1, CAPTIONS.MANAGER_EVENTS, 'journal')
    a5 += 1.5
    say(tl, a5, CAPTIONS.TIMELINE_GROWS, 'journal')
    let act5End = t5 + 15.0

    // ═══════════════ ACT 6 — Diagnosis: Ikuti Bukti (13s, §6.6) ═══════
    let t6 = act5End
    tl.add(() => setPhaseIdx(5), t6)
    // 1) Dua garis konvergen ke Diagnosis Terminal
    drawLine(tl, t6 + 0.1, 'managed-to-diagnosis', { duration: 0.6, sfxEntry: SFX_MAP.WHOOSH })
    drawLine(tl, t6 + 0.1, 'journal-to-diagnosis', { duration: 0.6 })
    lightStation(tl, t6 + 0.8, 'diagnosis', { duration: 0.6, sfxEntry: SFX_MAP.CHIME })
    let a6 = t6 + 2.2
    // 2) 3 langkah menyala berurutan, tiap step: Path Bar + garis relevan
    tl.add(() => setDiagnosisStep(0), a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.POP2))
    setPathText(tl, a6 + 0.05, PATH_ATLAS.managedProcessRestarted)
    blinkLine(tl, a6, 'managed-to-diagnosis', { cycles: 2, stepDuration: 0.35, color: COLORS.DIAGNOSIS, warn: false })
    say(tl, a6 + 0.1, CAPTIONS.READ_STATUS, 'diagnosis')
    a6 += 2.0
    tl.add(() => setDiagnosisStep(1), a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.POP2))
    setPathText(tl, a6 + 0.05, PATH_ATLAS.journal)
    blinkLine(tl, a6, 'journal-to-diagnosis', { cycles: 2, stepDuration: 0.35, color: COLORS.DIAGNOSIS, warn: false })
    say(tl, a6 + 0.1, CAPTIONS.FILTER_JOURNAL, 'diagnosis')
    a6 += 2.0
    tl.add(() => setDiagnosisStep(2), a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.POP2))
    blinkLine(tl, a6, 'journal-to-diagnosis', { cycles: 2, stepDuration: 0.35, color: COLORS.DIAGNOSIS, warn: false })
    say(tl, a6 + 0.1, CAPTIONS.CHECK_CONTEXT, 'diagnosis')
    a6 += 2.3
    // 4) Closing -- dua stamp di bawah Diagnosis Terminal (bukan menimpa Journal)
    const co = { v: 0 }
    tl.to(co, { v: 1, duration: 0.5, ease: 'back.out(1.6)', onUpdate: () => setClosingOpacity(co.v) }, a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.DING))
    say(tl, a6 + 0.1, CAPTIONS.TAKEAWAY, 'diagnosis')
    let act6End = a6 + 1.8

    tl.to({}, { duration: 0.9 }, act6End)

    return () => {
      tl.kill()
      delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
    if (paused) tlRef.current.pause(); else tlRef.current.resume()
  }, [speed, paused])

  // ── Icon: pictogram SVG inline (pengganti PNG AI-generate, lihat
  // catatan deviasi di header file) ──
  const Icon = ({ type, size = 28, color = COLORS.TEXT, strokeWidth = 1.8 }) => {
    const s = size / 24
    const p = { fill: 'none', stroke: color, strokeWidth: strokeWidth / s, strokeLinecap: 'round', strokeLinejoin: 'round' }
    return (
      <g transform={`scale(${s})`}>
        {type === 'process' && (
          <g>
            <rect x={-10} y={-10} width={20} height={20} rx={4} {...p} />
            <circle cx={0} cy={0} r={3.5} fill={color} stroke="none" />
          </g>
        )}
        {type === 'document' && (
          <g>
            <path d="M -8,-11 L 3,-11 L 9,-5 L 9,11 L -8,11 Z" {...p} />
            <path d="M 3,-11 L 3,-5 L 9,-5" {...p} />
            <line x1={-4} y1={0} x2={5} y2={0} {...p} />
            <line x1={-4} y1={4} x2={5} y2={4} {...p} />
          </g>
        )}
        {type === 'gear' && (
          <g>
            <circle cx={0} cy={0} r={5} {...p} />
            {Array.from({ length: 8 }).map((_, i) => {
              const ang = (i * Math.PI) / 4
              const x1 = Math.cos(ang) * 8, y1 = Math.sin(ang) * 8
              const x2 = Math.cos(ang) * 11, y2 = Math.sin(ang) * 11
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...p} />
            })}
          </g>
        )}
        {type === 'target' && (
          <g>
            <circle cx={0} cy={0} r={10} {...p} />
            <circle cx={0} cy={0} r={6} {...p} />
            <circle cx={0} cy={0} r={2} fill={color} stroke="none" />
          </g>
        )}
        {type === 'stack' && (
          <g>
            <rect x={-9} y={-8} width={18} height={5} rx={1.5} {...p} />
            <rect x={-9} y={-1} width={18} height={5} rx={1.5} {...p} />
            <rect x={-9} y={6} width={18} height={5} rx={1.5} {...p} />
          </g>
        )}
        {type === 'magnifier' && (
          <g>
            <circle cx={-2} cy={-2} r={7} {...p} />
            <line x1={3} y1={3} x2={10} y2={10} {...p} />
          </g>
        )}
        {type === 'folder' && (
          <g>
            <path d="M -10,-7 L -3,-7 L -1,-4 L 10,-4 L 10,8 L -10,8 Z" {...p} />
          </g>
        )}
        {type === 'lock' && (
          <g>
            <rect x={-7} y={-1} width={14} height={10} rx={2} {...p} />
            <path d="M -4,-1 L -4,-5 A 4,4 0 0 1 4,-5 L 4,-1" {...p} />
          </g>
        )}
        {type === 'play' && (
          <g>
            <path d="M -5,-8 L 8,0 L -5,8 Z" {...p} />
          </g>
        )}
        {type === 'alert' && (
          <g>
            <path d="M 0,-10 L 10,8 L -10,8 Z" {...p} />
            <line x1={0} y1={-3} x2={0} y2={2} {...p} />
            <circle cx={0} cy={5} r={0.8} fill={color} stroke="none" />
          </g>
        )}
        {type === 'restart' && (
          <g>
            <path d="M 8,-2 A 8,8 0 1 0 6,6" {...p} />
            <path d="M 9,-8 L 8,-2 L 2,-3" {...p} />
          </g>
        )}
        {type === 'link' && (
          <g>
            <rect x={-11} y={-4} width={12} height={8} rx={4} {...p} />
            <rect x={-1} y={-4} width={12} height={8} rx={4} {...p} />
          </g>
        )}
        {type === 'check' && (
          <g>
            <circle cx={0} cy={0} r={10} {...p} />
            <path d="M -5,0 L -1,4 L 6,-4" {...p} />
          </g>
        )}
        {type === 'heart' && (
          <g>
            <path d="M 0,10 C -12,2 -10,-8 -4,-8 C -1,-8 0,-5 0,-5 C 0,-5 1,-8 4,-8 C 10,-8 12,2 0,10 Z" {...p} />
            <path d="M -6,0 L -3,0 L -1,-3 L 1,3 L 3,0 L 6,0" {...p} />
          </g>
        )}
        {type === 'route' && (
          <g>
            <circle cx={-7} cy={7} r={2.5} {...p} />
            <circle cx={7} cy={-7} r={2.5} fill={color} stroke="none" />
            <path d="M -7,4.5 C -7,-6 7,6 7,-4.5" {...p} strokeDasharray="2 3" />
          </g>
        )}
        {type === 'clock' && (
          <g>
            <circle cx={0} cy={0} r={10} {...p} />
            <path d="M 0,-5 L 0,0 L 4,3" {...p} />
          </g>
        )}
      </g>
    )
  }

  // ── FlowLine: garis alur yang "digambar" (bukan muncul tiba-tiba) ──
  const FlowLine = ({ line }) => {
    const a = STATIONS[line.from]
    const b = STATIONS[line.to]
    const progress = lineProgress[line.id] || 0
    if (progress <= 0) return null
    const alert = lineAlert[line.id]
    const mx = a.cx + (b.cx - a.cx) * 0.5
    const my = a.cy + (b.cy - a.cy) * 0.5
    return (
      <g>
        <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
          stroke={COLORS.BORDER} strokeWidth={2} pathLength={100}
          strokeDasharray={100} strokeDashoffset={100 * (1 - progress)} opacity={0.7} />
        {alert && alert.opacity > 0.02 && (
          <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
            stroke={alert.color} strokeWidth={3} opacity={alert.opacity} />
        )}
        {progress > 0.02 && progress < 0.98 && line.label && (
          <PathLabel x={mx} y={my} text={line.label} />
        )}
      </g>
    )
  }

  const IconCaption = ({ stationId, text }) => {
    if (!text || captionStation !== stationId) return null
    const st = STATIONS[stationId]
    if (!st) return null
    return (
      <text x={st.cx} y={st.cy + st.h / 2 + 22} textAnchor="middle" fontSize={13} fontWeight={600}
        fontFamily="sans-serif" fill={COLORS.TEXT} stroke={COLORS.BG} strokeWidth={4} paintOrder="stroke">
        {text}
      </text>
    )
  }

  const PathLabel = ({ x, y, text }) => (
    <text x={x} y={y - 6} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}
      stroke={COLORS.BG} strokeWidth={3} paintOrder="stroke">{text}</text>
  )

  // pecah teks jadi baris-baris <= maxChars (greedy per kata)
  const wrapText = (str, maxChars) => {
    const lines = []
    let cur = ''
    str.split(' ').forEach(w => {
      if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w } else { cur = cur ? cur + ' ' + w : w }
    })
    if (cur) lines.push(cur)
    return lines
  }

  const Stamp = ({ x, y, color, top, sub, icon, rot = -7 }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <circle r={48} fill={color} opacity={0.16} />
      <rect x={-76} y={-30} width={152} height={60} rx={9} fill={COLORS.BG} stroke={color} strokeWidth={3} />
      {icon && (
        <g transform="translate(0, -30)">
          <circle r={15} fill={COLORS.BG} stroke={color} strokeWidth={2.5} />
          <Icon type={icon} size={18} color={color} strokeWidth={2} />
        </g>
      )}
      <text x={0} y={1} textAnchor="middle" fontSize={11} fontWeight={900} fontFamily="monospace" fill={color}>{top}</text>
      {sub && <text x={0} y={20} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill={COLORS.MUTED}>{sub}</text>}
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
      <g opacity={0.04}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.PROCESS} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.PROCESS} strokeWidth={1} />)}
      </g>

      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.PROCESS },
            ]}
            titleSegments={[{ label: INTRO_TITLE, color: COLORS.PROCESS }]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="systemd-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="systemd-act-navigator" />

          <ContentBodyV1>
            {/* ── Path Bar: strip lokasi Linux nyata, y lokal 0-40 ── */}
            <g opacity={pathText ? pathOpacity : 0}>
              <rect x={16} y={4} width={700} height={30} rx={8} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <g transform="translate(30, 19)"><Icon type="folder" size={16} color={COLORS.MUTED} /></g>
              <text x={46} y={23} fontSize={9} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>LOKASI</text>
              <text x={100} y={23} fontSize={12} fontFamily="monospace" fill={COLORS.TEXT}>{pathText}</text>
            </g>

            {/* ── garis alur, digambar sebelum stasiun tujuan menyala ── */}
            {LINES.map(line => <FlowLine key={line.id} line={line} />)}

            {/* ── pulsa kecil (journal j1/j2) ── */}
            {Object.entries(pulse).map(([id, pdata]) => {
              const pt = pointAt(pdata.lineId, pdata.t)
              return <circle key={id} cx={pt.x} cy={pt.y} r={5} fill={COLORS.JOURNAL} opacity={pdata.opacity} filter="url(#glow)" />
            })}

            {/* ── Stasiun 1: Process Manual (Act 1, tetap ada-redup setelahnya) ── */}
            <g transform={`translate(${STATIONS.processManual.cx}, ${STATIONS.processManual.cy})`} opacity={stationOpacity.processManual}>
              <rect x={-STATIONS.processManual.w / 2} y={-STATIONS.processManual.h / 2}
                width={STATIONS.processManual.w} height={STATIONS.processManual.h} rx={14}
                fill={COLORS.PANEL} stroke={COLORS.PROCESS} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform="translate(0, -52)"><Icon type="process" size={30} color={COLORS.PROCESS} /></g>
              <text x={0} y={-8} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={0.5} fill={COLORS.PROCESS}>{PROCESS_LABEL}</text>
              <g transform="translate(0, 18)">
                <rect x={-52} y={-13} width={104} height={26} rx={13} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
                <text x={0} y={4} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>PID {PID_INITIAL}</text>
              </g>
              <text x={0} y={58} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>sebelum dikelola</text>
              <IconCaption stationId="processManual" text={caption} />
            </g>

            {/* ── Stasiun 2: Unit File (Act 1) ── */}
            <g transform={`translate(${STATIONS.unitFile.cx}, ${STATIONS.unitFile.cy})`} opacity={stationOpacity.unitFile}>
              <rect x={-STATIONS.unitFile.w / 2} y={-STATIONS.unitFile.h / 2}
                width={STATIONS.unitFile.w} height={STATIONS.unitFile.h} rx={14}
                fill={COLORS.PANEL} stroke={serviceBorn ? COLORS.ACTIVE : COLORS.UNIT} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform="translate(0, -60)"><Icon type="document" size={28} color={COLORS.UNIT} /></g>
              <text x={0} y={-24} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.UNIT}>{UNIT_INFO.name}</text>
              {unitDeclared && (
                <g transform="translate(0, -2)">
                  <text x={0} y={0} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>runs: {UNIT_INFO.runs}</text>
                  <text x={0} y={18} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>restart: {UNIT_INFO.restartPolicy}</text>
                </g>
              )}
              {serviceBorn && (
                <g transform="translate(0, 46)">
                  <rect x={-88} y={-12} width={176} height={24} rx={12} fill={COLORS.BG} stroke={COLORS.ACTIVE} strokeWidth={1.5} />
                  <g transform="translate(-68, 0)"><Icon type="check" size={14} color={COLORS.ACTIVE} /></g>
                  <text x={6} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.ACTIVE}>DIKENALI SYSTEMD</text>
                </g>
              )}
              {stationOpacity.unitFile > 0.5 && (
                <text x={0} y={70} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>{PATH_ATLAS.unitFile}</text>
              )}
              <IconCaption stationId="unitFile" text={caption} />
            </g>

            {/* ── Stasiun 3: systemd Manager (hub, persist Act 2-6) ── */}
            <g transform={`translate(${STATIONS.manager.cx}, ${STATIONS.manager.cy})`} opacity={stationOpacity.manager}>
              <rect x={-STATIONS.manager.w / 2} y={-STATIONS.manager.h / 2}
                width={STATIONS.manager.w} height={STATIONS.manager.h} rx={16}
                fill={COLORS.PANEL} stroke={COLORS.MANAGER} strokeWidth={2.6} filter="url(#shadow)" />
              <g transform="translate(0, -62)" filter="url(#glow)"><Icon type="gear" size={44} color={COLORS.MANAGER} /></g>
              <text x={0} y={-20} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.MANAGER}>{MANAGER_LABEL}</text>
              <g transform="translate(0, 6)">
                <g transform="translate(-68, 0)">
                  <Icon type={{ declared: 'document', starting: 'play', active: 'check', failed: 'alert', restarting: 'restart' }[lifecycle]} size={18} color={LIFECYCLE_META[lifecycle].color} />
                </g>
                <text x={-48} y={4} fontSize={14} fontWeight={800} fontFamily="monospace" fill={LIFECYCLE_META[lifecycle].color}>{LIFECYCLE_META[lifecycle].label}</text>
              </g>
              <text x={0} y={32} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>{LIFECYCLE_META[lifecycle].note}</text>
              {restartAttempt > 0 && (
                <g transform="translate(0, 58)">
                  <rect x={-72} y={-12} width={144} height={24} rx={12} fill={COLORS.BG} stroke={COLORS.MANAGER} strokeWidth={1.5} />
                  <g transform="translate(-56, 0)"><Icon type="restart" size={14} color={COLORS.MANAGER} /></g>
                  <text x={4} y={4} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MANAGER}>restart {restartAttempt}/3</text>
                </g>
              )}
              <IconCaption stationId="manager" text={caption} />
            </g>

            {/* ── Stasiun 4: Managed Process (Act 2, redup setelahnya kecuali Act 4) ── */}
            <g transform={`translate(${STATIONS.managedProcess.cx}, ${STATIONS.managedProcess.cy})`} opacity={stationOpacity.managedProcess}>
              <rect x={-STATIONS.managedProcess.w / 2} y={-STATIONS.managedProcess.h / 2}
                width={STATIONS.managedProcess.w} height={STATIONS.managedProcess.h} rx={12}
                fill={COLORS.PANEL} stroke={lifecycle === 'failed' ? COLORS.FAILED : COLORS.ACTIVE} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform="translate(-58, 0)"><Icon type="process" size={26} color={lifecycle === 'failed' ? COLORS.FAILED : COLORS.ACTIVE} /></g>
              <text x={10} y={-14} fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={0.5} fill={COLORS.MUTED}>{MANAGED_PROCESS_LABEL}</text>
              <text x={10} y={4} fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>PID {pid}</text>
              <text x={10} y={22} fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>{pid === PID_INITIAL ? PATH_ATLAS.managedProcessInitial : PATH_ATLAS.managedProcessRestarted}</text>
              <IconCaption stationId="managedProcess" text={caption} />
            </g>

            {/* ── Stasiun 5: Boot Target & Dependency (Act 3, persist) ── */}
            <g transform={`translate(${STATIONS.bootTarget.cx}, ${STATIONS.bootTarget.cy})`} opacity={stationOpacity.bootTarget}>
              <rect x={-STATIONS.bootTarget.w / 2} y={-STATIONS.bootTarget.h / 2}
                width={STATIONS.bootTarget.w} height={STATIONS.bootTarget.h} rx={14}
                fill={COLORS.PANEL} stroke={COLORS.DEPENDENCY} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform="translate(0, -56)"><Icon type="target" size={26} color={COLORS.DEPENDENCY} /></g>
              <text x={0} y={-22} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.DEPENDENCY}>{BOOT_TARGET.label}</text>
              {DEPENDENCIES.map((d, i) => (
                <g key={d.id}>
                  <g transform={`translate(-122, ${-5 + i * 16})`}><Icon type="link" size={12} color={COLORS.DEPENDENCY} /></g>
                  <text x={6} y={-2 + i * 16} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>{d.relation}: {d.label}</text>
                </g>
              ))}
              <g transform="translate(-64, 46)" opacity={enabledOn ? 1 : 0.35}>
                <rect x={-50} y={-13} width={100} height={26} rx={8} fill={COLORS.BG} stroke={enabledOn ? COLORS.ACTIVE : COLORS.BORDER} strokeWidth={1.5} />
                <g transform="translate(-33, 0)"><Icon type="lock" size={13} color={enabledOn ? COLORS.ACTIVE : COLORS.MUTED} /></g>
                <text x={8} y={4} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={enabledOn ? COLORS.ACTIVE : COLORS.MUTED}>{ENABLE_BADGE.label}</text>
              </g>
              <g transform="translate(64, 46)" opacity={startedOn ? 1 : 0.35}>
                <rect x={-50} y={-13} width={100} height={26} rx={8} fill={COLORS.BG} stroke={startedOn ? COLORS.ACTIVE : COLORS.BORDER} strokeWidth={1.5} />
                <g transform="translate(-30, 0)"><Icon type="play" size={12} color={startedOn ? COLORS.ACTIVE : COLORS.MUTED} /></g>
                <text x={8} y={4} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={startedOn ? COLORS.ACTIVE : COLORS.MUTED}>{START_BADGE.label}</text>
              </g>
              <IconCaption stationId="bootTarget" text={caption} />
            </g>

            {/* ── Stasiun 6: Journal (Act 5, persist) ── */}
            <g transform={`translate(${STATIONS.journal.cx}, ${STATIONS.journal.cy})`} opacity={stationOpacity.journal}>
              <rect x={-STATIONS.journal.w / 2} y={-STATIONS.journal.h / 2}
                width={STATIONS.journal.w} height={STATIONS.journal.h} rx={14}
                fill={COLORS.PANEL} stroke={COLORS.JOURNAL} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform={`translate(${-STATIONS.journal.w / 2 + 24}, ${-STATIONS.journal.h / 2 + 20})`}><Icon type="stack" size={20} color={COLORS.JOURNAL} /></g>
              <text x={-STATIONS.journal.w / 2 + 42} y={-STATIONS.journal.h / 2 + 24} fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.JOURNAL}>JOURNAL</text>
              {JOURNAL_ENTRIES.slice(0, journalCount).map((entry, i) => {
                const active = phaseIdx === 5 && entry.highlighted
                const rowY = -STATIONS.journal.h / 2 + 46 + i * 25
                return (
                  <g key={entry.id} transform={`translate(0, ${rowY})`}>
                    {active && <rect x={-STATIONS.journal.w / 2 + 8} y={-11} width={STATIONS.journal.w - 16} height={22} rx={5} fill={COLORS.DIAGNOSIS} opacity={0.14} />}
                    <text x={-STATIONS.journal.w / 2 + 14} y={4} fontSize={9.5} fontFamily="monospace" fill={COLORS.MUTED}>{entry.time}</text>
                    <rect x={-46} y={-9} width={60} height={16} rx={4} fill={COLORS.BG} stroke={SOURCE_COLOR[entry.source]} strokeWidth={1} />
                    <text x={-16} y={3} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={SOURCE_COLOR[entry.source]}>{entry.source}</text>
                    <text x={20} y={4} fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>{entry.text}</text>
                  </g>
                )
              })}
              <IconCaption stationId="journal" text={caption} />
            </g>

            {/* ── Stasiun 7: Diagnosis Terminal (Act 6, payoff) ── */}
            <g transform={`translate(${STATIONS.diagnosis.cx}, ${STATIONS.diagnosis.cy})`} opacity={stationOpacity.diagnosis}>
              <g transform="translate(-232, 0)"><Icon type="magnifier" size={26} color={COLORS.DIAGNOSIS} /></g>
              {DIAGNOSIS_STEPS.map((step, i) => {
                const active = diagnosisStep >= i
                const x = (i - 1) * 142
                const stepIcon = ['check', 'stack', 'clock'][i]
                const stColor = active ? COLORS.DIAGNOSIS : COLORS.MUTED
                return (
                  <g key={step.id} transform={`translate(${x}, 0)`}>
                    <rect x={-68} y={-46} width={136} height={92} rx={10}
                      fill={COLORS.BG} stroke={active ? COLORS.DIAGNOSIS : COLORS.BORDER}
                      strokeWidth={active ? 2.2 : 1.5} opacity={active ? 1 : 0.5} />
                    <g opacity={active ? 1 : 0.6}>
                      <g transform="translate(-30, -30)"><Icon type={stepIcon} size={15} color={stColor} /></g>
                      <text x={-18} y={-26} fontSize={11} fontWeight={800} fontFamily="monospace" fill={stColor}>{step.label}</text>
                      {wrapText(step.statement, 20).map((ln, k) => (
                        <text key={k} x={0} y={-8 + k * 13} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>{ln}</text>
                      ))}
                      {wrapText(step.source, 24).map((ln, k) => (
                        <text key={k} x={0} y={22 + k * 11} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{ln}</text>
                      ))}
                    </g>
                  </g>
                )
              })}
              <IconCaption stationId="diagnosis" text={caption} />
            </g>

            {/* ── Closing: dua stamp, di bawah Diagnosis Terminal ── */}
            <g opacity={closingOpacity} filter="url(#glow)">
              <Stamp x={STATIONS.diagnosis.cx - 110} y={CLOSING_Y} color={COLORS.ACTIVE} top={CLOSING_STAMPS[0].top} sub={CLOSING_STAMPS[0].sub} icon="heart" rot={-6} />
              <Stamp x={STATIONS.diagnosis.cx + 110} y={CLOSING_Y} color={COLORS.DIAGNOSIS} top={CLOSING_STAMPS[1].top} sub={CLOSING_STAMPS[1].sub} icon="route" rot={6} />
            </g>
          </ContentBodyV1>
        </g>
      )}
    </svg>
  )
}
