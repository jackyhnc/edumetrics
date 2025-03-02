'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/context';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { handleLogin } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => setLoading(false);
    router.events?.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await handleLogin(email, password);
      if (user) {
        router.push('/home'); 
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-2xl transition-opacity animate-fadeIn">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-purple-400 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 border-4 border-transparent border-l-purple-500 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white via-purple-400 to-purple-700 text-transparent bg-clip-text drop-shadow-lg">
            EduMetrics
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-purple-300">Sign in to your account</p>
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
              className="w-full flex justify-center px-4 py-3 bg-white text-black hover:bg-purple-200 transition-colors rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30"
            >
              Sign in
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}

        <div className="text-center text-sm">
          <p className="text-white/50">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-white hover:text-white/80">
              Sign up
            </Link>{' '}for free.
          </p>
        </div>
      </div>

      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-white via-purple-500 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-black via-purple-600 to-purple-900 rounded-full opacity-30 blur-3xl animate-pulse"></div>
    </div>
  );
}
