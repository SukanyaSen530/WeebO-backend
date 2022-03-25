import mongoose from "mongoose";
import User from "./User.js";
const { Schema, model } = mongoose;

const ProductSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required!"],
      ref: User,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    price: {
      type: Number,
      default: 1,
      required: [true, "Product price is required"],
    },
    discount: {
      type: Number,
    },
    img: [
      {
        type: String,
        required: [true, "Product image URL is required"],
      },
    ],
    tag: {
      type: String,
      enum: ["sale", "new", ""],
      default: "",
    },
    description: {
      type: String,
    },
    inStock: {
      type: Boolean,
    },
    countInStock: {
      type: Number,
      default: 10,
    },
    specification: {
      size: {
        type: Number,
      },
      material: {
        type: String,
      },
      age: {
        type: String,
      },
    },
    rating: {
      type: Number,
      default: 0,
      required: [true, "Product rating is required!"],
    },
    brandName: {
      type: String,
    },
    categoryName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("products", ProductSchema);

export default Product;
