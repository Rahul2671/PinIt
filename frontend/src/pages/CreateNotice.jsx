import { useState } from "react";
import axios from "axios";
import {
  openEventHub,
  EVENT_HUB_URL,
} from "../utils/integrations";

function CreateNotice() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [community, setCommunity] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [isTeamFinder, setIsTeamFinder] = useState(false);
  const [teamIntent, setTeamIntent] = useState("recruiting");
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [rolesNeeded, setRolesNeeded] = useState("");
  const [teamSizeNeeded, setTeamSizeNeeded] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [eventHubUrl, setEventHubUrl] = useState("");

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setCommunity("");
    setDescription("");
    setIsTeamFinder(false);
    setTeamIntent("recruiting");
    setEventName("");
    setEventType("");
    setRolesNeeded("");
    setTeamSizeNeeded("");
    setContactInfo("");
    setEventHubUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      category,
      community,
      description,
      is_team_finder: category === "Events" && isTeamFinder,
      team_intent: isTeamFinder ? teamIntent : null,
      event_name: isTeamFinder ? eventName : null,
      event_type: isTeamFinder ? eventType : null,
      roles_needed: isTeamFinder ? rolesNeeded : null,
      team_size_needed:
        isTeamFinder && teamIntent === "recruiting" ? teamSizeNeeded : null,
      contact_info: contactInfo || null,
      event_hub_url: eventHubUrl || null,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notices`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const notice = response.data;

      if (category === "Lost & Found") {
        const result = await shareToWhatsAppGroup(notice);
        alert(
          result.mode === "group"
            ? "Notice posted! Message copied — paste it in your WhatsApp group."
            : "Notice posted! Opening WhatsApp to share."
        );
      } else if (category === "Events" && isTeamFinder) {
        alert(
          "Team finder posted! Others can express interest or contact you on PinIt."
        );
      } else {
        alert("Notice posted successfully 🚀");
      }

      resetForm();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to post notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center sm:text-left">
          <span className="badge-indigo mb-3 inline-flex px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
            New notice
          </span>
          <h1 className="section-title">Create a notice</h1>
          <p className="section-subtitle">
            Share updates, find teammates for VIT events, or post lost &amp;
            found items with your community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              placeholder="e.g. Looking for teammates for Gravitas Hackathon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value !== "Events") setIsTeamFinder(false);
              }}
              className="input-field"
              required
            >
              <option value="">Select a category</option>
              <option>Events</option>
              <option>Lost & Found</option>
              <option>Services</option>
            </select>
          </div>

          {category === "Events" && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-900">
                    Official VIT events are on Event Hub
                  </p>
                  <p className="mt-1 text-xs text-indigo-700">
                    Register there first, then use PinIt to find teammates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openEventHub()}
                  className="btn-secondary shrink-0 text-sm"
                >
                  Open Event Hub
                </button>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={isTeamFinder}
                  onChange={(e) => setIsTeamFinder(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-900">
                    Enable team finder
                  </span>
                  <span className="block text-xs text-slate-500">
                    Recruit members or find a team for a hackathon / group event
                  </span>
                </span>
              </label>
            </div>
          )}

          {category === "Events" && isTeamFinder && (
            <div className="space-y-5 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  I want to...
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    {
                      value: "recruiting",
                      label: "Recruit team members",
                      desc: "Building a team — need more people",
                    },
                    {
                      value: "looking_to_join",
                      label: "Join an existing team",
                      desc: "Looking for a team to join",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-xl border p-3 transition ${
                        teamIntent === option.value
                          ? "border-violet-400 bg-white ring-2 ring-violet-500/20"
                          : "border-slate-200 bg-white hover:border-violet-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="teamIntent"
                        value={option.value}
                        checked={teamIntent === option.value}
                        onChange={(e) => setTeamIntent(e.target.value)}
                        className="sr-only"
                      />
                      <span className="block text-sm font-medium text-slate-900">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {option.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Event name
                </label>
                <input
                  placeholder="e.g. Gravitas Hackathon 2026"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="input-field"
                  required={isTeamFinder}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Event type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select type</option>
                  <option>Hackathon</option>
                  <option>Workshop</option>
                  <option>Cultural</option>
                  <option>Sports</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {teamIntent === "recruiting"
                    ? "Roles needed"
                    : "Your skills / role"}
                </label>
                <input
                  placeholder={
                    teamIntent === "recruiting"
                      ? "e.g. Frontend dev, ML engineer, Designer"
                      : "e.g. Backend developer, Python, UI/UX"
                  }
                  value={rolesNeeded}
                  onChange={(e) => setRolesNeeded(e.target.value)}
                  className="input-field"
                />
              </div>

              {teamIntent === "recruiting" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Spots needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={teamSizeNeeded}
                    onChange={(e) => setTeamSizeNeeded(e.target.value)}
                    className="input-field"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Event Hub link (optional)
                </label>
                <input
                  placeholder={`${EVENT_HUB_URL}/...`}
                  value={eventHubUrl}
                  onChange={(e) => setEventHubUrl(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {category === "Lost & Found" && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-emerald-800">
              After posting, your notice message will be copied and your
              community WhatsApp group will open — paste the message there so
              neighbors can help.
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Community
            </label>
            <input
              placeholder="e.g. VIT Chennai, Block A Hostel"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Contact (optional)
            </label>
            <input
              placeholder="WhatsApp number, email, or Discord link"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="input-field"
            />
            <p className="mt-1 text-xs text-slate-500">
              Shown on team finder posts so others can reach you quickly.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              placeholder="Add all the details people need to know..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="input-field resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? "Posting..." : "Post notice"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary flex-1"
            >
              Clear form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNotice;
