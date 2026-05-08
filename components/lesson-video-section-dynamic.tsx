'use client'

import dynamic from 'next/dynamic'

const LessonVideoSection = dynamic(() => import('@/components/lesson-video-section'), {
  ssr: false,
  loading: () => <div className="aspect-video animate-pulse rounded-xl bg-muted" />,
})

export default LessonVideoSection
