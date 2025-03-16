'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { label: 'New Analysis', href: '/dashboard/new-analysis', icon: '📝' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📊' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-black p-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              block mb-4 p-3 rounded-lg text-white
              transition-all duration-200 ease-in-out
              ${pathname === item.href 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'hover:bg-gray-800 hover:translate-x-1 hover:shadow-lg'
              }
            `}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
} 