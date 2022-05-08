import mongoose from "mongoose";
import User from "./User.js";
import Product from "./Product.js";
import Address from "./Address.js";
const { Schema, model } = mongoose;

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User Id is required!"],
      ref: User,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Address Id is required!"],
      ref: Address,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Product Id is required!"],
          ref: Product,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalPaid: {
      type: Number,
    },
    couponDiscount: {
      type: Number,
    },
    paymentMethod: {
      type: "String",
      default: "card",
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("order", OrderSchema);

export default Order;
