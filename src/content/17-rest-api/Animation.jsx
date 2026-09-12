// ═══════════════════════════════════════════════════════════════════════════
// src/content/17-rest-api/Animation.jsx
// ─────────────────────────────────────────────────────────────────────────
// REVISI 06 (revisi/2026-09-12-revisi-06.md): empat Act tanpa jeda kosong.
// API Service Hub (gate+processor+cabinet, 1 panel) terlihat REDUP sejak
// Act 1 — bukan pop-in terlambat seperti revisi-05. GET tuntas di Act 1-2:
// tiket berangkat ~0.15-0.2s setelah lahir, tidak menunggu di browser.
// CRUD (POST/PUT/PATCH/DELETE) di Act 3-4 masing-masing berangkat dari AKSI
// KLIK di browser lewat helper request yang sama (bukan galeri method
// statis Act 5 — Act 5 dihapus total). Intro memakai hero-to-header morph
// gaya Tailscale (lihat 11-tailscale/Animation.jsx §intro), tanpa typing/
// cursor/blink — satu grup teks persisten yang di-lerp posisinya.
//
// CATATAN EKSEKUSI: Icon tetap inline SVG (bukan PNG ChatGPT-pipeline),
// sesuai revisi-05 — pipeline 06-icon-generation.md butuh interaksi manual.
// STATUS: kode + data sudah ikut revisi-06, belum preview manual & export MP4.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP, INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_SUBTITLE,
  AXIS_X, CLIENT_Y, SERVICE_Y, FLOW_WAYPOINTS,
  // PLAN-14: HEADER_MORPH tidak lagi diimport di sini — header sekarang
  // dirender via IntroHeaderMorphV1 (Scene UI V1), yang koordinat
  // hero/compact default-nya sudah cocok persis dengan HEADER_MORPH lama
  // (lihat PLAN-14 §1.1). Export HEADER_MORPH di data.js TETAP dibiarkan
  // ada (tidak dihapus) sesuai PLAN-14 §4 langkah 5 dan §6.
  CARD_JOKOWO_Y, CARD_PRABOWO_Y,  // REVISI-08: posisi mini-card terpisah
  CLIENT_LABEL, SERVICE_LABEL, RESOURCE_LABEL,
  ADIB_PROFILE, JOKOWO_PROFILE, PRABOWO_PROFILE,  // REVISI-07: 3 user
  CABINET_SLOTS, JOKOWO_SLOT, PRABOWO_SLOT,  // REVISI-07: 3 user slots
  REQUESTS,
  TOTAL_DURATION,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
// PLAN-14: migrasi header & badge/navigator ke Scene UI V1 (lihat
// docs/plan/PLAN-14-MIGRASI-PILOT-17-REST-API-KE-SCENE-UI-V1.md).
// Body/content (browser panel, cabinet, mini-card, service hub) SENGAJA
// tidak dimigrasi — tetap custom, lihat plan §1.3.
import { IntroHeaderMorphV1, ActBadgeNavigatorV1 } from '../../shared/scene-ui/v1'

const lerp = (a, b, t) => a + (b - a) * t

