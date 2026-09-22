// src/content/67-linux-logs/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Beda dari contoh 44-ssh: scene topic ini adalah PETA PERSISTEN (semua
// 7 stasiun & 8 garis tetap terlihat lintas-Act begitu lahir, bukan
// konten berbeda per-Act). Jadi seluruh render diagram ditaruh di satu
// `SceneChrome` di sini, dan tiap `ActN.jsx` hanya beda `state` yang
// dikirim (snapshot progresif — Act N mewarisi semua yang sudah terjadi
// di Act 1..N-1, sesuai bagaimana scene ini sebenarnya berjalan live).
//
// Kontrak: SceneChrome PURE presentational -- tanpa GSAP, tanpa React
// state sendiri, hanya baca `state` (opsional, null-safe).
// ─────────────────────────────────────────────────────────────

import React from 'react'
import {
  COLORS, STATIONS, LINES, CLOSING_Y, PATH_ATLAS,
  EVENT_INFO, RAW_EVENT_LABEL, JOURNALD_LABEL, LOGFILES_LABEL, REMOTE_LABEL,
  JOURNALD_FIELDS, LOGFILE_PREVIEW, ROTATION_INFO, REMOTE_INFO,
  TIMELINE_ENTRIES, SOURCE_COLOR, DIAGNOSIS_STEPS, CLOSING_STAMPS,
} from '../data'

export const STATION_IDS = Object.keys(STATIONS)
export const ZERO_STATION_OPACITY = Object.fromEntries(STATION_IDS.map(id => [id, 0]))
export const ZERO_LINE_PROGRESS = Object.fromEntries(LINES.map(l => [l.id, 0]))

// pecah teks jadi baris-baris <= maxChars (greedy per kata)
export const wrapText = (str, maxChars) => {
  const lines = []
  let cur = ''
  str.split(' ').forEach(w => {
    if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w } else { cur = cur ? cur + ' ' + w : w }
  })
  if (cur) lines.push(cur)
  return lines
}

// ── Icon: pictogram SVG inline (reuse dari Topic 65) ──
export const Icon = ({ type, size = 28, color = COLORS.TEXT, strokeWidth = 1.8 }) => {
  const s = size / 24
  const p = { fill: 'none', stroke: color, strokeWidth: strokeWidth / s, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <g transform={`scale(${s})`}>
      {type === 'process' && (
        <g>
          <rect x={-10} y={-10} width={20} height={20} rx={4} {...p} />
          <circle cx={0} cy={0} r={3.5} fill={color} stroke="none" />
        </g>
      )}
      {type === 'document' && (
        <g>
          <path d="M -8,-11 L 3,-11 L 9,-5 L 9,11 L -8,11 Z" {...p} />
          <path d="M 3,-11 L 3,-5 L 9,-5" {...p} />
          <line x1={-4} y1={0} x2={5} y2={0} {...p} />
          <line x1={-4} y1={4} x2={5} y2={4} {...p} />
        </g>
      )}
      {type === 'stack' && (
        <g>
          <rect x={-9} y={-8} width={18} height={5} rx={1.5} {...p} />
          <rect x={-9} y={-1} width={18} height={5} rx={1.5} {...p} />
          <rect x={-9} y={6} width={18} height={5} rx={1.5} {...p} />
        </g>
      )}
      {type === 'magnifier' && (
        <g>
          <circle cx={-2} cy={-2} r={7} {...p} />
          <line x1={3} y1={3} x2={10} y2={10} {...p} />
        </g>
      )}
      {type === 'folder' && (
        <g>
          <path d="M -10,-7 L -3,-7 L -1,-4 L 10,-4 L 10,8 L -10,8 Z" {...p} />
        </g>
      )}
      {type === 'lock' && (
        <g>
          <rect x={-7} y={-1} width={14} height={10} rx={2} {...p} />
          <path d="M -4,-1 L -4,-5 A 4,4 0 0 1 4,-5 L 4,-1" {...p} />
        </g>
      )}
      {type === 'restart' && (
        <g>
          <path d="M 8,-2 A 8,8 0 1 0 6,6" {...p} />
          <path d="M 9,-8 L 8,-2 L 2,-3" {...p} />
        </g>
      )}
      {type === 'link' && (
        <g>
          <rect x={-11} y={-4} width={12} height={8} rx={4} {...p} />
          <rect x={-1} y={-4} width={12} height={8} rx={4} {...p} />
        </g>
      )}
      {type === 'check' && (
        <g>
          <circle cx={0} cy={0} r={10} {...p} />
          <path d="M -5,0 L -1,4 L 6,-4" {...p} />
        </g>
      )}
      {type === 'route' && (
        <g>
          <circle cx={-7} cy={7} r={2.5} {...p} />
          <circle cx={7} cy={-7} r={2.5} fill={color} stroke="none" />
          <path d="M -7,4.5 C -7,-6 7,6 7,-4.5" {...p} strokeDasharray="2 3" />
        </g>
      )}
      {type === 'clock' && (
        <g>
          <circle cx={0} cy={0} r={10} {...p} />
          <path d="M 0,-5 L 0,0 L 4,3" {...p} />
        </g>
      )}
    </g>
  )
}

