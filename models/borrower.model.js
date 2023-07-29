const { Schema, model } = require("mongoose");

const borrowerSchema = new Schema(
  {
    // added email as a unique identifier in order to know if
    // new borrower or if already been created
    email: {
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
      type: String,
      trim: true,
      required: true,
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

module.exports = model("Borrower", borrowerSchema);
