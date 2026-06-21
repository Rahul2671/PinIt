const db = require("../config/db");

const noticeSelect = `
  SELECT
    notices.*,
    users.name AS poster_name,
    users.email AS poster_email,
    COUNT(DISTINCT upvotes.id) AS upvotes,
    COUNT(DISTINCT team_interests.id) AS interest_count,
    COALESCE(
      BOOL_OR(team_interests.user_id=$1),
      false
    ) AS interested
  FROM notices
  LEFT JOIN users ON notices.user_id = users.id
  LEFT JOIN upvotes ON notices.id = upvotes.notice_id
  LEFT JOIN team_interests ON notices.id = team_interests.notice_id
`;

const noticeGroupBy = `
  GROUP BY notices.id, users.name, users.email
  ORDER BY notices.created_at DESC
`;


// CREATE NOTICE
const createNotice = async (req, res) => {
  try {

    const {
      title,
      category,
      community,
      description,
      is_team_finder,
      team_intent,
      event_name,
      event_type,
      roles_needed,
      team_size_needed,
      contact_info,
      event_hub_url,
    } = req.body;


    const user_id = req.user.id;

    const teamFinder = Boolean(is_team_finder);


    const result = await db.query(
      `
      INSERT INTO notices (
        title,
        category,
        community,
        description,
        user_id,
        is_team_finder,
        team_intent,
        event_name,
        event_type,
        roles_needed,
        team_size_needed,
        contact_info,
        event_hub_url
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
      `,
      [
        title,
        category,
        community,
        description,
        user_id,
        teamFinder,
        teamFinder ? team_intent : null,
        teamFinder ? event_name : null,
        teamFinder ? event_type : null,
        teamFinder ? roles_needed : null,
        teamFinder ? team_size_needed : null,
        contact_info || null,
        event_hub_url || null
      ]
    );


    res.status(201).json(result.rows[0]);


  } catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};




// GET ALL
const getNotices = async(req,res)=>{

try{

const user_id = req.user ? req.user.id : null;

const result =
await db.query(
`
${noticeSelect}
${noticeGroupBy}
`,
[
user_id
]
);

res.json(result.rows);

}catch(error){

console.log(error);

res.status(500).json({
message:error.message
});

}

};


// GET SINGLE
const getNoticeById = async(req,res)=>{

try{

const {id}=req.params;


const result =
await db.query(
`
${noticeSelect},
BOOL_OR(team_interests.user_id=$1) AS interested
WHERE notices.id=$2
${noticeGroupBy}
`,
[
req.user.id,
id
]
);


if(result.rows.length===0)
return res.status(404).json({
message:"Notice not found"
});


res.json(result.rows[0]);


}catch(error){

res.status(500).json({
message:error.message
});

}

};


// MY NOTICES
const getMyNotices = async(req,res)=>{

try{

const user_id=req.user.id;


const result =
await db.query(
`
${noticeSelect},
BOOL_OR(team_interests.user_id=$1) AS interested
WHERE notices.user_id=$1
${noticeGroupBy}
`,
[
user_id
]
);


res.json(result.rows);


}catch(error){

res.status(500).json({
message:error.message
});

}

};





