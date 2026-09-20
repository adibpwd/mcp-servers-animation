import React, { useState, useEffect } from 'react'
import styles from './SettingsModal.module.css'

const SPEED_PRESETS = [0.5, 1.0, 1.5, 2.0]

export function SettingsModal({ isOpen, onClose, initialSettings, onApply }) {
  const [localSettings, setLocalSettings] = useState(initialSettings)

  useEffect(() => {
    setLocalSettings(initialSettings)
  }, [initialSettings, isOpen])

  const handleVolumeChange = (e) => {
    const val = Math.max(0, Math.min(500, Number(e.target.value)))
    setLocalSettings((prev) => ({ ...prev, volume: val }))
  }

  const handleSpeedChange = (speed) => {
    setLocalSettings((prev) => ({ ...prev, speed }))
  }

  const handleExportModeChange = (exportMode) => {
    setLocalSettings((prev) => ({ ...prev, exportMode }))
  }

  const handleWorkersChange = (e) => {
    const workers = Math.max(2, Math.min(8, Number(e.target.value)))
    setLocalSettings((prev) => ({ ...prev, workers }))
  }

  const handlePreviewSfxChange = (e) => {
    setLocalSettings((prev) => ({ ...prev, previewSfx: e.target.checked }))
  }

  const handleApply = () => {
    onApply(localSettings)
    onClose()
  }

  if (!isOpen) return null

  const isParallel = (localSettings.exportMode || 'parallel') === 'parallel'
  const currentWorkers = localSettings.workers || 4

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>⚙️ Export Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {/* Volume */}
          <div className={styles.section}>
            <label>Volume: {localSettings.volume}%</label>
            <input
              type="range"
              min="0"
              max="500"
              step="5"
              value={localSettings.volume ?? 100}
              onChange={handleVolumeChange}
              className={styles.slider}
            />
            <div className={styles.range}>0% — 500%</div>
          </div>

          {/* Speed */}
          <div className={styles.section}>
            <label>Playback Speed</label>
            <div className={styles.speedButtons}>
              {SPEED_PRESETS.map((speed) => (
                <button
                  key={speed}
                  className={`${styles.speedBtn} ${
                    localSettings.speed === speed ? styles.active : ''
                  }`}
                  onClick={() => handleSpeedChange(speed)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Export Acceleration (Parallel Workers 1-8x) */}
          <div className={styles.section}>
            <label>Export Speed (Parallel Workers)</label>
            <div className={styles.modeToggleGroup}>
              <button
                type="button"
                className={`${styles.modeBtn} ${!isParallel ? styles.active : ''}`}
                onClick={() => handleExportModeChange('single')}
              >
                1x (Single Process)
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${isParallel ? styles.active : ''}`}
                onClick={() => handleExportModeChange('parallel')}
              >
                ⚡ {currentWorkers}x (Parallel)
              </button>
            </div>

            {isParallel && (
              <div className={styles.workersSection}>
                <div className={styles.workersHeader}>
                  <span>Chrome Workers: <strong>⚡ {currentWorkers}x speed</strong></span>
                  <span className={styles.workersRange}>2x - 8x</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={currentWorkers}
                  onChange={handleWorkersChange}
                  className={styles.slider}
                />
              </div>
            )}
          </div>

          {/* Preview SFX */}
          <div className={styles.section}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={localSettings.previewSfx ?? true}
                onChange={handlePreviewSfxChange}
              />
              Enable sound effects preview
            </label>
          </div>

          {/* Live Preview Info */}
          <div className={styles.infoBox}>
            <p>Export Configuration:</p>
            <p className={styles.highlight}>
              {isParallel ? `⚡ ${currentWorkers}x Parallel Acceleration` : '1x Single Process'} • {localSettings.speed ?? 1.0}x playback • {localSettings.volume ?? 100}% volume
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.applyBtn} onClick={handleApply}>
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  )
}
