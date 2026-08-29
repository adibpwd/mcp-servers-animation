/**
 * export-parallel.mjs
 *
 * Multiprocess frame capture: PASS 1 audio (single Chrome, real-time),
 * lalu PASS 2 frame capture di-split ke N Chrome workers yang jalan paralel.
 *
 * Flow:
 *   detectDuration()   → 1 Chrome, baca window.__animationTimeline.duration()
 *   captureAudio()     → 1 Chrome, PASS 1 real-time playback → webm
 *   captureSegment()   → 1 Chrome per worker, seek tiap frame → PNG
 *   mergeSegments()    → rename semua PNG ke framesDir/
 *   encodeVideo()      → ffmpeg frames + audio → .mp4
 *   exportParallel()   → orchestrator, export interface publik
 */

import { spawn }       from 'child_process'
import path            from 'path'
import { fileURLToPath } from 'url'
import fs              from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const FPS       = 30

// ── ffmpeg binary ─────────────────────────────────────────────
let ffmpegBin = 'ffmpeg'
try {
  const staticFfmpeg = (await import('ffmpeg-static')).default
  if (staticFfmpeg && fs.existsSync(staticFfmpeg)) ffmpegBin = staticFfmpeg
} catch { /* fallback ke sistem ffmpeg */ }

// ── Puppeteer helper ──────────────────────────────────────────
async function launchBrowser(onLog) {
  let puppeteer, usingBundledChrome = false
  try {
    puppeteer = (await import('puppeteer')).default
    usingBundledChrome = true
  } catch {
    try { puppeteer = (await import('puppeteer-core')).default }
    catch { throw new Error('Puppeteer tidak ditemukan. Jalankan: npm install puppeteer') }
  }

  const launchOptions = {
    headless: true,
    protocolTimeout: 300000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  }

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
    const chromePath = possiblePaths.find(p => p && fs.existsSync(p))
    if (!chromePath) throw new Error('Chrome/Chromium tidak ditemukan. Set PUPPETEER_EXECUTABLE_PATH.')
    launchOptions.executablePath = chromePath
    onLog(`Using system Chrome: ${chromePath}`)
  } else {
    onLog('Using bundled Chrome dari puppeteer')
  }

  return puppeteer.launch(launchOptions)
}

async function openPage(browser, topicId, baseUrl, onLog) {
  const page = await browser.newPage()
  page.on('console', msg => {
    const t = msg.text()
    if (t.includes('[Export]') || t.includes('[SFX]')) onLog(`[Browser] ${t}`)
  })
  await page.setViewport({ width: 820, height: 1340, deviceScaleFactor: 1.5 })
  const url = `${baseUrl}/preview/${topicId}`
  onLog(`Navigating → ${url}`)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await new Promise(r => setTimeout(r, 3000))
  return page
}

const hideUi = (page) => page.evaluate(() => {
  ;['.player-topbar', '.timeline-progress-bar', '.progress-indicator'].forEach(sel => {
    const el = document.querySelector(sel)
    if (el) el.style.display = 'none'
  })
  const canvas = document.querySelector('.player-canvas')
  if (canvas) { canvas.style.width = '100vw'; canvas.style.height = '100vh' }
})

// ── Step 1: Detect Duration ───────────────────────────────────
export async function detectDuration(topicId, baseUrl, onLog) {
  onLog('=== Step 1: Detect Duration ===')
  const browser = await launchBrowser(onLog)
  try {
    const page = await openPage(browser, topicId, baseUrl, onLog)

    const dur = await page.evaluate(() => {
      const tl = window.__animationTimeline
      if (!tl) return null
      const orig = tl.timeScale()
      tl.timeScale(1.0)
      const d = tl.duration()
      tl.timeScale(orig)
      return d
    })

    if (!dur || !isFinite(dur) || dur < 5 || dur > 300) {
      throw new Error(`Durasi animasi tidak valid: ${dur}`)
    }
    onLog(`✓ Durasi terdeteksi: ${dur.toFixed(2)}s`)
    return dur
  } finally {
    await browser.close()
  }
}

