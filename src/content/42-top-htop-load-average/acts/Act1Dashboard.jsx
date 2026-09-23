// src/content/42-top-htop-load-average/acts/Act1Dashboard.jsx
// ACT 1 — Dashboard Detak Jantung Server (`top` & `htop`).
// Meter CPU + Memory dan daftar 3 proses paling rakus resource.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, withOrigin } from './common'
import {
  AXIS_X, COLORS, METER_LABEL, CPU_FILL, MEM_FILL,
  CPU_METER_Y, MEM_METER_Y, TASK_LIST_Y, TASKS,
} from '../data'

const BAR_W = 560

function Meter({ x, y, label, fill, color }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text x={-BAR_W / 2} y={-12} fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.MUTED}>{label}</text>
      <text x={BAR_W / 2} y={-12} textAnchor="end" fontSize={11} fontWeight={900} fontFamily="monospace" fill={COLORS.TEXT}>{Math.round(fill * 100)}%</text>
      <rect x={-BAR_W / 2} y={0} width={BAR_W} height={20} rx={10} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
      <rect x={-BAR_W / 2} y={0} width={Math.max(0, BAR_W * fill)} height={20} rx={10} fill={color} opacity={0.85} />
    </g>
  )
}

function TaskRow({ x, y, task, rank }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-BAR_W / 2} y={-22} width={BAR_W} height={44} rx={10} fill={COLORS.PANEL} stroke={COLORS.TASK} strokeWidth={1.5} />
      <text x={-BAR_W / 2 + 16} y={-2} fontSize={10} fontWeight={900} fontFamily="monospace" fill={COLORS.TASK}>{rank}</text>
      <text x={-BAR_W / 2 + 40} y={-6} fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>PID {task.pid}</text>
      <text x={-BAR_W / 2 + 40} y={10} fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>{task.name}</text>
      <text x={BAR_W / 2 - 90} y={-6} fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>%CPU</text>
      <text x={BAR_W / 2 - 90} y={10} fontSize={12} fontWeight={900} fontFamily="monospace" fill={COLORS.CPU}>{task.cpu}</text>
      <text x={BAR_W / 2 - 20} y={-6} fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>%MEM</text>
      <text x={BAR_W / 2 - 20} y={10} fontSize={12} fontWeight={900} fontFamily="monospace" fill={COLORS.MEM}>{task.mem}</text>
    </g>
  )
}

export default function Act1Dashboard({ state, origin }) {
  const pop = state?.pop

  return withOrigin(
    <>
      <g transform={tos(pop, 'cpuMeter', AXIS_X, CPU_METER_Y)} opacity={oop(pop, 'cpuMeter')}>
        <Meter x={0} y={0} label={METER_LABEL.cpu} fill={CPU_FILL} color={COLORS.CPU} />
      </g>
      <g transform={tos(pop, 'memMeter', AXIS_X, MEM_METER_Y)} opacity={oop(pop, 'memMeter')}>
        <Meter x={0} y={0} label={METER_LABEL.mem} fill={MEM_FILL} color={COLORS.MEM} />
      </g>

      {TASKS.map((task, i) => (
        <g key={task.pid}
          transform={tos(pop, `taskRow${i}`, AXIS_X, TASK_LIST_Y + i * 58)}
          opacity={oop(pop, `taskRow${i}`)}>
          <TaskRow x={0} y={0} task={task} rank={i + 1} />
        </g>
      ))}
    </>,
    origin,
  )
}