// DELETE
const deleteNotice = async(req,res)=>{

try{


const {id}=req.params;

const user_id=req.user.id;


const result =
await db.query(
`
DELETE FROM notices
WHERE id=$1 AND user_id=$2
RETURNING *
`,
[id,user_id]
);


if(result.rows.length===0){

return res.status(403).json({
message:"Not authorized"
});

}


res.json({
message:"Notice deleted successfully"
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};







// UPVOTE
const upvoteNotice = async(req,res)=>{

try{

const notice_id=req.params.id;
const user_id=req.user.id;


await db.query(
`
INSERT INTO upvotes
(user_id,notice_id)
VALUES($1,$2)
`,
[
user_id,
notice_id
]
);


res.json({
message:"Upvoted"
});


}catch(error){

if(error.code==="23505")
return res.status(400).json({
message:"Already upvoted"
});


res.status(500).json({
message:error.message
});

}

};








// TEAM INTEREST
const expressInterest = async(req,res)=>{


try{


const notice_id=req.params.id;

const user_id=req.user.id;


const notice =
await db.query(
`
SELECT user_id,title
FROM notices
WHERE id=$1
`,
[notice_id]
);



if(!notice.rows.length)
return res.status(404).json({
message:"Notice not found"
});



const owner =
notice.rows[0].user_id;



await db.query(
`
INSERT INTO team_interests
(notice_id,user_id,message)
VALUES($1,$2,$3)
`,
[
notice_id,
user_id,
"Interested in your team"
]
);



// 🔔 notification
await db.query(
`
INSERT INTO notifications
(user_id,notice_id,sender_id,message)
VALUES($1,$2,$3,$4)
`,
[
owner,
notice_id,
user_id,
"Someone is interested in your team finder post"
]
);



res.json({
message:"Interest sent"
});



}catch(error){

if(error.code==="23505")
return res.status(400).json({
message:"Already interested"
});


res.status(500).json({
message:error.message
});

}

};



// REMOVE TEAM INTEREST
const removeInterest = async(req,res)=>{

try{

const notice_id=req.params.id;
const user_id=req.user.id;


const result = await db.query(
`
DELETE FROM team_interests
WHERE notice_id=$1
AND user_id=$2
RETURNING *
`,
[
notice_id,
user_id
]
);


if(result.rows.length===0){

return res.status(400).json({
message:"Interest not found"
});

}


res.json({
message:"Interest removed"
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};


// OWNER VIEW INTERESTS
const getNoticeInterests = async(req,res)=>{

try{


const notice_id=req.params.id;

const user_id=req.user.id;


const check =
await db.query(
`
SELECT user_id
FROM notices
WHERE id=$1
`,
[notice_id]
);



if(check.rows[0].user_id!==user_id)
return res.status(403).json({
message:"Not authorized"
});



const result =
await db.query(
`
SELECT 
team_interests.id,
users.name,
users.email,
team_interests.created_at
FROM team_interests
JOIN users
ON users.id=team_interests.user_id
WHERE notice_id=$1
`,
[notice_id]
);



res.json(result.rows);



}catch(error){

res.status(500).json({
message:error.message
});

}

};








// LOST ITEM REPLY
const addReply = async(req,res)=>{

try{

const notice_id=req.params.id;
const user_id=req.user.id;
const {message}=req.body;


if(!message?.trim()){
return res.status(400).json({
message:"Message required"
});
}


const notice = await db.query(
`
SELECT user_id
FROM notices
WHERE id=$1
`,
[notice_id]
);


if(notice.rows.length===0){
return res.status(404).json({
message:"Notice not found"
});
}


const owner = notice.rows[0].user_id;



await db.query(
`
INSERT INTO notice_replies
(notice_id,user_id,message)
VALUES($1,$2,$3)
`,
[
notice_id,
user_id,
message
]
);



// don't notify yourself
if(owner !== user_id){

await db.query(
`
INSERT INTO notifications
(user_id,notice_id,sender_id,message)
VALUES($1,$2,$3,$4)
`,
[
owner,
notice_id,
user_id,
"Someone replied to your notice"
]
);

}


res.json({
message:"Reply sent"
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};





// GET REPLIES
const getReplies = async(req,res)=>{

try{

const result = await db.query(
`
SELECT
notice_replies.id,
notice_replies.message,
notice_replies.created_at,
users.name,
users.email
FROM notice_replies
JOIN users
ON users.id = notice_replies.user_id
WHERE notice_replies.notice_id=$1
ORDER BY notice_replies.created_at DESC
`,
[
req.params.id
]
);


res.json(result.rows);


}catch(error){

res.status(500).json({
message:error.message
});

}

};




// NOTIFICATIONS
const getNotifications = async(req,res)=>{


try{


const result = await db.query(
`
SELECT
notifications.*,
users.name AS sender_name
FROM notifications
JOIN users
ON users.id=notifications.sender_id
WHERE notifications.user_id=$1
ORDER BY notifications.created_at DESC
`,
[
req.user.id
]
);


res.json(result.rows);



}catch(error){

res.status(500).json({
message:error.message
});

}

};




// MARK READ
const markNotificationRead = async(req,res)=>{


await db.query(
`
UPDATE notifications
SET is_read=true
WHERE id=$1
`,
[
req.params.id
]
);


res.json({
message:"read"
});


};

// UPDATE TEAM STATUS
const updateTeamStatus = async(req,res)=>{

try{

const {team_status}=req.body;
const notice_id=req.params.id;
const user_id=req.user.id;


if(!["open","full"].includes(team_status)){
return res.status(400).json({
message:"Invalid status"
});
}



const result = await db.query(
`
UPDATE notices
SET team_status=$1
WHERE id=$2 AND user_id=$3 AND is_team_finder=true
RETURNING *
`,
[
team_status,
notice_id,
user_id
]
);



if(result.rows.length===0){

return res.status(403).json({
message:"Not authorized"
});

}



res.json(result.rows[0]);


}catch(error){

res.status(500).json({
message:error.message
});

}

};

const resolveNotice = async(req,res)=>{

try{

const id=req.params.id;
const user_id=req.user.id;


const result = await db.query(
`
UPDATE notices
SET notice_status='resolved'
WHERE id=$1 AND user_id=$2
RETURNING *
`,
[
id,
user_id
]
);


if(result.rows.length===0){

return res.status(403).json({
message:"Not authorized"
});

}


res.json(result.rows[0]);


}catch(error){

res.status(500).json({
message:error.message
});

}

};


module.exports={
createNotice,
getNotices,
getNoticeById,
getMyNotices,
deleteNotice,
upvoteNotice,
expressInterest,
removeInterest,
getNoticeInterests,
addReply,
getReplies,
getNotifications,
markNotificationRead,
updateTeamStatus,
resolveNotice
};
