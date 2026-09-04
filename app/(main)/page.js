'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Award, Heart, Eye, ArrowRight, BookOpen, ShieldAlert, Sparkles, MessageCircle, Star, Calendar, Bookmark
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function HomePage() {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [mostSavedLessons, setMostSavedLessons] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingContributors, setLoadingContributors] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const sliderSlides = [
    {
      title: 'Preserve Your Life Wisdom',
      description: 'Document your personal growth, career insights, and valuable life lessons. Keep them private for self-reflection or share them to inspire others.',
      bg: 'from-indigo-600 to-indigo-900',
      ctaText: 'Share Your Story',
      ctaLink: '/dashboard/add-lesson',
    },
    {
      title: 'Learn from the Community',
      description: 'Browse life insights on Career, Relationships, Mistakes Learned, and Personal Growth. Avoid common pitfalls by reading community stories.',
      bg: 'from-purple-600 to-purple-900',
      ctaText: 'Explore Lessons',
      ctaLink: '/lessons',
    },
    {
      title: 'Upgrade to Unlock Premium Insights',
      description: 'Get lifetime access to premium life wisdom curated by top contributors and industry leaders for a one-time subscription of just ৳1500.',
      bg: 'from-amber-600 to-amber-900',
      ctaText: 'Upgrade Now',
      ctaLink: '/pricing',
    }
  ];

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIndex((prevIndex) => (prevIndex + 1) % sliderSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all dynamic data from server
  useEffect(() => {
    // 1. Fetch Featured Lessons (we filter public reviewed lessons where isFeatured = true)
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        const featured = (data.lessons || []).filter(l => l.isFeatured);
        setFeaturedLessons(featured.slice(0, 3));
        setLoadingFeatured(false);
      })
      .catch(err => {
        console.error('Error fetching featured lessons:', err);
        setLoadingFeatured(false);
      });

    // 2. Fetch Top Contributors
    fetch('/api/users/top-contributors')
      .then(res => res.json())
      .then(data => {
        setTopContributors(Array.isArray(data) ? data : []);
        setLoadingContributors(false);
      })
      .catch(err => {
        console.error('Error fetching contributors:', err);
        setLoadingContributors(false);
      });

    // 3. Fetch Most Saved Lessons
    fetch('/api/lessons?sort=most_saved&limit=4')
      .then(res => res.json())
      .then(data => {
        setMostSavedLessons(data.lessons || []);
        setLoadingSaved(false);
      })
      .catch(err => {
        console.error('Error fetching most saved lessons:', err);
        setLoadingSaved(false);
      });
  }, []);

  // Framer Motion animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Banner / Slider */}
      <section className="relative overflow-hidden w-full h-[460px] md:h-[500px]">
        {sliderSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full flex items-center bg-gradient-to-r ${slide.bg} text-white transition-opacity duration-1000 ease-in-out px-4 sm:px-8 md:px-16 ${
              idx === sliderIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight select-none">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-indigo-100/90 leading-relaxed select-none max-w-2xl">
                {slide.description}
              </p>
              <div className="pt-4 flex gap-4">
                <Link
                  href={slide.ctaLink}
                  className="rounded-full bg-white text-indigo-900 px-6 py-3 font-bold hover:bg-indigo-50 shadow-lg transform transition hover:scale-105"
                >
                  {slide.ctaText}
                </Link>
                <Link
                  href="/lessons"
                  className="rounded-full bg-indigo-800/40 border border-indigo-400/30 text-white px-6 py-3 font-semibold hover:bg-indigo-800/60 transition"
                >
                  Browse Wisdom
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {sliderSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSliderIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === sliderIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Featured Life Lessons (Dynamic) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              <span>Featured Life Lessons</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Hand-picked stories and insights curated by our editorial team.
            </p>
          </div>
          <Link href="/lessons" className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : featuredLessons.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">No lessons have been marked as featured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 shadow-md hover:shadow-xl dark:shadow-slate-950/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      {lesson.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-amber-500" /> Featured
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-500 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6">
                    {lesson.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/80 pt-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={lesson.creator?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                      alt={lesson.creator?.name || 'Creator'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium">{lesson.creator?.name || 'Anonymous'}</span>
                  </div>
                  <Link
                    href={`/lessons/${lesson._id}`}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Why Learning From Life Matters (Static with Motion Animation) */}
      <section className="bg-slate-100 dark:bg-slate-900/30 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Why Learning From Life Matters
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Wisdom is earned through experiences. Writing and reviewing lessons shapes our future decisions.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
                title: 'Prevent Memory Decay',
                desc: 'People often learn valuable lessons but forget them over time. Putting insights into writing preserves your personal history.'
              },
              {
                icon: <Award className="h-8 w-8 text-amber-500" />,
                title: 'Accelerate Personal Growth',
                desc: 'Reflecting on achievements, setbacks, and relational dynamics provides clear milestones for continuous self-improvement.'
              },
              {
                icon: <Heart className="h-8 w-8 text-rose-500" />,
                title: 'Empower Your Community',
                desc: 'Sharing your hard-earned insights publicly lights the path for other people navigating similar hardships.'
              },
              {
                icon: <ShieldAlert className="h-8 w-8 text-teal-500" />,
                title: 'Encourage Mindful Reflection',
                desc: 'Mindfully mapping your emotional tone and categories trains you to respond rather than react to lifes ups and downs.'
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition duration-300"
                variants={itemVariants}
              >
                <div className="p-3 bg-slate-50 dark:bg-slate-800 w-fit rounded-xl mb-4">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{card.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Two Extra Dynamic Sections (Top Contributors + Most Saved) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Contributors of the Week */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-500" />
                <span>Top Contributors</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Creators who shared the most wisdom recently.</p>
            </div>

            {loadingContributors ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                ))}
              </div>
            ) : topContributors.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500">No contributors yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topContributors.map((c, index) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-500/30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative font-bold text-sm text-slate-400 w-5">
                        #{index + 1}
                      </div>
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                      />
                      <div>
                        <h4 className="font-semibold text-sm flex items-center gap-1">
                          {c.name}
                          {c.isPremium && <span className="text-amber-500 text-xs">⭐</span>}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{c.lessonsCount} lessons created</p>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/profile`} // or a public profile URL, let's link dashboard/profile or users/id
                      className="text-xs font-semibold text-indigo-500 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Saved Lessons */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-amber-500" />
                <span>Most Saved Wisdom</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Lessons with the highest saves and favorite count.</p>
            </div>

            {loadingSaved ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                ))}
              </div>
            ) : mostSavedLessons.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500">No lessons saved yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mostSavedLessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="group flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all duration-200"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider">
                          {lesson.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-rose-500 font-semibold">
                          <Heart className="h-3 w-3 fill-current" />
                          <span>{lesson.likesCount || 0} saves</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors line-clamp-1">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                        {lesson.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800/80">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        By {lesson.creator?.name || 'Anonymous'}
                      </span>
                      <Link
                        href={`/lessons/${lesson._id}`}
                        className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:underline"
                      >
                        Read <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </section>
    </div>
  );
}
