import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminRoute } from "@/hook/useAdminRoute";

export default function ManageUsers() {
  const { session, isPending } = useAdminRoute();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (session?.user?.role === "admin") fetchUsers();
  }, [session]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER}/api/admin/users`);
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await axios.patch(`${SERVER}/api/admin/users/${userId}/role`, {
        role: newRole,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Delete this user account permanently?")) return;
    try {
      await axios.delete(`${SERVER}/api/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  if (isPending || !session?.user) return <p className="text-center py-20">Loading...</p>;
  if (session.user.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Lessons Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u.lessonsCount}</td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => handlePromote(u.id, u.role)}
                      className="text-purple-600 hover:underline text-xs"
                    >
                      {u.role === "admin" ? "Demote" : "Promote to Admin"}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
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