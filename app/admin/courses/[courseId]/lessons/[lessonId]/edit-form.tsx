'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updateLesson } from '@/lib/actions/admin'
import type { ActionResult } from '@/lib/actions/admin'
import type { Lesson } from '@/lib/types'

export default function LessonEditForm({ lesson, courseId }: { lesson: Lesson; courseId: string }) {
  const action = updateLesson.bind(null, lesson.id, courseId)
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(action, {})

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-md bg-green-100 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
          保存しました
        </div>
      )}

      <Field label="タイトル *">
        <input
          name="title"
          required
          defaultValue={lesson.title}
          className="input-field"
        />
      </Field>

      <Field label="スラッグ *" hint="半角英数字とハイフンのみ">
        <input
          name="slug"
          required
          defaultValue={lesson.slug}
          className="input-field font-mono"
          pattern="[a-z0-9-]+"
        />
      </Field>

      <Field
        label="YouTube URL *"
        hint="例: https://www.youtube.com/watch?v=dQw4w9WgXcQ　または　https://youtu.be/dQw4w9WgXcQ"
      >
        <input
          name="youtube_url"
          required
          type="url"
          defaultValue={`https://www.youtube.com/watch?v=${lesson.youtube_video_id}`}
          className="input-field"
        />
      </Field>

      <Field label="説明">
        <textarea
          name="description"
          rows={4}
          defaultValue={lesson.description ?? ''}
          className="input-field resize-none"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="動画時間（秒）">
          <input
            name="duration_seconds"
            type="number"
            min={1}
            defaultValue={lesson.duration_seconds ?? ''}
            className="input-field"
          />
        </Field>

        <Field label="並び順">
          <input
            name="sort_order"
            type="number"
            min={1}
            defaultValue={lesson.sort_order}
            className="input-field"
          />
        </Field>
      </div>

      <Field label="公開設定">
        <label className="flex items-center gap-2 text-sm">
          <input
            name="is_published"
            type="checkbox"
            defaultChecked={lesson.is_published}
            className="h-4 w-4 rounded border-border"
          />
          公開する
        </label>
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? '保存中...' : '保存'}
        </button>
        <Link
          href={`/admin/courses/${courseId}`}
          className="rounded-md border border-border px-6 py-2 text-sm font-semibold transition-colors hover:bg-muted"
        >
          コース編集に戻る
        </Link>
      </div>
    </form>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  )
}
