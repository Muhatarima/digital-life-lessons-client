import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminRoute } from "@/hook/useAdminRoute";

export default function ManageLessons() {
  const { session, isPending } = useAdminRoute();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");
  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (session?.user?.role === "admin") fetchLessons();
  }, [session]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER}/api/admin/lessons`);
      setLessons(res.data);
    } catch (err) {
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this lesson permanently?")) return;
    try {
      await axios.delete(`${SERVER}/api/lessons/${id}`);
      setLessons((prev) => prev.filter((l) => l._id !== id));
      toast.success("Lesson deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const toggleFeatured = async (lesson) => {
    try {
      await axios.patch(`${SERVER}/api/admin/lessons/${lesson._id}/feature`, {
        isFeatured: !lesson.isFeatured,
      });
      setLessons((prev) =>
        prev.map((l) =>
          l._id === lesson._id ? { ...l, isFeatured: !l.isFeatured } : l
        )
      );
      toast.success(
        lesson.isFeatured ? "Removed from featured" : "Marked as featured"
      );
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const markReviewed = async (id) => {
    try {
      await axios.patch(`${SERVER}/api/admin/lessons/${id}/review`);
      setLessons((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isReviewed: true } : l))
      );
      toast.success("Marked as reviewed");
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const filtered = lessons.filter((l) => {
    const matchCategory = categoryFilter ? l.category === categoryFilter : true;
    const matchVisibility = visibilityFilter
      ? l.visibility === visibilityFilter
      : true;
    return matchCategory && matchVisibility;
  });

  const publicCount = lessons.filter((l) => l.visibility === "Public").length;
  const privateCount = lessons.filter((l) => l.visibility === "Private").length;

  if (isPending || !session?.user) return <p className="text-center py-20">Loading...</p>;
  if (session.user.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Lessons</h1>

      <div className="flex gap-4 mb-6 text-sm text-gray-600">
        <span>Public: {publicCount}</span>
        <span>Private: {privateCount}</span>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          value={visibilityFilter}
          onChange={(e) => setVisibilityFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Visibility</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
      </div>

      {loading ? (
        <p>Loading lessons...</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Reviewed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lesson) => (
                <tr key={lesson._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{lesson.title}</td>
                  <td className="px-4 py-3">{lesson.creatorName}</td>
                  <td className="px-4 py-3">{lesson.visibility}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(lesson)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        lesson.isFeatured
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lesson.isFeatured ? "Featured" : "Not Featured"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {lesson.isReviewed ? (
                      <span className="text-green-600 text-xs">Reviewed</span>
                    ) : (
                      <button
                        onClick={() => markReviewed(lesson._id)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Mark Reviewed
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <Link
                      href={`/lessons/${lesson._id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(lesson._id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
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