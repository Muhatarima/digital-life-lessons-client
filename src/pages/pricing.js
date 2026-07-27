import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@heroui/react";
import { useProtectedRoute } from "@/hook/useProtectedRoute";

const features = [
  { label: "Lessons you can create", free: "Unlimited (Free only)", premium: "Unlimited (Free + Premium)" },
  { label: "Premium lesson creation", free: "❌", premium: "✅" },
  { label: "Ad-free experience", free: "❌", premium: "✅" },
  { label: "Priority listing in public lessons", free: "❌", premium: "✅" },
  { label: "Access premium content from others", free: "❌", premium: "✅" },
  { label: "Community badge / verified status", free: "❌", premium: "✅" },
  { label: "Support", free: "Standard", premium: "Priority" },
];

export default function Pricing() {
  const { session, isPending } = useProtectedRoute();
  const [loading, setLoading] = useState(false);
  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
  const user = session?.user;

  if (isPending) return <p className="text-center py-20">Loading...</p>;
  if (!user) return null;

  if (user.isPremium) {
    return (
      <div className="max-w-xl mx-auto text-center py-24 px-4">
        <span className="text-4xl mb-4 block">⭐</span>
        <h1 className="text-2xl font-bold mb-2">You're already Premium!</h1>
        <p className="text-gray-500">
          Enjoy unlimited access to all premium lessons and features.
        </p>
      </div>
    );
  }

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${SERVER}/api/create-checkout-session`, {
        userId: user.id,
        email: user.email,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Failed to start checkout");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">
        Upgrade to Premium
      </h1>
      <p className="text-center text-gray-500 mb-10">
        One-time payment. Lifetime access.
      </p>

      <div className="overflow-x-auto border rounded-xl mb-8">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Feature</th>
              <th className="px-4 py-3 text-center">Free</th>
              <th className="px-4 py-3 text-center">Premium</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{f.label}</td>
                <td className="px-4 py-3 text-center">{f.free}</td>
                <td className="px-4 py-3 text-center font-medium">
                  {f.premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold mb-4">৳1500 <span className="text-base font-normal text-gray-500">/ lifetime</span></p>
        <Button
          color="primary"
          size="lg"
          isLoading={loading}
          onPress={handleUpgrade}
        >
          Choose Premium Plan
        </Button>
      </div>
    </div>
  );
}