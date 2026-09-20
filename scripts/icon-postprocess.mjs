// scripts/icon-postprocess.mjs
// ─────────────────────────────────────────────────────────────
// One-off (pola sama dengan scripts/svg-to-png.mjs). Revisi-02 §4.2:
//   1. AUDIT GATE  — tolak PNG yang bukan transparan sungguhan
//      (bukan RGBA, sudut tidak transparan, opaque >= 40%, atau banyak
//      piksel abu-abu terang opaque = checkerboard ter-bake).
//   2. TRIM+CENTER — nolkan alpha < 24, crop ke bounding box glyph
//      (alpha > 40), pad ke persegi dengan margin 6% per sisi, tanpa
//      resample. Nama file tetap, jadi loader.js tidak berubah.
// PNG asli dibackup ke icons/_originals/backup-ai-generated/ (tidak
// menimpa backup yang sudah ada, sehingga aman dijalankan ulang).
// File yang gagal audit TIDAK diperbaiki otomatis (laporan saja).
//
// Pakai:
//   node scripts/icon-postprocess.mjs <topic-id> --audit-only
//   node scripts/icon-postprocess.mjs <topic-id> [--ids a,b] [--dry-run]
// ─────────────────────────────────────────────────────────────
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
const topicId = args.find((a) => !a.startsWith('--'))
const auditOnly = args.includes('--audit-only')
const dryRun = args.includes('--dry-run')
const idsArg = args.find((a) => a.startsWith('--ids='))
const onlyIds = idsArg ? idsArg.slice(6).split(',').filter(Boolean) : null

if (!topicId) {
  console.error('Usage: node scripts/icon-postprocess.mjs <topic-id> [--audit-only] [--dry-run] [--ids=a,b]')
  process.exit(1)
}

const ICON_DIR = path.join(ROOT, 'src', 'content', topicId, 'icons')
const BACKUP_DIR = path.join(ICON_DIR, '_originals', 'backup-ai-generated')
const SKIP = new Set(['default-icon'])

const ALPHA_ZERO_BELOW = 24
const ALPHA_GLYPH_ABOVE = 128
const EDGE_STRIP = 8
const MARGIN_RATIO = 0.06
const MAX_OPAQUE_RATIO = 0.4
const MAX_LIGHT_GRAY_RATIO = 0.02

// ── Audit gate ──
async function audit(file) {
  const img = sharp(file)
  const meta = await img.metadata()
  const problems = []
  if (!meta.hasAlpha) problems.push(`mode ${meta.space}/${meta.channels}ch tanpa alpha`)
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const n = w * h
  const A = (x, y) => data[(y * w + x) * 4 + 3]
  const corners = [A(2, 2), A(w - 3, 2), A(2, h - 3), A(w - 3, h - 3)]
  const cornersTransparent = corners.filter((a) => a <= 8).length
  if (cornersTransparent < 3) problems.push(`sudut transparan ${cornersTransparent}/4`)
  let opaque = 0
  let lightGray = 0
  for (let i = 0; i < n; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    const a = data[i * 4 + 3]
    if (a > 200) {
      opaque++
      if (Math.max(r, g, b) - Math.min(r, g, b) < 25 && r > 150 && r < 245) lightGray++
    }
  }
  const opaqueRatio = opaque / n
  const lightGrayRatio = lightGray / n
  if (opaqueRatio >= MAX_OPAQUE_RATIO) problems.push(`opaque ${(opaqueRatio * 100).toFixed(0)}% (>= 40%)`)
  if (lightGrayRatio > MAX_LIGHT_GRAY_RATIO) problems.push(`abu-abu terang opaque ${(lightGrayRatio * 100).toFixed(0)}% (checkerboard)`)
  return { ok: problems.length === 0, problems, data, info, meta }
}

