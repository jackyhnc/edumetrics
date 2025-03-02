'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
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
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-6xl w-full flex space-x-8 p-8">
        <div className="w-1/2 space-y-8 p-8 bg-white/10 rounded-md">
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-white hover:text-white/90 transition-colors">
              EduMetrics
            </Link>
            <h2 className="mt-6 text-4xl font-bold text-white">Search or Add a Course</h2>
            <p className="mt-2 text-white/70">Find or create a course that fits your needs</p>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="course-search" className="block text-lg font-medium text-white/80">
                SEARCH FOR A COURSE
              </label>
              <input
                id="course-search"
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Type to search..."
                className="mt-1 block w-full px-6 py-4 bg-white/10 border border-white/10 rounded-md text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
              {search.trim() && !courses.some(course => course.toLowerCase() === search.toLowerCase()) && (
                <button
                  onClick={handleAddCourse}
                  className="mt-4 w-full px-6 py-3 bg-white/10 text-white rounded-md hover:bg-white/20 font-medium text-lg"
                >
                  Add Course
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/2 p-8 bg-white/10 rounded-md">
          <h3 className="text-3xl font-bold text-white mb-6">Selected Courses</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            {selectedCourses.length > 0 ? (
              selectedCourses.map((course, index) => (
                <div key={index} className="px-6 py-3 bg-white/20 text-white rounded-md text-lg">
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
              className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-lg">
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
