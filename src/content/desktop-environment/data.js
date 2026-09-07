// src/content/desktop-environment/data.js
export const VW = 820
export const VH = 1340

// Act 1 = hook, bukan jawaban. Dilempar sebelum masuk ke 4 Act DE.
// Reframe: dari "Laptop 4GB" → langsung ke "4 tipe pengguna Linux" (persona matching)
export const HOOK = {
  question: ['Linux itu bukan satu "wajah"...', 'kamu yang mana dari 4 tipe ini?'],
  sub: 'Tonton sambil nebak — ini gue banget gak? 👀',
  duration: 3.4,
}

// Tiap Act = babak cerita: setup -> tension -> insight (titik balik) -> caption (cliffhanger/payoff)
// Setiap Act sekarang dimulai dengan PERSONA LINE, bukan pertanyaan teknis.
export const PHASES = [
  {
    id: 'gnome',
    badge: 'GNOME',
    badgeColor: '#38BDF8',
    reaction: 'worried',
    setup: 'Kamu tipe yang pindahan dari Mac? Pengen desktop yang simpel, rapi, gak banyak distraksi?',
    tension: 'Tampilannya memang cantik... blur & animasi halus jalan real-time. Lihat berapa RAM-nya pas idle?',
    insight: ['Semua efek blur & animasi', 'jalan LANGSUNG di GPU, makanya rakus'],
    caption: 'Modern, mulus, elegan — tapi kalau laptop mid-spec bisa terasa heavy. Next tipe user? 🤔',
    duration: 7.2,
    persona: 'Pindahan dari Mac, mau yang simpel & rapi',
  },
  {
    id: 'kde',
    badge: 'KDE PLASMA',
    badgeColor: '#34D399',
    reaction: 'curious',
    setup: 'Atau kamu tipe pengguna yang doyan ngoprek? Pengen SEMUA bisa diatur, dari warna sampai efek?',
    tension: 'KDE punya kontrol paling detail — widget, tema, shortcut, semuanya ada. Tapi fitur numpuk = RAM juga cukup dimakan.',
    insight: ['Fleksibilitas maksimal', 'tapi tetap ada harga yang dibayar'],
    caption: 'Super customizable, performa balance — tapi ada yang lebih ringan lagi, kan? 🤔',
    duration: 7.2,
    persona: 'Doyan ngoprek, pengen semua bisa diatur',
  },
  {
    id: 'xfce',
    badge: 'XFCE',
    badgeColor: '#FBBF24',
    reaction: 'relieved',
    setup: 'Kamu yang punya laptop udah 5-6 tahun, RAM cuma 4GB, takut kalo ditambah OS malah jadi lemot?',
    tension: 'XFCE didesain KHUSUS buat ini — sengaja buang animasi berat. Lihat bedanya di RAM usage vs yang lain?',
    insight: ['Animasi berat dibuang', 'fokus ke responsivitas & stabilitas'],
    caption: 'Ringan, cepat, stabil — tapi pakai mouse biasa. Ada yang lebih ekstrim? 😎',
    duration: 7.2,
    persona: 'Laptop lawas, takut lemot, prioritas stabil',
  },
  {
    id: 'i3',
    badge: 'i3 WM (Tiling)',
    badgeColor: '#F87171',
    reaction: 'mindblown',
    setup: 'Atau kamu developer yang keyboard-warrior? Gak sabaran pake mouse, mau workflow super efisien?',
    tension: 'i3 itu tiling window manager — semua dikontrol keyboard, gak ada mouse sama sekali. RAM usage? Praktis nol.',
    insight: ['Keyboard-only workflow', '= efisiensi maksimal, resource minimal'],
    caption: 'Super ringan, super cepat — tapi learning curve curam. Kamu siap? ⌨️',
    duration: 7.2,
    persona: 'Developer/keyboard-warrior, mouse-free workflow',
  }
]

// Act akhir = payoff, jawab hook di awal secara eksplisit.
export const CLOSING = {
  title: 'Jadi, dari 4 tipe user itu... kamu masuk yang mana?',
  answer: 'Gak ada yang "terbaik" — cuma yang PALING PAS sama spek laptop & gaya kerja kamu. Setiap DE dirancang buat user berbeda.',
  duration: 5.0,
}

export const DE_DATA = [
  {
    id: 'gnome',
    name: 'GNOME',
    ram: '1.2 GB - 2.0 GB',
    ramValue: 85, // out of 100
    cpu: 60,
    custom: 30,
    style: 'Modern & Minimalis',
    color: '#38BDF8',
    distro: 'Ubuntu, Fedora',
    useCase: ['Laptop kencang,', 'suka tampilan modern'],
    persona: 'Pindahan dari Mac, mau yang simpel & rapi',
  },
  {
    id: 'kde',
    name: 'KDE Plasma',
    ram: '900 MB - 1.5 GB',
    ramValue: 65,
    cpu: 45,
    custom: 95,
    style: 'Feature-Rich',
    color: '#34D399',
    distro: 'Kubuntu, Manjaro KDE',
    useCase: ['Suka ngoprek &', 'custom abis-abisan'],
    persona: 'Doyan ngoprek, pengen semua bisa diatur',
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
    distro: 'Xubuntu, Linux Mint XFCE',
    useCase: ['Laptop lawas,', 'prioritas stabil'],
    persona: 'Laptop lawas, takut lemot, prioritas stabil',
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
    distro: 'Arch Linux, Manjaro i3',
    useCase: ['Power user,', 'mouse-free workflow'],
    persona: 'Developer/keyboard-warrior, mouse-free workflow',
  }
]

export const COUNTER_START = 0
