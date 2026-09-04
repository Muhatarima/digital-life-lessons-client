'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '../../../../lib/auth-client.js';
import { 
  Users, Shield, Sparkles, Search, Trash2, ArrowLeft, 
  CheckCircle2, UserCheck, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function ManageUsersPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Admin route guard
  useEffect(() => {
    if (!isPending) {
      if (!session || session.user?.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [session, isPending, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users.');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [session]);

  // Update Role (User <-> Admin)
  const handleRoleChange = async (userId, newRole, userName) => {
    const result = await Swal.fire({
      title: `Change role to ${newRole}?`,
      text: `Are you sure you want to change ${userName}'s permissions to ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Yes, update role',
      background: '#0f172a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/users/${userId}/role`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        });

        if (!res.ok) throw new Error('Failed to update role.');

        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );

        Swal.fire({
          icon: 'success',
          title: 'Role Updated',
          text: `${userName} is now an ${newRole}.`,
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#fff',
        });
      } catch (err) {
        console.error(err);
        Swal.fire('Error updating user role.');
      }
    }
  };

  // Delete user account
  const handleDeleteUser = async (userId, userName) => {
    const result = await Swal.fire({
      title: 'Delete user account?',
      text: `This will permanently delete ${userName} and all lessons authored by them.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete permanently',
      background: '#0f172a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete user.');

        setUsers((prev) => prev.filter((u) => u.id !== userId));

        Swal.fire({
          icon: 'success',
          title: 'User Deleted',
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#fff',
        });
      } catch (err) {
        console.error(err);
        Swal.fire('Failed to delete user.');
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    return (
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/admin"
            className="text-xs font-semibold text-slate-500 hover:text-rose-500 flex items-center gap-1 mb-1 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Analytics
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-7 w-7 text-rose-500" />
            <span>Manage User Accounts</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View registered community members, adjust administrative privileges, and monitor contributions.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-400">No users found matching your search.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Subscription</th>
                  <th className="py-3.5 px-4">Lessons Created</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-slate-400 text-[11px]">{u.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      {u.role === 'admin' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {u.isPremium ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 w-fit">
                          <Sparkles className="h-3 w-3 fill-current" /> Premium
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Free</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {u.lessonsCount || 0}
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role === 'admin' ? (
                          <button
                            onClick={() => handleRoleChange(u.id, 'user', u.name)}
                            disabled={u.id === session?.user?.id}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition disabled:opacity-40"
                            title="Demote to User"
                          >
                            Demote
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(u.id, 'admin', u.name)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-[11px] font-bold transition"
                            title="Promote to Admin"
                          >
                            Make Admin
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={u.id === session?.user?.id}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition disabled:opacity-40"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
