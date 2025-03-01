"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { DocumentCourse, EduMetricsAPI } from "@/config/firebase";
import { TUseSession, useSession } from "@/context";

interface Prompt {
  prompt: string;
  rating: number;
}

export default function CoursesReviewPage() {
  const { userData, user } = useSession() as TUseSession;

  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<DocumentCourse | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // Subject codes for filtering
  const subjectCodes = ["MATH", "PHYS", "CHEM", "BIO", "CS", "ENG"]; // Add your subject codes here

  // Lazy loading state
  const [visibleItems, setVisibleItems] = useState(12); // Start with 12 items (4 rows of 3)
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCourseElementRef = useRef<HTMLDivElement | null>(null);

  console.log(user?.email, userData?.university);

  // Reset visible items count when filters change
  useEffect(() => {
    setVisibleItems(12);
    setHasMore(true);
  }, [searchQuery, subjectFilter]);

  // Generate topics when a course is selected
  useEffect(() => {
    if (selectedCourse && userData) {
      // Fetch topics (subjects) from Firebase
      const loadTopics = async () => {
        try {
          setLoading(true);
          const subjects = await EduMetricsAPI.getSubjects(userData.university, selectedCourse.course);
          setTopics(subjects);
          console.log(subjects);
        } catch (error) {
          console.error("Error loading topics:", error);
          setTopics([]);
        } finally {
          setLoading(false);
        }
      };

      loadTopics();
    } else {
      setTopics([]);
    }
  }, [selectedCourse]);

  // Handle course selection
  const handleCourseClick = (docType: DocumentCourse) => {
    if (selectedCourse?.course === docType.course) {
      // If clicking the same course, toggle selection
      setSelectedCourse(null);
      setSelectedTopic("");
    } else {
      // If clicking a different course
      setSelectedCourse(docType);
      setSelectedTopic("");
    }
  };

  // Handle topic selection
  const handleTopicClick = (topic: string) => {
    setSelectedTopic(selectedTopic === topic ? "" : topic);
  };

  // Load prompts when a topic is selected
  useEffect(() => {
    const loadPrompts = async () => {
      if (selectedCourse && selectedTopic && userData) {
        try {
          setLoading(true);
          const fetchedPrompts = await EduMetricsAPI.getPrompts(
            userData.university,
            selectedCourse.course,
            selectedTopic
          );
          setPrompts(fetchedPrompts);
          console.log("Fetched prompts:", fetchedPrompts); // Debug log
        } catch (error) {
          console.error("Error loading prompts:", error);
          setPrompts([]);
        } finally {
          setLoading(false);
        }
      } else {
        setPrompts([]);
      }
    };

    loadPrompts();
  }, [selectedCourse, selectedTopic]);

  useEffect(() => {
    if (userData) {
      EduMetricsAPI.getCourses(userData.university).then(setCourses);
    }
  }, [userData]);

  const coursesToDisplay: DocumentCourse[] = courses.map((c) => ({
    university: userData!.university,
    course: c,
  }));

  const filteredCourses = coursesToDisplay.filter((docType) => {
    const matchesSearch =
      docType.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docType.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // const matchesSubject = subjectFilter === "all" || course.subjectCode.toLowerCase() === subjectFilter.toLowerCase();

    return matchesSearch /*  && matchesSubject */;
  });

  // Infinite scroll implementation
  const lastCourseRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleItems((prevVisibleItems) => {
            const newCount = prevVisibleItems + 9; // Load 3 more rows (9 items)

            // Check if we've reached the end of the list
            if (newCount >= filteredCourses.length) {
              setHasMore(false);
            }

            return newCount;
          });
        }
      });

      if (node) {
        lastCourseElementRef.current = node;
        observer.current.observe(node);
      }
    },
    [hasMore, filteredCourses.length]
  );

  // Get visible courses
  const visibleCourses = filteredCourses.slice(0, visibleItems);

  // Group courses into rows for rendering
  const courseRows = [];
  const columns = 3; // Number of columns in the grid

  for (let i = 0; i < visibleCourses.length; i += columns) {
    const rowCourses = visibleCourses.slice(i, i + columns);
    const rowHasSelectedCourse = rowCourses.some((course) => selectedCourse && course.course === selectedCourse.course);

    courseRows.push({
      courses: rowCourses,
      hasSelectedCourse: rowHasSelectedCourse,
      isLastRow: i + columns >= visibleCourses.length && i + rowCourses.length < filteredCourses.length,
    });
  }

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
          <h2 className="mt-6 text-3xl font-bold">Course Catalog</h2>
          <p className="mt-2 text-white/70 mb-6">Browse and share course information</p>
        </div>

        <div className="mb-8 space-y-4 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/50 transition-all"
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
        </div>

        {dataLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-0 border-4 border-transparent border-l-purple-500 rounded-full animate-spin-reverse"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {courseRows.map((row, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {/* Course row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {row.courses.map((course, courseIndex) => {
                    // Determine if this is the last visible course
                    const isLastCourse = row.isLastRow && courseIndex === row.courses.length - 1;
                    const isSelected = selectedCourse?.course === course.course;

                    return (
                      <div
                        key={`${course.university}-${course.course}`}
                        ref={isLastCourse ? lastCourseRef : null}
                        className={`rounded-lg overflow-hidden transition-all duration-300 hover-scale shadow-lg ${
                          isSelected
                            ? "bg-white/20 text-white shadow-purple-500/30"
                            : "bg-white/10 hover:bg-white/15 hover:shadow-purple-500/20"
                        } animate-fadeIn`}
                        style={{ animationDelay: `${0.05 * (rowIndex * columns + courseIndex)}s` }}
                      >
                        <button onClick={() => handleCourseClick(course)} className="p-6 w-full text-left">
                          <h3 className="text-xl font-semibold mb-2">{course.course}</h3>
                          {course.description && <p className="text-white/70 mb-2">{course.description}</p>}
                          <div className="flex justify-between text-sm text-white/50">
                            <span>{course.credits ?? "N/A"} credits</span>
                            <span>
                              {course.sections ?? 1} section{(course.sections ?? 1) !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Topics dropdown for this row if it contains the selected course */}
                {row.hasSelectedCourse && selectedCourse && (
                  <div className="mt-2 mb-4">
                    {/* Topics section */}
                    <div className="bg-white/10 rounded-lg p-6 w-full shadow-lg shadow-purple-500/20 transition-all">
                      <h4 className="text-lg font-medium text-purple-300 mb-4">Topics for {selectedCourse.course}</h4>

                      {loading ? (
                        <div className="flex justify-center items-center py-6">
                          <div className="relative w-10 h-10">
                            <div className="absolute inset-0 border-3 border-transparent border-t-white rounded-full animate-spin"></div>
                            <div className="absolute inset-0 border-3 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
                          </div>
                        </div>
                      ) : topics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {topics.map((topic) => (
                            <div
                              key={topic}
                              className={`p-4 rounded-md text-left transition-all duration-200 cursor-pointer hover-scale ${
                                selectedTopic === topic
                                  ? "bg-white/20 text-white shadow-lg shadow-purple-500/30"
                                  : "bg-white/10 hover:bg-white/15 text-white/80 hover:shadow-purple-500/20"
                              }`}
                              onClick={() => handleTopicClick(topic)}
                            >
                              {topic}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-white/70">No topics available for this course.</div>
                      )}

                      {topics.length > 0 && (
                        <div className="mt-6 flex justify-center">
                          <Link
                            href={`/AISummary?${
                              selectedCourse
                                ? `courseName=${encodeURIComponent(
                                    selectedCourse.course
                                  )}&courseDescription=${encodeURIComponent(selectedCourse.description || "")}${
                                    selectedTopic ? `&topic=${encodeURIComponent(selectedTopic)}` : ""
                                  }${
                                    prompts.length > 0 ? `&prompts=${encodeURIComponent(JSON.stringify(prompts))}` : ""
                                  }`
                                : ""
                            }`}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/30 hover-scale"
                          >
                            Data, Analytics, and AI Review
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Learning prompts section - shown when a topic is selected */}
                    {selectedTopic && (
                      <div className="mt-4">
                        <div className="bg-white/10 rounded-lg p-6 w-full shadow-lg shadow-purple-500/20 transition-all">
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-purple-300">Learning Prompts for {selectedTopic}</h3>
                          </div>

                          {loading ? (
                            <div className="flex justify-center items-center py-6">
                              <div className="relative w-10 h-10">
                                <div className="absolute inset-0 border-3 border-transparent border-t-white rounded-full animate-spin"></div>
                                <div className="absolute inset-0 border-3 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
                              </div>
                            </div>
                          ) : prompts.length > 0 ? (
                            <div className="space-y-6">
                              {prompts.map((prompt, index) => (
                                <div
                                  key={index}
                                  className="bg-white/15 rounded-lg p-6 hover:bg-white/20 transition-all hover-scale shadow-md hover:shadow-purple-500/20"
                                >
                                  <p className="text-white/90">{prompt.prompt}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-white/70">No prompts available for this topic.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Loading indicator for infinite scroll */}
            {hasMore && visibleCourses.length > 0 && filteredCourses.length > visibleCourses.length && (
              <div className="flex justify-center py-4">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border-3 border-transparent border-t-white rounded-full animate-spin"></div>
                  <div className="absolute inset-0 border-3 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
                </div>
              </div>
            )}

            {filteredCourses.length === 0 && (
              <div className="text-center py-12 text-white/70 animate-fadeIn">
                No courses found matching your search criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
