import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteCourse } from '@/lib/actions/admin'
import DeleteForm from '@/components/admin/delete-form'
import type { Course } from '@/lib/types'

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('*, lessons(id)')
    .order('sort_order', { ascending: true })

  const courses = (data ?? []) as (Course & { lessons: { id: string }[] })[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">講座管理</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          ＋ 新規コース
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">コースがまだありません。</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">タイトル</th>
                <th className="px-4 py-3 text-left font-semibold">スラッグ</th>
                <th className="px-4 py-3 text-center font-semibold">レッスン数</th>
                <th className="px-4 py-3 text-center font-semibold">公開</th>
                <th className="px-4 py-3 text-center font-semibold">並び順</th>
                <th className="px-4 py-3 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.map((course) => (
                <tr key={course.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{course.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {course.slug}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {course.lessons?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {course.is_published ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        公開
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                        非公開
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {course.sort_order}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="rounded px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                      >
                        編集
                      </Link>
                      <DeleteForm
                        action={deleteCourse.bind(null, course.id)}
                        confirmMessage={`「${course.title}」を削除しますか？`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
