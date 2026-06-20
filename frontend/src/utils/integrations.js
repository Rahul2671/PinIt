export const EVENT_HUB_URL =
  import.meta.env.VITE_EVENT_HUB_URL || "https://eventhubcc.vit.ac.in";

export const WHATSAPP_GROUP_LINK =
  import.meta.env.VITE_WHATSAPP_GROUP_LINK || "";

/* ---------------- SHARE URL ---------------- */

export function getNoticeShareUrl(notice) {
  if (!notice?.id) return "";
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/notice/${notice.id}`;
}

/* ---------------- CATEGORY HELPERS ---------------- */

function getCategoryType(notice) {
  const category = (notice?.category || "").toLowerCase();

  if (category.includes("lost") || category.includes("found")) {
    return "lost_found";
  }

  return "general";
}

/* ---------------- LOST & FOUND FORMAT ---------------- */

function formatLostFoundMessage(notice) {
  const title = (notice.title || "").trim();
  const lower = title.toLowerCase();

  let heading = "📌 Lost & Found — PinIt";

  if (lower.startsWith("found") || lower.includes("found:")) {
    heading = "✅ FOUND ITEM — PinIt";
  } else if (lower.startsWith("lost") || lower.includes("lost:")) {
    heading = "🔍 LOST ITEM — PinIt";
  }

  const lines = [
    heading,
    "",
    `*${title}*`,
    "",
    notice.description || "",
    "",
    `📍 Community: ${notice.community}`,
  ];

  if (notice.contact_info) {
    lines.push(`📞 Contact: ${notice.contact_info}`);
  } else if (notice.poster_name) {
    lines.push(`👤 Posted by: ${notice.poster_name}`);
  }

  const url = getNoticeShareUrl(notice);
  if (url) lines.push("", `🔗 View post: ${url}`);

  lines.push("", "Shared via PinIt 🚀");

  return lines.join("\n");
}

/* ---------------- GENERAL FORMAT ---------------- */

function formatGeneralMessage(notice) {
  const lines = [
    "📌 PinIt Notice",
    "",
    `Title: ${notice.title}`,
    `Category: ${notice.category}`,
    `Community: ${notice.community}`,
  ];

  if (notice.is_team_finder) {
    lines.push(
      "",
      "🤝 Team Finder",
      `Event: ${notice.event_name}`,
      `Intent: ${
        notice.team_intent === "recruiting"
          ? "Recruiting members"
          : "Looking to join a team"
      }`
    );

    if (notice.roles_needed) lines.push(`Roles: ${notice.roles_needed}`);
    if (notice.team_size_needed)
      lines.push(`Spots needed: ${notice.team_size_needed}`);
  }

  lines.push("", "Description:", notice.description || "");

  const url = getNoticeShareUrl(notice);
  if (url) lines.push("", `🔗 View on PinIt: ${url}`);

  lines.push("", "Posted via PinIt 🚀");

  return lines.join("\n");
}

/* ---------------- MAIN FORMATTER ---------------- */

export function formatNoticeMessage(notice) {
  const type = getCategoryType(notice);

  if (type === "lost_found") {
    return formatLostFoundMessage(notice);
  }

  return formatGeneralMessage(notice);
}

/* ---------------- CLIPBOARD ---------------- */

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ---------------- SMART SHARE ACTION ---------------- */
/*
  NEW FLOW:
  - DOES NOT auto-open WhatsApp group blindly
  - UI decides what to do
*/

export async function prepareSharePayload(notice) {
  const message = formatNoticeMessage(notice);
  const copied = await copyToClipboard(message);

  return {
    message,
    copied,
    hasGroup: Boolean(WHATSAPP_GROUP_LINK),
    groupLink: WHATSAPP_GROUP_LINK,
    shareLink: getNoticeShareUrl(notice),
  };
}

/* ---------------- ACTION HELPERS ---------------- */

export function openWhatsAppGroup() {
  if (WHATSAPP_GROUP_LINK) {
    window.open(WHATSAPP_GROUP_LINK, "_blank", "noopener,noreferrer");
    return true;
  }
  return false;
}

export function openDirectWhatsApp(message) {
  window.open(
    `https://wa.me/?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

export function openEventHub(url) {
  window.open(url || EVENT_HUB_URL, "_blank", "noopener,noreferrer");
}

/* ---------------- CONTACT LOGIC (UNCHANGED BUT SAFE) ---------------- */

export function openContactLink(contactInfo, message) {
  if (!contactInfo) return false;

  const trimmed = contactInfo.trim();

  if (/^[\d+\s-]{8,}$/.test(trimmed.replace(/\s/g, ""))) {
    const phone = trimmed.replace(/\D/g, "");
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
    return true;
  }

  if (trimmed.includes("@")) {
    window.open(
      `mailto:${trimmed}?subject=${encodeURIComponent(
        "PinIt Team Finder"
      )}&body=${encodeURIComponent(message)}`,
      "_blank"
    );
    return true;
  }

  if (trimmed.startsWith("http")) {
    window.open(trimmed, "_blank", "noopener,noreferrer");
    return true;
  }

  return false;
}

/* ---------------- LABELS ---------------- */

export const TEAM_INTENT_LABELS = {
  recruiting: "Recruiting members",
  looking_to_join: "Looking to join a team",
};