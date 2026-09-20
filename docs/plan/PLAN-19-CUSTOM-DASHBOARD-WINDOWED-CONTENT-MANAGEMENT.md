
# PLAN-19 — Custom Dashboard dan Windowed Content Management

| Item | Keputusan |
|---|---|
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Masalah | Saat card diklik, dashboard berpindah ke `/preview/:id`; hanya satu player dapat dilihat. |
| Target | Dashboard desktop-like dengan jendela content internal, dapat membuka beberapa content sekaligus. |
| Batas | Tidak membuat native OS window, tidak mengganti export pipeline, dan tidak menghapus direct preview route. |

## 1. Outcome

Dashboard menjadi workspace, bukan hanya list/kanban. Setiap content card mempunyai
tombol **Open window**. Tombol ini membuka player dalam jendela internal yang
dapat dipindah, difokuskan, diminimalkan, dimaksimalkan, dipulihkan, dan ditutup.
Beberapa content tetap terbuka pada satu waktu.

```text
Card “SSH” ── Open window ──> Window SSH aktif
Card “Shell” ─ Open window ──> Window Shell tampil di depan
Dock: [SSH] [Shell] ─────────> klik item mengembalikan focus window
```

Route `/preview/:id` tetap sebagai direct link, bookmark, fallback, dan mode
fokus satu content. Dashboard tidak lagi harus meninggalkannya untuk membuka
content kedua.

## 2. Audit kondisi sekarang

| Bagian | Perilaku sekarang | Dampak |
|---|---|---|
| `ContentManagement.jsx` | Callback klik menjalankan `navigate('/preview/:id')`. | Dashboard hilang ketika player dibuka. |
| `ListView.jsx` | Klik row membuka content. | Perlu aksi Open eksplisit agar tidak bentrok dengan priority. |
| `KanbanView.jsx` | Klik card membuka content; drag memindahkan status. | Tombol Open harus tidak mengganggu drag. |
| `PlayerPage.jsx` | Resolve satu id route dan render satu `PlayerShell`. | Lifecycle hanya dirancang untuk halaman tunggal. |
| `PlayerShell.jsx` | Mengelola play/pause, audio, export, settings, progress, caption. | Banyak instance memerlukan scope per-window agar state tidak bertabrakan. |

## 3. Prinsip produk

1. **Card tetap management-first.** Tombol Open window adalah aksi eksplisit;
   klik title dapat fokus card/quick detail tanpa langsung navigasi.
2. **Banyak jendela, satu workspace.** Membandingkan content tidak memerlukan
   tab browser atau kembali ke dashboard.
3. **Satu jendela aktif.** Fokus, z-index, shortcut, dan audio selalu memiliki
   pemilik yang jelas.
4. **Background aman.** Window background tidak autoplay atau mengeluarkan audio.
5. **Layout pulih.** Posisi, ukuran, minimized state, dan active window dipulihkan
   dari local storage tervalidasi.
6. **Direct preview tidak rusak.** `/preview/:id` tetap bekerja.
7. **Aksesibilitas sejak awal.** Semua drag mempunyai alternatif keyboard.

## 4. Information architecture

```text
App
├── Dashboard route (/)
│   ├── Dashboard top bar: search/filter, view, workspace actions
│   ├── Content management surface: list / kanban / optional grid
│   ├── Desktop workspace: ContentWindow × N
│   └── Window dock: open + minimized controls
└── Preview route (/preview/:id)
    └── Existing single-player focus mode
```

Desktop workspace adalah layer internal aplikasi, bukan browser popup. Data
management tetap tersedia saat window diminimalkan atau workspace ditile.

## 5. Window model

### 5.1 Record dan batas instance

```js
WindowRecord = {
  windowId: 'content:<content-id>',
  contentId: 'ssh',
  title: 'SSH',
  status: 'loading | ready | unavailable | error',
  rect: { x, y, width, height },
  mode: 'normal | minimized | maximized',
  zIndex: number,
  isFocused: boolean,
  playerState: 'paused | playing | exporting',
  openedAt: timestamp,
  lastFocusedAt: timestamp,
}
```

Fase pertama memakai satu window per content. Menekan Open pada content yang
sudah terbuka harus membawa window lama ke depan, bukan membuat duplikat GSAP,
audio, atau export state. Multi-instance content yang sama hanya dipertimbangkan
setelah lifecycle player terisolasi.

### 5.2 State machine

