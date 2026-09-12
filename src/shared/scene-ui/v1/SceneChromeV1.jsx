// src/shared/scene-ui/v1/SceneChromeV1.jsx
//
// Convenience composer: IntroHeaderMorphV1 + ActBadgeNavigatorV1 +
// ContentBodyV1, urutan tetap — lihat
// docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md §9 untuk kontrak lengkap.
//
// Default recommended untuk topic portrait baru yang memakai format standar
// penuh. Topic yang butuh variasi tetap boleh memakai ketiga primitive satu
// per satu langsung, tanpa lewat composer ini.
//
// BATAS: tidak mengatur SVG root/filters/background grid/audio/export
// hooks/GSAP/state topic. Tidak punya opini tentang data/content body. Tidak
// memaksa caption bar. Tidak menggantikan animasi topic existing.
//
// VERSIONING: bagian dari kontrak V1 (lihat README.md folder ini).

import React from 'react'
import { DEFAULT_LAYOUT_V1 } from './PortraitSceneLayoutV1'
import IntroHeaderMorphV1 from './IntroHeaderMorphV1'
import ActBadgeNavigatorV1 from './ActBadgeNavigatorV1'
import ContentBodyV1 from './ContentBodyV1'
import SceneSafeAreaDebugV1 from './SceneSafeAreaDebugV1'

/**
 * SceneChromeV1 — lihat PLAN-12 §9 untuk kontrak lengkap.
 *
 * @param {object} intro       wajib. Props diteruskan ke IntroHeaderMorphV1.
 * @param {object} [navigator] Props diteruskan ke ActBadgeNavigatorV1.
 * @param {object} [content]   Props diteruskan ke ContentBodyV1.
 * @param {boolean} [showNavigator] default true — set false selama intro.
 * @param {boolean} [showContent]   default true — set false selama intro.
 * @param {object} [layout]    default DEFAULT_LAYOUT_V1, diteruskan ke semua primitive.
 * @param {boolean} [debug]    default false — nyalakan SceneSafeAreaDebugV1 (dev-only).
 */
export default function SceneChromeV1({
  intro,
  navigator,
  content,
  showNavigator = true,
  showContent = true,
  layout = DEFAULT_LAYOUT_V1,
  debug = false,
}) {
  if (import.meta.env?.DEV && !intro) {
    // eslint-disable-next-line no-console
    console.warn('[scene-ui v1] SceneChromeV1: prop "intro" wajib diisi (lihat PLAN-12 §9).')
  }

  return (
    <g>
      <IntroHeaderMorphV1 layout={layout} {...intro} />

      {showNavigator && navigator && (
        <ActBadgeNavigatorV1 layout={layout} {...navigator} />
      )}

      {showContent && content && (
        <ContentBodyV1 layout={layout} {...content} />
      )}

      <SceneSafeAreaDebugV1 layout={layout} debug={debug} />
    </g>
  )
}
