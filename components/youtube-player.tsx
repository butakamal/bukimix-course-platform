'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

type Props = {
  videoId: string
  onEnded?: () => void
}

export default function YouTubePlayer({ videoId, onEnded }: Props) {
  const [active, setActive] = useState(false)
  const [thumbError, setThumbError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!active) return

    function initPlayer() {
      if (!containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
        events: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) onEnded?.()
          },
        },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.querySelector('#yt-iframe-api')) {
        const tag = document.createElement('script')
        tag.id = 'yt-iframe-api'
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    }

    return () => {
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [active, videoId, onEnded])

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-black"
      style={{ paddingBottom: '56.25%' }}
    >
      {active ? (
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      ) : (
        <button
          className="absolute inset-0 h-full w-full group"
          onClick={() => setActive(true)}
          aria-label="動画を再生"
        >
          {thumbError ? (
            <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900" />
          ) : (
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
              onError={() => setThumbError(true)}
            />
          )}
          <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 shadow-xl transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="h-8 w-8 translate-x-0.5 fill-white" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
