import {
  openDirectWhatsApp,
  prepareSharePayload,
} from "../utils/integrations";

const WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/KhepglC6Tnn1KCDqvh7N4x";

export default function ShareModal({ notice, onClose }) {
  const handleGroupShare = async () => {
    await prepareSharePayload(notice);

    window.open(
      WHATSAPP_GROUP_LINK,
      "_blank",
      "noopener,noreferrer"
    );

    onClose?.();
  };

  const handleDirectShare = async () => {
    const data = await prepareSharePayload(notice);

    openDirectWhatsApp(data.message);
    onClose?.();
  };

  const handleCopyOnly = async () => {
    const data = await prepareSharePayload(notice);

    alert(data.copied ? "Copied to clipboard ✔" : "Copy failed");
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          Share Notice
        </h2>

        <div className="space-y-3">
          {/* GROUP SHARE */}
          <button
            onClick={handleGroupShare}
            className="w-full bg-green-500 text-white py-2 rounded-lg"
          >
            📢 Share to WhatsApp Group
          </button>

          {/* DIRECT SHARE */}
          <button
            onClick={handleDirectShare}
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            💬 Direct WhatsApp Share
          </button>

          {/* COPY */}
          <button
            onClick={handleCopyOnly}
            className="w-full bg-gray-200 py-2 rounded-lg"
          >
            📋 Copy Message
          </button>

          {/* CANCEL */}
          <button
            onClick={onClose}
            className="w-full text-red-500 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}