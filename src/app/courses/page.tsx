'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSelectedCourse(null);
  };

  const handleAddCourse = () => {
    if (search.trim() && !courses.includes(search.trim())) {
      setCourses([...courses, search.trim()]);
      setSearch('');
    }
  };

  const handleContinue = () => {
    if (selectedCourse) {
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
            EduMetrics
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">Search or Add a Course</h2>
          <p className="mt-2 text-white/70">Find or create a course that fits your needs</p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="course-search" className="block text-sm font-medium text-white/80">
              SEARCH FOR A COURSE
            </label>
            <input
              id="course-search"
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Type to search..."
              className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
            />
            {search.trim() && !courses.some(course => course.toLowerCase() === search.toLowerCase()) && (
              <button
                onClick={handleAddCourse}
                className="mt-2 w-full px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 font-medium"
              >
                Add Course
              </button>
            )}
          </div>

          {search.trim() !== '' && courses.some(course => course.toLowerCase().includes(search.toLowerCase())) && (
            <div className="mt-4 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="space-y-2 [&:has(>:nth-child(4))]:pr-4">
                {courses.filter(course => course.toLowerCase().includes(search.toLowerCase())).map((course, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors bg-white/10 text-white/70 hover:bg-white/15 ${selectedCourse === course ? 'bg-white/20' : ''}`}
                  >
                    {course}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedCourse && (
            <button 
              onClick={handleContinue} 
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
