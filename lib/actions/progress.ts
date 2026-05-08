'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) throw new Error('Unauthorized')
  return { supabase, userId: data.claims.sub }
}

async function revalidateCourseByLesson(
  supabase: Awaited<ReturnType<typeof createClient>>,
  lessonId: string
) {
  const { data } = await supabase
    .from('lessons')
    .select('courses(slug)')
    .eq('id', lessonId)
    .single()
  const courseSlug = (data?.courses as { slug: string }[] | null)?.[0]?.slug
  if (courseSlug) revalidatePath(`/courses/${courseSlug}`)
}

export async function markAsCompleted(lessonId: string) {
  const { supabase, userId } = await getAuthenticatedUser()

  await supabase.from('progress').upsert(
    { user_id: userId, lesson_id: lessonId },
    { onConflict: 'user_id,lesson_id', ignoreDuplicates: true }
  )

  await revalidateCourseByLesson(supabase, lessonId)
  revalidatePath('/my')
  updateTag('courses')
}

export async function markAsIncomplete(lessonId: string) {
  const { supabase, userId } = await getAuthenticatedUser()

  await supabase
    .from('progress')
    .delete()
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)

  await revalidateCourseByLesson(supabase, lessonId)
  revalidatePath('/my')
  updateTag('courses')
}
