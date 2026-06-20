import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700"
      : "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";
  };

  return (
    <nav className="glass-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/30 transition group-hover:shadow-lg group-hover:shadow-indigo-500/40">
            P
          </span>
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              PinIt
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>

          {token && (
            <>
              <Link to="/create-notice" className={navLinkClass("/create-notice")}>
                Create
              </Link>
              <Link to="/my-notices" className={navLinkClass("/my-notices")}>
                My Notices
              </Link>
            </>
          )}

          {token ? (
            <>
              <Link to="/profile" className={navLinkClass("/profile")}>
                Profile
              </Link>
              <button onClick={logout} className="btn-danger ml-1 sm:ml-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass("/login")}>
                Login
              </Link>
              <Link to="/register" className="btn-primary ml-1 px-4 py-2 sm:ml-2">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
