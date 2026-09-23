// src/content/35-cron-job/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-01 (lihat _docs/CRON_JOB_PLAN.md): 4 Act sesuai storyboard —
// daemon crond tak pernah tidur, membaca 5 bintang crontab, memicu script
// & worker, eksekusi silent & log redirection.
//
// REVISI-01 (lihat revisi/2026-09-23-revisi-01-flowchart-multicase-dynamic-
// caption.md): (1) Act 1 dibuat sekuensial — flowchart jam → crond → 3 job
// via FlowLine berarah (`spineProgress`, `branchStep`), bukan kemunculan
// serentak. (2) Act 2 jadi multi-case — 3 pola nyata (daily/interval/
// weekly) bergantian (`caseIndex`), bukan 1 contoh statis. (3) `CaptionBar`
// statis di atas DIHAPUS total — diganti `NearElementCaption` per-Act yang
// menempel dekat elemen aktif (state global `caption`/`captionColor` &
// helper `say()` ikut dihapus, caption sekarang diturunkan lokal di tiap
// file Act dari state yang sudah ada).
//
// Ditulis mengikuti pola "1 act = 1 file" (docs/standardizations/
// 07-act-scene-pattern.md) — semua render presentational per-Act ada di
// `acts/Act1..Act4*.jsx` (PURE, tanpa GSAP/state/SFX). Animation.jsx murni
// komposisi: timeline GSAP + state + `<Act state={...} />` per phase.
//
// Anchor persisten (Continuity map, §1.O): ANCHOR_POS (data.js) — daemon
// "crond" yang settle di akhir Act 1, TIDAK dihapus sampai penutup Act 3.
// Act 4 SENGAJA tidak memakai anchor ini — fokus pindah ke script & log.
//
// Batas aman (plan): tidak ada command destructive, tidak ada path sistem
// nyata selain contoh generik /backup.sh & /var/log/backup.log.
//
// CATATAN EKSEKUSI: kode + data ditulis sekali jalan, BELUM preview manual
// di browser maupun export MP4. Durasi Act di PHASES (data.js) adalah
// estimasi awal, WAJIB diukur ulang dari timeline nyata setelah preview
// manual.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  CRONTAB_FIELDS, CRON_CASES,
  WORKER_STEPS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'
import { ACT_SCENES } from './acts'

