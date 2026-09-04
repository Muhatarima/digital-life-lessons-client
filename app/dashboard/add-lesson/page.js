'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '../../../lib/auth-client.js';
import { 
  PlusCircle, BookOpen, Sparkles, Image as ImageIcon, 
  HelpCircle, CheckCircle2, Lock, ArrowLeft
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function AddLessonPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal Growth');
  const [emotionalTone, setEmotionalTone] = useState('Motivational');
  const [visibility, setVisibility] = useState('public');
  const [accessLevel, setAccessLevel] = useState('free');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Personal Growth', 'Career', 'Relationships', 'Mindset', 'Mistakes Learned'];
  const emotionalTones = ['Motivational', 'Sad', 'Realization', 'Gratitude'];

  const isPremiumUser = session?.user?.isPremium || session?.user?.role === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please provide both a title and a description for your life lesson.',
        background: '#0f172a',
        color: '#fff',
      });
      return;
    }

    if (accessLevel === 'premium' && !isPremiumUser) {
      Swal.fire({
        icon: 'error',
        title: 'Premium Required',
        text: 'Only Premium members can publish premium access lessons.',
        background: '#0f172a',
        color: '#fff',
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          emotionalTone,
          visibility,
          accessLevel,
          image: image.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save lesson.');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Lesson Published!',
        text: 'Your wisdom has been recorded successfully.',
        timer: 1800,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });

      router.push('/dashboard/my-lessons');
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.message || 'Failed to create lesson.',
        background: '#0f172a',
        color: '#fff',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/my-lessons"
            className="text-xs font-semibold text-slate-500 hover:text-indigo-500 flex items-center gap-1 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to My Lessons
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <PlusCircle className="h-7 w-7 text-indigo-500" />
            <span>Create a Life Lesson</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Document what life taught you so you can reflect on it later or inspire others.
          </p>
        </div>
      </div>

      {/* Main Creation Card Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Lesson Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Don't Compare Your Behind-the-Scenes with Someone Else's Highlight Reel"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            required
          />
        </div>

        {/* Category & Emotional Tone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Emotional Tone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Emotional Tone <span className="text-rose-500">*</span>
            </label>
            <select
              value={emotionalTone}
              onChange={(e) => setEmotionalTone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold"
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
                <span>Public (Everyone can read)</span>
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
                <span>Private (Only you)</span>
              </label>
            </div>
          </div>

          {/* Access Level (Free / Premium) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>Access Level</span>
                {!isPremiumUser && (
                  <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                    <Lock className="h-3 w-3" /> Premium Feature
                  </span>
                )}
              </label>
            </div>
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
                <span>Free Access</span>
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
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500 fill-current" />
                  Premium (Subscribers only)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Featured Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Featured Image URL (Optional)</span>
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          />
          {image && (
            <div className="mt-2 w-full h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img src={image} alt="Preview" className="w-full h-full object-cover" onError={() => setImage('')} />
            </div>
          )}
        </div>

        {/* Description / Life Story */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Life Story / Core Reflection <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the experience, the context, the mistake or turning point, and the timeless takeaway..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
            required
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/dashboard/my-lessons"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Publish Lesson</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
