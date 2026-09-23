// src/content/44-systemd-timer/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-01 (lihat _docs/SYSTEMD_TIMER_PLAN.md): 4 Act sesuai storyboard —
// batasan cron job biasa, anatomi pasangan unit (.timer & .service),
// Persistent=true & OnBootSec, observabilitas systemctl list-timers.
//
// Ditulis langsung mengikuti pola "1 act = 1 file" (docs/standardizations/
// 07-act-scene-pattern.md) — semua render presentational per-Act ada di
// `acts/Act1..Act4*.jsx` (PURE, tanpa GSAP/state/SFX). Animation.jsx murni
// komposisi: timeline GSAP + state + `<Act state={...} />` per phase.
// Intro dapat `bg`/`bgScenes` (UPDATE 6, background Act 2 — anatomi unit
// timer & service, paling representatif untuk thumbnail).
//
// Anchor persisten (Continuity map, §1.O): ANCHOR_POS (data.js) — "systemd"
// (gear icon) yang settle di akhir Act 1, TIDAK dihapus sampai penutup
// Act 3. Act 4 SENGAJA tidak memakai anchor ini — fokus pindah ke
// terminal/journalctl, bukan daemon-nya. Lihat acts/common.jsx AnchorIcon.
//
// Batas aman (plan): tidak ada command destructive, tidak ada path sistem
// nyata selain contoh generik backup.timer/backup.service &
// /var/log/backup.log — semua label konsep.
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
  CRON_LIMITS, ACT1_BEATS,
  UNIT_PAIR, ACT2_BEATS,
  CATCHUP_STEPS, ACT3_BEATS,
  ACT4_BEATS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'
import { ACT_SCENES } from './acts'

