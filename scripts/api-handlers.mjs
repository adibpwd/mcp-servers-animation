/**
 * api-handlers.mjs
 * 
 * Centralized module for ALL API endpoint handlers.
 * Used by:
 *   - vite-plugin-export.js (dev server middleware)
 *   - export-server.mjs (fallback/standalone)
 * 
 * Handles:
 *   - Export endpoints (/api/export*, /api/exportp*)
 *   - Content management (/api/content*)
 *   - Icon generation (/api/icons/*)
 *   - Health check (/api/health)
 */

import multer from 'multer'
import sharp from 'sharp'
import { exportTopic, getVideoStats } from './export-lib.js'
import { exportParallel, getVideoStats as getVideoStatsParallel } from './export-parallel.mjs'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ═══════════════════════════════════════════════════════════════════════════
// PATH RESOLUTION — Project Root
// ═══════════════════════════════════════════════════════════════════════════

const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '..')
const CONTENT_DB_PATH = path.join(__dirname, 'content-db.json')

// ═══════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

// Global export job state
let exportJob = {
  status: 'idle',
  topicId: null,
  progress: 0,
  phase: '',
  message: '',
  logs: [],
  error: null,
  exportedAt: null
}

// Export history (in-memory)
let exportHistory = []

// Parallel export jobs per topicId
const parallelJobs = new Map()

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS: Database I/O
// ═══════════════════════════════════════════════════════════════════════════

