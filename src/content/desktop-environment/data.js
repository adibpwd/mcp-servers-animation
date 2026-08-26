// src/content/desktop-environment/data.js
export const VW = 820
export const VH = 1340

export const PHASES = [
  {
    id: 'gnome',
    badge: 'GNOME',
    badgeColor: '#38BDF8',
    caption: 'Modern & mulus, tapi cukup rakus resource. Workflow mirip macOS.',
    duration: 6.0,
  },
  {
    id: 'kde',
    badge: 'KDE PLASMA',
    badgeColor: '#34D399',
    caption: 'Sangat bisa dikustomisasi. Fitur melimpah, workflow mirip Windows.',
    duration: 6.0,
  },
  {
    id: 'xfce',
    badge: 'XFCE',
    badgeColor: '#FBBF24',
    caption: 'Ringan, responsif, dan stabil. Sangat cocok untuk PC atau laptop lawas.',
    duration: 6.0,
  },
  {
    id: 'i3',
    badge: 'i3 WM (Tiling)',
    badgeColor: '#F87171',
    caption: 'Super ringan! Tanpa mouse, semua pakai shortcut keyboard (Tiling).',
    duration: 6.0,
  }
]

export const DE_DATA = [
  {
    id: 'gnome',
    name: 'GNOME',
    ram: '1.2 GB - 2.0 GB',
    ramValue: 85, // out of 100
    cpu: 60,
    custom: 30, // low customization by default
    style: 'Modern & Minimalis',
    color: '#38BDF8',
    distro: 'Ubuntu, Fedora'
  },
  {
    id: 'kde',
    name: 'KDE Plasma',
    ram: '900 MB - 1.5 GB',
    ramValue: 65,
    cpu: 45,
    custom: 95, // extremely customizable
    style: 'Feature-Rich',
    color: '#34D399',
    distro: 'Kubuntu, Manjaro KDE'
  },
  {
    id: 'xfce',
    name: 'XFCE',
    ram: '400 MB - 600 MB',
    ramValue: 25,
    cpu: 20,
    custom: 60,
    style: 'Klasik & Ringan',
    color: '#FBBF24',
    distro: 'Xubuntu, Linux Mint XFCE'
  },
  {
    id: 'i3',
    name: 'i3 / Sway',
    ram: '150 MB - 250 MB',
    ramValue: 10,
    cpu: 5,
    custom: 90,
    style: 'Tiling & Keyboard-Driven',
    color: '#F87171',
    distro: 'Arch Linux, Manjaro i3'
  }
]

export const COUNTER_START = 0
