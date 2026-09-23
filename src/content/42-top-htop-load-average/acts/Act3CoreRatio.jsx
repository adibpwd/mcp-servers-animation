// src/content/42-top-htop-load-average/acts/Act3CoreRatio.jsx
// ACT 3 — Korelasi dengan Jumlah Core CPU (Analogi Jalan Tol).
// Core CPU = jumlah lajur tol; Load = kendaraan yang lewat. Rasio
// Load ÷ Core menentukan seberapa penuh jalan itu terpakai.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, withOrigin } from './common'
import {
  AXIS_X, COLORS, CORE_COUNT, CURRENT_LOAD, LOAD_RATIO, TOLL_Y, RATIO_Y,
} from '../data'

const ROAD_W = 560
const LANE_H = 34
const LANE_GAP = 8

function TollRoad({ x, y, coreCount, load }) {
  const totalH = coreCount * LANE_H + (coreCount - 1) * LANE_GAP
  const usedLanes = Math.min(load, coreCount)
  return (
    <g transform={`translate(${x}, ${y - totalH / 2})`}>
      <text x={0} y={-16} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>
        {coreCount} CORE = {coreCount} LAJUR TOL
      </text>
      {Array.from({ length: coreCount }).map((_, i) => {
        const laneUsedFrac = Math.max(0, Math.min(1, usedLanes - i))
        const ly = i * (LANE_H + LANE_GAP)
        return (
          <g key={i} transform={`translate(0, ${ly})`}>
            <rect x={-ROAD_W / 2} y={0} width={ROAD_W} height={LANE_H} rx={8} fill={COLORS.LANE_FREE} stroke={COLORS.BORDER} strokeWidth={1} />
            <rect x={-ROAD_W / 2} y={0} width={ROAD_W * laneUsedFrac} height={LANE_H} rx={8} fill={COLORS.LANE_USED} opacity={0.8} />
            <text x={-ROAD_W / 2 - 20} y={LANE_H / 2 + 4} textAnchor="end" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>C{i + 1}</text>
          </g>
        )
      })}
    </g>
  )
}

function FormulaCard({ x, y, load, coreCount }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-260} y={-30} width={520} height={60} rx={12} fill={COLORS.PANEL} stroke={COLORS.AVERAGE} strokeWidth={2} filter="url(#shadow)" />
      <text x={0} y={-4} textAnchor="middle" fontSize={16} fontWeight={900} fontFamily="monospace" fill={COLORS.TEXT}>
        {load.toFixed(1)} ÷ {coreCount} CORE
      </text>
      <text x={0} y={18} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>Load dibagi jumlah Core</text>
    </g>
  )
}

function RatioResult({ x, y, ratio }) {
  const safe = ratio < 1.0
  const color = safe ? COLORS.SUCCESS : COLORS.DANGER
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-180} y={-34} width={360} height={68} rx={14} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} filter="url(#shadow)" />
      <text x={0} y={-6} textAnchor="middle" fontSize={26} fontWeight={900} fontFamily="monospace" fill={color}>{Math.round(ratio * 100)}% TERPAKAI</text>
      <text x={0} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={color}>{safe ? 'ZONA AMAN' : 'ANTREAN PROSES'}</text>
    </g>
  )
}

export default function Act3CoreRatio({ state, origin }) {
  const pop = state?.pop

  return withOrigin(
    <>
      <g transform={tos(pop, 'tollRoad', AXIS_X, TOLL_Y)} opacity={oop(pop, 'tollRoad')}>
        <TollRoad x={0} y={0} coreCount={CORE_COUNT} load={CURRENT_LOAD} />
      </g>
      <g transform={tos(pop, 'formulaCard', AXIS_X, RATIO_Y - 70)} opacity={oop(pop, 'formulaCard')}>
        <FormulaCard x={0} y={0} load={CURRENT_LOAD} coreCount={CORE_COUNT} />
      </g>
      <g transform={tos(pop, 'ratioResult', AXIS_X, RATIO_Y)} opacity={oop(pop, 'ratioResult')}>
        <RatioResult x={0} y={0} ratio={LOAD_RATIO} />
      </g>
    </>,
    origin,
  )
}
