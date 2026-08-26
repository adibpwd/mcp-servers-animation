import path from 'path'
import { fileURLToPath } from 'url'
import { exportTopic } from './export-lib.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Topic params: default 'file-permission'
const TOPIC_ID = process.argv[2] || 'file-permission'
const DURATION = Number(process.argv[3]) || 45

async function main() {
  try {
    await exportTopic(TOPIC_ID, {
      baseUrl: 'http://localhost:5173',
      outDir: ROOT,
      duration: DURATION,
      onProgress: (status) => {
        // For CLI, just log progress
        process.stdout.write(`\r${status.phase}... ${status.progress}% (${status.message})`)
      },
      onLog: (message) => {
        console.log(message)
      }
    })
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

main()
