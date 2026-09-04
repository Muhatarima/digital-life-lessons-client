'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '../../../lib/auth-client.js';
import { 
  Shield, Users, BookOpen, AlertTriangle, Sparkles, 
  Calendar, Award, ArrowUpRight, TrendingUp, BarChart2
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function AdminAnalyticsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin route protection
  useEffect(() => {
    if (!isPending) {
      if (!session || session.user?.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (!res.ok) throw new Error('Failed to load analytics.');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [session]);

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-rose-500 border-r-transparent border-b-rose-500 border-l-transparent" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>No analytics data available.</p>
      </div>
    );
  }

  const {
    totalUsers,
    totalPublicLessons,
    totalReported,
    todayNewLessons,
    activeContributors,
    lessonGrowth,
    userGrowth,
  } = analytics;

  // Merge lessonGrowth and userGrowth by date for the chart
  const datesSet = new Set([
    ...lessonGrowth.map(item => item.date),
    ...userGrowth.map(item => item.date),
  ]);

  const sortedDates = Array.from(datesSet).sort();
  const chartData = sortedDates.map(date => {
    const lMatch = lessonGrowth.find(item => item.date === date);
    const uMatch = userGrowth.find(item => item.date === date);
    return {
      date: date.slice(5), // MM-DD
      Lessons: lMatch ? lMatch.count : 0,
      Users: uMatch ? uMatch.count : 0,
    };
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-wider">
              Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <Shield className="h-7 w-7 text-rose-500" />
            <span>Platform Overview & Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time activity metrics, user engagement growth, and content moderation summary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/admin/manage-lessons"
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
          >
            Moderate Lessons
          </Link>
          <Link
            href="/dashboard/admin/reports"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Review Flags ({totalReported})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Users */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Registered Users</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalUsers}</h3>
            <p className="text-[10px] text-emerald-500 font-semibold">Active accounts</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-500">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Total Public Lessons */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Public Lessons</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalPublicLessons}</h3>
            <p className="text-[10px] text-slate-400">Published to library</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-500">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        {/* Today's New Lessons */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's New Lessons</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{todayNewLessons}</h3>
            <p className="text-[10px] text-slate-400">Past 24 hours</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-500">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Flagged / Reported */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Flagged Reports</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalReported}</h3>
            <p className="text-[10px] text-rose-500 font-semibold">Requires review</p>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Growth Chart Section */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-500" />
              <span>Platform Activity Growth (Last 7 Days)</span>
            </h3>
            <p className="text-xs text-slate-500">Comparative trend of daily user registrations and lesson publications.</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No growth activity recorded in the past 7 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Lessons" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Users" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Most Active Contributors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Most Active Contributors</span>
            </h3>
            <p className="text-xs text-slate-500">Creators with the highest count of published wisdom.</p>
          </div>
          <Link
            href="/dashboard/admin/manage-users"
            className="text-xs font-bold text-indigo-500 hover:underline"
          >
            Manage All Users &rarr;
          </Link>
        </div>

        {activeContributors?.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">No contributor records found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeContributors.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xs font-black text-slate-400">#{idx + 1}</div>
                  <img
                    src={c.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={c.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                      {c.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{c.email}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-black">
                  {c.lessonsCount} lessons
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
