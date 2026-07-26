
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { Button, Input, TextArea } from "@heroui/react";import { useProtectedRoute } from "@/hook/useProtectedRoute";

const categories = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function AddLesson() {
  const { session, isPending } = useProtectedRoute();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    image: "",
    visibility: "Public",
  });
  const [loading, setLoading] = useState(false);

  if (isPending) return <p className="text-center py-20">Loading...</p>;
  if (!session?.user) return null;

  const user = session.user;
  const isPremiumUser = user.isPremium;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category || !form.emotionalTone) {
      toast.error("Please select category and emotional tone");
      return;
    }

    setLoading(true);
    try {
      const lessonData = {
        ...form,
        accessLevel: "Free",
        creatorId: user.id,
        creatorName: user.name,
        creatorEmail: user.email,
        creatorImage: user.image || "",
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons`,
        lessonData
      );

      toast.success("Lesson created successfully!");
      router.push("/dashboard/my-lessons");
    } catch (err) {
      toast.error("Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Add a Life Lesson</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Lesson Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          isRequired
        />

        <TextArea
          label="Full Description / Story / Insight"
          name="description"
          value={form.description}
          onChange={handleChange}
          minRows={5}
          isRequired
        />

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2.5 bg-white"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Emotional Tone
          </label>
          <select
            name="emotionalTone"
            value={form.emotionalTone}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2.5 bg-white"
          >
            <option value="">Select emotional tone</option>
            {tones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Image URL (optional)"
          name="image"
          value={form.image}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            Access Level
          </label>
          <select
            disabled={!isPremiumUser}
            value="Free"
            className="w-full border rounded-lg p-2.5 bg-gray-100 text-gray-500"
          >
            <option value="Free">Free</option>
          </select>
          {!isPremiumUser && (
            <p className="text-xs text-gray-400 mt-1">
              Upgrade to Premium to create paid lessons
            </p>
          )}
        </div>

        <Button type="submit" color="primary" fullWidth isLoading={loading}>
          Publish Lesson
        </Button>
      </form>
    </div>
  );
}