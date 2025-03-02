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
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-2xl transition-opacity animate-fadeIn">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 border-4 border-transparent border-l-purple-500 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
      )}

      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-5xl font-bold bg-gradient-to-r from-white via-purple-400 to-purple-700 text-transparent bg-clip-text drop-shadow-lg">
          EduMetrics
        </div>
        <div className="flex gap-6">
          <Link href="/signin" onClick={handleClick} className="px-6 py-2 text-white/80 hover:text-purple-300 transition-colors">
            SIGN IN
          </Link>
          <Link href="/signup" onClick={handleClick} className="px-6 py-2 bg-white text-black hover:bg-purple-200 transition-colors rounded-md shadow-lg shadow-purple-500/40">
            GET STARTED
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-20">
        <div className="flex-1 flex flex-col justify-center lg:pr-20">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white/90">
            Finding balance between tutoring <br /> and your studies?
          </h1>
          <p className="text-xl text-purple-300 mb-12 leading-relaxed">
            Elevate your learning with a streamlined, intuitive platform. Access personalized tutoring and cutting-edge analytics.
          </p>
        </div>

        <div className="flex-1 mt-12 lg:mt-0">
          <div className="grid gap-6">
            <div className="bg-white/10 p-8 rounded-lg hover:bg-purple-600/20 transition-colors shadow-lg shadow-purple-500/30">
              <h3 className="text-xl font-semibold mb-3 text-purple-300">Balance Success</h3>
              <p className="text-white/80">Harness data-driven insights to maintain equilibrium between tutoring and study time.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-lg hover:bg-purple-600/20 transition-colors shadow-lg shadow-purple-500/30">
              <h3 className="text-xl font-semibold mb-3 text-purple-300">Personalized Guidance</h3>
              <p className="text-white/80">Find tutors who align with your unique learning rhythm and pace.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-lg hover:bg-purple-600/20 transition-colors shadow-lg shadow-purple-500/30">
              <h3 className="text-xl font-semibold mb-3 text-purple-300">Live Performance Tracking</h3>
              <p className="text-white/80">Stay ahead with real-time feedback and insightful progress analytics.</p>
            </div>
          </div>
        </div>
      </main>

      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-white via-purple-500 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-black via-purple-600 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      
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

        .animate-pulse {
          animation: pulse 6s infinite alternate;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
