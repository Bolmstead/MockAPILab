const { Schema, model } = require("mongoose");

const assignmentSchema = new Schema(
  {
    pairId: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    loan: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
    },
    borrower: {
      type: Schema.Types.ObjectId,
      ref: "Borrower",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Assignment", assignmentSchema);
