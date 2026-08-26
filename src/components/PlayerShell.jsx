import React, { Suspense, lazy, useState, useEffect } from 'react'
import './PlayerShell.css'
import { useExportSettings } from '../hooks/useExportSettings'
import { SettingsModal } from './SettingsModal'
import { TimelineProgressBar } from './TimelineProgressBar'
import { ProgressIndicator } from './ProgressIndicator'

// Export server URL - always use same hostname as frontend (dynamic runtime detection)
const getExportServerUrl = () => {
  // Always use the same hostname/IP that browser is using to access frontend
  return `http://${window.location.hostname}:3000`
}

export function PlayerShell({ content, onBack }) {
  const [isPaused, setIsPaused] = useState(true)
  const [exportStatus, setExportStatus] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  
  const { settings, updateSettings, isLoaded } = useExportSettings()

  // Lazy load the animation component
  const AnimationComponent = lazy(content.component)

  const togglePlayPause = async () => {
    // If playing, just pause
    if (!isPaused) {
      setIsPaused(true)
      return
    }
    
    // If paused and audio not unlocked yet, unlock first
    if (!audioUnlocked) {
      try {
        const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA')
        await silent.play()
        setAudioUnlocked(true)
        console.log('[Audio] ✅ Unlocked on first play')
      } catch (err) {
        console.error('[Audio] ❌ Failed to unlock:', err)
      }
    }
    
    // Resume/Play
    setIsPaused(false)
  }

  // Load export status from localStorage on mount
  useEffect(() => {
    const savedStatus = localStorage.getItem(`export_${content.id}_status`)
    if (savedStatus) {
      try {
        const parsed = JSON.parse(savedStatus)
        if (parsed.status === 'running') {
          setIsExporting(true)
          setShowProgress(true)
          setExportStatus(parsed)
        }
      } catch (e) {
        console.error('Failed to load export status from localStorage', e)
      }
    }
    fetchStatus()
  }, [content.id])

  // Poll status while exporting (500ms for real-time updates)
  useEffect(() => {
    if (!isExporting) return
    
    const interval = setInterval(() => {
      fetchStatus()
    }, 500)

    return () => clearInterval(interval)
  }, [isExporting, content.id])

  // Save export status to localStorage whenever it changes
  useEffect(() => {
    if (exportStatus) {
      localStorage.setItem(`export_${content.id}_status`, JSON.stringify(exportStatus))
      
      // Update page title
      if (exportStatus.status === 'running') {
        document.title = `⟳ Exporting ${exportStatus.progress}% - MCP Servers Animation`
      } else if (exportStatus.status === 'done') {
        document.title = `✅ Export Complete - MCP Servers Animation`
      } else if (exportStatus.status === 'error') {
        document.title = `❌ Export Failed - MCP Servers Animation`
      } else {
        document.title = `MCP Servers Animation`
      }
    }
  }, [exportStatus, content.id])

  const fetchStatus = async () => {
    try {
      const EXPORT_SERVER_URL = getExportServerUrl()
      const res = await fetch(`${EXPORT_SERVER_URL}/api/export/status?topicId=${content.id}`)
      const data = await res.json()
      setExportStatus(data)

      // Auto-hide progress on completion (keep visible but allow closing)
      if (data.status === 'done' || data.status === 'error') {
        setIsExporting(false)
        // Don't auto-hide, let user close manually
      }
    } catch (err) {
      console.error('Failed to fetch export status:', err)
    }
  }

  const startExport = async () => {
    setIsExporting(true)
    setShowProgress(true)
    try {
      const EXPORT_SERVER_URL = getExportServerUrl()
      const res = await fetch(
        `${EXPORT_SERVER_URL}/api/export/${content.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            volume: settings.volume,
            speed: settings.speed
          })
        }
      )
      const data = await res.json()
      if (!data.ok && res.status === 409) {
        alert(`Export sedang berjalan untuk: ${data.status}`)
        setIsExporting(false)
        setShowProgress(false)
      } else if (!data.ok) {
        alert(`Error: ${data.error}`)
        setIsExporting(false)
        setShowProgress(false)
      }
    } catch (err) {
      console.error('Failed to start export:', err)
      alert('Gagal memulai export')
      setIsExporting(false)
      setShowProgress(false)
    }
  }

  const handleCloseProgress = () => {
    setShowProgress(false)
    localStorage.removeItem(`export_${content.id}_status`)
    document.title = `MCP Servers Animation`
  }

  const canDownload = exportStatus?.videoReady

  return (
    <div className="player-shell">

      {/* Top bar */}
      <div className="player-topbar">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="player-info">
          <span className="player-category">{content.category}</span>
          <span className="player-title">{content.title}</span>
        </div>

        {/* Control Buttons */}
        <div className="player-controls">
          {/* Play / Pause Control */}
          <button
            className={`control-btn ${isPaused ? 'paused' : 'playing'}`}
            onClick={togglePlayPause}
            title={isPaused ? "Play Animation" : "Pause Animation"}
          >
            <span className="control-icon">{isPaused ? '▶' : '⏸'}</span>
            <span>{isPaused ? 'Play' : 'Pause'}</span>
          </button>

          {/* Settings Button */}
          <button
            className="control-btn settings-btn"
            onClick={() => setShowSettings(true)}
            title="Export settings"
            disabled={isExporting}
          >
            <span className="control-icon">⚙️</span>
            <span>Settings</span>
          </button>

          {/* Export Button */}
          <button
            className={`control-btn export-btn ${isExporting ? 'exporting' : ''}`}
            onClick={startExport}
            disabled={isExporting}
            title="Export to MP4"
          >
            <span className="control-icon">{isExporting ? '⟳' : '⟳'}</span>
            <span>{isExporting ? 'Exporting...' : 'Export MP4'}</span>
          </button>

          {/* Download Button */}
          <a
            href={canDownload ? `${getExportServerUrl()}/videos/${content.id}.mp4?t=${Date.now()}` : '#'}
            download={canDownload ? `${content.id}.mp4` : false}
            className={`control-btn download-btn ${canDownload ? 'ready' : 'disabled'}`}
            title={canDownload ? 'Download MP4' : 'Export video first'}
            onClick={(e) => !canDownload && e.preventDefault()}
          >
            <span className="control-icon">⬇</span>
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Settings Modal */}
      {isLoaded && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          initialSettings={settings}
          onApply={updateSettings}
        />
      )}

      {/* Animation canvas */}
      <div className="player-canvas">
        <Suspense fallback={
          <div className="player-loading">
            <div className="loading-dot" />
            <span>Loading animation...</span>
          </div>
        }>
          <AnimationComponent 
            paused={isPaused} 
            speed={settings.speed}
            volume={settings.volume}
            previewSfx={settings.previewSfx && audioUnlocked}
            audioUnlocked={audioUnlocked}
          />
        </Suspense>
      </div>

      {/* Timeline Progress Bar */}
      <TimelineProgressBar isExporting={showProgress} />

      {/* Floating Progress Indicator */}
      {showProgress && exportStatus && (
        <ProgressIndicator
          exportStatus={exportStatus}
          contentTitle={content.title}
          onClose={handleCloseProgress}
          isExporting={isExporting}
        />
      )}

    </div>
  )
}
