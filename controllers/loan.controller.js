const Loan = require("../models/loan.model.js");
const Borrower = require("../models/borrower.model.js");
const Assignment = require("../models/assignment.model.js");
const { v4: uuid } = require("uuid");
const ExpressError = require("../expressError.js");

async function getAllLoans(req, res, next) {
  try {
    const allLoans = await Loan.find({}).populate({
      path: "assignments",
      populate: [
        {
          path: "borrower",
          model: "Borrower",
        },
      ],
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

    const loan = await Loan.find({ loanId }).populate({
      path: "assignments",
      populate: "borrower",
    });

    if (loan.length == 0) {
      throw new ExpressError("Loan not found", 404);
    }
    return res.json(loan);
  } catch (error) {
    return next(error);
  }
}

async function createLoan(req, res, next) {
  try {
    let savedBorrowers = [];
    for (let borrower of req.body) {
      const newBorrower = new Borrower(borrower);

      const savedBorrower = await newBorrower.save();

      savedBorrowers.push(savedBorrower);
    }
    const loanId = uuid();

    const newLoan = new Loan({ ...req.body, loanId });
    let savedLoan = await newLoan.save();

    const savedAssignments = [];
    for (let borrower of savedBorrowers) {
      const pairId = uuid();

      const assignmentObject = {
        pairId,
        loan: savedLoan._id,
        borrower: borrower._id,
      };

      const newAssignment = new Assignment(assignmentObject);
      const savedAssignment = await newAssignment.save();

      borrower.assignments = savedAssignment;
      savedAssignments.push(savedAssignment);
      await borrower.save();
    }

    savedLoan.assignments = savedAssignments;

    savedLoan = await savedLoan.save();

    return res.status(201).json(savedLoan);
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
      "assignments"
    );

    if (!deletedLoan) {
      throw new ExpressError("Loan doesn't exist", 404);
    }

    // Delete the Assignments with that Loan
    let allLoanAssignments = await Assignment.find({ loan: deletedLoan._id });
    await Assignment.deleteMany({
      loan: deletedLoan._id,
    });

    // Remove the Assignments from the Users
    for (let assign of allLoanAssignments) {
      const borrower = await Borrower.findOne(assign.borrower).populate(
        "assignments"
      );

      for (let borrowersAssign of borrower.assignments) {
        if (borrowersAssign.pairId === assign.pairId) {
          let index = borrower.assignments.indexOf(borrowersAssign);
          borrower.assignments.splice(index, 1);
          await borrower.save();
        }
      }
    }

    return res.json({ status: "success" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllLoans, getLoanDetails, createLoan, deleteLoan };
