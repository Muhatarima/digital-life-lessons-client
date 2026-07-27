import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [status, setStatus] = useState("verifying");
  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (!session_id) return;
    const verify = async () => {
      try {
        const res = await axios.get(
          `${SERVER}/api/verify-payment/${session_id}`
        );
        setStatus(res.data.success ? "success" : "failed");
      } catch (err) {
        setStatus("failed");
      }
    };
    verify();
  }, [session_id]);

  return (
    <div className="max-w-xl mx-auto text-center py-24 px-4">
      {status === "verifying" && <p>Verifying your payment...</p>}

      {status === "success" && (
        <>
          <span className="text-4xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-6">
            You're now a Premium member. Please log in again or refresh to
            see your updated status.
          </p>
          <Link href="/dashboard">
            <Button color="primary">Go to Dashboard</Button>
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <span className="text-4xl mb-4 block">⚠️</span>
          <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
          <p className="text-gray-500 mb-6">
            We couldn't verify your payment. Please contact support if you
            were charged.
          </p>
          <Link href="/pricing">
            <Button variant="bordered">Back to Pricing</Button>
          </Link>
        </>
      )}
    </div>
  );
}