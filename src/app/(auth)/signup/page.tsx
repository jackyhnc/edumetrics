'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/context';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { handleSignup } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const user = await handleSignup(email, password);
      if (user) {
        router.push('/university');
      } else {
        setError('Password must be at least 8 characters long and include at least one letter and one special character.');
      }
    } catch (err) {
      setError('An error occurred during signup.');
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
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white via-purple-400 to-purple-700 text-transparent bg-clip-text drop-shadow-lg">
            EduMetrics
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">Create your account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80">EMAIL ADDRESS</label>
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
              <label htmlFor="password" className="block text-sm font-medium text-white/80">PASSWORD</label>
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">CONFIRM PASSWORD</label>
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
          </div>

          <div>
            <button type="submit" className="w-full px-4 py-3 bg-white text-black hover:bg-purple-200 transition-colors rounded-md font-medium">
              Create account
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}

        <div className="text-center text-sm mt-4">
          <p className="text-white/50">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-white hover:text-white/80">Sign in</Link> instead.
          </p>
        </div>
      </div>

      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-white via-purple-500 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-black via-purple-600 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
    </div>
  );
}
