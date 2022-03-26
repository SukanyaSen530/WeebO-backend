import mongoose from "mongoose";
import Product from "./Product.js";
import User from "./User.js";
const { Schema, model } = mongoose;

const CartSchema = new Schema({
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Product Id is required!"],
        ref: Product,
      },
      quantity: {
        type: Number,
        default: 1,
        required: [true, "Product Quantity is required!"],
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User Id is required!"],
    ref: User,
  },
});

const Cart = model("cart", CartSchema);

export default Cart;
