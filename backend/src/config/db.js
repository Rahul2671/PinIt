const { Pool } = require("pg");
require("dotenv").config();

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized:false
    }
});

pool.query(`
SELECT table_schema, table_name 
FROM information_schema.tables
WHERE table_schema='public'
`)
.then(result=>{
    console.log("NODE TABLES:", result.rows);
})


pool.connect()
    .then(() => {
        console.log("PostgreSQL Connected ✅");
    })
    .catch((err) => {
        console.log("Database Connection Error ❌", err.message);
    });

module.exports = pool;