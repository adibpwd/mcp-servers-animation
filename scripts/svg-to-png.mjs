// One-off script: render SVG file -> transparent PNG via headless Chrome (Puppeteer)
// Usage: node scripts/svg-to-png.mjs <input.svg> <output.png> [size]
import puppeteer from 'puppeteer'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const [,, inPath, outPath, sizeArg] = process.argv
const size = parseInt(sizeArg || '512', 10)

if (!inPath || !outPath) {
  console.error('Usage: node scripts/svg-to-png.mjs <input.svg> <output.png> [size]')
  process.exit(1)
}

const svg = readFileSync(resolve(inPath), 'utf-8')

const html = `<!doctype html><html><head><style>
  html,body{margin:0;padding:0;background:transparent;}
  svg{width:${size}px;height:${size}px;display:block;}
</style></head><body>${svg}</body></html>`

const browser = await puppeteer.launch({ headless: 'new', executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: size, height: size, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle0' })
const el = await page.$('svg')
await el.screenshot({ path: resolve(outPath), omitBackground: true })
await browser.close()
console.log(`OK: ${outPath}`)
