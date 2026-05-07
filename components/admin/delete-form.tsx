'use client'

export default function DeleteForm({
  action,
  confirmMessage,
}: {
  action: () => Promise<void>
  confirmMessage: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault()
      }}
    >
      <button
        type="submit"
        className="rounded px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        削除
      </button>
    </form>
  )
}
