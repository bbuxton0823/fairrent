import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname

  // Skip middleware for public routes and static files
  if (
    path === '/' ||
    path.startsWith('/_next') ||
    path.startsWith('/api/auth') ||
    path.includes('.')
  ) {
    return res
  }

  // Only check auth for dashboard routes
  if (
    path.startsWith('/dashboard') ||
    path.startsWith('/analysis') ||
    path.startsWith('/reports')
  ) {
    try {
      const session = await getSession(req, res)
      if (!session) {
        return NextResponse.redirect(new URL('/api/auth/login', req.url))
      }
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.redirect(new URL('/api/auth/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ]
} 