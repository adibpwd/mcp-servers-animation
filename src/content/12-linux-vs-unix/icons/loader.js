// Icon loader — Linux vs Unix animation
// Real brand/distro logos + history/concept icons, all monochrome PNG (transparent bg)

// ── History & Roots ──
import pdp7Icon from './pdp7.png'
import bellLabsIcon from './bell-labs.png'
import bellLabsV2Icon from './bell-labs-v2.png'
import cLanguageIcon from './c-language.png'
import cLanguageV2Icon from './c-language-v2.png'
import posixIcon from './posix.png'
import linusIcon from './linus.png'
import gnuFsfIcon from './gnu-fsf.png'
import terminalHackerIcon from './terminal-hacker.png'

// ── Real person photos (CC-licensed from Wikimedia Commons) ──
import ktPhotoIcon from './kt-photo.jpg'
import drPhotoIcon from './dr-photo.jpg'
import linusPhotoIcon from './linus-photo.jpg'

// ── Ecosystem Concepts ──
import tuxIcon from './tux.png'
import bsdDaemonIcon from './bsd-daemon.png'
import distroTreeIcon from './distro-tree.png'
import cloudServerIcon from './cloud-server.png'
import supercomputerIcon from './supercomputer.png'
import wslBridgeIcon from './wsl-bridge.png'

// ── Unix Family (real brand logos) ──
import macosIcon from './macos.png'
import solarisIcon from './solaris.png'
import aixIcon from './aix.png'
import hpuxIcon from './hpux.png'
import freebsdIcon from './freebsd.png'

// ── Linux Family + Windows (real brand logos) ──
import androidIcon from './android.png'
import ubuntuIcon from './ubuntu.png'
import fedoraIcon from './fedora.png'
import archIcon from './arch.png'
import debianIcon from './debian.png'
import windowsIcon from './windows.png'

// ── Linux Distro Batch 5/6 (newer/additional distros) ──
import slackwareIcon from './slackware.png'
import redhatIcon from './redhat.png'
import suseIcon from './suse.png'
import gentooIcon from './gentoo.png'
import centosIcon from './centos.png'
import mintIcon from './mint.png'
import manjaroIcon from './manjaro.png'
import poposIcon from './popos.png'

export const ICONS = {
  // History & Roots
  pdp7: pdp7Icon,
  'bell-labs': bellLabsIcon,
  'bell-labs-v2': bellLabsV2Icon,
  'c-language': cLanguageIcon,
  'c-language-v2': cLanguageV2Icon,
  posix: posixIcon,
  linus: linusIcon,
  'gnu-fsf': gnuFsfIcon,
  'terminal-hacker': terminalHackerIcon,

  // Real person photos
  'kt-photo': ktPhotoIcon,
  'dr-photo': drPhotoIcon,
  'linus-photo': linusPhotoIcon,

  // Ecosystem Concepts
  tux: tuxIcon,
  'bsd-daemon': bsdDaemonIcon,
  'distro-tree': distroTreeIcon,
  'cloud-server': cloudServerIcon,
  supercomputer: supercomputerIcon,
  'wsl-bridge': wslBridgeIcon,

  // Unix Family
  macos: macosIcon,
  solaris: solarisIcon,
  aix: aixIcon,
  hpux: hpuxIcon,
  freebsd: freebsdIcon,

  // Linux Family + Windows
  android: androidIcon,
  ubuntu: ubuntuIcon,
  fedora: fedoraIcon,
  arch: archIcon,
  debian: debianIcon,
  windows: windowsIcon,

  // Linux Distro Batch 5/6
  slackware: slackwareIcon,
  redhat: redhatIcon,
  suse: suseIcon,
  gentoo: gentooIcon,
  centos: centosIcon,
  mint: mintIcon,
  manjaro: manjaroIcon,
  popos: poposIcon,
}

export const getIcon = (id) => ICONS[id] || null
