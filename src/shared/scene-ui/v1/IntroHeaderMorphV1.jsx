// src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx
//
// Hero title (tengah, besar) yang ber-morph menjadi compact header (kiri-atas)
// mengikuti progress 0..1 dari timeline topic. Generalisasi dari pola
// "hero-to-header lerp ala Tailscale" (lihat docs/standardizations/
// 09-standar-pembuatan-konten.md § Safe-Zone Layout Contract, dan
// docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md §6).
//
// PURE PRESENTATIONAL — tidak ada GSAP, tidak ada state, tidak ada SFX, tidak
// mengelola typing effect. Topic tetap yang punya timeline dan (opsional)
// typing/cursor; component ini hanya menerima progress + text final tiap
// frame dan me-render posisi/ukuran hasil interpolasi (lihat §3.1 & §6 plan).
//
// VERSIONING: bagian dari kontrak V1. Mengubah default coordinate hero/compact,
// mengubah model titleSegments, atau mengubah struktur props wajib adalah
// breaking change — WAJIB jadi V2 baru (src/shared/scene-ui/v2/), bukan edit
// file ini. Lihat README.md di folder ini untuk aturan lengkap.
//
// UPDATE (non-breaking, PLAN-12 §11 "prop optional baru dengan default yang
// mempertahankan output lama"): ditambah prop opsional `categorySegments`
// supaya tagline category bisa 2 warna atau lebih (mis. label kategori 1
// warna, domain warna lain) — sama pola dengan `titleSegments` yang sudah
// ada sejak awal. Kalau `categorySegments` tidak diberikan, behavior lama
// (`category` string + `categoryColor` tunggal) tetap berjalan tanpa
// perubahan apa pun. Dipicu oleh migrasi PLAN-14 (topic 17-rest-api).
//
// UPDATE 2 (non-breaking, sama pola PLAN-12 §11): ditambah prop opsional
// `titleLines` untuk title hero yang kepanjangan buat 1 baris di canvas
// width 820 (mis. "OAUTH2 DELEGATED LOGIN" ~871px pada font hero 72px, lihat
// 22-oauth2-delegated-login). Kalau diberikan, hero merender title itu jadi
// beberapa baris stack vertikal (masing-masing baris di-center sendiri),
// lalu crossfade ke `titleSegments` versi 1-baris begitu progress lewat
// `titleMorphSplit` (default 0.3) — versi compact/header TETAP 1 baris
// seperti sebelumnya, tidak ada perubahan pada layout.header. Kalau
// `titleLines` tidak diberikan, behavior lama (title 1 baris terus, dari
// hero sampai header) tetap berjalan tanpa perubahan apa pun.
//
// UPDATE 3 (non-breaking, sama pola PLAN-12 §11): ditambah prop opsional
// `heroBackground` untuk backdrop di belakang tagline+title+subtitle pada
// momen hero (mis. buat kebutuhan thumbnail). Backdrop ini STATIS di posisi
// hero (tidak ikut lerp ke posisi/ukuran header) dan fade-out (opacity ->0)
// begitu progress lewat `heroBackground.fadeOutSplit` (default sama dengan
// `titleMorphSplit`) — di compact header backdrop ini sudah tidak ada sama
// sekali, konsisten dengan header compact yang selama ini "polos" tanpa
// panel. Bounding box lebar/tinggi dihitung otomatis dari estimasi lebar
// tagline/title/subtitle terlebar + padding, kecuali topic override manual
// lewat `heroBackground.x/y/width/height`. Kalau `heroBackground` tidak
// diberikan, behavior lama (tidak ada backdrop sama sekali) tetap berjalan
// tanpa perubahan apa pun — non-breaking.
//
// UPDATE 4 (non-breaking, sama pola PLAN-12 §11): ditambah prop opsional
// `heroIllustration` untuk elemen visual/ikon ringkasan (mis. mini-diagram
// yang merangkum keseluruhan konten topic) di area hero, kebutuhan yang
// sama seperti `heroBackground` (thumbnail lebih informatif daripada cuma
// teks). Sama seperti heroBackground: STATIS di posisi hero (tidak lerp ke
// header) dan fade-out habis begitu progress lewat
// `heroIllustration.fadeOutSplit` (default = `titleMorphSplit`) — compact
// header tidak pernah menampilkan elemen ini. Topic mengirim SVG siap pakai
// lewat `heroIllustration.content` (React node, digambar relatif terhadap
// origin 0,0 sendiri — component ini hanya translate ke posisi `y` yang
// diberikan, default di bawah subtitle hero, dan center secara horizontal ke
// tengah canvas). Kalau `heroIllustration` tidak diberikan, behavior lama
// (tidak ada elemen tambahan) tetap berjalan tanpa perubahan apa pun.
//
// UPDATE 5 (default output BERUBAH — deviasi PLAN-12 §6 yang disetujui user
// 2026-09-21, untuk konsistensi PLAN-15): (a) title sekarang GLOW default —
// component mendefinisikan <filter> glow sendiri dengan id unik per-instance
// (useId), jadi semua content dapat glow tanpa <defs> manual di topic;
// opt-out `titleGlow={false}`, override tetap via `titleFilter`, dan (b)
// tagline category otomatis diakhiri " · ADIB-DEV.COM" warna cyan #22D3EE
// kalau belum mengandung domain tsb (prop `domain`/`domainColor`); opt-out
// `domain={null}`.
//
// UPDATE 6 (non-breaking, sama pola PLAN-12 §11): ditambah prop opsional
// `bg`/`bgScenes`/`bgDim`/`bgOrigin` untuk menampilkan scene act topic sebagai
// BACKGROUND full-canvas di belakang tagline+title+subtitle pada momen hero
// (kebutuhan: thumbnail intro memperlihatkan isi act — pola "1 act = 1 file",
// lihat docs/standardizations/07-act-scene-pattern.md). Component ini TETAP
// PURE: tidak mengimpor scene topic — topic mengirim scene lewat `bgScenes`
// (array komponen PURE presentational, urutan act 1..N) dan `bg` (int 1-based,
// act mana yang ditampilkan). Scene dirender dengan `origin` = `bgOrigin`
// (default `layout.body`) — supaya scene ber-koordinat body-local (0,0 =
// body.x,body.y, lihat ContentBodyV1) bisa diposisikan benar di canvas penuh.
// Sama seperti heroBackground/heroIllustration: fade-out habis begitu
// progress lewat `titleMorphSplit` dan tidak pernah muncul di compact header.
// Kalau `bg`/`bgScenes` tidak diberikan, behavior lama (tidak ada layer
// tambahan) tetap berjalan tanpa perubahan apa pun.

