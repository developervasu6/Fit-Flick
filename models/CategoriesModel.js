import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Category = mongoose.model("Category", categoriesSchema);
