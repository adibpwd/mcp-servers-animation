// scripts/preview-frames.mjs
// ─────────────────────────────────────────────────────────────
// Dev helper (verifikasi visual tanpa export penuh): buka /preview/<topic>
// di headless Chrome, freeze timeline GSAP, seek ke waktu tertentu (pola
// sama dengan scripts/export-lib.js: pause + totalTime + flushSync), lalu
// screenshot SVG topic (820x1340) per waktu.
//
// Pakai (dev server harus jalan, mis. `npx vite --port 5199`):
//   node scripts/preview-frames.mjs <topic-id> <outDir> <t1,t2,...> [baseUrl]
// Format waktu: angka detik absolut timeline (mis. 45.2) ATAU
//   a<N>@<detik-relatif-Act> (mis. a2@16.3 = Act 2, 16.3 s dari awal Act).
// Untuk offset Act dipakai PHASES dari data.js topic (intro = 2.6 s).
// ─────────────────────────────────────────────────────────────
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const [topicId, outDir, timesArg, baseUrlArg] = process.argv.slice(2)
if (!topicId || !outDir || !timesArg) {
  console.error('Usage: node scripts/preview-frames.mjs <topic-id> <outDir> <t1,t2,...> [baseUrl]')
  process.exit(1)
}
const baseUrl = baseUrlArg || 'http://127.0.0.1:5199'
const INTRO = 2.6 // INTRO_HOLD 1.8 + MORPH 0.8 (lihat Animation.jsx master timeline)

// durasi Act dibaca dari data.js topic (regex sederhana, tanpa import JSX/asset)
const dataSrc = fs.readFileSync(path.join(ROOT, 'src', 'content', topicId, 'data.js'), 'utf8')
const durations = [...dataSrc.matchAll(/duration:\s*(\d+(?:\.\d+)?)\s*}/g)].map((m) => Number(m[1]))
const actStart = []
let acc = INTRO
for (const d of durations) { actStart.push(acc); acc += d }

const parseTime = (s) => {
  const m = /^a(\d+)@(\d+(?:\.\d+)?)$/.exec(s)
  if (m) return { label: s.replace('@', '_'), t: actStart[Number(m[1]) - 1] + Number(m[2]) }
  return { label: 't' + s, t: Number(s) }
}
const shots = timesArg.split(',').map((s) => s.trim()).filter(Boolean).map(parseTime).sort((a, b) => a.t - b.t)

fs.mkdirSync(outDir, { recursive: true })
const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 820, height: 1340, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.error('[pageerror]', e.message))
page.on('console', (m) => { if (m.type() === 'error') console.error('[console.error]', m.text()) })
await page.goto(`${baseUrl}/preview/${topicId}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForFunction(() => window.__animationTimeline && window.__animationTimeline.duration() > 0, { timeout: 30000 })
await new Promise((r) => setTimeout(r, 1500))

await page.evaluate(() => {
  const tl = window.__animationTimeline
  tl.pause(); tl.repeat(0); tl.repeatDelay(0); tl.timeScale(1)
  window.__flushSync(() => { tl.totalTime(0, false) })
  // sembunyikan chrome UI player, biarkan hanya canvas
  for (const sel of ['.topbar', '.timeline-progress-bar', '.progress-indicator']) {
    const el = document.querySelector(sel); if (el) el.style.display = 'none'
  }
})
console.log(`Timeline duration: ${await page.evaluate(() => window.__animationTimeline.duration().toFixed(2))} s | Act starts: ${actStart.join(', ')}`)

for (const s of shots) {
  await page.evaluate((t) => { window.__flushSync(() => { window.__animationTimeline.totalTime(t, false) }) }, s.t)
  await new Promise((r) => setTimeout(r, 120))
  const svg = await page.$('svg[viewBox="0 0 820 1340"]')
  const file = path.join(outDir, `${s.label}.png`)
  if (svg) await svg.screenshot({ path: file })
  else await page.screenshot({ path: file })
  console.log(`saved ${file} (t=${s.t.toFixed(2)})`)
}
await browser.close()
