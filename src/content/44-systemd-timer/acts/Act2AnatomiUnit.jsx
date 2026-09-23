// src/content/44-systemd-timer/acts/Act2AnatomiUnit.jsx
// ACT 2 — Anatomi pasangan unit: backup.timer mendefinisikan jadwal
// (OnCalendar=*-*-* 02:00:00), lalu memicu backup.service yang
// mendefinisikan pekerjaan (ExecStart=/usr/local/bin/backup.sh).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { CaptionBar, ConceptCard, ConnLine, AnchorIcon, IconTimer, IconService, withOrigin } from './common'
import { COLORS, ANCHOR_POS, UNIT_PAIR } from '../data'

const UNIT_Y = { timer: 340, service: 560 }
const UNIT_X = 366

// ── Mode summary — momen akhir Act 2: kedua unit tampil, hubungan
// trigger sudah terlihat. ──
export const SUMMARY_STATE = {
  caption: 'File .service mendefinisikan pekerjaan yang dijalankan.',
  captionColor: COLORS.SERVICE,
  anchorVisible: true,
  anchorGlow: 0.3,
  unitsVisible: true,
  unitHighlight: null,
}

export default function Act2AnatomiUnit({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }
  const timer = UNIT_PAIR.find((u) => u.id === 'timer')
  const service = UNIT_PAIR.find((u) => u.id === 'service')

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />
      <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="systemd" />

      {s.unitsVisible && (
        <>
          <ConceptCard x={UNIT_X} y={UNIT_Y.timer} w={280} h={80} icon={IconTimer}
            label={timer.label} desc={timer.desc} color={timer.color}
            active={s.unitHighlight === 'timer' || s.unitHighlight === null}
            dim={s.unitHighlight !== null && s.unitHighlight !== 'timer'} />

          <ConnLine x1={UNIT_X} y1={UNIT_Y.timer + 40} x2={UNIT_X} y2={UNIT_Y.service - 40}
            color={COLORS.SYSTEMD} dashed={false} />
          <text x={UNIT_X + 18} y={(UNIT_Y.timer + UNIT_Y.service) / 2 + 4}
            fontFamily="monospace" fontSize="10.5" fill={COLORS.MUTED}>memicu</text>

          <ConceptCard x={UNIT_X} y={UNIT_Y.service} w={280} h={80} icon={IconService}
            label={service.label} desc={service.desc} color={service.color}
            active={s.unitHighlight === 'service' || s.unitHighlight === null}
            dim={s.unitHighlight !== null && s.unitHighlight !== 'service'} />
        </>
      )}
    </>,
    origin,
  )
}