export default function CronJobAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const tlRef = useRef(null)
  const audioUnlockedRef = useRef(audioUnlocked)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [morphP, setMorphP] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [bodyOpacity, setBodyOpacity] = useState(0)

  // Act 1 — REVISI-01: flowchart sekuensial jam → crond → 3 job (persisten
  // anchor Act 1 → Act 3)
  const [clockAngle, setClockAngle] = useState(0)
  const [spineProgress, setSpineProgress] = useState(0)
  const [anchorVisible, setAnchorVisible] = useState(false)
  const [anchorGlow, setAnchorGlow] = useState(0)
  const [branchStep, setBranchStep] = useState(0)
  const [jobsDim, setJobsDim] = useState(false)

  // Act 2 — REVISI-01: 3 kasus pola nyata bergantian
  const [fieldsVisible, setFieldsVisible] = useState(false)
  const [fieldHighlight, setFieldHighlight] = useState(null)
  const [caseIndex, setCaseIndex] = useState(null)
  const [badgeVisible, setBadgeVisible] = useState(false)
  const [showClosing, setShowClosing] = useState(false)

  // Act 3 — jam cocok → fork worker → jalankan script
  const [clockMatched, setClockMatched] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)
  const [stepHighlight, setStepHighlight] = useState(null)

  // Act 4 — stream stdout/stderr → void atau log file (tanpa anchor)
  const [scriptVisible, setScriptVisible] = useState(false)
  const [streamsVisible, setStreamsVisible] = useState(false)
  const [redirectActive, setRedirectActive] = useState(false)

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
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    const sfxOn = (time, entry) => tl.add(() => play(entry), time)

    // ── Reset state tiap awal loop (wajib, timeline repeat: -1) ──
    tl.add(() => {
      setPhaseIdx(0)
      setMorphP(0); setContentStarted(false); setBodyOpacity(0)
      setClockAngle(0); setSpineProgress(0)
      setAnchorVisible(false); setAnchorGlow(0)
      setBranchStep(0); setJobsDim(false)
      setFieldsVisible(false); setFieldHighlight(null)
      setCaseIndex(null); setBadgeVisible(false); setShowClosing(false)
      setClockMatched(false); setStepsVisible(false); setStepHighlight(null)
      setScriptVisible(false); setStreamsVisible(false); setRedirectActive(false)
    }, 0)

    // ── Intro — hero centered → header (pola 81-network-interface) ──
    let t = 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(t, SFX_MAP.SHIMMER)
    t += 0.8
    tl.add(() => setContentStarted(true), t)
    sfxOn(t, SFX_MAP.POP)
    const bf = { v: 0 }
    tl.to(bf, { v: 1, duration: 0.5, ease: 'power1.out', onUpdate: () => setBodyOpacity(bf.v) }, t)
    t += 0.5

    const actStart = []
    actStart[0] = t
    for (let i = 1; i < PHASES.length; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    // ═══════════════ ACT 1 — Daemon tak pernah tidur (9s, sekuensial) ═══════════════
    const a1 = actStart[0]
    tl.add(() => setPhaseIdx(0), a1)
    sfxOn(a1, SFX_MAP.POP)
    const clk = { a: 0 }
    tl.to(clk, { a: 720, duration: PHASES[0].duration - 0.3, ease: 'none', onUpdate: () => setClockAngle(clk.a) }, a1)

    // Step 2 — garis jam → crond (hook caption tampil selama spineProgress = 0)
    const sp = { v: 0 }
    tl.to(sp, { v: 1, duration: 0.9, ease: 'power2.inOut', onUpdate: () => setSpineProgress(sp.v) }, a1 + 0.6)
    sfxOn(a1 + 0.6, SFX_MAP.WHOOSH)
    tl.add(() => { setAnchorVisible(true); setAnchorGlow(1) }, a1 + 1.5)
    sfxOn(a1 + 1.5, SFX_MAP.CONFIRM)

    // Step 3 — garis cabang berurutan crond → 3 job (branchStep 0..3 kontinu)
    const br = { v: 0 }
    tl.to(br, { v: 3, duration: 2.7, ease: 'none', onUpdate: () => setBranchStep(br.v) }, a1 + 1.7)
    sfxOn(a1 + 1.7 + 0.9, SFX_MAP.TICK)
    sfxOn(a1 + 1.7 + 1.8, SFX_MAP.TICK)
    sfxOn(a1 + 1.7 + 2.7, SFX_MAP.DING)

    // Step 4 — job & garis meredup, fokus menetap ke crond
    tl.add(() => setJobsDim(true), a1 + 5.2)
    sfxOn(a1 + 5.2, SFX_MAP.TELEPORT)
    tl.add(() => setAnchorGlow(0.3), a1 + 5.3)

    // ═══════════════ ACT 2 — Membaca 5 bintang crontab (11s, 3 kasus) ═══════════════
    const a2 = actStart[1]
    tl.add(() => setPhaseIdx(1), a2)
    sfxOn(a2, SFX_MAP.SWOOSH)
    tl.add(() => setFieldsVisible(true), a2 + 0.3)
    sfxOn(a2 + 0.3, SFX_MAP.POP)
    let t2 = a2 + 0.6
    CRONTAB_FIELDS.forEach((f) => {
      tl.add(() => setFieldHighlight(f.id), t2)
      sfxOn(t2, SFX_MAP.TICK)
      t2 += 0.6
    })
    tl.add(() => setFieldHighlight(null), t2)
    t2 += 0.6 // hold — intro & layering caption tampil (derived: fieldsVisible && !activeCase)
    CRON_CASES.forEach((c) => {
      const caseIdx = CRON_CASES.indexOf(c)
      tl.add(() => { setCaseIndex(caseIdx); setBadgeVisible(false) }, t2)
      sfxOn(t2, SFX_MAP.POP2)
      tl.add(() => setBadgeVisible(true), t2 + 0.5)
      sfxOn(t2 + 0.5, SFX_MAP.CONFIRM)
      t2 += 2.0
    })
    tl.add(() => setShowClosing(true), t2 + 0.2)
    sfxOn(t2 + 0.2, SFX_MAP.CHIME)

    // ═══════════════ ACT 3 — Memicu script & worker (9s) ═══════════════
    const a3 = actStart[2]
    tl.add(() => setPhaseIdx(2), a3)
    sfxOn(a3, SFX_MAP.SWOOSH)
    let t3 = a3 + 0.8
    tl.add(() => { setClockMatched(true); setAnchorGlow(1) }, t3)
    sfxOn(t3, SFX_MAP.DING)
    t3 += 0.9
    tl.add(() => setStepsVisible(true), t3)
    sfxOn(t3, SFX_MAP.POP)
    const stepOrder = WORKER_STEPS.map((w) => w.id)
    let t3b = t3 + 0.3
    stepOrder.forEach((id) => {
      tl.add(() => setStepHighlight(id), t3b)
      sfxOn(t3b, id === 'fork' ? SFX_MAP.WHOOSH : SFX_MAP.TICK)
      t3b += 1.0
    })
    tl.add(() => setStepHighlight(null), t3b)
    sfxOn(t3b, SFX_MAP.COMPLETE)
    tl.add(() => setAnchorGlow(0.3), t3b + 0.1)
    // Anchor "crond" turun sesaat sebelum Act 4 mulai — Act 4 sengaja tanpa
    // anchor (fokus pindah ke script & log, lihat data.js catatan ANCHOR_POS).
    tl.add(() => { setAnchorVisible(false); setAnchorGlow(0) }, actStart[3] - 0.1)
    sfxOn(actStart[3] - 0.1, SFX_MAP.TELEPORT)

    // ═══════════════ ACT 4 — Eksekusi silent & log redirection (9s) ═══════════════
    const a4 = actStart[3]
    tl.add(() => setPhaseIdx(3), a4)
    tl.add(() => setScriptVisible(true), a4 + 0.3)
    sfxOn(a4 + 0.3, SFX_MAP.POP2)
    tl.add(() => setStreamsVisible(true), a4 + 0.9)
    sfxOn(a4 + 0.9, SFX_MAP.WHOOSH)
    let t4 = a4 + 1.8
    sfxOn(t4, SFX_MAP.ALERT_PULSE)
    t4 += 1.7
    tl.add(() => setRedirectActive(true), t4)
    sfxOn(t4, SFX_MAP.SHIMMER)
    sfxOn(t4 + 0.1, SFX_MAP.CONFIRM)
    t4 += 1.9
    sfxOn(t4, SFX_MAP.COMPLETE)
    t4 += 1.8

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

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>
      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.CRON} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.CRON} strokeWidth={1} />)}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.CRON },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.CRON },
          { label: INTRO_TITLE_B, color: COLORS.JOB },
        ]}
        subtitle={INTRO_SUBTITLE}
        bg={1}
        bgScenes={ACT_SCENES}
        testId="cron-job-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="cron-job-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="cron-job-body">
          <g opacity={bodyOpacity}>
            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              return (
                <Act state={{
                  clockAngle, spineProgress, anchorVisible, anchorGlow, branchStep, jobsDim,
                  fieldsVisible, fieldHighlight, caseIndex, badgeVisible, showClosing,
                  clockMatched, stepsVisible, stepHighlight,
                  scriptVisible, streamsVisible, redirectActive,
                }} />
              )
            })()}
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
