// src/content/35-cron-job/acts/Act3MemicuWorker.jsx
// ACT 3 — Memicu script & worker: jarum jam menyentuh 02:00, crond memicu
// worker baru menjalankan /backup.sh. REVISI-01: caption dipindah dekat
// elemen aktif (jam target & kartu step terakhir), bukan bar statis di atas.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { NearElementCaption, ConceptCard, ConnLine, AnchorIcon, IconFork, IconFixed, IconScript, withOrigin } from './common'
import { COLORS, ANCHOR_POS, WORKER_STEPS, CLOCK_TARGET, ACT3_BEATS } from '../data'

const CLOCK_Y = ANCHOR_POS.y - 90
const STEP_Y = 660
const STEP_XS = { match: 156, fork: 366, run: 576 }
const STEP_ICONS = { match: IconFixed, fork: IconFork, run: IconScript }

// ── Mode summary — momen akhir Act 3: worker sudah selesai fork dan
// script sedang berjalan. ──
export const SUMMARY_STATE = {
  anchorVisible: true,
  anchorGlow: 0.4,
  clockMatched: true,
  stepsVisible: true,
  stepHighlight: 'run',
}

export default function Act3MemicuWorker({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }
  const lastStepId = WORKER_STEPS[WORKER_STEPS.length - 1].id
  const allStepsDone = s.stepsVisible && s.stepHighlight === null

  return withOrigin(
    <>
      <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="crond" />

      <g transform={`translate(${ANCHOR_POS.x} ${CLOCK_Y})`}>
        <rect x="-58" y="-26" width="116" height="52" rx="10" fill={COLORS.PANEL_ALT}
          stroke={s.clockMatched ? COLORS.CRON : COLORS.BORDER} strokeWidth="2" />
        <text x="0" y="8" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="20"
          fill={s.clockMatched ? COLORS.CRON : COLORS.MUTED}>{CLOCK_TARGET}</text>
      </g>
      <NearElementCaption x={ANCHOR_POS.x} y={CLOCK_Y - 30} anchor="above"
        color={s.clockMatched ? COLORS.CRON : COLORS.WORKER}
        text={s.clockMatched ? ACT3_BEATS.matched.caption : ACT3_BEATS.intro.caption} />

      {s.stepsVisible && WORKER_STEPS.map((w) => (
        <g key={w.id}>
          <ConnLine x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={STEP_XS[w.id]} y2={STEP_Y - 34} color={w.color} />
          <ConceptCard x={STEP_XS[w.id]} y={STEP_Y} w={186} h={72}
            icon={STEP_ICONS[w.id]}
            label={w.label} desc={w.desc} color={w.color}
            active={s.stepHighlight === w.id || s.stepHighlight === null}
            dim={s.stepHighlight !== null &&
              WORKER_STEPS.findIndex((x) => x.id === w.id) > WORKER_STEPS.findIndex((x) => x.id === s.stepHighlight)} />
          {w.id === lastStepId && (
            <NearElementCaption x={STEP_XS[w.id]} y={STEP_Y + 46} anchor="below"
              color={COLORS.JOB} text={ACT3_BEATS.closing.caption} visible={allStepsDone} />
          )}
        </g>
      ))}
    </>,
    origin,
  )
}
