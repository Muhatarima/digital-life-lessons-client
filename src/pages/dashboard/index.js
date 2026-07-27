import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@heroui/react";
import { useProtectedRoute } from "@/hook/useProtectedRoute";

export default function DashboardHome() {
  const { session, isPending } = useProtectedRoute();
  const [lessons, setLessons] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
  const user = session?.user;

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lessonsRes, statsRes] = await Promise.all([
        axios.get(`${SERVER}/api/lessons/my/${user.email}`),
        axios.get(`${SERVER}/api/users/stats/${user.id}`),
      ]);
      setLessons(lessonsRes.data);
      setFavoritesCount(statsRes.data.favoritesSaved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading)
    return <p className="text-center py-20">Loading...</p>;
  if (!user) return null;

  const recent = [...lessons]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Simple weekly activity chart (last 7 days count)
  const today = new Date();
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const count = lessons.filter((l) => {
      const created = new Date(l.createdAt);
      return created.toDateString() === d.toDateString();
    }).length;
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    };
  });
  const maxCount = Math.max(...weekData.map((d) => d.count), 1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name}</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Lessons Created</p>
          <p className="text-3xl font-bold">{lessons.length}</p>
        </div>
        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Saved (Favorites)</p>
          <p className="text-3xl font-bold">{favoritesCount}</p>
        </div>
        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Account Type</p>
          <p className="text-3xl font-bold">
            {user.isPremium ? "Premium ⭐" : "Free"}
          </p>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/dashboard/add-lesson">
          <Button color="primary">+ Add Lesson</Button>
        </Link>
        <Link href="/dashboard/my-lessons">
          <Button variant="bordered">My Lessons</Button>
        </Link>
        <Link href="/dashboard/my-favorites">
          <Button variant="bordered">My Favorites</Button>
        </Link>
        {!user.isPremium && (
          <Link href="/pricing">
            <Button variant="bordered" color="warning">
              Upgrade to Premium
            </Button>
          </Link>
        )}
      </div>

      {/* Simple weekly chart */}
      <div className="border rounded-xl p-6 mb-10">
        <h2 className="font-semibold mb-4">Lessons Created This Week</h2>
        <div className="flex items-end gap-3 h-32">
          {weekData.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-purple-500 rounded-t-md transition-all"
                style={{
                  height: `${(d.count / maxCount) * 100}%`,
                  minHeight: d.count > 0 ? "8px" : "2px",
                }}
              />
              <span className="text-xs text-gray-500 mt-2">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent lessons */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recently Added Lessons</h2>
        {recent.length === 0 ? (
          <p className="text-gray-500">No lessons yet.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((lesson) => (
              <Link
                key={lesson._id}
                href={`/lessons/${lesson._id}`}
                className="block border rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-xs text-gray-500">
                      {lesson.category} · {lesson.visibility}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}