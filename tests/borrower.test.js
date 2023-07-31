"use strict";

const request = require("supertest");
process.env.NODE_ENV = "test";

const app = require("../app.js");
const Borrower = require("../models/borrower.model.js");
const Loan = require("../models/loan.model.js");

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

describe("PATCH /borrowers/update/:loanId/:pairId", function () {
  // all fields changed except for the unique ID: email
  const newUserDetails = {
    firstName: "John's new first name",
    lastName: "John's new last name",
    phone: "111-111-1112",
  };

  const currentUserEmail = "testBorrower1@test.com";

  test("works: edits borrowers details for all fields (pairId provided as query string)", async function () {
    const randomAssignment = await Assignment.findOne();

    const resp = await request(app)
      .patch(`/borrowers/update/pairId=${randomAssignment.pairId}`)
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
    const loan = await Loan.findOne().populate("borrowers");
    const resp = await request(app)
      .patch(`/borrowers/update/${loan.loanId}/${loan.borrowers[0].pairId}`)
      .send(newUserDetails);

    const editedUser = await Borrower.findOne();

    expect(resp.status).toEqual(200);

    // Response matches new User information
    expect(resp.body.firstName).toEqual(newUserDetails.firstName);
    expect(resp.body.lastName).toEqual(newUserDetails.lastName);
    expect(resp.body.phone).toEqual(newUserDetails.phone);

    // User from DB matches new User information
    expect(editedUser.firstName).toEqual(newUserDetails.firstName);
    expect(editedUser.lastName).toEqual(newUserDetails.lastName);
    expect(editedUser.phone).toEqual(newUserDetails.phone);
  }, 7000);

  test("works: edits borrowers details for one field", async function () {
    const oneField = {
      firstName: "John's new first name",
    };
    const loan = await Loan.findOne().populate("borrowers");
    const originalUser = await Borrower.findOne();

    const resp = await request(app)
      .patch(`/borrowers/update/${loan.loanId}/${loan.borrowers[0].pairId}`)
      .send(oneField);

    const editedUser = await Borrower.findOne();

    expect(resp.status).toEqual(200);
    expect(resp.body.firstName).toEqual(oneField.firstName);
    expect(editedUser.firstName).toEqual(oneField.firstName);
    // original User firstName shouldn't match the edited firstName
    expect(originalUser.firstName).not.toEqual(editedUser.firstName);
  }, 7000);

  test("Bad Request error when request body includes invalid types", async function () {
    const invalidUserDetails = {
      ...newUserDetails,
      firstName: 123,
    };
    const resp = await request(app)
      .patch(`/borrowers/update?email=${currentUserEmail}`)
      .send(invalidUserDetails);

    expect(resp.status).toEqual(500);
    expect(resp.error).toBeTruthy();
  }, 7000);

  test("Not Found error from non-existent loan", async function () {
    const loan = await Loan.findOne().populate("borrowers");

    const resp = await request(app)
      .patch(`/borrowers/update/123/${loan.borrowers[0].pairId}`)
      .send(newUserDetails);

    expect(resp.status).toEqual(404);
    expect(resp.error).toBeTruthy();
  }, 7000);

  test("Not Found error from non-existent borrower", async function () {
    const loan = await Loan.findOne().populate("borrowers");

    const resp = await request(app)
      .patch(`/borrowers/update/${loan.loanId}/123`)
      .send(newUserDetails);

    expect(resp.status).toEqual(404);
    expect(resp.error).toBeTruthy();
  }, 7000);
});

describe("DELETE /delete/:loanId/:pairId", function () {
  test("works: deletes borrower based on pairId and loanId", async function () {
    const loan = await Loan.findOne().populate("borrowers");
    const borrower = await Borrower.findOne({
      pairId: loan.borrowers[0].pairId,
    });

    const resp = await request(app).delete(
      `/borrowers/delete/${loan.loanId}/${loan.borrowers[0].pairId}`
    );

    const deletedBorrower = await Borrower.findOne({
      pairId: borrower.pairId,
    });

    expect(resp.status).toEqual(200);
    expect(deletedBorrower).toBeFalsey();
  }, 7000);

  test("Not Found error from non-existent loan", async function () {
    const loan = await Loan.findOne().populate("borrowers");

    const resp = await request(app).delete(
      `/borrowers/delete/123/${loan.borrowers[0].pairId}`
    );
    expect(resp.status).toEqual(404);
  }, 7000);

  test("Not Found error from non-existent pairId", async function () {
    const loan = await Loan.findOne().populate("borrowers");

    const resp = await request(app).delete(
      `/borrowers/delete/${loan.loanId}/123`
    );
    expect(resp.status).toEqual(404);
  }, 7000);
});
