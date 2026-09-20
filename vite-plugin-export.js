import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import busboy from 'busboy'
import { exportTopic, getVideoStats } from './scripts/export-lib.js'
import { exportParallel, getVideoStats as getVideoStatsParallel } from './scripts/export-parallel.mjs'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = __dirname
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'src/content')

// State
let exportJob = { status: 'idle', topicId: null, progress: 0, phase: '', message: '', logs: [], error: null, exportedAt: null }
let exportHistory = []
const parallelJobs = new Map()

// ── Content items: scan src/content/*/metadata.json ──────────
// Satu-satunya sumber metadata dashboard = tiap folder punya
// metadata.json. Folder tanpa metadata tidak muncul.
function readTopicMetadata(folder) {
  const file = path.join(CONTENT_ROOT, folder, 'metadata.json')
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch (err) {
    console.error(`[ContentDB] Bad metadata in ${folder}:`, err.message)
    return null
  }
}

function buildContentItems() {
  const items = []
  if (!fs.existsSync(CONTENT_ROOT)) return items
  const dirs = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
  for (const folder of dirs) {
    const meta = readTopicMetadata(folder)
    if (!meta) continue
    items.push(meta)
  }
  return items.sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity))
}

function findFolderByContentId(contentId) {
  if (!fs.existsSync(CONTENT_ROOT)) return null
  const dirs = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true }).filter(d => d.isDirectory())
  for (const d of dirs) {
    const metaId = readTopicMetadata(d.name)?.id
    const folderSlug = d.name.replace(/^\d+-/, '')
    if (metaId === contentId || d.name === contentId || folderSlug === contentId) return d.name
  }
  return null
}

function writeTopicMetadata(contentId, updates) {
  const folder = findFolderByContentId(contentId)
  if (!folder) return null
  const file = path.join(CONTENT_ROOT, folder, 'metadata.json')
  const meta = readTopicMetadata(folder) || { id: contentId }
  const merged = { ...meta, ...updates }
  fs.writeFileSync(file, JSON.stringify(merged, null, 2) + '\n', 'utf-8')
  return merged
}

async function startExport(topicId, volume = 75, speed = 1.0) {
  const startTime = Date.now()
  exportJob = { status: 'running', topicId, progress: 0, phase: 'Starting...', message: '', logs: [], error: null, exportedAt: null, volume, speed }
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
    exportHistory.unshift({ topicId, status: 'done', progress: 100, error: null, exportedAt: videoStats.exportedAt, videoSize: videoStats.size, duration })
  } catch (err) {
    const duration = Math.round((Date.now() - startTime) / 1000)
    exportJob.status = 'error'
    exportJob.error = err.message
    console.error(`[Export ${topicId}] ERROR:`, err.message)
    exportHistory.unshift({ topicId, status: 'error', progress: exportJob.progress, error: err.message, exportedAt: null, videoSize: null, duration })
  }
}

// ── Parallel export job state (per topicId) ────────────────────
function makeParallelJob(topicId, workers) {
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
  const job = makeParallelJob(topicId, workers)
  parallelJobs.set(topicId, job)
  try {
    await exportParallel(topicId, {
      baseUrl: 'http://localhost:5173',
      outDir: PROJECT_ROOT,
      workers,
      volume,
      speed,
      onProgress: (status) => {
        job.progress = status.progress
        job.phase = status.phase
        job.message = status.message
        if (status.workers) job.workerStates = status.workers
      },
      onLog: (message) => {
        job.logs.push(message)
        console.log(`[Parallel ${topicId}] ${message}`)
      }
    })
    const videoStats = getVideoStatsParallel(topicId, PROJECT_ROOT)
    const duration = Math.round((Date.now() - startTime) / 1000)
    job.status = 'done'
    job.progress = 100
    job.exportedAt = videoStats.exportedAt
    exportHistory.unshift({ topicId, status: 'done', progress: 100, error: null, exportedAt: videoStats.exportedAt, videoSize: videoStats.size, duration, mode: 'parallel', workers })
  } catch (err) {
    const duration = Math.round((Date.now() - startTime) / 1000)
    job.status = 'error'
    job.error = err.message
    console.error(`[Parallel ${topicId}] ERROR:`, err.message)
    exportHistory.unshift({ topicId, status: 'error', progress: job.progress, error: err.message, exportedAt: null, videoSize: null, duration, mode: 'parallel', workers })
  }
}