export default function RestApiAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const svgRef = useRef(null)
  const tlRef = useRef(null)
  const audioUnlockedRef = useRef(audioUnlocked)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [caption, setCaption] = useState('')
  const [pop, setPop] = useState({})

  // ── header — hero-to-header morph gaya Tailscale, TANPA typing.
  // headerOpacity cuma fade-in singkat sekali di awal, lalu header hidup
  // terus (tidak pernah disembunyikan) — revisi-06 §6 "jangan menghitung
  // opacity yang membuat tagline/judul putih atau menghilang". ──
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  // ── API Service Hub — anchor persisten TAMPAK REDUP sejak Act 1
  // (revisi-06 §3.1). hubOpacity naik saat tiket mendekat/masuk,
  // BUKAN pop-in dari scale 0 di Act 3 seperti revisi-05. ──
  const [hubOpacity, setHubOpacity] = useState(0.25)
  const [hubGlow, setHubGlow] = useState(0)
  const [gateActive, setGateActive] = useState(false)
  const [browserClicked, setBrowserClicked] = useState(false)

  // ── Tiket request — 1 objek yang dipakai ulang untuk GET/POST/PUT/
  // PATCH/DELETE (revisi-06 §7 "helper request yang dapat dipakai").
  // x tetap AXIS_X, y ditween sepanjang spine, teks ganti per method. ──
  const [reqY, setReqY] = useState(FLOW_WAYPOINTS.P0_CLIENT)
  const [reqVisible, setReqVisible] = useState(false)
  const [activeTicket, setActiveTicket] = useState(REQUESTS.GET)

  // ── Lemari kartu ──
  const [resourceOpen, setResourceOpen] = useState(false)
  const [selectedDot, setSelectedDot] = useState(-1)

  // ── Response — pola sama seperti tiket, teks ganti per method. ──
  const [respY, setRespY] = useState(FLOW_WAYPOINTS.P4_PROCESSOR)
  const [respVisible, setRespVisible] = useState(false)
  const [activeResponse, setActiveResponse] = useState(REQUESTS.GET)

  // ── REVISI-07: State untuk 3 user (Adib, Jokowo, Prabowo) ──
  // Adib: hair & role berubah (PUT/PATCH)
  // Jokowo: created via POST, role changed via PATCH
  // Prabowo: created via POST, deleted via DELETE
  // REVISI-08 Bug E: adibHair di-split jadi Server (cabinet, commit di
  // titik waktu `t`) vs Displayed (panel browser, hydrate di titik `back`
  // saat response benar-benar tiba) — supaya panel browser tidak "bocor"
  // duluan sebelum response melaju balik.
  const [adibHairServer, setAdibHairServer] = useState(ADIB_PROFILE.hair)
  const [adibHairDisplayed, setAdibHairDisplayed] = useState(ADIB_PROFILE.hair)
  const [adibRole, setAdibRole] = useState(ADIB_PROFILE.role)
  // REVISI-08: decouple "sudah ada di server/cabinet" (ServerExists)
  // dari "sudah muncul sebagai kartu di panel browser" (CardVisible).
  // ServerExists jadi true setelah POST (drive CABINET_SLOTS filled).
  // CardVisible jadi true setelah GET_JOKOWO/GET_PRABOWO (drive kartu
  // mini di browser) — TIDAK otomatis true bareng POST. Default false
  // semua: sebelum Act 3, Jokowo/Prabowo tidak ada di mana pun.
  const [jokowoServerExists, setJokowoServerExists] = useState(false)
  const [jokowoCardVisible, setJokowoCardVisible] = useState(false)
  // Bug E: sama pola dengan adibHair — role di-split Server/Displayed.
  const [jokowoRoleServer, setJokowoRoleServer] = useState(JOKOWO_PROFILE.role)
  const [jokowoRoleDisplayed, setJokowoRoleDisplayed] = useState(JOKOWO_PROFILE.role)
  const [prabowoServerExists, setPrabowoServerExists] = useState(false)
  const [prabowoCardVisible, setPrabowoCardVisible] = useState(false)

  // ── REVISI-07: Browser loading state ──
  const [browserLoading, setBrowserLoading] = useState(true)

  // ── browserView — menentukan konten yang tampil di panel browser;
  // ganti begitu response method terkait tiba (revisi-06 §4). ──
  const [browserView, setBrowserView] = useState('initial')

  // ── ctaLabel — SATU tombol CTA yang label-nya di-morph tiap Act
  // (bukan 5 tombol/id terpisah numpuk di posisi sama). Label selalu
  // menunjukkan aksi BERIKUTNYA yang akan diklik user. ──
  const [ctaLabel, setCtaLabel] = useState('Lihat Profil')

  // PLAN-14: `phase` (PHASES[phaseIdx]) tidak lagi dipakai langsung di sini
  // — ActBadgeNavigatorV1 menghitung active phase sendiri dari
  // phases+activeIndex yang di-pass (lihat render badge di bawah).
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }
  const B = (id) => (pop[id] ? pop[id].scale : 1)

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.45, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 0,
      sfxName = SFX_MAP.POP.name, sfxCategory = 'ui', volumeMult = 1 } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volume * volumeMult, speed }) },
      onUpdate: () => setPop(prev => ({
        ...prev,
        [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) },
      })),
    }, time)
  }

  const popOut = (tl, time, id, opts = {}) => {
    const { duration = 0.3, ease = 'power1.in' } = opts
    const o = { v: 1 }
    tl.to(o, {
      v: 0, duration, ease,
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v, opacity: o.v } })),
    }, time)
  }

  const morph = (tl, time, id, updater, opts = {}) => {
    const { duration = 0.18, sfxName = SFX_MAP.TICK.name } = opts
    const o = { v: 1 }
    tl.to(o, {
      v: 0.8, duration, ease: 'power1.in',
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v } })),
      onComplete: () => { updater(); sfxLoader.ui(sfxName, { volume: volumeRef.current, speed: speedRef.current }) },
    }, time)
    tl.to(o, {
      v: 1, duration, ease: 'back.out(2.2)',
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v } })),
    }, time + duration)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  // ── travel() — tween generik posisi Y sepanjang spine, dipakai untuk
  // tiket (browser→gate→processor) maupun response (processor→browser).
  // Tidak pernah teleport: onUpdate jalan tiap frame. Mengembalikan
  // waktu selesai supaya bisa dirangkai berurutan tanpa gap. ──
  const travel = (tl, time, setter, from, to, duration, ease) => {
    const o = { y: from }
    tl.to(o, { y: to, duration, ease, onUpdate: () => setter(o.y) }, time)
    return time + duration
  }

  // ── REVISI-08 Bug E — applyMutation() dipecah jadi 2 fungsi supaya
  // "server sudah commit" dan "browser sudah tahu" tidak lagi terikat
  // ke titik waktu yang sama:
  //
  // applyServerMutation(req) — dipanggil di titik waktu `t` (saat tiket
  // "diserap" processor). HANYA state yang scope-nya cabinet/server:
  // insert (POST) dan archive (DELETE) untuk ServerExists, plus varian
  // *Server dari hair/role yang dipakai cabinetSlots map. 'read' dan
  // 'fetch-card' TIDAK menulis apa pun di sini — keduanya murni
  // browser-facing.
  const applyServerMutation = (req) => {
    if (req.action === 'insert') {
      // POST_JOKOWO atau POST_PRABOWO: insert ke cabinet/server SAJA.
      if (req.targetSlot === JOKOWO_SLOT) setJokowoServerExists(true)
      else if (req.targetSlot === PRABOWO_SLOT) setPrabowoServerExists(true)
    }
    else if (req.action === 'replace') {
      // PUT: cabinet Adib commit rambut baru DULUAN (server sudah
      // punya data baru meski browser belum "tahu" sampai response
      // tiba di applyBrowserHydrate).
      setAdibHairServer(req.newHair)
    }
    else if (req.action === 'patch') {
      // PATCH_JOKOWO: cabinet commit role baru duluan.
      if (req.targetSlot === JOKOWO_SLOT) setJokowoRoleServer(req.newRole)
    }
    else if (req.action === 'archive') {
      // DELETE_PRABOWO: hapus dari cabinet/server. Sisi panel browser
      // (CardVisible) pindah ke applyBrowserHydrate di bawah.
      if (req.targetSlot === PRABOWO_SLOT) setPrabowoServerExists(false)
    }
    // 'read' & 'fetch-card': tidak ada state server/cabinet yang
    // berubah di sini — keduanya tidak menulis data baru ke server.
  }

  // applyBrowserHydrate(req) — dipanggil di titik waktu `back` (persis
  // saat response benar-benar mendarat di browser, bukan saat processor
  // baru mulai memproses). SEMUA state yang scope-nya panel browser.
  const applyBrowserHydrate = (req) => {
    if (req.action === 'read') {
      setBrowserLoading(false)  // REVISI-07: browser selesai loading
    }
    else if (req.action === 'fetch-card') {
      // REVISI-08: GET_JOKOWO / GET_PRABOWO — baru sekarang kartu
      // profil muncul di panel browser (bukan otomatis saat POST).
      if (req.targetSlot === JOKOWO_SLOT) setJokowoCardVisible(true)
      else if (req.targetSlot === PRABOWO_SLOT) setPrabowoCardVisible(true)
    }
    else if (req.action === 'replace') {
      // PUT: panel browser baru refresh rambut setelah response tiba —
      // sebelum ini cabinet sudah duluan berubah (lihat applyServerMutation).
      setAdibHairDisplayed(req.newHair)
    }
    else if (req.action === 'patch') {
      // PATCH_JOKOWO: mini-card jokowoCard baru refresh role di sini.
      if (req.targetSlot === JOKOWO_SLOT) setJokowoRoleDisplayed(req.newRole)
    }
    else if (req.action === 'archive') {
      // DELETE_PRABOWO: sisi panel browser hilang bareng response tiba.
      if (req.targetSlot === PRABOWO_SLOT) setPrabowoCardVisible(false)
    }
    // 'insert': tidak ada state panel-browser yang berubah di sini —
    // kartu baru muncul lewat 'fetch-card' yang terpisah.
  }

  // ── requestFlow() — browser klik → tiket lahir → melaju ke Gate.
  // Dipisah dari resolveFlow supaya GET bisa "berhenti" tepat di Gate
  // pada batas Act 1→2 (revisi-06 §4 Act 1, tanpa popOut/hilang). ──
  const requestFlow = (tl, time, req, opts = {}) => {
    const { holdBeforeDepart = 0.2 } = opts
    let t = time
    tl.add(() => setBrowserClicked(true), t)
    tl.add(() => setBrowserClicked(false), t + 0.15)
    tl.add(() => { setActiveTicket(req); setReqVisible(true); setReqY(FLOW_WAYPOINTS.P0_CLIENT) }, t)
    sfxOn(tl, t, () => sfxLoader.ui(SFX_MAP.POP.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += Math.min(holdBeforeDepart, 0.25)
    const arrive = travel(tl, t, setReqY, FLOW_WAYPOINTS.P0_CLIENT, FLOW_WAYPOINTS.P3_GATE, 1.35, 'power1.inOut')
    tl.add(() => { setGateActive(true); setHubOpacity(1); setHubGlow(1) }, arrive - 0.05)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    return arrive
  }

  // ── resolveFlow() — dari Gate: masuk Processor, mutasi kartu, lalu
  // response melaju balik ke browser. Tidak pernah teleport (revisi-06
  // §3.2): tiap segmen memakai travel() yang di-onUpdate tiap frame. ──
  const resolveFlow = (tl, time, req, opts = {}) => {
    // REVISI-08 Bug E: popInIds — id kartu mini (jokowoCard/prabowoCard)
    // sekarang di-trigger di `back` (response mendarat), BUKAN di `t`
    // (processor baru mulai memproses) — supaya sinkron dengan
    // jokowoCardVisible/prabowoCardVisible yang juga di-set di
    // applyBrowserHydrate() pada `back`. Tidak ada popOutIds simetris:
    // DELETE men-set *CardVisible=false SINKRON di applyBrowserHydrate
    // (juga di `back`), jadi kartu unmount instan sebelum tween popOut
    // sempat kelihatan (race render vs tween) — hilang instan sudah
    // cukup benar secara fungsional untuk kasus DELETE.
    const { holdBeforeProcessor = 0.3, cardHold = 1.2, popInIds = [] } = opts
    let t = time
    t = travel(tl, t, setReqY, FLOW_WAYPOINTS.P3_GATE, FLOW_WAYPOINTS.P4_PROCESSOR, 0.3, 'power2.in')
    tl.add(() => { setReqVisible(false); setResourceOpen(true); setSelectedDot(req.targetSlot) }, t)
    sfxOn(tl, t, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.05, req.caption)
    t += Math.min(holdBeforeProcessor, 0.35)
    // Bug E: HANYA server/cabinet yang commit di titik `t` ini.
    tl.add(() => applyServerMutation(req), t)
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += cardHold
    tl.add(() => { setActiveResponse(req); setRespVisible(true); setRespY(FLOW_WAYPOINTS.P4_PROCESSOR) }, t)
    t += 0.15
    const back = travel(tl, t, setRespY, FLOW_WAYPOINTS.P4_PROCESSOR, FLOW_WAYPOINTS.P0_CLIENT, 1.35, 'power1.inOut')
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => {
      // Bug E: panel browser baru "tahu" persis di sini, saat response
      // benar-benar mendarat — bukan lagi bocor duluan di `t`.
      applyBrowserHydrate(req)
      setRespVisible(false); setResourceOpen(false); setSelectedDot(-1)
      setBrowserView(req.method.toLowerCase())
    }, back)
    // Bug E: popIn mini-card ikut pindah ke `back`, sinkron dengan
    // *CardVisible yang di-set di applyBrowserHydrate() persis di atas.
    popInIds.forEach(id => popIn(tl, back, id, { fromY: 16, sfxName: SFX_MAP.POP2.name }))
    sfxOn(tl, back, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, back + 0.05, req.responseLabel)
    return back + 0.4
  }

  // ── sendRequest() — helper generik lengkap (browser → gate → processor
  // → mutasi → response → browser) dipakai POST/PUT/PATCH/DELETE yang
  // tidak perlu "berhenti" di batas Act seperti GET (revisi-06 §7). ──
  const sendRequest = (tl, time, req, opts = {}) => {
    const arrived = requestFlow(tl, time, req, opts)
    return resolveFlow(tl, arrived, req, opts)
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — empat Act tanpa jeda kosong (revisi-06 §4).
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    // ── reset state tiap awal loop (revisi-06 §5 "reset loop wajib") ──
    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setHubOpacity(0.25); setHubGlow(0); setGateActive(false)
      setReqVisible(false); setRespVisible(false)
      // Bug E: reset kedua varian Server/Displayed ke nilai awal yang sama.
      setAdibHairServer(ADIB_PROFILE.hair); setAdibHairDisplayed(ADIB_PROFILE.hair)
      setAdibRole(ADIB_PROFILE.role)
      // REVISI-08: reset ke default false — Jokowo/Prabowo belum ada
      // di server maupun di panel browser sampai POST+GET Act 3.
      setJokowoServerExists(false); setJokowoCardVisible(false)
      setJokowoRoleServer(JOKOWO_PROFILE.role); setJokowoRoleDisplayed(JOKOWO_PROFILE.role)
      setPrabowoServerExists(false); setPrabowoCardVisible(false)
      setBrowserLoading(true)
      setBrowserView('initial'); setResourceOpen(false); setSelectedDot(-1)
      setBrowserClicked(false); setPop({}); setCaption(''); setCtaLabel('Lihat Profil')
    }, t)

    // ═══════════════ INTRO — hero centered → header, TANPA typing ════════
    // (revisi-06 §6: satu grup teks persisten di-lerp, bukan ketik ulang)
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Adib Kirim GET (hub sudah redup terlihat) ════
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.05, 'browserPanel', { fromY: -20, sfx: false })
    popIn(tl, t + 0.3, 'adibAvatar', {})
    say(tl, t + 0.3, 'Adib membuka halaman profil')
    popIn(tl, t + 0.6, 'ctaBtn', {})
    const gateArrive = requestFlow(tl, t + 0.95, REQUESTS.GET, { holdBeforeDepart: 0.2 })

    // ═══════════════ ACT 2 — API Mengembalikan Profil Adib ════════════════
    tl.add(() => setPhaseIdx(1), gateArrive)
    const getDone = resolveFlow(tl, gateArrive, REQUESTS.GET, { holdBeforeProcessor: 0.3, cardHold: 2.0 })
    morph(tl, getDone + 0.15, 'ctaBtn', () => setCtaLabel('Tambah Raditya Dika'))

    // ═══════════════ ACT 3 — Browser Membuat & Mengambil Data ═════════════
    // REVISI-08: Beat A = POST_JOKOWO → GET_JOKOWO → POST_PRABOWO →
    // GET_PRABOWO (tiap POST diikuti GET terpisah, kartu di browser
    // BARU muncul setelah fetch-nya, bukan otomatis nempel saat POST).
    // Beat B = PUT (Adib hair: black → purple)
    tl.add(() => setPhaseIdx(2), getDone + 0.5)
    // Beat A.1 — POST_JOKOWO membuat kartu Jokowi di server/cabinet
    const postJokowoDone = sendRequest(tl, getDone + 0.7, REQUESTS.POST_JOKOWO, { holdBeforeDepart: 0.15, holdBeforeProcessor: 0.25, cardHold: 0.85 })
    morph(tl, postJokowoDone + 0.15, 'ctaBtn', () => setCtaLabel('Lihat Kartu Raditya Dika'))
    // Beat A.2 — GET_JOKOWO mengambil kartu Jokowi ke panel browser
    const getJokowoDone = sendRequest(tl, postJokowoDone + 0.4, REQUESTS.GET_JOKOWO, { holdBeforeDepart: 0.15, holdBeforeProcessor: 0.25, cardHold: 0.7, popInIds: ['jokowoCard'] })
    morph(tl, getJokowoDone + 0.15, 'ctaBtn', () => setCtaLabel('Tambah Deddy Corbuzier'))
    // Beat A.3 — POST_PRABOWO membuat kartu Prabowo di server/cabinet
    const postPrabowoDone = sendRequest(tl, getJokowoDone + 0.35, REQUESTS.POST_PRABOWO, { holdBeforeDepart: 0.15, holdBeforeProcessor: 0.25, cardHold: 0.85 })
    morph(tl, postPrabowoDone + 0.15, 'ctaBtn', () => setCtaLabel('Lihat Kartu Deddy Corbuzier'))
    // Beat A.4 — GET_PRABOWO mengambil kartu Prabowo ke panel browser
    const getPrabowoDone = sendRequest(tl, postPrabowoDone + 0.4, REQUESTS.GET_PRABOWO, { holdBeforeDepart: 0.15, holdBeforeProcessor: 0.25, cardHold: 0.7, popInIds: ['prabowoCard'] })
    morph(tl, getPrabowoDone + 0.15, 'ctaBtn', () => setCtaLabel('Simpan Profil Lengkap'))
    // Beat B — PUT mengganti penuh kartu Adib (rambut: black → purple)
    const putDone = sendRequest(tl, getPrabowoDone + 0.45, REQUESTS.PUT, { holdBeforeDepart: 0.2, holdBeforeProcessor: 0.3, cardHold: 1.2 })
    morph(tl, putDone + 0.15, 'ctaBtn', () => setCtaLabel('Ubah Raditya Dika ke Professional'))

    // ═══════════════ ACT 4 — Browser Mengubah & Menghapus Data ════════════
    // REVISI-07: Beat A = PATCH_JOKOWO (role: Student → Professional)
    // Beat B = DELETE_PRABOWO (archive Prabowo)
    tl.add(() => setPhaseIdx(3), putDone + 0.5)
    // Beat A — PATCH_JOKOWO mengganti satu field (Student → Professional)
    const patchDone = sendRequest(tl, putDone + 0.7, REQUESTS.PATCH_JOKOWO, { holdBeforeDepart: 0.2, holdBeforeProcessor: 0.25, cardHold: 0.8 })
    morph(tl, patchDone + 0.15, 'ctaBtn', () => setCtaLabel('Hapus Deddy Corbuzier'))
    // Beat B — DELETE_PRABOWO mengarsipkan kartu Prabowo. CATATAN:
    // popOutIds SENGAJA tidak dipakai di sini — applyBrowserHydrate()
    // men-set prabowoCardVisible=false SINKRON di 'back' yang sama,
    // jadi kartu langsung unmount sebelum tween popOut sempat kelihatan
    // (race kondisi render vs tween). Hilang instan via conditional
    // render sudah cukup benar secara fungsional untuk DELETE.
    const deleteDone = sendRequest(tl, patchDone + 0.55, REQUESTS.DELETE_PRABOWO, { holdBeforeDepart: 0.2, holdBeforeProcessor: 0.25, cardHold: 0.7 })

    // ── closing — hub redup, status akhir 3 user jadi visual terakhir
    // sebelum loop reset (revisi-06 §4 Act 4 penutup, revisi-07: 3 user) ──
    tl.add(() => { setHubOpacity(0.25); setHubGlow(0); setGateActive(false) }, deleteDone + 0.3)
    say(tl, deleteDone + 0.35, 'Adib (purple) · Raditya Dika (Professional) · Deddy Corbuzier (deleted)')
    tl.to({}, { duration: 0.9 }, deleteDone + 0.4)

    return () => {
      tl.kill()
      delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
    if (paused) tlRef.current.pause(); else tlRef.current.resume()
  }, [speed, paused])

  // ── render helpers ──
  const T = (id, cx, cy) => {
    const p = P(id)
    return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
  }
  const O = (id) => P(id).opacity

  // REVISI-08: cabinet slot filled pakai ServerExists (bukan CardVisible)
  // — lemari kartu di API Service Hub merepresentasikan data server,
  // beda dari kartu mini di panel browser yang gated CardVisible.
  // Bug E: cabinet (server/lemari) selalu pakai varian *Server — boleh
  // sudah commit lebih dulu daripada panel browser (adibHairDisplayed /
  // jokowoRoleDisplayed) yang baru hydrate saat response tiba.
  const cabinetSlots = CABINET_SLOTS.map(s => {
    if (s.kind === 'adib') return { ...s, role: adibRole, hair: adibHairServer }
    if (s.kind === 'jokowo') return { ...s, filled: jokowoServerExists, role: jokowoRoleServer }
    if (s.kind === 'prabowo') return { ...s, filled: prabowoServerExists }
    return s
  })

  const HAIR_HEX = { black: '#1E293B', purple: COLORS.PROFILE_NEW }

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.CLIENT} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.CLIENT} strokeWidth={1} />)}
      </g>

      {/* ── HEADER — PLAN-14: migrasi ke IntroHeaderMorphV1 (Scene UI V1).
          Koordinat hero/compact topic 17 (HEADER_MORPH) cocok persis dengan
          default V1, jadi tidak perlu override hero/compact selain thumbWidth
          (persis nilai lama, supaya startX identik). categorySegments dipakai
          (bukan category tunggal) supaya domain "ADIB-DEV.COM" tetap warna
          NETWORKING_SKY berbeda dari label "NETWORKING" (MUTED) — mengikuti
          fix Bug F, dipertahankan lewat penambahan prop opsional non-breaking
          di IntroHeaderMorphV1 (lihat catatan versi di file component). */}
      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.NETWORKING_SKY },
            ]}
            titleSegments={[
              { label: 'REST ', color: COLORS.NETWORKING_MINT },
              { label: 'API', color: COLORS.NETWORKING_SKY },
            ]}
            subtitle={INTRO_SUBTITLE}
            hero={{ thumbWidth: 420 }}
            titleFilter="url(#glow)"
            testId="rest-api-intro-header"
          />
        </g>
      )}


      {contentStarted && (
        <g>
          {/* PLAN-14: badge + dot navigator dimigrasi ke ActBadgeNavigatorV1
              (Scene UI V1). Koordinat lama (x=44,y=170,width=480,height=36,
              dotsX=620 absolut) sangat dekat dengan default V1
              (x=44,y=155,width=500,height=40,dotsX=620 relatif) — delta
              13-20px diterima sebagai bagian standarisasi (lihat PLAN-14 §1.2). */}
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            testId="rest-api-act-navigator"
          />

          {/* spine — jalur browser ↔ API Service, selalu terlihat redup */}
          <line x1={AXIS_X} y1={FLOW_WAYPOINTS.P0_CLIENT} x2={AXIS_X} y2={FLOW_WAYPOINTS.P3_GATE}
            stroke={COLORS.BORDER} strokeWidth={2} strokeDasharray="4 6" opacity={0.35} />

          {/* ── BROWSER PANEL ── */}
          <g transform={T('browserPanel', AXIS_X, CLIENT_Y)} opacity={O('browserPanel')}>
            <rect x={-190} y={-110} width={380} height={210} rx={16} fill={COLORS.PANEL} stroke={COLORS.CLIENT} strokeWidth={2} />
            <circle cx={-160} cy={-88} r={4} fill={COLORS.SUCCESS} />
            <circle cx={-146} cy={-88} r={4} fill={COLORS.SERVICE} />
            <circle cx={-132} cy={-88} r={4} fill={COLORS.CLIENT} />
            <text x={0} y={-88} textAnchor="middle" fontSize={11} fontFamily="monospace" letterSpacing={2} fill={COLORS.MUTED}>{CLIENT_LABEL}</text>

            {/* REVISI-08: gate seluruh blok profil Adib di belakang browserLoading —
                skeleton dulu, avatar/nama/role/rambut asli baru render setelah GET 200. */}
            {browserLoading ? (
              <g>
                <circle cx={-120} cy={-10} r={30} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={4} opacity={0.6} />
                <rect x={-40} y={-32} width={140} height={12} rx={6} fill={COLORS.BORDER} opacity={0.5} />
                <rect x={-40} y={-10} width={100} height={10} rx={5} fill={COLORS.BORDER} opacity={0.4} />
                <rect x={-40} y={10} width={120} height={10} rx={5} fill={COLORS.BORDER} opacity={0.35} />
                <text x={-40} y={40} fontSize={12} fill={COLORS.MUTED} fontFamily="monospace">Memuat profil…</text>
              </g>
            ) : (
              <g>
                <g transform={T('adibAvatar', -120, -10)} opacity={O('adibAvatar')}>
                  {/* Bug E: panel browser render pakai adibHairDisplayed
                      (hydrate saat response tiba), BUKAN adibHairServer. */}
                  <circle cx={0} cy={0} r={30} fill={COLORS.PANEL} stroke={HAIR_HEX[adibHairDisplayed]} strokeWidth={4} />
                  <circle cx={0} cy={-6} r={10} fill={COLORS.MUTED} />
                  <path d="M -14 18 Q 0 0 14 18 L 14 24 L -14 24 Z" fill={COLORS.MUTED} />
                </g>
                <text x={-40} y={-25} fontSize={16} fontWeight={700} fill={COLORS.TEXT} fontFamily="sans-serif">{ADIB_PROFILE.name}</text>
                <text x={-40} y={-4} fontSize={12} fill={COLORS.MUTED} fontFamily="monospace">Usia {ADIB_PROFILE.age} · {adibRole}</text>
                <text x={-40} y={16} fontSize={12} fill={COLORS.MUTED} fontFamily="monospace">Rambut: {adibHairDisplayed === 'purple' ? 'ungu' : 'hitam'}</text>
              </g>
            )}

            {/* CTA button — satu tombol, label morph tiap Act (revisi-06: bukan 5 tombol numpuk) */}
            <g transform={T('ctaBtn', 0, 80)} opacity={O('ctaBtn')}>
              <rect x={-110} y={-16} width={220} height={34} rx={17}
                fill={browserClicked ? COLORS.CLIENT : COLORS.BG} stroke={COLORS.CLIENT} strokeWidth={2} />
              <text x={0} y={5} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="sans-serif"
                fill={browserClicked ? COLORS.BG : COLORS.CLIENT}>{ctaLabel}</text>
            </g>
          </g>

          {/* ── MINI-CARD JOKOWO — REVISI-08: window/kartu TERPISAH dari
              panel utama Adib, di CARD_JOKOWO_Y. Muncul HANYA setelah
              GET_JOKOWO selesai (jokowoCardVisible), animasi lewat pop
              id 'jokowoCard' yang di-trigger tepat saat applyMutation. ── */}
          {jokowoCardVisible && (
            <g transform={T('jokowoCard', AXIS_X, CARD_JOKOWO_Y)} opacity={O('jokowoCard')}>
              <rect x={-150} y={-26} width={300} height={52} rx={12} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={1.5} />
              <text x={-128} y={-3} fontSize={13} fontWeight={700} fill={COLORS.TEXT} fontFamily="sans-serif">{JOKOWO_PROFILE.name}</text>
              {/* Bug E: mini-card pakai jokowoRoleDisplayed, hydrate saat
                  response PATCH_JOKOWO tiba, bukan jokowoRoleServer. */}
              <text x={-128} y={15} fontSize={11} fill={COLORS.MUTED} fontFamily="monospace">Usia {JOKOWO_PROFILE.age} · {jokowoRoleDisplayed}</text>
              <text x={100} y={6} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.SUCCESS} fontFamily="monospace">GET 200</text>
            </g>
          )}

          {/* ── MINI-CARD PRABOWO — sama pola dengan Jokowo, di
              CARD_PRABOWO_Y, gated prabowoCardVisible; hilang lagi
              (popOut) saat DELETE_PRABOWO tanpa perlu GET tambahan. ── */}
          {prabowoCardVisible && (
            <g transform={T('prabowoCard', AXIS_X, CARD_PRABOWO_Y)} opacity={O('prabowoCard')}>
              <rect x={-150} y={-26} width={300} height={52} rx={12} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={1.5} />
              <text x={-128} y={-3} fontSize={13} fontWeight={700} fill={COLORS.TEXT} fontFamily="sans-serif">{PRABOWO_PROFILE.name}</text>
              <text x={-128} y={15} fontSize={11} fill={COLORS.MUTED} fontFamily="monospace">Usia {PRABOWO_PROFILE.age} · {PRABOWO_PROFILE.role}</text>
              <text x={100} y={6} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.SUCCESS} fontFamily="monospace">GET 200</text>
            </g>
          )}


          {/* ── API SERVICE HUB — gate + processor + cabinet, SATU panel,
              redup sejak Act 1, menyala saat tiket mendekat (revisi-06 §3.1) ── */}
          <g transform={`translate(${AXIS_X}, ${SERVICE_Y})`} opacity={hubOpacity}>
            <rect x={-190} y={-140} width={380} height={280} rx={16}
              fill={COLORS.PANEL} stroke={COLORS.SERVICE} strokeWidth={2}
              filter={hubGlow > 0.5 ? 'url(#glow)' : undefined} />
            <text x={0} y={-115} textAnchor="middle" fontSize={11} fontFamily="monospace" letterSpacing={2} fill={COLORS.MUTED}>{SERVICE_LABEL}</text>

            {/* Gate — compartment atas, menyala saat tiket tiba (bukan panel terpisah) */}
            <g opacity={gateActive ? 1 : 0.45}>
              <rect x={-150} y={-80} width={300} height={36} rx={8} fill="none"
                stroke={gateActive ? COLORS.SERVICE : COLORS.BORDER} strokeWidth={1.5} />
              <text x={0} y={-57} textAnchor="middle" fontSize={10} fontFamily="monospace" letterSpacing={1}
                fill={gateActive ? COLORS.SERVICE : COLORS.MUTED}>GATE</text>
            </g>

            {/* Processor — compartment tengah, menyala saat memproses mutasi */}
            <g opacity={resourceOpen ? 1 : 0.55}>
              <circle cx={0} cy={-8} r={32} fill="none" stroke={resourceOpen ? COLORS.SERVICE : COLORS.BORDER} strokeWidth={2} />
              <text x={0} y={-4} textAnchor="middle" fontSize={9} fontFamily="monospace" letterSpacing={1}
                fill={resourceOpen ? COLORS.SERVICE : COLORS.MUTED}>PROCESSOR</text>
            </g>


            {/* Cabinet — compartment bawah, lemari kartu member (persist, bukan pop-in dadakan) */}
            <g>
              <rect x={-150} y={50} width={300} height={72} rx={8} fill="none" stroke={COLORS.BORDER} strokeWidth={1.5} />
              <text x={0} y={44} textAnchor="middle" fontSize={10} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>
                {RESOURCE_LABEL.toUpperCase()}
              </text>
              {cabinetSlots.map((s, i) => {
                const sx = -112 + i * 75
                const isSelected = selectedDot === i
                return (
                  <g key={s.id} transform={`translate(${sx}, 86)`}>
                    <rect x={-30} y={-22} width={60} height={44} rx={6}
                      fill={isSelected ? COLORS.SERVICE : COLORS.BG}
                      stroke={s.filled ? COLORS.CLIENT : COLORS.BORDER}
                      strokeWidth={isSelected ? 2 : 1} opacity={s.filled ? 1 : 0.35} />
                    {/* REVISI-08 §10 (Bug H): nama cuma dirender kalau
                        slot sudah `filled` — sebelum POST sukses, server
                        belum "punya" data ini, jadi UI tidak boleh
                        membocorkannya lewat teks nama, walau kotaknya
                        sendiri sudah redup (opacity 0.35). */}
                    <text x={0} y={4} textAnchor="middle" fontSize={9} fontFamily="monospace"
                      fill={isSelected ? COLORS.BG : COLORS.TEXT}>
                      {s.filled ? String(s.name).slice(0, 6) : '— — —'}
                    </text>
                  </g>
                )
              })}
            </g>
          </g>


          {/* ── TICKET — satu tiket generic dipakai GET/POST/PUT/PATCH/DELETE,
              tidak pernah teleport: posisi y ditween tiap frame lewat travel() ── */}
          {reqVisible && (
            <g transform={`translate(${AXIS_X}, ${reqY})`}>
              <rect x={-80} y={-20} width={160} height={40} rx={10}
                fill={COLORS.BG} stroke={COLORS.CLIENT} strokeWidth={2} filter="url(#shadow)" />
              <text x={0} y={-3} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.CLIENT}>
                {activeTicket.method}
              </text>
              <text x={0} y={13} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>
                {activeTicket.path}
              </text>
            </g>
          )}

          {/* ── RESPONSE — pola sama seperti tiket, warna sukses, teks ganti per method ── */}
          {respVisible && (
            <g transform={`translate(${AXIS_X}, ${respY})`}>
              <rect x={-95} y={-20} width={190} height={40} rx={10}
                fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={2} filter="url(#shadow)" />
              <text x={0} y={-3} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>
                {activeResponse.statusLabel}
              </text>
              <text x={0} y={13} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>
                {activeResponse.responseLabel}
              </text>
            </g>
          )}


          {/* ── CAPTION — nempel dekat hub saat request diproses, dekat browser
              saat response sudah mendarat (bukan bar bawah statis, standar §D) ── */}
          {caption && (
            <g transform={`translate(${AXIS_X}, ${(reqVisible || resourceOpen) && !respVisible ? SERVICE_Y + 165 : CLIENT_Y + 130})`}>
              <text x={0} y={0} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily="sans-serif" fill={COLORS.TEXT}>
                {caption}
              </text>
            </g>
          )}
        </g>
      )}
    </svg>
  )
}
