import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: [
      {
        picId: {
          type: String,
          required: true,
        },
        picURL: {
          type: String,
          required: true,
        },
      },
    ],

    size: [
      {
        type: String,
        enum: ["xs", "s", "m", "l", "xl", "xxl"],
      },
    ],

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
