"use strict";

describe("config can come from env", function () {
  test("works", function() {
    process.env.PORT = "5000";
    process.env.NODE_ENV = "test";
    
    expect(config.PORT).toEqual(5000);

    delete process.env.PORT;
    delete process.env.DATABASE_URL;

    process.env.NODE_ENV = "test";

  });
})

