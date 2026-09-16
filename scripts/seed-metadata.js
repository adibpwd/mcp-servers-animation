// scripts/seed-metadata.js
// ─────────────────────────────────────────────────────────────
// Sekali jalan: bangun metadata.json di tiap folder src/content/*/
// dari scripts/content-db.json (untuk topic yang sudah ada di db)
// + generasi stub minimal untuk folder ber-nomor yang belum punya
// metadata (default status draft, priority = nomor folder).
//
// Aturan:
//   - Folder yang SUDAH punya metadata.json dilewati (kecuali --force).
//   - 16-env-variables tetap disembunyikan (tidak dibuatkan metadata).
//   - Setelah jalan, scripts/content-db.json boleh dihapus.
// ─────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(ROOT, 'src/content')
const CONTENT_DB_PATH = path.join(__dirname, 'content-db.json')

const HIDDEN_DIRS = new Set(['16-env-variables'])
const STUB_COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#22D3EE']

const FORCE = process.argv.includes('--force')

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(CONTENT_DB_PATH, 'utf-8')).items || []
  } catch (err) {
    console.warn('[seed-metadata] content-db.json tidak terbaca:', err.message)
    return []
  }
}

function slugToId(dirName) {
  const m = dirName.match(/^(\d+)-(.+)$/)
  return m ? { number: Number(m[1]), slug: m[2] } : null
}

function humanize(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function writeMetadata(folder, data) {
  const target = path.join(CONTENT_ROOT, folder, 'metadata.json')
  fs.writeFileSync(target, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  console.log(`  ✓ ${folder}/metadata.json`)
}

let created = 0
let skipped = 0

const dirs = fs
  .readdirSync(CONTENT_ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort()

const dbItems = readDb()
const dbById = new Map(dbItems.map(i => [i.id, i]))

console.log(`[seed-metadata] Scan ${dirs.length} folder di src/content/ ...\n`)

for (const folder of dirs) {
  const parsed = slugToId(folder)
  if (!parsed) continue
  const { number, slug } = parsed
  const target = path.join(CONTENT_ROOT, folder, 'metadata.json')

  if (!HIDDEN_DIRS.has(folder) && dbById.has(slug)) {
    if (fs.existsSync(target) && !FORCE) {
      skipped++
      continue
    }
    const dbItem = dbById.get(slug)
    writeMetadata(folder, {
      id: dbItem.id,
      title: dbItem.title,
      subtitle: dbItem.subtitle,
      category: dbItem.category,
      tags: dbItem.tags || [],
      color: dbItem.color,
      status: dbItem.status || 'draft',
      priority: Number.isFinite(dbItem.priority) ? dbItem.priority : number,
    })
    created++
    continue
  }

  // Tidak ada di db → cek: sudah punya metadata? hidden? lalu generate stub.
  if (HIDDEN_DIRS.has(folder)) {
    console.log(`  - skip (hidden): ${folder}`)
    continue
  }
  if (fs.existsSync(target)) {
    if (!FORCE) {
      skipped++
      continue
    }
  }
  const stubColors = STUB_COLORS[created % STUB_COLORS.length]
  writeMetadata(folder, {
    id: slug,
    title: humanize(slug),
    subtitle: '',
    category: dbById.get(slug)?.category || 'Linux Fundamentals',
    tags: [],
    color: stubColors,
    status: 'draft',
    priority: number,
  })
  created++
}

console.log(`\n[seed-metadata] Selesai. dibuat=${created}, dilewati (sudah ada)=${skipped}`)