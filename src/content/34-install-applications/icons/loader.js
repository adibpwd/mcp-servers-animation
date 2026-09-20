import defaultIcon from './default-icon.png'

import packageBoxIcon from './package-box.png'
import repoShelfIcon from './repo-shelf.png'
import mirrorServerIcon from './mirror-server.png'
import metadataCatalogIcon from './metadata-catalog.png'
import dependencyNodesIcon from './dependency-nodes.png'
import cacheTrayIcon from './cache-tray.png'
import trustKeyIcon from './trust-key.png'
import downloadArrowIcon from './download-arrow.png'
import verifySealIcon from './verify-seal.png'
import unpackBoxIcon from './unpack-box.png'
import configureGearIcon from './configure-gear.png'
import packageLedgerIcon from './package-ledger.png'

import ubuntuLogoIcon from './ubuntu-logo.png'
import debianLogoIcon from './debian-logo.png'
import fedoraLogoIcon from './fedora-logo.png'
import archLogoIcon from './arch-logo.png'
import opensuseLogoIcon from './opensuse-logo.png'
import alpineLogoIcon from './alpine-logo.png'

export const ICONS = {
  'package-box': packageBoxIcon,
  'repo-shelf': repoShelfIcon,
  'mirror-server': mirrorServerIcon,
  'metadata-catalog': metadataCatalogIcon,
  'dependency-nodes': dependencyNodesIcon,
  'cache-tray': cacheTrayIcon,
  'trust-key': trustKeyIcon,
  'download-arrow': downloadArrowIcon,
  'verify-seal': verifySealIcon,
  'unpack-box': unpackBoxIcon,
  'configure-gear': configureGearIcon,
  'package-ledger': packageLedgerIcon,

  'ubuntu-logo': ubuntuLogoIcon,
  'debian-logo': debianLogoIcon,
  'fedora-logo': fedoraLogoIcon,
  'arch-logo': archLogoIcon,
  'opensuse-logo': opensuseLogoIcon,
  'alpine-logo': alpineLogoIcon,
}

export function getIcon(id) {
  return ICONS[id] || null
}