export default function unifiedApiPlugin() {
  return {
    name: 'vite-plugin-unified-api',
    configureServer(server) {
      // Register directly (NOT inside a returned function) so this runs
      // BEFORE Vite's internal middlewares (incl. the SPA/html fallback).
      // Returning a function here would make it a post-hook that runs
      // AFTER internal middlewares, which was swallowing every /api/*
      // request into the SPA fallback and returning index.html instead
      // of JSON.
      server.middlewares.use(async (req, res, next) => {
        // Mounting with a path prefix (e.g. use('/api/', fn)) makes connect
        // strip that prefix from req.url before the handler sees it, which
        // broke every pathname === '/api/...' check inside handleApiRoute.
        // Mount at root instead and filter manually so req.url stays intact.
        if (!req.url || !req.url.startsWith('/api')) return next()
        try {
          console.log(`[API] ${req.method} ${req.url}`)
          await handleApiRoute(req, res)
        } catch (err) {
          console.error('[API Error]', err)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: err.message }))
        }
      })
    }
  }
}

async function handleApiRoute(req, res) {
  const url = new URL(`http://localhost${req.url}`)
  const pathname = url.pathname

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
    return
  }

  if (pathname === '/api/export/status') {
    const topicId = url.searchParams.get('topicId')
    const videoStats = topicId ? getVideoStats(topicId, PROJECT_ROOT) : null
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: exportJob.status,
      topicId: exportJob.topicId,
      progress: exportJob.progress,
      phase: exportJob.phase,
      message: exportJob.message,
      logs: exportJob.logs.slice(-20),
      error: exportJob.error,
      videoReady: videoStats?.exists || false,
      videoUrl: videoStats?.videoUrl || null,
      videoSize: videoStats?.size || null,
      exportedAt: videoStats?.exportedAt || null
    }))
    return
  }

  if (pathname === '/api/export/history') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ history: exportHistory.map(e => ({ topicId: e.topicId, status: e.status, progress: e.progress, error: e.error, exportedAt: e.exportedAt, videoSize: e.videoSize, duration: e.duration })) }))
      return
    }
  }

  const deleteMatch = pathname.match(/^\/api\/export\/history\/(.+)$/)
  if (deleteMatch && req.method === 'DELETE') {
    const topicId = decodeURIComponent(deleteMatch[1])
    exportHistory = exportHistory.filter(e => e.topicId !== topicId)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
    return
  }

  const exportpMatch = pathname.match(/^\/api\/exportp\/(.+)$/)
  if (exportpMatch && req.method === 'POST') {
    const topicId = decodeURIComponent(exportpMatch[1])
    if (topicId !== 'status') {
      const existing = parallelJobs.get(topicId)
      if (existing?.status === 'running') {
        res.writeHead(409, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: `Parallel export sudah berjalan untuk: ${topicId}` }))
        return
      }
      const body = await readJsonBody(req)
      const workers = Math.max(1, Math.min(16, Number(body?.workers) || 4))
      const volume = Math.max(0, Math.min(500, Number(body?.volume) || 75))
      const speed = Math.max(0.5, Math.min(2.0, Number(body?.speed) || 1.0))
      startParallelExport(topicId, workers, volume, speed)
      res.writeHead(202, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, status: 'started', topicId, workers, volume, speed, mode: 'parallel' }))
      return
    }
  }

  if (pathname === '/api/exportp/status') {
    const topicId = url.searchParams.get('topicId')
    if (!topicId) {
      const all = []
      for (const job of parallelJobs.values()) {
        const vs = getVideoStatsParallel(job.topicId, PROJECT_ROOT)
        all.push({ ...job, logs: job.logs.slice(-10), videoReady: vs?.exists || false, videoUrl: vs?.videoUrl || null, videoSize: vs?.size || null })
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ jobs: all }))
      return
    }
    const job = parallelJobs.get(topicId)
    const vs = getVideoStatsParallel(topicId, PROJECT_ROOT)
    if (!job) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'idle', topicId, videoReady: vs?.exists || false, videoUrl: vs?.videoUrl || null, videoSize: vs?.size || null }))
      return
    }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: job.status, topicId: job.topicId, workers: job.workers,
      progress: job.progress, phase: job.phase, message: job.message,
      logs: job.logs.slice(-20), error: job.error, startedAt: job.startedAt,
      workerStates: job.workerStates,
      videoReady: vs?.exists || false, videoUrl: vs?.videoUrl || null, videoSize: vs?.size || null
    }))
    return
  }

  const exportMatch = pathname.match(/^\/api\/export\/(.+)$/)
  if (exportMatch && req.method === 'POST') {
    const topicId = decodeURIComponent(exportMatch[1])
    if (topicId !== 'status' && topicId !== 'history') {
      if (exportJob.status === 'running') {
        res.writeHead(409, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: `Export berjalan: ${exportJob.topicId}` }))
        return
      }
      await startExport(topicId)
      res.writeHead(202, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, status: 'started', topicId }))
      return
    }
  }

  if (pathname === '/api/content') {
    if (req.method === 'GET') {
      const items = buildContentItems()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, items }))
      return
    }
  }

  const contentMatch = pathname.match(/^\/api\/content\/(.+)$/)
  if (contentMatch) {
    const contentId = decodeURIComponent(contentMatch[1])
    if (req.method === 'GET') {
      const folder = findFolderByContentId(contentId)
      const item = folder ? readTopicMetadata(folder) : null
      if (!item) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: `Content '${contentId}' not found` }))
        return
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, item }))
      return
    }
    if (req.method === 'POST') {
      parseJsonBody(req, res, (body) => {
        const { status, priority, pinned, pinnedAt } = body
        const VALID_STATUSES = ['draft', 'ready', 'posted']
        if (status && !VALID_STATUSES.includes(status)) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: `Invalid status` }))
          return
        }
        if (priority !== undefined && (typeof priority !== 'number' || priority < 1 || priority > 100)) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: `Invalid priority` }))
          return
        }
        if (pinned !== undefined && typeof pinned !== 'boolean') {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: `Invalid pinned` }))
          return
        }
        if (pinnedAt !== undefined && (typeof pinnedAt !== 'string' || Number.isNaN(Date.parse(pinnedAt)))) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: `Invalid pinnedAt` }))
          return
        }
        const folder = findFolderByContentId(contentId)
        if (!folder) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: `Content not found` }))
          return
        }
        const updates = {}
        if (status !== undefined) updates.status = status
        if (priority !== undefined) updates.priority = Math.max(1, Math.min(100, priority))
        if (pinned !== undefined) {
          updates.pinned = pinned
          if (pinned) {
            updates.pinnedAt = pinnedAt || new Date().toISOString()
          } else {
            updates.pinnedAt = null
          }
        }
        try {
          const item = writeTopicMetadata(contentId, updates)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, item }))
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: 'Failed to save' }))
        }
      })
      return
    }
  }

  if (pathname === '/api/icons/topics') {
    if (req.method === 'GET') {
      try {
        let topics = []
        if (fs.existsSync(CONTENT_ROOT)) {
          const topicDirs = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
          for (const topicId of topicDirs) {
            const iconsFile = path.join(CONTENT_ROOT, topicId, 'icons', 'icons.json')
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
              console.error(`Skip ${topicId}:`, err.message)
            }
          }
        }
        topics.sort((a, b) => a.id.localeCompare(b.id))
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ topics }))
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: error.message }))
      }
      return
    }
  }

  if (pathname === '/api/icons/metadata') {
    if (req.method === 'GET') {
      try {
        const topicId = url.searchParams.get('topicId')
        const batchId = url.searchParams.get('batchId')
        if (!topicId) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: 'Missing topicId' }))
          return
        }
        const metadataPath = path.resolve(PROJECT_ROOT, `src/content/${topicId}/icons/icons.json`)
        if (!fs.existsSync(metadataPath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: `icons.json not found` }))
          return
        }
        const cfg = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
        if (batchId && Array.isArray(cfg.batches)) {
          const batch = cfg.batches.find(b => b.batch_id === batchId)
          if (!batch) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: false, error: `Batch not found` }))
            return
          }
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ name: cfg.name, description: cfg.description, icons: batch.icons, generation: { rows: batch.rows, cols: batch.cols, prompt: batch.prompt, api_endpoint: cfg.generation?.api_endpoint, output_path: cfg.generation?.output_path } }))
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(cfg))
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: error.message }))
      }
      return
    }
  }

  if (pathname === '/api/icons/generate') {
    if (req.method === 'POST') {
      handleMultipartGenerate(req, res)
      return
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: false, error: 'Not found', path: pathname }))
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}) } catch (err) { resolve({}) }
    })
  })
}

