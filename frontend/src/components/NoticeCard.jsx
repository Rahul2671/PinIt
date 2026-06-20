import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShareModal from "./ShareModal";
import ReplyModal from "./ReplyModal";

import {
  openEventHub,
  openContactLink,
} from "../utils/integrations";

import { getAuthUserId } from "../utils/auth";


function NoticeCard({ notice, refresh }) {

const navigate = useNavigate();


const {
id,
user_id,
title,
category,
community,
description,
upvotes: initialUpvotes,
is_team_finder,
event_name,
event_type,
team_status,
interest_count,
poster_name,
poster_email,

}=notice;



const [upvotes,setUpvotes]=useState(Number(initialUpvotes)||0);

const [interests,setInterests]=useState(Number(interest_count)||0);

const [interested,setInterested]=useState(false);

const [status,setStatus]=useState(team_status || "open");


const [showShare,setShowShare]=useState(false);

const [showReply,setShowReply]=useState(false);


// NEW
const [showReplies,setShowReplies]=useState(false);
const [replies,setReplies]=useState([]);




const currentUserId=getAuthUserId();


const isOwner =
currentUserId &&
Number(user_id)===Number(currentUserId);



const isTeamFinder=Boolean(is_team_finder);

const isTeamFull=status==="full";






const deleteNotice=async()=>{

const token=localStorage.getItem("token");


try{

await axios.delete(
`${import.meta.env.VITE_API_URL}/api/notices/${id}`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);


refresh?.();


}catch(error){

alert(
error.response?.data?.message ||
"Delete failed"
);

}

};






const upvoteNotice=async()=>{


const token=localStorage.getItem("token");


if(!token){
alert("Login required");
return;
}


try{


await axios.post(

`${import.meta.env.VITE_API_URL}/api/notices/${id}/upvote`,
{},
{
headers:{
Authorization:`Bearer ${token}`
}
}

);


setUpvotes(p=>p+1);



}catch(error){


if(error.response?.status===400)
alert("Already upvoted");


}

};




const expressInterest=async()=>{

const token=localStorage.getItem("token");


try{

if(interested){

await axios.delete(
`${import.meta.env.VITE_API_URL}/api/notices/${id}/interest`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);


setInterested(false);
setInterests(p=>p-1);

alert("Interest removed");


}else{


await axios.post(
`${import.meta.env.VITE_API_URL}/api/notices/${id}/interest`,
{},
{
headers:{
Authorization:`Bearer ${token}`
}
}
);


setInterested(true);
setInterests(p=>p+1);

alert("Interest sent");

}


}catch(error){

alert(
error.response?.data?.message ||
"Failed"
);

}

};



const contactUser=(email,name)=>{


openContactLink(
email,
`Hi ${name}, regarding PinIt notice "${title}"`
);


};







// NEW FETCH REPLIES

const fetchReplies=async()=>{


try{


const res=await axios.get(

`${import.meta.env.VITE_API_URL}/api/notices/${id}/replies`,

{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}

);


setReplies(res.data);

setShowReplies(true);



}catch(error){

alert(
error.response?.data?.message ||
"Could not load replies"
);

}


};







return (


<article

onClick={()=>navigate(`/notice/${id}`)}

className="card card-hover flex h-full flex-col cursor-pointer"

>



<div className="flex justify-between gap-3">


<div>

<h2 className="text-lg font-semibold">

{title}

</h2>


{isTeamFinder &&

<p className="text-violet-600 text-sm">

{event_name}

{event_type ? ` · ${event_type}`:""}

</p>

}


</div>



<div className="flex gap-2">


<span className="badge-indigo">

{category}

</span>


<span className="badge-emerald">

{community}

</span>


</div>


</div>





<p className="mt-4 flex-1 text-sm text-slate-600">

{description}

</p>







<div className="mt-4 flex flex-wrap gap-2">





{category==="Events" &&

<button

onClick={(e)=>{

e.stopPropagation();

openEventHub(notice.event_hub_url)

}}

className="btn-secondary"

>

View Event

</button>

}






{category==="Lost & Found" && isOwner &&

<>

<button

onClick={(e)=>{

e.stopPropagation();

setShowShare(true)

}}

className="btn-secondary"

>

Share WhatsApp

</button>




<button

onClick={(e)=>{

e.stopPropagation();

showReplies 
? setShowReplies(false)
: fetchReplies();

}}

className="btn-secondary"

>

{showReplies ? "Hide Replies" : "💬 Replies"}

</button>

</>

}







{category==="Lost & Found" && !isOwner &&


<button

onClick={(e)=>{

e.stopPropagation();

setShowReply(true)

}}

className="btn-secondary"

>

💬 Reply

</button>


}






{isTeamFinder && !isOwner && !isTeamFull &&


<button

onClick={(e)=>{

e.stopPropagation();

expressInterest()

}}

className={
interested
? "btn-danger"
: "btn-primary"
}
  
>

{interested ? "Undo Interest" : "Interested"}

</button>


}





{isTeamFinder && !isOwner &&


<button

onClick={(e)=>{

e.stopPropagation();

contactUser(
poster_email,
poster_name
)

}}

className="btn-secondary"

>

Contact

</button>


}





</div>







{/* REPLIES VIEW */}


{showReplies &&


<div

onClick={(e)=>e.stopPropagation()}

className="mt-4 rounded-lg bg-slate-50 p-3"

>


<h3 className="font-semibold mb-2">

Replies

</h3>




{
replies.length===0 &&

<p className="text-sm text-slate-500">

No replies yet

</p>

}




{

replies.map(reply=>(


<div

key={reply.id}

className="border-b py-2"

>


<p className="font-medium text-sm">

{reply.name}

</p>



<p className="text-sm text-slate-600">

{reply.message}

</p>




<button

onClick={()=>contactUser(reply.email,reply.name)}

className="btn-secondary text-xs mt-2"

>

Contact

</button>



</div>


))

}



</div>


}










<div className="mt-4 flex justify-between border-t pt-3">


<button

onClick={(e)=>{

e.stopPropagation();

upvoteNotice()

}}

>

👍 {upvotes}

</button>





{isOwner &&

<button

onClick={(e)=>{

e.stopPropagation();

deleteNotice()

}}

className="text-red-500"

>

Delete

</button>

}


</div>








{showShare &&

<ShareModal

notice={notice}

onClose={()=>setShowShare(false)}

/>

}







{showReply &&

<ReplyModal

noticeId={id}

onClose={()=>setShowReply(false)}

/>

}





</article>


);


}


export default NoticeCard;
