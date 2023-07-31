const { Schema, model } = require("mongoose");

const loanSchema = new Schema(
  {
    loanId: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    borrowers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Borrower",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Loan", loanSchema);
