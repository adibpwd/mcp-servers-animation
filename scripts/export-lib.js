import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const FPS = 30

const SFX_SCHEDULES = {
  'file-permission': [
    // Intro & Phase 0: Anatomi (0 - 7.7s)
    { at: 0.0, file: 'whoosh.wav' },      // intro morph start
    { at: 1.2, file: 'whoosh.wav' },      // phase 0 start (anatomi)
    { at: 1.3, file: 'materialize.wav' }, // terminal box appear
    { at: 1.6, file: 'typing.wav' },      // string type in
    { at: 1.9, file: 'scan.wav' },        // entity boxes scan
    { at: 2.2, file: 'click.wav' },       // highlight d
    { at: 3.6, file: 'click.wav' },       // highlight rwx (owner)
    { at: 5.0, file: 'click.wav' },       // highlight r-x (group)
    { at: 6.2, file: 'click.wav' },       // highlight r-- (others)

    // Phase 1: Math (7.7s - 15.2s)
    { at: 7.7, file: 'whoosh.wav' },      // phase 1 start
    { at: 9.5, file: 'typing.wav' },      // start math progressive reveal (7.7 + 1.8)
    { at: 13.0, file: 'success.wav' },    // math done (7.7 + 5.3)

    // Phase 2: Simulation Arena (15.2s - 24.2s)
    { at: 15.2, file: 'whoosh.wav' },     // phase 2 start
    // Action 1: Owner Read
    { at: 15.4, file: 'whoosh.wav' },     // capsule (15.2 + 0.2)
    { at: 16.1, file: 'success.wav' },    // impact (15.4 + 0.7)
    // Action 2: Owner Write
    { at: 16.7, file: 'whoosh.wav' },     // capsule (15.2 + 1.5)
    { at: 17.4, file: 'success.wav' },    // impact (16.7 + 0.7)
    // Action 3: Group Read
    { at: 18.3, file: 'whoosh.wav' },     // capsule (15.2 + 3.1)
    { at: 19.0, file: 'success.wav' },    // impact (18.3 + 0.7)
    // Action 4: Group Write
    { at: 19.6, file: 'whoosh.wav' },     // capsule (15.2 + 4.4)
    { at: 20.3, file: 'error.wav' },      // impact (19.6 + 0.7)
    // Action 5: Others Write
    { at: 21.2, file: 'whoosh.wav' },     // capsule (15.2 + 6.0)
    { at: 21.9, file: 'error.wav' },      // impact (21.2 + 0.7)
    // Action 6: Others Exec
    { at: 22.6, file: 'whoosh.wav' },     // capsule (15.2 + 7.4)
    { at: 23.3, file: 'error.wav' },      // impact (22.6 + 0.7)

    // Phase 3: Recipes (24.2s - 31.2s)
    { at: 24.2, file: 'whoosh.wav' },     // phase 3 start
    { at: 25.8, file: 'materialize.wav' },// recipe 1 (24.2 + 1.6)
    { at: 27.4, file: 'materialize.wav' },// recipe 2 (24.2 + 3.2)
    { at: 29.0, file: 'warning.wav' }     // 777 alert (24.2 + 4.8)
  ],
  
  'virtual-memory': [
    // INTRO (0-1.4s)
    { at: 0.5, category: 'transitions', name: 'swoosh' },
    { at: 1.0, category: 'ui', name: 'chime' },
    
    // ACT 1: DESK ANALOGY (1.4-10.4s = 1.4 + 9.0)
    { at: 1.4, category: 'sfx', name: 'whoosh' },              // Phase start
    { at: 2.4, category: 'ui', name: 'pop' },                  // Browser appears
    { at: 2.7, category: 'ui', name: 'pop' },                  // Game appears
    { at: 3.0, category: 'ui', name: 'pop' },                  // VS Code appears
    { at: 3.3, category: 'ui', name: 'pop' },                  // Spotify appears
    { at: 3.6, category: 'ui', name: 'pop' },                  // Zoom appears
    { at: 4.3, category: 'ui', name: 'chime' },                // Caption update
    { at: 5.4, category: 'warnings', name: 'alert-pulse' },    // Desk vibrate start
    { at: 5.8, category: 'warnings', name: 'alert-pulse' },    // Vibrate intensify
    { at: 6.2, category: 'warnings', name: 'alert-pulse' },    // Vibrate max
    { at: 6.5, category: 'warnings', name: 'critical-alert' }, // "PENUH!" moment
    
    // ACT 2: PAGING (10.4-19.4s = 10.4 + 9.0)
    { at: 10.4, category: 'transitions', name: 'swoosh' },     // Phase start
    { at: 11.0, category: 'transitions', name: 'swoosh' },     // App box appear
    { at: 11.5, category: 'ui', name: 'pop' },                 // Process boxes
    { at: 12.0, category: 'transitions', name: 'swoosh' },     // RAM box appear
    { at: 13.0, category: 'transitions', name: 'slide-in' },   // Arrows
    { at: 13.5, category: 'sfx', name: 'typing' },             // Page allocation
    { at: 14.2, category: 'transitions', name: 'swoosh' },     // Page mapping
    { at: 14.8, category: 'ui', name: 'plink' },               // Page slots fill
    { at: 15.0, category: 'ui', name: 'chime' },               // Allocation complete
    { at: 16.0, category: 'success', name: 'confirm' },        // RAM filled
    { at: 17.0, category: 'success', name: 'charge' },         // Power up
    { at: 17.5, category: 'success', name: 'charge' },         // Power up
    
    // ACT 3: SWAP OUT (19.4-29.4s = 19.4 + 10.0)
    { at: 19.4, category: 'warnings', name: 'critical-alert' },// Phase start - RAM full
    { at: 19.6, category: 'sfx', name: 'error' },              // Error sound
    { at: 20.0, category: 'warnings', name: 'alert-pulse' },   // Alert
    { at: 20.5, category: 'warnings', name: 'error-hum' },     // Background tension
    { at: 21.2, category: 'sfx', name: 'scan' },               // Scanning for pages
    { at: 21.6, category: 'sfx', name: 'scan' },               // Scan continue
    { at: 22.0, category: 'sfx', name: 'scan' },               // Scan complete
    { at: 22.5, category: 'warnings', name: 'alert-pulse' },   // Alert
    { at: 22.7, category: 'warnings', name: 'error-beep' },    // Beep
    { at: 23.0, category: 'transitions', name: 'glitch' },     // Page 1 glitch start
    { at: 23.2, category: 'impacts', name: 'disk-spin' },      // Disk activity
    { at: 24.5, category: 'impacts', name: 'swap' },           // Swap page 1
    { at: 24.7, category: 'transitions', name: 'glitch' },     // Page 2 glitch
    { at: 25.5, category: 'impacts', name: 'swap' },           // Swap page 2
    { at: 25.8, category: 'success', name: 'charge' },         // Recovery
    { at: 26.5, category: 'transitions', name: 'glitch' },     // Page 3 glitch
    { at: 27.3, category: 'impacts', name: 'swap' },           // Swap page 3
    { at: 27.8, category: 'success', name: 'charge' },         // Recovery
    { at: 28.5, category: 'success', name: 'confirm' },        // Swap complete
    
    // ACT 4: SWAP IN & LATENCY (29.4-38.4s = 29.4 + 9.0)
    { at: 29.4, category: 'sfx', name: 'whoosh' },             // Phase start
    { at: 30.0, category: 'warnings', name: 'page-fault' },    // Page fault!
    { at: 30.2, category: 'sfx', name: 'error' },              // Error
    { at: 30.8, category: 'impacts', name: 'swap' },           // Swap in start
    { at: 31.0, category: 'sfx', name: 'materialize' },        // Page materializing
    { at: 31.5, category: 'ui', name: 'pop' },                 // Page arrives
    { at: 32.0, category: 'success', name: 'confirm' },        // First latency bar
    { at: 32.4, category: 'ui', name: 'chime' },               // Second bar
    { at: 32.8, category: 'impacts', name: 'disk-spin' },      // Third bar (SSD)
    { at: 33.2, category: 'impacts', name: 'disk-spin' },      // Fourth bar (HDD)
    { at: 33.8, category: 'warnings', name: 'latency-tick' },  // Latency animation
    { at: 34.2, category: 'warnings', name: 'latency-tick' },  // Tick
    { at: 34.6, category: 'warnings', name: 'latency-tick' },  // Tick
    { at: 35.2, category: 'success', name: 'swap-in-complete' },// Swap in done
    { at: 36.0, category: 'success', name: 'victory' },        // Final success
    { at: 36.2, category: 'ui', name: 'chime' },               // Chime
    { at: 36.8, category: 'warnings', name: 'alert-pulse' },   // Final alert
    { at: 37.4, category: 'success', name: 'complete' }        // Animation end
  ]
}

