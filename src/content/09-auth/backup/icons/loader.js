// src/content/18-auth/icons/loader.js
import entranceGateIcon from './entrance-gate.png'
import gatekeeperOfficerIcon from './gatekeeper-officer.png'
import lockedEnvelopeIcon from './locked-envelope.png'
import idCardBlankIcon from './id-card-blank.png'
import guestbookOpenIcon from './guestbook-open.png'
import intruderSilhouetteIcon from './intruder-silhouette.png'
import hashMachineIcon from './hash-machine.png'
import visitorBadgeIcon from './visitor-badge.png'
import frontDeskIcon from './front-desk.png'
import magicSealTokenIcon from './magic-seal-token.png'
import doorOfficerAIcon from './door-officer-a.png'
import doorOfficerBIcon from './door-officer-b.png'
import restrictedDoorIcon from './restricted-door.png'
import stampAuthenticatedAuthorizedIcon from './stamp-authenticated-authorized.png'

export const ICONS = {
  'entrance-gate': entranceGateIcon,
  'gatekeeper-officer': gatekeeperOfficerIcon,
  'locked-envelope': lockedEnvelopeIcon,
  'id-card-blank': idCardBlankIcon,
  'guestbook-open': guestbookOpenIcon,
  'intruder-silhouette': intruderSilhouetteIcon,
  'hash-machine': hashMachineIcon,
  'visitor-badge': visitorBadgeIcon,
  'front-desk': frontDeskIcon,
  'magic-seal-token': magicSealTokenIcon,
  'door-officer-a': doorOfficerAIcon,
  'door-officer-b': doorOfficerBIcon,
  'restricted-door': restrictedDoorIcon,
  'stamp-authenticated-authorized': stampAuthenticatedAuthorizedIcon,
}

export function getIcon(id) {
  return ICONS[id] || null
}
