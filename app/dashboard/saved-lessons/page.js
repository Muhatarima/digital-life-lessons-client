'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bookmark, Download, Trash2, Eye, Calendar, Sparkles, 
  ArrowRight, Heart, FileText, CheckCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function SavedLessonsPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const printAreaRef = useRef(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lessons/favorites');
      if (!res.ok) throw new Error('Failed to fetch saved lessons.');
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Remove from favorites
  const handleRemoveFavorite = async (id) => {
    try {
      const res = await fetch(`/api/lessons/${id}/favorite`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to remove.');

      setFavorites((prev) => prev.filter((item) => item._id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Removed from Favorites',
        toast: true,
        position: 'top-end',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error removing lesson.');
    }
  };

  // Export Saved Lessons as PDF using jsPDF + html2canvas
  const handleExportPDF = async () => {
    if (favorites.length === 0) return;
    setDownloadingPdf(true);

    try {
      const element = printAreaRef.current;
      if (!element) throw new Error('Print container not found.');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`My_Saved_Life_Lessons_${new Date().toISOString().slice(0, 10)}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'PDF Downloaded!',
        text: 'Your saved life wisdom has been exported to PDF.',
        timer: 2000,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
    } catch (err) {
      console.error('PDF export error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to generate PDF document.',
        background: '#0f172a',
        color: '#fff',
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="h-7 w-7 text-amber-500" />
            <span>Saved Life Lessons</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Wisdom and life insights you have bookmarked for future reference.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handleExportPDF}
            disabled={downloadingPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition transform hover:scale-105 disabled:opacity-50 w-fit"
          >
            <Download className="h-4 w-4" />
            <span>{downloadingPdf ? 'Exporting PDF...' : 'Export Collection to PDF'}</span>
          </button>
        )}
      </div>

      {/* Favorites Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="h-10 w-10 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No saved lessons yet.</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse public wisdom and click the bookmark icon on any lesson to save it here for offline reflection.
          </p>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Browse Public Wisdom
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((lesson) => (
            <div
              key={lesson._id}
              className="flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 uppercase">
                    {lesson.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>{lesson.emotionalTone}</span>
                    {lesson.accessLevel === 'premium' && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-bold">
                        ★
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                  {lesson.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={lesson.creator?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={lesson.creator?.name || 'Author'}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                    {lesson.creator?.name || 'Author'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRemoveFavorite(lesson._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                    title="Remove from Saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/lessons/${lesson._id}`}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition"
                  >
                    Read
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden printable element for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={printAreaRef} className="p-10 bg-white text-slate-900 w-[800px] space-y-6 font-sans">
          <div className="border-b pb-4">
            <h1 className="text-2xl font-bold text-indigo-600">Digital Life Lessons - Personal Wisdom Archive</h1>
            <p className="text-xs text-slate-500">Exported on {new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
          </div>

          <div className="space-y-6">
            {favorites.map((lesson, idx) => (
              <div key={lesson._id} className="p-4 border rounded-xl space-y-2 bg-slate-50">
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="font-bold text-indigo-600">#{idx + 1} • {lesson.category} ({lesson.emotionalTone})</span>
                  <span>By {lesson.creator?.name || 'Community Member'}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900">{lesson.title}</h2>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{lesson.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t text-center text-xs text-slate-400">
            Digital Life Lessons • Preserving wisdom and personal growth for a lifetime.
          </div>
        </div>
      </div>

    </div>
  );
}
