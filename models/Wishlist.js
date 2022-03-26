import mongoose from "mongoose";
import Product from "./Product.js";
import User from "./User.js";
const { Schema, model } = mongoose;

const WishlistSchema = new Schema({
  wishlistItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Product Id is required!"],
      ref: Product,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User Id is required!"],
    ref: User,
  },
});

const Wishlist = model("wishlist", WishlistSchema);

export default Wishlist;
