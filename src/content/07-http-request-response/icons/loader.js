// Icon loader utility for http-request-response animation
//
// 7 icon batch-1 ter-generate via ChatGPT (extension vm-icon-generator)
// dan sudah di-crop jadi PNG individual di folder ini. Lihat
// revisi/2026-09-09-1820-revisi-01.md untuk histori plan/eksekusinya.
//
// Batch-2 (karakter officer + stamp + bangunan) & batch-3 (payload data +
// network journey) di-generate & wiring-nya di revisi/2026-09-10-revisi-02.md
// (Addendum Batch-2 & Batch-3).

import defaultIcon from './default-icon.png'
import envelopeClosedIcon from './envelope-closed.png'
import envelopeOpenIcon from './envelope-open.png'
import addressBookIcon from './address-book.png'
import checkmarkIcon from './checkmark-icon.png'
import questionIcon from './question-icon.png'
import insightIcon from './insight-icon.png'
import teaseIcon from './tease-icon.png'

// batch-2 — karakter & status stamps
import officerNeutralIcon from './officer-neutral.png'
import officerThinkingIcon from './officer-thinking.png'
import officerHappyIcon from './officer-happy.png'
import stampApprovedIcon from './stamp-approved.png'
import stampRejectedIcon from './stamp-rejected.png'
import serverBuildingIcon from './server-building.png'
import browserFrameIcon from './browser-frame.png'

// batch-3 — data payload & network journey
import methodGetIcon from './method-get.png'
import htmlDocumentIcon from './html-document.png'
import cssDocumentIcon from './css-document.png'
import jsDocumentIcon from './js-document.png'
import dnsMagnifyIcon from './dns-magnify.png'
import tcpHandshakeIcon from './tcp-handshake.png'
import packetFlyIcon from './packet-fly.png'

// batch-4 — flowchart states & spine (revisi-03)
import browserFilledIcon from './browser-filled.png'
import browserLoadingIcon from './browser-loading.png'
import dnsResolvedIcon from './dns-resolved.png'
import serverActiveIcon from './server-active.png'
import pathForwardArrowIcon from './path-forward-arrow.png'
import pathReturnArrowIcon from './path-return-arrow.png'

export const ICONS = {
  'envelope-closed': envelopeClosedIcon,
  'envelope-open': envelopeOpenIcon,
  'address-book': addressBookIcon,
  'checkmark-icon': checkmarkIcon,
  'question-icon': questionIcon,
  'insight-icon': insightIcon,
  'tease-icon': teaseIcon,

  'officer-neutral': officerNeutralIcon,
  'officer-thinking': officerThinkingIcon,
  'officer-happy': officerHappyIcon,
  'stamp-approved': stampApprovedIcon,
  'stamp-rejected': stampRejectedIcon,
  'server-building': serverBuildingIcon,
  'browser-frame': browserFrameIcon,

  'method-get': methodGetIcon,
  'html-document': htmlDocumentIcon,
  'css-document': cssDocumentIcon,
  'js-document': jsDocumentIcon,
  'dns-magnify': dnsMagnifyIcon,
  'tcp-handshake': tcpHandshakeIcon,
  'packet-fly': packetFlyIcon,

  'browser-filled': browserFilledIcon,
  'browser-loading': browserLoadingIcon,
  'dns-resolved': dnsResolvedIcon,
  'server-active': serverActiveIcon,
  'path-forward-arrow': pathForwardArrowIcon,
  'path-return-arrow': pathReturnArrowIcon,
}

export function getIcon(id) {
  return ICONS[id] || defaultIcon
}
