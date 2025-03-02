'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  topics: Topic[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
  reviews: Review[];
}

interface Review {
  id: string;
  studentName: string;
  content: string;
  rating: number;
  date: string;
  helpful: number;
}

// Sample data with AI learning prompts
const sampleCourses: Course[] = [
  {
    id: 'cs-171',
    code: 'CS 171',
    name: 'Computer Programming I',
    description: 'Introduction to Python programming and computer science fundamentals.',
    topics: [
      {
        id: 'python-basics',
        title: 'Python Basics',
        description: 'Introduction to Python syntax and programming concepts',
        reviews: [
          {
            id: '1',
            studentName: 'Jacky Hanc',
            content: 'Explain Python variables, data types, and basic operations like a teacher explaining to a complete beginner. Include simple examples for each concept.',
            rating: 5,
            date: '2024-03-15',
            helpful: 12
          },
          {
            id: '2',
            studentName: 'Edison Lin',
            content: 'Create a step-by-step tutorial on how to write my first Python program that calculates the average of three numbers. Explain each line of code.',
            rating: 4,
            date: '2024-03-14',
            helpful: 8
          }
        ]
      },
      {
        id: 'data-structures',
        title: 'Basic Data Structures',
        description: 'Lists, dictionaries, and basic data structures in Python',
        reviews: [
          {
            id: '3',
            studentName: 'Dylan Daniel',
            content: 'Show me how to use Python lists and dictionaries with practical examples. Include common operations like adding, removing, and searching for elements.',
            rating: 5,
            date: '2024-03-13',
            helpful: 15
          }
        ]
      }
    ]
  },
  {
    id: 'math-200',
    code: 'MATH 200',
    name: 'Multivariate Calculus',
    description: 'Advanced calculus concepts including multiple variables and vector calculus.',
    topics: [
      {
        id: 'vectors',
        title: 'Vector Calculus',
        description: 'Vector operations and calculus in multiple dimensions',
        reviews: [
          {
            id: '4',
            studentName: 'Dom',
            content: 'Explain vector fields and their applications in 3D space using real-world examples. Include visualizations and step-by-step calculations.',
            rating: 4,
            date: '2024-03-12',
            helpful: 20
          }
        ]
      },
      {
        id: 'multiple-integrals',
        title: 'Multiple Integrals',
        description: 'Double and triple integrals in various coordinate systems',
        reviews: [
          {
            id: '5',
            studentName: 'Jonathan Zheng',
            content: 'Walk me through solving a double integral problem in polar coordinates. Explain the process of setting up bounds and converting between coordinate systems.',
            rating: 4,
            date: '2024-03-11',
            helpful: 18
          }
        ]
      }
    ]
  },
  {
    id: 'engl-102',
    code: 'ENGL 102',
    name: 'English Composition',
    description: 'Advanced composition and rhetoric for academic writing.',
    topics: [
      {
        id: 'academic-writing',
        title: 'Academic Writing',
        description: 'Principles of academic writing and research',
        reviews: [
          {
            id: '6',
            studentName: 'Jacky Hanc',
            content: 'Help me structure a thesis statement for a research paper about climate change. Provide examples of strong vs. weak thesis statements.',
            rating: 4,
            date: '2024-03-10',
            helpful: 25
          }
        ]
      },
      {
        id: 'research-methods',
        title: 'Research Methods',
        description: 'Research techniques and citation methods',
        reviews: [
          {
            id: '7',
            studentName: 'Teju Olateju',
            content: 'Show me how to properly cite academic sources in APA format. Include examples for different types of sources like books, journals, and websites.',
            rating: 5,
            date: '2024-03-09',
            helpful: 22
          }
        ]
      }
    ]
  }
];

export default function CoursesReviewPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseType, setCourseType] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  const coursesWithStats = sampleCourses.map(course => {
    const totalReviews = course.topics.reduce((sum, topic) => sum + topic.reviews.length, 0);
    return { ...course, totalReviews };
  });

  const filteredCourses = coursesWithStats
    .filter(course => {
      const matchesSearch = 
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCourseType = courseType === 'all' || course.code.toLowerCase().startsWith(courseType);

      return matchesSearch && matchesCourseType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.totalReviews - a.totalReviews;
        default:
          return 0;
      }
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/20 hover:border-white/40 transition-colors cursor-pointer appearance-none group relative"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="none" className="bg-gray-900">Sort By</option>
              <option value="popular" className="bg-gray-900">Most Popular</option>
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
              key={course.id}
              onClick={() => {
                if (selectedCourse?.id !== course.id) {
                  setSelectedTopic(null);
                }
                setSelectedCourse(course);
              }}
              className={`p-6 rounded-lg text-left transition-colors ${
                selectedCourse?.id === course.id
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{course.code}</h3>
              <h4 className="text-lg mb-2">{course.name}</h4>
              <p className="text-white/70 text-sm">{course.description}</p>
            </button>
          ))}
        </div>

        {selectedCourse && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Topics for {selectedCourse.code}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCourse.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    selectedTopic?.id === topic.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <h4 className="text-lg font-semibold mb-2">{topic.title}</h4>
                  <p className="text-white/70 text-sm mb-2">{topic.description}</p>
                  <div className="text-sm text-white/50">
                    {topic.reviews.length} {topic.reviews.length === 1 ? 'prompt' : 'prompts'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTopic && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Learning Prompts for {selectedTopic.title}</h3>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors">
                Add Prompt
              </button>
            </div>
            <div className="space-y-6">
              {selectedTopic.reviews.map((review) => (
                <div key={review.id} className="bg-white/10 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.studentName}</span>
                        <div className="flex items-center bg-white/20 px-2 py-1 rounded">
                          <svg
                            className="w-4 h-4 text-yellow-400 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>Effectiveness: {review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-white/50 mt-1">{review.date}</p>
                    </div>
                    <button className="flex items-center text-sm text-white/70 hover:text-white transition-colors">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      Found Helpful: {review.helpful}
                    </button>
                  </div>
                  <p className="text-white/90">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}