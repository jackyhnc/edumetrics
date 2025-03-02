'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EduMetricsAPI } from '@/config/firebase';

interface Course {
  name: string;
}

interface Topic {
  subtopic: string;
}

interface Prompt {
  prompt: string;
  rating: number;
}

export default function CoursesReviewPage() {
  const [universities, setUniversities] = useState<string[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseType, setCourseType] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  useEffect(() => {
    const loadUniversities = async () => {
      const unis = await EduMetricsAPI.getUniversities();
      setUniversities(unis);
    };
    loadUniversities();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      if (selectedUniversity) {
        const coursesData = await EduMetricsAPI.getCourses(selectedUniversity);
        setCourses(coursesData);
      } else {
        setCourses([]);
      }
      setSelectedCourse('');
      setTopics([]);
      setSelectedTopic('');
      setPrompts([]);
    };
    loadCourses();
  }, [selectedUniversity]);

  useEffect(() => {
    const loadTopics = async () => {
      if (selectedUniversity && selectedCourse) {
        const topicsData = await EduMetricsAPI.getSubjects(selectedUniversity, selectedCourse);
        setTopics(topicsData);
      } else {
        setTopics([]);
      }
      setSelectedTopic('');
      setPrompts([]);
    };
    loadTopics();
  }, [selectedUniversity, selectedCourse]);

  useEffect(() => {
    const loadPrompts = async () => {
      if (selectedUniversity && selectedCourse && selectedTopic) {
        const promptsData = await EduMetricsAPI.getPrompts(selectedUniversity, selectedCourse, selectedTopic);
        setPrompts(promptsData);
      } else {
        setPrompts([]);
      }
    };
    loadPrompts();
  }, [selectedUniversity, selectedCourse, selectedTopic]);

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourseType = courseType === 'all' || course.toLowerCase().startsWith(courseType);
      return matchesSearch && matchesCourseType;
    });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
            EduMetrics
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Course Reviews</h2>
          <p className="mt-2 text-white/70 mb-6">
            Browse and share course experiences
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="px-4 py-2 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/20 hover:border-white/40 transition-colors cursor-pointer appearance-none"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="" className="bg-gray-900">Select University</option>
              {universities.map(uni => (
                <option key={uni} value={uni} className="bg-gray-900">{uni}</option>
              ))}
            </select>

            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className="px-4 py-2 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/20 hover:border-white/40 transition-colors cursor-pointer appearance-none"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="all" className="bg-gray-900">All Departments</option>
              <option value="cs" className="bg-gray-900">Computer Science</option>
              <option value="math" className="bg-gray-900">Mathematics</option>
              <option value="engl" className="bg-gray-900">English</option>
            </select>

            <style jsx>{`
              select {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' opacity='0.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 0.5rem center;
                background-size: 1.5em 1.5em;
                padding-right: 2.5rem;
              }
              
              select:focus {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' opacity='0.8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
              }
              
              option {
                padding: 0.5rem;
                margin: 0.25rem;
              }
              
              option:hover {
                background-color: rgba(255, 255, 255, 0.1);
              }
            `}</style>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <button
              key={course}
              onClick={() => setSelectedCourse(course)}
              className={`p-6 rounded-lg text-left transition-colors ${
                selectedCourse === course
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{course}</h3>
            </button>
          ))}
        </div>

        {selectedCourse && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Topics for {selectedCourse}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    selectedTopic === topic
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <h4 className="text-lg font-semibold mb-2">{topic}</h4>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTopic && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Learning Prompts for {selectedTopic}</h3>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors">
                Add Prompt
              </button>
            </div>
            <div className="space-y-6">
              {prompts.map((prompt, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-white/20 px-2 py-1 rounded">
                          <svg
                            className="w-4 h-4 text-yellow-400 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>Effectiveness: {prompt.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/90">{prompt.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}