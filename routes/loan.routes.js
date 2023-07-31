const { Router } = require("express");

const {
  getAllLoans,
  getLoanDetails,
  createLoan,
  deleteLoan,
  clearDB,
} = require("../controllers/loan.controller");

const router = new Router();

/** POST /
 *
 * Creates a new loan and assigns new borrowers to the loan.
 * This returns the newly created loan and nested borrowers:
 * 
 * Example Request Body: 
 [
    {
        "firstName": "Barbra",
        "lastName": "Johnson",
        "phone": "208-999-9799"
    },
        {
        "firstName": "Bob",
        "lastName": "Smith",
        "phone": "208-555-5555"
    }

]
 *
 * Returns:
 *  { loanId, borrowers: [ {borrower}, {borrower} ]  }
 *
 **/

router.post("/create", createLoan);

/** GET / 
 *
 * Returns all loans.
 * Returns:
 * [{ loanId, borrowers: [ {borrower}, {borrower} ]  }, ...]
 *
 **/
router.get("/all", getAllLoans);

/** GET /[loanId] => { [ {loan}, {loan} ] }
 *
 * Returns a loan's details based on loanId URL parameter provided.
 * Returns:
 * { loanId, borrowers: [ {borrower}, {borrower} ]  }
 *
 **/

router.get("/details/:loanId", getLoanDetails);

/** DELETE / 
 *
 * Deletes a loan based on loanId URL parameter provided
 *
 * Returns:
 *  { status: "success"  }
 *
 **/

router.delete("/delete/:loanId", deleteLoan);

/** DELETE
 *
 * Deletes all documents for all collections in DB
 * Returns:
 *  { status: "success"  }
 *
 **/

router.delete("/delete-all", clearDB);
module.exports = router;
