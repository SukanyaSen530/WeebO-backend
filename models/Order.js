import mongoose from "mongoose";
import User from "./User.js";
import Product from "./Product.js";
import Address from "./Address.js";
const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User Id is required!"],
    ref: User,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Address Id is required!"],
    ref: Address,
  },
  orderItems: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Product Id is required!"],
        ref: Product,
      },
      name: String,
      price: Number,
      discount: Number,
      img: String,
      qty: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalPrice: String,
  couponDiscount: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: "String",
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
});

const Cart = model("cart", CartSchema);

export default Cart;