/**
 * NEW: Recursively discover all audio files in a directory
 * @param {string} audioDir - Path to audio directory
 * @returns {Array} Array of {relativePath, fullPath} objects
 */
function getAllAudioFiles(audioDir) {
  const results = []
  
  function walk(dir, relPath = '') {
    if (!fs.existsSync(dir)) return
    
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        walk(fullPath, path.join(relPath, file))
      } else if (file.endsWith('.wav') || file.endsWith('.mp3')) {
        results.push({
          relativePath: path.join(relPath, file),
          fullPath: fullPath
        })
      }
    })
  }
  
  walk(audioDir)
  return results
}

/**
 * NEW: Copy all audio assets from source to destination
 * @param {string} sourceDir - Source audio directory (public/audio)
 * @param {string} destDir - Destination directory (outDir/public/audio)
 * @returns {number} Number of files copied
 */
function copyAudioAssets(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`[Audio] Source directory not found: ${sourceDir}`)
    return 0
  }
  
  const files = getAllAudioFiles(sourceDir)
  let copiedCount = 0
  
  files.forEach(file => {
    const dest = path.join(destDir, file.relativePath)
    const destFolder = path.dirname(dest)
    
    // Create destination folder if not exists
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true })
    }
    
    // Copy file
    try {
      fs.copyFileSync(file.fullPath, dest)
      copiedCount++
    } catch (err) {
      console.log(`[Audio] Failed to copy ${file.relativePath}: ${err.message}`)
    }
  })
  
  return copiedCount
}

