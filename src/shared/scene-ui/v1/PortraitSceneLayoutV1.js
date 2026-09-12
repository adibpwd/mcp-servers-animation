// src/shared/scene-ui/v1/PortraitSceneLayoutV1.js
//
// Layout token tunggal untuk scene-ui V1 (lihat docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md §5
// dan docs/standardizations/09-standar-pembuatan-konten.md §1.R Safe-Zone Layout Contract).
//
// Pure data + helper coordinate — TIDAK ada GSAP, TIDAK ada React state, TIDAK ada DOM
// measurement, supaya aman dipanggil kapan saja termasuk saat export seek (lihat §3.1 plan).
//
// VERSIONING: file ini adalah bagian dari kontrak V1. Perubahan default coordinate zona
// adalah breaking change — WAJIB jadi V2 baru (src/shared/scene-ui/v2/), bukan edit file ini.
// Lihat README.md di folder ini untuk aturan lengkap.

/**
 * Canvas + zona standar portrait V1. Nilai persis dari PLAN-12 §5.
 * Semua angka dalam satuan px pada coordinate space SVG (viewBox 0 0 820 1340).
 */
export const DEFAULT_LAYOUT_V1 = {
  canvas: { width: 820, height: 1340 },

  header: {
    x: 44,
    taglineY: 50,
    titleY: 100,
    subtitleY: 130,
  },

  navigator: {
    x: 44,
    y: 155,
    width: 500,
    height: 40,
    dotsX: 620,
    dotsY: 175,
    dotSpacing: 24,
    activeRadius: 7,
    inactiveRadius: 4,
  },

  body: {
    x: 44,
    y: 235,
    width: 732,
    height: 965,
  },

  // Sub-zona di DALAM body — dipakai topic request/response untuk transit/service
  // corridor (lihat 09-standar-pembuatan-konten.md §1.R). Nilai yStart di sini
  // dalam CANVAS coordinate (bukan local body coordinate) supaya bisa langsung
  // dipakai bareng FlowchartSpine/waypoint yang juga biasanya di canvas coordinate.
  transit: { yStart: 476 },
  service: { yStart: 610 },
  closing: { yStart: 1020 },
}

/**
 * Linear interpolation. Duplikat kecil yang aman — pola yang sama sudah dipakai
 * lokal di banyak topic (lihat 04-referensi-gsap.md), sengaja tidak diimport dari
 * tempat lain supaya file ini tidak punya dependency ke luar folder v1/.
 */
export const lerp = (a, b, t) => a + (b - a) * t

export const clamp01 = (t) => Math.max(0, Math.min(1, t))

/**
 * Konversi local body coordinate (0,0 = body.x, body.y) ke canvas coordinate.
 * Dipakai ContentBodyV1 (render prop) dan boleh dipakai langsung oleh topic yang
 * ingin menghitung posisi manual tanpa lewat komponen.
 */
export const toCanvasX = (layout, localX) => layout.body.x + localX
export const toCanvasY = (layout, localY) => layout.body.y + localY

/**
 * Kebalikan dari toCanvasX/toCanvasY — canvas coordinate ke local body coordinate.
 */
export const toLocalX = (layout, canvasX) => canvasX - layout.body.x
export const toLocalY = (layout, canvasY) => canvasY - layout.body.y

/**
 * Estimasi lebar text kasar (px) — dipakai IntroHeaderMorphV1 untuk menghitung
 * startX hero supaya title terlihat center secara visual walau textAnchor tetap
 * "start" (lihat 03-tutorial-buat-topic-baru.md § "Langkah 2 — Bikin Intro").
 * Sengaja duplikat kecil dari formula di 05-svg-text-guide.md § "Text Measurement
 * Helper" — beda kegunaan (estimasi width judul besar, bukan wrap body text).
 */
export const estimateTextWidth = (text, fontSize, { monospace = false } = {}) => {
  const charWidth = monospace ? 0.6 : 0.55
  return String(text || '').length * fontSize * charWidth
}

/**
 * Zona vertikal turunan (yStart/yEnd) dari token di atas — dipakai untuk
 * collision check (warnIfOutsideZone) dan SceneSafeAreaDebugV1. Dihitung,
 * bukan di-hardcode kedua kali, supaya tetap konsisten kalau DEFAULT_LAYOUT_V1
 * di-override sebagian oleh topic (lihat prop `layout` di tiap komponen V1).
 */
export const getZones = (layout = DEFAULT_LAYOUT_V1) => ({
  header:    { yStart: 0,                    yEnd: layout.navigator.y },
  navigator: { yStart: layout.navigator.y,    yEnd: layout.body.y },
  body:      { yStart: layout.body.y,         yEnd: layout.body.y + layout.body.height },
  transit:   { yStart: layout.transit.yStart, yEnd: layout.service.yStart },
  service:   { yStart: layout.service.yStart, yEnd: layout.closing.yStart },
  closing:   { yStart: layout.closing.yStart, yEnd: layout.canvas.height },
})

/**
 * Dev-only helper: cek apakah rentang [top, bottom] menabrak batas zona lain.
 * Dipanggil dari komponen V1 untuk console.warn saat development — TIDAK pernah
 * throw, TIDAK pernah mengubah output visual, aman dibiarkan aktif di production
 * (no-op kalau import.meta.env.DEV false).
 */
export const warnIfOutsideZone = (label, top, bottom, zone) => {
  if (!import.meta.env?.DEV) return
  if (top < zone.yStart || bottom > zone.yEnd) {
    // eslint-disable-next-line no-console
    console.warn(
      `[scene-ui v1] "${label}" (y ${top}-${bottom}) keluar dari zona yang diizinkan (y ${zone.yStart}-${zone.yEnd}). ` +
      `Lihat docs/standardizations/09-standar-pembuatan-konten.md §1.R Safe-Zone Layout Contract.`
    )
  }
}
