'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '../../lib/auth-client.js';
import { 
  BookOpen, LayoutDashboard, PlusCircle, BookMarked, Bookmark, 
  User, Shield, Users, FileText, AlertTriangle, Sun, Moon, 
  LogOut, Menu, X, ArrowLeft, Sparkles, ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [theme, setTheme] = useState('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  // Route protection
  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [session, isPending, pathname, router]);

  const handleLogout = async () => {
    await authClient.signOut();
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been logged out successfully.',
      timer: 1500,
      showConfirmButton: false,
      background: theme === 'dark' ? '#0f172a' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
    });
    router.push('/');
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = session.user?.role || 'user';
  const isPremium = !!session.user?.isPremium;

  const userNav = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Lesson', href: '/dashboard/add-lesson', icon: PlusCircle },
    { name: 'My Lessons', href: '/dashboard/my-lessons', icon: BookMarked },
    { name: 'Saved Lessons', href: '/dashboard/saved-lessons', icon: Bookmark },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Admin Analytics', href: '/dashboard/admin', icon: Shield },
    { name: 'Manage Users', href: '/dashboard/admin/manage-users', icon: Users },
    { name: 'Manage Lessons', href: '/dashboard/admin/manage-lessons', icon: FileText },
    { name: 'Reported Lessons', href: '/dashboard/admin/reports', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Mobile Topbar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo-600 dark:text-indigo-400">
          <BookOpen className="h-5 w-5" />
          <span>Life Lessons</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-6 w-6" />
              <span>Digital Lessons</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info card in sidebar */}
          <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <img
              src={session.user.image || session.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
              alt={session.user.name}
              className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="overflow-hidden flex-grow">
              <p className="font-bold text-xs truncate flex items-center gap-1 text-slate-900 dark:text-white">
                {session.user.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {userRole === 'admin' ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    Admin
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
                    Member
                  </span>
                )}
                {isPremium && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-0.5">
                    <Sparkles className="h-2 w-2 fill-current" /> Premium
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-6">
          {/* User Section */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Menu
            </p>
            {userNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-indigo-500 dark:hover:text-indigo-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Admin Section (if admin) */}
          {userRole === 'admin' && (
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="px-3 text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Admin Panel
              </p>
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 font-bold' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Upgrade Banner for Free Users */}
          {!isPremium && userRole !== 'admin' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                <span>Go Premium</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Unlock all premium lessons & post paid insights for only ৳1500 lifetime.
              </p>
              <Link
                href="/pricing"
                className="block text-center py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow"
              >
                Upgrade Now
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between px-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-500 font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Site</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

    </div>
  );
}
