'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface College {
  id: string;
  name: string;
  location: string;
}

export default function UniversitySelection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  const searchColleges = async (query: string) => {
    if (query.length < 2) {
      setColleges([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/karllhughes/colleges/master/seeds/colleges.json`
      );
      const data = await response.json();
      const filtered = data.filter((college: College) =>
        college.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      setColleges(filtered);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchColleges(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCollege) {
      // TODO: Save selected college to user profile
      console.log('Selected college:', selectedCollege);
      // Redirect to dashboard or next step
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
            EduMetrics
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">Select your university</h2>
          <p className="mt-2 text-white/70">
            Help us personalize your experience
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-white/80">
                SEARCH FOR YOUR UNIVERSITY
              </label>
              <input
                id="university"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search..."
                className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
            </div>

            {loading && (
              <div className="text-white/70 text-center">
                Searching...
              </div>
            )}

            {colleges.length > 0 && (
              <div className="mt-2 space-y-2">
                {colleges.map((college) => (
                  <button
                    key={college.id}
                    type="button"
                    onClick={() => setSelectedCollege(college)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      selectedCollege?.id === college.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    <div className="font-medium">{college.name}</div>
                    <div className="text-sm text-white/50">{college.location}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedCollege}
            className={`w-full flex justify-center px-4 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30 ${
              selectedCollege
                ? 'bg-white text-black hover:bg-gray-100 transition-colors'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
} 