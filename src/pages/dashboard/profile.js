import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { Button, Input } from "@heroui/react";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const { session, isPending } = useProtectedRoute();
  const [stats, setStats] = useState({ lessonsCreated: 0, favoritesSaved: 0 });
  const [myLessons, setMyLessons] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
  const user = session?.user;

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
      fetchStats();
      fetchMyPublicLessons();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${SERVER}/api/users/stats/${user.id}`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyPublicLessons = async () => {
    try {
      const res = await axios.get(`${SERVER}/api/lessons/my/${user.email}`);
      const publicOnes = res.data
        .filter((l) => l.visibility === "Public")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMyLessons(publicOnes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await authClient.updateUser({ name, image });
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) return <p className="text-center py-20">Loading...</p>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="border rounded-xl p-6 mb-10 flex flex-col md:flex-row gap-6 items-start">
        <img
          src={user.image || "/default-avatar.png"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div className="flex-1">
          {editing ? (
            <div className="space-y-3 max-w-sm">
              <Input
                label="Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Photo URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <div className="flex gap-2">
                <Button color="primary" isLoading={saving} onPress={handleSave}>
                  Save
                </Button>
                <Button variant="bordered" onPress={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.isPremium && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    Premium ⭐
                  </span>
                )}
              </div>
              <p className="text-gray-500 mb-4">{user.email}</p>

              <div className="flex gap-6 text-sm text-gray-600 mb-4">
                <span>{stats.lessonsCreated} Lessons Created</span>
                <span>{stats.favoritesSaved} Lessons Saved</span>
              </div>

              <Button variant="bordered" onPress={() => setEditing(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Public Lessons</h2>
      {myLessons.length === 0 ? (
        <p className="text-gray-500">No public lessons yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myLessons.map((lesson) => (
            <Link
              key={lesson._id}
              href={`/lessons/${lesson._id}`}
              className="border rounded-xl p-4 hover:shadow-md transition"
            >
              <h3 className="font-semibold mb-1">{lesson.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                {lesson.description}
              </p>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {lesson.category}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}