import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@heroui/react";
import { useSession } from "@/lib/auth-client";

export default function LessonDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const user = session?.user;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [similar, setSimilar] = useState([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (!id) return;
    fetchLesson();
    fetchComments();
  }, [id]);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER}/api/lessons/${id}`);
      setLesson(res.data);
      fetchSimilar(res.data);

      if (user) {
        const favRes = await axios.get(`${SERVER}/api/favorites/${user.id}`);
        setIsFavorited(
          favRes.data.some((f) => f.lessonId === id)
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilar = async (currentLesson) => {
    try {
      const res = await axios.get(`${SERVER}/api/lessons`);
      const related = res.data
        .filter(
          (l) =>
            l._id !== currentLesson._id &&
            (l.category === currentLesson.category ||
              l.emotionalTone === currentLesson.emotionalTone)
        )
        .slice(0, 6);
      setSimilar(related);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${SERVER}/api/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like");
      return;
    }
    try {
      const res = await axios.patch(`${SERVER}/api/lessons/${id}/like`, {
        userId: user.id,
      });
      setLesson((prev) => ({
        ...prev,
        likes: res.data.liked
          ? [...(prev.likes || []), user.id]
          : prev.likes.filter((l) => l !== user.id),
        likesCount: res.data.liked
          ? (prev.likesCount || 0) + 1
          : (prev.likesCount || 0) - 1,
      }));
    } catch (err) {
      toast.error("Failed to like");
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please log in to save lessons");
      return;
    }
    try {
      if (isFavorited) {
        await axios.delete(`${SERVER}/api/favorites/${user.id}/${id}`);
        setIsFavorited(false);
        toast.success("Removed from favorites");
      } else {
        await axios.post(`${SERVER}/api/favorites`, {
          userId: user.id,
          lessonId: id,
        });
        setIsFavorited(true);
        toast.success("Saved to favorites");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    if (!commentText.trim()) return;

    try {
      await axios.post(`${SERVER}/api/comments`, {
        lessonId: id,
        userId: user.id,
        userName: user.name,
        userImage: user.image || "",
        text: commentText,
      });
      setCommentText("");
      fetchComments();
      toast.success("Comment posted");
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  const handleReport = async () => {
    if (!user) {
      toast.error("Please log in to report");
      return;
    }
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }
    try {
      await axios.post(`${SERVER}/api/reports`, {
        lessonId: id,
        reporterUserId: user.id,
        reportedUserEmail: user.email,
        reason: reportReason,
      });
      toast.success("Lesson reported");
      setReportOpen(false);
      setReportReason("");
    } catch (err) {
      toast.error("Failed to report");
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!lesson) return <p className="text-center py-20">Lesson not found.</p>;

  const isPremiumLocked =
    lesson.accessLevel === "Premium" && !user?.isPremium;

  if (isPremiumLocked) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 px-4">
        <span className="text-4xl mb-4 block">🔒</span>
        <h1 className="text-2xl font-bold mb-2">This is a Premium Lesson</h1>
        <p className="text-gray-500 mb-6">
          Upgrade to Premium to unlock this and other exclusive lessons.
        </p>
        <Link href="/pricing">
          <Button color="primary">Upgrade to Premium</Button>
        </Link>
      </div>
    );
  }

  const isLiked = user && lesson.likes?.includes(user.id);
  const views = Math.floor(Math.random() * 10000);
  const readingTime = Math.max(
    1,
    Math.round((lesson.description?.split(" ").length || 0) / 200)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {lesson.image && (
        <img
          src={lesson.image}
          alt={lesson.title}
          className="w-full h-72 object-cover rounded-xl mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
      <p className="text-gray-700 whitespace-pre-line mb-6">
        {lesson.description}
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          {lesson.category}
        </span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {lesson.emotionalTone}
        </span>
      </div>

      {/* Metadata */}
      <div className="border rounded-xl p-4 mb-6 text-sm text-gray-600 space-y-1">
        <p>Created: {new Date(lesson.createdAt).toLocaleDateString()}</p>
        <p>Last Updated: {new Date(lesson.updatedAt).toLocaleDateString()}</p>
        <p>Visibility: {lesson.visibility}</p>
        <p>Estimated Reading Time: {readingTime} min</p>
      </div>

      {/* Author */}
      <div className="border rounded-xl p-4 mb-6 flex items-center gap-4">
        <img
          src={lesson.creatorImage || "/default-avatar.png"}
          alt={lesson.creatorName}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold">{lesson.creatorName}</p>
          <Link
            href={`/dashboard/profile?user=${lesson.creatorId}`}
            className="text-sm text-purple-700 hover:underline"
          >
            View all lessons by this author
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-6 text-sm text-gray-600">
        <span>❤ {lesson.likesCount || 0} Likes</span>
        <span>🔖 {lesson.favoritesCount || 0} Favorites</span>
        <span>👀 {views} Views</span>
      </div>

      {/* Interaction buttons */}
      <div className="flex gap-3 mb-10 flex-wrap">
        <Button
          variant={isFavorited ? "solid" : "bordered"}
          color="secondary"
          onPress={handleFavorite}
        >
          🔖 {isFavorited ? "Saved" : "Save to Favorites"}
        </Button>
        <Button
          variant={isLiked ? "solid" : "bordered"}
          color="danger"
          onPress={handleLike}
        >
          ❤ {isLiked ? "Liked" : "Like"}
        </Button>
        <Button variant="bordered" onPress={() => setReportOpen(!reportOpen)}>
          🚩 Report
        </Button>
      </div>

      {reportOpen && (
        <div className="border rounded-xl p-4 mb-10 space-y-3">
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select a reason</option>
            <option value="Inappropriate content">
              Inappropriate content
            </option>
            <option value="Spam">Spam</option>
            <option value="Misinformation">Misinformation</option>
            <option value="Harassment">Harassment</option>
            <option value="Other">Other</option>
          </select>
          <Button color="danger" onPress={handleReport}>
            Submit Report
          </Button>
        </div>
      )}

      {/* Comments */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <Button type="submit" color="primary">
            Post
          </Button>
        </form>

        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-gray-400 text-sm">No comments yet.</p>
          )}
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3 border-b pb-3">
              <img
                src={c.userImage || "/default-avatar.png"}
                alt={c.userName}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">{c.userName}</p>
                <p className="text-sm text-gray-600">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar lessons */}
      {similar.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Similar Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {similar.map((l) => (
              <Link
                key={l._id}
                href={`/lessons/${l._id}`}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <p className="font-semibold">{l.title}</p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {l.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}