// ── Step 2: Capture Audio (PASS 1, real-time) ─────────────────
export async function captureAudio(topicId, baseUrl, outDir, animDuration, onProgress, onLog) {
  onLog('=== Step 2: Capture Audio (PASS 1 real-time) ===')
  const browser = await launchBrowser(onLog)
  try {
    const page = await openPage(browser, topicId, baseUrl, onLog)
    await hideUi(page)

    // URUTAN KRITIS — jangan diubah:
    //
    // 1. initExportMode() DULU sebelum apapun → AudioContext dibuat
    // 2. clearCache() → hapus semua Audio() objects lama yang tidak terhubung
    //    ke AudioContext baru (kalau cache tidak dihapus, load() akan return
    //    Audio lama yang tidak di-route ke MediaStreamDestination, sehingga
    //    suara tidak ter-rekam walau AudioContext sudah siap)
    // 3. BARU click Play → unlock audioUnlocked React state
    //    (click ini memicu sfxLoader.setEnabled, tapi cache sudah bersih
    //     sehingga Audio() berikutnya akan di-create + connect ke AudioContext)
    // 4. pause + reset timeline ke t=0
    // 5. recorder.start() + tl.play(0) ATOMIK dalam 1 evaluate
    //    (pisah jadi 2 evaluate = IPC round-trip gap ~100-200ms antara
    //     "rekam mulai" dan "animasi mulai" → semua SFX offset dari awal)

    // Step 1+2: init export mode + bersihkan cache Audio lama
    await page.evaluate(() => {
      const loader = window.sfxLoader || window.sfxLoaderInstance
      if (loader) {
        loader.clearCache()      // hapus Audio() objects yang belum terhubung AudioContext
        loader.initExportMode()  // buat AudioContext + MediaStreamDestination baru
      }
    })
    await new Promise(r => setTimeout(r, 300)) // beri waktu AudioContext settle

    // Step 3: unlock audio SECARA SILENT — jangan klik tombol Play, karena
    // itu juga men-trigger setIsPaused(false) → GSAP timeline sungguhan
    // jalan sesaat, dan SFX yang ke-trigger saat itu tidak berhenti walau
    // timeline di-pause lagi (Audio/WebAudio node independen dari GSAP),
    // sehingga bocor ke rekaman audio real-time PASS 1.
    await page.evaluate(async () => {
      if (window.__forceUnlockAudio) {
        await window.__forceUnlockAudio()
      } else {
        const btn = document.querySelector('.player-topbar .control-btn')
        if (btn) btn.click()
      }
    })
    await new Promise(r => setTimeout(r, 200))

    // Step 4: freeze timeline, reset ke t=0
    await page.evaluate(() => {
      const tl = window.__animationTimeline
      if (tl) { tl.pause(); tl.totalTime(0, false) }
    })
    await new Promise(r => setTimeout(r, 100))

    // ATOMIK: recorder.start() + tl.play(0) dalam 1 evaluate, dan catat
    // AudioContext.currentTime saat keduanya dipanggil supaya bisa trim/pad audio
    // secara presisi di ffmpeg agar frame 0 video = sampel 0 audio.
    const audioStarted = await page.evaluate(() => {
      if (!window.__audioStream) return false
      try {
        const ac = window.sfxLoader?.audioContext
        if (ac?.state === 'suspended') ac.resume()
        const tracks = window.__audioStream.getAudioTracks()
        if (!tracks.length) return false
        const recorder = new MediaRecorder(window.__audioStream, { mimeType: 'audio/webm;codecs=opus' })
        const chunks = []
        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/webm' })
          const ab   = await blob.arrayBuffer()
          window.__audioData = Array.from(new Uint8Array(ab))
        }
        window.__audioRecorder = recorder
        window.__audioChunks   = chunks

        // Catat waktu tepat sebelum start untuk menghitung lead-in silence
        const t0 = ac ? ac.currentTime : 0
        recorder.start(1000)
        const tRecorderStart = ac ? ac.currentTime : 0

        // Play timeline SEGERA — dalam evaluate yang sama
        const tl = window.__animationTimeline
        if (tl) { tl.timeScale(1.0); tl.play(0) }
        const tPlay = ac ? ac.currentTime : 0

        // Simpan offset: berapa detik audio ter-rekam sebelum animasi mulai
        // (biasanya ~0ms karena sudah 1 evaluate, tapi jaga-jaga)
        window.__audioLeadIn = tPlay - tRecorderStart
        console.log('[SFX] recorder.start + tl.play atomik, lead-in:', window.__audioLeadIn.toFixed(4), 's')
        return true
      } catch (e) { console.error('[SFX] atomik gagal:', e); return false }
    })

    if (!audioStarted) {
      onLog('⚠ Audio stream tidak tersedia — video akan silent')
      return null
    }
    onLog('✓ Audio recording started + timeline play (atomik)')

    // Poll sampai selesai
    const recStart   = Date.now()
    const timeoutMs  = animDuration * 1000 + 15000
    let lastPct = -100
    while (true) {
      await new Promise(r => setTimeout(r, 500))
      const st = await page.evaluate(() => {
        const tl = window.__animationTimeline
        return { time: tl?.time() ?? 0, paused: tl?.paused() ?? true }
      })
      const pct = Math.floor((st.time / animDuration) * 100)
      if (pct >= lastPct + 10 && pct < 100) {
        lastPct = pct
        onProgress({ phase: 'Recording audio', progress: Math.min(14, Math.round(pct * 0.15)),
                     message: `${st.time.toFixed(1)}s / ${animDuration.toFixed(1)}s` })
        onLog(`Audio: ${pct}% (${st.time.toFixed(1)}s)`)
      }
      if (st.time >= animDuration - 0.05 || st.paused || Date.now() - recStart > timeoutMs) break
    }

    await page.evaluate(() => { if (window.__animationTimeline) window.__animationTimeline.pause() })
    await new Promise(r => setTimeout(r, 1000))

    // Stop recorder
    await page.evaluate(() => {
      if (window.__audioRecorder?.state !== 'inactive') window.__audioRecorder.stop()
    })

    // Tunggu audioData
    let audioData = null
    for (let i = 0; i < 50; i++) {
      await new Promise(r => setTimeout(r, 100))
      const res = await page.evaluate(() => ({
        has: !!window.__audioData, len: window.__audioData?.length ?? 0
      }))
      if (res.has && res.len > 0) { audioData = await page.evaluate(() => window.__audioData); break }
    }

    if (!audioData?.length) { onLog('⚠ Tidak ada audio data — video silent'); return null }

    // Ambil leadIn (berapa detik rekaman audio sebelum animasi mulai)
    const leadIn = await page.evaluate(() => window.__audioLeadIn || 0)
    onLog(`✓ Audio lead-in: ${(leadIn * 1000).toFixed(1)}ms`)

    const audioPath = path.join(outDir, 'export', `${topicId}-audio.webm`)
    fs.mkdirSync(path.dirname(audioPath), { recursive: true })
    fs.writeFileSync(audioPath, Buffer.from(audioData))
    onLog(`✓ Audio saved: ${audioPath} (${audioData.length} bytes)`)
    // Return object dengan leadIn supaya encodeVideo bisa trim silence di awal
    return { audioPath, leadIn }
  } finally {
    await browser.close()
  }
}

