// src/content/44-systemd-timer/acts/Act1BatasanCron.jsx
// ACT 1 — Batasan cron job biasa: server mati pas tengah malam bikin job
// terlewat, log tercecer di file berbeda, tidak ada monitoring status
// native, lalu fokus menetap ke "systemd" sebagai penggantinya.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { CaptionBar, ConceptCard, AnchorIcon, IconPower, IconScatter, IconQuestion, withOrigin } from './common'
import { COLORS, CRON_LIMITS } from '../data'

const POWER_POS = { x: 366, y: 260 }
const LIMIT_ROW_Y = 430
const LIMIT_XS = { downtime: 156, 'scattered-log': 366, 'no-monitor': 576 }
const LIMIT_ICONS = { downtime: IconPower, 'scattered-log': IconScatter, 'no-monitor': IconQuestion }

// ── Mode summary (tanpa props) — momen akhir Act 1: anchor "systemd"
// sudah settle, daftar batasan sudah tidak tampil lagi. ──
export const SUMMARY_STATE = {
  caption: 'Systemd Timer hadir sebagai penggantinya.',
  captionColor: COLORS.SYSTEMD,
  serverOff: true,
  limitsVisible: false,
  limitHighlight: null,
  anchorVisible: true,
  anchorGlow: 0.3,
}

export default function Act1BatasanCron({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />

      <g transform={`translate(${POWER_POS.x} ${POWER_POS.y})`}>
        <circle r="48" fill={COLORS.PANEL} stroke={s.serverOff ? COLORS.RISK : COLORS.CRON_OLD} strokeWidth="2" />
        <g transform="translate(-16 -16)"><IconPower size={32} color={s.serverOff ? COLORS.RISK : COLORS.CRON_OLD} /></g>
        <text x="0" y="66" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>
          {s.serverOff ? 'server mati — 02:00' : 'server menyala'}
        </text>
      </g>

      {s.limitsVisible && CRON_LIMITS.map((l) => (
        <ConceptCard key={l.id} x={LIMIT_XS[l.id]} y={LIMIT_ROW_Y} w={190} h={72}
          icon={LIMIT_ICONS[l.id]}
          label={l.label} desc={l.desc} color={l.color}
          active={s.limitHighlight === l.id || s.limitHighlight === null}
          dim={s.limitHighlight !== null && s.limitHighlight !== l.id} />
      ))}

      <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="systemd" />
    </>,
    origin,
  )
}
