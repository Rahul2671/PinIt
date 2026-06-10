import { useState } from "react";
import NoticeCard from "../components/NoticeCard";
import SearchBar from "../components/SearchBar";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      notice.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Community Notices
      </h1>

      <div className="mb-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
           onClick={() => setSelectedCategory("All")}
           className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
        >
           All
        </button>

        <button
           onClick={() => setSelectedCategory("Events")}
           className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
        >
            Events
        </button>

        <button
            onClick={() => setSelectedCategory("Lost & Found")}
            className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
        >
            Lost & Found
        </button>

        <button
            onClick={() => setSelectedCategory("Services")}
            className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
        >
           Services
        </button>
      </div>

      <div className="grid gap-4">
        {filteredNotices.map((notice, index) => (
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