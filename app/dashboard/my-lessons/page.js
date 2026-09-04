'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookMarked, PlusCircle, Search, Edit3, Trash2, Eye, 
  Globe, Lock, Sparkles, Filter, Check, X, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function MyLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchMyLessons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lessons/my-lessons');
      if (!res.ok) throw new Error('Failed to fetch lessons.');
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLessons();
  }, []);

  // Quick Visibility Toggle
  const handleToggleVisibility = async (lesson) => {
    const newVisibility = lesson.visibility === 'public' ? 'private' : 'public';
    try {
      const res = await fetch(`/api/lessons/${lesson._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: newVisibility }),
      });

      if (!res.ok) throw new Error('Failed to update visibility.');

      setLessons((prev) =>
        prev.map((l) => (l._id === lesson._id ? { ...l, visibility: newVisibility } : l))
      );

      Swal.fire({
        icon: 'success',
        title: `Set to ${newVisibility}`,
        toast: true,
        position: 'top-end',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error updating visibility.');
    }
  };

  // Delete Lesson with SweetAlert2 confirmation
  const handleDeleteLesson = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete this lesson?',
      text: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      background: '#0f172a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/lessons/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete.');

        setLessons((prev) => prev.filter((l) => l._id !== id));

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your life lesson has been removed.',
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#fff',
        });
      } catch (err) {
        console.error(err);
        Swal.fire('Error deleting lesson.');
      }
    }
  };

  // Filter lessons
  const filteredLessons = lessons.filter((l) => {
    const matchesSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || l.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Personal Growth', 'Career', 'Relationships', 'Mindset', 'Mistakes Learned'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked className="h-7 w-7 text-indigo-500" />
            <span>My Life Lessons</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your personal reflections, edit content, and toggle visibility.
          </p>
        </div>

        <Link
          href="/dashboard/add-lesson"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition transform hover:scale-105 w-fit"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Lesson</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search my lessons..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Lessons Table / List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lessons.length === 0 ? "You haven't recorded any lessons yet." : 'No lessons match your filter.'}
          </p>
          {lessons.length === 0 && (
            <Link
              href="/dashboard/add-lesson"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
            >
              <PlusCircle className="h-4 w-4" /> Add Your First Lesson
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4">Tier</th>
                  <th className="py-3.5 px-4">Likes</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-medium">
                {filteredLessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {lesson.title}
                      </p>
                      <p className="text-slate-400 text-[11px] truncate">
                        {lesson.description}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleVisibility(lesson)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          lesson.visibility === 'public'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                        }`}
                        title="Click to toggle visibility"
                      >
                        {lesson.visibility === 'public' ? (
                          <>
                            <Globe className="h-3 w-3" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3" />
                            <span>Private</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      {lesson.accessLevel === 'premium' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 w-fit">
                          <Sparkles className="h-2.5 w-2.5 fill-current" /> Premium
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Free</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {lesson.likesCount || 0}
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {new Date(lesson.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/lessons/${lesson._id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-500 transition"
                          title="View Public Lesson"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/dashboard/my-lessons/edit/${lesson._id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-500 transition"
                          title="Edit Lesson"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteLesson(lesson._id, lesson.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                          title="Delete Lesson"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
