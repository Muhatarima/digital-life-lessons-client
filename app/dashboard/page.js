'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '../../lib/auth-client.js';
import { 
  BookOpen, PlusCircle, BookMarked, Bookmark, Sparkles, 
  ArrowRight, Heart, Calendar, Shield, Eye, TrendingUp, AlertCircle
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { data: session } = authClient.useSession();
  const [profileData, setProfileData] = useState(null);
  const [myLessons, setMyLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profileRes, lessonsRes] = await Promise.all([
          fetch('/api/users/profile'),
          fetch('/api/lessons/my-lessons'),
        ]);

        if (profileRes.ok) {
          const pData = await profileRes.json();
          setProfileData(pData);
        }
        if (lessonsRes.ok) {
          const lData = await lessonsRes.json();
          setMyLessons(Array.isArray(lData) ? lData : []);
        }
      } catch (err) {
        console.error('Error fetching dashboard overview:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const isPremium = profileData?.user?.isPremium || session?.user?.isPremium;
  const createdCount = profileData?.stats?.createdCount || myLessons.length;
  const savedCount = profileData?.stats?.savedCount || 0;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                Personal Workspace
              </span>
              {isPremium && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 fill-current" /> Premium Member
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {session?.user?.name || 'Storyteller'}!
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Capture your hard-earned wisdom, reflect on daily decisions, and leave behind meaningful life lessons for yourself and the community.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/add-lesson"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-lg transition transform hover:scale-105"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Lesson</span>
            </Link>
            <Link
              href="/lessons"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-400/30 text-white font-semibold text-xs transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse Public Feed</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Lessons Created */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Created Lessons</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{loading ? '...' : createdCount}</h3>
            <p className="text-[10px] text-slate-400">Authored by you</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
            <BookMarked className="h-6 w-6" />
          </div>
        </div>

        {/* Lessons Saved */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saved Lessons</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{loading ? '...' : savedCount}</h3>
            <p className="text-[10px] text-slate-400">Saved in bookmarks</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-500">
            <Bookmark className="h-6 w-6" />
          </div>
        </div>

        {/* Total Likes Received */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Community Likes</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : myLessons.reduce((acc, l) => acc + (l.likesCount || 0), 0)}
            </h3>
            <p className="text-[10px] text-slate-400">Across your public lessons</p>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-500">
            <Heart className="h-6 w-6" />
          </div>
        </div>

        {/* Membership Tier */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Plan Status</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
              {isPremium ? (
                <span className="text-amber-500 flex items-center gap-1">
                  <Sparkles className="h-4 w-4 fill-current" /> Premium Lifetime
                </span>
              ) : (
                <span className="text-slate-600 dark:text-slate-300">Standard Tier</span>
              )}
            </h3>
            {!isPremium ? (
              <Link href="/pricing" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Upgrade for ৳1500 &rarr;
              </Link>
            ) : (
              <p className="text-[10px] text-emerald-500 font-semibold">All perks unlocked</p>
            )}
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Recent Lessons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Lessons</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your most recently updated or published wisdom.</p>
          </div>
          <Link
            href="/dashboard/my-lessons"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({myLessons.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : myLessons.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">You haven't recorded any life lessons yet.</p>
            <Link
              href="/dashboard/add-lesson"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Record Your First Lesson</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myLessons.slice(0, 4).map((lesson) => (
              <div
                key={lesson._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/30 transition gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 uppercase">
                      {lesson.category}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      lesson.visibility === 'public'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {lesson.visibility}
                    </span>
                    {lesson.accessLevel === 'premium' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5 fill-current" /> Premium
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {lesson.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right text-[11px] text-slate-400">
                    <p className="flex items-center gap-1"><Heart className="h-3 w-3 text-rose-500" /> {lesson.likesCount || 0}</p>
                    <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(lesson.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Link
                    href={`/lessons/${lesson._id}`}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-500 text-xs font-semibold transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
