import Order from "../models/Order.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY);
import { v4 as uuid } from "uuid";

export const getOrders = async (req, res) => {
  const userID = req.user._id;

  try {
    const ordersData = await Order.find({
      user: userID,
    }).populate("addressId", "name area city mobile addressType state pinCode");

    return res.status(200).json({ orders: ordersData });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const createOrder = async (req, res) => {
  const userID = req.user._id;
  const { token, order } = req.body;

  const customer = await stripe.customers.create({
    email: token.email,
    source: token.id,
  });

  const idempotency_key = uuid(); //so that we don't charge the customer twice

  const charge = await stripe.charges.create(
    {
      amount: order.totalPrice * 100,
      currency: "inr",
      customer: customer.id,
      receipt_email: token.email,
      description: `Purchased`,
      shipping: {
        name: token.card.name,
        address: order.addressId,
      },
    },
    {
      idempotency_key,
    }
  );

  const newOrder = new Order({
    user: userID,
    ...order,
    finalPrice: charge.amount,
  });

  try {
    await newOrder.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (e) {
    res.status(409).json({ success: false, message: e.message });
  }
};
