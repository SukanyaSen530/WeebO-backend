import Order from "../models/Order.js";


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
  const { order } = req.body;

  try {
    const newOrder = new Order({
      user: userID,
      ...order,
    });

    await newOrder.save();

    res.status(200).json({ success: true, orderId: newOrder._id });
  } catch (e) {
    console.log(e);
    res.status(409).json({ success: false, message: e.message });
  }
};
