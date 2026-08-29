import React, { useState } from 'react'
import './ProgressIndicator.css'

// ─────────────────────────────────────────────────────────────
// Definisi step per mode export, dengan rentang overall-progress
// (%) yang dipakai server (lihat export-lib.js & export-parallel.mjs).
// Dipakai buat ngitung fill % lokal tiap bullet-bar.
// ─────────────────────────────────────────────────────────────
const SINGLE_STEPS = [
  { key: 'audio',  label: 'Rekam Audio',   start: 0,  end: 14 },
  { key: 'frames', label: 'Capture Frame', start: 15, end: 80 },
  { key: 'encode', label: 'Encode Video',  start: 80, end: 99 },
]

const PARALLEL_STEPS = [
  { key: 'duration', label: 'Deteksi Durasi',  start: 0,  end: 5  },
  { key: 'audio',    label: 'Rekam Audio',     start: 5,  end: 14 },
  { key: 'frames',   label: 'Capture Frame',   start: 15, end: 80, hasWorkers: true },
  { key: 'merge',    label: 'Merge Segments',  start: 80, end: 82 },
  { key: 'encode',   label: 'Encode Video',    start: 82, end: 99 },
]

// Cocokkan teks "phase" dari server ke key step (urutan cek penting:
// 'Merging' & 'Capturing' sama-sama mengandung kata "frames").
function activeStepKey(phase) {
  if (!phase) return null
  if (phase.startsWith('Detecting')) return 'duration'
  if (phase.startsWith('Recording')) return 'audio'
  if (phase.startsWith('Merging')) return 'merge'
  if (phase.startsWith('Capturing')) return 'frames'
  if (phase.startsWith('Encoding')) return 'encode'
  if (phase.startsWith('Complete')) return 'complete'
  return null
}

// Fill % lokal tiap step: 100 kalau sudah lewat, 0 kalau belum sampai,
// dihitung proporsional dari overall progress kalau sedang aktif.
function stepFill(step, overall, activeIdx, idx, done) {
  if (done) return 100
  if (idx < activeIdx) return 100
  if (idx > activeIdx) return 0
  if (overall <= step.start) return 2 // biar bullet keliatan "mulai jalan" walau masih 0%
  if (overall >= step.end) return 100
  return Math.round(((overall - step.start) / (step.end - step.start)) * 100)
}

function StepBar({ label, pct, state }) {
  return (
    <div className={`bullet-step bullet-step--${state}`}>
      <div className="bullet-step-label">
        <span className="bullet-step-icon">
          {state === 'done' ? '✓' : state === 'active' ? '⟳' : '·'}
        </span>
        {label}
      </div>
      <div className="bullet-step-track">
        <div className="bullet-step-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="bullet-step-pct">{pct}%</div>
    </div>
  )
}

function WorkerChips({ workerCount, workerStates }) {
  const chips = Array.from({ length: workerCount }, (_, i) => {
    const ws = workerStates?.find(w => w.id === i)
    const pct = ws && ws.total ? Math.round((ws.done / ws.total) * 100) : 0
    const state = pct >= 100 ? 'done' : pct > 0 ? 'active' : 'pending'
    return { id: i, pct, state }
  })
  return (
    <div className="bullet-workers-row">
      {chips.map(c => (
        <div key={c.id} className={`bullet-worker-chip bullet-worker-chip--${c.state}`} title={`Worker ${c.id + 1}: ${c.pct}%`}>
          <div className="bullet-worker-chip-fill" style={{ height: `${c.pct}%` }} />
          <span className="bullet-worker-chip-label">W{c.id + 1}</span>
        </div>
      ))}
    </div>
  )
}

export function ProgressIndicator({ exportStatus, contentTitle, onClose, isExporting, mode = 'single' }) {
  const [showLogs, setShowLogs] = useState(false)

  if (!exportStatus) return null

  const { status, progress, phase, message, logs, error, videoSize, workers, workerStates } = exportStatus

  const getStatusIcon = () => {
    if (status === 'error') return '❌'
    if (status === 'done') return '✅'
    return '⟳'
  }

  const getStatusColor = () => {
    if (status === 'error') return '#EF4444'
    if (status === 'done') return '#10B981'
    return '#34D399'
  }

  const steps = mode === 'parallel' ? PARALLEL_STEPS : SINGLE_STEPS
  const isDone = status === 'done'
  const activeKey = isDone ? 'complete' : activeStepKey(phase)
  // activeKey === null artinya fase belum ke-set/belum dikenali (mis. masih
  // "Starting..." sesaat sebelum onProgress pertama) — JANGAN dianggap
  // "semua step sudah lewat" (steps.length), karena itu bikin semua bullet
  // sempat kelip 100% hijau duluan. Default-nya harus 0%, jadi anggap
  // posisi di step paling awal (0) selama belum benar-benar done.
  const activeIdx = activeKey === 'complete'
    ? steps.length
    : activeKey === null
      ? 0
      : steps.findIndex(s => s.key === activeKey)

  return (
    <div className="progress-indicator">
      <div className="progress-indicator-header">
        <div className="progress-indicator-title">
          <span className="progress-status-icon" style={{ color: getStatusColor() }}>
            {getStatusIcon()}
          </span>
          <span className="progress-title-text">
            {status === 'done' ? 'Export Selesai' : status === 'error' ? 'Export Gagal' : 'Exporting...'}
          </span>
        </div>
        <div className="progress-header-right">
          <span className="progress-overall-pct">{progress}%</span>
          {(status === 'done' || status === 'error') && (
            <button className="progress-close-btn" onClick={onClose} title="Close">✕</button>
          )}
        </div>
      </div>

      {status === 'error' ? (
        <div className="progress-error-container">
          <div className="progress-error-message">{error || 'Unknown error'}</div>
        </div>
      ) : (
        <div className="bullet-steps">
          {steps.map((step, idx) => {
            const pct = stepFill(step, progress, activeIdx, idx, isDone)
            const state = pct >= 100 ? 'done' : (idx === activeIdx ? 'active' : 'pending')
            return (
              <React.Fragment key={step.key}>
                <StepBar label={step.label} pct={pct} state={state} />
                {step.hasWorkers && (workers > 0) && (
                  <WorkerChips workerCount={workers} workerStates={workerStates} />
                )}
              </React.Fragment>
            )
          })}
          {message && <div className="progress-message">{message}</div>}
          {status === 'done' && videoSize && (
            <div className="progress-file-size">{(videoSize / 1024 / 1024).toFixed(2)} MB</div>
          )}
        </div>
      )}

      {logs && logs.length > 0 && (
        <div className="progress-logs-section">
          <button
            className="progress-logs-toggle"
            onClick={() => setShowLogs(!showLogs)}
          >
            {showLogs ? '↑ Hide Logs' : '↓ Show Logs'} ({logs.length})
          </button>
          
          {showLogs && (
            <div className="progress-logs-content">
              {logs.map((log, idx) => (
                <div key={idx} className="progress-log-line">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
