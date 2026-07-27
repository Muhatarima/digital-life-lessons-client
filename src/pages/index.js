import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Preserve the Lessons Life Teaches You",
    subtitle:
      "Capture your personal growth moments before they fade — build a living archive of wisdom.",
  },
  {
    title: "Learn From a Community of Real Experiences",
    subtitle:
      "Browse thousands of life lessons shared by people who've walked the path before you.",
  },
  {
    title: "Reflect, Grow, Repeat",
    subtitle:
      "Track your journey, save what resonates, and revisit your growth anytime.",
  },
];

const benefits = [
  {
    icon: "🧠",
    title: "Preserve Wisdom",
    desc: "Lessons learned are often forgotten — write them down before they fade.",
  },
  {
    icon: "🌱",
    title: "Mindful Reflection",
    desc: "Reflecting on past experiences helps you grow more intentionally.",
  },
  {
    icon: "🤝",
    title: "Community Learning",
    desc: "Learn from real stories shared by people navigating similar paths.",
  },
  {
    icon: "📈",
    title: "Track Your Growth",
    desc: "See how far you've come by revisiting your own journey over time.",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [mostSaved, setMostSaved] = useState([]);
  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [featuredRes, contributorsRes, savedRes] = await Promise.all([
        axios.get(`${SERVER}/api/home/featured`),
        axios.get(`${SERVER}/api/home/top-contributors`),
        axios.get(`${SERVER}/api/home/most-saved`),
      ]);
      setFeatured(featuredRes.data);
      setContributors(contributorsRes.data);
      setMostSaved(savedRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Hero Slider */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="h-[420px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="h-[420px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-purple-700 to-purple-900 text-white px-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl">
                {s.title}
              </h1>
              <p className="max-w-xl text-purple-100 mb-6">{s.subtitle}</p>
              <Link
                href="/public-lessons"
                className="bg-white text-purple-700 px-6 py-2 rounded-full font-medium hover:bg-purple-100 transition"
              >
                Explore Lessons
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Featured Lessons */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Featured Life Lessons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((lesson) => (
              <Link
                key={lesson._id}
                href={`/lessons/${lesson._id}`}
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="font-semibold mb-1">{lesson.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {lesson.description}
                </p>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {lesson.category}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why Learning From Life Matters — with animation */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center">
            Why Learning From Life Matters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white border rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      {contributors.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Top Contributors of the Week
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {contributors.map((c) => (
              <div key={c._id} className="text-center">
                <img
                  src={c.image || "/default-avatar.png"}
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                />
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-gray-500">
                  {c.lessonsCount} lessons
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Most Saved Lessons */}
      {mostSaved.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Most Saved Lessons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mostSaved.map((lesson) => (
                <Link
                  key={lesson._id}
                  href={`/lessons/${lesson._id}`}
                  className="bg-white border rounded-xl p-5 hover:shadow-md transition"
                >
                  <h3 className="font-semibold mb-1">{lesson.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {lesson.description}
                  </p>
                  <span className="text-xs text-gray-400">
                    🔖 {lesson.favoritesCount || 0} saves
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}