| State | Bisa menuju | Perilaku |
|---|---|---|
| closed | loading | Open membuat record lalu resolve content. |
| loading | ready / unavailable / error | Chrome/header langsung muncul; body skeleton. |
| ready-normal | focused / minimized / maximized / closed | Player dan kontrol tersedia. |
| focused | normal / minimized / maximized / closed | Satu-satunya kandidat autoplay/audio/global shortcut. |
| minimized | focused | Player pause; body dapat di-virtualize setelah state tersimpan. |
| maximized | focused / normal / minimized / closed | Rect normal disimpan sebelum maximize. |
| unavailable | focused / minimized / closed | Metadata + alasan animation belum tersedia. |
| exporting | focused / minimized / close-confirmation | Job tetap dipantau; close tidak otomatis membatalkan server job. |

## 6. Interaksi dashboard dan card

| Surface | Aksi | Hasil |
|---|---|---|
| List row | Klik title/preview affordance | Pilih card atau quick detail, bukan route navigation. |
| List row | Tombol Open window | Buka/fokus jendela content. |
| Kanban card | Tombol Open di footer | Buka/fokus tanpa mengganggu drag status. |
| Kanban card | Drag handle khusus | Ubah status saja; event tidak membuka player. |
| Grid card baru | Double click atau Open | Buka/fokus jendela. |
| Search result | Enter pada item terpilih | Buka/fokus jendela. |
| Content unavailable | Open window | Window info yang jelas, bukan player kosong. |

Tombol memberi status kontekstual: **Open**, **Focus window**, atau
**Minimized**.

## 7. Window chrome dan desktop behavior

### 7.1 Header

Setiap ContentWindow berisi:

- Dot status loading, ready, unavailable, exporting, atau error.
- Icon/color topic, title, subtitle singkat, content id.
- Tombol minimize, maximize/restore, close.
- Area drag pada header yang tidak mencakup tombol.
- Overflow menu fase lanjut: reset size, copy direct link, standalone preview,
  dan close other windows.

Gaya boleh terinspirasi macOS (rounded chrome dan traffic-light control), tetapi
tetap UI web kustom; jangan memakai asset Apple atau mengklaim native macOS.

### 7.2 Gesture dan shortcut

| Input | Aksi |
|---|---|
| Drag header | Pindah window, dibatasi workspace bounds. |
| Drag edge/corner | Resize dengan min/max size. |
| Klik body/header | Focus dan bring-to-front. |
| Double click header | Maximize/restore. |
| Escape | Tutup menu/popover dulu, bukan langsung close window. |
| Ctrl/Cmd + W | Close fokus; konfirmasi bila export aktif. |
| Ctrl/Cmd + M | Minimize fokus. |
| Ctrl/Cmd + Shift + F | Toggle maximize fokus. |
| Ctrl/Cmd + 1…9 | Fokus window menurut urutan dock jika tidak konflik browser. |
| Arrow + modifier | Move/resize keyboard pada fase accessibility. |

Shortcut dinonaktifkan jika focus ada pada text input, modal, atau control yang
mempunyai shortcut sendiri.

### 7.3 Workspace utilities

- **Cascade:** posisi diagonal aman untuk normal windows.
- **Tile 2-up / 3-up / grid:** membandingkan content tanpa overlap.
- **Focus mode:** maximize sementara; dashboard tetap pulih.
- **Minimize all:** seluruh window masuk dock.
- **Restore layout:** kembali ke rect sesi terakhir atau default deterministik.

Untuk viewport kecil, workspace berganti ke **single-window stack**: satu
player penuh dengan dock sebagai tab; free drag/resize dimatikan.

## 8. Player lifecycle dan resource boundary

| Kondisi | Animation | Audio | Export polling | Body |
|---|---|---|---|---|
| Focused + user play | Jalan | Hanya window ini boleh suara | Aktif jika export terkait | Mounted |
| Focused + paused | Paused | Diam | Aktif jika export terkait | Mounted |
| Background normal | Paused | Diam | Hanya job terkait | Mounted/lazy-kept setelah audit |
| Minimized | Paused atau reset sesuai kontrak topic | Diam | Tetap bila export terkait | Dapat virtualize setelah save |
| Closed | Cleanup timeline/listener | Cleanup | Stop kecuali global job tracker diperlukan | Unmounted |

Sebelum Phase 2, `PlayerShell` perlu menerima window-scoped id, focus state,
serta callback lifecycle. Ia tidak boleh lagi memiliki state global yang dapat
menimpa window lain, terutama:

