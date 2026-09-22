// src/content/file-permission/data.js
export const VW = 820
export const VH = 1340

export const PHASES = [
  {
    id: 'anatomy',
    badge: '1. ANATOMI STRING',
    badgeColor: '#60A5FA',
    title: 'Membaca String Permission',
    caption: '1 digit tipe file + 9 digit dibagi menjadi 3 entitas (Owner, Group, Others).',
    duration: 6.5,
  },
  {
    id: 'octal_math',
    badge: '2. MATEMATIKA BOBOT (4-2-1)',
    badgeColor: '#FBBF24',
    title: 'Bagaimana Angka chmod Dihitung',
    caption: 'Tiap huruf punya nilai pasti: r=4, w=2, x=1. Jumlahkan tiap blok jadi angka oktal.',
    duration: 7.5,
  },
  {
    id: 'simulation',
    badge: '3. SIMULASI AKSES (754)',
    badgeColor: '#4ADE80',
    title: 'Live Security Gate Evaluation',
    caption: 'Live test: Kapsul aksi dikirim ke target file. Izin di-evaluasi real-time oleh Security Gate!',
    duration: 9.0,
  },
  {
    id: 'recipes',
    badge: '4. CHEAT SHEET & DANGER 777',
    badgeColor: '#F43F5E',
    title: 'Resep Standar & Bahaya chmod 777',
    caption: 'Gunakan 600 untuk kunci rahasia, 644 untuk web, 755 untuk script. JANGAN 777 di production!',
    duration: 7.0,
  },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const SIMULATION_SCENARIOS = [
  {
    entityId: 'owner',
    title: 'OWNER (u) Mencoba Akses File',
    actorLabel: 'OWNER (USER)',
    actorRole: 'Role: Pemilik File (u)',
    actorColor: '#C084FC',
    actorBg: '#2E1065',
    actorBorder: '#A855F7',
    permOctal: '7',
    permString: 'r w x',
    actions: [
      { id: 'act-1', type: 'READ', cmd: '$ cat report.sh', label: 'BACA (r)', bit: 'r (4)', allowed: true, response: '200 OK · Data Disajikan' },
      { id: 'act-2', type: 'WRITE', cmd: '$ nano report.sh', label: 'TULIS (w)', bit: 'w (2)', allowed: true, response: '200 OK · File Diperbarui' },
      { id: 'act-3', type: 'EXEC', cmd: '$ ./report.sh', label: 'RUN (x)', bit: 'x (1)', allowed: true, response: '200 OK · Script Dieksekusi' },
    ],
  },
  {
    entityId: 'group',
    title: 'GROUP (g) Mencoba Akses File',
    actorLabel: 'GROUP MEMBER',
    actorRole: 'Role: Teman 1 Tim (g)',
    actorColor: '#38BDF8',
    actorBg: '#082F49',
    actorBorder: '#0284C7',
    permOctal: '5',
    permString: 'r - x',
    actions: [
      { id: 'act-1', type: 'READ', cmd: '$ cat report.sh', label: 'BACA (r)', bit: 'r (4)', allowed: true, response: '200 OK · Lolos Gate' },
      { id: 'act-2', type: 'WRITE', cmd: '$ echo "hack" >> file', label: 'TULIS (w)', bit: '- (0)', allowed: false, response: '403 BLOCKED · Bit w Tidak Aktif (-)' },
      { id: 'act-3', type: 'EXEC', cmd: '$ ./report.sh', label: 'RUN (x)', bit: 'x (1)', allowed: true, response: '200 OK · Lolos Gate' },
    ],
  },
  {
    entityId: 'others',
    title: 'OTHERS (o) Mencoba Akses File',
    actorLabel: 'OTHERS (PUBLIC)',
    actorRole: 'Role: Publik / Anonymous (o)',
    actorColor: '#94A3B8',
    actorBg: '#1E293B',
    actorBorder: '#64748B',
    permOctal: '4',
    permString: 'r - -',
    actions: [
      { id: 'act-1', type: 'READ', cmd: '$ cat report.sh', label: 'BACA (r)', bit: 'r (4)', allowed: true, response: '200 OK · Read Publik Diizinkan' },
      { id: 'act-2', type: 'WRITE', cmd: '$ rm report.sh', label: 'HAPUS (w)', bit: '- (0)', allowed: false, response: '403 BLOCKED · Permission Denied' },
      { id: 'act-3', type: 'EXEC', cmd: '$ ./report.sh', label: 'RUN (x)', bit: '- (0)', allowed: false, response: '403 BLOCKED · Execution Denied' },
    ],
  },
]

export const STRING_PARTS = [
  { char: '-', type: 'type', label: 'File Biasa', color: '#94A3B8' },
  // Owner (u)
  { char: 'r', entity: 'owner', weight: 4, label: 'Read (4)', color: '#38BDF8', active: true },
  { char: 'w', entity: 'owner', weight: 2, label: 'Write (2)', color: '#34D399', active: true },
  { char: 'x', entity: 'owner', weight: 1, label: 'Exec (1)', color: '#F472B6', active: true },
  // Group (g)
  { char: 'r', entity: 'group', weight: 4, label: 'Read (4)', color: '#38BDF8', active: true },
  { char: '-', entity: 'group', weight: 0, label: 'No Write (0)', color: '#475569', active: false },
  { char: 'x', entity: 'group', weight: 1, label: 'Exec (1)', color: '#F472B6', active: true },
  // Others (o)
  { char: 'r', entity: 'others', weight: 4, label: 'Read (4)', color: '#38BDF8', active: true },
  { char: '-', entity: 'others', weight: 0, label: 'No Write (0)', color: '#475569', active: false },
  { char: '-', entity: 'others', weight: 0, label: 'No Exec (0)', color: '#475569', active: false },
]

export const ENTITIES = [
  {
    id: 'owner',
    code: 'u',
    name: 'OWNER (User)',
    desc: 'Pembuat file',
    color: '#A855F7',
    bg: '#2E1065',
    border: '#A855F7',
    chars: ['r', 'w', 'x'],
    weights: [4, 2, 1],
    sum: 7,
    sumFormula: '4 + 2 + 1',
    permissions: [
      { name: 'READ', icon: 'eye', allowed: true },
      { name: 'WRITE', icon: 'edit', allowed: true },
      { name: 'EXECUTE', icon: 'play', allowed: true },
    ],
  },
  {
    id: 'group',
    code: 'g',
    name: 'GROUP',
    desc: 'Tim / member group',
    color: '#38BDF8',
    bg: '#082F49',
    border: '#38BDF8',
    chars: ['r', '-', 'x'],
    weights: [4, 0, 1],
    sum: 5,
    sumFormula: '4 + 0 + 1',
    permissions: [
      { name: 'READ', icon: 'eye', allowed: true },
      { name: 'WRITE', icon: 'edit', allowed: false },
      { name: 'EXECUTE', icon: 'play', allowed: true },
    ],
  },
  {
    id: 'others',
    code: 'o',
    name: 'OTHERS',
    desc: 'Publik / siapapun',
    color: '#94A3B8',
    bg: '#1E293B',
    border: '#64748B',
    chars: ['r', '-', '-'],
    weights: [4, 0, 0],
    sum: 4,
    sumFormula: '4 + 0 + 0',
    permissions: [
      { name: 'READ', icon: 'eye', allowed: true },
      { name: 'WRITE', icon: 'edit', allowed: false },
      { name: 'EXECUTE', icon: 'play', allowed: false },
    ],
  },
]

export const RECIPES = [
  {
    mode: '600',
    octal: 'rw-------',
    title: 'PRIVATE VAULT',
    metaphor: 'Brankas Rahasia (Hanya Kamu)',
    cmd: '$ chmod 600 ~/.ssh/id_rsa',
    useCase: 'Wajib untuk SSH Key, Token API, file .env & sertifikat privat.',
    color: '#C084FC',
    bg: '#2E1065',
    border: '#A855F7',
    badgeText: '🔒 ULTRA SECURE',
    safe: true,
    triads: [
      { role: 'Owner (u)', perm: 'rw-', val: '6', desc: 'Read & Write', color: '#C084FC', allowed: true },
      { role: 'Group (g)', perm: '---', val: '0', desc: 'No Access (✕)', color: '#475569', allowed: false },
      { role: 'Others (o)', perm: '---', val: '0', desc: 'No Access (✕)', color: '#475569', allowed: false },
    ],
  },
  {
    mode: '644',
    octal: 'rw-r--r--',
    title: 'PUBLIC WEB & DOCS',
    metaphor: 'Etalase Kaca (Bebas Baca, Owner Edit)',
    cmd: '$ chmod 644 /var/www/index.html',
    useCase: 'Standar untuk file HTML, CSS, gambar, config publik server web.',
    color: '#38BDF8',
    bg: '#082F49',
    border: '#0284C7',
    badgeText: '📄 STANDARD SAFE',
    safe: true,
    triads: [
      { role: 'Owner (u)', perm: 'rw-', val: '6', desc: 'Read & Write', color: '#38BDF8', allowed: true },
      { role: 'Group (g)', perm: 'r--', val: '4', desc: 'Read Only (✓)', color: '#38BDF8', allowed: true },
      { role: 'Others (o)', perm: 'r--', val: '4', desc: 'Read Only (✓)', color: '#38BDF8', allowed: true },
    ],
  },
  {
    mode: '755',
    octal: 'rwxr-xr-x',
    title: 'SCRIPT & EXECUTABLE',
    metaphor: 'Mesin Publik (Semua Jalankan, Owner Modif)',
    cmd: '$ chmod 755 /usr/local/bin/deploy.sh',
    useCase: 'Standar aplikasi binary, file bash script (.sh), tools CLI & bot.',
    color: '#34D399',
    bg: '#064E3B',
    border: '#059669',
    badgeText: '⚡ EXECUTABLE SAFE',
    safe: true,
    triads: [
      { role: 'Owner (u)', perm: 'rwx', val: '7', desc: 'Full Access (✓)', color: '#34D399', allowed: true },
      { role: 'Group (g)', perm: 'r-x', val: '5', desc: 'Read & Exec (✓)', color: '#34D399', allowed: true },
      { role: 'Others (o)', perm: 'r-x', val: '5', desc: 'Read & Exec (✓)', color: '#34D399', allowed: true },
    ],
  },
  {
    mode: '777',
    octal: 'rwxrwxrwx',
    title: '🚨 CRITICAL HAZARD!',
    metaphor: 'Pintu Terbuka Lebar (Semua Orang Bebas Hapus/Edit)',
    cmd: '$ chmod 777 * (JANGAN PERNAH PAKAI!)',
    useCase: 'Celah empuk malware/hacker! Jangan gunakan di server production.',
    color: '#F43F5E',
    bg: '#4C0519',
    border: '#E11D48',
    badgeText: '⚠️ DANGER: DO NOT USE',
    safe: false,
    triads: [
      { role: 'Owner (u)', perm: 'rwx', val: '7', desc: 'Full Access', color: '#F43F5E', allowed: true },
      { role: 'Group (g)', perm: 'rwx', val: '7', desc: 'Full Access (⚠️)', color: '#F43F5E', allowed: true },
      { role: 'Others (o)', perm: 'rwx', val: '7', desc: 'Full Access (🚨)', color: '#F43F5E', allowed: true },
    ],
  },
]




