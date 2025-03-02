"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EduMetricsAPI } from "@/config/firebase";
import { TUseSession, useSession } from "@/context";
import { MemoizedMarkdownBlock } from "@/components/memoized-markdown";
import { useChat } from "@ai-sdk/react";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface Prompt {
  prompt: string;
  rating: number;
}

export default function AISummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { userData } = useSession() as TUseSession;

  const [courseName, setCourseName] = useState<string>("");
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [summary, setSummary] = useState<string>("Loading analysis...");
  const [teachingStrategies, setTeachingStrategies] = useState<string>("Loading teaching strategies...");

  const { messages, status, setMessages } = useChat({
    id: "chat",
    // Throttle the messages and data updates to 50ms:
    experimental_throttle: 50,
  });

  useEffect(() => {
    // Get data from URL parameters
    const name = searchParams.get("courseName");
    const title = searchParams.get("courseTitle");
    const topic = searchParams.get("topic");
    const promptsData = searchParams.get("prompts");

    if (name) setCourseName(decodeURIComponent(name));
    if (title) setCourseTitle(decodeURIComponent(title));
    if (topic) setSelectedTopic(decodeURIComponent(topic));

    if (promptsData) {
      try {
        const parsedPrompts = JSON.parse(decodeURIComponent(promptsData)) as Prompt[];
        setPrompts(parsedPrompts);
      } catch (error) {
        console.error("Error parsing prompts data:", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      if (userData && courseName && selectedTopic) {
        try {
          // Fetch summary
          let text = await EduMetricsAPI.getSubjectSummary(userData.university, courseName, selectedTopic);
          text = `#### Institution: ${
            userData.university
          }\n#### Course: ${courseName}\n#### Date: ${new Date().toLocaleDateString("en-US")}\n---\n${text}`;
          setSummary(text);

          // Fetch teaching strategies
          const { text: strategies } = await generateText({
            model: openai("gpt-4"),
            system: `You are an expert in education and pedagogy. Analyze the given topic and provide specific, actionable teaching strategies that would be most effective for this subject matter. Focus on:
            1. Best teaching methods for this specific topic
            2. Common student misconceptions and how to address them
            3. Practical examples and real-world applications
            4. Assessment strategies
            Keep the response concise and practical.`,
            prompt: `Please provide teaching strategies for ${selectedTopic} in ${courseName}.`,
          });
          setTeachingStrategies(strategies);
        } catch (error) {
          console.error("Error fetching data:", error);
          setSummary("Failed to load analysis.");
          setTeachingStrategies("Failed to load teaching strategies.");
        }
      }
    };

    fetchData();
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

            <div
              className="bg-white/10 rounded-lg p-6 shadow-lg shadow-purple-500/20 animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <h4 className="text-xl font-bold text-purple-300 mb-6">AI Analysis</h4>
              <div className="space-y-6">
                <div className="bg-white/15 rounded-lg p-6">
                  <h5 className="text-lg font-medium mb-4">Teaching Strategies</h5>
                  <div className="leading-relaxed space-y-4">
                    <MemoizedMarkdownBlock content={teachingStrategies} />
                  </div>
                </div>

                <div className="bg-white/15 rounded-lg p-6 space-y-2">
                  <h5 className="text-lg font-medium mb-4">Topic Coverage</h5>
                  <div className="leading-relaxed space-y-4">
                    <MemoizedMarkdownBlock content={summary} />
                  </div>
                </div>
              </div>
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
                      <p className="text-white/90">{prompt.prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
