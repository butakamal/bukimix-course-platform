'use client'

import { useTransition } from 'react'
import { markAsCompleted, markAsIncomplete } from '@/lib/actions/progress'

type Props = {
  lessonId: string
  isCompleted: boolean
}

export default function MarkAsCompletedButton({ lessonId, isCompleted }: Props) {
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      if (isCompleted) {
        await markAsIncomplete(lessonId)
      } else {
        await markAsCompleted(lessonId)
      }
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
        isCompleted
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'border border-border bg-background hover:bg-muted'
      }`}
    >
      <span>{isCompleted ? '✓' : '○'}</span>
      {isPending ? '処理中…' : isCompleted ? '視聴済み' : '視聴済みにする'}
    </button>
  )
}
