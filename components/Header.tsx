'use client';

import SignOutButton from './SignOutButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Navigation */}
          <nav className="flex space-x-8">
            <Link 
              href="/dashboard"
              className={`text-sm font-medium ${
                pathname === '/dashboard' 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/new-analysis"
              className={`text-sm font-medium ${
                pathname === '/dashboard/new-analysis' 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              New Analysis
            </Link>
            <Link 
              href="/dashboard/reports"
              className={`text-sm font-medium ${
                pathname === '/dashboard/reports' 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Reports
            </Link>
          </nav>

          {/* Right side - User menu & Sign out */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              <span className="sr-only">Signed in as</span>
              <span>Bycha</span>
            </div>
            <SignOutButton variant="link" />
          </div>
        </div>
      </div>
    </header>
  );
} 