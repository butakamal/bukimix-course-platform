'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) throw new Error('Unauthorized')
  return { supabase, userId: data.claims.sub }
}

export async function markAsCompleted(lessonId: string, courseSlug: string) {
  const { supabase, userId } = await getAuthenticatedUser()

  await supabase.from('progress').upsert(
    { user_id: userId, lesson_id: lessonId },
    { onConflict: 'user_id,lesson_id', ignoreDuplicates: true }
  )

  revalidatePath(`/courses/${courseSlug}`)
  revalidatePath(`/my`)
}

export async function markAsIncomplete(lessonId: string, courseSlug: string) {
  const { supabase, userId } = await getAuthenticatedUser()

  await supabase
    .from('progress')
    .delete()
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)

  revalidatePath(`/courses/${courseSlug}`)
  revalidatePath(`/my`)
}
