import { useState } from "react";
import axios from "axios";
import ShareModal from "./ShareModal";
import {
  openEventHub,
  openContactLink,
  TEAM_INTENT_LABELS,
  EVENT_HUB_URL,
} from "../utils/integrations";
import { getAuthUserId } from "../utils/auth";

function NoticeCard({ notice, refresh, showActions = true }) {
  const {
    id,
    user_id,
    title,
    category,
    community,
    description,
    upvotes: initialUpvotes,
    is_team_finder,
    team_intent,
    event_name,
    event_type,
    roles_needed,
    team_size_needed,
    contact_info,
    event_hub_url,
    team_status,
    interest_count,
    poster_name,
    poster_email,
  } = notice;

  const [upvotes, setUpvotes] = useState(Number(initialUpvotes) || 0);
  const [interests, setInterests] = useState(Number(interest_count) || 0);
  const [status, setStatus] = useState(team_status || "open");
  const [showInterestedList, setShowInterestedList] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loadingInterests, setLoadingInterests] = useState(false);

  // ✅ NEW: Share modal state
  const [showShare, setShowShare] = useState(false);

  const currentUserId = getAuthUserId();
  const isOwner = currentUserId && user_id === currentUserId;
  const isTeamFinder = Boolean(is_team_finder);
  const isTeamFull = status === "full";

  const contactMessage = isTeamFinder
    ? `Hi! I saw your PinIt team finder post for "${event_name}" and I'm interested.`
    : `Hi! I'm reaching out about your PinIt notice: "${title}".`;

  const deleteNotice = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/notices/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data?.message || "Notice deleted 🚀");

    if (refresh) refresh();
  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "Delete failed");
  }
};

  const upvoteNotice = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to upvote");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notices/${id}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpvotes((prev) => prev + 1);
    } catch (error) {
      if (error.response?.status === 400) {
        alert("Already upvoted 👍");
      } else {
        console.log(error);
        alert("Something went wrong");
      }
    }
  };

  const expressInterest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to express interest");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notices/${id}/interest`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInterests((prev) => prev + 1);
      alert("Interest sent!");
    } catch (error) {
      alert(error.response?.data?.message || "Could not express interest");
    }
  };

  const fetchInterestedUsers = async () => {
    setLoadingInterests(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notices/${id}/interests`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setInterestedUsers(res.data);
      setShowInterestedList(true);
    } catch (error) {
      alert(error.response?.data?.message || "Could not load interested users");
    } finally {
      setLoadingInterests(false);
    }
  };

  const toggleTeamStatus = async () => {
    const newStatus = status === "open" ? "full" : "open";
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/notices/${id}/team-status`,
        { team_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStatus(newStatus);
    } catch (error) {
      alert(error.response?.data?.message || "Could not update team status");
    }
  };

  const handleContact = () => {
    const contact = contact_info || poster_email;
    if (openContactLink(contact, contactMessage)) return;
    alert(`Contact: ${contact || "Not provided"}`);
  };

  return (
    <article className="card card-hover flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          {isTeamFinder && (
            <p className="mt-1 text-sm font-medium text-violet-600">
              {event_name}
              {event_type ? ` · ${event_type}` : ""}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="badge-indigo">{category}</span>

          {isTeamFinder && (
            <span className="badge bg-violet-50 text-violet-700">
              Team finder
            </span>
          )}

          {isTeamFinder && isTeamFull && (
            <span className="badge bg-slate-100 text-slate-600">
              Team full
            </span>
          )}

          <span className="badge-emerald">{community}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 flex-1 text-sm text-slate-600">
        {description}
      </p>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {category === "Events" && (
          <button
            onClick={() => openEventHub(event_hub_url)}
            className="btn-secondary px-3 py-2 text-xs sm:text-sm"
          >
            View Event
          </button>
        )}

        {/* 🔥 UPDATED SHARE BUTTON */}
        {category === "Lost & Found" && (
          <button
            onClick={() => setShowShare(true)}
            className="btn-secondary px-3 py-2 text-xs sm:text-sm"
          >
            Share to WhatsApp
          </button>
        )}

        {isTeamFinder && !isOwner && !isTeamFull && (
          <>
            <button
              onClick={expressInterest}
              className="btn-primary px-3 py-2 text-xs sm:text-sm"
            >
              I'm interested
            </button>

            <button
              onClick={handleContact}
              className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            >
              Contact
            </button>
          </>
        )}

        {isTeamFinder && isOwner && (
          <>
            <button
              onClick={fetchInterestedUsers}
              className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            >
              View ({interests})
            </button>

            <button
              onClick={toggleTeamStatus}
              className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            >
              Mark {status === "open" ? "full" : "open"}
            </button>
          </>
        )}
      </div>

      {/* Interested list */}
      {showInterestedList && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          {interestedUsers.map((u) => (
            <div key={u.id} className="flex justify-between text-sm">
              <span>{u.name}</span>
              <span className="text-slate-500">{u.email}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex justify-between border-t pt-3">
        <button onClick={upvoteNotice} className="text-sm">
          👍 {upvotes}
        </button>

        {isOwner && (
          <button onClick={deleteNotice} className="text-sm text-red-500">
            Delete
          </button>
        )}
      </div>

      {/* 🚀 SHARE MODAL INTEGRATION */}
      {showShare && (
        <ShareModal
          notice={notice}
          onClose={() => setShowShare(false)}
        />
      )}
    </article>
  );
}

export default NoticeCard;