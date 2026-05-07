'use client'

import { signOut } from '@/lib/actions/auth'

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-gray-300 transition-colors hover:text-white"
      >
        ログアウト
      </button>
    </form>
  )
}
