'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  getCurrentTime: () => number
  getDuration: () => number
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  destroy: () => void
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: {
          videoId: string
          width?: string | number
          height?: string | number
          playerVars?: Record<string, number | string>
          events?: {
            onReady?: (event: { target: YTPlayer }) => void
            onStateChange?: (event: { data: number; target: YTPlayer }) => void
          }
        }
      ) => YTPlayer
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

let youtubeApiPromise: Promise<void> | null = null

function loadYouTubeApi() {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.YT?.Player) {
    return Promise.resolve()
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady

      window.onYouTubeIframeAPIReady = () => {
        previousReady?.()
        resolve()
      }

      if (!document.getElementById('youtube-iframe-api')) {
        const script = document.createElement('script')
        script.id = 'youtube-iframe-api'
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(script)
      }
    })
  }

  return youtubeApiPromise
}

type StoryworldVideoPlayerProps = {
  youtubeId: string
  className?: string
}

export function StoryworldVideoPlayer({ youtubeId, className }: StoryworldVideoPlayerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const progressTimerRef = useRef<number | null>(null)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const posterSrc = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`

  useEffect(() => {
    let cancelled = false

    const initPlayer = async () => {
      await loadYouTubeApi()
      if (cancelled || !mountRef.current || !window.YT) return

      const player = new window.YT.Player(mountRef.current, {
        videoId: youtubeId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1,
          fs: 0,
          disablekb: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return
            playerRef.current = target
            setDuration(target.getDuration() || 0)
            setVolume(target.getVolume())
            setIsMuted(target.isMuted())
            setIsReady(true)
          },
          onStateChange: ({ data, target }) => {
            const playing = data === window.YT?.PlayerState.PLAYING
            const ended = data === window.YT?.PlayerState.ENDED
            setIsPlaying(playing)

            if (ended) {
              setIsPlaying(false)
              setCurrentTime(0)
              target.seekTo(0, true)
              target.pauseVideo()
            }
          },
        },
      })

      playerRef.current = player
    }

    void initPlayer()

    return () => {
      cancelled = true
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current)
      }
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [youtubeId])

  useEffect(() => {
    if (!isPlaying) {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
      return
    }

    progressTimerRef.current = window.setInterval(() => {
      const player = playerRef.current
      if (!player) return
      setCurrentTime(player.getCurrentTime())
      setDuration(player.getDuration() || 0)
    }, 250)

    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
    }
  }, [isPlaying])

  const togglePlayback = () => {
    const player = playerRef.current
    if (!player) return

    if (isPlaying) {
      player.pauseVideo()
      setIsPlaying(false)
      return
    }

    setHasStarted(true)
    player.playVideo()
    setIsPlaying(true)
  }

  const handleSeek = (value: number) => {
    const player = playerRef.current
    if (!player) return

    setCurrentTime(value)
    player.seekTo(value, true)
  }

  const handleVolumeChange = (value: number) => {
    const player = playerRef.current
    if (!player) return

    setVolume(value)
    setIsMuted(value === 0)

    if (value === 0) {
      player.mute()
      return
    }

    player.unMute()
    player.setVolume(value)
  }

  const toggleMute = () => {
    const player = playerRef.current
    if (!player) return

    if (isMuted || volume === 0) {
      const nextVolume = volume === 0 ? 80 : volume
      player.unMute()
      player.setVolume(nextVolume)
      setVolume(nextVolume)
      setIsMuted(false)
      return
    }

    player.mute()
    setIsMuted(true)
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[12px] bg-font-600 shadow-[0px_4px_3px_rgba(0,0,0,0.1)]',
        className
      )}
    >
      <div className="relative aspect-[592/443] w-full bg-black">
        <div ref={mountRef} className="absolute inset-0 h-full w-full" />
        {!hasStarted && (
          <button
            type="button"
            onClick={togglePlayback}
            disabled={!isReady}
            aria-label="Start video"
            className="absolute inset-0 z-10 overflow-hidden disabled:cursor-wait"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterSrc}
              alt=""
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-black/20 transition-colors hover:bg-black/30" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-brand-500/90 text-bg-100 shadow-lg">
                <Play className="size-7 translate-x-0.5" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 bg-font-600 px-4 py-3">
        <button
          type="button"
          onClick={togglePlayback}
          disabled={!isReady}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-bg-100 transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
        </button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          disabled={!isReady || duration === 0}
          onChange={(event) => handleSeek(Number(event.target.value))}
          aria-label="Video progress"
          className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-brand-400 disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={toggleMute}
          disabled={!isReady}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-bg-100 transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="size-5" />
          ) : (
            <Volume2 className="size-5" />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={isMuted ? 0 : volume}
          disabled={!isReady}
          onChange={(event) => handleVolumeChange(Number(event.target.value))}
          aria-label="Video volume"
          className="h-1.5 w-20 shrink-0 cursor-pointer appearance-none rounded-full bg-white/20 accent-brand-400 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}
