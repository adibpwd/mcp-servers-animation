// src/content/resolveTopic.js
// ─────────────────────────────────────────────────────────────
// Single-source resolver: cari topic by id dari metadata folder
// (metadata.json) lalu resolve komponen animasi dari Animation.jsx
// di folder yang sama. Menggantikan peran CONTENT_REGISTRY (registry.js)
// yang sudah dihapus — sumber metadata satu-satunya = folder content.
// ─────────────────────────────────────────────────────────────

const metaModules = import.meta.glob('./*/metadata.json', { eager: true })
const animModules = import.meta.glob('./*/Animation.jsx')

/**
 * Cari topic berdasarkan id metadata.
 * @returns {{ meta: object, hasAnimation: boolean, component: (() => Promise) | null } | null}
 */
export function resolveTopicById(id) {
  for (const metaPath in metaModules) {
    const meta = metaModules[metaPath]?.default
    if (!meta) continue

    const folder = metaPath.split('/')[1]
    const folderSlug = folder.replace(/^\d+-/, '')
    const isMatch = meta.id === id || folder === id || folderSlug === id

    if (isMatch) {
      const animKey = `./${folder}/Animation.jsx`
      const loader = animModules[animKey]
      const folderNumber = folder.match(/^(\d+)-/)?.[1] || null

      return {
        meta: { ...meta, folderNumber },
        hasAnimation: !!loader,
        component: loader ? () => loader() : null,
      }
    }
  }
  return null
}