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
  
  const { handleSignup } = useSession();
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const user = await handleSignup(email, password);
      if (user) {
        router.push('/university'); // Redirect only if signup is successful
      } else {
        setError('Password must be at least 8 characters long and include at least one letter and one special character.');
      }
    } catch (err) {
      setError('An error occurred during signup.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
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
                className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white"
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
                className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white"
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
                className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/10 rounded-md text-white"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full px-4 py-3 bg-white text-black hover:bg-gray-100 transition-colors rounded-md font-medium">
              Create account
            </button>
          </div>
        </form>

        {/* Error message at the bottom */}
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
    </div>
  );
}
