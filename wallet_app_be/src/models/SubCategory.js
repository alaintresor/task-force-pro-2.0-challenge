import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SubCategory", subCategorySchema);
