const express = require("express");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const connectwithdb = require("./config/database.js"); 
require("dotenv").config();
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(
  cors({
    origin: "https://event-ccc.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
  })
);



app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use((error, req, res, next) => {

  if (error && error.message === "invalid csrf token") {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed.",
    });
  }

  next(error);
});

const userRoutes = require("./routes/user");
app.use("/api/v1",  csrfProtection,userRoutes);

connectwithdb();

app.listen(PORT, () => {
  console.log(`App is started at port no ${PORT}`);
});

app.get("/", (req, res) => {
  res.send('<h1>This is my homepage</h1>');
});
