'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => setLoading(false);
    router.events?.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const handleClick = () => {
    setLoading(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md transition-opacity animate-fadeIn">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-blue-500 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 border-4 border-transparent border-l-purple-500 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
      )}

      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold">EduMetrics</div>
        <div className="flex gap-6">
          <Link href="/signin" onClick={handleClick} className="px-6 py-2 text-white/80 hover:text-white transition-colors">
            SIGN IN
          </Link>
          <Link href="/signup" onClick={handleClick} className="px-6 py-2 bg-white text-black hover:bg-gray-100 transition-colors rounded-md">
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-spin {
          animation: spinSlow 1.2s linear infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 2s linear infinite;
        }

        .animate-spin-reverse {
          animation: spinReverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
