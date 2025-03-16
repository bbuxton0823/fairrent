'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'New Analysis', href: '/analysis/new' },
  { name: 'Reports', href: '/reports' },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                FairRent
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative ml-3">
              <div className="flex items-center">
                {user?.picture ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.picture}
                    alt={user.name || ''}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                )}
                <Link
                  href="/api/auth/logout"
                  className="ml-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 