function getScaledSfxSchedule(topicId, outDir, volume = 75, speed = 1.0) {
  // Check if topic has defined SFX schedule
  if (!SFX_SCHEDULES[topicId]) {
    console.log(`[SFX] No schedule defined for '${topicId}', skipping SFX timing`)
    return [] // Empty schedule, audio assets will be copied but no timing sync
  }
  
  const audioBaseDir = path.join(outDir, 'public', 'audio')
  const events = SFX_SCHEDULES[topicId]
    .map((event) => {
      const audioPath = path.join(audioBaseDir, event.category, `${event.name}.wav`)
      return {
        at: Math.max(0, event.at / speed),  // Only adjust by speed, no scaling
        path: audioPath,
        category: event.category,
        name: event.name
      }
    })
  
  console.log(`[SFX] topicId=${topicId}, speed=${speed}, audioBaseDir=${audioBaseDir}`)
  console.log(`[SFX] Total events before filter: ${events.length}`)
  
  const filtered = events.filter((event) => {
    const exists = fs.existsSync(event.path)
    if (!exists) {
      console.log(`[SFX] Missing: ${event.path}`)
    } else {
      console.log(`[SFX] Found: ${event.category}/${event.name}.wav at ${event.at.toFixed(2)}s`)
    }
    return exists
  })
  
  console.log(`[SFX] Events after filter: ${filtered.length}`)
  return filtered
}

// Find ffmpeg binary
let ffmpegBin = 'ffmpeg'
try {
  const staticFfmpeg = (await import('ffmpeg-static')).default
  if (staticFfmpeg && fs.existsSync(staticFfmpeg)) {
    ffmpegBin = staticFfmpeg
  }
} catch (e) {
  ffmpegBin = 'ffmpeg'
}

/**
 * Capture frames from browser animation via puppeteer
 * @param {string} topicId - Topic ID (e.g., 'file-permission')
 * @param {object} options - { baseUrl, framesDir, onProgress, onLog }
 */
