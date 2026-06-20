export const EVENT_HUB_URL =
  import.meta.env.VITE_EVENT_HUB_URL || "https://eventhubcc.vit.ac.in";

export const WHATSAPP_GROUP_LINK =
  import.meta.env.VITE_WHATSAPP_GROUP_LINK || "";

export function formatNoticeMessage(notice) {
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
      `Intent: ${notice.team_intent === "recruiting" ? "Recruiting members" : "Looking to join a team"}`
    );
    if (notice.roles_needed) lines.push(`Roles: ${notice.roles_needed}`);
    if (notice.team_size_needed)
      lines.push(`Spots needed: ${notice.team_size_needed}`);
  }

  lines.push("", "Description:", notice.description, "", "Posted via PinIt 🚀");

  return lines.join("\n");
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareToWhatsAppGroup(notice) {
  const message = formatNoticeMessage(notice);
  const copied = await copyToClipboard(message);

  if (WHATSAPP_GROUP_LINK) {
    window.open(WHATSAPP_GROUP_LINK, "_blank");
    return { copied, mode: "group" };
  }

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  return { copied, mode: "share" };
}

export function openEventHub(url) {
  window.open(url || EVENT_HUB_URL, "_blank", "noopener,noreferrer");
}

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
      `mailto:${trimmed}?subject=${encodeURIComponent("PinIt Team Finder")}&body=${encodeURIComponent(message)}`,
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

export const TEAM_INTENT_LABELS = {
  recruiting: "Recruiting members",
  looking_to_join: "Looking to join a team",
};
