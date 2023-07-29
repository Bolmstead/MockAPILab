const Borrower = require("../models/borrower.model.js");
const Assignment = require("../models/assignment.model.js");
const Loan = require("../models/loan.model.js");

const ExpressError = require("../expressError.js");

async function updateBorrowerInfo(req, res, next) {
  try {
    const { email, pairId } = req.query;
    if (!email && !pairId) {
      throw new ExpressError(
        "Please provide Borrower email or pairId is query parameters to edit Borrower information",
        400
      );
    }

    const { firstName, lastName, phone } = req.body;
    let propertiesToChange = { firstName, lastName, phone };
    if (!firstName && !lastName && !phone) {
      throw new ExpressError(
        "Please provide Borrower email, firstName, or phone in body of request",
        400
      );
    }

    let borrower;
    if (email) {
      borrower = await Borrower.findOne({ email });
    } else if (pairId) {
      const assignment = await Assignment.findOne({ pairId }).populate(
        "borrower"
      );
      if (!assignment) {
        throw new ExpressError("Assignment not found", 404);
      }
      borrower = assignment.borrower;
    }

    if (borrower) {
      for (const key in propertiesToChange) {
        if (!propertiesToChange[key]) {
          continue;
        }
        borrower[key] = propertiesToChange[key];
      }
      let savedBorrower = await borrower.save();
      return res.json(savedBorrower);
    } else {
      throw new ExpressError("Borrower not found", 404);
    }
  } catch (error) {
    return next(error);
  }
}

async function deleteBorrower(req, res, next) {
  try {
    const { email, pairId } = req.query;
    if (!email && !pairId) {
      throw new ExpressError("Borrower not found", 404);
    }

    // Remove the Assignment from the Borrower
    let deletedBorrower, foundAssignment;
    if (email) {
      deletedBorrower = await Borrower.findOneAndDelete({ email }).populate(
        "assignments"
      );
    } else if (pairId) {
      const foundAssignment = await Assignment.findOne({ pairId }).populate(
        "borrower"
      );
      deletedBorrower = await Borrower.findOneAndDelete({
        _id: foundAssignment.borrower._id,
      }).populate("assignments");
    }

    // Remove the Assignment from the Loan
    if (deletedBorrower) {
      if (!foundAssignment) {
        foundAssignment = await Assignment.findOne({
          borrower: deletedBorrower,
        }).populate("borrower");
      }
      let foundLoan = await Loan.findById(foundAssignment.loan).populate(
        "assignments"
      );

      for (let assign of foundLoan.assignments) {
        if (assign.pairId === deletedBorrower.assignments[0].pairId) {
          let index = foundLoan.assignments.indexOf(assign);
          foundLoan.assignments.splice(index, 1);
        }
      }

      // Delete the Assignment
      let deletedAssignment = await Assignment.deleteOne({
        pairId: deletedBorrower.assignments[0].pairId,
      });

      await foundLoan.save();
      return res.json({ status: "success", loan: foundLoan });
    } else {
      throw new ExpressError("Borrower does not exist", 500);
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = { updateBorrowerInfo, deleteBorrower };
