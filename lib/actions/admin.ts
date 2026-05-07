'use server'

import { redirect } from 'next/navigation'
import { updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { error?: string; success?: boolean }

async function assertAdmin() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const email = data?.claims?.email as string | undefined
  if (!email || email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }
  return supabase
}

const SLUG_RE = /^[a-z0-9-]{1,100}$/

const YT_HOSTNAMES = new Set(['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'])

function parseYouTubeUrl(input: string): string | null {
  const trimmed = input.trim()
  // Already a bare video ID (11 chars: alphanumeric, -, _)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.hostname !== 'youtu.be' && YT_HOSTNAMES.has(url.hostname)) {
      // /watch?v=ID or /shorts/ID or /embed/ID
      const v = url.searchParams.get('v')
      if (v) return v
      const parts = url.pathname.split('/')
      const shortIdx = parts.indexOf('shorts')
      if (shortIdx !== -1) return parts[shortIdx + 1] ?? null
      const embedIdx = parts.indexOf('embed')
      if (embedIdx !== -1) return parts[embedIdx + 1] ?? null
    }
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0] || null
    }
  } catch {
    // not a valid URL
  }
  return null
}

// ─── Courses ─────────────────────────────────────────────────────────────────

export async function createCourse(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await assertAdmin()

  const title = (formData.get('title') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const description = (formData.get('description') as string).trim()
  const thumbnail_url = (formData.get('thumbnail_url') as string).trim() || null
  const sort_order = Number(formData.get('sort_order')) || 1
  const is_published = formData.get('is_published') === 'on'

  if (!title) return { error: 'タイトルは必須です' }
  if (!slug) return { error: 'スラッグは必須です' }
  if (!SLUG_RE.test(slug)) return { error: 'スラッグは半角英数字とハイフンのみ使用できます' }

  const { error } = await supabase.from('courses').insert({
    slug,
    title,
    description: description || null,
    thumbnail_url,
    sort_order,
    is_published,
  })

  if (error) {
    console.error('[admin]', error.message)
    return { error: '保存に失敗しました。スラッグが重複している可能性があります。' }
  }

  updateTag('courses')
  redirect('/admin/courses')
}

export async function updateCourse(
  courseId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await assertAdmin()

  const title = (formData.get('title') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const description = (formData.get('description') as string).trim()
  const thumbnail_url = (formData.get('thumbnail_url') as string).trim() || null
  const sort_order = Number(formData.get('sort_order')) || 1
  const is_published = formData.get('is_published') === 'on'

  if (!title) return { error: 'タイトルは必須です' }
  if (!slug) return { error: 'スラッグは必須です' }
  if (!SLUG_RE.test(slug)) return { error: 'スラッグは半角英数字とハイフンのみ使用できます' }

  const { error } = await supabase
    .from('courses')
    .update({ slug, title, description: description || null, thumbnail_url, sort_order, is_published })
    .eq('id', courseId)

  if (error) {
    console.error('[admin]', error.message)
    return { error: '保存に失敗しました。スラッグが重複している可能性があります。' }
  }

  updateTag('courses')
  return { success: true }
}

export async function deleteCourse(courseId: string): Promise<void> {
  const supabase = await assertAdmin()
  await supabase.from('courses').delete().eq('id', courseId)
  updateTag('courses')
  redirect('/admin/courses')
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export async function createLesson(
  courseId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await assertAdmin()

  const title = (formData.get('title') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const description = (formData.get('description') as string).trim()
  const youtube_url = (formData.get('youtube_url') as string).trim()
  const duration_raw = (formData.get('duration_seconds') as string).trim()
  const duration_seconds = duration_raw ? Number(duration_raw) : null
  const sort_order = Number(formData.get('sort_order')) || 1
  const is_published = formData.get('is_published') === 'on'

  if (!title) return { error: 'タイトルは必須です' }
  if (!slug) return { error: 'スラッグは必須です' }
  if (!SLUG_RE.test(slug)) return { error: 'スラッグは半角英数字とハイフンのみ使用できます' }
  if (!youtube_url) return { error: 'YouTube URL は必須です' }
  const youtube_video_id = parseYouTubeUrl(youtube_url)
  if (!youtube_video_id) return { error: '有効な YouTube URL を入力してください' }

  const { error } = await supabase.from('lessons').insert({
    course_id: courseId,
    slug,
    title,
    description: description || null,
    youtube_video_id,
    duration_seconds,
    sort_order,
    is_published,
  })

  if (error) {
    console.error('[admin]', error.message)
    return { error: '保存に失敗しました。スラッグが重複している可能性があります。' }
  }

  updateTag('courses')
  redirect(`/admin/courses/${courseId}`)
}

export async function updateLesson(
  lessonId: string,
  courseId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await assertAdmin()

  const title = (formData.get('title') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const description = (formData.get('description') as string).trim()
  const youtube_url = (formData.get('youtube_url') as string).trim()
  const duration_raw = (formData.get('duration_seconds') as string).trim()
  const duration_seconds = duration_raw ? Number(duration_raw) : null
  const sort_order = Number(formData.get('sort_order')) || 1
  const is_published = formData.get('is_published') === 'on'

  if (!title) return { error: 'タイトルは必須です' }
  if (!slug) return { error: 'スラッグは必須です' }
  if (!SLUG_RE.test(slug)) return { error: 'スラッグは半角英数字とハイフンのみ使用できます' }
  if (!youtube_url) return { error: 'YouTube URL は必須です' }
  const youtube_video_id = parseYouTubeUrl(youtube_url)
  if (!youtube_video_id) return { error: '有効な YouTube URL を入力してください' }

  const { error } = await supabase
    .from('lessons')
    .update({ slug, title, description: description || null, youtube_video_id, duration_seconds, sort_order, is_published })
    .eq('id', lessonId)

  if (error) {
    console.error('[admin]', error.message)
    return { error: '保存に失敗しました。スラッグが重複している可能性があります。' }
  }

  updateTag('courses')
  return { success: true }
}

export async function deleteLesson(lessonId: string, courseId: string): Promise<void> {
  const supabase = await assertAdmin()
  await supabase.from('lessons').delete().eq('id', lessonId)
  updateTag('courses')
  redirect(`/admin/courses/${courseId}`)
}
