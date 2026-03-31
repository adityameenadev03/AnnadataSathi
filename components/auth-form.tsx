'use client';

import { useState } from 'react';
import { Tractor, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signUpWithEmail } from '@/app/auth/sign-up/actions';
import { signInWithEmail } from '@/app/sign-in/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type AuthMode = 'sign-in' | 'sign-up';

export function AuthForm({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      if (mode === 'sign-up') {
        formData.append('name', name);
        const result = await signUpWithEmail(null, formData);
        if (result?.error) {
          setError(result.error);
        }
      } else {
        const result = await signInWithEmail(null, formData);
        if (result?.error) {
          setError(result.error);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-[#1e8f4c] rounded-xl flex items-center justify-center shadow-sm mb-4">
          <Tractor className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kisan App</h1>
        <p className="text-sm text-gray-500 text-center mt-2 px-6">
          Manage your farm, track expenses, and get expert advice.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="w-full bg-white rounded-lg shadow-sm p-1 flex mb-6 border border-gray-100">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            mode === 'sign-up' ? 'bg-[#f4f7f4] text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            setMode('sign-up');
            setError(null);
          }}
        >
          Sign Up
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            mode === 'sign-in' ? 'bg-[#f4f7f4] text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            setMode('sign-in');
            setError(null);
          }}
        >
          Log In
        </button>
      </div>

      {/* Form Card */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          {mode === 'sign-up' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e8f4c] focus:border-transparent transition-shadow"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@example.com"
                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e8f4c] focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                Password
              </label>
              {mode === 'sign-in' && (
                <Link href="#" className="text-xs text-[#1e8f4c] hover:underline font-medium">
                  Forgot?
                </Link>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e8f4c] focus:border-transparent transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#1e8f4c] hover:bg-[#1a7f43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e8f4c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Please wait...' : mode === 'sign-up' ? 'Create Account' : 'Log In'}
          </button>
        </form>
      </div>

      {mode === 'sign-up' && (
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <Link href="#" className="text-[#1e8f4c] hover:underline font-medium">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-[#1e8f4c] hover:underline font-medium">
            Privacy Policy
          </Link>
        </p>
      )}
    </div>
  );
}
