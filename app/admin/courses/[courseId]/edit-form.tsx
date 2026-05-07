'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updateCourse } from '@/lib/actions/admin'
import type { ActionResult } from '@/lib/actions/admin'
import type { Course } from '@/lib/types'

export default function CourseEditForm({ course }: { course: Course }) {
  const action = updateCourse.bind(null, course.id)
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
          defaultValue={course.title}
          className="input-field"
        />
      </Field>

      <Field label="スラッグ *" hint="半角英数字とハイフンのみ">
        <input
          name="slug"
          required
          defaultValue={course.slug}
          className="input-field font-mono"
          pattern="[a-z0-9-]+"
        />
      </Field>

      <Field label="説明">
        <textarea
          name="description"
          rows={4}
          defaultValue={course.description ?? ''}
          className="input-field resize-none"
        />
      </Field>

      <Field label="サムネイル URL">
        <input
          name="thumbnail_url"
          type="url"
          defaultValue={course.thumbnail_url ?? ''}
          className="input-field"
          placeholder="https://..."
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="並び順">
          <input
            name="sort_order"
            type="number"
            min={1}
            defaultValue={course.sort_order}
            className="input-field"
          />
        </Field>

        <Field label="公開設定">
          <label className="flex items-center gap-2 pt-2 text-sm">
            <input
              name="is_published"
              type="checkbox"
              defaultChecked={course.is_published}
              className="h-4 w-4 rounded border-border"
            />
            公開する
          </label>
        </Field>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? '保存中...' : '保存'}
        </button>
        <Link
          href="/admin/courses"
          className="rounded-md border border-border px-6 py-2 text-sm font-semibold transition-colors hover:bg-muted"
        >
          一覧に戻る
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
