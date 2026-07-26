import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const categories = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

const PAGE_SIZE = 6;

export default function PublicLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons`
        );
        setLessons(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Filter
  let filtered = lessons.filter((l) => {
    const matchesSearch =
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? l.category === category : true;
    const matchesTone = tone ? l.emotionalTone === tone : true;
    return matchesSearch && matchesCategory && matchesTone;
  });

  // Sort
  if (sortBy === "newest") {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (sortBy === "mostSaved") {
    filtered = [...filtered].sort(
      (a, b) => (b.favoritesCount || 0) - (a.favoritesCount || 0)
    );
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Browse Life Lessons</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title or keyword..."
          value={search}
          onChange={handleFilterChange(setSearch)}
          className="border rounded-lg px-3 py-2 flex-1 min-w-[200px]"
        />

        <select
          value={category}
          onChange={handleFilterChange(setCategory)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={tone}
          onChange={handleFilterChange(setTone)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Tones</option>
          {tones.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={handleFilterChange(setSortBy)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="newest">Newest</option>
          <option value="mostSaved">Most Saved</option>
        </select>
      </div>

      {/* Cards */}
      {loading ? (
        <p className="text-center py-20">Loading lessons...</p>
      ) : paginated.length === 0 ? (
        <p className="text-center py-20 text-gray-500">No lessons found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((lesson) => {
            const isLocked = lesson.accessLevel === "Premium";
            return (
              <div
                key={lesson._id}
                className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition relative ${
                  isLocked ? "bg-gray-100" : "bg-white"
                }`}
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 p-4 text-center">
                    <span className="text-2xl mb-2">🔒</span>
                    <p className="font-semibold mb-2">Premium Lesson</p>
                    <Link
                      href="/pricing"
                      className="text-sm text-purple-700 underline"
                    >
                      Upgrade to view
                    </Link>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={lesson.creatorImage || "/default-avatar.png"}
                    alt={lesson.creatorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-600">
                    {lesson.creatorName}
                  </span>
                </div>

                <h2 className="font-bold text-lg mb-1">{lesson.title}</h2>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {lesson.description}
                </p>

                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {lesson.category}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {lesson.emotionalTone}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      lesson.accessLevel === "Premium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {lesson.accessLevel}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-3">
                  {new Date(lesson.createdAt).toLocaleDateString()}
                </p>

                <Link
                  href={`/lessons/${lesson._id}`}
                  className="text-purple-700 font-medium text-sm hover:underline"
                >
                  See Details →
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg border ${
                p === page
                  ? "bg-purple-700 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}