import React, { useId } from 'react'
import { DEFAULT_LAYOUT_V1, lerp, clamp01, estimateTextWidth } from './PortraitSceneLayoutV1'

const DEFAULT_DOMAIN = 'ADIB-DEV.COM'
const DEFAULT_DOMAIN_COLOR = '#22D3EE'

const smoothstep01 = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/**
 * Auto-wrap titleSegments ke dalam multiple lines jika total lebar melebihi maxSingleLineWidth.
 * Mempertahankan warna & font weight tiap segment.
 */
function autoWrapTitleSegments(titleSegments, maxSingleLineWidth, fontSize) {
  if (!Array.isArray(titleSegments) || titleSegments.length === 0) return null

  const words = []
  titleSegments.forEach((seg) => {
    const text = String(seg.label || '')
    const parts = text.split(/(\s+)/)
    parts.forEach((part) => {
      if (!part) return
      words.push({ text: part, color: seg.color, weight: seg.weight })
    })
  })

  const lines = []
  let currentLine = []
  let currentLineWidth = 0

  words.forEach((w) => {
    const isWhitespace = /^\s+$/.test(w.text)
    const wWidth = estimateTextWidth(w.text, fontSize) * 1.18

    if (!isWhitespace && currentLine.length > 0 && (currentLineWidth + wWidth) > maxSingleLineWidth) {
      lines.push(currentLine)
      currentLine = [w]
      currentLineWidth = wWidth
    } else {
      if (currentLine.length === 0 && isWhitespace) return
      currentLine.push(w)
      currentLineWidth += wWidth
    }
  })

  if (currentLine.length > 0) {
    lines.push(currentLine)
  }

  if (lines.length <= 1) return null

  return lines.map((lineWords) => {
    const segs = []
    lineWords.forEach((w) => {
      if (segs.length > 0 && segs[segs.length - 1].color === w.color && segs[segs.length - 1].weight === w.weight) {
        segs[segs.length - 1].label += w.text
      } else {
        segs.push({ label: w.text, color: w.color, weight: w.weight })
      }
    })
    return segs
  })
}