export const PathLabel = ({ x, y, text }) => (
  <text x={x} y={y - 6} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}
    stroke={COLORS.BG} strokeWidth={3} paintOrder="stroke">{text}</text>
)

export const Stamp = ({ x, y, color, top, sub, icon, rot = -7 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <circle r={48} fill={color} opacity={0.16} />
    <rect x={-76} y={-30} width={152} height={60} rx={9} fill={COLORS.BG} stroke={color} strokeWidth={3} />
    {icon && (
      <g transform="translate(0, -30)">
        <circle r={15} fill={COLORS.BG} stroke={color} strokeWidth={2.5} />
        <Icon type={icon} size={18} color={color} strokeWidth={2} />
      </g>
    )}
    <text x={0} y={1} textAnchor="middle" fontSize={11} fontWeight={900} fontFamily="monospace" fill={color}>{top}</text>
    {sub && <text x={0} y={20} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill={COLORS.MUTED}>{sub}</text>}
  </g>
)

const FlowLine = ({ line, lineProgress, lineAlert }) => {
  const a = STATIONS[line.from]
  const b = STATIONS[line.to]
  const progress = lineProgress[line.id] || 0
  if (progress <= 0) return null
  const alert = lineAlert[line.id]
  const mx = a.cx + (b.cx - a.cx) * 0.5
  const my = a.cy + (b.cy - a.cy) * 0.5
  return (
    <g>
      <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
        stroke={COLORS.BORDER} strokeWidth={2} pathLength={100}
        strokeDasharray={100} strokeDashoffset={100 * (1 - progress)} opacity={0.7} />
      {alert && alert.opacity > 0.02 && (
        <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
          stroke={alert.color} strokeWidth={3} opacity={alert.opacity} />
      )}
      {progress > 0.02 && progress < 0.98 && line.label && (
        <PathLabel x={mx} y={my} text={line.label} />
      )}
    </g>
  )
}

const IconCaption = ({ stationId, text, captionStation }) => {
  if (!text || captionStation !== stationId) return null
  const st = STATIONS[stationId]
  if (!st) return null

  let absX = st.cx
  let textAnchor = 'middle'
  if (st.cx > 500) {
    absX = Math.min(st.cx + 40, 700)
    textAnchor = 'end'
  } else if (st.cx < 200) {
    absX = Math.max(st.cx - 40, 32)
    textAnchor = 'start'
  }
  const localX = absX - st.cx
  const localY = st.h / 2 + 20
  const lines = wrapText(text, 32)

  return (
    <text x={localX} y={localY} textAnchor={textAnchor} fontSize={13} fontWeight={600}
      fontFamily="sans-serif" fill={COLORS.TEXT} stroke={COLORS.BG} strokeWidth={4} paintOrder="stroke">
      {lines.map((ln, idx) => (
        <tspan key={idx} x={localX} dy={idx === 0 ? 0 : 16}>{ln}</tspan>
      ))}
    </text>
  )
}

// ── SceneChrome: seluruh peta 7 stasiun + 8 garis + path bar + closing.
// PURE presentational, state null-safe (default = tidak ada apa-apa
// muncul, aman untuk render kosong). ──
export function SceneChrome({ state = {} }) {
  const stationOpacity = state.stationOpacity || ZERO_STATION_OPACITY
  const lineProgress = state.lineProgress || ZERO_LINE_PROGRESS
  const pulse = state.pulse || {}
  const lineAlert = state.lineAlert || {}
  const journaldFieldsShown = state.journaldFieldsShown ?? false
  const logPreviewShown = state.logPreviewShown ?? false
  const rotationJournaldOn = state.rotationJournaldOn ?? false
  const rotationLogrotateOn = state.rotationLogrotateOn ?? false
  const auditForwarded = state.auditForwarded ?? false
  const timelineCount = state.timelineCount ?? 0
  const diagnosisStep = state.diagnosisStep ?? -1
  const phaseIdx = state.phaseIdx ?? -1
  const caption = state.caption || ''
  const captionStation = state.captionStation ?? null
  const pathText = state.pathText || ''
  const pathOpacity = state.pathOpacity ?? 0
  const closingOpacity = state.closingOpacity ?? 0

  const pointAt = (lineId, t) => {
    const l = LINES.find(x => x.id === lineId)
    const a = STATIONS[l.from]
    const b = STATIONS[l.to]
    return { x: a.cx + (b.cx - a.cx) * t, y: a.cy + (b.cy - a.cy) * t }
  }

  return (
    <>
      <g opacity={pathText ? pathOpacity : 0}>
        <rect x={16} y={4} width={700} height={30} rx={8} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
        <g transform="translate(30, 19)"><Icon type="folder" size={16} color={COLORS.MUTED} /></g>
        <text x={46} y={23} fontSize={9} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>LOKASI</text>
        <text x={100} y={23} fontSize={12} fontFamily="monospace" fill={COLORS.TEXT}>{pathText}</text>
      </g>

      {LINES.map(line => <FlowLine key={line.id} line={line} lineProgress={lineProgress} lineAlert={lineAlert} />)}

      {Object.entries(pulse).map(([id, pdata]) => {
        const pt = pointAt(pdata.lineId, pdata.t)
        return <circle key={id} cx={pt.x} cy={pt.y} r={5} fill={COLORS.REMOTE} opacity={pdata.opacity} filter="url(#glow)" />
      })}

      {/* ── Stasiun 1: App / Process ── */}
      <g transform={`translate(${STATIONS.rawEvent.cx}, ${STATIONS.rawEvent.cy})`} opacity={stationOpacity.rawEvent}>
        <rect x={-STATIONS.rawEvent.w / 2} y={-STATIONS.rawEvent.h / 2}
          width={STATIONS.rawEvent.w} height={STATIONS.rawEvent.h} rx={14}
          fill={COLORS.PANEL} stroke={COLORS.EVENT} strokeWidth={2.2} filter="url(#shadow)" />
        <g transform="translate(0, -52)"><Icon type="process" size={30} color={COLORS.EVENT} /></g>
        <text x={0} y={-8} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={0.5} fill={COLORS.EVENT}>{RAW_EVENT_LABEL}</text>
        <g transform="translate(0, 18)">
          <rect x={-90} y={-13} width={180} height={26} rx={13} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
          <text x={0} y={4} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>{EVENT_INFO.writesVia}</text>
        </g>
        <text x={0} y={58} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>belum masuk log manapun</text>
        <IconCaption stationId="rawEvent" text={caption} captionStation={captionStation} />
      </g>

      {/* ── Stasiun 2: Log Files ── */}
      <g transform={`translate(${STATIONS.logFiles.cx}, ${STATIONS.logFiles.cy})`} opacity={stationOpacity.logFiles}>
        <rect x={-STATIONS.logFiles.w / 2} y={-STATIONS.logFiles.h / 2}
          width={STATIONS.logFiles.w} height={STATIONS.logFiles.h} rx={14}
          fill={COLORS.PANEL} stroke={logPreviewShown ? COLORS.ACTIVE : COLORS.LOGFILE} strokeWidth={2.2} filter="url(#shadow)" />
        <g transform="translate(0, -60)"><Icon type="document" size={28} color={COLORS.LOGFILE} /></g>
        <text x={0} y={-24} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.LOGFILE}>{LOGFILES_LABEL}</text>
        {logPreviewShown && (
          <g transform="translate(0, -2)">
            {LOGFILE_PREVIEW.map((ln, i) => (
              <text key={i} x={0} y={i * 16} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={COLORS.TEXT}>{ln.length > 42 ? ln.slice(0, 42) + '…' : ln}</text>
            ))}
          </g>
        )}
        {logPreviewShown && (
          <g transform="translate(0, 46)">
            <rect x={-72} y={-12} width={144} height={24} rx={12} fill={COLORS.BG} stroke={COLORS.ACTIVE} strokeWidth={1.5} />
            <g transform="translate(-56, 0)"><Icon type="magnifier" size={13} color={COLORS.ACTIVE} /></g>
            <text x={6} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.ACTIVE}>GREP-ABLE</text>
          </g>
        )}
        {stationOpacity.logFiles > 0.5 && (
          <text x={0} y={70} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>{PATH_ATLAS.logFiles}</text>
        )}
        <IconCaption stationId="logFiles" text={caption} captionStation={captionStation} />
      </g>

      {/* ── Stasiun 3: journald (hub) ── */}
      <g transform={`translate(${STATIONS.journald.cx}, ${STATIONS.journald.cy})`} opacity={stationOpacity.journald}>
        <rect x={-STATIONS.journald.w / 2} y={-STATIONS.journald.h / 2}
          width={STATIONS.journald.w} height={STATIONS.journald.h} rx={16}
          fill={COLORS.PANEL} stroke={COLORS.JOURNALD} strokeWidth={2.6} filter="url(#shadow)" />
        <g transform="translate(0, -55)" filter="url(#glow)"><Icon type="stack" size={38} color={COLORS.JOURNALD} /></g>
        <text x={0} y={-16} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.JOURNALD}>{JOURNALD_LABEL}</text>
        {!journaldFieldsShown && (
          <text x={0} y={8} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>terstruktur, bisa difilter</text>
        )}
        {journaldFieldsShown && (
          <g transform="translate(0, 2)">
            {JOURNALD_FIELDS.map((f, i) => (
              <g key={f.key} transform={`translate(0, ${i * 15})`}>
                <text x={-130} y={0} fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.JOURNALD}>{f.key}</text>
                <text x={-10} y={0} fontSize={9.5} fontFamily="monospace" fill={COLORS.TEXT}>{f.value}</text>
              </g>
            ))}
          </g>
        )}
        <IconCaption stationId="journald" text={caption} captionStation={captionStation} />
      </g>

      {/* ── Stasiun 4: Remote / Audit ── */}
      <g transform={`translate(${STATIONS.remoteAudit.cx}, ${STATIONS.remoteAudit.cy})`} opacity={stationOpacity.remoteAudit}>
        <rect x={-STATIONS.remoteAudit.w / 2} y={-STATIONS.remoteAudit.h / 2}
          width={STATIONS.remoteAudit.w} height={STATIONS.remoteAudit.h} rx={12}
          fill={COLORS.PANEL} stroke={auditForwarded ? COLORS.ACTIVE : COLORS.REMOTE} strokeWidth={2.2} filter="url(#shadow)" />
        <g transform="translate(-62, 0)"><Icon type="link" size={24} color={auditForwarded ? COLORS.ACTIVE : COLORS.REMOTE} /></g>
        <text x={-38} y={-14} fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={0.5} fill={COLORS.MUTED}>{REMOTE_LABEL}</text>
        <text x={-38} y={4} fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>{REMOTE_INFO.target}</text>
        {auditForwarded && (
          <text x={-38} y={22} fontSize={9} fontFamily="monospace" fill={COLORS.ACTIVE}>{REMOTE_INFO.note}</text>
        )}
        <IconCaption stationId="remoteAudit" text={caption} captionStation={captionStation} />
      </g>

      {/* ── Stasiun 5: Rotasi & Retensi ── */}
      <g transform={`translate(${STATIONS.rotation.cx}, ${STATIONS.rotation.cy})`} opacity={stationOpacity.rotation}>
        <rect x={-STATIONS.rotation.w / 2} y={-STATIONS.rotation.h / 2}
          width={STATIONS.rotation.w} height={STATIONS.rotation.h} rx={14}
          fill={COLORS.PANEL} stroke={COLORS.ROTATION} strokeWidth={2.2} filter="url(#shadow)" />
        <g transform="translate(0, -56)"><Icon type="clock" size={26} color={COLORS.ROTATION} /></g>
        <text x={0} y={-22} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.ROTATION}>ROTASI & RETENSI</text>
        <g transform="translate(-64, 46)" opacity={rotationJournaldOn ? 1 : 0.35}>
          <rect x={-58} y={-13} width={116} height={26} rx={8} fill={COLORS.BG} stroke={rotationJournaldOn ? COLORS.ACTIVE : COLORS.BORDER} strokeWidth={1.5} />
          <g transform="translate(-42, 0)"><Icon type="lock" size={12} color={rotationJournaldOn ? COLORS.ACTIVE : COLORS.MUTED} /></g>
          <text x={10} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={rotationJournaldOn ? COLORS.ACTIVE : COLORS.MUTED}>{ROTATION_INFO.journald.label}</text>
        </g>
        <g transform="translate(64, 46)" opacity={rotationLogrotateOn ? 1 : 0.35}>
          <rect x={-58} y={-13} width={116} height={26} rx={8} fill={COLORS.BG} stroke={rotationLogrotateOn ? COLORS.ACTIVE : COLORS.BORDER} strokeWidth={1.5} />
          <g transform="translate(-42, 0)"><Icon type="restart" size={12} color={rotationLogrotateOn ? COLORS.ACTIVE : COLORS.MUTED} /></g>
          <text x={10} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={rotationLogrotateOn ? COLORS.ACTIVE : COLORS.MUTED}>{ROTATION_INFO.logrotate.label}</text>
        </g>
        <IconCaption stationId="rotation" text={caption} captionStation={captionStation} />
      </g>

      {/* ── Stasiun 6: Timeline Insiden ── */}
      <g transform={`translate(${STATIONS.timeline.cx}, ${STATIONS.timeline.cy})`} opacity={stationOpacity.timeline}>
        <rect x={-STATIONS.timeline.w / 2} y={-STATIONS.timeline.h / 2}
          width={STATIONS.timeline.w} height={STATIONS.timeline.h} rx={14}
          fill={COLORS.PANEL} stroke={COLORS.TIMELINE} strokeWidth={2.2} filter="url(#shadow)" />
        <g transform={`translate(${-STATIONS.timeline.w / 2 + 24}, ${-STATIONS.timeline.h / 2 + 20})`}><Icon type="stack" size={20} color={COLORS.TIMELINE} /></g>
        <text x={-STATIONS.timeline.w / 2 + 42} y={-STATIONS.timeline.h / 2 + 24} fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.TIMELINE}>TIMELINE</text>
        {TIMELINE_ENTRIES.slice(0, timelineCount).map((entry, i) => {
          const isStep0 = phaseIdx === 5 && diagnosisStep === 0
          const isStep1 = phaseIdx === 5 && diagnosisStep === 1 && entry.source === 'AUDIT'
          const active = entry.highlighted && (phaseIdx === 4 || isStep0 || isStep1)
          const rowY = -STATIONS.timeline.h / 2 + 46 + i * 25
          return (
            <g key={entry.id} transform={`translate(0, ${rowY})`}>
              {active && <rect x={-STATIONS.timeline.w / 2 + 8} y={-11} width={STATIONS.timeline.w - 16} height={22} rx={5} fill={COLORS.DIAGNOSIS} opacity={0.18} />}
              <text x={-STATIONS.timeline.w / 2 + 14} y={4} fontSize={9.5} fontFamily="monospace" fill={COLORS.MUTED}>{entry.time}</text>
              <rect x={-98} y={-9} width={62} height={16} rx={4} fill={COLORS.BG} stroke={SOURCE_COLOR[entry.source]} strokeWidth={1} />
              <text x={-67} y={3} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill={SOURCE_COLOR[entry.source]}>{entry.source}</text>
              <text x={-28} y={4} fontSize={9} fontFamily="monospace" fill={COLORS.TEXT}>{entry.text}</text>
            </g>
          )
        })}
        <IconCaption stationId="timeline" text={caption} captionStation={captionStation} />
      </g>

      {/* ── Stasiun 7: Rekonstruksi (payoff) ── */}
      <g transform={`translate(${STATIONS.diagnosis.cx}, ${STATIONS.diagnosis.cy})`} opacity={stationOpacity.diagnosis}>
        <g transform="translate(-232, 0)"><Icon type="magnifier" size={26} color={COLORS.DIAGNOSIS} /></g>
        {DIAGNOSIS_STEPS.map((step, i) => {
          const active = diagnosisStep >= i
          const x = (i - 1) * 142
          const stepIcon = ['clock', 'route', 'check'][i]
          const stColor = active ? COLORS.DIAGNOSIS : COLORS.MUTED
          return (
            <g key={step.id} transform={`translate(${x}, 0)`}>
              <rect x={-68} y={-46} width={136} height={92} rx={10}
                fill={COLORS.BG} stroke={active ? COLORS.DIAGNOSIS : COLORS.BORDER}
                strokeWidth={active ? 2.2 : 1.5} opacity={active ? 1 : 0.5} />
              <g opacity={active ? 1 : 0.6}>
                <g transform="translate(-30, -30)"><Icon type={stepIcon} size={15} color={stColor} /></g>
                <text x={-18} y={-26} fontSize={11} fontWeight={800} fontFamily="monospace" fill={stColor}>{step.label}</text>
                {wrapText(step.statement, 20).map((ln, k) => (
                  <text key={k} x={0} y={-8 + k * 13} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>{ln}</text>
                ))}
                {wrapText(step.source, 24).map((ln, k) => (
                  <text key={k} x={0} y={22 + k * 11} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{ln}</text>
                ))}
              </g>
            </g>
          )
        })}
        <IconCaption stationId="diagnosis" text={caption} captionStation={captionStation} />
      </g>

      {/* ── Closing: dua stamp ── */}
      <g opacity={closingOpacity} filter="url(#glow)">
        <Stamp x={STATIONS.diagnosis.cx - 110} y={CLOSING_Y} color={COLORS.WARN} top={CLOSING_STAMPS[0].top} sub={CLOSING_STAMPS[0].sub} icon="lock" rot={-6} />
        <Stamp x={STATIONS.diagnosis.cx + 110} y={CLOSING_Y} color={COLORS.DIAGNOSIS} top={CLOSING_STAMPS[1].top} sub={CLOSING_STAMPS[1].sub} icon="clock" rot={6} />
      </g>
    </>
  )
}

/** Bungkus scene dengan origin translate (default {0,0}) -- dipakai intro bg. */
export function withOrigin(children, origin) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}
