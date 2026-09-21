// src/content/48-shell-terminal-command-line/icons/loader.js
import gnuBashMarkIcon from './gnu-bash-mark.png'
import defaultIcon from './default-icon.png'

export const ICONS = {
  'gnu-bash-mark': gnuBashMarkIcon,
}

export function getIcon(id) {
  return ICONS[id] || defaultIcon
}
