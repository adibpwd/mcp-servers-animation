# PLAN — Kerasin Volume SFX "Typing" di Intro

> ⚠️ **STATUS: PLANNING ONLY — BELUM DIEKSEKUSI.**
> File ini cuma dokumentasi rencana fix. Jangan implementasi dulu sampai
> di-review/di-ACC.

## 1. Masalah

SFX ketikan (`typing.wav`) di intro (hacker-typing effect, judul "TAILSCALE"
+ subtitle) kedengeran kurang keras dibanding SFX lain di act-act
selanjutnya. User eksplisit oke kalau solusinya bikin volume-nya lewat batas
normal (boleh agak "over", asal kedengeran jelas).

## 2. Root Cause — kenapa udah di-boost 1.6x tapi masih kurang keras

Trace pemanggilannya di `Animation.jsx`:

```js
// typeLine(), line ~135
sfxLoader.sfx(SFX_MAP.TYPING.name, {
  volume: volumeRef.current * 1.6,
  speed: speedRef.current * pitch
})
```

Sudah ada multiplier `*1.6` di level pemanggilan. Tapi ini mentok di
`sfxLoader.js`, fungsi `play()`:

```js
audio.volume = Math.max(0, Math.min(1, (volume / 100) * this.defaultVolume))
```

Dengan `defaultVolume = 0.6` dan `volume` slider default `100`:

```
audio.volume = min(1, (100 * 1.6 / 100) * 0.6)
             = min(1, 1.6 * 0.6)
             = min(1, 0.96)
             = 0.96   ← sudah nyaris mentok
```

**Inti masalahnya:** `HTMLMediaElement.volume` itu di-hard-cap oleh browser
sendiri ke range `0.0–1.0` (bukan cuma dibatasi kode kita). Angka `1.6` di
pemanggilan cuma numerik input ke formula, bukan gain audio beneran — begitu
hasil hitungnya lewat dari `1.0`, `Math.min(1, …)` motong ke `1.0`, dan
browser juga gak akan pernah render lebih keras dari `volume = 1.0` biarpun
kita kasih angka lebih gede lagi (mis. `*3.0` juga hasilnya tetep dipotong
ke `1.0`).

Jadi naikin angka `1.6` → `3.0` dsb **TIDAK ADA EFEKNYA SAMA SEKALI** —
udah mentok dari kemarin. Untuk beneran lebih keras dari ini (exceed
batas 100% native volume), butuh **gain amplification**, bukan cuma
volume scaling — dan itu cuma bisa lewat Web Audio API (`GainNode`),
karena `GainNode.gain.value` boleh diisi > 1.0 (unity gain) dan beneran
memperkuat sinyal (dengan risiko clipping/distortion di angka tinggi —
sesuai yang user bilang gpp).

## 3. Kenapa Web Audio graph relevan

`sfxLoader.js` udah punya setengah infrastruktur ini, tapi cuma aktif pas
`exportMode`:

```js
// initExportMode()
this.audioContext = new AudioContext()
this.mediaStreamDestination = this.audioContext.createMediaStreamDestination()

// load()
if (this.exportMode && this.audioContext && this.mediaStreamDestination) {
  const source = this.audioContext.createMediaElementSource(el)
  source.connect(this.mediaStreamDestination)   // → direkam ke video
  source.connect(this.audioContext.destination) // → monitoring speaker
}
```

Titik ini yang perlu disisipin `GainNode` di antara `source` dan kedua
tujuan connect-nya, KHUSUS untuk sound yang mau di-boost (typing), tanpa
ganggu sound lain.

## 4. Rencana Fix (2 lapis, bisa pilih salah satu / gabungan)

### Opsi A — GainNode per-sound (direkomendasikan, scoped, reversible)

1. **`data.js`** — tambah field `boost` opsional di entry `SFX_MAP.TYPING`:
   ```js
   TYPING: { category: 'sfx', name: 'typing', boost: 2.2 }  // angka awal, perlu tuning by ear
   ```
   Sound lain gak dikasih `boost` → default `1.0` (tidak ada efek/regresi).

2. **`sfxLoader.js`**:
   - Tambah param `boost = 1.0` di opsi `play(category, name, options)`.
   - Di `load()`, pas bikin `MediaElementAudioSourceNode` untuk export mode,
     sisipin `GainNode`:
     ```js
     const gainNode = this.audioContext.createGain()
     gainNode.gain.value = boost   // simpan referensi gain node di cache entry
     source.connect(gainNode)
     gainNode.connect(this.mediaStreamDestination)
     gainNode.connect(this.audioContext.destination)
     ```
   - **Penting:** `typing` dipanggil berkali-kali super cepat (per-karakter)
     dan pakai pooling (`entry.pool`, sampai 4 `<audio>` clone). Gain node
     harus dipasang ke **setiap clone di pool**, bukan cuma elemen pertama —
     kalau nggak, sebagian huruf tetep kedengeran pelan (clone tanpa gain).
   - Simpan `boost` per cache-key (`entry.boost = boost`) supaya pool-growth
     (`cloneNode`) di `play()` tau harus pasang gain berapa buat clone baru.

3. **`Animation.jsx`** (`typeLine()`) — teruskan boost dari `SFX_MAP`:
   ```js
   sfxLoader.sfx(SFX_MAP.TYPING.name, {
     volume: volumeRef.current * 1.6,
     speed: speedRef.current * pitch,
     boost: SFX_MAP.TYPING.boost || 1.0,
   })
   ```

