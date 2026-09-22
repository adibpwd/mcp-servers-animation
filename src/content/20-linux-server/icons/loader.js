// src/content/91-linux-server/icons/loader.js
// ─────────────────────────────────────────────────────────────
// Pola sama dengan src/content/11-tailscale/icons/loader.js
// (docs/standardizations/05 §6.1): static import per PNG + ICONS map.
// getIcon(id) return null bila id belum di-wire → komponen Icon di
// Animation.jsx fallback ke kotak dashed berlabel (tidak pernah crash).
//
// Batch 1-3 (21 icon): AKTIF.
// Batch 4 (7 icon): SENGAJA belum di-wire. PNG-nya RGB tanpa alpha —
// checkerboard "transparan" dari preview ChatGPT ikut ter-bake jadi
// piksel (75-88% abu-abu opaque), sehingga tampil sebagai kotak abu-abu
// di atas background #070913. Regenerate batch-4 dengan background
// transparan sungguhan, lalu uncomment baris batch-4 di bawah.
// ─────────────────────────────────────────────────────────────
import defaultIcon from './default-icon.png'

// Batch 1 — actor inti
import clientPhoneIcon from './client-phone.png'
import serverRackIcon from './server-rack.png'
import laptopMachineIcon from './laptop-machine.png'
import vmPartitionIcon from './vm-partition.png'
import cloudInstanceIcon from './cloud-instance.png'
import miniPcIcon from './mini-pc.png'
import webAppCardIcon from './web-app-card.png'

// Batch 2 — jalur masuk & service
import dnsBookIcon from './dns-book.png'
import internetCloudIcon from './internet-cloud.png'
import routerHopIcon from './router-hop.png'
import firewallWallIcon from './firewall-wall.png'
import listeningSocketIcon from './listening-socket.png'
import serviceManagerIcon from './service-manager.png'
import dependencyChainIcon from './dependency-chain.png'

// Batch 3 — identity, data, bukti
import userBadgeIcon from './user-badge.png'
import userGroupIcon from './user-group.png'
import serviceAccountIcon from './service-account.png'
import dataVaultIcon from './data-vault.png'
import sshKeyIcon from './ssh-key.png'
import logScrollIcon from './log-scroll.png'
import alertBellIcon from './alert-bell.png'

// Batch 4 — operasi, kapasitas, pemulihan (DITAHAN: background bukan transparan)
// import monitorDashboardIcon from './monitor-dashboard.png'
// import releasePackageIcon from './release-package.png'
// import stagingPadIcon from './staging-pad.png'
// import backupVaultIcon from './backup-vault.png'
// import restoreCycleIcon from './restore-cycle.png'
// import runbookDocIcon from './runbook-doc.png'
// import cpuChipIcon from './cpu-chip.png'

export const ICONS = {
  // Batch 1
  'client-phone': clientPhoneIcon,
  'server-rack': serverRackIcon,
  'laptop-machine': laptopMachineIcon,
  'vm-partition': vmPartitionIcon,
  'cloud-instance': cloudInstanceIcon,
  'mini-pc': miniPcIcon,
  'web-app-card': webAppCardIcon,
  // Batch 2
  'dns-book': dnsBookIcon,
  'internet-cloud': internetCloudIcon,
  'router-hop': routerHopIcon,
  'firewall-wall': firewallWallIcon,
  'listening-socket': listeningSocketIcon,
  'service-manager': serviceManagerIcon,
  'dependency-chain': dependencyChainIcon,
  // Batch 3
  'user-badge': userBadgeIcon,
  'user-group': userGroupIcon,
  'service-account': serviceAccountIcon,
  'data-vault': dataVaultIcon,
  'ssh-key': sshKeyIcon,
  'log-scroll': logScrollIcon,
  'alert-bell': alertBellIcon,
  // Batch 4 (ditahan)
  // 'monitor-dashboard': monitorDashboardIcon,
  // 'release-package': releasePackageIcon,
  // 'staging-pad': stagingPadIcon,
  // 'backup-vault': backupVaultIcon,
  // 'restore-cycle': restoreCycleIcon,
  // 'runbook-doc': runbookDocIcon,
  // 'cpu-chip': cpuChipIcon,
}

export const DEFAULT_ICON = defaultIcon

/** Return the PNG asset for `id`, or null if not wired yet (caller
 * must fall back to inline SVG — lihat komponen Icon di Animation.jsx). */
export function getIcon(id) {
  return ICONS[id] || null
}