// ── Step 3: Capture Segment (1 worker = 1 Chrome) ────────────
export async function captureSegment({
  workerId, topicId, baseUrl,
  startFrame, endFrame, totalFrames, animDuration,
  segDir, onWorkerProgress, onLog
}) {
  const workerTag = `[W${workerId}]`
  onLog(`${workerTag} Starting: frames ${startFrame}–${endFrame}`)
  fs.mkdirSync(segDir, { recursive: true })

  const browser = await launchBrowser(msg => onLog(`${workerTag} ${msg}`))
  try {
    const page = await openPage(browser, topicId, baseUrl, msg => onLog(`${workerTag} ${msg}`))

    await page.waitForFunction(
      () => window.__animationTimeline && typeof window.__animationTimeline.duration === 'function'
            && window.__animationTimeline.duration() > 0,
      { timeout: 30000 }
    )

    await hideUi(page)

    // Freeze timeline
    await page.evaluate(() => {
      const tl = window.__animationTimeline
      if (tl) { tl.pause(); tl.repeat(0); tl.repeatDelay(0); tl.timeScale(1.0); tl.totalTime(0, false) }
    })

    // User gesture unlock (agar React flush bekerja)
    await page.evaluate(() => {
      const btn = document.querySelector('.player-topbar .control-btn')
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 150))
    await page.evaluate(() => {
      const btn = document.querySelector('.player-topbar .control-btn')
      if (btn) btn.click()
      if (window.sfxLoader?.setEnabled)         window.sfxLoader.setEnabled(false)
      if (window.sfxLoaderInstance?.setEnabled)  window.sfxLoaderInstance.setEnabled(false)
    })
    await new Promise(r => setTimeout(r, 150))

    let cdpSession = null
    const frameCount = endFrame - startFrame + 1

    for (let i = startFrame; i <= endFrame; i++) {
      const t = (i / Math.max(1, totalFrames - 1)) * animDuration

      await page.evaluate((time) => {
        const tl = window.__animationTimeline
        if (!tl) return
        tl.pause(); tl.repeat(0)
        if (window.__flushSync) {
          try { window.__flushSync(() => tl.totalTime(time, false)) }
          catch { tl.totalTime(time, false) }
        } else {
          tl.totalTime(time, false)
        }
        return new Promise(resolve => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(resolve)), 60))
      }, t)

      if (!cdpSession) cdpSession = await page.createCDPSession()
      const cap = await cdpSession.send('Page.captureScreenshot', { fromSurface: false, format: 'png' })

      // Nama file pakai global frame index supaya merge tinggal sort by name
      const frameName = path.join(segDir, `frame_${String(i).padStart(5, '0')}.png`)
      fs.writeFileSync(frameName, Buffer.from(cap.data, 'base64'))

      // Progress per worker
      const done = i - startFrame + 1
      onWorkerProgress(workerId, done, frameCount)

      if (done > 0 && done % (FPS * 5) === 0) {
        onLog(`${workerTag} ${done}/${frameCount} frames (${Math.round(done/frameCount*100)}%)`)
      }
      if (done % 50 === 0) await new Promise(r => setTimeout(r, 50))
    }

    if (cdpSession) { try { await cdpSession.detach() } catch {} }
    onLog(`${workerTag} ✓ Done: ${frameCount} frames`)
  } finally {
    await browser.close()
  }
}

