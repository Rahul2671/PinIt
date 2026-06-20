const db = require("../config/db");


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


module.exports={
    getProfile
};