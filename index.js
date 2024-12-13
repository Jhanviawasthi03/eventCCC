const express = require("express");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const connectwithdb = require("./config/database.js"); 
require("dotenv").config();
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(hpp());


app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token. Please refresh the page and try again.",
    });
  }
  next(err);
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