// Default hero position/size — persis pola referensi Tailscale (hero center,
// lihat 09-standar-pembuatan-konten.md). Topic boleh override lewat prop
// `hero` (override aman, tidak breaking — lihat PLAN-12 §6 tabel props).
const HERO_DEFAULTS = {
  taglineY: 550,
  titleY: 640,
  subtitleY: 716,
  taglineFontSize: 18,
  titleFontSize: 72,
  subtitleFontSize: 20,
}

// Default compact size — posisi X/Y compact SELALU dari layout.header
// (bukan dari sini) supaya safe-zone contract tetap terjaga. Hanya font
// size yang boleh di-override lewat prop `compact`.
const COMPACT_DEFAULTS = {
  taglineFontSize: 13,
  titleFontSize: 44,
  subtitleFontSize: 15,
}

const DEFAULT_CATEGORY_COLOR = '#94A3B8' // konvensi MUTED yang dipakai hampir semua topic
const DEFAULT_SUBTITLE_COLOR = '#94A3B8'
const DEFAULT_TITLE_FONT_FAMILY = "'Arial Black', Impact, sans-serif"
const DEFAULT_CATEGORY_FONT_FAMILY = 'monospace'
const DEFAULT_SUBTITLE_FONT_FAMILY = 'sans-serif'

// Default backdrop hero (lihat UPDATE 3) — translucent netral, aman dipakai
// di atas background gelap topic manapun tanpa perlu topic set fill manual.
const HERO_BACKGROUND_DEFAULTS = {
  fill: 'rgba(148, 163, 184, 0.08)',
  stroke: 'rgba(148, 163, 184, 0.18)',
  strokeWidth: 1,
  rx: 24,
  paddingX: 36,
  paddingY: 32,
  opacity: 1,
}

