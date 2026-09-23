// src/content/35-cron-job/acts/Act4LogRedirection.jsx
// ACT 4 — Eksekusi silent & log redirection: tanpa redirect, stdout/stderr
// script hilang begitu saja; dengan `>> /var/log/backup.log 2>&1`, hasil
// eksekusi tercatat rapi. REVISI-01: caption dipindah dekat elemen aktif
// (script/void/log), bukan bar statis di atas.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.
// Act ini SENGAJA tidak memakai anchor "crond" (fokus pindah ke script &
// log, bukan daemon-nya — lihat catatan ANCHOR_POS di data.js).

import { NearElementCaption, ConnLine, IconScript, IconVoid, IconLogFile, withOrigin } from './common'
import { COLORS, LOG_STREAMS, LOG_TARGET, ACT4_BEATS } from '../data'

const SCRIPT_POS = { x: 366, y: 320 }
const STREAM_XS = { stdout: 196, stderr: 536 }
const SINK_Y = 560
const LOG_POS = { x: 366, y: 700 }

export const SUMMARY_STATE = {
  scriptVisible: true,
  streamsVisible: true,
  redirectActive: true,
}

export default function Act4LogRedirection({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }

  return withOrigin(
    <>
      {s.scriptVisible && (
        <g transform={`translate(${SCRIPT_POS.x} ${SCRIPT_POS.y})`}>
          <rect x="-64" y="-34" width="128" height="68" rx="12" fill={COLORS.PANEL} stroke={COLORS.JOB} strokeWidth="2.2" />
          <g transform="translate(-10 -22)"><IconScript size={20} /></g>
          <text x="0" y="24" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.JOB}>/backup.sh</text>
        </g>
      )}
      <NearElementCaption x={SCRIPT_POS.x} y={SCRIPT_POS.y - 50} anchor="above"
        color={COLORS.JOB} text={ACT4_BEATS.intro.caption} visible={s.scriptVisible && !s.streamsVisible} />

      {s.streamsVisible && LOG_STREAMS.map((stream) => (
        <g key={stream.id}>
          <ConnLine x1={SCRIPT_POS.x} y1={SCRIPT_POS.y + 36} x2={STREAM_XS[stream.id]} y2={SINK_Y - 30} color={stream.color} />
          <g transform={`translate(${STREAM_XS[stream.id]} ${SINK_Y})`} opacity={s.redirectActive ? 0.35 : 1}>
            <rect x="-70" y="-26" width="140" height="52" rx="10" fill={COLORS.PANEL_ALT} stroke={stream.color} strokeWidth="1.8" />
            <text x="0" y="7" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={stream.color}>{stream.label}</text>
          </g>
          {!s.redirectActive && (
            <g transform={`translate(${STREAM_XS[stream.id]} ${SINK_Y + 74})`}>
              <IconVoid size={20} />
              <text x="0" y="34" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.RISK}>hilang</text>
            </g>
          )}
          {s.redirectActive && (
            <ConnLine x1={STREAM_XS[stream.id]} y1={SINK_Y + 26} x2={LOG_POS.x} y2={LOG_POS.y - 30} color={COLORS.LOG} dashed={false} />
          )}
        </g>
      ))}
      <NearElementCaption x={366} y={SINK_Y + 96} anchor="below"
        color={COLORS.RISK} text={ACT4_BEATS.risk.caption} visible={s.streamsVisible && !s.redirectActive} />

      {s.redirectActive && (
        <g transform={`translate(${LOG_POS.x} ${LOG_POS.y})`}>
          <rect x="-100" y="-34" width="200" height="68" rx="12" fill={COLORS.PANEL} stroke={COLORS.LOG} strokeWidth="2.2" />
          <g transform="translate(-72 -22)"><IconLogFile size={20} /></g>
          <text x="10" y="-2" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.LOG}>{LOG_TARGET.path}</text>
          <text x="10" y="20" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.MUTED}>{LOG_TARGET.redirect}</text>
        </g>
      )}
      <NearElementCaption x={LOG_POS.x} y={LOG_POS.y + 48} anchor="below"
        color={COLORS.LOG} text={ACT4_BEATS.closing.caption} visible={s.redirectActive} />
    </>,
    origin,
  )
}