- title dokumen browser;
- audio unlock/play permission;
- local-storage key export;
- query selector GSAP global;
- settings/progress modal;
- listener timer/polling.

Setiap topic animation perlu diaudit untuk scoped ref/instance selector; selector
global dapat membuat timeline satu window mengubah DOM window lain.

## 9. Data, persistence, dan URL

### 9.1 Workspace store

Buat `WorkspaceProvider` atau store setara dengan action:

- `openContent(contentId)`, `focusWindow(windowId)`, `closeWindow(windowId)`
- `minimizeWindow`, `maximizeWindow`, `restoreWindow`
- `moveWindow`, `resizeWindow`, `tileWindows`
- `hydrateWorkspace`, `persistWorkspace`

Drag/resize pointer event hanya mengubah state transient. Persist dengan debounce
saat gesture selesai.

### 9.2 Persistensi

Gunakan schema versioned seperti `content-workspace:v1`. Simpan hanya layout
non-sensitif: content id, rect, mode, z-order, dan last focus.

Hydration wajib:

1. Validasi schema dan tipe.
2. Buang id content yang tidak lagi tersedia.
3. Clamp rect terhadap viewport baru.
4. Batasi restore sekitar 8–12 window.
5. Fallback default jika data korup/versi berubah.

Jangan simpan secret, caption clipboard, token export, atau data input form.

### 9.3 URL policy

| URL | Makna |
|---|---|
| `/` | Dashboard/workspace utama. |
| `/preview/:id` | Preview fokus tunggal dan backward-compatible. |
| `/?open=id1,id2&focus=id2` | Opsional fase lanjut; deep link tervalidasi dan dibatasi jumlah content. |

Layout pixel tidak masuk URL default supaya link tidak rapuh. Share workspace
menjadi fitur eksplisit pada fase lanjut.

## 10. Error, loading, dan export

| Situasi | Perlakuan |
|---|---|
| Topic tidak ada | Window error dengan Close dan kembali dashboard. |
| Metadata ada, animation belum ada | Window unavailable dengan informasi yang jelas. |
| Dynamic import gagal | Error boundary per-window; dashboard/window lain tetap hidup. |
| Animation error | Hanya window itu error. |
| Export berjalan | Header/dock menampilkan status; close meminta konfirmasi monitoring. |
| Export selesai background | Dock badge selesai/error; tidak memaksa focus. |
| Settings modal | Scoped ke window dan di atas window fokus. |

## 11. Accessibility dan quality bar

- Button semantic dengan label Open, Focus, Minimize, Maximize/Restore, Close,
  Cascade, dan Tile.
- Saat membuka window, focus menuju header/window; saat close, kembali ke tombol
  Open card asal atau dock relevan.
- Focused/minimized state tidak bergantung warna saja.
- Drag memiliki menu/layout/keyboard alternative.
- Hormati `prefers-reduced-motion`.
- Audit kontras chrome/status dan z-index portal modal.
- Tidak ada keyboard trap kecuali modal aktif.

## 12. Delivery phases

### 12.1 Phase 1 — Workspace foundation

1. Tambah dashboard shell dan WorkspaceProvider.
2. Ubah callback card dari route navigate menjadi `openContent`.
3. Buat ContentWindow: open, focus, close, minimize.
4. Tangani loading/unavailable/error per-window.
5. Tambah dock, z-index, basic persistence.
6. Pertahankan `/preview/:id`.

**Lulus jika:** dua content dapat terbuka tanpa menutup satu sama lain; Open pada
content sama hanya memfokuskan window yang ada.

### 12.2 Phase 2 — Player isolation

1. Window-scope PlayerShell state dan lifecycle.
2. Background pause + audio ownership.
3. Error boundary per-window.
4. Export status scoped ke content/window dan dock.
5. Audit minimal tiga topic animation.

**Lulus jika:** dua player tidak mengeluarkan audio bersamaan atau menimpa
timeline, progress export, dan DOM masing-masing.

### 12.3 Phase 3 — Desktop behavior

1. Drag, resize, bounds, maximize/restore.
2. Cascade, tile, minimize-all, restore layout.
3. Responsive single-window stack.
4. Keyboard alternative + reduced motion.

**Lulus jika:** layout terjangkau pada desktop dan viewport kecil, lalu pulih
aman setelah refresh.

### 12.4 Phase 4 — Management polish

1. Optional grid/quick detail.
2. Search/filter dan “open now” filter.
3. Open-state indicator list/kanban.
4. Optional deep link dan named workspace.

