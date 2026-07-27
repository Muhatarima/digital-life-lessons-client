import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@heroui/react";
import { useAdminRoute } from "@/hook/useAdminRoute";

export default function ReportedLessons() {
  const { session, isPending } = useAdminRoute();
  const [reportGroups, setReportGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null);
  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (session?.user?.role === "admin") fetchReports();
  }, [session]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER}/api/admin/reports`);
      setReportGroups(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Permanently delete this lesson?")) return;
    try {
      await axios.delete(`${SERVER}/api/lessons/${lessonId}`);
      await axios.delete(`${SERVER}/api/admin/reports/${lessonId}/ignore`);
      setReportGroups((prev) => prev.filter((g) => g.lessonId !== lessonId));
      toast.success("Lesson deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleIgnore = async (lessonId) => {
    try {
      await axios.delete(`${SERVER}/api/admin/reports/${lessonId}/ignore`);
      setReportGroups((prev) => prev.filter((g) => g.lessonId !== lessonId));
      toast.success("Reports cleared, lesson kept live");
    } catch (err) {
      toast.error("Failed to ignore");
    }
  };

  if (isPending || !session?.user) return <p className="text-center py-20">Loading...</p>;
  if (session.user.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Reported Lessons</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reportGroups.length === 0 ? (
        <p className="text-gray-500">No reported lessons.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Lesson Title</th>
                <th className="px-4 py-3">Report Count</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportGroups.map((group) => (
                <tr key={group.lessonId} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {group.lessonTitle}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setOpenModal(group)}
                      className="text-blue-600 hover:underline"
                    >
                      {group.reportCount} reports
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteLesson(group.lessonId)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete Lesson
                    </button>
                    <button
                      onClick={() => handleIgnore(group.lessonId)}
                      className="text-gray-600 hover:underline text-xs"
                    >
                      Ignore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">
              Reports for "{openModal.lessonTitle}"
            </h2>
            <div className="space-y-3">
              {openModal.reports.map((r, i) => (
                <div key={i} className="border-b pb-2 text-sm">
                  <p className="font-medium">{r.reason}</p>
                  <p className="text-gray-500 text-xs">
                    Reported by: {r.reportedUserEmail || r.reporterUserId}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(r.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <Button
              className="mt-4"
              variant="bordered"
              onPress={() => setOpenModal(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}