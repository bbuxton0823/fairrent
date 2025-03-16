'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white';
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen fixed left-0 top-0 pt-16">
      <nav className="mt-8 px-4">
        <Link
          href="/dashboard"
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mb-2 ${isActive('/dashboard')}`}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/new-analysis"
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mb-2 ${isActive('/dashboard/new-analysis')}`}
        >
          New Analysis
        </Link>
        <Link
          href="/dashboard/reports"
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mb-2 ${isActive('/dashboard/reports')}`}
        >
          Reports
        </Link>
        <Link
          href="/dashboard/settings"
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/dashboard/settings')}`}
        >
          Settings
        </Link>
      </nav>
    </div>
  );
} 