// src/content/35-cron-job/acts/Act2LimaBintang.jsx
// ACT 2 — Membaca 5 bintang crontab: header 5 kolom waktu, lalu 3 kasus
// pola nyata (daily/interval/weekly) bergantian dengan highlight kolom
// kunci + badge makna. REVISI-01 (multi-case), lihat
// revisi/2026-09-23-revisi-01-flowchart-multicase-dynamic-caption.md.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { NearElementCaption, ConceptCard, withOrigin } from './common'
import { COLORS, CRONTAB_FIELDS, CRON_CASES, ACT2_BEATS } from '../data'

const FIELD_Y = 320
const FIELD_XS = [86, 226, 366, 506, 646]
const PATTERN_Y = 560

// ── Mode summary — momen akhir Act 2: field header tampil, kasus terakhir
// (weekly) aktif penuh dengan badge makna terbaca. ──
export const SUMMARY_STATE = {
  fieldsVisible: true,
  fieldHighlight: null,
  caseIndex: 2,
  badgeVisible: true,
}

export default function Act2LimaBintang({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }
  const activeCase = s.caseIndex !== null ? CRON_CASES[s.caseIndex] : null

  return withOrigin(
    <>
      {s.fieldsVisible && CRONTAB_FIELDS.map((f, i) => (
        <ConceptCard key={f.id} x={FIELD_XS[i]} y={FIELD_Y} w={128} h={78}
          label={f.label} desc={f.range} color={COLORS.FIELD}
          active={s.fieldHighlight === f.id || s.fieldHighlight === null}
          dim={s.fieldHighlight !== null && s.fieldHighlight !== f.id} />
      ))}
      <NearElementCaption x={366} y={FIELD_Y - 54} anchor="above" color={COLORS.FIELD}
        text={ACT2_BEATS.intro.caption} visible={s.fieldsVisible && !activeCase} />
      <NearElementCaption x={366} y={FIELD_Y + 60} anchor="below" color={COLORS.WILDCARD}
        text={ACT2_BEATS.layering.caption} visible={s.fieldsVisible && !activeCase} />

      {activeCase && (
        <g key={activeCase.id}>
          <g transform={`translate(366 ${PATTERN_Y})`}>
            {activeCase.pattern.map((val, i) => {
              const x = -300 + i * 150
              const field = CRONTAB_FIELDS[i]
              const isKey = activeCase.highlightFields.includes(field.id)
              return (
                <g key={i}>
                  <rect x={x - 60} y="-30" width="120" height="60" rx="10" fill={COLORS.PANEL}
                    stroke={isKey ? activeCase.color : COLORS.BORDER} strokeWidth={isKey ? 2.6 : 1.4}
                    opacity={isKey ? 1 : 0.55} />
                  <text x={x} y="8" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="22"
                    fill={isKey ? activeCase.color : COLORS.MUTED}>{val}</text>
                </g>
              )
            })}
          </g>
          <NearElementCaption x={366} y={PATTERN_Y + 40} anchor="below" color={activeCase.color}
            text={activeCase.badge} visible={s.badgeVisible} />
        </g>
      )}

      <NearElementCaption x={366} y={PATTERN_Y + 110} anchor="below" color={COLORS.FIELD}
        text={ACT2_BEATS.closing.caption} visible={Boolean(s.showClosing)} />
    </>,
    origin,
  )
}
