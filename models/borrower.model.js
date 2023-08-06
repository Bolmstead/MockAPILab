const { Schema, model } = require("mongoose");

const borrowerSchema = new Schema(
  {
    pairId: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      min: [10, "Must be at least 10, got {VALUE}"],
      max: 13,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Borrower", borrowerSchema);
