import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useProtectedRoute } from "@/hook/useProtectedRoute";

const categories = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function MyFavorites() {
  const { session, isPending } = useProtectedRoute();
  const [favoriteLessons, setFavoriteLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [toneFilter, setToneFilter] = useState("");

  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
  const user = session?.user;

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const favRes = await axios.get(`${SERVER}/api/favorites/${user.id}`);
      const lessonIds = favRes.data.map((f) => f.lessonId);

      const allLessonsRes = await axios.get(`${SERVER}/api/lessons`);
      const matched = allLessonsRes.data.filter((l) =>
        lessonIds.includes(l._id)
      );
      setFavoriteLessons(matched);
    } catch (err) {
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (lessonId) => {
    try {
      await axios.delete(`${SERVER}/api/favorites/${user.id}/${lessonId}`);
      setFavoriteLessons((prev) => prev.filter((l) => l._id !== lessonId));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const filtered = favoriteLessons.filter((l) => {
    const matchCategory = categoryFilter ? l.category === categoryFilter : true;
    const matchTone = toneFilter ? l.emotionalTone === toneFilter : true;
    return matchCategory && matchTone;
  });

  if (isPending) return <p className="text-center py-20">Loading...</p>;
  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

      <div className="flex gap-3 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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
          value={toneFilter}
          onChange={(e) => setToneFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Tones</option>
          {tones.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading favorites...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No favorite lessons found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Tone</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lesson) => (
                <tr key={lesson._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{lesson.title}</td>
                  <td className="px-4 py-3">{lesson.category}</td>
                  <td className="px-4 py-3">{lesson.emotionalTone}</td>
                  <td className="px-4 py-3">{lesson.creatorName}</td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <Link
                      href={`/lessons/${lesson._id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleRemove(lesson._id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}