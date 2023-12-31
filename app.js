const express = require("express");
require("dotenv").config();
const cors = require('cors');


const app = express();
require("./models/borrower.model.js");
require("./models/loan.model.js");

const routes = require("./routes/index.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/", routes);

app.get("/", (req, res) => {
  res.json({
    message: "✨ 👋🌏 ✨",
  });
});

app.get("/ping", (req, res) => {
  res.json({
    message: "🏓",
  });
});

app.use(function (req, res, next) {
  return res.status(404).json({ error: { status: 404, message: "Not Found" } });
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
