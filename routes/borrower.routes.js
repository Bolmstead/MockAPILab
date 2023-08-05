const { Router } = require("express");

const {
  updateBorrowerInfo,
  deleteBorrower,
} = require("../controllers/borrower.controller");
const router = new Router();

/** PATCH
 *
 *
 * Updates a Borrower's firstName, lastName, or phone when provided in body of payload.
 * loanId and pairId must be provided as URL parameters
 *
 * Payload:
 * {firstName, lastName, phone}
 *
 * Returns:
 * { firstName, lastName, phone }
 *
 **/

router.patch("/update/:loanId/:pairId", updateBorrowerInfo);

/** DELETE
 *
 * Deletes Borrower based on loanId and pairId provided as a URL parameter
 *
 * Returns:
 * { status: "message"  }
 *
 **/

router.delete("/delete/:loanId/:pairId", deleteBorrower);

module.exports = router;
