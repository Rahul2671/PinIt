import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { name, email, password }
      );

      localStorage.setItem("token", response.data.token);
      alert("Registration successful 🚀");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <span className="badge-emerald mb-4 inline-flex px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Join PinIt
          </span>
          <h1 className="section-title">
            Start sharing with your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              community today
            </span>
          </h1>
          <p className="section-subtitle">
            Create a free account to post notices, upvote helpful updates, and
            stay connected with people nearby.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: "📌", label: "Pin notices" },
              { icon: "👍", label: "Upvote posts" },
              { icon: "📱", label: "WhatsApp share" },
              { icon: "👤", label: "Your profile" },
            ].map((item) => (
              <div key={item.label} className="card px-4 py-4 text-center">
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-card mx-auto">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Create account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Fill in your details to get started
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
