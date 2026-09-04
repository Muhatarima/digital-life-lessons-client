'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
      <div className="animate-bounce text-9xl font-extrabold tracking-widest text-indigo-500">404</div>
      <div className="bg-amber-500 px-2 text-sm rounded rotate-12 absolute mb-24 font-semibold text-slate-950">
        Page Not Found
      </div>
      <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
        Oops! You seem lost in wisdom.
      </h1>
      <p className="mt-4 text-base text-slate-400 max-w-md">
        The life lesson you are seeking does not exist or has been archived. Let's get you back to the path of learning.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/25 transition duration-300 transform hover:scale-105"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
