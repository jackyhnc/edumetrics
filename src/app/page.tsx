'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold">EduMetrics</div>
        <div className="flex gap-6">
          <Link 
            href="/signin"
            className="px-6 py-2 text-white/80 hover:text-white transition-colors"
          >
            SIGN IN
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-white text-black hover:bg-gray-100 transition-colors rounded-md"
          >
            GET STARTED
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-20">
        <div className="flex-1 flex flex-col justify-center lg:pr-20">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Spending too much time on tutoring,<br />
            not your studies?
          </h1>
          <p className="text-xl text-white/70 mb-12 leading-relaxed">
            Streamline your learning experience with our simple, intuitive platform.
            Get personalized tutoring and real-time analytics to boost your academic success.
          </p>
          <div className="flex gap-6 mt-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
            </div>
            <div className="flex items-center gap-2">
            </div>
          </div>
        </div>

        <div className="flex-1 mt-12 lg:mt-0">
          <div className="grid gap-6">
            <div className="bg-white/10 p-8 rounded-lg hover:bg-white/[0.15] transition-colors">
              <h3 className="text-xl font-semibold mb-3">Better Success</h3>
              <p className="text-white/70">Track your progress and improve your grades with data-driven insights and personalized support.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-lg hover:bg-white/[0.15] transition-colors">
              <h3 className="text-xl font-semibold mb-3">Personalized Learning</h3>
              <p className="text-white/70">Get matched with tutors that fit your learning style and schedule.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-lg hover:bg-white/[0.15] transition-colors">
              <h3 className="text-xl font-semibold mb-3">Real-Time Analytics</h3>
              <p className="text-white/70">Monitor your improvement with instant feedback and detailed performance metrics.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}