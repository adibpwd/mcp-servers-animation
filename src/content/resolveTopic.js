// src/content/resolveTopic.js
// ─────────────────────────────────────────────────────────────
// Single-source resolver: cari topic by id dari metadata folder
// (metadata.json) lalu resolve komponen animasi dari Animation.jsx
// di folder yang sama. Menggantikan peran CONTENT_REGISTRY (registry.js)
// yang sudah dihapus — sumber metadata satu-satunya = folder content.
// ─────────────────────────────────────────────────────────────

const metaModules = import.meta.glob('./*/metadata.json', { eager: true })
const animModules = import.meta.glob('./*/Animation.jsx')

function folderNumberOf(folder) {
  return folder.match(/^(\d+)-/)?.[1] || null
}

function titleFromSlug(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Cari topic berdasarkan id metadata.
 * @returns {{ meta: object, hasAnimation: boolean, component: (() => Promise) | null } | null}
 */
export function resolveTopicById(id) {
  // 1) Jalur utama: match via metadata.json (sumber metadata lengkap).
  for (const metaPath in metaModules) {
    const meta = metaModules[metaPath]?.default
    if (!meta) continue

    const folder = metaPath.split('/')[1]
    const folderSlug = folder.replace(/^\d+-/, '')
    const isMatch = meta.id === id || folder === id || folderSlug === id

    if (isMatch) {
      const animKey = `./${folder}/Animation.jsx`
      const loader = animModules[animKey]
      const folderNumber = folderNumberOf(folder)

      return {
        meta: { ...meta, folderNumber },
        hasAnimation: !!loader,
        component: loader ? () => loader() : null,
      }
    }
  }

  // 2) Fallback: topic belum punya metadata.json tapi Animation.jsx sudah ada.
  // Nomor & judul diturunkan langsung dari nama folder supaya dock tetap
  // bisa nampilin nomor (bukan '··') walau metadata resmi belum dibuat.
  for (const animKey in animModules) {
    const folder = animKey.split('/')[1]
    const folderSlug = folder.replace(/^\d+-/, '')
    const isMatch = folder === id || folderSlug === id

    if (isMatch) {
      const loader = animModules[animKey]
      return {
        meta: {
          id: folderSlug,
          title: titleFromSlug(folderSlug),
          folderNumber: folderNumberOf(folder),
          isFallbackMeta: true, // penanda: ini bukan dari metadata.json asli
        },
        hasAnimation: !!loader,
        component: loader ? () => loader() : null,
      }
    }
  }

  return null
}