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
      this.cache[key] = new Audio(`/audio/${category}/${name}.wav`)
      
      // In export mode, route audio through AudioContext
      if (this.exportMode && this.audioContext && this.mediaStreamDestination) {
        try {
          const source = this.audioContext.createMediaElementSource(this.cache[key])
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
      console.log(`[SFX] Attempting to play: ${category}/${name}`)
      console.log(`[SFX] - Volume: ${volume}, Speed: ${speed}, Delay: ${delay}`)
      console.log(`[SFX] - Enabled: ${this.enabled}`)
      
      try {
        const audio = this.load(category, name)
        console.log(`[SFX] - Audio loaded: ${audio.src}`)
        
        audio.volume = (volume / 100) * this.defaultVolume
        audio.playbackRate = speed
        audio.currentTime = 0
        
        console.log(`[SFX] - Final volume: ${audio.volume}`)
        console.log(`[SFX] - Calling play()...`)
        
        audio.play()
          .then(() => console.log(`[SFX] ✅ Play SUCCESS: ${category}/${name}`))
          .catch((err) => console.error(`[SFX] ❌ Play FAILED: ${category}/${name}`, err.message, err.name))
      } catch (err) {
        console.error(`[SFX] ❌ Load FAILED:`, err)
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