async function captureFrames(topicId, { baseUrl = 'http://localhost:5173', framesDir, onProgress, onLog }) {
  
  // Try to load puppeteer (full version with bundled Chrome first, then puppeteer-core)
  let puppeteer, usingBundledChrome = false
  try {
    puppeteer = (await import('puppeteer')).default
    usingBundledChrome = true
  } catch (err) {
    try {
      puppeteer = (await import('puppeteer-core')).default
    } catch (e) {
      throw new Error('Puppeteer not found. Please run: npm install puppeteer')
    }
  }

  const launchOptions = {
    headless: true,
    protocolTimeout: 300000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  }

  // If using puppeteer-core (no bundled Chrome), detect system Chrome
  if (!usingBundledChrome) {
    const possiblePaths = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      process.env.CHROME_EXECUTABLE_PATH,
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/opt/google/chrome/google-chrome'
    ]
    
    const chromePath = possiblePaths.find(path => path && fs.existsSync(path))
    
    if (!chromePath) {
      throw new Error(
        'Chrome/Chromium not found. Please install Chrome or set PUPPETEER_EXECUTABLE_PATH environment variable.\n' +
        'Tried paths: ' + possiblePaths.filter(p => p).join(', ')
      )
    }
    
    launchOptions.executablePath = chromePath
    onLog(`Using system Chrome at: ${chromePath}`)
  } else {
    onLog(`Using bundled Chrome from puppeteer`)
  }

  onLog(`Launching Chrome for topic: ${topicId}...`)
  const browser = await puppeteer.launch(launchOptions)
  const page = await browser.newPage()
  
  // Listen to console logs from browser
  page.on('console', msg => {
    const text = msg.text()
    if (process.env.DEBUG_PASS2) {
      onLog(`[C] ${text.slice(0, 200)}`)
    } else if (text.includes('[Export]') || text.includes('[SFX]')) {
      onLog(`[Browser] ${text}`)
    }
  })
  if (process.env.DEBUG_PASS2) {
    page.on('pageerror', (err) => onLog(`[PAGEERROR] ${err.message}`))
  }

  // 9:16 Portrait resolution (1230x2010 @1.5x)
  await page.setViewport({ width: 820, height: 1340, deviceScaleFactor: 1.5 })

  const hideUiElements = () => page.evaluate(() => {
    const topbar = document.querySelector('.player-topbar')
    if (topbar) topbar.style.display = 'none'

    // Hide timeline controls (PREV/NEXT buttons + slider)
    const timeline = document.querySelector('.timeline-progress-bar')
    if (timeline) timeline.style.display = 'none'

    // Hide floating progress dialog that shows export status
    const progress = document.querySelector('.progress-indicator')
    if (progress) progress.style.display = 'none'

    const canvas = document.querySelector('.player-canvas')
    if (canvas) {
      canvas.style.width = '100vw'
      canvas.style.height = '100vh'
    }
  })

  // Navigate directly to preview route for clean isolation
  const targetUrl = `${baseUrl}/preview/${topicId}`
  onLog(`Navigating directly to ${targetUrl}...`)
  await page.goto(targetUrl, { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  })
  await new Promise((r) => setTimeout(r, 3000)) // Wait for assets to load

  // Initialize export mode for audio capture
  onLog(`Initializing audio capture...`)
  await page.evaluate(() => {
    // Initialize sfxLoader export mode if available
    if (window.sfxLoader) {
      window.sfxLoader.initExportMode()
    }
    // For virtual-memory which uses default export
    if (window.sfxLoaderInstance) {
      window.sfxLoaderInstance.initExportMode()
    }
  })

  // Wait a bit for audio context to initialize
  await new Promise((r) => setTimeout(r, 500))

  // Auto-detect animation duration from timeline
  onLog(`Detecting animation duration from timeline...`)
  const animationDuration = await page.evaluate(() => {
    const tl = window.__animationTimeline
    if (!tl) return null
    
    // IMPORTANT: Reset timeScale to 1.0 BEFORE reading duration
    // because tl.duration() returns duration affected by current timeScale
    // If timeScale=3, a 37.9s animation would report duration=12.6s
    const originalTimeScale = tl.timeScale()
    tl.timeScale(1.0)
    
    // Use .duration() instead of .totalDuration() to get ONE iteration duration
    // (totalDuration includes repeats, which is Infinity for repeat: -1)
    const dur = tl.duration()
    
    // Restore original timeScale
    tl.timeScale(originalTimeScale)
    
    return dur
  })

  if (!animationDuration) {
    throw new Error('Could not detect animation timeline. Animation may not have loaded properly.')
  }

  // Validate detected duration
  const MIN_DURATION = 5    // seconds - no animation shorter than this
  const MAX_DURATION = 300  // seconds (5 min) - reasonable upper bound

  if (!isFinite(animationDuration)) {
    throw new Error(
      `Animation timeline has infinite duration (${animationDuration}). ` +
      `This should not happen when using .duration() instead of .totalDuration(). ` +
      `Please check the animation code.`
    )
  }

  if (animationDuration < MIN_DURATION || animationDuration > MAX_DURATION) {
    throw new Error(
      `Invalid animation duration detected: ${animationDuration.toFixed(2)}s. ` +
      `Expected range: ${MIN_DURATION}-${MAX_DURATION} seconds. ` +
      `Timeline may not be properly initialized or may have incorrect duration settings.`
    )
  }

  onLog(`✓ Detected animation duration: ${animationDuration.toFixed(2)}s (validation passed)`)

  // Two-pass export strategy:
  //   PASS 1: record audio in real-time (timeline plays ONCE at natural speed, no screenshots)
  //   PASS 2: capture frames deterministically by seeking each frame.
  // Real-time screenshots (~120ms each) cannot keep up with the 33ms/frame budget of
  // 30fps playback, so a single-pass capture stretches beyond the animation duration
  // and desyncs audio/video. Splitting into two passes fixes both speed and sync.
  const captureDuration = animationDuration
  const totalFrames = Math.round(FPS * captureDuration)

  if (fs.existsSync(framesDir)) {
    fs.rmSync(framesDir, { recursive: true, force: true })
  }
  fs.mkdirSync(framesDir, { recursive: true })

  onLog(`Hiding UI elements for clean export...`)
  await hideUiElements()

  // Start audio recording
  onLog(`Starting audio recording...`)
  const audioRecordingStarted = await page.evaluate(() => {
    if (!window.__audioStream) {
      console.log('[Export] No audio stream available, skipping audio capture')
      return false
    }

    try {
      // Resume AudioContext if suspended
      if (window.sfxLoader && window.sfxLoader.audioContext) {
        if (window.sfxLoader.audioContext.state === 'suspended') {
          window.sfxLoader.audioContext.resume()
          console.log('[Export] AudioContext resumed')
        }
      }
      
      // Check stream tracks
      const tracks = window.__audioStream.getAudioTracks()
      console.log('[Export] Audio stream tracks:', tracks.length)
      tracks.forEach((track, i) => {
        console.log(`[Export] Track ${i}:`, track.label, 'enabled:', track.enabled, 'muted:', track.muted, 'readyState:', track.readyState)
      })
      
      if (tracks.length === 0) {
        console.log('[Export] No audio tracks in stream!')
        return false
      }
      
      const recorder = new MediaRecorder(window.__audioStream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      const chunks = []
      recorder.ondataavailable = (e) => {
        console.log('[Export] Data available, size:', e.data.size)
        if (e.data.size > 0) chunks.push(e.data)
      }
      
      recorder.onstop = async () => {
        console.log('[Export] Recorder stopped, total chunks:', chunks.length)
        const blob = new Blob(chunks, { type: 'audio/webm' })
        console.log('[Export] Blob size:', blob.size)
        const arrayBuffer = await blob.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        window.__audioData = Array.from(uint8Array)
        console.log('[Export] Audio recording complete:', uint8Array.length, 'bytes')
      }
      
      window.__audioRecorder = recorder
      window.__audioChunks = chunks
      // Start with timeslice (collect data every 1 second)
      recorder.start(1000)
      console.log('[Export] Audio recording started with timeslice=1000ms, state:', recorder.state)
      
      return true
    } catch (err) {
      console.error('[Export] Failed to start audio recording:', err)
      return false
    }
  })

  // ─────────────────────────────────────────────────────────────
  // PASS 1/2: Record audio in real-time (timeline plays ONCE,
  // NO screenshots competing for CPU → wall-clock accurate)
  // ─────────────────────────────────────────────────────────────
  let audioPath = null

  if (audioRecordingStarted) {
    onLog(`✓ Audio recording started`)

    // Start playback at natural speed (single iteration, from the beginning)
    await page.evaluate((target) => {
      const tl = window.__animationTimeline
      if (tl) {
        tl.timeScale(1.0)
        tl.play(0)
        console.log('[Export] PASS1 playback started, target duration:', target)
      }
    }, captureDuration)

    // Poll until the animation finishes
    const recStart = Date.now()
    const recTimeoutMs = captureDuration * 1000 + 15000
    let lastLoggedPct = -100
    while (true) {
      await new Promise((r) => setTimeout(r, 500))
      const st = await page.evaluate(() => {
        const tl = window.__animationTimeline
        return { time: tl ? tl.time() : 0, paused: tl ? tl.paused() : true }
      })
      const timedOut = Date.now() - recStart > recTimeoutMs
      const pct = Math.floor((st.time / captureDuration) * 100)
      if (pct >= lastLoggedPct + 10 && pct < 100) {
        lastLoggedPct = pct
        onProgress({
          phase: 'Recording audio',
          progress: Math.min(14, Math.round(pct * 0.15)),
          message: `${st.time.toFixed(1)}s / ${captureDuration.toFixed(1)}s`
        })
        onLog(`Recording audio: ${pct}% (${st.time.toFixed(1)}s / ${captureDuration.toFixed(1)}s)`)
      }
      if (st.time >= captureDuration - 0.05 || st.paused || timedOut) {
        if (timedOut) onLog(`⚠ Audio recording hit timeout at t=${st.time.toFixed(1)}s`)
        break
      }
    }

    // Pause timeline + short tail so final sounds finish cleanly
    await page.evaluate(() => {
      if (window.__animationTimeline) window.__animationTimeline.pause()
    })
    await new Promise((r) => setTimeout(r, 1000))

    // Stop audio recording
    onLog(`Stopping audio recording...`)
    const recorderState = await page.evaluate(() => {
      if (window.__audioRecorder) {
        const state = window.__audioRecorder.state
        const chunksCount = window.__audioChunks ? window.__audioChunks.length : 0
        console.log('[Export] Recorder state before stop:', state)
        console.log('[Export] Chunks collected:', chunksCount)
        if (state !== 'inactive') {
          window.__audioRecorder.stop()
        }
        return { state, chunksCount }
      }
      return null
    })

    onLog(`Recorder state: ${recorderState ? recorderState.state : 'null'}, chunks: ${recorderState ? recorderState.chunksCount : 0}`)

    // Wait for audio data to be ready (onstop handler completes)
    let audioData = null
    for (let attempt = 0; attempt < 50; attempt++) {
      await new Promise((r) => setTimeout(r, 100))
      const result = await page.evaluate(() => {
        return {
          hasAudioData: !!window.__audioData,
          dataLength: window.__audioData ? window.__audioData.length : 0
        }
      })
      if (result.hasAudioData && result.dataLength > 0) {
        audioData = await page.evaluate(() => window.__audioData)
        onLog(`Audio data ready after ${attempt + 1} attempts (${result.dataLength} bytes)`)
        break
      }
    }

    if (audioData && audioData.length > 0) {
      onLog(`✓ Audio captured: ${audioData.length} bytes`)
      audioPath = path.join(path.dirname(framesDir), `${topicId}-audio.webm`)
      fs.writeFileSync(audioPath, Buffer.from(audioData))
      onLog(`✓ Audio saved to: ${audioPath}`)
    } else {
      onLog(`⚠ No audio data captured - video will be silent`)
    }
  } else {
    onLog(`⚠ Audio recording not available - video will be silent`)
  }

  // ─────────────────────────────────────────────────────────────
  // PASS 2/2: Capture frames deterministically (seek each frame,
  // immune to screenshot latency)
  // ─────────────────────────────────────────────────────────────
  onLog(`═══ PASS 2/2: Capturing ${totalFrames} frames deterministically ═══`)
  onProgress({ phase: 'Capturing frames', progress: 15, message: 'Preparing...' })

  // Fresh reload so React state is completely reset from PASS 1
  onLog(`Reloading page for deterministic frame capture...`)
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 3000))

  // Wait for the timeline to be registered again
  await page.waitForFunction(
    () => window.__animationTimeline && typeof window.__animationTimeline.duration === 'function' && window.__animationTimeline.duration() > 0,
    { timeout: 30000 }
  )
  onLog(`✓ Timeline registered for frame capture`)

  onLog(`Hiding UI elements for frame capture...`)
  await hideUiElements()

  // Freeze the timeline and prepare deterministic seeking
  const DEBUG = process.env.DEBUG_PASS2 === '1'
  await page.evaluate((debug) => {
    const tl = window.__animationTimeline
    window.__capTl = tl
    if (tl) {
      tl.pause()
      tl.repeat(0)
      tl.repeatDelay(0)
      tl.timeScale(1.0)
      tl.totalTime(0, false)
    }
    if (debug) {
      // PROBES (debug only): callback/onUpdate counters on the captured timeline
      window.__cbFired = []
      window.__ouCount = 0
      if (tl) {
        const o = { v: 0 }
        tl.to(o, { v: 1, duration: Math.max(0.1, tl.duration()), onUpdate: () => { window.__ouCount++ } }, 0)
        tl.add(() => window.__cbFired.push('A@2'), 2.0)
        tl.add(() => window.__cbFired.push('B@4'), 4.0)
        tl.add(() => window.__cbFired.push('C@8'), 8.0)
      }
      window.__mutCount = 0
      window.__mutLast = ''
      const __mo = new MutationObserver((recs) => {
        window.__mutCount += recs.length
        const r = recs[0]
        window.__mutLast = r.target.nodeName + ':' + r.type + ':' + String(r.attributeName || '')
      })
      __mo.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true })
      const origFetch = window.fetch.bind(window)
      window.__fetchFail = 0
      window.fetch = async (...a) => {
        try { return await origFetch(...a) } catch (e) { window.__fetchFail++; throw e }
      }
    }
  }, DEBUG)

  // USER GESTURE SIMULATION: click Play then Pause.
  // This runs the real app path: unlocks audio, and forces PlayerShell +
  // Animation to fully re-render through React's event system. Without this,
  // seek-driven setState calls after reload may never commit to the DOM
  // (frames stay frozen at the intro state).
  await page.evaluate(() => {
    const btn = document.querySelector('.player-topbar .control-btn')
    if (btn) btn.click()
  })
  await new Promise((r) => setTimeout(r, 150))
  await page.evaluate(() => {
    const btn = document.querySelector('.player-topbar .control-btn')
    if (btn) btn.click()
    // Keep SFX silent during frame capture regardless of unlock side effects
    if (window.sfxLoader?.setEnabled) window.sfxLoader.setEnabled(false)
    if (window.sfxLoaderInstance?.setEnabled) window.sfxLoaderInstance.setEnabled(false)
  })
  await new Promise((r) => setTimeout(r, 150))

  let captureSession = null
  try {
    for (let i = 0; i < totalFrames; i++) {
      try {
        const timelineTime = (i / Math.max(1, totalFrames - 1)) * captureDuration
        await page.evaluate((time) => {
          const tl = window.__animationTimeline
          if (tl) {
            tl.pause()
            tl.repeat(0)
            // flushSync forces React 18 to commit the seek's setState calls to the DOM
            // synchronously. Without it, seek-driven commits are deferred after the
            // heavy PASS 1 playback and only land when a real input event forces a
            // flush — leaving every frame between those events frozen.
            if (window.__flushSync) {
              try {
                window.__flushSync(() => { tl.totalTime(time, false) })
              } catch (e) {
                tl.totalTime(time, false)
              }
            } else {
              tl.totalTime(time, false)
            }
          }
          return new Promise((resolve) => {
            // 1. setTimeout gives the renderer time to complete layout/paint
            // 2. Double requestAnimationFrame forces the compositor to draw the DOM
            setTimeout(() => {
              requestAnimationFrame(() => requestAnimationFrame(resolve))
            }, 60)
          })
        }, timelineTime)

        const framePath = path.join(framesDir, `frame_${String(i).padStart(5, '0')}.png`)
        // Rasterize the current DOM directly (fromSurface:false) instead of reading the
        // compositor's surface, which can return a stale cached frame after the heavy
        // PASS 1 playback (frames stay frozen between input events otherwise).
        if (!captureSession) {
          captureSession = await page.createCDPSession()
        }
        const cap = await captureSession.send('Page.captureScreenshot', { fromSurface: false, format: 'png' })
        fs.writeFileSync(framePath, Buffer.from(cap.data, 'base64'))

        // TEMP DEBUG: verify identity + DOM state + pixel hash per sampled frame
        if (process.env.DEBUG_PASS2 && i % 100 === 0) {
          const { createHash } = await import('crypto')
          const hash = createHash('md5').update(fs.readFileSync(framePath)).digest('hex').slice(0, 10)
          const st = await page.evaluate(() => {
            const canvases = [...document.querySelectorAll('.player-canvas')]
            const cx = Math.round(window.innerWidth / 2)
            const cy = Math.round(window.innerHeight / 2)
            const hit = document.elementFromPoint(cx, cy)
            const hitCanvasIdx = hit ? canvases.findIndex((c) => c.contains(hit)) : -1
            return {
              sameTl: window.__capTl === window.__animationTimeline,
              tlTime: +(window.__animationTimeline?.time() ?? -1).toFixed(2),
              nCanvases: canvases.length,
              canvasLens: canvases.map((c) => c.innerHTML.length),
              cbFired: (window.__cbFired || []).length,
              ouCount: window.__ouCount || 0,
              mutCount: window.__mutCount || 0,
              mutLast: (window.__mutLast || '').slice(0, 30),
              fetchFail: window.__fetchFail || 0,
              title: document.title.slice(0, 40),
              hitCanvasIdx,
              rootChildren: document.getElementById('root')?.children.length,
              shells: document.querySelectorAll('.player-shell').length
            }
          })
          let hashNoSurface = '(na)'
          try {
            const cdp = await page.createCDPSession()
            const res = await cdp.send('Page.captureScreenshot', { fromSurface: false, format: 'png' })
            hashNoSurface = createHash('md5').update(Buffer.from(res.data, 'base64')).digest('hex').slice(0, 10)
            await cdp.detach()
          } catch (e) {
            hashNoSurface = '(err)' + e.message.slice(0, 40)
          }
          onLog(`[DBG] f${i} t=${timelineTime.toFixed(1)} md5=${hash} noSurf=${hashNoSurface} ${JSON.stringify(st)}`)
        }

        const percent = 15 + Math.round((i / totalFrames) * 65)
        onProgress({
          phase: 'Capturing frames',
          progress: percent,
          message: `${i + 1} / ${totalFrames} frames`
        })

        // Log every 5 seconds worth of frames
        if ((i + 1) % (FPS * 5) === 0) {
          onLog(`Captured ${i + 1} / ${totalFrames} frames (${Math.round(((i + 1) / totalFrames) * 100)}%)`)
        }

        // Small delay to prevent Chrome resource exhaustion
        if (i > 0 && i % 50 === 0) {
          await new Promise((r) => setTimeout(r, 100))
        }
      } catch (frameErr) {
        onLog(`Warning: Frame ${i + 1} capture failed: ${frameErr.message}`)
        if (i < 10) {
          throw frameErr // Fail early if first few frames fail
        }
        // Continue on later frame failures
      }
    }
  } finally {
    if (captureSession) {
      try { await captureSession.detach() } catch (e) {}
    }
    await browser.close()
  }

  onLog(`Captured ${totalFrames} frames successfully.`)

  return { animationDuration, totalFrames, audioPath }
}

