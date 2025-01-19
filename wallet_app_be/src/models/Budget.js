import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  period: {
    type: String,
    enum: ["monthly", "yearly"],
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("Budget", BudgetSchema);
