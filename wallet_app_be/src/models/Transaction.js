import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
    min: 0,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Transaction", transactionSchema);
