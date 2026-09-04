import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Digital Life Lessons',
  description: 'Privacy and data protection policy for Digital Life Lessons users.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-500 transition">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Lock className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Privacy & Trust</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Last updated: September 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            We collect personal information that you provide when registering an account, such as your display name, email address, and optional avatar URL. We also store the life lessons, comments, and favorites you create.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Private Lessons Guarantee</h2>
          <p>
            Any life lesson marked with "Private" visibility is accessible only to your authenticated account. Private lessons are excluded from public search results, feeds, and APIs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Payment Information Security</h2>
          <p>
            We never store your raw credit card numbers or billing CVVs. All transactions are securely processed using Stripe, a certified PCI Service Provider Level 1.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Cookies and Session Storage</h2>
          <p>
            We use secure HTTP-only cookies and local browser storage to keep you logged in and preserve your preferred theme (dark/light mode).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Account Deletion and Data Portability</h2>
          <p>
            You have the right to request deletion of your account and personal data at any time by contacting our support team or through administrative moderation.
          </p>
        </section>
      </div>
    </div>
  );
}
