import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, LABELS, TERMINAL, CAPTIONS, SFX_MAP,
  HOME_ITEMS, PROJECT_ITEMS, ETC_ITEMS, USR_ITEMS, FOLDER_SUMMARIES, PATH_EXAMPLES,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
} from '../../shared/scene-ui/v1'

export default function LinuxFilesystemAnimation({
  paused = false,
  speed = 1,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const tlRef = useRef(null)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)
  const audioUnlockedRef = useRef(audioUnlocked)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [morphP, setMorphP] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [caption, setCaption] = useState('')
  const [pop, setPop] = useState({})
  const [branchP, setBranchP] = useState(0)
  const [rootLit, setRootLit] = useState(false)
  const [leafBelanja, setLeafBelanja] = useState(false)
  const [term, setTerm] = useState({ home: false, project: false, lsEtc: false, usr: false, lsVar: false, lsTmp: false })
  const [etcGateOn, setEtcGateOn] = useState(false)
  const [logCount, setLogCount] = useState(0)
  const [cacheOn, setCacheOn] = useState(false)
  const [tmpCleared, setTmpCleared] = useState(false)
  const [pathP, setPathP] = useState(0)

  const P = (id) => pop[id] || { opacity: 0, scale: 0, x: 0, y: 0 }
  const play = (entry) => {
    if (!audioUnlockedRef.current || !entry) return
    sfxLoader.play(entry.category, entry.name, {
      volume: volumeRef.current,
      speed: speedRef.current,
    })
  }

  useEffect(() => {
    volumeRef.current = volume
    speedRef.current = speed
    audioUnlockedRef.current = audioUnlocked
    sfxLoader.setEnabled(Boolean(previewSfx && audioUnlocked))
  }, [volume, speed, previewSfx, audioUnlocked])

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    const popIn = (at, id, entry = SFX_MAP.POP, fromY = 12) => {
      const obj = { v: 0 }
      tl.add(() => setPop((prev) => ({
        ...prev,
        [id]: { opacity: 0, scale: 0, x: 0, y: fromY },
      })), at)
      tl.to(obj, {
        v: 1,
        duration: 0.42,
        ease: 'back.out(1.55)',
        onStart: () => play(entry),
        onUpdate: () => setPop((prev) => ({
          ...prev,
          [id]: {
            opacity: Math.min(1, obj.v * 1.4),
            scale: obj.v,
            x: 0,
            y: fromY * (1 - obj.v),
          },
        })),
      }, at)
    }

    let t = 0
    tl.add(() => {
      setPhaseIdx(0)
      setMorphP(0)
      setContentStarted(false)
      setCaption('')
      setPop({})
      setBranchP(0)
      setRootLit(false)
      setLeafBelanja(false)
      setTerm({ home: false, project: false, lsEtc: false, usr: false, lsVar: false, lsTmp: false })
      setEtcGateOn(false)
      setLogCount(0)
      setCacheOn(false)
      setTmpCleared(false)
      setPathP(0)
    }, t)

    t += 0.25
    const morph = { p: 0 }
    tl.to(morph, {
      p: 1,
      duration: 0.9,
      ease: 'power3.inOut',
      onUpdate: () => setMorphP(morph.p),
    }, t)
    t += 0.9
    tl.add(() => {
      setContentStarted(true)
      play(SFX_MAP.SHIMMER)
    }, t)

    // ---------- Act 1: dari GUI ke home ----------
    const act1Start = t
    tl.add(() => setPhaseIdx(0), act1Start)
    popIn(t + 0.15, 'root', SFX_MAP.POP)
    tl.add(() => setRootLit(true), t + 0.2)
    tl.add(() => setCaption('Semua file Linux mulai dari slash.'), t + 0.3)
    t += 0.5
    const branches = { p: 0 }
    tl.to(branches, {
      p: 1,
      duration: 1.1,
      ease: 'power2.inOut',
      onStart: () => play(SFX_MAP.SNAP),
      onUpdate: () => setBranchP(branches.p),
    }, t)
    tl.add(() => setCaption('Semua folder bercabang dari akar.'), t + 0.35)
    t += 1.35
    popIn(t, 'folder-home', SFX_MAP.POP2)
    popIn(t + 0.2, 'folder-etc', SFX_MAP.POP)
    popIn(t + 0.4, 'folder-var', SFX_MAP.POP2)
    popIn(t + 0.6, 'folder-tmp', SFX_MAP.POP)
    t += 1.6
    popIn(t, 'file-manager', SFX_MAP.POP)
    t += 0.3
    popIn(t, 'home-list', SFX_MAP.ARRIVE)
    tl.add(() => setCaption(CAPTIONS.FILE_SAVED), t + 0.1)
    t += 0.9
    popIn(t, 'project-detail', SFX_MAP.POP2)
    t += 0.45
    popIn(t, 'terminal', SFX_MAP.POP2)
    t += 0.3
    tl.add(() => {
      setTerm((prev) => ({ ...prev, home: true }))
      play(SFX_MAP.TICK)
    }, t)
    t += 0.5
    tl.add(() => {
      setTerm((prev) => ({ ...prev, project: true }))
      setCaption(CAPTIONS.HOME_PATH_SHOWN)
      play(SFX_MAP.TICK)
    }, t)
    t += 0.6
    tl.add(() => {
      setLeafBelanja(true)
      play(SFX_MAP.POP2)
    }, t)
    t = act1Start + PHASES[0].duration

    // ---------- Act 2: etc bukan folder pribadi ----------
    const act2Start = t
    tl.add(() => setPhaseIdx(1), act2Start)
    tl.add(() => {
      setTerm((prev) => ({ ...prev, lsEtc: true }))
      setCaption(CAPTIONS.ETC_COMPARE)
      play(SFX_MAP.TICK)
    }, t + 0.15)
    popIn(t + 0.65, 'etc-content', SFX_MAP.POP2)
    t += 1.45
    popIn(t, 'etc-gate', SFX_MAP.LOCK)
    tl.add(() => {
      setEtcGateOn(true)
      setCaption(CAPTIONS.ETC_ADMIN)
    }, t + 0.1)
    t += 1.4
    popIn(t, 'usr-content', SFX_MAP.POP)
    tl.add(() => {
      setTerm((prev) => ({ ...prev, usr: true }))
      play(SFX_MAP.TICK)
    }, t + 0.25)
    t += 2.1
    tl.add(() => {
      setCaption('Home dan etc menyimpan hal berbeda.')
      play(SFX_MAP.BEEP)
    }, t)
    t = act2Start + PHASES[1].duration

    // ---------- Act 3: var dan tmp saat aplikasi bekerja ----------
    const act3Start = t
    tl.add(() => setPhaseIdx(2), act3Start)
    popIn(t + 0.15, 'app-window', SFX_MAP.POP2)
    tl.add(() => setCaption(CAPTIONS.VAR_GROW), t + 0.3)
    t += 1.0
    tl.add(() => { setLogCount(1); play(SFX_MAP.BEEP) }, t)
    t += 0.6
    tl.add(() => { setLogCount(2); play(SFX_MAP.BEEP) }, t)
    t += 0.6
    tl.add(() => { setLogCount(3); play(SFX_MAP.BEEP) }, t)
    t += 0.6
    tl.add(() => { setCacheOn(true); play(SFX_MAP.POP2) }, t)
    popIn(t + 0.2, 'runtime-content', SFX_MAP.POP)
    tl.add(() => setTerm((prev) => ({ ...prev, lsVar: true })), t + 0.3)
    t += 1.7
    popIn(t, 'tmp-draft', SFX_MAP.ARRIVE)
    tl.add(() => setTerm((prev) => ({ ...prev, lsTmp: true })), t + 0.25)
    tl.add(() => setCaption(CAPTIONS.TMP_APPEAR), t + 0.15)
    t += 3.0
    tl.add(() => {
      setTmpCleared(true)
      setCaption(CAPTIONS.TMP_CLEARED)
      play(SFX_MAP.CLEAR)
    }, t)
    t = act3Start + PHASES[2].duration

    // ---------- Act 4: semua menjadi alamat ----------
    const act4Start = t
    tl.add(() => setPhaseIdx(3), act4Start)
    popIn(t + 0.15, 'file-manager-2', SFX_MAP.POP)
    tl.add(() => setCaption(CAPTIONS.PATH_BUILD), t + 0.25)
    t += 1.2
    const path = { p: 0 }
    tl.to(path, {
      p: 1,
      duration: 1.6,
      ease: 'power2.inOut',
      onStart: () => play(SFX_MAP.PATH),
      onUpdate: () => setPathP(path.p),
    }, t)
    popIn(t + 0.35, 'path-examples', SFX_MAP.POP2)
    t += 2.4
    popIn(t, 'target-file', SFX_MAP.SUCCESS)
    tl.add(() => setCaption(CAPTIONS.PATH_DONE), t + 0.1)
    t += 2.9
    popIn(t, 'takeaway', SFX_MAP.SUCCESS)
    tl.add(() => setCaption(CAPTIONS.TAKEAWAY), t + 0.1)
    t = act4Start + PHASES[3].duration
    tl.to({}, { duration: 0.01 }, t)

    return () => {
      tl.kill()
      if (window.__animationTimeline === tl) delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    tl.timeScale(speed)
    if (paused) tl.pause()
    else tl.resume()
  }, [paused, speed])

  const transform = (id, x, y) => {
    const p = P(id)
    return 'translate(' + (x + p.x) + ' ' + (y + p.y) + ') scale(' + p.scale + ')'
  }

  const FolderNode = ({ id, x, y, label, color, summary }) => {
    const p = P(id)
    return (
      <g opacity={p.opacity} transform={transform(id, x, y)}>
        <path d="M-52 -16 h38 l10 11 h56 v44 h-104 z" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="2" />
        <path d="M-52 -16 h38 l10 11 h-56 z" fill={color} opacity="0.32" />
        <text x="0" y="15" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="16" fill={color}>{label}</text>
        <text x="0" y="31" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>{summary}</text>
      </g>
    )
  }

  const TermLine = ({ y, cmd, out, show }) => (
    <g opacity={show ? 1 : 0}>
      <text x="-98" y={y} fontFamily="monospace" fontSize="13" fill={COLORS.SUCCESS}>{cmd}</text>
      <text x="-98" y={y + 17} fontFamily="monospace" fontSize="13" fill={COLORS.MUTED}>{out}</text>
    </g>
  )

  const DetailPanel = ({ x, y, width, title, color, items, opacity = 1, scale = 1 }) => (
    <g opacity={opacity} transform={'translate(' + x + ' ' + y + ') scale(' + scale + ')'}>
      <rect x={-width / 2} y="-24" width={width} height={items.length * 25 + 44} rx="12" fill={COLORS.PANEL} stroke={color} strokeWidth="1.5" />
      <text x={-width / 2 + 14} y="-6" fontFamily="monospace" fontSize="13" fontWeight="700" fill={color}>{title}</text>
      {items.map((item, index) => (
        <g key={item.name} transform={'translate(' + (-width / 2 + 14) + ' ' + (14 + index * 25) + ')'}>
          <circle cx="4" cy="-4" r="3" fill={item.color || color} />
          <text x="14" y="0" fontFamily="monospace" fontSize="12" fontWeight="700" fill={COLORS.TEXT}>{item.icon ? item.icon + '  ' : ''}{item.name}</text>
          <text x={width - 30} y="0" textAnchor="end" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>{item.detail}</text>
        </g>
      ))}
    </g>
  )

  const pRoot = P('root')
  const pFileManager = P('file-manager')
  const pFileManager2 = P('file-manager-2')
  const pHomeList = P('home-list')
  const pProjectDetail = P('project-detail')
  const pEtcContent = P('etc-content')
  const pUsrContent = P('usr-content')
  const pRuntimeContent = P('runtime-content')
  const pPathExamples = P('path-examples')
  const pTerminal = P('terminal')
  const pEtcGate = P('etc-gate')
  const pAppWindow = P('app-window')
  const pTmpDraft = P('tmp-draft')
  const pTargetFile = P('target-file')
  const pTakeaway = P('takeaway')

  const showGuiTerminal = phaseIdx === 0 || phaseIdx === 3
  const pFm = phaseIdx === 3 ? pFileManager2 : pFileManager
  const fmId = phaseIdx === 3 ? 'file-manager-2' : 'file-manager'

  return (
    <svg viewBox={'0 0 ' + VW + ' ' + VH} style={{
      width: '100%',
      height: '100%',
      maxHeight: '100vh',
      maxWidth: 'calc(100vh * ' + VW + ' / ' + VH + ')',
      background: COLORS.BG,
      userSelect: 'none',
    }}>
      <defs>
        <filter id="filesystem-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width={VW} height={VH} fill={COLORS.BG} />
      <g opacity="0.18">
        {[80, 180, 280, 380, 480, 580, 680, 780].map((x) => <line key={x} x1={x} y1="0" x2={x} y2={VH} stroke={COLORS.BORDER} strokeWidth="1" />)}
        {[280, 440, 600, 760, 920, 1080, 1240].map((y) => <line key={y} x1="0" y1={y} x2={VW} y2={y} stroke={COLORS.BORDER} strokeWidth="1" />)}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.ROOT },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.ROOT },
          { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
        ]}
        titleLines={[
          [{ label: 'LINUX', color: COLORS.ROOT }],
          [{ label: 'FILESYSTEM', color: COLORS.SUCCESS }],
        ]}
        subtitle={INTRO_SUBTITLE}
        titleFilter="url(#filesystem-glow)"
        testId="linux-filesystem-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1
          phases={PHASES}
          activeIndex={phaseIdx}
          testId="linux-filesystem-navigator"
        />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="linux-filesystem-body">
          <g>
            {/* Narration bubble — local y 35-115 */}
            <g transform="translate(366 75)">
              <rect x="-260" y="-32" width="520" height="64" rx="22" fill={COLORS.PANEL} stroke={PHASES[phaseIdx].badgeColor} strokeWidth="1.5" />
              <path d="M-40 32 l-14 18 l36 -18 z" fill={COLORS.PANEL} stroke={PHASES[phaseIdx].badgeColor} strokeWidth="1.5" />
              <text x="0" y="7" textAnchor="middle" fontSize="16" fontWeight="700" fill={COLORS.TEXT}>{caption}</text>
            </g>

            {/* GUI/terminal context — local y 145-340 */}
            {showGuiTerminal && (
              <g opacity={pFm.opacity} transform={transform(fmId, 210, 240)}>
                <rect x="-150" y="-88" width="300" height="176" rx="14" fill={COLORS.PANEL} stroke={COLORS.HOME} strokeWidth="1.5" />
                <circle cx="-130" cy="-52" r="4" fill={COLORS.DANGER} />
                <circle cx="-116" cy="-52" r="4" fill={COLORS.TEMP} />
                <circle cx="-102" cy="-52" r="4" fill={COLORS.SUCCESS} />
                <text x="-134" y="-24" fontFamily="monospace" fontSize="13" fontWeight="700" fill={COLORS.HOME}>Home / adib</text>
                <g opacity={pHomeList.opacity} transform={'translate(0 ' + (pHomeList.y) + ') scale(' + pHomeList.scale + ')'}>
                  {HOME_ITEMS.slice(0, 4).map((item, index) => (
                    <g key={item.name} transform={'translate(' + (index % 2 === 0 ? -124 : 12) + ' ' + (-3 + Math.floor(index / 2) * 35) + ')'}>
                      <rect width="112" height="26" rx="6" fill={COLORS.PANEL_ALT} stroke={item.color} strokeWidth="1" />
                      <text x="8" y="17" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT}>{item.name}</text>
                    </g>
                  ))}
                </g>
              </g>
            )}

            {showGuiTerminal && (
              <g opacity={pTerminal.opacity} transform={transform('terminal', 560, 240)}>
                <rect x="-140" y="-88" width="280" height="176" rx="14" fill={COLORS.PANEL_ALT} stroke={COLORS.BORDER} strokeWidth="1.5" />
                <TermLine y={-55} cmd={TERMINAL.HOME_CMD} out={TERMINAL.HOME_OUT} show={term.home} />
                <TermLine y={-12} cmd={TERMINAL.PROJECT_CMD} out={TERMINAL.PROJECT_OUT} show={term.project} />
              </g>
            )}

            {phaseIdx === 1 && (
              <g transform="translate(560 240)">
                <rect x="-140" y="-88" width="280" height="176" rx="14" fill={COLORS.PANEL_ALT} stroke={COLORS.BORDER} strokeWidth="1.5" />
                <TermLine y={-50} cmd={TERMINAL.LS_ETC_CMD} out={TERMINAL.LS_ETC_OUT} show={term.lsEtc} />
                <TermLine y={-5} cmd={TERMINAL.USR_CMD} out={TERMINAL.USR_OUT} show={term.usr} />
              </g>
            )}

            {phaseIdx === 2 && (
              <g opacity={pAppWindow.opacity} transform={transform('app-window', 366, 240)}>
                <rect x="-120" y="-38" width="240" height="76" rx="16" fill={COLORS.PANEL} stroke={COLORS.VARIABLE} strokeWidth="1.5" />
                <text x="0" y="-4" textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={COLORS.VARIABLE}>inventory-api</text>
                <text x="0" y="17" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>node server.js · menerima request</text>
              </g>
            )}

            {/* Folder/function scene — local y 380-655 (persistent tree) */}
            <g>
              {(() => {
                const edge = (x2, y2, color) => (
                  <line x1="366" y1="420" x2={366 + (x2 - 366) * branchP} y2={420 + (y2 - 420) * branchP}
                    stroke={color} strokeWidth="3" strokeLinecap="round" opacity={branchP > 0 ? 0.8 : 0} />
                )
                return (
                  <g>
                    {edge(150, 540, COLORS.HOME)}
                    {edge(582, 540, COLORS.CONFIG)}
                    {edge(150, 630, COLORS.VARIABLE)}
                    {edge(582, 630, COLORS.TEMP)}
                    <g opacity={pRoot.opacity} transform={transform('root', 366, 420)}>
                      <circle r="42" fill={COLORS.PANEL} stroke={COLORS.ROOT} strokeWidth={rootLit ? 3 : 1.5} />
                      <text y="12" textAnchor="middle" fontFamily="monospace" fontSize="42" fontWeight="700" fill={COLORS.ROOT}>{LABELS.ROOT}</text>
                    </g>
                    <FolderNode id="folder-home" x={150} y={540} label={LABELS.HOME} color={COLORS.HOME} summary={FOLDER_SUMMARIES[0].label} />
                    <FolderNode id="folder-etc" x={582} y={540} label={LABELS.ETC} color={COLORS.CONFIG} summary={FOLDER_SUMMARIES[1].label} />
                    <FolderNode id="folder-var" x={150} y={630} label={LABELS.VAR} color={COLORS.VARIABLE} summary={FOLDER_SUMMARIES[2].label} />
                    <FolderNode id="folder-tmp" x={582} y={630} label={LABELS.TMP} color={COLORS.TEMP} summary={FOLDER_SUMMARIES[4].label} />
                    <g opacity={leafBelanja ? 1 : 0} transform="translate(150 588)">
                      <rect x="-56" y="0" width="112" height="24" rx="6" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="1.5" />
                      <text x="0" y="17" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.SUCCESS}>{LABELS.TARGET}</text>
                    </g>
                    {etcGateOn && (
                      <g opacity={pEtcGate.opacity} transform={transform('etc-gate', 582, 588)}>
                        <rect x="-58" y="0" width="116" height="24" rx="6" fill={COLORS.PANEL_ALT} stroke={COLORS.CONFIG} strokeWidth="1.5" />
                        <text x="0" y="17" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={COLORS.CONFIG}>Admin diperlukan</text>
                      </g>
                    )}
                  </g>
                )
              })()}
            </g>

            {/* Runtime/path lane — local y 690-800 */}
            {phaseIdx === 0 && (
              <DetailPanel
                x={366} y={710} width={600} title="~/Projects/inventory-api  —  isi repository"
                color={COLORS.HOME} items={PROJECT_ITEMS}
                opacity={pProjectDetail.opacity} scale={pProjectDetail.scale}
              />
            )}

            {phaseIdx === 1 && (
              <g>
                <DetailPanel x={188} y={710} width={340} title="/etc  —  konfigurasi layanan" color={COLORS.CONFIG}
                  items={ETC_ITEMS} opacity={pEtcContent.opacity} scale={pEtcContent.scale} />
                <DetailPanel x={544} y={710} width={340} title="/usr & /opt  —  program terpasang" color={COLORS.SUCCESS}
                  items={USR_ITEMS} opacity={pUsrContent.opacity} scale={pUsrContent.scale} />
              </g>
            )}

            {phaseIdx === 2 && (
              <g opacity={pRuntimeContent.opacity} transform={'translate(366 730) scale(' + pRuntimeContent.scale + ')'}>
                <DetailPanel x={-210} y={0} width={220} title="/var/log" color={COLORS.VARIABLE}
                  items={[
                    { name: 'app.log', detail: logCount >= 1 ? '+ request GET /api' : 'menunggu request' },
                    { name: 'nginx/access.log', detail: logCount >= 2 ? '+ status 200' : 'menunggu request' },
                    { name: 'docker.log', detail: logCount >= 3 ? '+ container ready' : 'menunggu request' },
                  ]} />
                <DetailPanel x={30} y={0} width={210} title="/var/cache" color={COLORS.VARIABLE}
                  items={[
                    { name: 'npm/', detail: cacheOn ? 'package cache' : 'belum dibuat' },
                    { name: 'app/', detail: cacheOn ? 'response cache' : 'belum dibuat' },
                  ]} />
                <g opacity={pTmpDraft.opacity} transform={transform('tmp-draft', 260, 0)}>
                  <DetailPanel x={0} y={0} width={200} title="/tmp" color={COLORS.TEMP}
                    items={[
                      { name: tmpCleared ? 'build dibersihkan' : 'vite-build-8192', detail: tmpCleared ? 'sementara hilang' : 'output sementara' },
                      { name: 'upload-preview', detail: 'preview sesaat' },
                    ]} />
                </g>
              </g>
            )}

            {phaseIdx === 3 && (
              <g transform="translate(366 700)">
                <rect x="-306" y="-30" width="612" height="60" rx="16" fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth="2" />
                <text x="-285" y="-4" fontFamily="monospace" fontSize="15" fontWeight="700" fill={COLORS.TEXT}>{LABELS.PATH}</text>
                <line x1="-285" y1="16" x2={-285 + 550 * pathP} y2="16" stroke={COLORS.SUCCESS} strokeWidth="4" strokeLinecap="round" />
                <g opacity={pPathExamples.opacity} transform={'translate(0 62) scale(' + pPathExamples.scale + ')'}>
                  {PATH_EXAMPLES.map((item, index) => (
                    <g key={item.path} transform={'translate(0 ' + (index * 31) + ')'}>
                      <rect x="-306" y="0" width="612" height="25" rx="6" fill={COLORS.PANEL_ALT} stroke={item.color} strokeWidth="1" />
                      <text x="-294" y="17" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT}>{item.path}</text>
                      <text x="294" y="17" textAnchor="end" fontFamily="monospace" fontSize="10" fill={item.color}>{item.label}</text>
                    </g>
                  ))}
                </g>
              </g>
            )}

            {phaseIdx === 3 && (
              <g opacity={pTargetFile.opacity} transform={transform('target-file', 366, 880)}>
                <path d="M-70 -30 h90 l30 30 v52 h-120 z" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="2.5" />
                <path d="M20 -30 v30 h30" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2.5" />
                <text x="-10" y="16" textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={COLORS.SUCCESS}>{LABELS.TARGET}</text>
              </g>
            )}

            {/* Takeaway — local y 850-930 */}
            <g opacity={pTakeaway.opacity} transform={transform('takeaway', 366, 900)}>
              <rect x="-262" y="-31" width="524" height="62" rx="28" fill={COLORS.SUCCESS} opacity="0.16" />
              <rect x="-262" y="-31" width="524" height="62" rx="28" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2" />
              <text x="0" y="7" textAnchor="middle" fontSize="18" fontWeight="700" fill={COLORS.SUCCESS}>{CAPTIONS.TAKEAWAY}</text>
            </g>
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