function readContentDb() {
  try {
    const raw = fs.readFileSync(CONTENT_DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('[ContentDB] Failed to read:', err.message)
    return { items: [] }
  }
}

function writeContentDb(db) {
  try {
    fs.writeFileSync(CONTENT_DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('[ContentDB] Failed to write:', err.message)
    return false
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS: Parallel Export
// ═══════════════════════════════════════════════════════════════════════════

function makeParallelJob(topicId, workers, volume, speed) {
  return {
    status: 'running', topicId, workers,
    progress: 0, phase: 'Starting...', message: '',
    logs: [], error: null, exportedAt: null,
    startedAt: new Date().toISOString(),
    workerStates: []
  }
}

async function startParallelExport(topicId, workers, volume, speed) {
  const startTime = Date.now()
  const job = makeParallelJob(topicId, workers, volume, speed)
  parallelJobs.set(topicId, job)

  console.log(`[Parallel] ▶ ${topicId} | workers=${workers} vol=${volume}% speed=${speed}x`)
  try {
    await exportParallel(topicId, {
      baseUrl: 'http://localhost:5173',
      outDir: PROJECT_ROOT,
      workers,
      volume,
      speed,
      onProgress: (status) => {
        job.progress = status.progress
        job.phase    = status.phase
        job.message  = status.message
        if (status.workers) job.workerStates = status.workers
      },
      onLog: (msg) => {
        job.logs.push(msg)
        console.log(`[Parallel ${topicId}] ${msg}`)
      }
    })

    const vs = getVideoStatsParallel(topicId, PROJECT_ROOT)
    job.status     = 'done'
    job.progress   = 100
    job.exportedAt = vs.exportedAt

    exportHistory.unshift({
      topicId, status: 'done', progress: 100, error: null,
      exportedAt: vs.exportedAt, videoSize: vs.size,
      duration: Math.round((Date.now() - startTime) / 1000),
      mode: 'parallel', workers
    })
    console.log(`[Parallel] ✅ Done ${topicId} in ${Math.round((Date.now()-startTime)/1000)}s`)
  } catch (err) {
    job.status = 'error'
    job.error  = err.message
    console.error(`[Parallel] ❌ Error ${topicId}:`, err.message)
    exportHistory.unshift({
      topicId, status: 'error', progress: job.progress,
      error: err.message, exportedAt: null, videoSize: null,
      duration: Math.round((Date.now() - startTime) / 1000),
      mode: 'parallel', workers
    })
  }
}

async function startExport(topicId, volume = 75, speed = 1.0) {
  const startTime = Date.now()
  
  exportJob = {
    status: 'running',
    topicId,
    progress: 0,
    phase: 'Starting...',
    message: '',
    logs: [],
    error: null,
    exportedAt: null,
    volume,
    speed
  }

  try {
    await exportTopic(topicId, {
      baseUrl: 'http://localhost:5173',
      outDir: PROJECT_ROOT,
      volume,
      speed,
      onProgress: (status) => {
        exportJob.progress = status.progress
        exportJob.phase = status.phase
        exportJob.message = status.message
      },
      onLog: (message) => {
        exportJob.logs.push(message)
        console.log(`[Export ${topicId}] ${message}`)
      }
    })

    const videoStats = getVideoStats(topicId, PROJECT_ROOT)
    const duration = Math.round((Date.now() - startTime) / 1000)
    
    exportJob.status = 'done'
    exportJob.progress = 100
    exportJob.exportedAt = videoStats.exportedAt

    exportHistory.unshift({
      topicId,
      status: 'done',
      progress: 100,
      error: null,
      exportedAt: videoStats.exportedAt,
      videoSize: videoStats.size,
      duration
    })

  } catch (err) {
    const duration = Math.round((Date.now() - startTime) / 1000)
    
    exportJob.status = 'error'
    exportJob.error = err.message
    console.error(`[Export ${topicId}] ERROR:`, err.message)

    exportHistory.unshift({
      topicId,
      status: 'error',
      progress: exportJob.progress,
      error: err.message,
      exportedAt: null,
      videoSize: null,
      duration
    })
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export const handlers = {
  
  // ─ Single Export ─
  async postExport(req, res) {
    const { topicId } = req.params
    const volume = Math.max(0, Math.min(500, Number(req.body?.volume) || 75))
    const speed = Math.max(0.5, Math.min(2.0, Number(req.body?.speed) || 1.0))

    if (exportJob.status === 'running') {
      return res.status(409).json({
        ok: false,
        error: `Export sedang berjalan untuk topik: ${exportJob.topicId}`
      })
    }

    startExport(topicId, volume, speed)

    res.status(202).json({
      ok: true,
      status: 'started',
      topicId,
      volume,
      speed
    })
  },

  // ─ Export Status ─
  getExportStatus(req, res) {
    const topicId = req.query.topicId
    let videoStats = null

    if (topicId) {
      videoStats = getVideoStats(topicId, PROJECT_ROOT)
    }

    res.json({
      status: exportJob.status,
      topicId: exportJob.topicId,
      progress: exportJob.progress,
      phase: exportJob.phase,
      message: exportJob.message,
      logs: exportJob.logs.slice(-20),
      error: exportJob.error,
      duration: exportJob.duration,
      videoReady: videoStats?.exists || false,
      videoUrl: videoStats?.videoUrl || null,
      videoSize: videoStats?.size || null,
      exportedAt: videoStats?.exportedAt || null
    })
  },

  // ─ Export History ─
  getExportHistory(req, res) {
    res.json({
      history: exportHistory.map(entry => ({
        topicId: entry.topicId,
        status: entry.status,
        progress: entry.progress,
        error: entry.error,
        exportedAt: entry.exportedAt,
        videoSize: entry.videoSize,
        duration: entry.duration
      }))
    })
  },

  // ─ Delete History Entry ─
  deleteExportHistory(req, res) {
    const { topicId } = req.params
    exportHistory = exportHistory.filter(e => e.topicId !== topicId)
    res.json({ ok: true })
  },

  // ─ Parallel Export ─
  async postExportParallel(req, res) {
    const { topicId } = req.params
    const workers = Math.max(1, Math.min(16, Number(req.body?.workers) || 4))
    const volume  = Math.max(0, Math.min(500, Number(req.body?.volume) || 75))
    const speed   = Math.max(0.5, Math.min(2.0, Number(req.body?.speed) || 1.0))

    const existing = parallelJobs.get(topicId)
    if (existing?.status === 'running') {
      return res.status(409).json({ 
        ok: false, 
        error: `Parallel export sudah berjalan untuk: ${topicId}` 
      })
    }

    startParallelExport(topicId, workers, volume, speed)
    res.status(202).json({ 
      ok: true, 
      status: 'started', 
      topicId, 
      workers, 
      volume, 
      speed, 
      mode: 'parallel' 
    })
  },

  // ─ Parallel Export Status ─
  getExportParallelStatus(req, res) {
    const { topicId } = req.query
    if (!topicId) {
      const all = []
      for (const job of parallelJobs.values()) {
        const vs = getVideoStatsParallel(job.topicId, PROJECT_ROOT)
        all.push({ 
          ...job, 
          logs: job.logs.slice(-10), 
          videoReady: vs?.exists || false,
          videoUrl: vs?.videoUrl || null, 
          videoSize: vs?.size || null 
        })
      }
      return res.json({ jobs: all })
    }

    const job = parallelJobs.get(topicId)
    const vs  = getVideoStatsParallel(topicId, PROJECT_ROOT)
    if (!job) {
      return res.json({ 
        status: 'idle', 
        topicId, 
        videoReady: vs?.exists || false,
        videoUrl: vs?.videoUrl || null, 
        videoSize: vs?.size || null 
      })
    }
    res.json({
      status: job.status, 
      topicId: job.topicId, 
      workers: job.workers,
      progress: job.progress, 
      phase: job.phase, 
      message: job.message,
      logs: job.logs.slice(-20), 
      error: job.error, 
      startedAt: job.startedAt,
      workerStates: job.workerStates,
      videoReady: vs?.exists || false, 
      videoUrl: vs?.videoUrl || null, 
      videoSize: vs?.size || null
    })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENT MANAGEMENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─ Get all content ─
  getContent(req, res) {
    const db = readContentDb()
    const sorted = [...db.items].sort((a, b) => a.priority - b.priority)
    res.json({ ok: true, items: sorted })
  },

  // ─ Get single content ─
  getContentById(req, res) {
    const { id } = req.params
    const db = readContentDb()
    const item = db.items.find(i => i.id === id)

    if (!item) {
      return res.status(404).json({ ok: false, error: `Content '${id}' not found` })
    }

    res.json({ ok: true, item })
  },

  // ─ Update content ─
  postContentById(req, res) {
    const { id } = req.params
    const { status, priority } = req.body

    const VALID_STATUSES = ['draft', 'ready', 'posted']

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ ok: false, error: `Invalid status: ${status}` })
    }
    if (priority !== undefined && (typeof priority !== 'number' || priority < 1 || priority > 100)) {
      return res.status(400).json({ ok: false, error: `Invalid priority: must be number 1-100` })
    }

    const db = readContentDb()
    const idx = db.items.findIndex(i => i.id === id)

    if (idx === -1) {
      return res.status(404).json({ ok: false, error: `Content '${id}' not found` })
    }

    if (status !== undefined) db.items[idx].status = status
    if (priority !== undefined) db.items[idx].priority = Math.max(1, Math.min(100, priority))

    const saved = writeContentDb(db)

    if (!saved) {
      return res.status(500).json({ ok: false, error: 'Failed to save changes' })
    }

    console.log(`[ContentDB] Updated '${id}':`, { status, priority })
    res.json({ ok: true, item: db.items[idx] })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ICON GENERATION HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─ Get all topic icons metadata (CRITICAL!) ─
  getIconsTopics(req, res) {
    try {
      const contentRoot = path.resolve(PROJECT_ROOT, 'src/content')
      let topics = []

      if (fs.existsSync(contentRoot)) {
        const topicDirs = fs.readdirSync(contentRoot, { withFileTypes: true })
          .filter(d => d.isDirectory())
          .map(d => d.name)

        for (const topicId of topicDirs) {
          const iconsFile = path.join(contentRoot, topicId, 'icons', 'icons.json')
          if (!fs.existsSync(iconsFile)) continue

          try {
            const cfg = JSON.parse(fs.readFileSync(iconsFile, 'utf-8'))
            const batches = cfg.batches

            if (Array.isArray(batches) && batches.length > 0) {
              const batchSummaries = batches.map(b => ({
                batchId: b.batch_id,
                name: b.name,
                rows: b.rows,
                cols: b.cols,
                iconCount: Array.isArray(b.icons) ? b.icons.length : 0
              }))
              const iconCount = batchSummaries.reduce((sum, b) => sum + b.iconCount, 0)
              topics.push({
                id: topicId,
                title: cfg.title || cfg.name || topicId,
                description: cfg.description || '',
                isMultiBatch: true,
                iconCount,
                batches: batchSummaries
              })
            } else {
              const icons = Array.isArray(cfg.icons) ? cfg.icons : []
              topics.push({
                id: topicId,
                title: cfg.title || cfg.name || topicId,
                description: cfg.description || '',
                isMultiBatch: false,
                iconCount: icons.length,
                rows: cfg.generation?.rows,
                cols: cfg.generation?.cols
              })
            }
          } catch (err) {
            console.error(`[icons/topics] Skip ${topicId}:`, err.message)
          }
        }
      }

      topics.sort((a, b) => a.id.localeCompare(b.id))
      res.json({ topics })
    } catch (error) {
      console.error('[icons/topics] Error:', error)
      res.status(500).json({ ok: false, error: error.message })
    }
  },

  // ─ Get icons metadata ─
  getIconsMetadata(req, res) {
    try {
      const topicId = req.query.topicId
      const batchId = req.query.batchId
      
      if (!topicId) {
        return res.status(400).json({ ok: false, error: 'Missing topicId parameter' })
      }
      
      const metadataPath = path.resolve(PROJECT_ROOT, `src/content/${topicId}/icons/icons.json`)
      
      if (!fs.existsSync(metadataPath)) {
        return res.status(404).json({ ok: false, error: `icons.json not found for topic: ${topicId}` })
      }
      
      const data = fs.readFileSync(metadataPath, 'utf8')
      const cfg = JSON.parse(data)
      
      if (batchId && Array.isArray(cfg.batches)) {
        const batch = cfg.batches.find(b => b.batch_id === batchId)
        if (!batch) {
          return res.status(404).json({ ok: false, error: `Batch ${batchId} not found` })
        }
        res.json({
          name: cfg.name,
          description: cfg.description,
          icons: batch.icons,
          generation: {
            rows: batch.rows,
            cols: batch.cols,
            prompt: batch.prompt,
            api_endpoint: cfg.generation?.api_endpoint,
            output_path: cfg.generation?.output_path
          }
        })
      } else {
        res.json(cfg)
      }
    } catch (error) {
      console.error('[icons/metadata] Error:', error)
      res.status(500).json({ ok: false, error: 'Failed to load metadata: ' + error.message })
    }
  },

  // ─ Generate icons (from uploaded image) ─
  async postIconsGenerate(req, res) {
    try {
      console.log('[icons/generate] Request received')
      
      if (!req.file) {
        return res.status(400).send('No image file uploaded')
      }
      
      const metadata = JSON.parse(req.body.metadata)
      console.log('[icons/generate] Metadata:', metadata.name, metadata.icons.length, 'icons')
      
      const { icons, generation } = metadata
      const { rows, cols, output_path } = generation
      
      if (!rows || !cols || !icons || !output_path) {
        return res.status(400).send('Invalid metadata: missing rows, cols, icons, or output_path')
      }
      
      const imageBuffer = req.file.buffer
      const image = sharp(imageBuffer)
      const imageMetadata = await image.metadata()
      
      console.log('[icons/generate] Image dimensions:', imageMetadata.width, 'x', imageMetadata.height)
      
      const cellWidth = Math.floor(imageMetadata.width / cols)
      const cellHeight = Math.floor(imageMetadata.height / rows)
      
      console.log('[icons/generate] Cell size:', cellWidth, 'x', cellHeight)
      
      const outputDir = path.resolve(PROJECT_ROOT, output_path)
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
      
      const results = []
      
      for (let i = 0; i < icons.length; i++) {
        const icon = icons[i]
        const row = Math.floor(i / cols)
        const col = i % cols
        
        const left = col * cellWidth
        const top = row * cellHeight
        
        console.log(`[icons/generate] Cropping ${icon.id} at (${left}, ${top}) size (${cellWidth}, ${cellHeight})`)
        
        const croppedBuffer = await sharp(imageBuffer)
          .extract({ left, top, width: cellWidth, height: cellHeight })
          .png()
          .toBuffer()
        
        const filename = `${icon.id}.png`
        const filepath = path.join(outputDir, filename)
        
        fs.writeFileSync(filepath, croppedBuffer)
        
        console.log(`[icons/generate] Saved ${filename} (${Math.round(croppedBuffer.length / 1024)}KB)`)
        
        results.push({
          id: icon.id,
          filename,
          path: filepath,
          size: croppedBuffer.length
        })
      }
      
      console.log('[icons/generate] All icons cropped successfully')
      
      res.json({
        success: true,
        icons: results,
        metadata: {
          rows,
          cols,
          cellWidth,
          cellHeight,
          totalIcons: icons.length
        }
      })
      
    } catch (error) {
      console.error('[icons/generate] Error:', error)
      res.status(500).send('Icon generation failed: ' + error.message)
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HEALTH CHECK
  // ═══════════════════════════════════════════════════════════════════════════

  getHealth(req, res) {
    res.json({ ok: true })
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MULTER UPLOAD MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

export const upload = multer({ storage: multer.memoryStorage() })

export default handlers
