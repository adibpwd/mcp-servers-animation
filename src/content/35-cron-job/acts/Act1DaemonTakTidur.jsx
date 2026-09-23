// src/content/35-cron-job/acts/Act1DaemonTakTidur.jsx
// ACT 1 — Daemon tak pernah tidur: alur kausal berurutan Jam → crond →
// daftar job (flowchart, bukan kemunculan serentak). REVISI-01, lihat
// revisi/2026-09-23-revisi-01-flowchart-multicase-dynamic-caption.md.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { NearElementCaption, FlowLine, ConceptCard, AnchorIcon, IconClock, withOrigin } from './common'
import { COLORS, SCHEDULED_JOBS, ANCHOR_POS, ACT1_BEATS } from '../data'

const CLOCK_POS = { x: 366, y: 220 }
const JOB_ROW_Y = 660
const JOB_XS = { backup: 156, cleanup: 366, report: 576 }
const JOB_ORDER = ['backup', 'cleanup', 'report']

const clamp01 = (v) => Math.max(0, Math.min(1, v))

// ── Mode summary (tanpa props) — momen akhir Act 1: semua branch sudah
// tergambar, lalu meredup, fokus menetap ke anchor "crond". ──
export const SUMMARY_STATE = {
  clockAngle: 0,
  spineProgress: 1,
  anchorVisible: true,
  anchorGlow: 0.3,
  branchStep: 3,
  jobsDim: true,
}

export default function Act1DaemonTakTidur({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }
  const dimFactor = s.jobsDim ? 0.28 : 1

  return withOrigin(
    <>
      {/* Step 1 — Jam berdenyut, caption hook tampil selama garis belum jalan */}
      <g transform={`translate(${CLOCK_POS.x} ${CLOCK_POS.y})`}>
        <circle r="52" fill="none" stroke={COLORS.CRON} strokeWidth="1.4" opacity="0.35">
          <animate attributeName="r" values="44;58;44" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle r="48" fill={COLORS.PANEL} stroke={COLORS.CRON} strokeWidth="2" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180
          const x1 = Math.sin(a) * 40, y1 = -Math.cos(a) * 40
          const x2 = Math.sin(a) * 46, y2 = -Math.cos(a) * 46
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.BORDER} strokeWidth="2" />
        })}
        <line x1="0" y1="0"
          x2={Math.sin((s.clockAngle * Math.PI) / 180) * 32}
          y2={-Math.cos((s.clockAngle * Math.PI) / 180) * 32}
          stroke={COLORS.CRON} strokeWidth="3" strokeLinecap="round" />
        <circle r="4" fill={COLORS.CRON} />
        <g transform="translate(-16 66)"><IconClock size={16} /></g>
        <text x="6" y="80" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>tiap 1 menit</text>
      </g>
      <NearElementCaption x={CLOCK_POS.x} y={CLOCK_POS.y - 60} anchor="above"
        color={COLORS.CRON} text={ACT1_BEATS.hook.caption} visible={s.spineProgress <= 0} />

      {/* Step 2 — Garis alur jam → crond */}
      <FlowLine x1={CLOCK_POS.x} y1={CLOCK_POS.y + 60} x2={ANCHOR_POS.x} y2={ANCHOR_POS.y - 40}
        color={COLORS.CRON} progress={s.spineProgress} opacity={dimFactor} />

      <g opacity={dimFactor}>
        <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="crond" />
      </g>
      <NearElementCaption x={ANCHOR_POS.x} y={ANCHOR_POS.y - 46} anchor="above"
        color={COLORS.CRON} text={s.jobsDim ? ACT1_BEATS.settle.caption : ACT1_BEATS.reveal.caption}
        visible={s.anchorVisible} />

      {/* Step 3 — Garis cabang berurutan crond → tiap job */}
      {JOB_ORDER.map((id, i) => {
        const job = SCHEDULED_JOBS.find((j) => j.id === id)
        const segProgress = clamp01(s.branchStep - i)
        return (
          <g key={id} opacity={dimFactor}>
            <FlowLine x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={JOB_XS[id]} y2={JOB_ROW_Y - 34}
              color={job.color} progress={segProgress} />
            <g opacity={segProgress}>
              <ConceptCard x={JOB_XS[id]} y={JOB_ROW_Y} w={190} h={72}
                label={job.label} desc={job.desc} color={job.color} active dim={false} />
            </g>
            <NearElementCaption x={JOB_XS[id]} y={JOB_ROW_Y - 36} anchor="above"
              color={job.color} text={job.desc} visible={segProgress >= 1 && !s.jobsDim} />
          </g>
        )
      })}
    </>,
    origin,
  )
}
