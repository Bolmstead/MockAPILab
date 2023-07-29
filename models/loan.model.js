const { Schema, model } = require("mongoose");

const loanSchema = new Schema(
  {
    loanId: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Loan", loanSchema);