/**
 * Encode frames to MP4 via ffmpeg
 * @param {object} options - { framesDir, outputPath, duration, sfxEvents, volume, audioPath, onProgress, onLog }
 */
function encodeVideo({ framesDir, outputPath, duration, sfxEvents = [], volume = 75, audioPath = null, onProgress, onLog }) {
  return new Promise((resolve, reject) => {
    // Scale volume for ffmpeg (0-500% → 0-5.0 scale factor)
    const volumeScale = Math.max(0, Math.min(5.0, volume / 100))
    const sfxVolume = 0.85 * volumeScale
    const mixVolume = 1.0 * volumeScale
    
    const args = [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(framesDir, 'frame_%05d.png')
    ]

    // Prefer captured audio over SFX schedule
    if (audioPath && fs.existsSync(audioPath)) {
      onLog(`Using captured audio: ${audioPath}`)
      args.push('-i', audioPath)
      args.push(
        '-filter_complex', `[1:a]volume=${volumeScale}[aout]`,
        '-map', '0:v',
        '-map', '[aout]'
      )
    } else if (sfxEvents.length > 0) {
      // Fallback to SFX schedule mixing
      sfxEvents.forEach((event) => {
        args.push('-i', event.path)
      })

      const delayedInputs = sfxEvents.map((event, idx) => {
        const inputIndex = idx + 1
        const delayMs = Math.round(event.at * 1000)
        return `[${inputIndex}:a]adelay=${delayMs}|${delayMs},volume=${sfxVolume}[a${idx}]`
      })
      const mixInputs = ['[silence]', ...sfxEvents.map((_, idx) => `[a${idx}]`)].join('')
      const filter = [
        `anullsrc=channel_layout=stereo:sample_rate=44100:d=${duration}[silence]`,
        ...delayedInputs,
        `${mixInputs}amix=inputs=${sfxEvents.length + 1}:duration=first:dropout_transition=0,volume=${mixVolume}[aout]`
      ].join(';')

      args.push(
        '-filter_complex', filter,
        '-map', '0:v',
        '-map', '[aout]'
      )
    }

    args.push(
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'fast',
      '-crf', '18',
      ...((audioPath || sfxEvents.length > 0) ? ['-c:a', 'aac', '-b:a', '128k', '-shortest'] : []),
      '-movflags', '+faststart',
      outputPath
    )

    onLog(`Running ffmpeg to encode ${outputPath}...`)
    if (audioPath && fs.existsSync(audioPath)) {
      onLog(`Using browser-captured audio (volume: ${volume}%)`)
    } else if (sfxEvents.length > 0) {
      onLog(`Mixing ${sfxEvents.length} sound effects into video (fallback)...`)
    }
    const child = spawn(ffmpegBin, args)

    let ffmpegOutput = ''
    child.stderr.on('data', (data) => {
      ffmpegOutput += data.toString()
      
      // Parse time=HH:MM:SS.ss format
      const timeMatch = ffmpegOutput.match(/time=(\d+):(\d+):(\d+\.\d+)/)
      if (timeMatch) {
        const hours = parseInt(timeMatch[1])
        const minutes = parseInt(timeMatch[2])
        const seconds = parseFloat(timeMatch[3])
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        const percent = Math.min(100, Math.round(80 + (totalSeconds / duration) * 20))
        onProgress({
          phase: 'Encoding video',
          progress: percent,
          message: `${timeMatch[0]}`
        })
      }
    })

    child.on('close', (code) => {
      if (code === 0) {
        onLog(`Encoding complete. Output: ${outputPath}`)
        resolve()
      } else {
        onLog(`FFmpeg stderr output:\n${ffmpegOutput}`)
        reject(new Error(`ffmpeg exited with code ${code}`))
      }
    })

    child.on('error', (err) => {
      onLog(`FFmpeg error: ${err.message}`)
      reject(err)
    })
  })
}

