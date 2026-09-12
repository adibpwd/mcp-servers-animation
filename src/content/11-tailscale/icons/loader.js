// Icon loader utility for Tailscale animation
// Import all icons as assets

import wireguardKeyIcon from './wireguard-key.png'
import coordinationServerIcon from './coordination-server.png'
import derpRelayIcon from './derp-relay.png'
import meshNetworkIcon from './mesh-network.png'
import tailscaleLogoIcon from './tailscale-logo.png'
import mobilePhoneIcon from './mobile-phone.png'

// ── structural icons (batch-1, 100% icon-driven redesign) ──
import cloudInternetIcon from './cloud-internet.png'
import firewallNormalIcon from './firewall-normal.png'
import firewallStrictIcon from './firewall-strict.png'
import faceSurprisedIcon from './face-surprised.png'
import faceHappyIcon from './face-happy.png'
import houseFrameIcon from './house-frame.png'
import buildingFrameIcon from './building-frame.png'
import laptopDangerIcon from './laptop-danger.png'
import laptopCryptoIcon from './laptop-crypto.png'
import laptopServerIcon from './laptop-server.png'
import laptopSuccessIcon from './laptop-success.png'

export const ICONS = {
  'wireguard-key': wireguardKeyIcon,
  'coordination-server': coordinationServerIcon,
  'derp-relay': derpRelayIcon,
  'mesh-network': meshNetworkIcon,
  'tailscale-logo': tailscaleLogoIcon,
  'mobile-phone': mobilePhoneIcon,

  'cloud-internet': cloudInternetIcon,
  'firewall-normal': firewallNormalIcon,
  'firewall-strict': firewallStrictIcon,
  'face-surprised': faceSurprisedIcon,
  'face-happy': faceHappyIcon,
  'house-frame': houseFrameIcon,
  'building-frame': buildingFrameIcon,
  'laptop-danger': laptopDangerIcon,
  'laptop-crypto': laptopCryptoIcon,
  'laptop-server': laptopServerIcon,
  'laptop-success': laptopSuccessIcon,
}

export function getIcon(id) {
  return ICONS[id] || null
}
