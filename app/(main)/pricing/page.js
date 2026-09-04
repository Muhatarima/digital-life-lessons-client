'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '../../../lib/auth-client.js';
import { 
  Check, Sparkles, Shield, Zap, BookOpen, Heart, 
  HelpCircle, ArrowRight, Lock
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function PricingPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const isPremium = session?.user?.isPremium;

  const handleUpgrade = async () => {
    if (!session) {
      Swal.fire({
        icon: 'info',
        title: 'Sign In Required',
        text: 'Please log in or register before upgrading to Premium.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#4f46e5',
      });
      router.push('/login?redirect=/pricing');
      return;
    }

    if (isPremium) {
      Swal.fire({
        icon: 'info',
        title: 'Already Premium!',
        text: 'You already have lifetime premium access to Digital Life Lessons.',
        background: '#0f172a',
        color: '#fff',
      });
      return;
    }

    setLoadingCheckout(true);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.message || 'Unable to create Stripe checkout session.');
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Checkout Error',
        text: err.message || 'Payment service is temporarily unreachable.',
        background: '#0f172a',
        color: '#fff',
      });
      setLoadingCheckout(false);
    }
  };

  const freeFeatures = [
    'Browse standard public life lessons',
    'Record and organize unlimited personal lessons',
    'Toggle visibility between public and private',
    'Like and bookmark community wisdom',
    'Basic community support',
  ];

  const premiumFeatures = [
    'Everything in Free Tier included',
    'Read ALL locked premium lessons by top authors',
    'Publish and monetize premium-tier lessons',
    'Verified Premium Member Star Badge (⭐)',
    'Export your saved lessons archive to PDF',
    'Priority editorial review and featuring',
    'One-time fee — lifetime access, never pay again',
  ];

  const faqs = [
    {
      q: 'Is this a monthly subscription?',
      a: 'No! The ৳1500 payment gives you lifetime access. There are no recurring fees or renewals.'
    },
    {
      q: 'Can I publish premium lessons after upgrading?',
      a: 'Yes! As a Premium subscriber, you have full rights to mark your authored lessons as Premium so only dedicated readers can view them.'
    },
    {
      q: 'What payment methods are supported?',
      a: 'All major debit and credit cards (Visa, MasterCard, American Express) are securely handled through Stripe.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
          Lifetime Membership
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Invest in Timeless Wisdom
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Unlock the full archive of curated life reflections, mistakes learned, and career guidelines for a one-time payment.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Free Plan */}
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Explorer</h3>
              <p className="text-xs text-slate-500">Perfect for reading free stories and recording personal reflections.</p>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">৳0</span>
              <span className="text-xs text-slate-400"> / forever</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/register"
            className="w-full text-center py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Get Started Free
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="relative p-8 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 rounded-3xl border-2 border-amber-500 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="absolute -top-3.5 right-8 px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded-full uppercase tracking-wider shadow">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                <Sparkles className="h-4 w-4 fill-current" />
                <span>Lifetime Access</span>
              </div>
              <h3 className="text-xl font-bold text-white">Premium Supporter</h3>
              <p className="text-xs text-slate-400">Unrestricted access to every piece of wisdom and exclusive perks.</p>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-extrabold text-white">৳1,500</span>
              <span className="text-xs text-amber-400/90 font-medium"> / one-time</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              {premiumFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-200">
                  <Check className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loadingCheckout || isPremium}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {isPremium ? (
              'You Are Already Premium'
            ) : loadingCheckout ? (
              'Preparing Stripe Checkout...'
            ) : (
              'Upgrade to Premium (৳1500)'
            )}
          </button>
        </div>

      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about the lifetime upgrade.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