/**
 * IntroHeaderMorphV1 — lihat PLAN-12 §6 untuk kontrak lengkap.
 *
 * @param {number} progress        wajib. 0 = hero center, 1 = compact header.
 * @param {string} category        wajib. mis. "NETWORKING · ADIB-DEV.COM".
 * @param {{label:string,color:string,weight?:number}[]} titleSegments  wajib.
 * @param {string} subtitle        wajib. subtitle singkat.
 * @param {object} [layout]        default DEFAULT_LAYOUT_V1.
 * @param {object} [hero]          override aman posisi/ukuran hero saja.
 * @param {object} [compact]       override aman ukuran compact saja (bukan posisi).
 * @param {boolean} [visible]      default true.
 * @param {string} [testId]        label debug/test, dipasang sebagai data-testid.
 * @param {string} [categoryColor] default konvensi MUTED. Diabaikan jika
 *                                 `categorySegments` diberikan.
 * @param {{label:string,color:string}[]} [categorySegments] opsional. Kalau
 *                                 diberikan, `category` (string) diabaikan dan
 *                                 tagline dirender sebagai beberapa tspan
 *                                 berwarna berbeda — sama pola dengan
 *                                 `titleSegments`. TIDAK wajib; kalau tidak
 *                                 diberikan, behavior lama (1 warna dari
 *                                 `category`+`categoryColor`) tetap berjalan
 *                                 — non-breaking (PLAN-12 §11 "prop optional
 *                                 baru dengan default yang mempertahankan
 *                                 output lama").
 * @param {string} [subtitleColor] default konvensi MUTED.
 * @param {string} [titleFilter]   opsional SVG filter url, mis. "url(#glow)".
 *                                 Default (karena `titleGlow=true`) dipakai
 *                                 filter glow bawaan component. Kalau topic
 *                                 kirim nilai ini, diprioritaskan (override
 *                                 glow bawaan).
 * @param {boolean} [titleGlow]    default true (UPDATE 5, PLAN-15). Glow
 *                                 otomatis pakai filter milik component.
 *                                 Opt-out: `titleGlow={false}`.
 * @param {string|null} [domain]   default "ADIB-DEV.COM" (UPDATE 5, PLAN-15).
 *                                 Otomatis ditambahkan ke akhir tagline
 *                                 category (`[string]\u00b7 domain` warna
 *                                 `domainColor`) kalau belum ada. Opt-out:
 *                                 `domain={null}`.
 * @param {string} [domainColor]   default "#22D3EE" (cyan PLAN-15). Warna
 *                                 segment domain otomatis di tagline.
 * @param {{label:string,color:string,weight?:number}[][]} [titleLines] opsional.
 *                                 Kalau title 1-baris kepanjangan untuk hero
 *                                 (lebar estimasi > canvas width), pecah jadi
 *                                 beberapa baris lewat prop ini (tiap baris =
 *                                 array segment, sama shape dengan
 *                                 `titleSegments`). Hero merender SEMUA baris
 *                                 stack vertikal (center sendiri-sendiri),
 *                                 lalu crossfade ke `titleSegments` versi
 *                                 1-baris begitu progress lewat
 *                                 `titleMorphSplit`. Compact/header TIDAK
 *                                 berubah (tetap 1 baris dari `titleSegments`).
 *                                 TIDAK wajib; kalau tidak diberikan, title
 *                                 tetap 1 baris dari hero sampai header
 *                                 seperti sebelumnya — non-breaking.
 * @param {number} [titleMorphSplit] default 0.3. Titik progress (0..1) tempat
 *                                 multiline hero selesai fade-out dan
 *                                 single-line mulai fade-in. Diabaikan kalau
 *                                 `titleLines` tidak diberikan.
 * @param {object} [heroBackground] opsional (lihat UPDATE 3). Kalau
 *                                 diberikan, dirender sebagai <rect> backdrop
 *                                 STATIS di belakang tagline+title+subtitle
 *                                 versi hero (tidak ikut lerp ke header), lalu
 *                                 fade-out habis begitu progress lewat
 *                                 `heroBackground.fadeOutSplit`. Fields (semua
 *                                 optional, ada default):
 *                                 `fill`, `stroke`, `strokeWidth`, `rx`,
 *                                 `paddingX`/`paddingY` (jarak teks ke tepi
 *                                 box, dipakai kalau width/height auto),
 *                                 `opacity` (opacity maksimum sebelum fade),
 *                                 `fadeOutSplit` (default = `titleMorphSplit`),
 *                                 dan override manual `x`/`y`/`width`/`height`
 *                                 kalau auto-bounding-box tidak pas. TIDAK
 *                                 wajib; kalau tidak diberikan, behavior lama
 *                                 (tidak ada backdrop) tetap berjalan tanpa
 *                                 perubahan apa pun.
 * @param {object} [heroIllustration] opsional (lihat UPDATE 4). Elemen visual
 *                                 statis (mis. ikon ringkasan workflow topic)
 *                                 di area hero, fade-out sama kurva dengan
 *                                 `heroBackground`. Fields: `content` (wajib
 *                                 kalau prop ini dipakai — React node, SVG
 *                                 digambar relatif origin 0,0 sendiri),
 *                                 `y` (default `hero.subtitleY + 90`),
 *                                 `scale` (default 1), `opacity` (default 1),
 *                                 `fadeOutSplit` (default = `titleMorphSplit`).
 *                                 TIDAK wajib; kalau tidak diberikan, behavior
 *                                 lama (tidak ada elemen tambahan) tetap
 *                                 berjalan tanpa perubahan apa pun.
 * @param {number} [bg]            opsional (UPDATE 6). Index act 1-based yang
 *                                 ditampilkan sebagai background hero. Hanya
 *                                 dipakai kalau `bgScenes` diberikan.
 * @param {Array<Component>} [bgScenes] opsional (UPDATE 6). Array komponen
 *                                 scene act PURE presentational (urutan act
 *                                 1..N, ekspor `ACT_SCENES` dari acts/index.js
 *                                 topic — lihat
 *                                 docs/standardizations/07-act-scene-pattern.md).
 *                                 Scene dirender TANPA props (mode "summary"
 *                                 = momen akhir act, komponen act yang
 *                                 menentukan default internalnya sendiri).
 * @param {number} [bgDim]         default 0.3 (UPDATE 6). Opacity maksimum
 *                                 layer background sebelum fade-out.
 * @param {{x:number,y:number}} [bgOrigin] default layout.body. Origin tempat
 *                                 scene bg digambar (translate transform).
 *                                 Untuk scene ber-koordinat body-local, pakai
 *                                 default; kalau scene sudah canvas-absolute,
 *                                 kirim {x:0,y:0}.
 */
