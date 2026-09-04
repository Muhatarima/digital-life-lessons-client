'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '../../lib/auth-client.js';
import { 
  Sun, Moon, Menu, X, PlusCircle, BookOpen, Heart, User as UserIcon, LogOut, LayoutDashboard, Award, Shield, Mail
} from 'lucide-react';
import Swal from 'sweetalert2';

const XIcon = () => (
  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function MainLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync theme with localStorage
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

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have logged out successfully.',
      timer: 1500,
      showConfirmButton: false,
      background: theme === 'dark' ? '#0f172a' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
    });
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Public Lessons', href: '/lessons' },
  ];

  // Protected / Conditional links
  const protectedLinks = [
    { name: 'Add Lesson', href: '/dashboard/add-lesson' },
    { name: 'My Lessons', href: '/dashboard/my-lessons' },
    { name: 'Saved Lessons', href: '/dashboard/saved-lessons' },
  ];

  const showPricing = session && !session.user?.isPremium;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Website Name */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-6 w-6" />
            <span>Digital Life Lessons</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-500 ${
                  pathname === link.href ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {session && protectedLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-500 ${
                  pathname === link.href ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {showPricing && (
              <Link
                href="/pricing"
                className={`text-sm font-medium flex items-center gap-1 transition-colors hover:text-indigo-500 ${
                  pathname === '/pricing' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Pricing / Upgrade
              </Link>
            )}
          </nav>

          {/* Header Controls (Theme, Auth, Mobile Menu) */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Authentication States */}
            {!isPending && (
              <>
                {session ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 focus:outline-none"
                    >
                      <img
                        src={session.user.image || session.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                        alt={session.user.name}
                        className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
                      />
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 text-slate-800 dark:text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                          <p className="font-semibold text-sm truncate flex items-center gap-1">
                            {session.user.name}
                            {session.user.isPremium && (
                              <span className="text-amber-500 text-xs" title="Premium User">⭐</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session.user.email}</p>
                        </div>

                        <Link
                          href="/dashboard/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <UserIcon className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          href={session.user.role === 'admin' ? '/dashboard/admin' : '/dashboard'}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors py-4 px-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.href ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {session && protectedLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.href ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {showPricing && (
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === '/pricing' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Pricing / Upgrade
              </Link>
            )}

            {!session && !isPending && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow transition-colors duration-300">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Branding */}
            <div className="space-y-4 col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
                <BookOpen className="h-6 w-6" />
                <span>Digital Life Lessons</span>
              </Link>
              <p className="text-sm max-w-sm">
                Preserving personal wisdom, sharing insights, and growing collectively through community-shared digital life lessons.
              </p>
              {/* Social Media Links (using new X logo) */}
              <div className="flex gap-4 pt-2 text-slate-500">
                <a href="https://facebook.com" className="hover:text-indigo-500 transition-colors" aria-label="Facebook">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h3v-9h3.3c.1 0 .2 0 .2-.1l.5-2.9c0-.1-.1-.2-.2-.2H12V7c0-.6.4-1 1-1h2V3h-3c-2.2 0-4 1.8-4 4v1z"/></svg>
                </a>
                <a href="https://x.com" className="hover:text-indigo-500 transition-colors" aria-label="X (formerly Twitter)">
                  <XIcon />
                </a>
                <a href="https://linkedin.com" className="hover:text-indigo-500 transition-colors" aria-label="LinkedIn">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wide uppercase">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link></li>
                <li><Link href="/lessons" className="hover:text-indigo-500 transition-colors">Browse Lessons</Link></li>
                <li><Link href="/pricing" className="hover:text-indigo-500 transition-colors">Upgrade / Pricing</Link></li>
              </ul>
            </div>

            {/* Contacts & T&C */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wide uppercase">Contact & Info</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@lifelessons.com</span>
                </li>
                <li><Link href="/terms" className="hover:text-indigo-500 transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Digital Life Lessons. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