// ── Step 4: Merge Segments ────────────────────────────────────
export function mergeSegments(segDirs, framesDir) {
  fs.mkdirSync(framesDir, { recursive: true })
  for (const segDir of segDirs) {
    if (!fs.existsSync(segDir)) continue
    for (const file of fs.readdirSync(segDir)) {
      if (!file.endsWith('.png')) continue
      fs.renameSync(path.join(segDir, file), path.join(framesDir, file))
    }
    fs.rmdirSync(segDir)
  }
}

// ── Step 5: Encode Video ──────────────────────────────────────
export function encodeVideo({ framesDir, outputPath, duration, audioPath, audioLeadIn = 0, volume = 75, onProgress, onLog }) {
  return new Promise((resolve, reject) => {
    const volumeScale = Math.max(0, Math.min(5.0, volume / 100))
    const args = [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(framesDir, 'frame_%05d.png')
    ]

    if (audioPath && fs.existsSync(audioPath)) {
      onLog(`Audio: ${audioPath} (lead-in trim: ${(audioLeadIn * 1000).toFixed(1)}ms)`)
      // Trim silence di awal audio (lead-in = detik audio yang ter-rekam sebelum tl.play(0))
      // -ss pada input audio: ffmpeg mulai decode dari audioLeadIn detik
      if (audioLeadIn > 0.005) {
        args.push('-ss', audioLeadIn.toFixed(4), '-i', audioPath)
      } else {
        args.push('-i', audioPath)
      }
      args.push(
        '-filter_complex', `[1:a]volume=${volumeScale}[aout]`,
        '-map', '0:v', '-map', '[aout]'
      )
    }

    args.push(
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
      '-preset', 'fast', '-crf', '18',
      ...(audioPath && fs.existsSync(audioPath)
        ? ['-c:a', 'aac', '-b:a', '128k', '-shortest'] : []),
      '-movflags', '+faststart',
      outputPath
    )

    onLog(`ffmpeg encoding → ${outputPath}`)
    const child = spawn(ffmpegBin, args)
    let stderr = ''
    child.stderr.on('data', d => {
      stderr += d.toString()
      const m = stderr.match(/time=(\d+):(\d+):(\d+\.\d+)/)
      if (m) {
        const secs = parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseFloat(m[3])
        onProgress({ phase: 'Encoding video', progress: Math.min(99, Math.round(80 + (secs / duration) * 19)),
                     message: `time=${m[0]}` })
      }
    })
    child.on('close', code => {
      if (code === 0) { onLog('✓ Encoding selesai'); resolve() }
      else { onLog(`ffmpeg stderr:\n${stderr}`); reject(new Error(`ffmpeg exit code ${code}`)) }
    })
    child.on('error', err => { onLog(`ffmpeg error: ${err.message}`); reject(err) })
  })
}

