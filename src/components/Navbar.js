import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <nav className="w-full border-b bg-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-purple-700">
        Digital Life Lessons
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/public-lessons">Public Lessons</Link>

        {user && (
          <>
            <Link href="/dashboard/add-lesson">Add Lesson</Link>
            <Link href="/dashboard/my-lessons">My Lessons</Link>
            {!user.isPremium && <Link href="/pricing">Pricing</Link>}
          </>
        )}

        {!isPending && !user && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}

        {user && (
          <div className="relative group">
            <img
              src={user.image || "/default-avatar.png"}
              alt={user.name}
              className="w-9 h-9 rounded-full cursor-pointer object-cover"
            />
            <div className="absolute right-0 top-10 hidden group-hover:block bg-white shadow-md rounded-md py-2 w-48 z-50">
              <p className="px-4 py-2 text-sm font-medium border-b">
                {user.name}
              </p>
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}