import React, { useState } from 'react'
import './ProgressIndicator.css'

export function ProgressIndicator({ exportStatus, contentTitle, onClose, isExporting }) {
  const [showLogs, setShowLogs] = useState(false)

  if (!exportStatus) return null

  const { status, progress, phase, message, logs, error, videoSize } = exportStatus

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
        {(status === 'done' || status === 'error') && (
          <button
            className="progress-close-btn"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        )}
      </div>

      {status === 'error' ? (
        <div className="progress-error-container">
          <div className="progress-error-message">{error || 'Unknown error'}</div>
        </div>
      ) : (
        <>
          <div className="progress-bar-wrapper">
            <div className="progress-bar-track">
              <div
                className="progress-bar-indicator"
                style={{ width: `${progress}%`, backgroundColor: getStatusColor() }}
              />
            </div>
            <div className="progress-bar-text">
              <span className="progress-percentage">{progress}%</span>
            </div>
          </div>

          <div className="progress-phase-info">
            <div className="progress-phase">{phase}</div>
            {status === 'done' && videoSize && (
              <div className="progress-file-size">
                {(videoSize / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>

          {message && (
            <div className="progress-message">{message}</div>
          )}
        </>
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
