import React, { useState, useEffect } from 'react'
import './ExportHistory.css'

// Export server URL - always use same hostname as frontend (dynamic runtime detection)
const getExportServerUrl = () => {
  return `http://${window.location.hostname}:3300`
}

export function ExportHistory({ onBack }) {
  const [history, setHistory] = useState([])
  const [currentExport, setCurrentExport] = useState(null)

  useEffect(() => {
    fetchHistory()
    const interval = setInterval(fetchHistory, 2000)
    return () => clearInterval(interval)
  }, [])

  const fetchHistory = async () => {
    try {
      const EXPORT_SERVER_URL = getExportServerUrl()
      const res = await fetch(`${EXPORT_SERVER_URL}/api/export/history`)
      const data = await res.json()
      setHistory(data.history || [])

      // Also fetch current running export
      const statusRes = await fetch(`${EXPORT_SERVER_URL}/api/export/status`)
      const statusData = await statusRes.json()
      if (statusData.status === 'running') {
        setCurrentExport(statusData)
      } else {
        setCurrentExport(null)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  const clearEntry = async (topicId) => {
    try {
      const EXPORT_SERVER_URL = getExportServerUrl()
      await fetch(`${EXPORT_SERVER_URL}/api/export/history/${topicId}`, {
        method: 'DELETE'
      })
      fetchHistory()
    } catch (err) {
      console.error('Failed to clear history entry:', err)
    }
  }

  const formatTime = (isoString) => {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleString()
  }

  const formatSize = (bytes) => {
    if (!bytes) return '-'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return <span className="status-badge done">✅ Done</span>
      case 'error':
        return <span className="status-badge error">❌ Error</span>
      case 'running':
        return <span className="status-badge running">⟳ Running</span>
      default:
        return <span className="status-badge idle">○ Idle</span>
    }
  }

  return (
    <div className="export-history">
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="history-title">
          <span className="title-text">Export History</span>
          {currentExport && (
            <span className="running-badge">
              <span className="spinner">⟳</span> 1 running
            </span>
          )}
        </div>
      </div>

      {/* Current Export */}
      {currentExport && (
        <div className="current-export-section">
          <div className="section-title">Currently Exporting</div>
          <div className="current-export-card">
            <div className="export-info">
              <div className="export-topic">{currentExport.topicId}</div>
              <div className="export-phase">{currentExport.phase}</div>
            </div>
            <div className="export-progress">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${currentExport.progress}%` }}
                />
              </div>
              <div className="progress-percent">{currentExport.progress}%</div>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="history-section">
        <div className="section-title">
          Past Exports {history.length > 0 && `(${history.length})`}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-text">No export history</div>
          </div>
        ) : (
          <div className="history-table">
            <div className="table-header">
              <div className="col-topic">Topic</div>
              <div className="col-status">Status</div>
              <div className="col-time">Time</div>
              <div className="col-size">Size</div>
              <div className="col-duration">Duration</div>
              <div className="col-action">Action</div>
            </div>
            <div className="table-body">
              {history.map((entry, idx) => (
                <div key={idx} className={`table-row ${entry.status}`}>
                  <div className="col-topic">
                    <span className="topic-name">{entry.topicId}</span>
                  </div>
                  <div className="col-status">{getStatusBadge(entry.status)}</div>
                  <div className="col-time">{formatTime(entry.exportedAt)}</div>
                  <div className="col-size">{formatSize(entry.videoSize)}</div>
                  <div className="col-duration">{entry.duration}s</div>
                  <div className="col-action">
                    {entry.status === 'done' && (
                      <a
                        href={`http://100.78.186.122:3000/videos/${entry.topicId}.mp4`}
                        download={`${entry.topicId}.mp4`}
                        className="action-btn download"
                        title="Download"
                      >
                        ⬇
                      </a>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={() => clearEntry(entry.topicId)}
                      title="Remove from history"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
