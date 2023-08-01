const Borrower = require("../models/borrower.model.js");
const Loan = require("../models/loan.model.js");
const jsonschema = require("jsonschema");
const updateBorrowerSchema = require("../schemas/updateBorrower.schema.json");

const ExpressError = require("../expressError.js");

async function updateBorrowerInfo(req, res, next) {
  try {
    const { loanId, pairId } = req.params;
    if (!loanId || !pairId) {
      throw new ExpressError(
        "Please provide the loanId and pairId in url params of request",
        400
      );
    }

    const validator = jsonschema.validate(req.body, updateBorrowerSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs);
    }

    const { firstName, lastName, phone } = req.body;
    let propertiesToChange = { firstName, lastName, phone };
    if (!firstName && !lastName && !phone) {
      throw new ExpressError(
        "Please provide Borrower firstName, lastName, or phone in body of request",
        400
      );
    }

    let borrower;

    const foundLoan = await Loan.findOne({ loanId }).populate("borrowers");

    if (!foundLoan) {
      throw new ExpressError("Loan not found", 404);
    }

    for (let user of foundLoan.borrowers) {
      if (user.pairId === pairId) {
        borrower = user;
      }
    }

    if (!borrower) {
      throw new ExpressError("Borrower not found", 404);
    }

    // For each property that needs to change,
    // update it for the borrower
    for (const key in propertiesToChange) {
      if (!propertiesToChange[key]) {
        continue;
      }
      borrower[key] = propertiesToChange[key];
    }
    let savedBorrower = await borrower.save();
    return res.json(savedBorrower);
  } catch (error) {
    return next(error);
  }
}

async function deleteBorrower(req, res, next) {
  try {
    const { loanId, pairId } = req.params;

    if (!loanId || !pairId) {
      throw new ExpressError(
        "Please provide the loanId and pairId in url params of request",
        400
      );
    }

    let borrower;

    const foundLoan = await Loan.findOne({ loanId }).populate("borrowers");

    if (!foundLoan) {
      throw new ExpressError("Loan not found", 404);
    }

    for (let user of foundLoan.borrowers) {
      if (user.pairId === pairId) {
        borrower = user;
        let deleteResult = await Borrower.deleteOne({ pairId });

        if (!deleteResult) {
          throw new ExpressError("Unable to delete borrower", 500);
        }
        let index = foundLoan.borrowers.indexOf(user);
        foundLoan.borrowers.splice(index, 1);
        await foundLoan.save();
      }
    }

    if (!borrower) {
      throw new ExpressError("Borrower not found", 404);
    }

    return res.json({ status: "success", loan: foundLoan });
  } catch (error) {
    return next(error);
  }
}

module.exports = { updateBorrowerInfo, deleteBorrower };
