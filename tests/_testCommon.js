"use strict";
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Borrower = require("../models/borrower.model.js");
const Loan = require("../models/loan.model.js");
const { v4: uuid } = require("uuid");

async function commonBeforeAll() {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}

async function commonBeforeEach() {
  // Create one loan with a borrower before every test

  const pairId = uuid();
  const loanId = uuid();

  const testUser1 = new Borrower({
    pairId,
    firstName: "John",
    lastName: "Doe",
    phone: "222-222-2222",
  });
  await testUser1.save();
  const testLoan = new Loan({ loanId });
  await testLoan.save();

  savedLoan.borrowers.push(testUser1);
  await savedLoan.save();
}

async function commonAfterEach() {
  // Clear Database after each test
  await Borrower.deleteMany({});
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
