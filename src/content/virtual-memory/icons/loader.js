// Icon loader utility for Virtual Memory animation
// Import all icons as assets

import browserIcon from './browser.png'
import gameIcon from './game.png'
import editorIcon from './editor.png'
import musicIcon from './music.png'
import cameraIcon from './camera.png'
import storageIcon from './storage.png'
import lightningIcon from './lightning.png'

export const ICONS = {
  browser: browserIcon,
  game: gameIcon,
  editor: editorIcon,
  music: musicIcon,
  camera: cameraIcon,
  storage: storageIcon,
  lightning: lightningIcon,
}

export function getIcon(id) {
  return ICONS[id] || null
}
