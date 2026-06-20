import { useState } from "react";
import axios from "axios";


function ReplyModal({ noticeId, onClose }) {

  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);



  const sendReply=async()=>{


    if(!message.trim()){
      alert("Enter message");
      return;
    }


    try{

      setLoading(true);


      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notices/${noticeId}/reply`,
        {
          message
        },
        {
          headers:{
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
          }
        }
      );


      alert("Reply sent to owner 🔔");

      onClose();


    }catch(error){

      alert(
        error.response?.data?.message ||
        "Failed to send reply"
      );

    }finally{

      setLoading(false);

    }


  };



return (

<div

className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"

onClick={onClose}

>


<div

onClick={(e)=>e.stopPropagation()}

className="bg-white rounded-xl p-5 w-[90%] max-w-md"

>


<h2 className="text-lg font-semibold mb-3">

Reply to owner

</h2>



<textarea

value={message}

onChange={(e)=>setMessage(e.target.value)}

placeholder="Write what you know..."

className="w-full border rounded-lg p-3 h-32"

/>



<div className="flex justify-end gap-2 mt-4">


<button

onClick={onClose}

className="btn-secondary"

>

Cancel

</button>



<button

disabled={loading}

onClick={sendReply}

className="btn-primary"

>

{loading ? "Sending..." : "Send"}

</button>


</div>


</div>


</div>

);


}


export default ReplyModal;