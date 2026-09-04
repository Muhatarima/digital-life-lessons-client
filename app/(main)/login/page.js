'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '../../../lib/auth-client.js';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Both email and password are required!',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authClient.signIn.email({
        email,
        password,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Invalid email or password.');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Login successful! Redirecting...',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: error.message || 'An error occurred during sign in.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#f43f5e'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Error',
        text: 'Google credentials are not set up in environmental variables.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#f43f5e'
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-950/20 via-slate-950 to-slate-950">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your digital life insights.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 transition duration-200 transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-slate-50 dark:bg-slate-950 px-2 text-slate-500 uppercase font-semibold">Or sign in with</span></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold flex items-center justify-center gap-2 transition"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.74 14.93 1 12 1 7.37 1 3.4 3.73 1.57 7.7l3.65 2.83C6.11 7.36 8.84 5.04 12 5.04z" />
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.65 2.83c2.13-1.97 3.36-4.87 3.36-8.52z" />
            <path fill="#FBBC05" d="M5.22 10.53c-.23-.69-.36-1.43-.36-2.19 0-.76.13-1.5.36-2.19L1.57 3.32C.57 5.32 0 7.56 0 9.97c0 2.42.57 4.66 1.57 6.66l3.65-2.83c-.23-.69-.36-1.43-.36-2.19c0-.76.13-1.5.36-2.27z" />
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.11.75-2.53 1.2-4.31 1.2-3.16 0-5.89-2.32-6.78-5.49L1.57 16.3A11.967 11.967 0 0 0 12 23z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Redirect */}
        <div className="text-center text-xs text-slate-500">
          <span>Don't have an account? </span>
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
