"use strict";

const { connect } = require("mongoose");
const app = require("./app.js");

const port = process.env.PORT || 3000;

connect(process.env.MONGO_URI).then(() => {
  app.listen(port, function () {
    console.log(`Started on port:${port}`);
  });
});
