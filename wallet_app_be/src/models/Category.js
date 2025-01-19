import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Category", categorySchema);
