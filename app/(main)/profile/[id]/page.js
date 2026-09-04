'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, BookOpen, Sparkles, Calendar, ArrowRight, 
  ArrowLeft, Heart, Shield, Lock
} from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuthor() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error('Author not found.');
        const resData = await res.json();
        setData(resData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadAuthor();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Author Not Found</h2>
        <p className="text-xs text-slate-400">The profile you are trying to view does not exist or has been removed.</p>
        <Link href="/lessons" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Lessons
        </Link>
      </div>
    );
  }

  const { user, lessons, stats } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back link */}
      <Link href="/lessons" className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-500 transition w-fit">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Public Lessons
      </Link>

      {/* Author Card */}
      <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user.photoURL || user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
          alt={user.name}
          className="h-24 w-24 rounded-full object-cover border-4 border-indigo-100 dark:border-slate-800 shadow-md"
        />

        <div className="space-y-2 text-center sm:text-left flex-grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h1>
            {user.role === 'admin' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Admin
              </span>
            )}
            {user.isPremium && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                <Sparkles className="h-3 w-3 fill-current" /> Premium Author
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Digital Life Lessons Contributor
          </p>

          <div className="pt-2 text-xs font-semibold text-slate-400">
            <span>{stats?.createdCount || lessons.length} Lessons Shared</span>
          </div>
        </div>
      </div>

      {/* Lessons Authored by this creator */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          <span>Published Wisdom by {user.name}</span>
        </h2>

        {lessons.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">This author hasn't published any public lessons yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 uppercase">
                      {lesson.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lesson.emotionalTone}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-6">
                    {lesson.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/lessons/${lesson._id}`}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="h-3 w-3" />
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
