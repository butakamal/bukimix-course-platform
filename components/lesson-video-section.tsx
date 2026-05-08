'use client'

import { useTransition } from 'react'
import YouTubePlayer from './youtube-player'
import { markAsCompleted } from '@/lib/actions/progress'

type Props = {
  videoId: string
  lessonId: string
  isCompleted: boolean
}

export default function LessonVideoSection({ videoId, lessonId, isCompleted }: Props) {
  const [, startTransition] = useTransition()

  function handleEnded() {
    if (isCompleted) return
    startTransition(async () => {
      await markAsCompleted(lessonId)
    })
  }

  return <YouTubePlayer videoId={videoId} onEnded={handleEnded} />
}
