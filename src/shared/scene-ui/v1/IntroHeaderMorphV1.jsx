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

import React from 'react'
import { DEFAULT_LAYOUT_V1, lerp, clamp01, estimateTextWidth } from './PortraitSceneLayoutV1'

const smoothstep01 = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
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
 *                                 Default TIDAK dipasang — kalau topic belum
 *                                 punya <filter id="glow"> di defs, title akan
 *                                 tetap tampil normal (aman, tidak invisible).
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
 */
export default function IntroHeaderMorphV1({
  progress,
  category,
  categorySegments,
  titleSegments,
  titleLines,
  titleMorphSplit = 0.3,
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

  const fullTitleText = (titleSegments || []).map((s) => s.label).join('')
  // startX hero: dipusatkan otomatis pakai estimateTextWidth, KECUALI topic
  // eksplisit override lewat hero.thumbWidth (lihat komentar estimateTextWidth
  // di PortraitSceneLayoutV1.js).
  const estimatedWidth = h.thumbWidth ?? estimateTextWidth(fullTitleText, h.titleFontSize)
  const heroStartX = (layout.canvas.width / 2) - (estimatedWidth / 2)
  const endX = layout.header.x

  const taglineX = lerp(heroStartX, endX, mp)
  const taglineY = lerp(h.taglineY, layout.header.taglineY, mp)
  const taglineFs = lerp(h.taglineFontSize, c.taglineFontSize, mp)

  const titleX = lerp(heroStartX, endX, mp)
  const titleY = lerp(h.titleY, layout.header.titleY, mp)
  const titleFs = lerp(h.titleFontSize, c.titleFontSize, mp)

  const subX = lerp(heroStartX, endX, mp)
  const subY = lerp(h.subtitleY, layout.header.subtitleY, mp)
  const subFs = lerp(h.subtitleFontSize, c.subtitleFontSize, mp)

  // ── titleLines (opsional, lihat UPDATE 2 di atas) — kalau tidak
  // diberikan, multilineOpacity/singleLineOpacity tidak pernah dipakai
  // untuk mengubah apapun (singleLineOpacity efektif selalu 1). ──
  const hasTitleLines = Array.isArray(titleLines) && titleLines.length > 0
  const singleLineOpacity = hasTitleLines ? smoothstep01(0, titleMorphSplit, mp) : 1
  const multilineOpacity = hasTitleLines ? (1 - smoothstep01(0, titleMorphSplit, mp)) : 0
  const heroLineHeight = h.titleFontSize * 0.98

  return (
    <g opacity={visible ? 1 : 0} data-testid={testId}>
      <text
        x={taglineX} y={taglineY} textAnchor="start"
        fill={Array.isArray(categorySegments) && categorySegments.length > 0 ? undefined : categoryColor}
        fontSize={taglineFs}
        fontFamily={categoryFontFamily} letterSpacing={3}
      >
        {Array.isArray(categorySegments) && categorySegments.length > 0
          ? categorySegments.map((seg, i) => (
              <tspan key={i} fill={seg.color}>{seg.label}</tspan>
            ))
          : category}
      </text>

      {hasTitleLines && multilineOpacity > 0 && (
        <g opacity={multilineOpacity} filter={titleFilter || undefined}>
          {titleLines.map((lineSegs, li) => {
            const lineText = (lineSegs || []).map((s) => s.label).join('')
            // Buffer 18% — estimateTextWidth() sedikit underestimate untuk
            // ALL CAPS bold (mis. "Arial Black"), lebar render asli bisa
            // lebih lebar dari estimasi charWidth generik. Tanpa buffer ini
            // kata terakhir baris (mis. "LOGIN") bisa kepotong tipis di
            // kanan (revisi 2026-09-12). Lalu di-clamp ke margin canvas
            // biar tidak pernah lewat batas kiri/kanan meski estimasi masih
            // sedikit meleset.
            const lineWidth = estimateTextWidth(lineText, h.titleFontSize) * 1.18
            const marginX = 16
            let lineX = (layout.canvas.width / 2) - (lineWidth / 2)
            if (lineX < marginX) lineX = marginX
            if (lineX + lineWidth > layout.canvas.width - marginX) {
              lineX = layout.canvas.width - marginX - lineWidth
            }
            const lineY = h.titleY + (li - (titleLines.length - 1) / 2) * heroLineHeight
            return (
              <text
                key={li}
                x={lineX} y={lineY} textAnchor="start" fontSize={h.titleFontSize}
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
        filter={titleFilter || undefined}
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
    </g>
  )
}
