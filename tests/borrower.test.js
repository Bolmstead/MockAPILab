"use strict";

const request = require("supertest");
process.env.NODE_ENV = "test";

const app = require("../app.js");
const Borrower = require("../models/borrower.model.js");
const Loan = require("../models/loan.model.js");
const Assignment = require("../models/assignment.model.js");

const {
  commonBeforeEach,
  commonAfterEach,
  commonBeforeAll,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/******* PATCH /loan */

describe("PATCH /borrowers/update", function () {
  // all fields changed except for the unique ID: email
  const newUserDetails = {
    firstName: "John's new first name",
    lastName: "John's new last name",
    phone: "111-111-1112",
  };

  const currentUserEmail = "testBorrower1@test.com";

  test("works: edits borrowers details for all fields (pairId provided as query string)", async function () {
    const randomAssignment = await Loan.findOne();

    const resp = await request(app)
      .patch(`/loans/update?pairId=${randomAssignment.pairId}`)
      .send(newUserDetails);

    const editedUser = await Borrower.findOne();

    expect(resp.status).toEqual(200);
    expect(resp.body.firstName).toEqual(newUserDetails.firstName);
    expect(resp.body.lastName).toEqual(newUserDetails.lastName);
    expect(resp.body.phone).toEqual(newUserDetails.phone);

    expect(editedUser.firstName).toEqual(newUserDetails.firstName);
    expect(editedUser.lastName).toEqual(newUserDetails.lastName);
    expect(editedUser.phone).toEqual(newUserDetails.phone);
  }, 7000);

  test("works: edits borrowers details for all fields (emailId provided as query string)", async function () {
    const resp = await request(app)
      .patch(`/loans/update?emailId=${currentUserEmail}`)
      .send(newUserDetails);

    const editedUser = await Borrower.findOne();

    expect(resp.status).toEqual(200);
    expect(resp.body.firstName).toEqual(newUserDetails.firstName);
    expect(resp.body.lastName).toEqual(newUserDetails.lastName);
    expect(resp.body.phone).toEqual(newUserDetails.phone);

    expect(editedUser.firstName).toEqual(newUserDetails.firstName);
    expect(editedUser.lastName).toEqual(newUserDetails.lastName);
    expect(editedUser.phone).toEqual(newUserDetails.phone);
  }, 7000);

  test("works: edits borrowers details for one field", async function () {
    const oneField = {
      firstName: "John's new first name",
    };
    const randomAssignment = await Loan.findOne();

    const resp = await request(app)
      .patch(`/loans/update?pairId=${randomAssignment.pairId}`)
      .send(oneField);

    const editedUser = await Borrower.findOne();

    expect(resp.status).toEqual(200);
    expect(resp.body.firstName).toEqual(oneField.firstName);
    expect(editedUser.firstName).toEqual(oneField.firstName);
  }, 7000);

  test("Bad Request error when not provided a valid query string", async function () {
    const resp = await request(app)
      .patch(`/loans/update?phone=${newUserDetails.phone}`)
      .send(newUserDetails);

    const editedUser = await Borrower.findOne();

    expect(resp.status).toEqual(200);
    expect(resp.body.firstName).toEqual(oneField.firstName);
    expect(editedUser.firstName).toEqual(oneField.firstName);
  }, 7000);

  test("Not Found error from non-existent loanId", async function () {
    const resp = await request(app).get(`/loans/details/1234`);
    expect(resp.status).toEqual(404);
  }, 7000);
});

describe("DELETE /delete/:loanId", function () {
  test("works: deletes loan", async function () {
    const randomLoan = await Loan.findOne();
    const resp = await request(app).delete(
      `/loans/delete/${randomLoan.loanId}`
    );

    const allLoans = await Loan.find();
    const allLoanAssignments = await Assignment.find();

    expect(resp.status).toEqual(200);
    expect(allLoans.length).toEqual(0);
    expect(allLoanAssignments.length).toEqual(0);
  }, 7000);

  test("Not Found error from non-existent loanId", async function () {
    const resp = await request(app).get(`/loans/delete/1234`);
    expect(resp.status).toEqual(404);
  }, 7000);
});

describe("DELETE /delete-all", function () {
  test("works: deletes all loans", async function () {
    const resp = await request(app).delete(`/loans/delete-all`);

    const allLoans = await Loan.find();
    const allLoanAssignments = await Assignment.find();

    expect(resp.status).toEqual(200);
    expect(allLoans.length).toEqual(0);
    expect(allLoanAssignments.length).toEqual(0);
  }, 7000);
});