// ── Main Orchestrator ─────────────────────────────────────────
/**
 * @param {string} topicId
 * @param {object} opts
 * @param {string}   opts.baseUrl      default 'http://localhost:8081'
 * @param {string}   opts.outDir       root project dir
 * @param {number}   opts.workers      jumlah Chrome workers untuk frame capture (default 4)
 * @param {number}   opts.volume       0-500 (default 75)
 * @param {number}   opts.speed        0.5-2.0 (default 1.0)
 * @param {Function} opts.onProgress   ({ phase, progress, message, workers? })
 * @param {Function} opts.onLog        (message: string)
 */
export async function exportParallel(topicId, {
  baseUrl   = 'http://localhost:8081',
  outDir    = ROOT,
  workers   = 4,
  volume    = 75,
  speed     = 1.0,
  onProgress = () => {},
  onLog      = () => {}
} = {}) {
  volume  = Math.max(0, Math.min(500, Number(volume) || 75))
  speed   = Math.max(0.5, Math.min(2.0, Number(speed) || 1.0))
  workers = Math.max(1, Math.min(16, Number(workers) || 4))

  onLog(`=== exportParallel: ${topicId} | workers=${workers} | vol=${volume}% | speed=${speed}x ===`)

  const exportDir   = path.join(outDir, 'export')
  const framesDir   = path.join(exportDir, 'frames', topicId)
  const videosDir   = path.join(outDir, 'public', 'videos')
  const tmpOutput   = path.join(videosDir, `.${topicId}.tmp.mp4`)
  const finalOutput = path.join(videosDir, `${topicId}.mp4`)

  fs.mkdirSync(videosDir,  { recursive: true })
  fs.mkdirSync(exportDir,  { recursive: true })

  // Bersihkan frames lama
  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true })
  fs.mkdirSync(framesDir, { recursive: true })

  try {
    // ── Step 1: Detect duration ──────────────────────────────
    onProgress({ phase: 'Detecting duration', progress: 1, message: '' })
    const animDuration = await detectDuration(topicId, baseUrl, onLog)
    const totalFrames  = Math.round(FPS * animDuration)
    onLog(`Total frames: ${totalFrames} @ ${FPS}fps`)

    // ── Step 2: Audio (PASS 1) ───────────────────────────────
    onProgress({ phase: 'Recording audio', progress: 5, message: '' })
    const audioResult = await captureAudio(topicId, baseUrl, outDir, animDuration, onProgress, onLog)
    const audioPath  = audioResult?.audioPath  ?? null
    const audioLeadIn = audioResult?.leadIn    ?? 0

    // ── Step 3: Parallel frame capture (PASS 2) ──────────────
    onLog(`=== Step 3: Parallel Frame Capture (${workers} workers) ===`)
    onProgress({ phase: 'Capturing frames (parallel)', progress: 15, message: `0 / ${totalFrames}` })

    // Bagi frame range ke tiap worker
    const framesPerWorker = Math.ceil(totalFrames / workers)
    const workerRanges = Array.from({ length: workers }, (_, wid) => {
      const startFrame = wid * framesPerWorker
      const endFrame   = Math.min(startFrame + framesPerWorker - 1, totalFrames - 1)
      return { workerId: wid, startFrame, endFrame }
    }).filter(w => w.startFrame <= totalFrames - 1)

    // Per-worker progress tracker
    const workerState = workerRanges.map(w => ({
      id: w.workerId, total: w.endFrame - w.startFrame + 1, done: 0, status: 'running'
    }))

    const onWorkerProgress = (wid, done, total) => {
      workerState[wid].done   = done
      workerState[wid].status = done >= total ? 'done' : 'running'

      const totalDone = workerState.reduce((s, w) => s + w.done, 0)
      const pct       = Math.round(15 + (totalDone / totalFrames) * 65)
      onProgress({
        phase: 'Capturing frames (parallel)',
        progress: pct,
        message: `${totalDone} / ${totalFrames} frames`,
        workers: workerState.map(w => ({ ...w }))
      })
    }

    const segDirs = workerRanges.map(w => path.join(exportDir, `seg_${topicId}_${w.workerId}`))

    // Launch semua workers paralel
    const workerPromises = workerRanges.map((w, idx) =>
      captureSegment({
        workerId:     w.workerId,
        topicId,
        baseUrl,
        startFrame:   w.startFrame,
        endFrame:     w.endFrame,
        totalFrames,
        animDuration,
        segDir:       segDirs[idx],
        onWorkerProgress,
        onLog
      })
    )

    // Tunggu semua — kalau ada yang gagal, abort semua
    const results = await Promise.allSettled(workerPromises)
    const failed  = results.filter(r => r.status === 'rejected')
    if (failed.length) {
      // Cleanup seg dirs
      segDirs.forEach(d => { try { fs.rmSync(d, { recursive: true, force: true }) } catch {} })
      throw new Error(`${failed.length} worker gagal: ${failed.map(f => f.reason?.message).join('; ')}`)
    }

    onLog(`✓ Semua ${workers} workers selesai`)

    // ── Step 4: Merge segments ───────────────────────────────
    onLog('=== Step 4: Merge Segments ===')
    onProgress({ phase: 'Merging frames', progress: 81, message: '' })
    mergeSegments(segDirs, framesDir)

    // Verify frame count
    const frameFiles = fs.readdirSync(framesDir).filter(f => f.endsWith('.png'))
    onLog(`✓ Merged ${frameFiles.length} frames (expected ${totalFrames})`)

    // ── Step 5: Encode video ─────────────────────────────────
    onProgress({ phase: 'Encoding video', progress: 82, message: '' })
    await encodeVideo({ framesDir, outputPath: tmpOutput, duration: animDuration, audioPath, audioLeadIn, volume, onProgress, onLog })

    // Atomic rename
    if (fs.existsSync(finalOutput)) fs.unlinkSync(finalOutput)
    fs.renameSync(tmpOutput, finalOutput)

    // Cleanup frames
    fs.rmSync(framesDir, { recursive: true, force: true })

    const stats = fs.statSync(finalOutput)
    onLog(`✅ SELESAI! ${finalOutput} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
    onProgress({ phase: 'Complete', progress: 100, message: 'Export selesai' })

    return {
      success: true,
      videoPath: finalOutput,
      videoUrl: `/videos/${topicId}.mp4`,
      size: stats.size,
      exportedAt: new Date().toISOString()
    }
  } catch (err) {
    onLog(`❌ ERROR: ${err.message}`)
    if (fs.existsSync(tmpOutput)) try { fs.unlinkSync(tmpOutput) } catch {}
    throw err
  }
}

// ── Video stats helper (sama seperti export-lib.js) ──────────
export function getVideoStats(topicId, outDir) {
  const videoPath = path.join(outDir, 'public', 'videos', `${topicId}.mp4`)
  if (fs.existsSync(videoPath)) {
    const stats = fs.statSync(videoPath)
    return { exists: true, videoPath, videoUrl: `/videos/${topicId}.mp4`,
             size: stats.size, exportedAt: stats.mtime.toISOString() }
  }
  return { exists: false }
}
