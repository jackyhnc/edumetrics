'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface College {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
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
        `https://raw.githubusercontent.com/karllhughes/colleges/refs/heads/master/seeds/files/colleges_2016_03.csv`
      );
      const text = await response.text();
      
      // Parse 
      const rows = text.split('\n').filter(row => row.trim() !== '');
      
      // 140890,University of Pennsylvania,3451 Walnut Street,Philadelphia,PA,19104-6303,US,"Philadelphia, PA",215-898-5000,337800,215062,www.upenn.edu
      // 0=ID, 1=Name, 2=Address, 3=City, 4=State, 5=Zip Code
      
      const parsed = rows.slice(1).map(row => {
        const parts: string[] = [];
        let currentPart = '';
        let inQuotes = false;
        
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            parts.push(currentPart);
            currentPart = '';
          } else {
            currentPart += char;
          }
        }
        
        parts.push(currentPart);
        
        const cleanParts = parts.map(part => part.trim().replace(/^"|"$/g, ''));
        
        return {
          id: cleanParts[0] || '',
          name: cleanParts[1] || '',
          address: cleanParts[2] || '',
          city: cleanParts[3] || '',
          state: cleanParts[4] || '',
          zip: cleanParts[5] || ''
        };
      });
      
      const queryLower = query.toLowerCase();
      const filtered = parsed
        .filter(college => college.name && college.name.toLowerCase().includes(queryLower))
        .sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          
          if (aName === queryLower) return -1;
          if (bName === queryLower) return 1;
          
          const aStartsWith = aName.startsWith(queryLower);
          const bStartsWith = bName.startsWith(queryLower);
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          
          return a.name.length - b.name.length;
        })
        .slice(0, 50);
      
      setColleges(filtered);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setColleges([]);
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
      // save users selected college
      console.log('Selected college:', selectedCollege);
      // direct to course load 
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

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
              <div className="text-white/70 text-center py-2">
                <div className="inline-block animate-spin h-5 w-5 border-2 border-white/20 border-t-white/80 rounded-full mr-2"></div>
                Searching...
              </div>
            )}

            {colleges.length > 0 && !loading && (
              <div className="mt-2 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="space-y-2 [&:has(>:nth-child(4))]:pr-4">
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
                      <div className="text-sm text-white/50">
                        {college.address && (
                          <span>{college.address}</span>
                        )}
                        
                        {college.address && (college.city || college.state || college.zip) && (
                          <span>, </span>
                        )}
                        
                        {(college.city || college.state || college.zip) && (
                          <span>
                            {college.city}
                            {college.city && college.state && ', '}
                            {college.state}
                            {(college.city || college.state) && college.zip && ' '}
                            {college.zip}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {searchQuery.length >= 2 && colleges.length === 0 && !loading && (
              <div className="text-white/50 text-center py-3">
                No universities found matching "{searchQuery}"
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