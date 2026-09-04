'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '../../../../lib/auth-client.js';
import { 
  AlertTriangle, CheckCircle, Trash2, Eye, ArrowLeft, 
  HelpCircle, ShieldCheck, ShieldAlert, X
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminReportsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReportDetails, setActiveReportDetails] = useState(null);

  // Admin guard
  useEffect(() => {
    if (!isPending) {
      if (!session || session.user?.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [session, isPending, router]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      if (!res.ok) throw new Error('Failed to fetch reports.');
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchReports();
    }
  }, [session]);

  // Permanently delete inappropriate lesson
  const handleDeleteLesson = async (lessonId, title) => {
    const result = await Swal.fire({
      title: 'Delete Inappropriate Lesson?',
      text: `This will permanently delete "${title}" and remove all related flags and comments.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete lesson',
      background: '#0f172a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/reports/${lessonId}/delete`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete.');

        setReports((prev) => prev.filter((r) => r.lessonId !== lessonId));

        Swal.fire({
          icon: 'success',
          title: 'Lesson Removed',
          text: 'Inappropriate content was deleted.',
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

  // Ignore flags and keep lesson live
  const handleIgnoreReports = async (lessonId) => {
    try {
      const res = await fetch(`/api/admin/reports/${lessonId}/ignore`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Failed to clear flags.');

      setReports((prev) => prev.filter((r) => r.lessonId !== lessonId));

      Swal.fire({
        icon: 'success',
        title: 'Flags Dismissed',
        text: 'Reports cleared. The lesson remains live.',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error clearing flags.');
    }
  };

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
            <AlertTriangle className="h-7 w-7 text-rose-500" />
            <span>Reported & Flagged Content</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review user reports on spam, offensive language, or policy violations.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold text-xs w-fit">
          {reports.length} Flagged Lessons
        </span>
      </div>

      {/* Reports Content */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">All Clear!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are currently no reported or flagged life lessons awaiting moderation.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Reported Lesson Title</th>
                  <th className="py-3.5 px-4">Flag Count</th>
                  <th className="py-3.5 px-4">Latest Reason</th>
                  <th className="py-3.5 px-4">Details</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-medium">
                {reports.map((item) => (
                  <tr key={item.lessonId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 max-w-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.lessonTitle}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold text-[10px]">
                        {item.reportCount} {item.reportCount === 1 ? 'Report' : 'Reports'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 capitalize max-w-xs truncate">
                      {item.reports?.[0]?.reason || 'Flagged by community'}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setActiveReportDetails(item)}
                        className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1"
                      >
                        <span>View Reasons ({item.reports?.length || 0})</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/lessons/${item.lessonId}`}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Inspect Lesson"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleIgnoreReports(item.lessonId)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 text-[11px] font-bold transition"
                          title="Dismiss Reports"
                        >
                          Keep Live
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(item.lessonId, item.lessonTitle)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow transition"
                          title="Delete Lesson"
                        >
                          Delete Lesson
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

      {/* Modal for detailed report reasons */}
      {activeReportDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-500" />
                <span>Report Details</span>
              </h3>
              <button
                onClick={() => setActiveReportDetails(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400">Lesson Title:</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{activeReportDetails.lessonTitle}</p>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {activeReportDetails.reports?.map((r, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Reporter: {r.reporterName} ({r.reporterEmail})</span>
                    <span>{new Date(r.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Reason: <span className="capitalize text-rose-500 font-bold">{r.reason}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveReportDetails(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
