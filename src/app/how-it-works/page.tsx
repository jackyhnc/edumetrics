'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HowItWorksPage() {
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
          <Link href="/about" onClick={handleClick} className="px-6 py-2 text-white/80 hover:text-purple-300 transition-colors font-medium">
            ABOUT
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
            How EduMetrics Works
          </h1>
          
          <div className="space-y-16">
            {/* For Students Section */}
            <section>
              <h2 className="text-3xl font-semibold mb-8 text-purple-300">For Students</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30 flex flex-col">
                  <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Select Your Courses</h3>
                  <p className="text-white/80 font-light flex-grow">
                    Browse and select the courses you're currently enrolled in. EduMetrics automatically organizes your course materials and learning resources.
                  </p>
                </div>
                
                <div className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30 flex flex-col">
                  <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Ask Questions</h3>
                  <p className="text-white/80 font-light flex-grow">
                    Use our AI-powered learning assistant to ask questions about course topics. Get immediate, personalized explanations tailored to your course content.
                  </p>
                </div>
                
                <div className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30 flex flex-col">
                  <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
                  <p className="text-white/80 font-light flex-grow">
                    Monitor your learning journey with detailed analytics. See which topics you've mastered and which ones need more attention.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30">
                <h3 className="text-2xl font-semibold mb-6 text-white">Student Benefits</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80 font-light">24/7 access to personalized learning support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80 font-light">Deeper understanding of complex course concepts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80 font-light">Improved study efficiency and time management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80 font-light">Personalized learning path based on your needs</span>
                  </li>
                </ul>
              </div>
            </section>
            
            {/* For Universities Section */}
            <section>
              <h2 className="text-3xl font-semibold mb-8 text-purple-300">For Universities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30 flex flex-col">
                  <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Integrate Platform</h3>
                  <p className="text-white/80 font-light flex-grow">
                    Easily integrate EduMetrics with your existing learning management systems. Import course catalogs and student enrollment data securely.
                  </p>
                </div>
                
                <div className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30 flex flex-col">
                  <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Monitor Analytics</h3>
                  <p className="text-white/80 font-light flex-grow">
                    Access comprehensive dashboards showing student engagement, common questions, and challenging topics across courses and departments.
                  </p>
                </div>
                
                <div className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30 flex flex-col">
                  <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Optimize Resources</h3>
                  <p className="text-white/80 font-light flex-grow">
                    Use data-driven insights to allocate teaching resources, improve curriculum design, and provide targeted support where students need it most.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30">
                <h3 className="text-2xl font-semibold mb-6 text-white">University Benefits</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80 font-light">Real-time insights into student learning challenges</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80 font-light">Data-driven curriculum improvement opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80 font-light">Optimized resource allocation for teaching assistants</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80 font-light">Improved student satisfaction and academic outcomes</span>
                  </li>
                </ul>
              </div>
            </section>
            
            {/* Technology Section */}
            <section>
              <h2 className="text-3xl font-semibold mb-8 text-purple-300">Our Technology</h2>
              
              <div className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-white">AI Learning Assistant</h3>
                    <p className="text-white/80 font-light mb-4">
                      Our advanced AI model is specifically trained on academic content and teaching methodologies. It provides:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80 font-light">Course-specific explanations and examples</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80 font-light">Step-by-step problem-solving guidance</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80 font-light">Adaptive learning based on student interactions</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-white">Analytics Engine</h3>
                    <p className="text-white/80 font-light mb-4">
                      Our powerful analytics platform processes learning interactions to generate actionable insights:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80 font-light">Topic difficulty analysis across courses</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80 font-light">Student engagement patterns and trends</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-6 h-6 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80 font-light">Predictive models for academic performance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Get Started Section */}
            <section className="bg-white/10 p-8 rounded-lg shadow-lg shadow-purple-500/30 text-center">
              <h2 className="text-3xl font-semibold mb-6 text-purple-300">Ready to Transform Education?</h2>
              <p className="text-xl text-white/80 font-light leading-relaxed mb-8 max-w-3xl mx-auto">
                Join thousands of students and dozens of universities already using EduMetrics to enhance learning outcomes and educational effectiveness.
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <Link href="/signup" onClick={handleClick} className="px-8 py-3 bg-white text-black hover:bg-purple-200 transition-colors rounded-md shadow-lg shadow-purple-500/40 font-medium text-lg">
                  Sign Up Now
                </Link>
                <Link href="/about" onClick={handleClick} className="px-8 py-3 bg-white/10 text-white hover:bg-white/20 transition-colors rounded-md shadow-lg shadow-purple-500/30 font-medium text-lg">
                  Learn About Us
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