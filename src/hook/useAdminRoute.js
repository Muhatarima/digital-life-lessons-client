import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "@/lib/auth-client";

export function useAdminRoute() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (session.user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [isPending, session, router]);

  return { session, isPending };
}