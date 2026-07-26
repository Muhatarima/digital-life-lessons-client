import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "@/lib/auth-client";

export function useProtectedRoute() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  return { session, isPending };
}