// src/content/44-systemd-timer/acts/Act4Observabilitas.jsx
// ACT 4 — Observabilitas dengan systemctl list-timers: hitung mundur
// eksekusi berikutnya (NEXT/LEFT), waktu eksekusi terakhir (LAST), lalu
// inspeksi log lengkap dengan journalctl -u backup.service.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.
// Act ini SENGAJA tidak memakai anchor "systemd" (fokus pindah ke
// terminal/journal, lihat catatan ANCHOR_POS di data.js).

import { CaptionBar, IconTerminal, IconJournal, withOrigin } from './common'
import { COLORS, LIST_TIMERS_ROW, JOURNAL_ENTRIES } from '../data'

const TABLE_POS = { x: 366, y: 310 }
const JOURNAL_POS = { x: 366, y: 640 }
const ROW_FIELDS = ['unit', 'next', 'left', 'last']
const ROW_LABELS = { unit: 'UNIT', next: 'NEXT', left: 'LEFT', last: 'LAST' }

export const SUMMARY_STATE = {
  caption: 'journalctl merangkum seluruh riwayat eksekusi.',
  captionColor: COLORS.SYSTEMD,
  listTimersVisible: true,
  journalVisible: true,
  journalHighlight: null,
}

export default function Act4Observabilitas({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />

      {s.listTimersVisible && (
        <g transform={`translate(${TABLE_POS.x} ${TABLE_POS.y})`}>
          <rect x="-320" y="-70" width="640" height="140" rx="14" fill={COLORS.PANEL} stroke={COLORS.SYSTEMD} strokeWidth="2" />
          <g transform="translate(-300 -46)"><IconTerminal size={18} /></g>
          <text x="-272" y="-33" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.SYSTEMD}>systemctl list-timers</text>
          {ROW_FIELDS.map((f, i) => (
            <g key={f} transform={`translate(${-280 + i * 190} 20)`}>
              <text x="0" y="-14" fontFamily="monospace" fontSize="9.5" fill={COLORS.MUTED}>{ROW_LABELS[f]}</text>
              <text x="0" y="6" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.TEXT}>{LIST_TIMERS_ROW[f]}</text>
            </g>
          ))}
        </g>
      )}

      {s.journalVisible && (
        <g transform={`translate(${JOURNAL_POS.x} ${JOURNAL_POS.y})`}>
          <rect x="-300" y="-30" width="600" height="230" rx="14" fill={COLORS.PANEL_ALT} stroke={COLORS.BORDER} strokeWidth="1.5" />
          <g transform="translate(-280 -16)"><IconJournal size={16} /></g>
          <text x="-256" y="-4" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill={COLORS.SYSTEMD}>journalctl -u backup.service</text>
          {JOURNAL_ENTRIES.map((entry, i) => {
            const active = s.journalHighlight === entry.id || s.journalHighlight === null
            return (
              <text key={entry.id} x="-280" y={30 + i * 34} fontFamily="monospace" fontSize="11.5"
                fill={active ? entry.color : COLORS.MUTED} opacity={active ? 1 : 0.5}>
                {entry.label}
              </text>
            )
          })}
        </g>
      )}
    </>,
    origin,
  )
}
