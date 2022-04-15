import Stripe from "stripe";
import { getLineItems } from "../utils/getLineItems.js";

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
      success_url: `${process.env.client_url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.client_url}/checkout`,
    });

    console.log(stripeSession);

    res.status(200).json({ success: true, sessionId: stripeSession.id });
  } catch (e) {
    console.log(e);
    res.status(409).json({ success: false, message: e.message });
  }
};