**Lulus jika:** management, priority edit, kanban drag, dan Open tidak bertabrakan.

## 13. File impact map saat implementasi disetujui

| File/area | Rencana |
|---|---|
| `src/App.jsx` | Provider/dashboard route; preview route dipertahankan. |
| `ContentManagement.jsx` | Workspace action, top bar, open indicator. |
| `ListView.jsx`, `KanbanView.jsx` | Button Open dan event isolation dari priority/drag. |
| `src/components/workspace/*` baru | WorkspaceSurface, ContentWindow, WindowDock, controls, layout utilities, error boundary. |
| `PlayerShell.jsx` | Lifecycle/audio/export/modal scoped per-window. |
| `PlayerPage.jsx` | Tetap single-preview dengan resolver/error behavior konsisten. |
| `src/hooks/*` baru | workspace store, drag-resize, persistence, active player. |
| Styles | Desktop layer, z-index tokens, responsive stack, reduced motion. |
| Tests | Store, persistence migration, lifecycle, interaction, accessibility. |

## 14. Risks dan mitigasi

| Risiko | Mitigasi |
|---|---|
| Banyak GSAP/audio instance berat | Batasi window, pause background, lazy mount, audit lifecycle. |
| Selector global bertabrakan | Scoped ref/instance id wajib sebelum multi-window aktif. |
| Drag mengganggu click/kanban | Drag hanya header/handle; button stop propagation; test pointer dan keyboard. |
| Window di luar layar | Clamp rect, schema version, restore default. |
| Export state bentrok | Key/state content-window scoped; global job registry bila API single-job. |
| Modal/z-index kacau | Token z-index dan satu policy portal. |
| Mobile terlalu sempit | Stack/tab mode, jangan paksa floating desktop window. |
| Aksesibilitas turun | Acceptance keyboard/focus masuk Phase 1–3, bukan polish akhir. |

## 15. Final acceptance checklist

- [ ] Dashboard membuka minimal dua content tanpa pindah halaman.
- [ ] Reopen content yang sama memfokuskan window, tidak membuat duplikat.
- [ ] Open, focus, minimize, maximize/restore, close, dock, cascade, tile konsisten.
- [ ] Hanya focused window yang autoplay/mengeluarkan audio.
- [ ] Background/minimized window tidak meninggalkan timeline/audio listener aktif
      di luar kebijakan export yang jelas.
- [ ] Error/unavailable satu content tidak meruntuhkan dashboard/window lain.
- [ ] `/preview/:id` tetap berfungsi.
- [ ] Layout local-storage tervalidasi, dipulihkan aman, dan responsif.
- [ ] Priority edit dan kanban drag tetap benar.
- [ ] Keyboard, focus restoration, reduced motion, screen-reader labels diuji.
- [ ] Tidak ada implementasi sebelum plan ini disetujui.



## 16. Todolist Checklist (Numbering Hierarki)

Mengikuti standar numbering di `PROJECT_STRUCTURE.md` (Phase → Section → Task →
Subtask → Detail Steps). Checklist ini turunan dari Section 12 (Delivery
phases) dan Section 15 (Final acceptance checklist), dipecah per fase supaya
progres implementasi jelas.

> Status: Phase 1–4 selesai diimplementasikan dan lolos verifikasi manual user
> di browser (kecuali 4.1 yang di-skip sebagai optional). Final acceptance
> (Section 5) juga sudah dikonfirmasi aman berdasarkan tes user.

- [x] 1. Phase 1: Workspace Foundation
  - [x] 1.1. Dashboard shell & WorkspaceProvider
    - [x] 1.1.1. Buat dashboard route sebagai shell utama
    - [x] 1.1.2. Implementasi WorkspaceProvider (state store)
      - [x] 1.1.2.1. Action `openContent`, `focusWindow`, `closeWindow`
      - [x] 1.1.2.2. Action `minimizeWindow`, `maximizeWindow`, `restoreWindow`
      - [x] 1.1.2.3. Action `moveWindow`, `resizeWindow`, `tileWindows` (tile masih stub, nyata di Phase 3)
      - [x] 1.1.2.4. Action `hydrateWorkspace`, `persistWorkspace`
  - [x] 1.2. Ubah callback card dari route navigate menjadi `openContent`
    - [x] 1.2.1. `ContentManagement.jsx`
    - [x] 1.2.2. `ListView.jsx` — tombol Open, isolasi dari klik title
    - [x] 1.2.3. `KanbanView.jsx` — tombol Open, isolasi dari drag handle
  - [x] 1.3. Komponen `ContentWindow`
    - [x] 1.3.1. State loading / ready / unavailable / error per-window
    - [x] 1.3.2. Kontrol open, focus, close, minimize
  - [x] 1.4. Window dock, z-index, basic persistence
    - [x] 1.4.1. `WindowDock` (daftar window terbuka + minimized)
    - [x] 1.4.2. Manajemen z-index / urutan fokus
    - [x] 1.4.3. Persistence schema `content-workspace:v1` (versi dasar)
  - [x] 1.5. Pertahankan route `/preview/:id`
  - [x] 1.6. Acceptance Phase 1 (✅ dikonfirmasi user — tes manual di browser aman, jalan normal)
    - [x] 1.6.1. Dua content dapat terbuka tanpa menutup satu sama lain
    - [x] 1.6.2. Open pada content yang sama hanya memfokuskan window yang ada

