'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedInput = e.target.value.toUpperCase().replace(/\s/g, '');
    setSearch(formattedInput);
  };

  const handleAddCourse = () => {
    if (search.trim() && !courses.includes(search.trim())) {
      const newCourses = [...courses, search.trim()];
      setCourses(newCourses);
      setSelectedCourses([...selectedCourses, search.trim()]);
      setSearch('');
    }
  };

  const toggleCourseSelection = (course: string) => {
    setSelectedCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  const handleContinue = () => {
    if (selectedCourses.length > 0) {
      setLoading(true);
      // Simulate loading for better UX
      setTimeout(() => {
        router.push('/home');
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-2xl z-50 transition-opacity animate-fadeIn">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 border-4 border-transparent border-l-purple-500 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
      )}
      
      {/* Background elements */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-white via-purple-500 to-purple-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-black via-purple-600 to-purple-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      
      <div className="max-w-6xl w-full flex flex-col md:flex-row md:space-x-8 p-8 z-10 animate-fadeIn">
        <div className="w-full md:w-1/2 space-y-8 p-8 bg-white/10 rounded-md shadow-lg shadow-purple-500/20 hover-scale transition-all mb-8 md:mb-0">
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-white hover:text-purple-300 transition-colors">
              EduMetrics
            </Link>
            <h2 className="mt-6 text-4xl font-bold text-white">Search or Add a Course</h2>
            <p className="mt-2 text-white/70">Find or create a course that fits your needs</p>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="course-search" className="block text-lg font-medium text-purple-300">
                SEARCH FOR A COURSE
              </label>
              <input
                id="course-search"
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Type to search..."
                className="mt-1 block w-full px-6 py-4 bg-white/10 border border-white/10 rounded-md text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
              {search.trim() && !courses.some(course => course.toLowerCase() === search.toLowerCase()) && (
                <button
                  onClick={handleAddCourse}
                  className="mt-4 w-full px-6 py-3 bg-white/10 text-white rounded-md hover:bg-white/20 hover:shadow-purple-500/30 transition-all font-medium text-lg hover-scale"
                >
                  Add Course
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-white/10 rounded-md shadow-lg shadow-purple-500/20 hover-scale transition-all">
          <h3 className="text-3xl font-bold text-purple-300 mb-6">Selected Courses</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            {selectedCourses.length > 0 ? (
              selectedCourses.map((course, index) => (
                <div 
                  key={index} 
                  className="px-6 py-3 bg-white/20 text-white rounded-md text-lg hover:bg-white/30 transition-all hover-scale shadow-md hover:shadow-purple-500/20 animate-fadeIn"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {course}
                </div>
              ))
            ) : (
              <p className="text-white/70 text-lg">No courses selected</p>
            )}
          </div>
          {selectedCourses.length > 0 && (
            <button 
              onClick={handleContinue} 
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-lg shadow-lg shadow-purple-500/30 hover-scale">
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
