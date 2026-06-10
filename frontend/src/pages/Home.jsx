import NoticeCard from "../components/NoticeCard";

function Home() {
  const notices = [
    {
      title: "Lost Wallet",
      category: "Lost & Found",
      community: "Hostel",
      description: "Lost near library."
    },
    {
      title: "Python Tuition",
      category: "Services",
      community: "CSE",
      description: "Weekend classes available."
    },
    {
      title: "Coding Club Event",
      category: "Events",
      community: "Club",
      description: "Hackathon this Saturday."
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Community Notices
      </h1>

      <div className="grid gap-4">
        {notices.map((notice, index) => (
          <NoticeCard
            key={index}
            title={notice.title}
            category={notice.category}
            community={notice.community}
            description={notice.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;