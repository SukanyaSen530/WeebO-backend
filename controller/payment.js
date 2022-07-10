import Stripe from "stripe";
import { getLineItems, getOrderData } from "../utils/stripeHelper.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";

export const checkoutPayment = async (req, res) => {
  const userID = req.user._id;
  const { order, userEmail } = req.body;
  const stripe = new Stripe(`${process.env.STRIPE_KEY}`);
  const line_items = getLineItems(order.orderItems);

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: `${userEmail}`,
      client_reference_id: `${userID}`,
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: { addressId: `${order.addressId}` },
      allow_promotion_codes: true,
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    return res.status(200).json({ success: true, sessionId: stripeSession.id });
  } catch (e) {
    return res.status(409).json({ success: false, message: e.message });
  }
};

export const checkoutComplete = async (req, res) => {
  const stripe = new Stripe(`${process.env.STRIPE_KEY}`);
  const payload = req.rawBody;

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      `${process.env.STRIPE_WEBHOOK_KEY}`
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  const data = JSON.parse(payload);

  if (event.type === "checkout.session.completed") {
    const checkout_session = event.data.object;

    const session = await stripe.checkout.sessions.retrieve(
      `${checkout_session.id}`,
      {
        expand: ["line_items"],
      }
    );

    if (checkout_session.payment_status === "paid") {
      const orderExists = await Order.findOne({
        stripeSessionId: checkout_session.id,
      });

      if (orderExists) return;

      const userID = data?.data?.object.client_reference_id;
      const addressId = data?.data?.object?.metadata?.addressId;

      const order = getOrderData(session.line_items.data);

      const totalAmount = parseInt(data?.data?.object?.amount_subtotal / 100);
      const totalPaid = parseInt(data?.data?.object?.amount_total / 100);

      const address = await Address.findById(addressId);

      if (order) {
        try {
          const newOrder = new Order({
            stripeSessionId: checkout_session.id,
            user: userID,
            address: address,
            orderItems: [...order],
            totalAmount,
            totalPaid,
            couponDiscount: totalAmount - totalPaid,
          });

          await newOrder.save();

          await Cart.findOneAndUpdate(
            { user: userID },
            { $set: { cartItems: [] } },
            {
              new: true,
            }
          );
        } catch (e) {
          console.log("error saving order and clearing cart", e);
        }
      }
    }
  }
  return res.status(200);
};
