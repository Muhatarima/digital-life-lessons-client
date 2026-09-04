'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '../../../../lib/auth-client.js';
import { 
  Heart, Bookmark, Flag, Share2, MessageSquare, Clock, Eye, Calendar, Sparkles, AlertTriangle, ArrowLeft, ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';

// Social sharing using react-share
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';

export default function LessonDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { data: session, isPending: authPending } = authClient.useSession();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);

  // Guard route: redirect to login if not logged in
  useEffect(() => {
    if (!authPending && !session) {
      Swal.fire({
        icon: 'info',
        title: 'Authentication Required',
        text: 'Please log in to view life lesson details.',
        timer: 2000,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
      router.push(`/login?redirect=/lessons/${id}`);
    }
  }, [session, authPending]);

  // Set a random views count once on mount
  useEffect(() => {
    setViewsCount(Math.floor(Math.random() * 8500) + 1200);
  }, []);

  const fetchDetails = () => {
    setLoading(true);
    fetch(`/api/lessons/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Lesson not found or access error.');
        return res.json();
      })
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to retrieve lesson details.',
          background: '#0f172a',
          color: '#fff',
        });
        router.push('/lessons');
      });
  };

  useEffect(() => {
    if (session) {
      fetchDetails();
    }
  }, [id, session]);

  // Calculate estimated reading time based on word count
  const calculateReadingTime = (text) => {
    if (!text) return '1 min read';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // 200 WPM average
    return `${minutes} min read`;
  };

  // Toggle Like
  const handleLikeToggle = async () => {
    if (!session) {
      Swal.fire('Please log in to like.');
      return;
    }
    try {
      const res = await fetch(`/api/lessons/${id}/like`, { method: 'POST' });
      const resData = await res.json();
      
      setData(prev => ({
        ...prev,
        lesson: {
          ...prev.lesson,
          likes: resData.likes,
          likesCount: resData.likesCount
        }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Favorite
  const handleFavoriteToggle = async () => {
    try {
      const res = await fetch(`/api/lessons/${id}/favorite`, { method: 'POST' });
      const resData = await res.json();
      
      setData(prev => ({
        ...prev,
        isFavorited: resData.favorited
      }));

      Swal.fire({
        icon: 'success',
        title: resData.favorited ? 'Added to Favorites!' : 'Removed from Favorites',
        toast: true,
        position: 'top-end',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Report Lesson (Reason popup)
  const handleReportLesson = async () => {
    const { value: reason } = await Swal.fire({
      title: 'Report Inappropriate Lesson',
      input: 'select',
      inputOptions: {
        spam: 'Spam / Advertising',
        harassment: 'Harassment or Abuse',
        inappropriate: 'Inappropriate Content',
        misinformation: 'Misinformation / Fake Wisdom',
        other: 'Other Reason'
      },
      inputPlaceholder: 'Select a reason for reporting',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Submit Report',
      background: '#0f172a',
      color: '#fff',
    });

    if (reason) {
      try {
        const res = await fetch(`/api/lessons/${id}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason })
        });
        const resData = await res.json();
        
        Swal.fire({
          icon: 'success',
          title: 'Report Submitted',
          text: resData.message,
          background: '#0f172a',
          color: '#fff',
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Post Comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/lessons/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText })
      });
      
      if (!res.ok) throw new Error('Comment failed.');
      
      setCommentText('');
      fetchDetails(); // Reload comments
    } catch (err) {
      console.error(err);
      Swal.fire('Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (authPending || loading || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent" />
      </div>
    );
  }

  const { lesson, creator, isFavorited, comments, similarLessons } = data;
  const isLiked = session && lesson.likes.includes(session.user.id);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back button */}
      <Link href="/lessons" className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-indigo-500 transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Lessons
      </Link>

      {/* Main Card */}
      <article className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 space-y-6">
        
        {/* Category, Date & Estimated Reading Time */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-400">
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg uppercase tracking-wider">
            {lesson.category}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(lesson.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {calculateReadingTime(lesson.description)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {lesson.title}
        </h1>

        {/* Featured Image if uploaded */}
        {lesson.image && (
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80">
            <img src={lesson.image} alt={lesson.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Emotional Tone Banner */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 w-fit text-xs font-medium">
          <span className="text-indigo-500 font-semibold">Emotional Tone:</span>
          <span>{lesson.emotionalTone}</span>
        </div>

        {/* Lesson Description / Story / Insight */}
        {lesson.isLocked ? (
          <div className="relative p-8 border border-amber-500/20 bg-amber-500/5 rounded-2xl text-center select-none overflow-hidden space-y-4">
            <div className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-lg" />
            <div className="relative z-10 space-y-4 py-8">
              <div className="p-3 bg-amber-500/20 w-fit rounded-full mx-auto text-amber-500">
                <Sparkles className="h-8 w-8 fill-current animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Premium Content Locked</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                This life lesson is marked as premium and is only visible to premium subscribers. Upgrade now to unlock all premium life lessons.
              </p>
              <Link
                href="/pricing"
                className="inline-block rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 text-sm font-bold shadow-lg transform transition hover:scale-105"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base space-y-4 whitespace-pre-wrap">
            {lesson.description}
          </div>
        )}

        {/* Stats & Engagement Info */}
        <div className="flex flex-wrap gap-4 items-center border-y border-slate-100 dark:border-slate-800/80 py-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1">
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
            {lesson.likes?.length || 0} Likes
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-current text-amber-500' : ''}`} />
            Saved {isFavorited ? '1 time' : '0 times'}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {viewsCount} Views
          </span>
        </div>

        {/* Interaction Control Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
                isLiked 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteToggle}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
                isFavorited 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              <span>{isFavorited ? 'Saved' : 'Save to Favorites'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Trigger & Buttons */}
            <div className="flex items-center gap-1.5 text-slate-500 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50">
              <Share2 className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-bold mr-1.5">Share:</span>
              <FacebookShareButton url={shareUrl} quote={lesson.title}>
                <FacebookIcon size={20} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={lesson.title}>
                <TwitterIcon size={20} round />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl}>
                <LinkedinIcon size={20} round />
              </LinkedinShareButton>
            </div>

            {/* Report Button */}
            <button
              onClick={handleReportLesson}
              className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
              title="Report Lesson"
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Creator / Author Card */}
        {creator && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={creator.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                alt={creator.name}
                className="h-14 w-14 rounded-full object-cover border border-slate-200 dark:border-slate-800"
              />
              <div>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Author</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{creator.name}</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500">{creator.totalLessons} lessons published</p>
              </div>
            </div>
            
            <Link
              href={`/dashboard/profile`} // Leads to profile page
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:text-indigo-500 text-xs font-bold rounded-xl transition duration-200 bg-white dark:bg-slate-900"
            >
              View Profile
            </Link>
          </div>
        )}
      </article>

      {/* Comment Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-500" />
          <span>Comments ({comments?.length || 0})</span>
        </h3>

        {/* Post Comment Form */}
        <form onSubmit={handlePostComment} className="flex gap-4 items-start">
          <img
            src={session?.user?.image || session?.user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
            alt={session?.user?.name}
            className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
          />
          <div className="flex-grow space-y-2">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a helpful comment, reflection, or share your response..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-40"
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>

        {/* Comments List */}
        {comments?.length === 0 ? (
          <p className="text-xs text-slate-400">No comments posted yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <img
                  src={comment.userImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt={comment.userName}
                  className="h-9 w-9 rounded-full object-cover border border-slate-200"
                />
                <div className="space-y-1 flex-grow">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-xs">{comment.userName}</h5>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Similar & Recommended Lessons */}
      {similarLessons?.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Similar Life Lessons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition shadow-sm hover:shadow-md"
              >
                <div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase tracking-wider mb-2 inline-block">
                    {lesson.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {lesson.description}
                  </p>
                </div>
                <Link
                  href={lesson.isLocked ? '/pricing' : `/lessons/${lesson._id}`}
                  className="text-xs font-semibold text-indigo-500 flex items-center gap-1 hover:underline pt-2 border-t border-slate-50 dark:border-slate-800/80"
                >
                  <span>Read Lesson</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
