const express = require("express");
require("dotenv").config();

const app = express();
require("./models/borrower.model.js");
require("./models/loan.model.js");
require("./models/assignment.model.js");

const routes = require("./routes/index.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.get("/", (req, res) => {
  res.json({
    message: "✨ 👋🌏 ✨",
    stage: process.env.NODE_ENV,
  });
});

app.get("/ping", (req, res) => {
  res.json({
    message: "🏓",
  });
});

app.use(function (req, res, next) {
  return res.json({ error: { status: 404, message: "Not Found" } });
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
