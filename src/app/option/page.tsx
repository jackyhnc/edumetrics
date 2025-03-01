'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-6 p-8 text-center">
        <h1 className="text-3xl font-bold text-white">EduMetrics</h1>
        <p className="text-white/70">Choose an option below</p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/courses')}
            className="w-full px-6 py-3 bg-white text-black hover:bg-gray-100 transition-colors rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Select/Add Courses
          </button>

          <button
            onClick={() => router.push('/institutions')}
            className="w-full px-6 py-3 bg-white text-black hover:bg-gray-100 transition-colors rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            View Institution Data
          </button>
        </div>
      </div>
    </div>
  );
}
