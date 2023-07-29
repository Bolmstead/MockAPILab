"use strict";

const Borrower = require("../models/borrower");
const Loan = require("../models/loan");
const Assignment = require("../models/assignment");

async function commonBeforeAll() {
  await Borrower.deleteMany({});
  await Loan.deleteMany({});
  await Assignment.deleteMany({});

  const testUser1 = await new Borrower({
    email: "testBorrower@test.com",
    firstName: "John",
    lastName: "Doe",
    phone: "222-222-2222",
  });
  const testUser2 = await new Borrower({
    email: "testBorrower@test.com",
    firstName: "Jane",
    lastName: "Johnson",
    phone: "333-333-3333",
  });

  const testLoan = await new Loan([testUser1, testUser2]);

  const pairId1 = uuid();

  const assignment1 = await new Assignment({
    pairId: pairId1,
    loan: testLoan,
    borrower: testUser1,
  });
  const pairId2 = uuid();

  const assignment2 = await new Assignment({
    pairId: pairId2,
    loan: testLoan,
    borrower: testUser1,
  });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,

};
