"use strict";
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Borrower = require("../models/borrower.model.js");
const Loan = require("../models/loan.model.js");
const Assignment = require("../models/assignment.model.js");
const { v4: uuid } = require("uuid");

async function commonBeforeAll() {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}

async function commonBeforeEach() {
  // Create one loan with a borrower before every test
  const testUser1 = new Borrower({
    email: "testBorrower1@test.com",
    firstName: "John",
    lastName: "Doe",
    phone: "222-222-2222",
  });

  const savedUser = await testUser1.save();
  const loanId = uuid();
  const testLoan = new Loan({ loanId });
  const savedLoan = await testLoan.save();
  const pairId1 = uuid();
  const assignment1 = new Assignment({
    pairId: pairId1,
    loan: savedLoan,
    borrower: savedUser,
  });

  const savedAssignment = await assignment1.save();

  savedLoan.assignments.push(savedAssignment);
  await savedLoan.save();
  savedUser.assignments.push(savedAssignment);
  await savedUser.save();
}

async function commonAfterEach() {
  // Clear Database after each test
  await Borrower.deleteMany({});
  await Assignment.deleteMany({});
  await Loan.deleteMany({});
}

async function commonAfterAll() {
  await mongoose.disconnect();
  await mongoose.connection.close();
}

module.exports = {
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  commonBeforeAll,
};
