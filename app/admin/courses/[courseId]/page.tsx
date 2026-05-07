import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteLesson } from '@/lib/actions/admin'
import DeleteForm from '@/components/admin/delete-form'
import CourseEditForm from './edit-form'
import type { Course, Lesson } from '@/lib/types'

export default async function CourseEditPage(props: PageProps<'/admin/courses/[courseId]'>) {
  const { courseId } = await props.params

  const supabase = await createClient()
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()

  if (!course) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/courses" className="hover:text-foreground">
          講座一覧
        </Link>
        <span>/</span>
        <span>{(course as Course).title}</span>
      </div>

      {/* Course edit form */}
      <section className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">コース編集</h1>
        <CourseEditForm course={course as Course} />
      </section>

      {/* Lesson list */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">レッスン一覧</h2>
          <Link
            href={`/admin/courses/${courseId}/lessons/new`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            ＋ 新規レッスン
          </Link>
        </div>

        {(lessons ?? []).length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            レッスンがまだありません。
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">順</th>
                  <th className="px-4 py-3 text-left font-semibold">タイトル</th>
                  <th className="px-4 py-3 text-left font-semibold">YouTube</th>
                  <th className="px-4 py-3 text-center font-semibold">時間</th>
                  <th className="px-4 py-3 text-center font-semibold">公開</th>
                  <th className="px-4 py-3 text-right font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(lessons as Lesson[]).map((lesson) => (
                  <tr key={lesson.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {lesson.sort_order}
                    </td>
                    <td className="px-4 py-3 font-medium">{lesson.title}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <a
                        href={`https://www.youtube.com/watch?v=${lesson.youtube_video_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline"
                      >
                        youtu.be/{lesson.youtube_video_id}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {lesson.duration_seconds
                        ? `${Math.floor(lesson.duration_seconds / 60)}:${String(lesson.duration_seconds % 60).padStart(2, '0')}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {lesson.is_published ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          公開
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                          非公開
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                          className="rounded px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          編集
                        </Link>
                        <DeleteForm
                          action={deleteLesson.bind(null, lesson.id, courseId)}
                          confirmMessage={`「${lesson.title}」を削除しますか？`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