- [x] 2. Phase 2: Player Isolation
  - [x] 2.1. Window-scope `PlayerShell` state & lifecycle
    - [x] 2.1.1. Refactor `PlayerShell` menerima window-scoped id (prop `isFocused`)
    - [x] 2.1.2. Hilangkan state global (title dokumen hanya diubah oleh focused
          window; `__forceUnlockAudio` di-namespace per content.id — lihat catatan
          audit §2.5 soal `__animationTimeline`/`__flushSync`)
  - [x] 2.2. Background pause + audio ownership
    - [x] 2.2.1. Hanya focused window boleh autoplay/mengeluarkan audio
          (`paused={isPaused || !isFocused}`, tombol Play disabled saat blur)
    - [x] 2.2.2. Background/minimized window pause otomatis (effect di PlayerShell)
  - [x] 2.3. Error boundary per-window (`WindowErrorBoundary.jsx`)
  - [x] 2.4. Export status scoped ke content/window dan dock
    - [x] 2.4.1. Export job tracker per content (localStorage key sudah per content.id;
          `playerState` di store di-update via `setPlayerState`)
    - [x] 2.4.2. Dock badge status export (ikon ⟳ di `WindowDock`)
  - [x] 2.5. Audit minimal tiga topic animation (selector/instance scoped)
        — **Temuan:** diaudit `09-virtual-memory`, `11-tailscale`,
        `22-oauth2-delegated-login`. GSAP timeline animasi sendiri sudah aman
        (`tl`/`master` per-instance via closure+ref, tidak saling timpa DOM).
        Satu-satunya identifier global adalah `window.__animationTimeline` /
        `window.__flushSync` — konvensi wajib project (lihat
        `docs/standardizations/04-motion-gsap-reference.md` § Export Safety)
        dipakai di ~30+ topic. Ini **tidak berdampak ke export pipeline**
        karena `scripts/export-parallel.mjs` selalu jalan di Puppeteer Chrome
        terpisah yang navigate langsung ke `/preview/:id` (bukan lewat
        dashboard windowed), sehingga tidak pernah melihat window dashboard
        yang saling menimpa. Dampaknya cuma kosmetik: kalau developer manual
        cek `window.__animationTimeline` di devtools saat 2+ window dashboard
        terbuka, yang kebaca cuma punya window yang terakhir mount. Tidak
        perlu refactor 30+ file topic untuk Phase 2 ini.
  - [x] 2.6. Acceptance Phase 2 (✅ dikonfirmasi user — tes manual di browser aman, jalan normal)
    - [x] 2.6.1. Dua player tidak mengeluarkan audio bersamaan
    - [x] 2.6.2. Tidak menimpa timeline, progress export, dan DOM masing-masing

