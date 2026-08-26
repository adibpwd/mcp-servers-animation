import React, { useEffect, useRef, useState } from 'react'
import './TimelineProgressBar.css'

export function TimelineProgressBar({ className = '', isExporting = false }) {
  const [progress, setProgress] = useState(0) // 0-100
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [timelineReady, setTimelineReady] = useState(false)
  
  const barRef = useRef(null)
  const rafRef = useRef(null)
  const prevProgressRef = useRef(0)

  // Wait for timeline to be ready
  useEffect(() => {
    const checkTimeline = () => {
      const tl = window.__animationTimeline
      if (tl) {
        setTimelineReady(true)
        setTotalDuration(tl.totalDuration())
      } else {
        setTimeout(checkTimeline, 100)
      }
    }
    checkTimeline()
  }, [])

  // Sync with GSAP timeline (loop-aware)
  useEffect(() => {
    if (!timelineReady) return

    const updateTime = () => {
      const tl = window.__animationTimeline
      if (tl) {
        const prog = tl.progress() * 100 // 0-100
        const time = tl.time()
        
        // Detect loop reset (progress jumps back to 0)
        if (prog < prevProgressRef.current - 5) {
          // Loop happened, reset is natural
        }
        prevProgressRef.current = prog

        setProgress(prog)
        setCurrentTime(time)
      }
      rafRef.current = requestAnimationFrame(updateTime)
    }
    
    rafRef.current = requestAnimationFrame(updateTime)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [timelineReady])

  // Format seconds to MM:SS
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Handle seek on click or drag (jump directly, no pause) with boundary clamping
  const handleSeek = (targetTime) => {
    if (!timelineReady) return
    
    // Clamp to [0, totalDuration]
    const clampedTime = Math.max(0, Math.min(totalDuration, targetTime))

    const tl = window.__animationTimeline
    if (tl) {
      // Jump directly to target time (no pause)
      tl.seek(clampedTime)
      setCurrentTime(clampedTime)
      const ratio = totalDuration > 0 ? clampedTime / totalDuration : 0
      setProgress(ratio * 100)
      prevProgressRef.current = ratio * 100
    }
  }

  const handleBarClick = (clientX) => {
    if (!barRef.current || !timelineReady) return
    const rect = barRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const targetTime = ratio * totalDuration
    handleSeek(targetTime)
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    handleBarClick(e.clientX)
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleBarClick(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  // PREV/NEXT button handlers
  const handlePrev = () => {
    handleSeek(currentTime - 5)
  }

  const handleNext = () => {
    handleSeek(currentTime + 5)
  }

  // Disabled states
  const isPrevDisabled = !timelineReady || currentTime <= 0
  const isNextDisabled = !timelineReady || currentTime >= totalDuration

  return (
    <div className={`timeline-progress-bar ${className} ${isExporting ? 'hidden' : ''}`}>
      <div className="timeline-controls">
        {/* PREV Button */}
        <button
          className="timeline-nav-btn prev-btn"
          onClick={handlePrev}
          disabled={isPrevDisabled}
          title="Skip backward 5 seconds"
        >
          ◀ PREV
        </button>

        {/* Timestamp */}
        <div className="timeline-time">
          <span className="time-current">{formatTime(currentTime)}</span>
          <span className="time-separator">/</span>
          <span className="time-total">{formatTime(totalDuration)}</span>
        </div>

        {/* Bar */}
        <div
          ref={barRef}
          className="timeline-bar"
          onMouseDown={handleMouseDown}
        >
          <div className="timeline-bar-bg" />
          <div className="timeline-bar-fill" style={{ width: `${progress}%` }} />
          <div
            className="timeline-knob"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* NEXT Button */}
        <button
          className="timeline-nav-btn next-btn"
          onClick={handleNext}
          disabled={isNextDisabled}
          title="Skip forward 5 seconds"
        >
          NEXT ▶
        </button>
      </div>
    </div>
  )
}
