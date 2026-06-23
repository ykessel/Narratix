'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setWidth(total > 0 ? Math.round((scrollTop / total) * 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      id="reading-progress"
      style={{ width: `${width}%` }}
      aria-hidden="true"
    />
  )
}
