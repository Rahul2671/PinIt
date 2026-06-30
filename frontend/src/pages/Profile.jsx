import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NoticeCard from "../components/NoticeCard";

function Profile() {
  const [user, setUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subscriptions,setSubscriptions] = useState([]);
  const [keyword,setKeyword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const profile = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(profile.data);

      const noticeResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notices`
      );

      const myNotices = noticeResponse.data.filter(
        (notice) => notice.user_id === profile.data.id
      );

      setNotices(myNotices);
      const subResponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/users/subscriptions`,
      {
      headers:{
      Authorization:`Bearer ${token}`
      }
      }
      );
      
      
      setSubscriptions(subResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addSubscription = async()=>{


  if(!keyword.trim()) return;
  
  
  try{
  
  
  await axios.post(
  `${import.meta.env.VITE_API_URL}/api/users/subscribe`,
  {
  keyword
  },
  {
  headers:{
  Authorization:`Bearer ${localStorage.getItem("token")}`
  }
  }
  );
  
  
  setKeyword("");
  
  fetchProfile();
  
  
  }
  catch(error){
  
  console.log(error);
  
  }
  
  
  };
  
  
  
  
  const removeSubscription = async(word)=>{
  
  
  try{
  
  
  await axios.delete(
  `${import.meta.env.VITE_API_URL}/api/users/subscribe/${word}`,
  {
  headers:{
  Authorization:`Bearer ${localStorage.getItem("token")}`
  }
  }
  );
  
  
  fetchProfile();
  
  
  }
  catch(error){
  
  console.log(error);
  
  }
  
  
  };
  
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loading) {
    return (
      <div className="page-shell">
        <div className="card animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-4 w-56 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-8">
        <span className="badge-indigo mb-3 inline-flex px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
          Account
        </span>
        <h1 className="section-title">Your profile</h1>
        <p className="section-subtitle">
          Manage your account details and review notices you&apos;ve posted.
        </p>
      </div>

      <div className="card mb-10 overflow-hidden p-0">
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600" />
        <div className="relative px-6 pb-6 sm:px-8">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg">
                {initials || "?"}
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {user?.name}
                </h2>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>
            <Link to="/create-notice" className="btn-primary">
              + New notice
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Notices posted", value: notices.length },
              { label: "Total upvotes", value: notices.reduce((sum, n) => sum + (Number(n.upvotes) || 0), 0) },
              { label: "Communities", value: new Set(notices.map((n) => n.community)).size },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-4 text-center"
              >
                <p className="text-2xl font-bold text-indigo-600">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-10">

      <h2 className="text-xl font-bold text-slate-900">
      Your subscriptions
      </h2>
      
      
      <p className="mt-1 text-sm text-slate-500">
      Get notifications for topics you follow
      </p>
      
      
      
      <div className="mt-4 flex gap-3">
      
      
      <input
      
      value={keyword}
      
      onChange={(e)=>setKeyword(e.target.value)}
      
      placeholder="coding, ai, hackathon..."
      
      className="flex-1 rounded-xl border px-4 py-2"
      
      />
      
      
      
      <button
      
      onClick={addSubscription}
      
      className="btn-primary"
      
      >
      
      Subscribe
      
      </button>
      
      
      </div>
      
      
      
      
      
      <div className="mt-4 flex flex-wrap gap-2">
      
      
      {subscriptions.map((sub)=>(
      
      
      <span
      
      key={sub.id}
      
      className="rounded-full bg-indigo-50 px-4 py-2 text-sm text-indigo-700"
      
      >
      
      
      {sub.keyword}
      
      
      <button
      
      onClick={()=>removeSubscription(sub.keyword)}
      
      className="ml-2 text-red-500"
      
      >
      
      ×
      
      
      </button>
      
      
      </span>
      
      
      ))}
      
      
      </div>
      
      
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Your notices
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {notices.length} notice{notices.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <Link to="/my-notices" className="btn-ghost text-indigo-600 hover:bg-indigo-50">
          View all →
        </Link>
      </div>

      {notices.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
            📝
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No notices yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            You haven&apos;t posted anything yet. Share your first notice with
            the community.
          </p>
          <Link to="/create-notice" className="btn-primary mt-6">
            Create your first notice
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notices.slice(0, 6).map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              refresh={fetchProfile}
              showActions={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
