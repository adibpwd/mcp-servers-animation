// src/shared/scene-ui/v1/index.js
//
// Named exports stabil untuk scene-ui V1 — lihat
// docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md §4 & §11.
//
// Import HARUS eksplisit versi lewat entrypoint ini atau file individual di
// folder v1/ — TIDAK ADA import tanpa versi seperti "scene-ui/Header.jsx".

export {
  DEFAULT_LAYOUT_V1,
  lerp,
  clamp01,
  toCanvasX,
  toCanvasY,
  toLocalX,
  toLocalY,
  estimateTextWidth,
  getZones,
  warnIfOutsideZone,
} from './PortraitSceneLayoutV1'

export { default as IntroHeaderMorphV1 } from './IntroHeaderMorphV1'
export { default as ActBadgeNavigatorV1 } from './ActBadgeNavigatorV1'
export { default as ContentBodyV1 } from './ContentBodyV1'
export { default as SceneChromeV1 } from './SceneChromeV1'
export { default as SceneSafeAreaDebugV1 } from './SceneSafeAreaDebugV1'
