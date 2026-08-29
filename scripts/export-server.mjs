import express from 'express'
import cors from 'cors'
import multer from 'multer'
import sharp from 'sharp'
import { exportTopic, getVideoStats } from './export-lib.js'
import { exportParallel, getVideoStats as getVideoStatsParallel } from './export-parallel.mjs'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const app = express()
const PORT = process.env.PORT || 3300

// Content DB path
const CONTENT_DB_PATH = path.join(__dirname, 'content-db.json')

// ── Helpers: Read & Write content-db.json ──────────────────────
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

// Enable CORS with permissive configuration for development
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    
    // In production, check whitelist
    // Frontend is exposed both on its container port (5173) and the
    // docker-compose published port (3373), so allow both.
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://100.78.186.122:5173',
      'http://localhost:3373',
      'http://127.0.0.1:3373',
      'http://100.78.186.122:3373'
    ]
    
    if (allowedOrigins.indexOf(origin) !== -1 || /^http:\/\/.*:(5173|3373)$/.test(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Parse JSON body
app.use(express.json())

// Configure multer for file upload (memory storage)
const upload = multer({ storage: multer.memoryStorage() })

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

// ── Parallel export job state (per topicId) ───────────────────
const parallelJobs = new Map()  // Map<topicId, jobState>

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
      baseUrl: 'http://frontend:5173',
      outDir: ROOT,
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

    const vs = getVideoStatsParallel(topicId, ROOT)
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

// POST /api/export-parallel/:topicId
app.post('/api/exportp/:topicId', (req, res) => {
  const { topicId } = req.params
  const workers = Math.max(1, Math.min(16, Number(req.body?.workers) || 4))
  const volume  = Math.max(0, Math.min(500, Number(req.body?.volume) || 75))
  const speed   = Math.max(0.5, Math.min(2.0, Number(req.body?.speed) || 1.0))

  const existing = parallelJobs.get(topicId)
  if (existing?.status === 'running') {
    return res.status(409).json({ ok: false, error: `Parallel export sudah berjalan untuk: ${topicId}` })
  }

  startParallelExport(topicId, workers, volume, speed)
  res.status(202).json({ ok: true, status: 'started', topicId, workers, volume, speed, mode: 'parallel' })
})

// GET /api/export-parallel/status?topicId=xxx
app.get('/api/exportp/status', (req, res) => {
  const { topicId } = req.query
  if (!topicId) {
    const all = []
    for (const job of parallelJobs.values()) {
      const vs = getVideoStatsParallel(job.topicId, ROOT)
      all.push({ ...job, logs: job.logs.slice(-10), videoReady: vs?.exists || false,
                 videoUrl: vs?.videoUrl || null, videoSize: vs?.size || null })
    }
    return res.json({ jobs: all })
  }

  const job = parallelJobs.get(topicId)
  const vs  = getVideoStatsParallel(topicId, ROOT)
  if (!job) {
    return res.json({ status: 'idle', topicId, videoReady: vs?.exists || false,
                      videoUrl: vs?.videoUrl || null, videoSize: vs?.size || null })
  }
  res.json({
    status: job.status, topicId: job.topicId, workers: job.workers,
    progress: job.progress, phase: job.phase, message: job.message,
    logs: job.logs.slice(-20), error: job.error, startedAt: job.startedAt,
    workerStates: job.workerStates,
    videoReady: vs?.exists || false, videoUrl: vs?.videoUrl || null, videoSize: vs?.size || null
  })
})

// POST /api/export/:topicId - Start export
app.post('/api/export/:topicId', (req, res) => {
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
})

// GET /api/export/status - Get export status
app.get('/api/export/status', (req, res) => {
  const topicId = req.query.topicId
  let videoStats = null

  if (topicId) {
    videoStats = getVideoStats(topicId, ROOT)
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
})

// GET /api/export/history - Get export history
app.get('/api/export/history', (req, res) => {
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
})

// DELETE /api/export/history/:topicId - Clear history entry
app.delete('/api/export/history/:topicId', (req, res) => {
  const { topicId } = req.params
  exportHistory = exportHistory.filter(e => e.topicId !== topicId)
  res.json({ ok: true })
})

// Serve videos with Content-Disposition header for download
app.use('/videos', (req, res, next) => {
  const filename = path.basename(req.url.split('?')[0])
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  next()
}, express.static(path.join(ROOT, 'public/videos')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// ── Content Management API ─────────────────────────────────────

// GET /api/content - Get all content items (sorted by priority ascending)
app.get('/api/content', (req, res) => {
  const db = readContentDb()
  const sorted = [...db.items].sort((a, b) => a.priority - b.priority)
  res.json({ ok: true, items: sorted })
})

// GET /api/content/:id - Get single content item
app.get('/api/content/:id', (req, res) => {
  const { id } = req.params
  const db = readContentDb()
  const item = db.items.find(i => i.id === id)

  if (!item) {
    return res.status(404).json({ ok: false, error: `Content '${id}' not found` })
  }

  res.json({ ok: true, item })
})

// POST /api/content/:id - Update status and/or priority
app.post('/api/content/:id', (req, res) => {
  const { id } = req.params
  const { status, priority } = req.body

  const VALID_STATUSES = ['draft', 'ready', 'posted']

  // Validate
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

  // Apply updates
  if (status !== undefined) db.items[idx].status = status
  if (priority !== undefined) db.items[idx].priority = Math.max(1, Math.min(100, priority))

  const saved = writeContentDb(db)

  if (!saved) {
    return res.status(500).json({ ok: false, error: 'Failed to save changes' })
  }

  console.log(`[ContentDB] Updated '${id}':`, { status, priority })
  res.json({ ok: true, item: db.items[idx] })
})

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
      baseUrl: 'http://frontend:5173',
      outDir: ROOT,
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

    const videoStats = getVideoStats(topicId, ROOT)
    const duration = Math.round((Date.now() - startTime) / 1000)
    
    exportJob.status = 'done'
    exportJob.progress = 100
    exportJob.exportedAt = videoStats.exportedAt

    // Add to history
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

    // Add to history
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

// ── Icon Generator API ──────────────────────────────────────────

// GET /api/icons/metadata - Get icons.json metadata
app.get('/api/icons/metadata', async (req, res) => {
  try {
    const metadataPath = path.resolve(ROOT, 'src/content/virtual-memory/icons/icons.json')
    const data = fs.readFileSync(metadataPath, 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('[icons/metadata] Error:', error)
    res.status(500).send('Failed to load metadata: ' + error.message)
  }
})

// POST /api/icons/generate - Upload image grid, crop, and save icons
app.post('/api/icons/generate', upload.single('image'), async (req, res) => {
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
    
    // Load image
    const imageBuffer = req.file.buffer
    const image = sharp(imageBuffer)
    const imageMetadata = await image.metadata()
    
    console.log('[icons/generate] Image dimensions:', imageMetadata.width, 'x', imageMetadata.height)
    
    const cellWidth = Math.floor(imageMetadata.width / cols)
    const cellHeight = Math.floor(imageMetadata.height / rows)
    
    console.log('[icons/generate] Cell size:', cellWidth, 'x', cellHeight)
    
    // Ensure output directory exists
    const outputDir = path.resolve(ROOT, output_path)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    const results = []
    
    // Crop each icon
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
})

app.listen(PORT, () => {
  console.log(`Export server running on http://0.0.0.0:${PORT}`)
})
