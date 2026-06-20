import { useState } from "react";
import axios from "axios";
import {
  openEventHub,
  openContactLink,
  shareToWhatsAppGroup,
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

  const currentUserId = getAuthUserId();
  const isOwner = currentUserId && user_id === currentUserId;
  const isTeamFinder = Boolean(is_team_finder);
  const isTeamFull = status === "full";

  const contactMessage = isTeamFinder
    ? `Hi! I saw your PinIt team finder post for "${event_name}" and I'm interested.`
    : `Hi! I'm reaching out about your PinIt notice: "${title}".`;

  const deleteNotice = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notices/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Notice deleted 🚀");
      refresh();
    } catch (error) {
      console.log(error);
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
      alert("Interest sent! The poster can view your profile email on PinIt.");
    } catch (error) {
      alert(error.response?.data?.message || "Could not express interest");
    }
  };

  const fetchInterestedUsers = async () => {
    setLoadingInterests(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notices/${id}/interests`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setStatus(newStatus);
    } catch (error) {
      alert(error.response?.data?.message || "Could not update team status");
    }
  };

  const handleContact = () => {
    const contact = contact_info || poster_email;
    if (openContactLink(contact, contactMessage)) return;
    alert(`Contact: ${contact || poster_email || "Not provided"}`);
  };

  const handleWhatsAppShare = async () => {
    const result = await shareToWhatsAppGroup(notice);
    if (result.mode === "group") {
      alert(
        result.copied
          ? "Message copied! Paste it in the WhatsApp group after it opens."
          : "Opening WhatsApp group..."
      );
    }
  };

  return (
    <article className="card card-hover flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
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
            <span className="badge bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/10 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium">
              Team finder
            </span>
          )}
          {isTeamFinder && isTeamFull && (
            <span className="badge bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium">
              Team full
            </span>
          )}
          <span className="badge-emerald">{community}</span>
        </div>
      </div>

      {isTeamFinder && (
        <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/60 p-3 text-sm">
          <p className="font-medium text-violet-900">
            {TEAM_INTENT_LABELS[team_intent] || team_intent}
          </p>
          {roles_needed && (
            <p className="mt-1 text-violet-700">
              <span className="font-medium">Roles:</span> {roles_needed}
            </p>
          )}
          {team_intent === "recruiting" && team_size_needed && (
            <p className="mt-1 text-violet-700">
              <span className="font-medium">Spots needed:</span> {team_size_needed}
            </p>
          )}
          {interests > 0 && (
            <p className="mt-1 text-violet-700">
              <span className="font-medium">{interests}</span> interested
            </p>
          )}
        </div>
      )}

      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
        {description}
      </p>

      {poster_name && (
        <p className="mt-3 text-xs text-slate-400">
          Posted by {poster_name}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {category === "Events" && (
          <button
            type="button"
            onClick={() => openEventHub(event_hub_url)}
            className="btn-secondary px-3 py-2 text-xs sm:text-sm"
          >
            View on Event Hub
          </button>
        )}

        {category === "Lost & Found" && (
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="btn-secondary px-3 py-2 text-xs sm:text-sm"
          >
            Share to WhatsApp
          </button>
        )}

        {isTeamFinder && !isOwner && !isTeamFull && (
          <>
            <button
              type="button"
              onClick={expressInterest}
              className="btn-primary px-3 py-2 text-xs sm:text-sm"
            >
              I&apos;m interested
            </button>
            <button
              type="button"
              onClick={handleContact}
              className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            >
              Contact poster
            </button>
          </>
        )}

        {isTeamFinder && isOwner && (
          <>
            <button
              type="button"
              onClick={fetchInterestedUsers}
              disabled={loadingInterests}
              className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            >
              {loadingInterests ? "Loading..." : `View interested (${interests})`}
            </button>
            <button
              type="button"
              onClick={toggleTeamStatus}
              className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            >
              Mark as {status === "open" ? "full" : "open"}
            </button>
          </>
        )}
      </div>

      {showInterestedList && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              Interested members
            </h4>
            <button
              type="button"
              onClick={() => setShowInterestedList(false)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>
          {interestedUsers.length === 0 ? (
            <p className="text-sm text-slate-500">No one yet.</p>
          ) : (
            <ul className="space-y-2">
              {interestedUsers.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{person.name}</p>
                    <p className="text-xs text-slate-500">{person.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openContactLink(
                        person.email,
                        `Hi ${person.name}, regarding my team finder post for ${event_name}...`
                      )
                    }
                    className="btn-ghost text-xs text-indigo-600"
                  >
                    Contact
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {category === "Events" && !isTeamFinder && (
            <a
              href={EVENT_HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="normal-case text-indigo-600 hover:underline"
            >
              Official events →
            </a>
          )}
          {!isTeamFinder && category !== "Events" && "Posted recently"}
          {isTeamFinder && "Team finder post"}
        </span>

        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={upvoteNotice}
              className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            >
              <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {upvotes}
            </button>
            {isOwner && (
              <button onClick={deleteNotice} className="btn-danger px-3 py-2 text-xs sm:text-sm">
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default NoticeCard;
