import NoticeCard from "../components/NoticeCard";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { openEventHub } from "../utils/integrations";

const CATEGORIES = ["All", "Events", "Lost & Found", "Services"];

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [teamFinderOnly, setTeamFinderOnly] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notices`
      );

      if (Array.isArray(response.data)) {
        setNotices(response.data);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.log(error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = Array.isArray(notices)
    ? notices.filter((notice) => {
        const matchesSearch =
          notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notice.event_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          category === "All" || notice.category === category;

        const matchesTeamFinder =
          !teamFinderOnly || Boolean(notice.is_team_finder);

        return matchesSearch && matchesCategory && matchesTeamFinder;
      })
    : [];

  const teamFinderCount = notices.filter((n) => n.is_team_finder).length;
  const token = localStorage.getItem("token");

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white/40">
        <div className="page-shell pb-12 pt-10 lg:pb-16 lg:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge-indigo mb-4 inline-flex px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
              Community board
            </span>
            <h1 className="section-title">
              Discover notices from{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                your neighborhood
              </span>
            </h1>
            <p className="section-subtitle mx-auto">
              Events &amp; team finder, lost items, local services — everything
              in one feed. Official events live on{" "}
              <button
                type="button"
                onClick={() => openEventHub()}
                className="font-medium text-indigo-600 hover:underline"
              >
                VIT Event Hub
              </button>
              .
            </p>

            {!token && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/register" className="btn-primary">
                  Create free account
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign in
                </Link>
              </div>
            )}
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: "Total notices", value: notices.length },
              { label: "Team finder", value: teamFinderCount },
              {
                label: "Communities",
                value: new Set(notices.map((n) => n.community)).size,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card px-4 py-5 text-center sm:px-6"
              >
                <p className="text-2xl font-bold text-indigo-600 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Browse notices
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredNotices.length} result
              {filteredNotices.length !== 1 ? "s" : ""} found
            </p>
          </div>
          {token && (
            <Link to="/create-notice" className="btn-primary w-full sm:w-auto">
              + Post a notice
            </Link>
          )}
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => {
                setCategory(item);
                if (item !== "Events") setTeamFinderOnly(false);
              }}
              className={`filter-pill ${
                category === item ? "filter-pill-active" : ""
              }`}
            >
              {item}
            </button>
          ))}

          {(category === "Events" || category === "All") && (
            <button
              onClick={() => setTeamFinderOnly((prev) => !prev)}
              className={`filter-pill ${
                teamFinderOnly ? "filter-pill-active" : ""
              }`}
            >
              🤝 Team finder
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-5 w-2/3 rounded-lg bg-slate-200" />
                <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
                <div className="mt-6 h-10 w-full rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : filteredNotices.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                refresh={fetchNotices}
              />
            ))}
          </div>
        ) : (
          <div className="card mt-10 flex flex-col items-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
              📭
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No notices found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {teamFinderOnly
                ? "No team finder posts yet. Saw an event on Event Hub? Post here to find teammates."
                : "Try adjusting your search or filters, or be the first to post something new."}
            </p>
            {token && (
              <Link to="/create-notice" className="btn-primary mt-6">
                {teamFinderOnly ? "Post team finder" : "Create the first notice"}
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
