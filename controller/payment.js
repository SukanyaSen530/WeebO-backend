import Stripe from "stripe";
import { getLineItems } from "../utils/getLineItems.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const checkoutPayment = async (req, res) => {
  const userID = req.user._id;
  const { order } = req.body;
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const line_items = getLineItems(order.orderItems);

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    // console.log(stripeSession);

    res.status(200).json({ success: true, sessionId: stripeSession.id });
  } catch (e) {
    console.log(e);
    res.status(409).json({ success: false, message: e.message });
  }
};

export const checkoutComplete = (req, res) => {
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.payment_status === "paid") {
      console.log("completed", session);
    }
  }

  return res.status(200);
};
