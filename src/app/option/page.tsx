'use client';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-4 p-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
            EduMetrics
          </Link>
          <h2 className="mt-3 text-3xl font-bold text-white">Choose an Option</h2>
          <p className="mt-2 text-white/70">
            What would you like to do?
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/courses">
            <button
              className="w-full flex justify-center px-4 py-3 rounded-md font-medium bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
            >
              Select/Add Courses
            </button>
          </Link>
          </div>
          <div className="">{
            }
          <Link href="/coursesReview">
            <button
              className="w-full flex justify-center px-4 py-3 rounded-md font-medium bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
            >
              View Institutional Data
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
