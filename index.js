const express = require("express");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const connectwithdb = require("./config/database.js"); 
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(hpp());

const userRoutes = require("./routes/user");
app.use("/api/v1", userRoutes);

connectwithdb();

app.listen(PORT, () => {
  console.log(`App is started at port no ${PORT}`);
});

app.get("/", (req, res) => {
  res.send('<h1>This is my homepage</h1>');
});
