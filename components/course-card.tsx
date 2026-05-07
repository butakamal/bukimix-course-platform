import Link from 'next/link'
import Image from 'next/image'
import type { Course } from '@/lib/types'

type Props = {
  course: Course & { lesson_count: number }
}

const GRADIENTS = [
  'from-violet-600 to-indigo-600',
  'from-orange-500 to-pink-500',
  'from-emerald-500 to-teal-600',
  'from-blue-600 to-cyan-500',
  'from-rose-500 to-orange-500',
  'from-amber-500 to-yellow-500',
]

export default function CourseCard({ course }: Props) {
  const gradient = GRADIENTS[course.sort_order % GRADIENTS.length]

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${gradient} transition-transform duration-300 group-hover:scale-105`}
          />
        )}
        <span className="absolute left-2 top-2 rounded bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white shadow">
          無料
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h2 className="line-clamp-2 text-sm font-bold leading-snug">
          {course.title}
        </h2>
        <p className="text-xs text-muted-foreground">Bukimix 講師</p>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">4.7</span>
          <span className="text-xs text-amber-400" aria-hidden>★★★★★</span>
          <span className="text-xs text-muted-foreground">(1,234)</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-green-600 dark:text-green-400">無料</span>
          <span className="text-xs text-muted-foreground">{course.lesson_count} レッスン</span>
        </div>
      </div>
    </Link>
  )
}
