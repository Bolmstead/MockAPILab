const { Router } = require("express");

const { updateBorrowerInfo, deleteBorrower } = require("../controllers/borrower.controller");
const router = new Router();

/** PATCH /update?pairId="example" 
 *
 * 
 * Updates a Borrower's firstName, lastName, or phone when provided in body of payload
 * emailId or pairId must be provided in as a query string to this route
 * 
 * Payload:
 * {firstName, lastName, phone}
 * 
 * Returns:
 * { email, firstName, lastName, phone, assignments: [ {assignment}, {assignment} ]  }
 *
 **/


router.patch("/update", updateBorrowerInfo);

/** DELETE /delete?loanId="example" 
 *
 * Deletes Borrower based on email or pairId provided as a query parameter
 * 
 * Returns:
 * { status: "message"  }
 *
 **/


router.delete("/delete", deleteBorrower)

module.exports = router;
