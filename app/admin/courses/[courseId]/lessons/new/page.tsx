'use client'

import { use, useActionState } from 'react'
import Link from 'next/link'
import { createLesson } from '@/lib/actions/admin'
import type { ActionResult } from '@/lib/actions/admin'

export default function NewLessonPage(props: PageProps<'/admin/courses/[courseId]/lessons/new'>) {
  const { courseId } = use(props.params)
  const action = createLesson.bind(null, courseId)
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(action, {})

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/courses/${courseId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← コース編集
        </Link>
        <h1 className="text-2xl font-bold">新規レッスン</h1>
      </div>

      <form action={formAction} className="space-y-5">
        {state.error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        <Field label="タイトル *">
          <input
            name="title"
            required
            className="input-field"
            placeholder="例: App Router の基礎"
          />
        </Field>

        <Field label="スラッグ *" hint="半角英数字とハイフンのみ（例: app-router-basics）">
          <input
            name="slug"
            required
            className="input-field font-mono"
            placeholder="app-router-basics"
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
            className="input-field"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>

        <Field label="説明">
          <textarea
            name="description"
            rows={4}
            className="input-field resize-none"
            placeholder="レッスンの説明を入力してください"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="動画時間（秒）">
            <input
              name="duration_seconds"
              type="number"
              min={1}
              className="input-field"
              placeholder="213"
            />
          </Field>

          <Field label="並び順">
            <input
              name="sort_order"
              type="number"
              min={1}
              defaultValue={1}
              className="input-field"
            />
          </Field>
        </div>

        <Field label="公開設定">
          <label className="flex items-center gap-2 text-sm">
            <input
              name="is_published"
              type="checkbox"
              defaultChecked
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
            キャンセル
          </Link>
        </div>
      </form>
    </div>
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
