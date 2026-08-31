// sfx-loader.js
// Advanced SFX management for playful animations

/**
 * SFX Loader - Manages audio playback with caching and simultaneous sound support
 * 
 * Features:
 * - Category-based organization (ui, transitions, impacts, warnings, success)
 * - Multiple sounds can play simultaneously
 * - Volume and playback rate control
 * - Smart caching to prevent re-loading
 */

class SFXLoader {
  constructor() {
    this.cache = {}
    this.defaultVolume = 0.6  // Increased from 0.35 to 0.6 for better audibility
    this.enabled = true
    
    // Audio capture for export mode
    this.exportMode = false
    this.audioContext = null
    this.mediaStreamDestination = null
  }

  /**
   * Initialize audio capture for export mode
   */
  initExportMode() {
    if (typeof window === 'undefined') return
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.mediaStreamDestination = this.audioContext.createMediaStreamDestination()
      this.exportMode = true
      this.enabled = true // Force enable in export mode
      console.log('[SFX] Export mode initialized - audio will be captured')
      console.log('[SFX] sfxLoader enabled:', this.enabled)
      
      // Expose stream for puppeteer to access
      window.__audioStream = this.mediaStreamDestination.stream
    } catch (err) {
      console.error('[SFX] Failed to initialize export mode:', err)
    }
  }

  /**
   * Load and cache audio file
   * @param {string} category - Audio category (ui, transitions, impacts, warnings, success, sfx)
   * @param {string} name - Sound name (without .wav extension)
   * @returns {Audio} Audio instance
   */
  load(category, name) {
    const key = `${category}/${name}`
    if (!this.cache[key]) {
      const el = new Audio(`/audio/${category}/${name}.wav`)
      // Bounded pool: lets fast-retrigger sounds (typing) overlap without
      // stepping on each other's playback, but caps how many <audio>
      // elements ever get created for this sound (avoids resource-limit
      // issues in some browsers when a single Audio is reused too fast,
      // or unbounded growth if we cloned a fresh node on every play call).
      this.cache[key] = { pool: [el], nextIndex: 0 }

      if (this.exportMode && this.audioContext && this.mediaStreamDestination) {
        try {
          const source = this.audioContext.createMediaElementSource(el)
          source.connect(this.mediaStreamDestination)
          source.connect(this.audioContext.destination) // Also play for monitoring
        } catch (err) {
          // Audio element might already be connected, ignore
        }
      }
    }
    return this.cache[key]
  }

  /**
   * Play a sound effect
   * @param {string} category - Audio category
   * @param {string} name - Sound name
   * @param {object} options - Playback options
   * @param {number} options.volume - Volume (0-100)
   * @param {number} options.speed - Playback rate
   * @param {number} options.delay - Delay in seconds before playing (consistent with GSAP timeline)
   */
  play(category, name, options = {}) {
    if (!this.enabled || typeof window === 'undefined') return

    const {
      volume = 75,
      speed = 1.0,
      delay = 0
    } = options

    const playSound = () => {
      try {
        const entry = this.load(category, name)
        const POOL_SIZE = 4

        // Grow the pool lazily (max POOL_SIZE elements), only cloning
        // when we actually need more overlap headroom.
        if (entry.pool.length < POOL_SIZE) {
          const clone = entry.pool[0].cloneNode(true)
          if (this.exportMode && this.audioContext && this.mediaStreamDestination) {
            try {
              const source = this.audioContext.createMediaElementSource(clone)
              source.connect(this.mediaStreamDestination)
              source.connect(this.audioContext.destination)
            } catch (err) {
              // ignore
            }
          }
          entry.pool.push(clone)
        }

        const audio = entry.pool[entry.nextIndex % entry.pool.length]
        entry.nextIndex++

        audio.volume = Math.max(0, Math.min(1, (volume / 100) * this.defaultVolume))
        audio.playbackRate = speed
        audio.currentTime = 0
        audio.play().catch(() => {})
      } catch (err) {
        // Silently fail
      }
    }

    if (delay > 0) {
      setTimeout(playSound, delay * 1000) // Convert seconds to milliseconds
    } else {
      playSound()
    }
  }

  /**
   * Play multiple sounds simultaneously
   * @param {Array} sounds - Array of {category, name, options} objects
   */
  playMultiple(sounds) {
    sounds.forEach(({ category, name, options }) => {
      this.play(category, name, options)
    })
  }

  /**
   * Convenience methods for each category
   */
  ui(name, options = {}) {
    this.play('ui', name, options)
  }

  transition(name, options = {}) {
    this.play('transitions', name, options)
  }

  impact(name, options = {}) {
    this.play('impacts', name, options)
  }

  warning(name, options = {}) {
    this.play('warnings', name, options)
  }

  success(name, options = {}) {
    this.play('success', name, options)
  }

  sfx(name, options = {}) {
    this.play('sfx', name, options)
  }

  /**
   * Enable/disable all sounds
   */
  setEnabled(enabled) {
    this.enabled = enabled
  }

  /**
   * Clear cache (useful for memory management)
   */
  clearCache() {
    this.cache = {}
  }
}

// Create singleton instance
export const sfxLoader = new SFXLoader()

// Export for direct use
export default sfxLoader

// Expose to window for export script access
if (typeof window !== 'undefined') {
  window.sfxLoader = sfxLoader
}
