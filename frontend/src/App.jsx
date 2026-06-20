import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateNotice from "./pages/CreateNotice";
import Profile from "./pages/Profile";
import MyNotices from "./pages/MyNotices";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/create-notice"
              element={
                <ProtectedRoute>
                  <CreateNotice />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-notices"
              element={
                <ProtectedRoute>
                  <MyNotices />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200/70 bg-white/60 py-6 text-center text-sm text-slate-500 backdrop-blur-sm">
          <p>
            © {new Date().getFullYear()} PinIt — Built for your community
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
