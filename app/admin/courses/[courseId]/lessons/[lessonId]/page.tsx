import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LessonEditForm from './edit-form'
import type { Lesson } from '@/lib/types'

export default async function LessonEditPage(
  props: PageProps<'/admin/courses/[courseId]/lessons/[lessonId]'>
) {
  const { courseId, lessonId } = await props.params

  const supabase = await createClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .eq('course_id', courseId)
    .single()

  if (!lesson) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/courses" className="hover:text-foreground">
          講座一覧
        </Link>
        <span>/</span>
        <Link href={`/admin/courses/${courseId}`} className="hover:text-foreground">
          コース編集
        </Link>
        <span>/</span>
        <span>{(lesson as Lesson).title}</span>
      </div>

      <h1 className="text-2xl font-bold">レッスン編集</h1>

      <LessonEditForm lesson={lesson as Lesson} courseId={courseId} />
    </div>
  )
}
