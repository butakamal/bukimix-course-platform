'use client'

import { useState } from 'react'
import Link from 'next/link'

type Props = {
  isLoggedIn: boolean
}

export default function MobileNav({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="メニューを開く"
        className="flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-white/10 bg-[#1c1d1f] px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-4">
            <Link
              href="/courses"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              講座一覧
            </Link>
            {isLoggedIn && (
              <Link
                href="/my"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                マイページ
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
