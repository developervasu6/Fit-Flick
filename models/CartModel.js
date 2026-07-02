import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    size: {
      type: String,
      enum: ["xs", "s", "m", "l", "xl", "xxl"],
      required: true,
    },
  },
  { timestamps: true },
);

export const Cart = mongoose.model("Cart", cartSchema);
