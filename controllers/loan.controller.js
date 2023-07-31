const Loan = require("../models/loan.model.js");
const Borrower = require("../models/borrower.model.js");
const { v4: uuid } = require("uuid");
const ExpressError = require("../expressError.js");
const jsonschema = require("jsonschema");
const createLoanSchema = require("../schemas/createLoan.schema.json");

async function getAllLoans(req, res, next) {
  try {
    const allLoans = await Loan.find({}).populate({
      path: "borrowers",
    });

    return res.json(allLoans);
  } catch (error) {
    return next(error);
  }
}

async function getLoanDetails(req, res, next) {
  try {
    const { loanId } = req.params;

    if (!loanId) {
      throw new ExpressError("loanId not provided", 400);
    }

    const loan = await Loan.findOne({ loanId }).populate("borrowers");

    if (!loan) {
      throw new ExpressError("Loan not found", 404);
    }
    return res.json(loan);
  } catch (error) {
    return next(error);
  }
}

async function createLoan(req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, createLoanSchema);

    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs);
    }
    const loanId = uuid();

    const newLoan = new Loan({ ...req.body, loanId });

    await newLoan.save();
    console.log(
      "🚀 ~ file: loan.controller.js:51 ~ createLoan ~ newLoan:",
      newLoan
    );

    for (let borrower of req.body) {
      const pairId = uuid();

      const newBorrower = new Borrower({
        ...borrower,
        pairId,
      });

      const savedBorrower = await newBorrower.save();
      console.log(
        "🚀 ~ file: loan.controller.js:63 ~ createLoan ~ savedBorrower:",
        savedBorrower
      );

      newLoan.borrowers.push(savedBorrower);
      console.log(
        "🚀 ~ file: loan.controller.js:82 ~ createLoan ~ newLoan:",
        newLoan
      );
    }

    await newLoan.save();

    return res.status(201).json(newLoan);
  } catch (error) {
    return next(error);
  }
}

async function deleteLoan(req, res, next) {
  try {
    const { loanId } = req.params;

    if (!loanId) {
      throw new ExpressError(
        "Please provide a loanId in url parameters to delete Borrower",
        400
      );
    }

    // Delete the Loan
    let deletedLoan = await Loan.findOneAndDelete({ loanId }).populate(
      "borrowers"
    );

    if (!deletedLoan) {
      throw new ExpressError("Loan doesn't exist", 404);
    }

    return res.json({ status: "success" });
  } catch (error) {
    return next(error);
  }
}

async function clearDB(req, res, next) {
  try {
    await Loan.deleteMany();
    await Borrower.deleteMany();

    return res.json({ status: "success" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllLoans,
  getLoanDetails,
  createLoan,
  deleteLoan,
  clearDB,
};
