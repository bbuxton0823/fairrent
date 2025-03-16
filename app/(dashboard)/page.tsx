'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export default function Dashboard() {
  const { user, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Welcome back</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {user?.name || 'User'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 