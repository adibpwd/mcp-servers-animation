// src/content/container-docker/icons/loader.js
import laptopIcon from './laptop.png'
import isolationWallThickIcon from './isolation-wall-thick.png'
import isolationWallThinIcon from './isolation-wall-thin.png'
import hypervisorIcon from './hypervisor-icon.png'
import guestOsIcon from './guest-os-icon.png'
import hostKernelIcon from './host-kernel-icon.png'
import dockerEngineIcon from './docker-engine-icon.png'
import containerIcon from './container-icon.png'
import nodeIcon from './node-icon.png'
import pythonIcon from './python-icon.png'
import redisIcon from './redis-icon.png'
import hardwareIcon from './hardware-icon.png'
import chipIcon from './chip-icon.png'

export const ICONS = {
  'laptop': laptopIcon,
  'isolation-wall-thick': isolationWallThickIcon,
  'isolation-wall-thin': isolationWallThinIcon,
  'hypervisor-icon': hypervisorIcon,
  'guest-os-icon': guestOsIcon,
  'host-kernel-icon': hostKernelIcon,
  'docker-engine-icon': dockerEngineIcon,
  'container-icon': containerIcon,
  'node-icon': nodeIcon,
  'python-icon': pythonIcon,
  'redis-icon': redisIcon,
  'hardware-icon': hardwareIcon,
  'chip-icon': chipIcon,
}

export function getIcon(id) {
  return ICONS[id] || null
}
