'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Next.js App Router doesn't have events, so we'll use a different approach
    const handleRouteComplete = () => {
      setLoading(false);
    };
    
    // Cleanup loading state if component unmounts during navigation
    return () => {
      setLoading(false);
    };
  }, []);

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

      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full animate-fadeIn">
        <div className="text-5xl font-bold bg-gradient-to-r from-white via-purple-400 to-purple-700 text-transparent bg-clip-text drop-shadow-lg">
          EduMetrics
        </div>
        <div className="flex gap-6">
          <Link href="/about" onClick={handleClick} className="px-6 py-2 text-white/80 hover:text-purple-300 transition-colors font-medium">
            ABOUT
          </Link>
          <Link href="/how-it-works" onClick={handleClick} className="px-6 py-2 text-white/80 hover:text-purple-300 transition-colors font-medium">
            HOW IT WORKS
          </Link>
          <Link href="/signin" onClick={handleClick} className="px-6 py-2 text-white/80 hover:text-purple-300 transition-colors font-medium">
            SIGN IN
          </Link>
          <Link href="/signup" onClick={handleClick} className="px-6 py-2 bg-white text-black hover:bg-purple-200 transition-colors rounded-md shadow-lg shadow-purple-500/40 font-medium">
            GET STARTED
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-20">
        <div className="flex-1 flex flex-col justify-center lg:pr-20 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white/90 tracking-tight">
            Unlock Smarter Learning with EduMetrics
          </h1>
          <p className="text-xl text-purple-300 mb-12 leading-relaxed font-light">
            AI-powered tutoring combined with real-time academic insights. EduMetrics helps students master subjects with an intelligent AI study companion while 
            providing universities with valuable learning analytics. By tracking engagement and performance trends, 
            we bridge the gap between AI-driven learning and institutional support—enhancing both student success and 
            curriculum effectiveness.
          </p>
        </div>

        <div className="flex-1 mt-12 lg:mt-0">
          <div className="grid gap-6">
            <div className="bg-white/10 p-8 rounded-lg hover:bg-purple-600/20 transition-colors shadow-lg shadow-purple-500/30 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-semibold mb-3 text-purple-300">📚 AI-Powered Learning Assistance</h3>
              <p className="text-white/80 font-light">Enhance student comprehension with structured, course-specific AI tutoring, while gathering valuable data for curriculum improvement.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-lg hover:bg-purple-600/20 transition-colors shadow-lg shadow-purple-500/30 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-xl font-semibold mb-3 text-purple-300">🎯 Identify Struggling Courses & Topics</h3>
              <p className="text-white/80 font-light">Pinpoint exactly where students face challenges, allowing proactive faculty support, TA optimization, and resource allocation.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-lg hover:bg-purple-600/20 transition-colors shadow-lg shadow-purple-500/30 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl font-semibold mb-3 text-purple-300">📊 Data-Driven Student Insights</h3>
              <p className="text-white/80 font-light">Track real-time student engagement, study habits, and performance trends to make data-backed academic decisions.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Learn More Section */}
      <div className="w-full bg-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-white/90 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            Want to Learn More?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 p-8 rounded-lg hover:bg-white/15 transition-all shadow-lg shadow-purple-500/20 animate-fadeIn hover-scale" style={{ animationDelay: '0.7s' }}>
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">About EduMetrics</h3>
              <p className="text-white/80 font-light mb-6">
                Discover our mission, story, and the values that drive us to transform education through AI and analytics.
              </p>
              <Link href="/about" onClick={handleClick} className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors">
                Learn About Us
              </Link>
            </div>
            <div className="bg-white/10 p-8 rounded-lg hover:bg-white/15 transition-all shadow-lg shadow-purple-500/20 animate-fadeIn hover-scale" style={{ animationDelay: '0.8s' }}>
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">How It Works</h3>
              <p className="text-white/80 font-light mb-6">
                See how EduMetrics benefits students and universities, and explore the technology behind our platform.
              </p>
              <Link href="/how-it-works" onClick={handleClick} className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-white via-purple-500 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-black via-purple-600 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
    </div>
  );
}
