'use client';

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center space-x-8">
        <a href="/dashboard" className="text-white hover:text-gray-300">
          Dashboard
        </a>
        <a href="/dashboard/reports" className="text-white hover:text-gray-300">
          Reports
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-white">Bycha</span>
        <button className="text-white hover:text-gray-300">
          Sign out
        </button>
      </div>
    </nav>
  );
} 