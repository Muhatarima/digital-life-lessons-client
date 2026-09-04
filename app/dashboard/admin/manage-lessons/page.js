'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '../../../../lib/auth-client.js';
import { 
  FileText, Star, CheckCircle, XCircle, Trash2, Eye, 
  ArrowLeft, Search, Filter, Sparkles, Globe, Lock, AlertTriangle
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function ManageLessonsAdminPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState({ publicCount: 0, privateCount: 0, flaggedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState('');

  // Admin guard
  useEffect(() => {
    if (!isPending) {
      if (!session || session.user?.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [session, isPending, router]);

  const fetchAdminLessons = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (category) query.append('category', category);
      if (visibility) query.append('visibility', visibility);

      const res = await fetch(`/api/admin/lessons?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to load lessons.');
      const data = await res.json();
      setLessons(data.lessons || []);
      setStats(data.stats || { publicCount: 0, privateCount: 0, flaggedCount: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchAdminLessons();
    }
  }, [session, category, visibility]);

  // Toggle Featured
  const handleToggleFeatured = async (lesson) => {
    const nextVal = !lesson.isFeatured;
    try {
      const res = await fetch(`/api/admin/lessons/${lesson._id}/featured`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: nextVal }),
      });

      if (!res.ok) throw new Error('Failed to toggle featured.');

      setLessons((prev) =>
        prev.map((l) => (l._id === lesson._id ? { ...l, isFeatured: nextVal } : l))
      );

      Swal.fire({
        icon: 'success',
        title: nextVal ? 'Marked as Featured!' : 'Unfeatured',
        toast: true,
        position: 'top-end',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error updating featured status.');
    }
  };

  // Toggle Reviewed
  const handleToggleReviewed = async (lesson) => {
    const nextVal = !lesson.isReviewed;
    try {
      const res = await fetch(`/api/admin/lessons/${lesson._id}/reviewed`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isReviewed: nextVal }),
      });

      if (!res.ok) throw new Error('Failed to update review status.');

      setLessons((prev) =>
        prev.map((l) => (l._id === lesson._id ? { ...l, isReviewed: nextVal } : l))
      );

      Swal.fire({
        icon: 'success',
        title: nextVal ? 'Lesson Verified / Reviewed' : 'Review Status Reset',
        toast: true,
        position: 'top-end',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error updating review status.');
    }
  };

  // Delete Lesson
  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete this lesson?',
      text: `Are you sure you want to delete "${title}"? This action cannot be reversed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      background: '#0f172a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete lesson.');

        setLessons((prev) => prev.filter((l) => l._id !== id));

        Swal.fire({
          icon: 'success',
          title: 'Lesson Deleted',
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

  const filtered = lessons.filter((l) => {
    if (!search) return true;
    return (
      (l.title && l.title.toLowerCase().includes(search.toLowerCase())) ||
      (l.creatorName && l.creatorName.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const categories = ['Personal Growth', 'Career', 'Relationships', 'Mindset', 'Mistakes Learned'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/admin"
            className="text-xs font-semibold text-slate-500 hover:text-rose-500 flex items-center gap-1 mb-1 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Analytics
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-7 w-7 text-rose-500" />
            <span>Manage All Lessons</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review community submissions, toggle editorial features, and moderate content.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {stats.publicCount} Public
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
            {stats.privateCount} Private
          </span>
          {stats.flaggedCount > 0 && (
            <Link
              href="/dashboard/admin/reports"
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition flex items-center gap-1"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{stats.flaggedCount} Flagged</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lessons or author..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
        >
          <option value="">All Visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-400">No lessons found matching criteria.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Title & Author</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Reviewed</th>
                  <th className="py-3.5 px-4">Flags</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-medium">
                {filtered.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{lesson.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">By {lesson.creatorName} ({lesson.creatorEmail})</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lesson.visibility === 'public'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {lesson.visibility}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(lesson)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                          lesson.isFeatured
                            ? 'bg-amber-500 text-slate-950'
                            : 'border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`h-3 w-3 ${lesson.isFeatured ? 'fill-current' : ''}`} />
                        <span>{lesson.isFeatured ? 'Featured' : 'Regular'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleReviewed(lesson)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                          lesson.isReviewed
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                        title="Toggle Reviewed Status"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>{lesson.isReviewed ? 'Reviewed' : 'Pending'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      {lesson.reportsCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold text-[10px] flex items-center gap-1 w-fit">
                          <AlertTriangle className="h-3 w-3" /> {lesson.reportsCount}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">0</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/lessons/${lesson._id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg transition"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(lesson._id, lesson.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
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
