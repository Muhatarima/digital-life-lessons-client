import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@heroui/react";
import { useProtectedRoute } from "@/hook/useProtectedRoute";

export default function MyLessons() {
  const { session, isPending } = useProtectedRoute();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
  const user = session?.user;

  useEffect(() => {
    if (user) fetchMyLessons();
  }, [user]);

  const fetchMyLessons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER}/api/lessons/my/${user.email}`);
      setLessons(res.data);
    } catch (err) {
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`${SERVER}/api/lessons/${id}`);
      toast.success("Lesson deleted");
      setLessons((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const toggleVisibility = async (lesson) => {
    const newVisibility =
      lesson.visibility === "Public" ? "Private" : "Public";
    try {
      await axios.patch(`${SERVER}/api/lessons/${lesson._id}`, {
        visibility: newVisibility,
      });
      setLessons((prev) =>
        prev.map((l) =>
          l._id === lesson._id ? { ...l, visibility: newVisibility } : l
        )
      );
      toast.success(`Lesson set to ${newVisibility}`);
    } catch (err) {
      toast.error("Failed to update visibility");
    }
  };

  if (isPending) return <p className="text-center py-20">Loading...</p>;
  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Lessons</h1>
        <Link href="/dashboard/add-lesson">
          <Button color="primary">+ Add New Lesson</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading your lessons...</p>
      ) : lessons.length === 0 ? (
        <p className="text-gray-500">
          You haven't created any lessons yet.{" "}
          <Link href="/dashboard/add-lesson" className="text-purple-700 underline">
            Create one now
          </Link>
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Favorites</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{lesson.title}</td>
                  <td className="px-4 py-3">{lesson.category}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleVisibility(lesson)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        lesson.visibility === "Public"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {lesson.visibility}
                    </button>
                  </td>
                  <td className="px-4 py-3">{lesson.accessLevel}</td>
                  <td className="px-4 py-3">{lesson.likesCount || 0}</td>
                  <td className="px-4 py-3">{lesson.favoritesCount || 0}</td>
                  <td className="px-4 py-3">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/lessons/${lesson._id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/dashboard/update-lesson/${lesson._id}`}
                      className="text-purple-600 hover:underline text-xs"
                    >
                      Update
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