const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req,res)=>{

    try{

        const {name,email,password} = req.body;


        const existingUser = await db.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );


        if(existingUser.rows.length > 0){
            return res.status(400).json({
                message:"User already exists"
            });
        }


        const hashedPassword =
            await bcrypt.hash(password,10);


        const result = await db.query(
            `INSERT INTO users
            (name,email,password)
            VALUES($1,$2,$3)
            RETURNING id,name,email`,
            [
                name,
                email,
                hashedPassword
            ]
        );


        const user = result.rows[0];


        const token = jwt.sign(
            {
                id:user.id,
                email:user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        );


        res.status(201).json({
            user,
            token
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};


const login = async (req,res)=>{

    try{

        const {email,password} = req.body;


        const result = await db.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );


        if(result.rows.length === 0){
            return res.status(400).json({
                message:"User not found"
            });
        }


        const user = result.rows[0];


        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if(!isMatch){
            return res.status(400).json({
                message:"Invalid password"
            });
        }


        const token = jwt.sign(
            {
                id:user.id,
                email:user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        );


        res.json({
            message:"Login successful",
            token
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

module.exports = {
    register,
    login
};