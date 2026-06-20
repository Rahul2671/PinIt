import { useEffect, useState } from "react";
import axios from "axios";
import NoticeCard from "../components/NoticeCard";
import { Link } from "react-router-dom";

function MyNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyNotices();
  }, []);

  const fetchMyNotices = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notices/my-notices`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="badge-indigo mb-3 inline-flex px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Dashboard
          </span>
          <h1 className="section-title">My notices</h1>
          <p className="section-subtitle">
            Manage, upvote, or delete notices you&apos;ve created.
          </p>
        </div>
        <Link to="/create-notice" className="btn-primary w-full sm:w-auto">
          + Post new notice
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 w-2/3 rounded-lg bg-slate-200" />
              <div className="mt-4 h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
              <div className="mt-6 h-10 w-full rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      ) : notices.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              refresh={fetchMyNotices}
            />
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
            📋
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No notices yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            You haven&apos;t created any notices. Start sharing with your
            community today.
          </p>
          <Link to="/create-notice" className="btn-primary mt-6">
            Create your first notice
          </Link>
        </div>
      )}
    </div>
  );
}

export default MyNotices;
