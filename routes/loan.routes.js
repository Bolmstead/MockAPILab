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
 * This returns the newly created loan and nested assignments/borrowers:
 * 
 * Example Request Body: 
 [
    {
        "email": "testBarbra@gmail.com",
        "firstName": "Barbra",
        "lastName": "Johnson",
        "phone": "208-999-9799"
    },
        {
        "email": "testBob@gmail.com",
        "firstName": "Bob",
        "lastName": "Smith",
        "phone": "208-555-5555"
    }

]
 *
 * Returns:
 *  { loanId, assignments: [ {assignment}, {assignment} ]  }
 *
 **/

router.post("/create", createLoan);

/** GET / 
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
