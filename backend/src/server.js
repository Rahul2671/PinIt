const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const migrate = require("./config/migrate");

const authRoutes = require("./routes/authRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
  })
);


app.use(express.json());


// routes

app.use(
  "/api/users",
  userRoutes
);


app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/notices",
  noticeRoutes
);



app.get("/",(req,res)=>{
  res.json({
    message:"PinIt Backend Running 🚀"
  });
});


const PORT = process.env.PORT || 5000;

migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Migration failed ❌", err.message);
    process.exit(1);
  });