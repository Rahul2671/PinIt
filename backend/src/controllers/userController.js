const db = require("../config/db");



// GET PROFILE

const getProfile = async(req,res)=>{

    try{

        const userId = req.user.id;


        const result = await db.query(
            `
            SELECT id,name,email
            FROM users
            WHERE id=$1
            `,
            [userId]
        );


        res.json(result.rows[0]);


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};





// SUBSCRIBE KEYWORD

const subscribe = async(req,res)=>{

    try{

        const user_id = req.user.id;

        const { keyword } = req.body;



        if(!keyword || !keyword.trim()){

            return res.status(400).json({
                message:"Keyword required"
            });

        }



        await db.query(
            `
            INSERT INTO subscriptions
            (user_id,keyword)
            VALUES($1,$2)
            `,
            [
                user_id,
                keyword.trim().toLowerCase()
            ]
        );



        res.json({
            message:"Subscribed successfully"
        });


    }
    catch(error){


        if(error.code==="23505"){

            return res.status(400).json({
                message:"Already subscribed"
            });

        }


        res.status(500).json({
            message:error.message
        });

    }

};






// GET SUBSCRIPTIONS


const getSubscriptions = async(req,res)=>{


    try{


        const result = await db.query(
            `
            SELECT *
            FROM subscriptions
            WHERE user_id=$1
            ORDER BY created_at DESC
            `,
            [
                req.user.id
            ]
        );


        res.json(result.rows);



    }
    catch(error){


        res.status(500).json({
            message:error.message
        });


    }


};






// REMOVE SUBSCRIPTION


const removeSubscription = async(req,res)=>{


    try{


        const keyword =
        req.params.keyword;



        await db.query(
            `
            DELETE FROM subscriptions
            WHERE user_id=$1
            AND keyword=$2
            `,
            [
                req.user.id,
                keyword.toLowerCase()
            ]
        );



        res.json({
            message:"Subscription removed"
        });



    }
    catch(error){


        res.status(500).json({
            message:error.message
        });


    }


};





module.exports={

    getProfile,
    subscribe,
    getSubscriptions,
    removeSubscription

};