// ── Trim + center ──
function computeTrim(data, info) {
  const { width: w, height: h } = info
  // 1) nolkan alpha lemah (haze)
  for (let i = 0; i < w * h; i++) {
    if (data[i * 4 + 3] < ALPHA_ZERO_BELOW) data[i * 4 + 3] = 0
  }
  // 2) bersihkan residu garis tipis di tepi sel crop: piksel dalam
  //    EDGE_STRIP px dari tepi kanvas dengan alpha <= 200 dibuang.
  //    Glyph asli yang menyentuh tepi (alpha > 200) tetap aman.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const inStrip = x < EDGE_STRIP || y < EDGE_STRIP || x >= w - EDGE_STRIP || y >= h - EDGE_STRIP
      const idx = (y * w + x) * 4 + 3
      if (inStrip && data[idx] <= 200) data[idx] = 0
    }
  }
  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > ALPHA_GLYPH_ABOVE) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return null
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

const files = fs.readdirSync(ICON_DIR).filter((f) => f.endsWith('.png'))
  .filter((f) => !SKIP.has(f.replace(/\.png$/, '')))
  .filter((f) => !onlyIds || onlyIds.includes(f.replace(/\.png$/, '')))
  .sort()

console.log(`Topic: ${topicId} | ${files.length} PNG | mode: ${auditOnly ? 'audit-only' : dryRun ? 'dry-run' : 'trim'}`)
const rows = []
let failed = 0

for (const f of files) {
  const id = f.replace(/\.png$/, '')
  const full = path.join(ICON_DIR, f)
  const a = await audit(full)
  if (!a.ok) {
    failed++
    rows.push({ id, status: 'FAIL', note: a.problems.join('; ') })
    continue
  }
  if (auditOnly) {
    rows.push({ id, status: 'PASS', note: `${a.info.width}x${a.info.height}` })
    continue
  }
  const box = computeTrim(a.data, a.info)
  if (!box) {
    failed++
    rows.push({ id, status: 'FAIL', note: 'glyph tidak ditemukan' })
    continue
  }
  // Margin seragam di semua sisi; rasio aspek glyph dipertahankan (BUKAN dipaksa
  // persegi) supaya glyph lebar/pendek seperti dependency-chain tidak menyusut
  // saat <Icon> menerapkan preserveAspectRatio "meet" ke kotak w x h.
  const m = Math.ceil(Math.max(box.width, box.height) * MARGIN_RATIO)
  const outW = box.width + 2 * m
  const outH = box.height + 2 * m
  const cx = box.left + box.width / 2 - a.info.width / 2
  const cy = box.top + box.height / 2 - a.info.height / 2
  const note = `${a.info.width}x${a.info.height} -> ${outW}x${outH} (glyph ${box.width}x${box.height}, offset lama ${cx >= 0 ? '+' : ''}${cx.toFixed(0)},${cy >= 0 ? '+' : ''}${cy.toFixed(0)})`
  if (!dryRun) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
    const bak = path.join(BACKUP_DIR, f)
    if (!fs.existsSync(bak)) fs.copyFileSync(full, bak)
    const out = await sharp(a.data, { raw: { width: a.info.width, height: a.info.height, channels: 4 } })
      .extract(box)
      .extend({ top: m, bottom: m, left: m, right: m, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
    // File asli bisa milik root (dibuat container Docker) — folder milik user,
    // jadi ganti lewat tulis-ke-temp lalu rename (tidak butuh izin tulis file).
    const tmp = full + '.tmp'
    fs.writeFileSync(tmp, out)
    fs.renameSync(tmp, full)
  }
  rows.push({ id, status: dryRun ? 'DRY' : 'TRIM', note, outW, outH, gw: box.width, gh: box.height })
}

for (const r of rows) console.log(`${r.status.padEnd(5)} ${r.id.padEnd(18)} ${r.note}`)
console.log(`\nRingkasan: ${rows.length - failed} lolos, ${failed} gagal audit gate.`)
process.exit(failed > 0 ? 2 : 0)
