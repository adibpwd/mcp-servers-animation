import React, { Suspense, lazy, useState, useEffect } from 'react'
import './PlayerShell.css'
import { useExportSettings } from '../hooks/useExportSettings'
import { SettingsModal } from './SettingsModal'
import { TimelineProgressBar } from './TimelineProgressBar'
import { ProgressIndicator } from './ProgressIndicator'

// Export server URL - always use same hostname as frontend (dynamic runtime detection)
const getExportServerUrl = () => {
  // Always use the same hostname/IP that browser is using to access frontend on port 3300
  return `http://${window.location.hostname}:3300`
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

  // Untuk export script (puppeteer): unlock audio TANPA menjalankan animasi.
  // Jangan pakai togglePlayPause di sini — itu juga memanggil setIsPaused(false)
  // yang bikin GSAP timeline benar-benar play, dan SFX yang sempat ke-trigger
  // saat itu TIDAK berhenti walau timeline di-pause lagi setelahnya (Audio/
  // WebAudio node berjalan independen dari GSAP), sehingga bocor ke rekaman.
  useEffect(() => {
    window.__forceUnlockAudio = async () => {
      if (audioUnlocked) return true
      try {
        const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA')
        await silent.play()
        setAudioUnlocked(true)
        console.log('[Audio] ✅ Unlocked silently (animation tetap paused)')
        return true
      } catch (err) {
        console.error('[Audio] ❌ Silent unlock failed:', err)
        return false
      }
    }
    return () => { delete window.__forceUnlockAudio }
  }, [audioUnlocked])

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

  const isParallel = settings.exportMode === 'parallel'

  const fetchStatus = async () => {
    try {
      const EXPORT_SERVER_URL = getExportServerUrl()
      // Poll endpoint sesuai mode aktif
      const endpoint = isParallel
        ? `${EXPORT_SERVER_URL}/api/exportp/status?topicId=${content.id}`
        : `${EXPORT_SERVER_URL}/api/export/status?topicId=${content.id}`
      const res  = await fetch(endpoint)
      const data = await res.json()
      setExportStatus(data)
      if (data.status === 'done' || data.status === 'error') setIsExporting(false)
    } catch (err) {
      console.error('Failed to fetch export status:', err)
    }
  }

  const startExport = async () => {
    setIsExporting(true)
    setShowProgress(true)
    try {
      const EXPORT_SERVER_URL = getExportServerUrl()
      const endpoint = isParallel
        ? `${EXPORT_SERVER_URL}/api/exportp/${content.id}`
        : `${EXPORT_SERVER_URL}/api/export/${content.id}`
      const body = isParallel
        ? { volume: settings.volume, speed: settings.speed, workers: settings.workers }
        : { volume: settings.volume, speed: settings.speed }
      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!data.ok && res.status === 409) {
        alert(`Export sedang berjalan: ${data.error}`)
        setIsExporting(false); setShowProgress(false)
      } else if (!data.ok) {
        alert(`Error: ${data.error}`)
        setIsExporting(false); setShowProgress(false)
      }
    } catch (err) {
      console.error('Failed to start export:', err)
      alert('Gagal memulai export')
      setIsExporting(false); setShowProgress(false)
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

          {/* Mode toggle: Single vs Parallel */}
          <div className="export-mode-toggle" title={isParallel ? `Parallel: ${settings.workers} Chrome workers` : 'Single Chrome process'}>
            <button
              className={`mode-btn ${!isParallel ? 'active' : ''}`}
              onClick={() => updateSettings({ exportMode: 'single' })}
              disabled={isExporting}
              title="Single process (original)"
            >1×</button>
            <button
              className={`mode-btn ${isParallel ? 'active' : ''}`}
              onClick={() => updateSettings({ exportMode: 'parallel' })}
              disabled={isExporting}
              title="Parallel multi-Chrome workers"
            >⚡{settings.workers}×</button>
            {isParallel && (
              <input
                type="range" min="2" max="8" step="1"
                value={settings.workers}
                onChange={e => updateSettings({ workers: Number(e.target.value) })}
                disabled={isExporting}
                className="workers-slider"
                title={`Workers: ${settings.workers}`}
              />
            )}
          </div>

          {/* Export Button */}
          <button
            className={`control-btn export-btn ${isExporting ? 'exporting' : ''}`}
            onClick={startExport}
            disabled={isExporting}
            title={isParallel ? `Export (Parallel, ${settings.workers} workers)` : 'Export (Single)'}
          >
            <span className="control-icon">⟳</span>
            <span>{isExporting ? 'Exporting...' : isParallel ? `Export ⚡` : 'Export MP4'}</span>
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
          mode={isParallel ? 'parallel' : 'single'}
        />
      )}

    </div>
  )
}
