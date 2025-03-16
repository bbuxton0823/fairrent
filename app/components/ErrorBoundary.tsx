'use client'

import { useEffect } from 'react'

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error)
    })
  }, [])

  return <>{children}</>
} 