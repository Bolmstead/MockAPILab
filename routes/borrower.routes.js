const { Router } = require("express");

const { updateBorrowerInfo, deleteBorrower } = require("../controllers/borrower.controller");
const router = new Router();

/** PATCH /[loanId] => { [ {loan}, {loan} ] }
 *
 * Updates a Borrower's firstName, lastName, or phone if provided in body of payload
 * 
 * Payload:
 * {firstName, lastName, phone}
 * 
 * Returns:
 * { email, firstName, lastName, phone, assignments: [ {assignment}, {assignment} ]  }
 *
 **/


router.patch("/update", updateBorrowerInfo);

/** DELETE /[loanId] => { [ {loan}, {loan} ] }
 *
 * Deletes Borrower based on email or pairId provided
 * 
 * Returns:
 * { status: "message"  }
 *
 **/


router.delete("/delete", deleteBorrower)

module.exports = router;
