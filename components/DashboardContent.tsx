'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';
import PropertySummaryHeader from './PropertySummaryHeader';

export default function DashboardContent() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">Error loading user data</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <PropertySummaryHeader />
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-black shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here&apos;s an overview of your rental property analysis
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-black shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Analyses</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-black shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Generated Reports</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-black shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Subscription Status</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">Free</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-black shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No recent activity to display
          </div>
        </div>
      </div>
    </div>
  );
} 