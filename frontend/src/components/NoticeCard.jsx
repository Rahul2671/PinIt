function NoticeCard({ title, category, community, description }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="mt-2 flex gap-2">
        <span className="bg-blue-100 px-2 py-1 rounded text-sm">
          {category}
        </span>

        <span className="bg-green-100 px-2 py-1 rounded text-sm">
          {community}
        </span>
      </div>

      <p className="mt-3 text-gray-600">
        {description}
      </p>

      <button className="mt-4 px-3 py-1 bg-blue-600 text-white rounded">
        👍 Upvote
      </button>
    </div>
  );
}

export default NoticeCard;