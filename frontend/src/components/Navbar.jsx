import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [token,setToken] = useState(
    localStorage.getItem("token")
  );


  const [notifications,setNotifications] = useState([]);
  const [showNotifications,setShowNotifications] = useState(false);

  useEffect(()=>{

  const updateToken = ()=>{

    setToken(
      localStorage.getItem("token")
    );

  };


  window.addEventListener(
    "storage",
    updateToken
  );


  return ()=>{

    window.removeEventListener(
      "storage",
      updateToken
    );

  };


  },[]);

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);

    navigate("/login");

  };



  const fetchNotifications = async()=>{

    if(!token) return;


    try{

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notices/notifications/all`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      setNotifications(res.data);


    }catch(error){

      console.log(error);

    }

  };



  useEffect(()=>{

    fetchNotifications();


    const timer=setInterval(
      fetchNotifications,
      10000
    );


    return ()=>clearInterval(timer);


  },[token]);





  const markRead = async(notification)=>{

  try{

    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/notices/notifications/${notification.id}/read`,
      {},
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );


    setNotifications(prev =>
      prev.map(n =>
        n.id===notification.id
        ? {...n,is_read:true}
        : n
      )
    );


    setShowNotifications(false);

    navigate(`/notice/${notification.notice_id}`);


  }catch(error){

    console.log(error);

  }

};




  const unreadCount =
    notifications.filter(n=>!n.is_read).length;



  const navLinkClass=(path)=>{

    const isActive =
      location.pathname===path;


    return isActive
    ? "rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700"
    : "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";

  };




return (

<nav className="glass-nav">

<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">



<Link to="/" className="group flex items-center gap-2.5">

<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">

P

</span>


<span className="text-xl font-bold">
PinIt
</span>


</Link>





<div className="flex items-center gap-2">



<Link
to="/"
className={navLinkClass("/")}
>
Home
</Link>





{token && (

<>


<Link
to="/create-notice"
className={navLinkClass("/create-notice")}
>
Create
</Link>



<Link
to="/my-notices"
className={navLinkClass("/my-notices")}
>
My Notices
</Link>





{/* NOTIFICATION BELL */}

<div className="relative">


<button

onClick={()=>setShowNotifications(!showNotifications)}

className="relative text-xl px-3 py-2 rounded-lg hover:bg-slate-100"

>

🔔


{unreadCount>0 && (

<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">

{unreadCount}

</span>

)}

</button>




{showNotifications && (

<div
className="
absolute right-0 mt-2 w-80
bg-white shadow-xl rounded-xl
p-3 z-50 border
"
>


{notifications.length===0 ? (

<p className="text-sm text-slate-500 text-center py-4">
No notifications 🔔
</p>

)

:

notifications
.slice(0,5)
.map(n=>(


<div

key={n.id}

onClick={()=>markRead(n)}

className={`
p-3 rounded-lg cursor-pointer mb-2
transition
hover:bg-slate-100
${!n.is_read ? "bg-indigo-50" : ""}
`}

>


<div className="flex justify-between">


<p className="text-sm font-medium">

{n.message}

</p>


{!n.is_read && (

<span className="h-2 w-2 rounded-full bg-red-500 mt-2"/>

)}

</div>



<p className="text-xs text-slate-500 mt-1">

From {n.sender_name}

</p>


<p className="text-xs text-slate-400">

{new Date(n.created_at).toLocaleString()}

</p>



</div>


))


}



</div>

)}


</div>



</>

)}





{token ? (

<>


<Link
to="/profile"
className={navLinkClass("/profile")}
>
Profile
</Link>



<button
onClick={logout}
className="btn-danger"
>
Logout
</button>


</>


)

:

(

<>

<Link
to="/login"
className={navLinkClass("/login")}
>
Login
</Link>


<Link
to="/register"
className="btn-primary"
>
Get Started
</Link>


</>

)

}



</div>



</div>

</nav>

);

}


export default Navbar;
