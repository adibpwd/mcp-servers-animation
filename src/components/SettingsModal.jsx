import React, { useState, useEffect, useRef } from 'react'
import styles from './SettingsModal.module.css'

const SPEED_PRESETS = [0.5, 1.0, 1.5, 2.0]

export function SettingsModal({ isOpen, onClose, initialSettings, onApply }) {
  const [localSettings, setLocalSettings] = useState(initialSettings)
  const timelineRef = useRef(null)

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

  const handlePreviewSfxChange = (e) => {
    setLocalSettings((prev) => ({ ...prev, previewSfx: e.target.checked }))
  }

  const handleApply = () => {
    onApply(localSettings)
    onClose()
  }

  if (!isOpen) return null

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
              value={localSettings.volume}
              onChange={handleVolumeChange}
              className={styles.slider}
            />
            <div className={styles.range}>0% — 500%</div>
          </div>

          {/* Speed */}
          <div className={styles.section}>
            <label>Speed</label>
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

          {/* Preview SFX */}
          <div className={styles.section}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={localSettings.previewSfx}
                onChange={handlePreviewSfxChange}
              />
              Enable sound effects preview
            </label>
          </div>

          {/* Live Preview Info */}
          <div className={styles.infoBox}>
            <p>Preview will play at:</p>
            <p className={styles.highlight}>
              {localSettings.speed}x speed • {localSettings.volume}% volume
              {!localSettings.previewSfx && ' (SFX muted)'}
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
