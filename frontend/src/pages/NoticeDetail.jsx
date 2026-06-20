import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import NoticeCard from "../components/NoticeCard";

function NoticeDetails() {
  const { id } = useParams();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotice = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notices/${id}`
      );

      setNotice(res.data);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 404) {
        setError("This notice doesn't exist or has been removed.");
      } else {
        setError("Could not load this notice. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchNotice();
  }, [id]);

  return (
    <div className="page-shell">
      <div className="mb-6">
        <Link
          to="/"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to all notices
        </Link>
      </div>

      {loading ? (
        <div className="card animate-pulse">
          <div className="h-6 w-2/3 rounded-lg bg-slate-200" />
          <div className="mt-4 h-4 w-full rounded bg-slate-100" />
          <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
          <div className="mt-6 h-10 w-full rounded-xl bg-slate-100" />
        </div>
      ) : error ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
            🚫
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Notice not available
          </h3>

          <p className="mt-2 max-w-sm text-sm text-slate-500">{error}</p>

          <Link to="/" className="btn-primary mt-6">
            Browse all notices
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <span className="badge-indigo mb-3 inline-flex px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
              Shared notice
            </span>

            <h1 className="section-title">{notice?.title}</h1>

            <p className="section-subtitle">
              Someone shared this notice with you on PinIt.
            </p>
          </div>

          {notice && (
            <NoticeCard notice={notice} refresh={fetchNotice} />
          )}
        </div>
      )}
    </div>
  );
}

export default NoticeDetails;