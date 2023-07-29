const express = require("express");
const router = express.Router();
const loanRoutes = require("./loan.routes");
const borrowerRoutes = require("./borrower.routes");

router.use("/loans", loanRoutes);
router.use("/borrowers", borrowerRoutes);

module.exports = router;
