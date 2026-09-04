import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions - Digital Life Lessons',
  description: 'Terms of service and content guidelines for Digital Life Lessons platform.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-500 transition">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Legal Agreements</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-400">Last updated: September 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Digital Life Lessons, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please discontinue use of the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Content Guidelines & Moderation</h2>
          <p>
            Users are encouraged to document and share genuine life experiences, reflections, and insights. You may not post content that is defamatory, hateful, abusive, promotional spam, or in violation of any applicable intellectual property laws. Content flagged by users will be investigated and may be removed by administrators at our discretion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Premium Subscriptions & Billing</h2>
          <p>
            Premium lifetime membership is provided upon completion of a one-time fee of ৳1500 through our authorized payment gateway (Stripe). Premium memberships are non-transferable and confer access to locked lessons and author publishing privileges.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Intellectual Property</h2>
          <p>
            You retain ownership of the original text and insights you publish on Digital Life Lessons. By publishing publicly, you grant Digital Life Lessons a non-exclusive license to display, index, and distribute your content across our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
          <p>
            The life lessons, advice, and reflections shared on this platform are personal opinions of community members and do not constitute certified psychological, medical, legal, or financial counsel.
          </p>
        </section>
      </div>
    </div>
  );
}
