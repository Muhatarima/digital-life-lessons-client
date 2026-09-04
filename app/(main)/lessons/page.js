'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client.js';
import { 
  Search, Filter, SlidersHorizontal, Lock, ArrowLeft, ArrowRight, Eye, Calendar, Sparkles, BookOpen
} from 'lucide-react';

export default function BrowseLessonsPage() {
  const { data: session } = authClient.useSession();
  
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [emotionalTone, setEmotionalTone] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['Personal Growth', 'Career', 'Relationships', 'Mindset', 'Mistakes Learned'];
  const emotionalTones = ['Motivational', 'Sad', 'Realization', 'Gratitude'];

  const fetchLessons = () => {
    setLoading(true);
    const query = new URLSearchParams({
      page: page.toString(),
      limit: '6',
      sort,
    });

    if (search) query.append('search', search);
    if (category) query.append('category', category);
    if (emotionalTone) query.append('emotionalTone', emotionalTone);

    fetch(`/api/lessons?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        setLessons(data.lessons || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching lessons:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLessons();
  }, [page, category, emotionalTone, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLessons();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setEmotionalTone('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-indigo-500" />
          <span>Browse Public Wisdom</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Explore life insights, lessons learned from hardships, and personal growth guidelines shared by the community.
        </p>
      </div>

      {/* Filters & Search Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, keyword, or insight..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition duration-200"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Emotional Tone Dropdown */}
          <select
            value={emotionalTone}
            onChange={(e) => { setEmotionalTone(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Emotional Tones</option>
            {emotionalTones.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Sorting Dropdown */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="newest">Sort by Newest</option>
            <option value="most_saved">Sort by Most Saved</option>
            <option value="oldest">Sort by Oldest</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="ml-auto text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Lessons Listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">No life lessons found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className={`flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${
                lesson.isLocked
                  ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/80 shadow-inner'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 shadow-md hover:shadow-xl'
              }`}
            >
              <div>
                {/* Badges */}
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {lesson.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {lesson.emotionalTone}
                    </span>
                    {lesson.accessLevel === 'premium' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-bold uppercase tracking-wide flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5 fill-current" /> Premium
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug line-clamp-1">
                  {lesson.title}
                </h3>

                {/* Locked / Blurred content */}
                {lesson.isLocked ? (
                  <div className="relative my-4 p-4 rounded-xl bg-slate-200/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-center select-none overflow-hidden h-32 flex flex-col justify-center items-center">
                    <div className="absolute inset-0 bg-slate-200/20 dark:bg-slate-950/20 backdrop-blur-md z-10" />
                    <div className="relative z-20 flex flex-col items-center gap-2">
                      <Lock className="h-6 w-6 text-amber-500" />
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        Premium Lesson – Upgrade to view
                      </p>
                      <Link
                        href="/pricing"
                        className="text-[10px] font-bold px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow"
                      >
                        Unlock Now
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {lesson.description}
                  </p>
                )}
              </div>

              {/* Creator details and Read More */}
              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/80 pt-4 mt-auto">
                <div className="flex items-center gap-2">
                  <img
                    src={lesson.creator?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={lesson.creator?.name || 'Creator'}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div className="text-[10px]">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{lesson.creator?.name || 'Anonymous'}</p>
                    <p className="text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(lesson.createdAt).toLocaleDateString(undefined, { dateStyle: 'short' })}
                    </p>
                  </div>
                </div>

                <Link
                  href={lesson.isLocked ? '/pricing' : `/lessons/${lesson._id}`}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 transition"
                >
                  See Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-slate-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
