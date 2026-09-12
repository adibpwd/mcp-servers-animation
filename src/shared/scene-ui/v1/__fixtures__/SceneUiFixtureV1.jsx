// src/shared/scene-ui/v1/__fixtures__/SceneUiFixtureV1.jsx
//
// Fixture demonstrasi minimal untuk scene-ui V1 (PLAN-12 Tahap A & C).
// TIDAK dipakai topic manapun, TIDAK didaftarkan di registry.js — cuma untuk
// preview manual lewat route dev terpisah (lihat App.jsx "/dev/scene-ui-v1").
// Menyentuh App.jsx (nambah 1 route baru) TAPI TIDAK menyentuh topic existing
// manapun (lihat PLAN-12 §3.4 opt-in only).
//
// Dipakai untuk validasi visual Tahap C:
// - intro progress 0 / 0.5 / 1 (slider)
// - navigator 1..6 Act (select jumlah + activeIndex)
// - badge label kepanjangan (toggle, cek dev-warning di console)
// - content body panel maksimal (cek top tidak masuk header/badge)
// - debug safe-area overlay on/off

import React, { useState } from 'react'
import { SceneChromeV1 } from '../index'

const DEMO_COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MINT: '#34D399',
  SKY: '#38BDF8',
  PURPLE: '#A78BFA',
  ORANGE: '#FB923C',
  YELLOW: '#FBBF24',
  RED: '#F43F5E',
}

const ALL_PHASES = [
  { id: 'p1', badge: 'ACT 1 — TEST FIXTURE PALING AWAL', badgeColor: DEMO_COLORS.SKY },
  { id: 'p2', badge: 'ACT 2 — LANJUTAN CERITA DEMO', badgeColor: DEMO_COLORS.YELLOW },
  { id: 'p3', badge: 'ACT 3 — TITIK TENGAH FIXTURE', badgeColor: DEMO_COLORS.PURPLE },
  { id: 'p4', badge: 'ACT 4 — MENDEKATI PENUTUP', badgeColor: DEMO_COLORS.ORANGE },
  { id: 'p5', badge: 'ACT 5 — HAMPIR SELESAI', badgeColor: DEMO_COLORS.MINT },
  { id: 'p6', badge: 'ACT 6 — PENUTUP FIXTURE', badgeColor: DEMO_COLORS.RED },
]

const LONG_BADGE = 'ACT 1 — BADGE SENGAJA DIBUAT SANGAT PANJANG UNTUK TES OVERFLOW WARNING'

export default function SceneUiFixtureV1() {
  const [progress, setProgress] = useState(0)
  const [phaseCount, setPhaseCount] = useState(5)
  const [activeIndex, setActiveIndex] = useState(0)
  const [longBadge, setLongBadge] = useState(false)
  const [maxContent, setMaxContent] = useState(true)
  const [debug, setDebug] = useState(true)
  // Demonstrasi pola yang benar per PLAN-12 §6 Do: "gate content body dari
  // topic sampai intro morph selesai jika dibutuhkan" — karena hero title
  // (HERO_DEFAULTS.titleY≈640) berada DI DALAM zona body (y 235-1200),
  // content HARUS digate kalau topic tidak mau title tertutup saat hero.
  // Toggle ini sengaja ada supaya fixture bisa menunjukkan KEDUA kondisi.
  const [gateContentDuringIntro, setGateContentDuringIntro] = useState(true)

  const phases = ALL_PHASES.slice(0, phaseCount).map((p, i) =>
    (longBadge && i === activeIndex) ? { ...p, badge: LONG_BADGE } : p
  )
  const clampedActive = Math.min(activeIndex, phases.length - 1)

  return (
    <div style={{ background: '#020617', minHeight: '100vh', padding: 24, fontFamily: 'sans-serif', color: DEMO_COLORS.TEXT }}>
      <h2 style={{ marginTop: 0 }}>scene-ui V1 — fixture (PLAN-12 Tahap A/C)</h2>
      <p style={{ color: DEMO_COLORS.BORDER, maxWidth: 640 }}>
        Bukan topic. Halaman ini cuma buat cek visual primitive scene-ui V1
        secara isolasi sebelum dipakai topic asli (Tahap D, perlu approval
        terpisah). Buka console browser untuk lihat dev-warning kalau ada
        yang keluar zona.
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
        <label>
          progress ({progress.toFixed(2)})<br />
          <input type="range" min={0} max={1} step={0.01} value={progress}
            onChange={(e) => setProgress(Number(e.target.value))} style={{ width: 200 }} />
        </label>

        <label>
          jumlah Act<br />
          <select value={phaseCount} onChange={(e) => setPhaseCount(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        <label>
          activeIndex<br />
          <select value={clampedActive} onChange={(e) => setActiveIndex(Number(e.target.value))}>
            {phases.map((_, i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <label>
          <input type="checkbox" checked={longBadge} onChange={(e) => setLongBadge(e.target.checked)} />
          {' '}badge kepanjangan (tes overflow warning)
        </label>
        <label>
          <input type="checkbox" checked={maxContent} onChange={(e) => setMaxContent(e.target.checked)} />
          {' '}content panel maksimal (isi penuh body box)
        </label>
        <label>
          <input type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
          {' '}safe-area debug overlay
        </label>
        <label title="PLAN-12 §6 Do: gate content selama intro karena hero title berada di dalam zona body">
          <input type="checkbox" checked={gateContentDuringIntro} onChange={(e) => setGateContentDuringIntro(e.target.checked)} />
          {' '}gate content selama intro (recommended pattern)
        </label>
      </div>

      <svg viewBox="0 0 820 1340" width={410} height={670}
        style={{ background: DEMO_COLORS.BG, border: `1px solid ${DEMO_COLORS.BORDER}`, borderRadius: 8 }}
      >
        <SceneChromeV1
          debug={debug}
          showContent={!gateContentDuringIntro || progress >= 1}
          intro={{
            progress,
            category: 'FIXTURE · SCENE-UI V1',
            titleSegments: [
              { label: 'SCENE', color: DEMO_COLORS.SKY },
              { label: 'UI', color: DEMO_COLORS.MINT },
            ],
            subtitle: 'Fixture demonstrasi — bukan topic asli',
          }}
          navigator={{ phases, activeIndex: clampedActive }}
          content={{
            render: (w, h) => (
              <g>
                <rect x={0} y={0} width={w} height={h}
                  fill={DEMO_COLORS.PANEL} stroke={DEMO_COLORS.MINT}
                  strokeDasharray={maxContent ? '0' : '6 4'}
                  strokeWidth={1.5} rx={12}
                  opacity={maxContent ? 1 : 0.3}
                />
                <text x={w / 2} y={h / 2} textAnchor="middle" fill={DEMO_COLORS.TEXT} fontSize={16}>
                  content body — {Math.round(w)}×{Math.round(h)}
                </text>
                <text x={w / 2} y={h / 2 + 24} textAnchor="middle" fill={DEMO_COLORS.BORDER} fontSize={12}>
                  (local coordinate, 0,0 = body origin)
                </text>
              </g>
            ),
          }}
        />
      </svg>
    </div>
  )
}
