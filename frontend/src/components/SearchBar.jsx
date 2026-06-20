function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search notices by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input-field pl-11"
      />
    </div>
  );
}

export default SearchBar;
