import Order from "../models/Order.js";


export const getOrders = async (req, res) => {
  const userID = req.user._id;

  try {
    const ordersData = await Order.find({
      user: userID,
    })
      .populate([
        {
          path: "orderItems.product",
          select: "name img price discount categoryName rating brandName",
        },
      ])
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders: ordersData });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

