// Icon loader utility for Desktop Environment animation
// Import all icons as assets

import gnomeLogo from './gnome-logo.png'
import kdeLogo from './kde-logo.png'
import xfceLogo from './xfce-logo.png'
import i3Grid from './i3-grid.png'
import ramStick from './ram-stick.png'
import cpuChip from './cpu-chip.png'
import customizeDial from './customize-dial.png'
import appBrowser from './app-browser.png'
import appTerminal from './app-terminal.png'
import appFiles from './app-files.png'
import appSettings from './app-settings.png'
import keyboard from './keyboard.png'
import insightBulb from './insight-bulb.png'
import tuneWrench from './tune-wrench.png'

export const ICONS = {
  'gnome-logo': gnomeLogo,
  'kde-logo': kdeLogo,
  'xfce-logo': xfceLogo,
  'i3-grid': i3Grid,
  'ram-stick': ramStick,
  'cpu-chip': cpuChip,
  'customize-dial': customizeDial,
  'app-browser': appBrowser,
  'app-terminal': appTerminal,
  'app-files': appFiles,
  'app-settings': appSettings,
  'keyboard': keyboard,
  'insight-bulb': insightBulb,
  'tune-wrench': tuneWrench,
}

export function getIcon(id) {
  return ICONS[id] || null
}