/**
 * Export animation topic to MP4
 * @param {string} topicId - Topic ID
 * @param {object} options - { baseUrl, outDir, volume, speed, onProgress, onLog }
 */
export async function exportTopic(topicId, { baseUrl = 'http://localhost:5173', outDir, volume = 75, speed = 1.0, onProgress = () => {}, onLog = () => {} } = {}) {
  volume = Math.max(0, Math.min(500, Number(volume) || 75))
  speed = Math.max(0.5, Math.min(2.0, Number(speed) || 1.0))
  
  onLog(`=== Starting export: ${topicId} ===`)
  onLog(`Volume: ${volume}%, Speed: ${speed}x`)

  const exportDir = path.join(outDir, 'export')
  const framesDir = path.join(exportDir, 'frames')
  const videosDir = path.join(outDir, 'public', 'videos')
  const tempOutputPath = path.join(videosDir, `.${topicId}.tmp.mp4`)
  const finalOutputPath = path.join(videosDir, `${topicId}.mp4`)
  
  // Get SFX schedule (no duration scaling needed)
  const sfxEvents = getScaledSfxSchedule(topicId, outDir, volume, speed)

  // Ensure output directories exist
  fs.mkdirSync(videosDir, { recursive: true })
  onLog(`Sound effects: ${sfxEvents.length} scheduled`)

  try {
    // Phase 0: Copy audio assets
    const sourceAudioDir = path.join(ROOT, 'public', 'audio')
    const destAudioDir = path.join(outDir, 'public', 'audio')
    const audioFilesCopied = copyAudioAssets(sourceAudioDir, destAudioDir)
    onLog(`[Audio] Copied ${audioFilesCopied} audio files to export directory`)
    
    // Phase 1: Capture audio (pass 1) + frames (pass 2), auto-detect duration
    const { animationDuration, audioPath } = await captureFrames(topicId, {
      baseUrl,
      framesDir,
      onProgress,
      onLog
    })

    onLog(`Animation duration detected: ${animationDuration.toFixed(2)}s`)

    // Phase 2: Encode video
    await encodeVideo({
      framesDir,
      outputPath: tempOutputPath,
      duration: animationDuration,
      sfxEvents,
      volume,
      audioPath,
      onProgress,
      onLog
    })

    // Atomic rename: temp → final
    if (fs.existsSync(finalOutputPath)) {
      fs.unlinkSync(finalOutputPath)
    }
    fs.renameSync(tempOutputPath, finalOutputPath)

    // Clean up frames dir
    if (fs.existsSync(framesDir)) {
      fs.rmSync(framesDir, { recursive: true, force: true })
    }

    const stats = fs.statSync(finalOutputPath)
    onLog(`✅ SELESAI! Video: ${finalOutputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
    onProgress({
      phase: 'Complete',
      progress: 100,
      message: 'Export selesai'
    })

    return {
      success: true,
      videoPath: finalOutputPath,
      videoUrl: `/videos/${topicId}.mp4`,
      size: stats.size,
      exportedAt: new Date().toISOString()
    }
  } catch (err) {
    onLog(`❌ ERROR: ${err.message}`)
    // Clean up temp file on error
    if (fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath)
    }
    throw err
  }
}

/**
 * Check if video exists and get stats
 */
export function getVideoStats(topicId, outDir) {
  const videoPath = path.join(outDir, 'public', 'videos', `${topicId}.mp4`)
  if (fs.existsSync(videoPath)) {
    const stats = fs.statSync(videoPath)
    return {
      exists: true,
      videoPath,
      videoUrl: `/videos/${topicId}.mp4`,
      size: stats.size,
      exportedAt: stats.mtime.toISOString()
    }
  }
  return { exists: false }
}
