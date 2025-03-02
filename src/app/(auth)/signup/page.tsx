"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TUseSession, useSession } from "@/context";
import { useRouter } from "next/navigation";
import { addNewUser } from "@/config/firebase";

interface College {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

type UserRole = "student" | "faculty";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("student");

  const { handleSignup } = useSession() as TUseSession;
  const router = useRouter();

  const searchColleges = async (query: string) => {
    if (query.length < 2) {
      setColleges([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/karllhughes/colleges/refs/heads/master/seeds/files/colleges_2016_03.csv`
      );
      const text = await response.text();

      const rows = text.split("\n").filter((row) => row.trim() !== "");

      const parsed = rows.slice(1).map((row) => {
        const parts: string[] = [];
        let currentPart = "";
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
          const char = row[i];

          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            parts.push(currentPart);
            currentPart = "";
          } else {
            currentPart += char;
          }
        }

        parts.push(currentPart);

        const cleanParts = parts.map((part) => part.trim().replace(/^"|"$/g, ""));

        return {
          id: cleanParts[0] || "",
          name: cleanParts[1] || "",
          address: cleanParts[2] || "",
          city: cleanParts[3] || "",
          state: cleanParts[4] || "",
          zip: cleanParts[5] || "",
        };
      });

      const queryLower = query.toLowerCase();
      const filtered = parsed
        .filter((college) => college.name && college.name.toLowerCase().includes(queryLower))
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
      console.error("Error fetching colleges:", error);
      setColleges([]);
    }
    setSearchLoading(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchColleges(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Log the current values when form is submitted
    console.log("=== Form Submission Values ===");
    console.log("Selected College:", {
      name: selectedCollege?.name,
      address: selectedCollege?.address,
      city: selectedCollege?.city,
      state: selectedCollege?.state,
    });
    console.log("User Role:", userRole);
    console.log("Email:", email);
    console.log("==========================");

    if (!selectedCollege) {
      setError("Please select your university");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setError(
        "Password must be at least 8 characters long and include at least one letter and one special character."
      );
      setLoading(false);
      return;
    }

    try {
      const user = await handleSignup(email, password, userRole, selectedCollege.name);
      console.log("USER:", user);
      if (user && userRole === "faculty") {
        router.push("/coursesReview");
      } else if (user && userRole === "student") {
        router.push("/chatbot");
      } else {
        setError("Error creating account. Could have been made already.");
      }
    } catch (err) {
      setError("An error occurred during signup.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-white via-purple-500 to-purple-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-black via-purple-600 to-purple-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-2xl z-50 transition-opacity animate-fadeIn">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 border-4 border-transparent border-l-purple-500 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto p-8 flex items-center justify-center min-h-screen relative z-10">
        <div className="w-full space-y-8 bg-white/10 rounded-lg shadow-lg shadow-purple-500/30 p-8 animate-fadeIn">
          <div className="text-center">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-purple-300 transition-colors"
            >
              EduMetrics
            </Link>
            <h2 className="mt-6 text-3xl font-bold">Create your account</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                  PASSWORD
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">
                  CONFIRM PASSWORD
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="university" className="block text-sm font-medium text-white/80">
                  SEARCH FOR YOUR UNIVERSITY
                </label>
                <div className="relative">
                  <input
                    id="university"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to search..."
                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/30"
                  />
                  {searchQuery.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {searchLoading && (
                <div className="flex justify-center items-center py-2 text-white/70">
                  <div className="relative w-5 h-5 mr-2">
                    <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 border-2 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
                  </div>
                  <span>Searching universities...</span>
                </div>
              )}

              {colleges.length > 0 && !searchLoading && (
                <div className="mt-2 max-h-48 overflow-y-auto custom-scrollbar rounded-md">
                  <div className="space-y-2">
                    {colleges.map((college) => (
                      <button
                        key={college.id}
                        type="button"
                        onClick={() => setSelectedCollege(college)}
                        className={`w-full text-left px-4 py-3 rounded-md transition-all hover-scale ${
                          selectedCollege?.id === college.id
                            ? "bg-white/20 text-white shadow-purple-500/30"
                            : "bg-white/10 text-white/80 hover:bg-white/15"
                        }`}
                      >
                        <div className="font-medium">{college.name}</div>
                        <div className="text-sm text-white/50">
                          {college.address && <span>{college.address}</span>}
                          {college.address && (college.city || college.state || college.zip) && <span>, </span>}
                          {(college.city || college.state || college.zip) && (
                            <span>
                              {college.city}
                              {college.city && college.state && ", "}
                              {college.state}
                              {(college.city || college.state) && college.zip && " "}
                              {college.zip}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedCollege && (
                <div className="mt-2 p-3 bg-white/15 rounded-md shadow-md">
                  <div className="font-medium text-purple-300">Selected University:</div>
                  <div className="mt-1">{selectedCollege.name}</div>
                  <div className="text-sm text-white/50">
                    {selectedCollege.city}
                    {selectedCollege.city && selectedCollege.state && ", "}
                    {selectedCollege.state}
                  </div>
                </div>
              )}

              {searchQuery.length >= 2 && colleges.length === 0 && !searchLoading && (
                <div className="text-white/50 text-center py-3">No universities found matching "{searchQuery}"</div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/80">I AM A</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={userRole === "student"}
                      onChange={() => setUserRole("student")}
                      className="w-4 h-4 text-purple-500 bg-white/10 border-white/10 focus:ring-purple-400 focus:ring-offset-black"
                    />
                    <span className="text-white">Student</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={userRole === "faculty"}
                      onChange={() => setUserRole("faculty")}
                      className="w-4 h-4 text-purple-500 bg-white/10 border-white/10 focus:ring-purple-400 focus:ring-offset-black"
                    />
                    <span className="text-white">Faculty</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedCollege}
              className={`w-full flex justify-center px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30 transition-all hover-scale shadow-lg ${
                selectedCollege
                  ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30"
                  : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
            >
              Create Account
            </button>
          </form>

          {error && (
            <div className="text-red-400 text-center mt-4 p-3 bg-red-900/30 rounded-md border border-red-500/30">
              {error}
            </div>
          )}

          <div className="text-center text-sm mt-4">
            <p className="text-white/70">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-purple-300 hover:text-purple-200">
                Sign in
              </Link>{" "}
              instead.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        .animate-spin {
          animation: spinSlow 1.2s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spinSlow 2s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spinReverse 1.5s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 6s infinite alternate;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.3); opacity: 0.4; }
        }
        
        .hover-scale {
          transition: transform 0.2s ease-in-out;
        }
        
        .hover-scale:hover {
          transform: scale(1.02);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}