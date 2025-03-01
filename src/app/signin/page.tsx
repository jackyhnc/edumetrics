'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    console.log('Sign in attempt with:', email);
    
    // For now, just redirect to university selection
    router.push('/university');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
            EduMetrics
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-white/70">
            Sign in to your account
          </p>
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
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
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
                autoComplete="current-password"
                placeholder="Enter Your Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center px-4 py-3 bg-white text-black hover:bg-gray-100 transition-colors rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30">
              Sign in 
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-white/50">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-white hover:text-white/80">
              Sign up
            </Link>{' '}
            for free.
          </p>
        </div>
      </div>
    </div>
  );
}