export default function SystemdTimerAnimation({
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
  const [caption, setCaption] = useState('')
  const [captionColor, setCaptionColor] = useState(COLORS.SYSTEMD)

  const [morphP, setMorphP] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [bodyOpacity, setBodyOpacity] = useState(0)

  // Act 1 — server power icon + daftar batasan cron + anchor settle
  const [serverOff, setServerOff] = useState(false)
  const [limitsVisible, setLimitsVisible] = useState(false)
  const [limitHighlight, setLimitHighlight] = useState(null)
  const [anchorVisible, setAnchorVisible] = useState(false)
  const [anchorGlow, setAnchorGlow] = useState(0)

  // Act 2 — pasangan unit .timer & .service
  const [unitsVisible, setUnitsVisible] = useState(false)
  const [unitHighlight, setUnitHighlight] = useState(null)

  // Act 3 — server mati (02:00) -> menyala (03:00) -> eksekusi susulan
  const [serverUp, setServerUp] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)
  const [stepHighlight, setStepHighlight] = useState(null)

  // Act 4 — list-timers table + journalctl (tanpa anchor)
  const [listTimersVisible, setListTimersVisible] = useState(false)
  const [journalVisible, setJournalVisible] = useState(false)
  const [journalHighlight, setJournalHighlight] = useState(null)

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

    const say = (time, text, color) => tl.add(() => {
      setCaption(text)
      if (color) setCaptionColor(color)
    }, time)
    const sfxOn = (time, entry) => tl.add(() => play(entry), time)

    // ── Reset state tiap awal loop (wajib, timeline repeat: -1) ──
    tl.add(() => {
      setPhaseIdx(0); setCaption(''); setCaptionColor(COLORS.SYSTEMD)
      setMorphP(0); setContentStarted(false); setBodyOpacity(0)
      setServerOff(false); setLimitsVisible(false); setLimitHighlight(null)
      setAnchorVisible(false); setAnchorGlow(0)
      setUnitsVisible(false); setUnitHighlight(null)
      setServerUp(false); setStepsVisible(false); setStepHighlight(null)
      setListTimersVisible(false); setJournalVisible(false); setJournalHighlight(null)
    }, 0)

    // ── Intro — hero centered → header (pola 35-cron-job) ──
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

    // ═══════════════ ACT 1 — Batasan cron job biasa (8s) ═══════════════
    const a1 = actStart[0]
    tl.add(() => setPhaseIdx(0), a1)
    sfxOn(a1, SFX_MAP.POP)
    say(a1, ACT1_BEATS.hook.caption, COLORS.CRON_OLD)
    tl.add(() => setServerOff(true), a1 + 0.3)
    sfxOn(a1 + 0.3, SFX_MAP.ALERT_PULSE)
    tl.add(() => setLimitsVisible(true), a1 + 0.9)
    sfxOn(a1 + 0.9, SFX_MAP.POP2)
    let ft = a1 + 1.1
    CRON_LIMITS.forEach((l) => {
      tl.add(() => setLimitHighlight(l.id), ft)
      sfxOn(ft, SFX_MAP.TICK)
      ft += 0.9
    })
    tl.add(() => setLimitHighlight(null), ft)
    say(ft, ACT1_BEATS.reveal.caption, COLORS.CRON_OLD)
    sfxOn(ft, SFX_MAP.DING)
    ft += 0.9
    tl.add(() => { setLimitsVisible(false); setServerOff(false) }, ft)
    tl.add(() => { setAnchorVisible(true); setAnchorGlow(1) }, ft + 0.1)
    sfxOn(ft + 0.1, SFX_MAP.CONFIRM)
    say(ft + 0.15, ACT1_BEATS.settle.caption, COLORS.SYSTEMD)
    tl.add(() => setAnchorGlow(0.3), ft + 1.6)

    // ═══════════════ ACT 2 — Anatomi pasangan unit (10s) ═══════════════
    const a2 = actStart[1]
    tl.add(() => setPhaseIdx(1), a2)
    sfxOn(a2, SFX_MAP.SWOOSH)
    say(a2, ACT2_BEATS.intro.caption, COLORS.SYSTEMD)
    tl.add(() => setUnitsVisible(true), a2 + 0.3)
    sfxOn(a2 + 0.3, SFX_MAP.POP)
    tl.add(() => setUnitHighlight('timer'), a2 + 0.9)
    sfxOn(a2 + 0.9, SFX_MAP.TICK)
    say(a2 + 1.0, ACT2_BEATS.layering.caption, COLORS.TIMER)
    tl.add(() => setUnitHighlight(null), a2 + 2.2)
    sfxOn(a2 + 2.2, SFX_MAP.WHOOSH)
    tl.add(() => setUnitHighlight('service'), a2 + 3.4)
    sfxOn(a2 + 3.4, SFX_MAP.TICK)
    say(a2 + 3.5, ACT2_BEATS.closing.caption, COLORS.SERVICE)
    sfxOn(a2 + 3.5, SFX_MAP.CHIME)
    tl.add(() => setUnitHighlight(null), a2 + 5.0)
    sfxOn(a2 + 5.0, SFX_MAP.CONFIRM)

    // ═══════════════ ACT 3 — Persistent=true & OnBootSec (10s) ═══════════════
    const a3 = actStart[2]
    tl.add(() => setPhaseIdx(2), a3)
    sfxOn(a3, SFX_MAP.SWOOSH)
    say(a3, ACT3_BEATS.intro.caption, COLORS.RISK)
    let t3 = a3 + 1.0
    tl.add(() => setServerUp(true), t3)
    sfxOn(t3, SFX_MAP.DING)
    say(t3, ACT3_BEATS.matched.caption, COLORS.TIMER)
    t3 += 1.0
    tl.add(() => setStepsVisible(true), t3)
    sfxOn(t3, SFX_MAP.POP)
    const stepOrder = ['missed', 'boot', 'catchup']
    let t3b = t3 + 0.3
    stepOrder.forEach((id) => {
      tl.add(() => setStepHighlight(id), t3b)
      sfxOn(t3b, id === 'catchup' ? SFX_MAP.WHOOSH : SFX_MAP.TICK)
      t3b += 1.0
    })
    tl.add(() => setStepHighlight(null), t3b)
    say(t3b, ACT3_BEATS.closing.caption, COLORS.SUCCESS)
    sfxOn(t3b, SFX_MAP.COMPLETE)
    tl.add(() => setAnchorGlow(0.3), t3b + 0.1)
    // Anchor "systemd" turun sesaat sebelum Act 4 mulai — Act 4 sengaja
    // tanpa anchor (fokus pindah ke terminal & journalctl, lihat data.js
    // catatan ANCHOR_POS).
    tl.add(() => { setAnchorVisible(false); setAnchorGlow(0) }, actStart[3] - 0.1)
    sfxOn(actStart[3] - 0.1, SFX_MAP.TELEPORT)

    // ═══════════════ ACT 4 — Observabilitas list-timers (9s) ═══════════════
    const a4 = actStart[3]
    tl.add(() => setPhaseIdx(3), a4)
    say(a4, ACT4_BEATS.intro.caption, COLORS.SYSTEMD)
    tl.add(() => setListTimersVisible(true), a4 + 0.3)
    sfxOn(a4 + 0.3, SFX_MAP.POP2)
    say(a4 + 1.2, ACT4_BEATS.risk.caption, COLORS.SYSTEMD)
    sfxOn(a4 + 1.2, SFX_MAP.CHIME)
    let t4 = a4 + 2.4
    tl.add(() => setJournalVisible(true), t4)
    sfxOn(t4, SFX_MAP.WHOOSH)
    const journalOrder = ['start', 'run', 'done']
    let t4b = t4 + 0.4
    journalOrder.forEach((id) => {
      tl.add(() => setJournalHighlight(id), t4b)
      sfxOn(t4b, id === 'done' ? SFX_MAP.CONFIRM : SFX_MAP.TICK)
      t4b += 0.9
    })
    tl.add(() => setJournalHighlight(null), t4b)
    say(t4b, ACT4_BEATS.closing.caption, COLORS.SYSTEMD)
    sfxOn(t4b, SFX_MAP.SHIMMER)
    t4b += 1.7
    sfxOn(t4b, SFX_MAP.COMPLETE)
    t4b += 1.8

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
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.SYSTEMD} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.SYSTEMD} strokeWidth={1} />)}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.SYSTEMD },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.SYSTEMD },
          { label: INTRO_TITLE_B, color: COLORS.TIMER },
        ]}
        titleLines={[
          [{ label: 'SYSTEMD', color: COLORS.SYSTEMD }],
          [{ label: 'TIMER', color: COLORS.TIMER }],
        ]}
        subtitle={INTRO_SUBTITLE}
        bg={2}
        bgScenes={ACT_SCENES}
        testId="systemd-timer-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="systemd-timer-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="systemd-timer-body">
          <g opacity={bodyOpacity}>
            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              return (
                <Act state={{
                  caption, captionColor,
                  serverOff, limitsVisible, limitHighlight, anchorVisible, anchorGlow,
                  unitsVisible, unitHighlight,
                  serverUp, stepsVisible, stepHighlight,
                  listTimersVisible, journalVisible, journalHighlight,
                }} />
              )
            })()}
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