export default function IntroHeaderMorphV1({
  progress,
  category,
  categorySegments,
  titleSegments,
  titleLines,
  titleMorphSplit = 0.3,
  heroBackground,
  heroIllustration,
  subtitle,
  layout = DEFAULT_LAYOUT_V1,
  hero = {},
  compact = {},
  visible = true,
  testId,
  categoryColor = DEFAULT_CATEGORY_COLOR,
  subtitleColor = DEFAULT_SUBTITLE_COLOR,
  titleFontFamily = DEFAULT_TITLE_FONT_FAMILY,
  categoryFontFamily = DEFAULT_CATEGORY_FONT_FAMILY,
  subtitleFontFamily = DEFAULT_SUBTITLE_FONT_FAMILY,
  titleFilter,
  titleGlow = true,
  domain = DEFAULT_DOMAIN,
  domainColor = DEFAULT_DOMAIN_COLOR,
  bg,
  bgScenes,
  bgDim,
  bgOrigin,
}) {
  if (import.meta.env?.DEV) {
    if (!Array.isArray(titleSegments) || titleSegments.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('[scene-ui v1] IntroHeaderMorphV1: "titleSegments" kosong — title tidak boleh blank (lihat PLAN-12 §6).')
    }
    if (!category && !(Array.isArray(categorySegments) && categorySegments.length > 0)) {
      // eslint-disable-next-line no-console
      console.warn('[scene-ui v1] IntroHeaderMorphV1: "category"/"categorySegments" kosong — category tidak boleh blank (lihat PLAN-12 §6).')
    }
    if (!subtitle) {
      // eslint-disable-next-line no-console
      console.warn('[scene-ui v1] IntroHeaderMorphV1: "subtitle" kosong — subtitle tidak boleh blank (lihat PLAN-12 §6).')
    }
  }

  const mp = clamp01(Number.isFinite(progress) ? progress : 0)
  const h = { ...HERO_DEFAULTS, ...hero }
  const c = { ...COMPACT_DEFAULTS, ...compact }

  // ── Glow title otomatis (UPDATE 5, PLAN-15) — filter glow didefinisikan
  // oleh component ini sendiri dengan id unik per-instance (useId) supaya
  // tidak bentrok antar content/window yang terbuka bersamaan. Default ON
  // (`titleGlow=true`): semua content otomatis dapat glow tanpa harus
  // mendefinisikan <filter> di defs topic masing-masing. Opt-out via
  // `titleGlow={false}`; override filter khusus topic tetap via `titleFilter`.
  // Catatan: id unik dari useId mengandung ":" (mis. ":r1:") yang tidak aman
  // untuk selector SVG url(#...), jadi dibersihkan dulu. ──
  const rawGlowId = useId()
  const glowFilterId = `intro-glow${rawGlowId.replace(/[^a-zA-Z0-9]/g, '')}`
  const usesBuiltinGlow = titleGlow && !titleFilter
  const resolvedTitleFilter = usesBuiltinGlow ? `url(#${glowFilterId})` : titleFilter

  // ── Domain auto (UPDATE 5, PLAN-15) — tagline category otomatis diakhiri
  // segment " · ADIB-DEV.COM" warna cyan #22D3EE kalau belum mengandung
  // domain tsb. Berasal dari `categorySegments` kalau ada, fallback ke
  // `category` string. `domain={null}` untuk opt-out total. ──
  const baseSegments = Array.isArray(categorySegments) && categorySegments.length > 0
    ? categorySegments.map((s) => ({ label: s.label, color: s.color }))
    : (category ? [{ label: category, color: categoryColor }] : [])
  const taglineSegments = (() => {
    const segments = [...baseSegments]
    if (domain != null) {
      const joined = segments.map((s) => String(s.label)).join('')
      const domainRe = new RegExp(domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      if (joined && !domainRe.test(joined)) {
        segments.push({ label: ` · ${domain}`, color: domainColor })
      }
    }
    return segments
  })()

  const fullTitleText = (titleSegments || []).map((s) => s.label).join('')
  const maxAvailableLineWidth = layout.canvas.width - 48

  // Auto-wrap titleSegments jika titleLines tidak diset manual
  const resolvedTitleLines = (Array.isArray(titleLines) && titleLines.length > 0)
    ? titleLines
    : autoWrapTitleSegments(titleSegments, maxAvailableLineWidth, h.titleFontSize)

  // Auto font-size scaling untuk single line title hero jika judul muat 1 baris tapi agak mepet margin
  const rawEstimatedSingleWidth = estimateTextWidth(fullTitleText, h.titleFontSize) * 1.18
  const autoHeroTitleFontSize = (!resolvedTitleLines && rawEstimatedSingleWidth > maxAvailableLineWidth)
    ? Math.max(48, Math.floor(h.titleFontSize * (maxAvailableLineWidth / rawEstimatedSingleWidth)))
    : h.titleFontSize

  const effectiveHero = { ...h, titleFontSize: autoHeroTitleFontSize }

  // startX hero: dipusatkan otomatis pakai estimateTextWidth, KECUALI topic
  // eksplisit override lewat hero.thumbWidth (lihat komentar estimateTextWidth
  // di PortraitSceneLayoutV1.js).
  const estimatedWidth = effectiveHero.thumbWidth ?? estimateTextWidth(fullTitleText, effectiveHero.titleFontSize)
  // Safety-clamp ke margin kiri (sama marginX dengan clamp titleLines di
  // bawah): kalau title terlalu lebar untuk 1 baris sehingga heroStartX jadi
  // negatif, tagline & subtitle ikut kepotong di sisi kiri (mis. "OAUTH2
  // DELEGATED LOGIN" → heroStartX ≈ -6px pada 72px, canvas 820). Clamp ini
  // hanya aktif untuk title sebesar itu, tidak mengubah output topic lain.
  const heroMarginX = 16
  const heroStartX = Math.max(heroMarginX, (layout.canvas.width / 2) - (estimatedWidth / 2))
  const endX = layout.header.x

  const taglineX = lerp(heroStartX, endX, mp)
  const taglineY = lerp(effectiveHero.taglineY, layout.header.taglineY, mp)
  const taglineFs = lerp(effectiveHero.taglineFontSize, c.taglineFontSize, mp)

  const titleX = lerp(heroStartX, endX, mp)
  const titleY = lerp(effectiveHero.titleY, layout.header.titleY, mp)
  const titleFs = lerp(effectiveHero.titleFontSize, c.titleFontSize, mp)

  const subX = lerp(heroStartX, endX, mp)
  const subY = lerp(effectiveHero.subtitleY, layout.header.subtitleY, mp)
  const subFs = lerp(effectiveHero.subtitleFontSize, c.subtitleFontSize, mp)

  // ── titleLines (opsional, diset manual atau di-auto wrap di atas) ──
  const hasTitleLines = Array.isArray(resolvedTitleLines) && resolvedTitleLines.length > 0
  const singleLineOpacity = hasTitleLines ? smoothstep01(0, titleMorphSplit, mp) : 1
  const multilineOpacity = hasTitleLines ? (1 - smoothstep01(0, titleMorphSplit, mp)) : 0
  const heroLineHeight = effectiveHero.titleFontSize * 0.98

  // ── heroBackground (opsional, lihat UPDATE 3) — backdrop STATIS di posisi
  // hero, fade-out pakai smoothstep sama pola titleLines di atas. Kalau
  // `heroBackground` tidak diberikan, `hb` null dan tidak ada apa pun yang
  // dirender di sini (behavior lama, non-breaking). ──
  const hb = heroBackground ? { ...HERO_BACKGROUND_DEFAULTS, ...heroBackground } : null
  const hbFadeSplit = hb?.fadeOutSplit ?? titleMorphSplit
  const hbOpacity = hb ? clamp01(hb.opacity ?? 1) * (1 - smoothstep01(0, hbFadeSplit, mp)) : 0

  let hbX, hbY, hbWidth, hbHeight
  if (hb) {
    // Auto-bounding-box: bungkus teks terlebar (tagline/title/subtitle,
    // termasuk titleLines kalau dipakai) + padding. Bisa dioverride penuh
    // lewat heroBackground.x/y/width/height kalau auto tidak pas.
    const categoryText = taglineSegments.map((s) => s.label).join('')
    let contentWidth = Math.max(
      estimatedWidth,
      estimateTextWidth(categoryText, effectiveHero.taglineFontSize),
      estimateTextWidth(subtitle || '', effectiveHero.subtitleFontSize),
    )
    let topEdge = effectiveHero.taglineY - effectiveHero.taglineFontSize * 0.85
    let bottomEdge = effectiveHero.subtitleY + effectiveHero.subtitleFontSize * 0.3
    if (hasTitleLines) {
      const widestLine = Math.max(...resolvedTitleLines.map((lineSegs) => (
        estimateTextWidth((lineSegs || []).map((s) => s.label).join(''), effectiveHero.titleFontSize) * 1.18
      )))
      contentWidth = Math.max(contentWidth, widestLine)
      const stackHalf = ((resolvedTitleLines.length - 1) / 2) * heroLineHeight
      topEdge = Math.min(topEdge, effectiveHero.titleY - stackHalf - effectiveHero.titleFontSize * 0.85)
      bottomEdge = Math.max(bottomEdge, effectiveHero.titleY + stackHalf + effectiveHero.titleFontSize * 0.3)
    }
    // X box selalu di-center ke tengah canvas (bukan heroStartX) — konsisten
    // dengan cara title (single-line MAUPUN titleLines) sama-sama di-center
    // ke layout.canvas.width/2. Kalau pakai heroStartX (basis lebar title
    // single-line), box bisa geser saat titleLines aktif karena tiap baris
    // dihitung ulang center-nya sendiri (lihat render titleLines di bawah).
    hbWidth = hb.width ?? (contentWidth + hb.paddingX * 2)
    hbX = hb.x ?? ((layout.canvas.width / 2) - (hbWidth / 2))
    hbY = hb.y ?? (topEdge - hb.paddingY)
    hbHeight = hb.height ?? (bottomEdge - topEdge + hb.paddingY * 2)
  }

  // ── heroIllustration (opsional, lihat UPDATE 4) — konten SVG statis
  // (mis. ikon ringkasan workflow) di area hero, fade-out pakai kurva yang
  // sama seperti heroBackground. Kalau `heroIllustration` tidak diberikan,
  // `hi` null dan tidak ada apa pun yang dirender (non-breaking). ──
  const hi = heroIllustration
    ? { y: effectiveHero.subtitleY + 90, scale: 1, opacity: 1, ...heroIllustration }
    : null
  const hiFadeSplit = hi?.fadeOutSplit ?? titleMorphSplit
  const hiOpacity = hi ? clamp01(hi.opacity ?? 1) * (1 - smoothstep01(0, hiFadeSplit, mp)) : 0

  // ── Hero background dari scene act topic (opsional, lihat UPDATE 6) ──
  // `bg` = index act 1-based di `bgScenes` (array dari acts/index.js topic,
  // pola "1 act = 1 file"). Scene dirender TANPA props → komponen act berada
  // dalam mode "summary" (momen akhir act, memakai default internalnya).
  // Layer ditaruh di origin `bgOrigin` (default layout.body — scene bersifat
  // body-local seperti ContentBodyV1) dan ikut fade-out di `titleMorphSplit`
  // seperti heroBackground. Tanpa `bgScenes`/`bg` valid → tidak ada render,
  // behavior lama (non-breaking).
  const bgSceneCount = Array.isArray(bgScenes) ? bgScenes.length : 0
  const bgSceneIndex = (Number.isInteger(bg) && bg >= 1 && bg <= bgSceneCount) ? bg - 1 : -1
  const BgScene = bgSceneIndex >= 0 ? bgScenes[bgSceneIndex] : null
  const bgOriginPt = bgOrigin || { x: layout.body.x, y: layout.body.y }
  const rawVignetteId = useId()
  const vignetteId = `intro-bg-vignette${rawVignetteId.replace(/[^a-zA-Z0-9]/g, '')}`
  const bgLayerOpacity = BgScene
    ? clamp01(bgDim ?? 0.3) * (1 - smoothstep01(0, titleMorphSplit, mp))
    : 0

  if (import.meta.env?.DEV && bg != null && bgSceneCount === 0) {
    // eslint-disable-next-line no-console
    console.warn('[scene-ui v1] IntroHeaderMorphV1: prop "bg" diberikan tapi "bgScenes" kosong — bg diabaikan. Lihat docs/standardizations/07-act-scene-pattern.md.')
  }

  return (
    <g opacity={visible ? 1 : 0} data-testid={testId}>
      {usesBuiltinGlow && (
        <defs>
          <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="intro-glow-b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="intro-glow-b2" />
            <feMerge>
              <feMergeNode in="intro-glow-b2" />
              <feMergeNode in="intro-glow-b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      {BgScene && bgLayerOpacity > 0 && (
        <>
          <defs>
            <radialGradient id={vignetteId} cx="50%" cy="42%" r="78%">
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="72%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
            </radialGradient>
          </defs>
          <g transform={`translate(${bgOriginPt.x}, ${bgOriginPt.y})`} opacity={bgLayerOpacity}>
            <BgScene />
          </g>
          <rect
            x={0} y={0} width={layout.canvas.width} height={layout.canvas.height}
            fill={`url(#${vignetteId})`} opacity={bgLayerOpacity}
          />
        </>
      )}
      {hb && hbOpacity > 0 && (
        <rect
          x={hbX} y={hbY} width={hbWidth} height={hbHeight} rx={hb.rx}
          fill={hb.fill} stroke={hb.stroke} strokeWidth={hb.strokeWidth}
          opacity={hbOpacity}
        />
      )}

      <text
        x={taglineX} y={taglineY} textAnchor="start"
        fontSize={taglineFs}
        fontFamily={categoryFontFamily} letterSpacing={3}
      >
        {taglineSegments.map((seg, i) => (
          <tspan key={i} fill={seg.color}>{seg.label}</tspan>
        ))}
      </text>

      {hasTitleLines && multilineOpacity > 0 && (
        <g opacity={multilineOpacity} filter={resolvedTitleFilter || undefined}>
          {resolvedTitleLines.map((lineSegs, li) => {
            const lineText = (lineSegs || []).map((s) => s.label).join('')
            // Buffer 18% — estimateTextWidth() sedikit underestimate untuk
            // ALL CAPS bold (mis. "Arial Black"), lebar render asli bisa
            // lebih lebar dari estimasi charWidth generik. Tanpa buffer ini
            // kata terakhir baris (mis. "LOGIN") bisa kepotong tipis di
            // kanan (revisi 2026-09-12). Lalu di-clamp ke margin canvas
            // biar tidak pernah lewat batas kiri/kanan meski estimasi masih
            // sedikit meleset.
            const lineWidth = estimateTextWidth(lineText, effectiveHero.titleFontSize) * 1.18
            const marginX = 16
            let lineX = (layout.canvas.width / 2) - (lineWidth / 2)
            if (lineX < marginX) lineX = marginX
            if (lineX + lineWidth > layout.canvas.width - marginX) {
              lineX = layout.canvas.width - marginX - lineWidth
            }
            const lineY = effectiveHero.titleY + (li - (resolvedTitleLines.length - 1) / 2) * heroLineHeight
            return (
              <text
                key={li}
                x={lineX} y={lineY} textAnchor="start" fontSize={effectiveHero.titleFontSize}
                fontFamily={titleFontFamily} fontWeight={900}
              >
                {(lineSegs || []).map((seg, i) => (
                  <tspan key={i} fill={seg.color} fontWeight={seg.weight || 900}>
                    {seg.label}
                  </tspan>
                ))}
              </text>
            )
          })}
        </g>
      )}

      <text
        x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
        fontFamily={titleFontFamily} fontWeight={900}
        filter={resolvedTitleFilter || undefined}
        opacity={singleLineOpacity}
      >
        {(titleSegments || []).map((seg, i) => (
          <tspan key={i} fill={seg.color} fontWeight={seg.weight || 900}>
            {seg.label}
          </tspan>
        ))}
      </text>

      <text
        x={subX} y={subY} textAnchor="start" fontSize={subFs}
        fontFamily={subtitleFontFamily} fill={subtitleColor}
      >
        {subtitle}
      </text>

      {hi && hiOpacity > 0 && (
        <g
          transform={`translate(${layout.canvas.width / 2} ${hi.y}) scale(${hi.scale})`}
          opacity={hiOpacity}
        >
          {hi.content}
        </g>
      )}
    </g>
  )
}
