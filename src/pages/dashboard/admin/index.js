import { useState, useEffect } from "react";
import axios from "axios";
import { useAdminRoute } from "@/hook/useAdminRoute";

export default function AdminDashboard() {
  const { session, isPending } = useAdminRoute();
  const [stats, setStats] = useState(null);
  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (session?.user?.role === "admin") fetchStats();
  }, [session]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${SERVER}/api/admin/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (isPending || !session?.user) return <p className="text-center py-20">Loading...</p>;
  if (session.user.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">Total Public Lessons</p>
            <p className="text-3xl font-bold">{stats.totalLessons}</p>
          </div>
          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">Reported Lessons</p>
            <p className="text-3xl font-bold">{stats.totalReported}</p>
          </div>
          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">Today's New Lessons</p>
            <p className="text-3xl font-bold">{stats.todayLessons}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/dashboard/admin/manage-users" className="border rounded-xl p-5 hover:shadow-md transition">
          <p className="font-semibold">Manage Users</p>
          <p className="text-sm text-gray-500">View, promote, or remove users</p>
        </a>
        <a href="/dashboard/admin/manage-lessons" className="border rounded-xl p-5 hover:shadow-md transition">
          <p className="font-semibold">Manage Lessons</p>
          <p className="text-sm text-gray-500">Feature, review, or delete lessons</p>
        </a>
        <a href="/dashboard/admin/reported-lessons" className="border rounded-xl p-5 hover:shadow-md transition">
          <p className="font-semibold">Reported Lessons</p>
          <p className="text-sm text-gray-500">Review flagged content</p>
        </a>
      </div>
    </div>
  );
}