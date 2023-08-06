"use strict";
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Borrower = require("../models/borrower.model.js");
const Loan = require("../models/loan.model.js");
const generateRandomNumber = require("../helpers/generateRandomNumber.js");
async function commonBeforeAll() {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}

async function commonBeforeEach() {
  // Create one loan with a borrower before every test

  const pairId = generateRandomNumber();
  const loanId = generateRandomNumber();

  const testUser1 = new Borrower({
    pairId,
    firstName: "John",
    lastName: "Doe",
    phone: 1111111111,
  });
  await testUser1.save();
  const testLoan = new Loan({ loanId });
  await testLoan.save();

  testLoan.borrowers.push(testUser1);
  await testLoan.save();
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
