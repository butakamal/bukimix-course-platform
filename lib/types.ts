export type Course = {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnail_url: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Lesson = {
  id: string
  course_id: string
  slug: string
  title: string
  description: string | null
  youtube_video_id: string
  duration_seconds: number | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

export type Progress = {
  user_id: string
  lesson_id: string
  completed_at: string
}
