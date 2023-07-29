const { Router } = require("express");

const {
  getAllLoans,
  getLoanDetails,
  createLoan,
  deleteLoan,
} = require("../controllers/loan.controller");

const router = new Router();

/** POST / body: [{ user }, { user }] => { user, token }
 *
 * Creates a new loan and assigns new borrowers to the loan.
 * This returns the newly created loan and nested assignments/borrowers:
 *
 * Returns:
 *  { loanId, assignments: [ {assignment}, {assignment} ]  }
 *
 **/

router.post("/create", createLoan);

/** GET / => { [ {loan}, {loan} ] }
 *
 * Returns all loans.
 * Returns:
 * [{ loanId, assignments: [ {assignment}, {assignment} ]  }, ...]
 *
 **/
router.get("/all", getAllLoans);

/** GET /[loanId] => { [ {loan}, {loan} ] }
 *
 * Returns a loan's details based on loanId URL parameter provided.
 * Returns:
 * { loanId, assignments: [ {assignment}, {assignment} ]  }
 *
 **/

router.get("/details/:loanId", getLoanDetails);

/** DELETE / [{ user }, { user }] => { user, token }
 *
 * Creates a new loan and assigns new borrowers to the loan.
 * This returns the newly created loan and nested assignments/borrowers:
 *
 * Returns:
 *  { status: "success"  }
 *
 **/

router.delete("/delete/:loanId", deleteLoan);
module.exports = router;
