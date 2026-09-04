'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '../../../../../lib/auth-client.js';
import { 
  Edit3, ArrowLeft, CheckCircle2, Sparkles, Image as ImageIcon, Lock 
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function EditLessonPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal Growth');
  const [emotionalTone, setEmotionalTone] = useState('Motivational');
  const [visibility, setVisibility] = useState('public');
  const [accessLevel, setAccessLevel] = useState('free');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Personal Growth', 'Career', 'Relationships', 'Mindset', 'Mistakes Learned'];
  const emotionalTones = ['Motivational', 'Sad', 'Realization', 'Gratitude'];

  const isPremiumUser = session?.user?.isPremium || session?.user?.role === 'admin';

  useEffect(() => {
    async function loadLesson() {
      try {
        const res = await fetch(`/api/lessons/${id}`);
        if (!res.ok) throw new Error('Failed to load lesson.');
        const data = await res.json();
        const l = data.lesson;
        
        setTitle(l.title || '');
        setDescription(l.description || '');
        setCategory(l.category || 'Personal Growth');
        setEmotionalTone(l.emotionalTone || 'Motivational');
        setVisibility(l.visibility || 'public');
        setAccessLevel(l.accessLevel || 'free');
        setImage(l.image || '');
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Not Found',
          text: 'Lesson could not be retrieved.',
          background: '#0f172a',
          color: '#fff',
        });
        router.push('/dashboard/my-lessons');
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [id, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Title and description are required.',
        background: '#0f172a',
        color: '#fff',
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/lessons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          emotionalTone,
          visibility,
          accessLevel,
          image: image.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update lesson.');

      Swal.fire({
        icon: 'success',
        title: 'Changes Saved!',
        text: 'Lesson updated successfully.',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });

      router.push('/dashboard/my-lessons');
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || 'Error updating lesson.',
        background: '#0f172a',
        color: '#fff',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/dashboard/my-lessons"
          className="text-xs font-semibold text-slate-500 hover:text-indigo-500 flex items-center gap-1 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to My Lessons
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Edit3 className="h-7 w-7 text-indigo-500" />
          <span>Edit Life Lesson</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Update the insights, tone, category, or visibility of this lesson.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleUpdate} className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Lesson Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            required
          />
        </div>

        {/* Category & Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Emotional Tone
            </label>
            <select
              value={emotionalTone}
              onChange={(e) => setEmotionalTone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {emotionalTones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Visibility & Access Level Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
          
          {/* Visibility */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Visibility
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Private</span>
              </label>
            </div>
          </div>

          {/* Access Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Access Level
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="radio"
                  name="accessLevel"
                  value="free"
                  checked={accessLevel === 'free'}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Free</span>
              </label>
              <label className={`flex items-center gap-2 text-xs font-medium ${
                isPremiumUser ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}>
                <input
                  type="radio"
                  name="accessLevel"
                  value="premium"
                  disabled={!isPremiumUser}
                  checked={accessLevel === 'premium'}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="text-amber-500 focus:ring-amber-500"
                />
                <span>Premium</span>
              </label>
            </div>
          </div>
        </div>

        {/* Featured Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Featured Image URL</span>
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Life Story / Core Reflection <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/dashboard/my-lessons"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
