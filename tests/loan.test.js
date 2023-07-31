"use strict";

const request = require("supertest");
process.env.NODE_ENV = "test";

const app = require("../app.js");
const Borrower = require("../models/borrower.model.js");
const Loan = require("../models/loan.model.js");

const { v4: uuid } = require("uuid");

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

/******* POST /loan */

describe("POST /loan/create", function () {
  const id1 = uuid();
  const id2 = uuid();

  const testUser1 = {
    pairId: id1,
    firstName: "Jane",
    lastName: "Smith",
    phone: "123-123-1234",
  };

  const testUser2 = {
    pairId: id2,
    firstName: "Bob",
    lastName: "Hope",
    phone: "555-555-5555",
  };

  test("works: creates a loan with borrowers and assignments", async function () {
    const resp = await request(app)
      .post("/loans/create")
      .send([testUser1, testUser2]);

    const createdLoan = await Loan.findById(resp.body._id);
    const createdBorrower1 = await Borrower.findOne({
      pairId: testUser1.pairId,
    });
    const createdBorrower2 = await Borrower.findOne({
      pairId: testUser2.pairId,
    });

    const allLoans = await Loan.find();
    const allBorrowers = await Borrower.find();

    // Correct API Response
    expect(resp.status).toEqual(201);
    expect(resp.body.loanId).toBeTruthy();

    // Only one loan exists
    expect(createdLoan).toBeTruthy();
    expect(createdLoan.loanId).toBeTruthy();
    expect(allLoans.length).toEqual(2);

    // Created Borrowers exist. Only 2 exist
    expect(createdBorrower1.pairId).toEqual(testUser1.pairId);
    expect(createdBorrower2.pairId).toEqual(testUser2.pairId);
    expect(allBorrowers.length).toEqual(3);
  }, 7000);

  test("bad request if missing data", async function () {
    const resp = await request(app)
      .post("/loans/create")
      .send([
        {
          firstName: "TestUser",
        },
      ]);
    expect(resp.status).toEqual(500);
    expect(resp.body.error).toBeTruthy();
  });

  test("bad request if request body is not an array", async function () {
    const resp = await request(app).post("/loans/create").send(testUser1);
    expect(resp.status).toEqual(500);
    expect(resp.body.error).toBeTruthy();
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app).post("/loans/create").send({
      pairId: 123,
      firstName: "test",
      lastName: "test",
      phone: "123",
    });
    expect(resp.statusCode).toEqual(500);
    expect(resp.body.error).toBeTruthy();
  });
});

describe("GET /loans/all", function () {
  test("works: gets all loans", async function () {
    const resp = await request(app).get("/loans/all");
    expect(resp.status).toEqual(200);
    expect(resp.body.length).toEqual(1);
  }, 7000);
});

describe("GET /details/:loanId", function () {
  test("works: gets loan details", async function () {
    const loan = await Loan.findOne();
    const resp = await request(app).get(`/loans/details/${loan.loanId}`);
    expect(resp.status).toEqual(200);
    expect(resp.body.loanId).toEqual(loan.loanId);
  }, 7000);

  test("Not Found error from non-existent loanId", async function () {
    const resp = await request(app).get(`/loans/details/1234`);
    expect(resp.status).toEqual(404);
  }, 7000);
});

describe("DELETE /delete/:loanId", function () {
  test("works: deletes loan", async function () {
    const loan = await Loan.findOne();
    const resp = await request(app).delete(`/loans/delete/${loan.loanId}`);

    const allLoans = await Loan.find();

    expect(resp.status).toEqual(200);
    expect(allLoans.length).toEqual(0);
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

    expect(resp.status).toEqual(200);
    expect(allLoans.length).toEqual(0);
  }, 7000);
});
