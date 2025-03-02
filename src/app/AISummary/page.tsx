'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { EduMetricsAPI } from '@/config/firebase';
import { TUseSession, useSession } from '@/context';
import { MemoizedMarkdownBlock } from '@/components/memoized-markdown';

interface Prompt {
  prompt: string;
  rating: number;
}

export default function AISummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { userData } = useSession() as TUseSession;

  const [courseName, setCourseName] = useState<string>('');
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [summary, setSummary] = useState<string>('Loading analysis...');

  useEffect(() => {
    // Get data from URL parameters
    const name = searchParams.get('courseName');
    const title = searchParams.get('courseTitle');
    const topic = searchParams.get('topic');
    const promptsData = searchParams.get('prompts');

    if (name) setCourseName(decodeURIComponent(name));
    if (title) setCourseTitle(decodeURIComponent(title));
    if (topic) setSelectedTopic(decodeURIComponent(topic));

    if (promptsData) {
      try {
        const parsedPrompts = JSON.parse(decodeURIComponent(promptsData)) as Prompt[];
        setPrompts(parsedPrompts);
      } catch (error) {
        console.error('Error parsing prompts data:', error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (userData && courseName && selectedTopic) {
        try {
          const text = await EduMetricsAPI.getSubjectSummary(userData.university, courseName, selectedTopic);
          setSummary(text);
        } catch (error) {
          console.error('Error fetching summary:', error);
          setSummary('Failed to load analysis.');
        }
      }
    };

    fetchSummary();
  }, [userData, courseName, selectedTopic]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-white via-purple-500 to-purple-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-black via-purple-600 to-purple-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>

      <div className="max-w-6xl mx-auto p-8 relative z-10">
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">
            EduMetrics
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Data, Analytics, and AI Review</h2>
          <p className="mt-2 text-white/70 mb-6">Analyzing course data and learning prompts</p>
        </div>

        <div className="mb-8 animate-fadeIn">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </button>
        </div>

        {courseName ? (
          <div className="space-y-8">
            <div className="bg-white/10 rounded-lg p-6 shadow-lg shadow-purple-500/20 animate-fadeIn">
              <h3 className="text-2xl font-bold mb-2">{courseName}</h3>
              {courseTitle && <p className="text-white/70 mb-4">{courseTitle}</p>}

              {selectedTopic && (
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-purple-300 mb-2">Selected Topic</h4>
                  <div className="bg-white/15 p-4 rounded-md">{selectedTopic}</div>
                </div>
              )}
            </div>

            {prompts.length > 0 && (
              <div
                className="bg-white/10 rounded-lg p-6 shadow-lg shadow-purple-500/20 animate-fadeIn"
                style={{ animationDelay: "0.1s" }}
              >
                <h4 className="text-xl font-bold text-purple-300 mb-6">Learning Prompts</h4>
                <div className="space-y-6">
                  {prompts.map((prompt, index) => (
                    <div key={index} className="bg-white/15 rounded-lg p-6 transition-all hover-scale shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center bg-white/20 px-2 py-1 rounded">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>Effectiveness: {prompt.rating}</span>
                        </div>
                      </div>
                      <p className="text-white/90">{prompt.prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className="bg-white/10 rounded-lg p-6 shadow-lg shadow-purple-500/20 animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <h4 className="text-xl font-bold text-purple-300 mb-6">AI Analysis</h4>
              <div className="space-y-6">
                <div className="bg-white/15 rounded-lg p-6">
                  <h5 className="text-lg font-medium mb-4">Learning Effectiveness</h5>
                  <p className="text-white/90 mb-4">
                    Based on the prompts and topics selected, this course material appears to be structured to build
                    from fundamentals to practical applications.
                  </p>
                  <div className="w-full bg-white/10 rounded-full h-2.5 mb-4">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <p className="text-white/70 text-sm">85% effectiveness score</p>
                </div>

                <div className="bg-white/15 rounded-lg p-6">
                  <h5 className="text-lg font-medium mb-4">Topic Coverage</h5>
                  {/* <p className="text-white/90 mb-4"> */}
                    <MemoizedMarkdownBlock content={summary} />
                  {/* </p> */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="text-center">
                        <div className="inline-block w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                          <span className="text-xl font-bold">75%</span>
                        </div>
                        <p className="text-sm text-white/70">Fundamentals</p>
                      </div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="text-center">
                        <div className="inline-block w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                          <span className="text-xl font-bold">60%</span>
                        </div>
                        <p className="text-sm text-white/70">Advanced</p>
                      </div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="text-center">
                        <div className="inline-block w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                          <span className="text-xl font-bold">80%</span>
                        </div>
                        <p className="text-sm text-white/70">Practical</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-white/70 animate-fadeIn">
            No course data available. Please select a course from the Course Catalog.
          </div>
        )}
      </div>
    </div>
  );
}
