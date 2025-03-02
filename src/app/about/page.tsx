'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        <Link href="/" onClick={handleClick} className="text-5xl font-bold bg-gradient-to-r from-white via-purple-400 to-purple-700 text-transparent bg-clip-text drop-shadow-lg">
          EduMetrics
        </Link>
        <div className="flex gap-6">
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

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-20">
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl lg:text-6xl font-bold mb-12 leading-tight text-white/90 tracking-tight">
            About EduMetrics
          </h1>
          
          <div className="space-y-12">
            <section className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30">
              <h2 className="text-3xl font-semibold mb-6 text-purple-300">Our Mission</h2>
              <p className="text-xl text-white/80 font-light leading-relaxed mb-6">
                EduMetrics was founded with a clear mission: to transform the educational experience through the power of AI and data analytics. 
                We believe that every student deserves personalized support, and every educational institution deserves actionable insights.
              </p>
              <p className="text-xl text-white/80 font-light leading-relaxed">
                By bridging the gap between AI-driven learning and institutional support, we're creating a more effective, responsive, and 
                equitable educational ecosystem for students and educators alike.
              </p>
            </section>
            
            <section className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30">
              <h2 className="text-3xl font-semibold mb-6 text-purple-300">Our Story</h2>
              <p className="text-xl text-white/80 font-light leading-relaxed mb-6">
                EduMetrics began as a hackathon project as an intersection of artificial intelligence and education. 
                Our founders, a team of four Computer Science students at Drexel University, recognized a critical gap in higher education: 
                while students were increasingly turning to AI tools for learning assistance, institutions lacked visibility into these interactions 
                and the valuable data they could provide.
              </p>
              <p className="text-xl text-white/80 font-light leading-relaxed">
                EduMetrics is a comprehensive platform that not only provides students with tailored AI tutoring, 
                but also gives universities insights into student engagement, learning patterns, and curriculum effectiveness.
              </p>
            </section>
            
            <section className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30">
              <h2 className="text-3xl font-semibold mb-6 text-purple-300">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Student-Centered Innovation</h3>
                  <p className="text-white/80 font-light">We design every feature with students' needs at the forefront, ensuring our platform enhances learning outcomes and educational experiences.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Data-Driven Excellence</h3>
                  <p className="text-white/80 font-light">We believe in the power of analytics to transform education, providing actionable insights that drive continuous improvement.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Ethical AI</h3>
                  <p className="text-white/80 font-light">We develop AI systems responsibly, with transparency, fairness, and privacy as core principles in our approach.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Educational Equity</h3>
                  <p className="text-white/80 font-light">We're committed to creating tools that help close achievement gaps and provide quality support to all students, regardless of background.</p>
                </div>
              </div>
            </section>
            
            <section className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30">
              <h2 className="text-3xl font-semibold mb-6 text-purple-300">Join Us</h2>
              <p className="text-xl text-white/80 font-light leading-relaxed mb-8">
                Whether you're a student looking for better learning support, an educator seeking data-driven insights, 
                or an institution aiming to enhance curriculum effectiveness, EduMetrics is here to transform your educational journey.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/signup" onClick={handleClick} className="px-8 py-3 bg-white text-black hover:bg-purple-200 transition-colors rounded-md shadow-lg shadow-purple-500/40 font-medium text-lg">
                  Get Started Today
                </Link>
                <Link href="/how-it-works" onClick={handleClick} className="px-8 py-3 bg-white/10 text-white hover:bg-white/20 transition-colors rounded-md shadow-lg shadow-purple-500/30 font-medium text-lg">
                  Learn How It Works
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-white via-purple-500 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-black via-purple-600 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
    </div>
  );
} 