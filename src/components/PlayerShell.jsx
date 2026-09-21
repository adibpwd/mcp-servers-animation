import React, { Suspense, lazy, useState, useEffect } from 'react'
import './PlayerShell.css'
import { useExportSettings } from '../hooks/useExportSettings'
import { SettingsModal } from './SettingsModal'
import { TimelineProgressBar } from './TimelineProgressBar'
import { ProgressIndicator } from './ProgressIndicator'
import { FloatingControls } from './FloatingControls'
import { saveItemChanges } from '../data/contentManagement'
import { useToast } from './ToastNotification'

// Export server URL - always use same hostname as frontend (dynamic runtime detection)
const getExportServerUrl = () => {
  // Always use the same hostname/IP that browser is using to access frontend on port 3373
  return `http://${window.location.hostname}:3373`
}

export function PlayerShell({ content, onBack, isFocused = true, onPlayerStateChange, onContentUpdate, windowed = false }) {
  const [isPaused, setIsPaused] = useState(true)
  const [exportStatus, setExportStatus] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [copiedCaption, setCopiedCaption] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(content.status || 'draft')
  const [isSavingStatus, setIsSavingStatus] = useState(false)

  const { showToast } = useToast()

  useEffect(() => {
    if (content.status) setCurrentStatus(content.status)
  }, [content.status])

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus || isSavingStatus) return
    const statusIcons = { draft: '📝', ready: '⭐', posted: '✅' }
    const statusLabels = { draft: 'Draft', ready: 'Ready to Post', posted: 'Posted' }
    setIsSavingStatus(true)
    setCurrentStatus(newStatus)
    showToast(`Status '${content.title || content.id}' diubah ke ${statusLabels[newStatus] || newStatus}`, statusIcons[newStatus] || '✅')
    const res = await saveItemChanges(content.id, { status: newStatus })
    setIsSavingStatus(false)
    if (res.success) {
      if (onContentUpdate) onContentUpdate({ ...content, status: newStatus })
    }
  }

  const { settings, updateSettings, isLoaded } = useExportSettings()

  // Lazy load the animation component
  const AnimationComponent = lazy(content.component)

  // Untuk export script (puppeteer): unlock audio TANPA menjalankan animasi.
  // Jangan pakai togglePlayPause di sini — itu juga memanggil setIsPaused(false)
  // yang bikin GSAP timeline benar-benar play, dan SFX yang sempat ke-trigger
  // saat itu TIDAK berhenti walau timeline di-pause lagi setelahnya (Audio/
  // WebAudio node berjalan independen dari GSAP), sehingga bocor ke rekaman.
  //
  // PLAN-19 §8: di dashboard windowed, beberapa PlayerShell bisa mounted
  // bersamaan. Fungsi ini di-namespace per content.id supaya window lain
  // tidak saling menimpa, plus alias global yang hanya diisi oleh window
  // yang sedang focused (kompatibel dengan export script single-page lama).
  useEffect(() => {
    const scopedKey = `__forceUnlockAudio__${content.id}`
    const unlock = async () => {
      if (audioUnlocked) return true
      try {
        const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA')
        await silent.play()
        setAudioUnlocked(true)
        console.log(`[Audio] ✅ Unlocked silently (${content.id}, animation tetap paused)`)
        return true
      } catch (err) {
        console.error('[Audio] ❌ Silent unlock failed:', err)
        return false
      }
    }
    window[scopedKey] = unlock
    if (isFocused) window.__forceUnlockAudio = unlock
    return () => {
      delete window[scopedKey]
      if (window.__forceUnlockAudio === unlock) delete window.__forceUnlockAudio
    }
  }, [audioUnlocked, content.id, isFocused])

  // Background/minimized window tidak boleh autoplay atau mengeluarkan
  // audio (PLAN-19 §8 baris "Background normal/Minimized"). Saat window
  // kehilangan fokus, paksa pause.
  useEffect(() => {
    if (!isFocused && !isPaused) setIsPaused(true)
  }, [isFocused, isPaused])

  // Laporkan playerState ke WorkspaceContext supaya dock/close-confirm
  // (export sedang berjalan) tahu status window ini (PLAN-19 §5.1, §10).
  useEffect(() => {
    if (!onPlayerStateChange) return
    const next = isExporting ? 'exporting' : (isPaused ? 'paused' : 'playing')
    onPlayerStateChange(next)
  }, [isExporting, isPaused, onPlayerStateChange])


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

  // Update page title — hanya focused window yang boleh mengubah title
  // dokumen (background window mengubah title akan flicker/menimpa window
  // fokus lain). PLAN-19 §8.
  useEffect(() => {
    if (exportStatus && isFocused) {
      localStorage.setItem(`export_${content.id}_status`, JSON.stringify(exportStatus))

      if (exportStatus.status === 'running') {
        document.title = `⟳ Exporting ${exportStatus.progress}% - MCP Servers Animation`
      } else if (exportStatus.status === 'done') {
        document.title = `✅ Export Complete - MCP Servers Animation`
      } else if (exportStatus.status === 'error') {
        document.title = `❌ Export Failed - MCP Servers Animation`
      } else {
        document.title = `MCP Servers Animation`
      }
    } else if (exportStatus) {
      // Tetap simpan status export walau tidak focused, tapi jangan sentuh title.
      localStorage.setItem(`export_${content.id}_status`, JSON.stringify(exportStatus))
    }
  }, [exportStatus, content.id, isFocused])

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

  const handleCopyCaption = async () => {
    try {
      // Dynamic import raw caption files (query ?raw)
      const captionModules = import.meta.glob('../content/**/caption.md', { query: '?raw', eager: true })
      let text = null

      for (const path in captionModules) {
        // Cocokkan slug id (misal 'https-tls' cocok dengan '23-https-tls' atau 'https-tls')
        const normPath = path.toLowerCase()
        const normId = (content.id || '').toLowerCase()
        if (normPath.includes(`/${normId}/`) || normPath.includes(`-${normId}/`)) {
          const mod = captionModules[path]
          text = typeof mod === 'string' ? mod : mod.default
          break
        }
      }

      if (!text) {
        alert(`Caption file (caption.md) belum tersedia untuk topic "${content.id}".`)
        return
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback untuk HTTP non-secure context
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopiedCaption(true)
      setTimeout(() => setCopiedCaption(false), 2500)
    } catch (err) {
      console.error('Failed to copy caption:', err)
      alert('Gagal menyalin caption ke clipboard.')
    }
  }

  const canDownload = exportStatus?.videoReady

  return (
    <div className="player-shell">

      {/* Top bar — disembunyikan di mode window, digantikan FloatingControls */}
      {!windowed && (
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
            disabled={!isFocused}
            title={!isFocused ? 'Focus window ini dulu untuk play' : (isPaused ? "Play Animation" : "Pause Animation")}
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

          {/* Caption Button */}
          <button
            className={`control-btn copy-caption-btn ${copiedCaption ? 'copied' : ''}`}
            onClick={handleCopyCaption}
            title="Salin caption.md ke clipboard"
          >
            <span className="control-icon">{copiedCaption ? '✓' : '📋'}</span>
            <span>{copiedCaption ? 'Copied!' : 'Caption'}</span>
          </button>
        </div>
      </div>
      )}

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
            paused={isPaused || !isFocused} 
            speed={settings.speed}
            volume={settings.volume}
            previewSfx={settings.previewSfx && audioUnlocked && isFocused}
            audioUnlocked={audioUnlocked && isFocused}
          />
        </Suspense>
      </div>

      {/* Timeline Progress Bar — disembunyikan di mode window (pakai global
          window.__animationTimeline, tidak scoped per-window, lihat audit
          PLAN-19 §2.5) */}
      {!windowed && <TimelineProgressBar isExporting={showProgress} />}

      {/* Floating controls ala AssistiveTouch — hanya mode window */}
      {windowed && (
        <FloatingControls
          isPaused={isPaused}
          onTogglePlay={togglePlayPause}
          isFocused={isFocused}
          isExporting={isExporting}
          onExport={startExport}
          canDownload={canDownload}
          downloadHref={canDownload ? `${getExportServerUrl()}/videos/${content.id}.mp4?t=${Date.now()}` : '#'}
          downloadName={`${content.id}.mp4`}
          copiedCaption={copiedCaption}
          onCopyCaption={handleCopyCaption}
          onOpenSettings={() => setShowSettings(true)}
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
          isSavingStatus={isSavingStatus}
        />
      )}

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
