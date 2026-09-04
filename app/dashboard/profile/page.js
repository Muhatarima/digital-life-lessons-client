'use client';

import { useState, useEffect } from 'react';
import { authClient } from '../../../lib/auth-client.js';
import { 
  User, Mail, Shield, Sparkles, BookMarked, Bookmark, 
  Calendar, CheckCircle2, Image as ImageIcon, Camera
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ createdCount: 0, savedCount: 0 });
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/profile');
      if (!res.ok) throw new Error('Failed to load profile.');
      const data = await res.json();
      setProfile(data.user);
      setStats(data.stats);
      setName(data.user?.name || '');
      setPhotoURL(data.user?.photoURL || data.user?.image || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Name Required',
        text: 'Display name cannot be blank.',
        background: '#0f172a',
        color: '#fff',
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          photoURL: photoURL.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Profile update failed.');

      setProfile(data.user);

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your changes have been saved.',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Update Error',
        text: err.message || 'Failed to update profile.',
        background: '#0f172a',
        color: '#fff',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent" />
      </div>
    );
  }

  const isPremium = profile?.isPremium || session?.user?.isPremium;
  const role = profile?.role || session?.user?.role || 'user';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-7 w-7 text-indigo-500" />
          <span>My Profile & Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your author persona, update avatar, and view your platform impact.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group">
          <img
            src={photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={name}
            className="h-28 w-28 rounded-full object-cover border-4 border-indigo-100 dark:border-slate-800 shadow-lg"
          />
          {isPremium && (
            <div className="absolute bottom-0 right-0 p-1.5 bg-amber-500 rounded-full text-slate-950 shadow" title="Premium Subscriber">
              <Sparkles className="h-4 w-4 fill-current" />
            </div>
          )}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{profile?.name || session?.user?.name}</h2>
            {role === 'admin' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Admin
              </span>
            )}
            {isPremium ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                <Sparkles className="h-3 w-3 fill-current" /> Premium Lifetime
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                Free Tier
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="h-3.5 w-3.5" />
            <span>{profile?.email || session?.user?.email}</span>
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 text-xs">
            <div className="text-center sm:text-left">
              <p className="font-extrabold text-slate-900 dark:text-white text-base">{stats.createdCount}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Lessons Authored</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-extrabold text-slate-900 dark:text-white text-base">{stats.savedCount}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Saved Lessons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleUpdateProfile} className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile Details</h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Avatar / Photo URL</label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address (Read-only)</label>
            <input
              type="email"
              value={profile?.email || session?.user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400">Email is tied to your login account and cannot be changed.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Update Profile'}</span>
          </button>
        </div>
      </form>

    </div>
  );
}