function parseJsonBody(req, res, callback) {
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })
  req.on('end', () => {
    try {
      const parsed = body ? JSON.parse(body) : {}
      callback(parsed)
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }))
    }
  })
}

async function handleMultipartGenerate(req, res) {
  try {
    const bb = busboy({ headers: req.headers })
    let fileBuffer = null
    let metadata = null
    bb.on('file', (fieldname, file, info) => {
      if (fieldname === 'image') {
        const chunks = []
        file.on('data', chunk => chunks.push(chunk))
        file.on('end', () => { fileBuffer = Buffer.concat(chunks) })
      }
    })
    bb.on('field', (fieldname, value) => {
      if (fieldname === 'metadata') {
        try { metadata = JSON.parse(value) } catch (err) {}
      }
    })
    bb.on('close', async () => {
      if (!metadata) {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('Missing metadata')
        return
      }
      try {
        const { icons, generation } = metadata
        const { rows, cols, output_path } = generation
        if (!rows || !cols || !icons || !output_path) {
          res.writeHead(400, { 'Content-Type': 'text/plain' })
          res.end('Invalid metadata')
          return
        }
        const image = sharp(fileBuffer)
        const imageMetadata = await image.metadata()
        const cellWidth = Math.floor(imageMetadata.width / cols)
        const cellHeight = Math.floor(imageMetadata.height / rows)
        const outputDir = path.resolve(PROJECT_ROOT, output_path)
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
        const results = []
        for (let i = 0; i < icons.length; i++) {
          const icon = icons[i]
          const row = Math.floor(i / cols)
          const col = i % cols
          const left = col * cellWidth
          const top = row * cellHeight
          const croppedBuffer = await sharp(fileBuffer).extract({ left, top, width: cellWidth, height: cellHeight }).png().toBuffer()
          const filename = `${icon.id}.png`
          const filepath = path.join(outputDir, filename)
          fs.writeFileSync(filepath, croppedBuffer)
          results.push({ id: icon.id, filename, path: filepath, size: croppedBuffer.length })
        }
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true, icons: results, metadata: { rows, cols, cellWidth, cellHeight, totalIcons: icons.length } }))
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Icon generation failed: ' + error.message)
      }
    })
    bb.on('error', (err) => {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('Parse error: ' + err.message)
    })
    req.pipe(bb)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Failed: ' + err.message)
  }
}
