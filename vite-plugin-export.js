import { exportTopic, getVideoStats } from './scripts/export-lib.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

/**
 * Vite plugin for export API endpoints
 */
export default function exportPlugin() {
  return {
    name: 'vite-plugin-export',

    configureServer(server) {
      // Pre-middleware (runs before built-in middlewares)
      return () => {
        server.middlewares.use((req, res, next) => {
          // Handle API routes
          if (req.url.startsWith('/api/export')) {
            if (req.url.startsWith('/api/export/status')) {
              return handleStatusAPI(req, res)
            }
            if (req.method === 'POST') {
              return handleExportAPI(req, res)
            }
          }
          next()
        })
      }
    }
  }
}

/**
 * POST /api/export/:topicId - Start export job
 */
function handleExportAPI(req, res) {
  try {
    const urlPath = req.url.split('?')[0]
    const topicId = urlPath.replace('/api/export/', '').trim()
    
    if (!topicId || topicId === 'api' || topicId === 'export') {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'Missing topicId' }))
      return
    }

    if (exportJob.status === 'running') {
      res.writeHead(409, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        ok: false,
        error: `Export sedang berjalan untuk topik: ${exportJob.topicId}`,
        status: exportJob.status
      }))
      return
    }

    startExport(topicId)

    res.writeHead(202, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      ok: true,
      status: 'started',
      topicId
    }))
  } catch (err) {
    console.error('[Export API Error]', err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: false, error: err.message }))
  }
}

/**
 * GET /api/export/status - Get current export status
 */
function handleStatusAPI(req, res) {
  try {
    const url = new URL(`http://localhost${req.url}`)
    const topicId = url.searchParams.get('topicId')
    let videoStats = null

    if (topicId) {
      videoStats = getVideoStats(topicId, __dirname)
    }

    const response = {
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
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(response))
  } catch (err) {
    console.error('[Status API Error]', err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: false, error: err.message }))
  }
}

/**
 * Start export job asynchronously
 */
async function startExport(topicId) {
  exportJob = {
    status: 'running',
    topicId,
    progress: 0,
    phase: 'Starting...',
    message: '',
    logs: [],
    error: null,
    exportedAt: null
  }

  try {
    await exportTopic(topicId, {
      baseUrl: 'http://localhost:5173',
      outDir: __dirname,
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

    const videoStats = getVideoStats(topicId, __dirname)
    exportJob.status = 'done'
    exportJob.progress = 100
    exportJob.exportedAt = videoStats.exportedAt

  } catch (err) {
    exportJob.status = 'error'
    exportJob.error = err.message
    console.error(`[Export ${topicId}] ERROR:`, err)
  }
}
