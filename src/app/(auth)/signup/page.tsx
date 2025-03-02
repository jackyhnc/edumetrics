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
        router.push("/courseReview");
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
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-2xl transition-opacity animate-fadeIn">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 border-4 border-transparent border-l-purple-500 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 p-8 bg-white/10 rounded-lg shadow-lg shadow-purple-500/30">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-white via-purple-400 to-purple-700 text-transparent bg-clip-text drop-shadow-lg"
          >
            EduMetrics
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">Create your account</h2>
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
              <input
                id="university"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search..."
                className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/30"
              />
            </div>

            {searchLoading && (
              <div className="text-white/70 text-center py-2">
                <div className="inline-block animate-spin h-5 w-5 border-2 border-white/20 border-t-white/80 rounded-full mr-2"></div>
                Searching...
              </div>
            )}

            {colleges.length > 0 && !searchLoading && (
              <div className="mt-2 max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="space-y-2 [&:has(>:nth-child(4))]:pr-4">
                  {colleges.map((college) => (
                    <button
                      key={college.id}
                      type="button"
                      onClick={() => setSelectedCollege(college)}
                      className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                        selectedCollege?.id === college.id
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/15"
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
            className={`w-full flex justify-center px-4 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30 ${
              selectedCollege
                ? "bg-white text-black hover:bg-gray-100 transition-colors"
                : "bg-white/20 text-white/50 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </form>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        <div className="text-center text-sm mt-4">
          <p className="text-white/50">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-white hover:text-white/80">
              Sign in
            </Link>{" "}
            instead.
          </p>
        </div>
      </div>

      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-white via-purple-500 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-black via-purple-600 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
    </div>
  );
}
