// src/content/44-systemd-timer/acts/Act3Persistent.jsx
// ACT 3 — Persistent=true & OnBootSec: server mati tepat jam 02:00
// (jadwal terlewat), lalu server menyala kembali jam 03:00 dan
// Persistent=true langsung memicu eksekusi susulan otomatis.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { CaptionBar, ConceptCard, ConnLine, AnchorIcon, IconPower, IconBoot, IconReplay, withOrigin } from './common'
import { COLORS, ANCHOR_POS, CATCHUP_STEPS, CLOCK_DOWN, CLOCK_UP } from '../data'

const STEP_Y = 660
const STEP_XS = { missed: 156, boot: 366, catchup: 576 }
const STEP_ICONS = { missed: IconPower, boot: IconBoot, catchup: IconReplay }

// ── Mode summary — momen akhir Act 3: server sudah menyala kembali dan
// eksekusi susulan sedang berjalan. ──
export const SUMMARY_STATE = {
  caption: 'Pukul 03:00, server kembali menyala.',
  captionColor: COLORS.TIMER,
  anchorVisible: true,
  anchorGlow: 0.4,
  serverUp: true,
  stepsVisible: true,
  stepHighlight: 'catchup',
}

export default function Act3Persistent({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }
  const clockLabel = s.serverUp ? CLOCK_UP : CLOCK_DOWN

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />
      <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="systemd" />

      <g transform={`translate(${ANCHOR_POS.x} ${ANCHOR_POS.y - 90})`}>
        <rect x="-58" y="-26" width="116" height="52" rx="10" fill={COLORS.PANEL_ALT}
          stroke={s.serverUp ? COLORS.TIMER : COLORS.RISK} strokeWidth="2" />
        <text x="0" y="8" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="20"
          fill={s.serverUp ? COLORS.TIMER : COLORS.RISK}>{clockLabel}</text>
      </g>

      {s.stepsVisible && CATCHUP_STEPS.map((step) => (
        <g key={step.id}>
          <ConnLine x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={STEP_XS[step.id]} y2={STEP_Y - 34} color={step.color} />
          <ConceptCard x={STEP_XS[step.id]} y={STEP_Y} w={186} h={72}
            icon={STEP_ICONS[step.id]}
            label={step.label} desc={step.desc} color={step.color}
            active={s.stepHighlight === step.id || s.stepHighlight === null}
            dim={s.stepHighlight !== null &&
              CATCHUP_STEPS.findIndex((x) => x.id === step.id) > CATCHUP_STEPS.findIndex((x) => x.id === s.stepHighlight)} />
        </g>
      ))}
    </>,
    origin,
  )
}
