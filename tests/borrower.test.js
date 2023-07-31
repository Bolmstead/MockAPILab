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
    const randomAssignment = await Assignment.findOne();

    const resp = await request(app)
      .patch(`/borrowers/update?pairId=${randomAssignment.pairId}`)
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
      .patch(`/borrowers/update?email=${currentUserEmail}`)
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
    const randomAssignment = await Assignment.findOne();

    const resp = await request(app)
      .patch(`/borrowers/update?pairId=${randomAssignment.pairId}`)
      .send(oneField);

    const editedUser = await Borrower.findOne();

    expect(resp.status).toEqual(200);
    expect(resp.body.firstName).toEqual(oneField.firstName);
    expect(editedUser.firstName).toEqual(oneField.firstName);
  }, 7000);

  test("Bad Request error when not provided a valid query string", async function () {
    const resp = await request(app)
      .patch(`/borrowers/update?phone=${newUserDetails.phone}`)
      .send(newUserDetails);

    expect(resp.status).toEqual(400);
    expect(resp.error).toBeTruthy();
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

  test("Not Found error from non-existent borrower", async function () {
    const resp = await request(app)
      .patch(`/borrowers/update?email=nonexistent@gmail.com`)
      .send(newUserDetails);

    expect(resp.status).toEqual(404);
    expect(resp.error).toBeTruthy();
  }, 7000);
});

describe("DELETE /delete/:pairId", function () {
  test("works: deletes borrower based on pairId", async function () {
    const randomBorrower = await Borrower.findOne({}).populate("assignments");
    const assignment = randomBorrower.assignments[0];
    const resp = await request(app).delete(
      `/borrowers/delete?pairId=${assignment.pairId}`
    );

    const deletedBorrower = await Borrower.find({
      email: randomBorrower.email,
    });

    expect(resp.status).toEqual(200);
    expect(deletedBorrower.length).toEqual(0);
  }, 7000);
  test("works: deletes borrower based on email", async function () {
    const randomBorrower = await Borrower.findOne({});
    const resp = await request(app).delete(
      `/borrowers/delete?email=${randomBorrower.email}`
    );

    const deletedBorrower = await Borrower.find({
      email: randomBorrower.email,
    });

    expect(resp.status).toEqual(200);
    expect(deletedBorrower.length).toEqual(0);
  }, 7000);

  test("Bad Request error when not provided a valid query string", async function () {
    const resp = await request(app).delete(
      `/borrowers/delete?phone=555-555-5555`
    );
    expect(resp.status).toEqual(400);
  }, 7000);

  test("Not Found error from non-existent borrower email", async function () {
    const resp = await request(app).delete(
      `/borrowers/delete?email=nonexist@gmail.com`
    );
    expect(resp.status).toEqual(404);
  }, 7000);
});