4. **Live preview (non-export) juga ikut lebih keras?**
   Saat ini Web Audio graph (`AudioContext`/`GainNode`) cuma dibikin waktu
   `initExportMode()` dipanggil (mode export). Di preview biasa, `<audio>`
   elemen native diputar langsung tanpa graph, jadi GainNode gak akan
   ke-apply di preview — cuma di video hasil export.
   → **Perlu keputusan**: apakah boost cukup di video final aja (paling
   simpel, gak sentuh preview sama sekali), atau mau preview juga ikut
   lebih keras (perlu inisialisasi Web Audio graph di luar export mode
   juga — scope lebih besar, worth dibahas dulu sebelum dikerjain).
   Rekomendasi: **cukup di export dulu** (itu yang dipost), preview
   menyusul kalau ternyata dirasa perlu juga.

### Opsi B — Normalize/boost file asset `typing.wav` langsung (lebih simpel, tapi kurang scoped)

- Proses ulang `/public/audio/sfx/typing.wav` pakai ffmpeg, misal:
  ```
  ffmpeg -i typing.wav -filter:a "volume=6dB" typing_boosted.wav
  ```
  (6dB ≈ 2x lebih keras; bisa dinaikin lagi kalau masih kurang, terima
  resiko clipping sesuai arahan user)
- Replace file asset-nya langsung, tanpa ubah kode sama sekali.
- **Downside**: efeknya global — mempengaruhi typing SFX di topic LAIN juga
  kalau asset `typing.wav` di-share lintas topic (perlu dicek dulu apakah
  file ini dipakai cuma di tailscale atau shared). Kalau shared dan topic
  lain gak mau ikut lebih keras, opsi ini kurang tepat — mending pisah jadi
  asset baru (`typing-loud.wav`) khusus dipakai tailscale.

### Rekomendasi akhir

Pakai **Opsi A** (GainNode scoped per-sound via `SFX_MAP.TYPING.boost`) —
lebih presisi (khusus intro tailscale, gampang di-tuning naik/turun tanpa
re-render asset), dan tidak menyentuh topic/asset lain sama sekali.

## 4.1 Konfirmasi tambahan — asset `typing.wav` itu shared

Sudah dicek: `public/audio/sfx/typing.wav` cuma ada **satu**, dipakai lintas
topic (bukan per-topic-folder). Ini mengkonfirmasi Opsi B (edit file asset
langsung) beresiko ngefek ke topic lain, bukan cuma tailscale — jadi
Opsi A (GainNode scoped lewat `SFX_MAP.TYPING.boost`, cuma aktif di call
site tailscale) tetap yang direkomendasikan.

Bonus temuan: ada beberapa file backup di folder yang sama —
`typing.wav.toosubtle.backup`, `typing.wav.backup`,
`typing-buzz-loud.wav.backup2` — nunjukin variasi/tuning volume typing SFX
ini pernah dicoba-coba sebelumnya (kemungkinan trial project lain atau
percobaan lama). Worth di-dengerin dulu sebagai referensi pas tuning
`boost` di langkah checklist §5.4 — siapa tau salah satu backup itu udah
pas levelnya dan tinggal dipakai lagi.

## 5. Langkah Eksekusi (checklist, saat udah di-ACC)

1. [x] Tambah `boost: 2.2` di `SFX_MAP.TYPING` (`data.js`) — angka awal,
       akan di-tuning by-ear di langkah 4.
2. [x] `sfxLoader.js`: tambah dukungan `GainNode` per cache-entry + terapkan
       ke semua clone di pool (bukan cuma elemen pertama).
3. [x] `Animation.jsx` (`typeLine`): teruskan `boost` dari `SFX_MAP.TYPING`
       ke `sfxLoader.sfx(...)`. — diteruskan sebagai
       `boost: SFX_MAP.TYPING.boost || 1.0`.
4. [ ] Re-export tailscale (1×), dengarkan hasil intro-nya. Kalau masih
       kurang keras / belum cukup "nonjol", naikin `boost` (mis. 2.2 → 2.8)
       dan ulangi. Kalau udah mulai pecah/distortion parah (di luar yang
       diterima), turunin dikit.
5. [ ] Opsional QA: cek level audio pakai
       `ffmpeg -i tailscale.mp4 -af volumedetect -f null -` untuk bandingin
       peak/mean volume dB sebelum vs sesudah — konfirmasi ada kenaikan
       terukur, bukan cuma feeling.
6. [ ] Pastikan SFX lain (POP, TICK, WHOOSH, dll di act 1–5) TIDAK ikut
       berubah volumenya — sanity-check dengerin act lain juga.
7. [-] Update dokumentasi pola `boost` per-sound — **discoped**: atas
       instruksi user, eksekusi kali ini fokus ke konten `tailscale` saja,
       jadi file convention global (`docs/04-referensi-gsap.md`) sengaja
       TIDAK disentuh. Pola `boost` opsional pada entry `SFX_MAP` dan
       cara `sfxLoader.js` menanganinya sudah dijelaskan di §2–§4 file
       plan ini sebagai referensi kalau topic lain butuh pola serupa nanti.

## 6. Catatan

- Ini murni soal **loudness/gain**, bukan bug — jadi gak ada "regresi" yang
  perlu dikhawatirkan di luar act 5 mesh-line fix yang udah kelar duluan.
- Distorsi/clipping di volume tinggi itu expected & diterima oleh user
  ("melebihi batas audio gpp") — jangan buang waktu ngejar audio yang
  bersih sempurna, prioritas: **kedengeran jelas**.
- **Update status**: §5 langkah 1–3 (perubahan kode: `data.js`,
  `sfxLoader.js`, `Animation.jsx`) sudah dieksekusi, scoped ke topic
  `tailscale` saja. Langkah 4–6 (re-export, dengerin, QA numerik) masih
  menunggu proses export manual. Langkah 7 (dokumentasi global) sengaja
  di-skip sesuai instruksi fokus-tailscale-saja.
