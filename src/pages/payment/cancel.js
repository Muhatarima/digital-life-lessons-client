import Link from "next/link";
import { Button } from "@heroui/react";

export default function PaymentCancel() {
  return (
    <div className="max-w-xl mx-auto text-center py-24 px-4">
      <span className="text-4xl mb-4 block">❌</span>
      <h1 className="text-2xl font-bold mb-2">Payment Canceled</h1>
      <p className="text-gray-500 mb-6">
        Your payment was canceled. No charges were made.
      </p>
      <Link href="/pricing">
        <Button color="primary">Try Again</Button>
      </Link>
    </div>
  );
}