import Stripe from "stripe";
import { getLineItems } from "../utils/getLineItems.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const checkoutPayment = async (req, res) => {
  const userID = req.user._id;
  const { order } = req.body;
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const line_items = getLineItems(order.orderItems);
  const orderDetail = JSON.stringify(order);

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: "test@gmail.com",
      client_reference_id: `${userID}`,
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: {
        order: `${orderDetail}`,
      },
      allow_promotion_codes: true,
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    res.status(200).json({ success: true, sessionId: stripeSession.id });
  } catch (e) {
    console.log(e);
    res.status(409).json({ success: false, message: e.message });
  }
};

export const checkoutComplete = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const payload = req.rawBody;

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = JSON.parse(payload);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.payment_status === "paid") {
      const userID = data?.data?.object.client_reference_id;
      const orderDetails = data?.data?.object?.metadata?.order;

      if (orderDetails) {
        const order = JSON.parse(orderDetails);

        try {
          const newOrder = new Order({
            user: userID,
            ...order,
          });
          await newOrder.save();
        } catch (e) {
          console.log("error saving order", e);
        }
      }

      try {
        await Cart.findOneAndUpdate(
          { user: userID },
          { $set: { cartItems: [] } },
          {
            new: true,
          }
        );
      } catch (err) {
        console.log("cart not cleared", err);
      }
    }
  }
  return res.status(200);
};
