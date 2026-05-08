import NewLessonForm from './new-lesson-form'

export default async function NewLessonPage(
  props: PageProps<'/admin/courses/[courseId]/lessons/new'>
) {
  const { courseId } = await props.params
  return <NewLessonForm courseId={courseId} />
}
