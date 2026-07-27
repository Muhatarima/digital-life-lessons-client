import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { Button, Input, TextArea } from "@heroui/react";
import { useProtectedRoute } from "@/hook/useProtectedRoute";

const categories = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function UpdateLesson() {
  const { session, isPending } = useProtectedRoute();
  const router = useRouter();
  const { id } = router.query;
  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`${SERVER}/api/lessons/${id}`);
        setForm(res.data);
      } catch (err) {
        toast.error("Failed to load lesson");
      } finally {
        setFetching(false);
      }
    };
    fetchLesson();
  }, [id]);

  if (isPending || fetching)
    return <p className="text-center py-20">Loading...</p>;
  if (!session?.user) return null;
  if (!form) return <p className="text-center py-20">Lesson not found.</p>;

  const user = session.user;
  const isPremiumUser = user.isPremium;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`${SERVER}/api/lessons/${id}`, {
        title: form.title,
        description: form.description,
        category: form.category,
        emotionalTone: form.emotionalTone,
        image: form.image,
        accessLevel: form.accessLevel,
      });
      toast.success("Lesson updated!");
      router.push("/dashboard/my-lessons");
    } catch (err) {
      toast.error("Failed to update lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Update Lesson</h1>
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
            className="w-full border rounded-lg p-2.5 bg-white"
          >
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
            className="w-full border rounded-lg p-2.5 bg-white"
          >
            {tones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Image URL"
          name="image"
          value={form.image}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            Access Level
          </label>
          <select
            name="accessLevel"
            value={form.accessLevel}
            onChange={handleChange}
            disabled={!isPremiumUser}
            className="w-full border rounded-lg p-2.5 bg-white disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="Free">Free</option>
            {isPremiumUser && <option value="Premium">Premium</option>}
          </select>
        </div>

        <Button type="submit" color="primary" fullWidth isLoading={loading}>
          Update Lesson
        </Button>
      </form>
    </div>
  );
}