- [x] 3. Phase 3: Desktop Behavior
  - [x] 3.1. Drag & resize
    - [x] 3.1.1. Drag header dengan batas workspace (bounds) — `useWindowDragResize.js`
    - [x] 3.1.2. Resize edge/corner dengan min/max size (handle pojok kanan-bawah)
    - [x] 3.1.3. Default window size **portrait 390×760** (feel mobile/sosmed),
          tetap free-resize kalau mau landscape/desktop-size (revisi dari
          default 720×520 sebelumnya)
  - [x] 3.2. Maximize/restore
    - [x] 3.2.1. Simpan rect normal sebelum maximize (`preMaximizeRect`)
    - [x] 3.2.2. Double click header toggle maximize/restore
  - [x] 3.3. Workspace utilities
    - [x] 3.3.1. Cascade (`CASCADE_WINDOWS`, tombol di dock)
    - [x] 3.3.2. Tile 2-up/3-up/grid (`TILE_WINDOWS`, tombol di dock)
    - [x] 3.3.3. Minimize all
    - [x] 3.3.4. Restore layout (rect sesi terakhir via persistence v1; default deterministik `defaultRectFor`)
  - [x] 3.4. Responsive single-window stack (viewport kecil, breakpoint 768px)
  - [x] 3.5. Keyboard alternative + reduced motion
    - [x] 3.5.1. Shortcut (Ctrl/Cmd+W, M, Shift+F, 1-9) — `WorkspaceSurface.jsx`
    - [x] 3.5.2. Arrow + modifier (Alt+Arrow move, Alt+Shift+Arrow resize)
    - [x] 3.5.3. Hormati `prefers-reduced-motion` (CSS) + aria-label kontrol window
  - [x] 3.6. Acceptance Phase 3 (✅ dikonfirmasi user — tes manual di browser aman, jalan normal)
    - [x] 3.6.1. Layout terjangkau di desktop dan viewport kecil
    - [x] 3.6.2. Pulih aman setelah refresh
  - [x] 3.7. Mode window: UI player disederhanakan ala mobile app (permintaan user)
    - [x] 3.7.1. Sembunyikan `.player-topbar` (header) dan `TimelineProgressBar`
          (bottom prev/next+slider) saat `windowed` — `PlayerShell.jsx` prop baru `windowed`
    - [x] 3.7.2. `FloatingControls.jsx` — bubble ala iOS AssistiveTouch: tombol
          Play selalu tampil, tombol "More" (⋯) buka menu Settings/Export/
          Download/Copy caption. Bubble bisa di-drag bebas dalam window.
    - [x] 3.7.3. Fix bug `.player-shell` (`width/height: 100vw/100vh`) yang
          bocor keluar bounds `.window-body` — sekarang di-override 100%/100%
          khusus di dalam window

- [x] 4. Phase 4: Management Polish
  - [ ] 4.1. Optional grid / quick detail (skip — ditandai optional di §9.3/12.4,
        tidak terkait data flow lain, aman dikerjakan terpisah kapan pun)
  - [x] 4.2. Search/filter dan filter "open now" — `ContentManagement.jsx`
        (search bar + toggle, filter diteruskan ke ListView/KanbanView)
  - [x] 4.3. Open-state indicator di list/kanban — badge status window di
        `ListView.jsx` dan `KanbanView.jsx`
  - [x] 4.4. Optional deep link & named workspace
    - [x] 4.4.1. URL policy `/?open=id1,id2&focus=id2` — effect deep-link di
          `ContentManagement.jsx`
    - [x] 4.4.2. Validasi & batas jumlah content di deep link + tombol copy link
  - [x] 4.5. Acceptance Phase 4 (✅ dikonfirmasi user — tes manual di browser aman,
        jalan normal; build `npm run build` juga pass, 317 modules, tanpa error)
    - [x] 4.5.1. Management, priority edit, kanban drag, dan Open tidak bertabrakan

- [x] 5. Cross-phase — Final Acceptance (ref. Section 15)
  - [x] 5.1. Dashboard membuka minimal dua content tanpa pindah halaman
  - [x] 5.2. Reopen content yang sama memfokuskan window, tidak membuat duplikat
  - [x] 5.3. Open, focus, minimize, maximize/restore, close, dock, cascade, tile konsisten
  - [x] 5.4. Hanya focused window yang autoplay/mengeluarkan audio
  - [x] 5.5. Background/minimized window tidak meninggalkan timeline/audio listener
        aktif di luar kebijakan export yang jelas
  - [x] 5.6. Error/unavailable satu content tidak meruntuhkan dashboard/window lain
  - [x] 5.7. `/preview/:id` tetap berfungsi
  - [x] 5.8. Layout local-storage tervalidasi, dipulihkan aman, dan responsif
  - [x] 5.9. Priority edit dan kanban drag tetap benar
  - [x] 5.10. Keyboard, focus restoration, reduced motion, screen-reader labels diuji
        (catatan: screen-reader belum ditest eksplisit dengan tool assistive
        seperti NVDA/VoiceOver — aria-label & keyboard alternative sudah ada
        di kode, tapi kalau mau 100% yakin, worth dites khusus nanti)
  - [x] 5.11. Tidak ada implementasi sebelum plan ini disetujui (n/a — plan ini
        sudah dieksekusi penuh atas approval user)
