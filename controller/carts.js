import mongoose from "mongoose";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  const userID = req.user._id;

  try {
    const cartWithData = await Cart.findOne({
      user: userID,
    }).populate(
      "cartItems.product",
      "name img price discount categoryName rating brandName"
    );

    return res.status(200).json({ cart: cartWithData?.cartItems });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  const userID = req.user._id;

  try {
    await Cart.findOneAndUpdate(
      { user: userID },
      { $set: { cartItems: [] } },
      {
        new: true,
      }
    );

    return res.status(200).json({ cart: [] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createorAddToCart = async (req, res) => {
  const { id: productID, quantity } = req.body;
  const userID = req.user._id;
  const qty = quantity ? parseInt(quantity) : 1;

  if (!mongoose.Types.ObjectId.isValid(productID)) {
    return res.status(404).send({
      success: false,
      message: `Not a valid Product  ID!`,
    });
  }

  const product = await Product.findById(productID);

  if (!product) {
    return res.status(404).send({
      success: false,
      message: `The product you are trying to add - ${productID} does not exist!`,
    });
  }

  const cart = await Cart.findOne({ user: userID });

  // if cart does not exist
  if (!cart) {
    const newCart = new Cart({
      user: userID,
      cartItems: [{ product: productID, quantity: qty }],
    });

    try {
      await newCart.save();

      const cartWithData = await Cart.findOne({
        user: userID,
      }).populate(
        "cartItems.product",
        "name img price discount categoryName rating brandName"
      );

      return res.status(200).json({ cart: cartWithData?.cartItems });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    // if cart exists
    const productExists = cart.cartItems.find(
      (item) => item.product == productID
    );

    let condition = {};
    let updateAction = {};

    if (!productExists) {
      // 1. New product
      condition = { user: userID };
      updateAction = {
        $addToSet: {
          cartItems: {
            product: productID,
            quantity: qty,
          },
        },
      };
    } else {
      // 2. Product exists increase quantity
      condition = { user: userID, "cartItems.product": productID };
      if (productExists.quantity < 5)
        updateAction = {
          $set: {
            "cartItems.$.quantity": productExists.quantity + qty,
          },
        };
      else {
        return res.status(500).send({
          success: false,
          message: `Max 5 products can be bought together!`,
        });
      }
    }

    try {
      await Cart.findOneAndUpdate(condition, updateAction, {
        new: true,
      });

      const cartWithData = await Cart.findOne({
        user: userID,
      }).populate(
        "cartItems.product",
        "name img price discount categoryName rating brandName"
      );

      return res.status(200).json({ cart: cartWithData?.cartItems });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};

export const incrementDecrementQuantity = async (req, res) => {
  const { id: productID } = req.params;
  const { action } = req.body;
  const userID = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productID)) {
    return res.status(404).send({
      success: false,
      message: `Not a valid Product or User ID!`,
    });
  }

  const product = await Product.findById(productID);

  if (!product) {
    return res.status(404).send({
      success: false,
      message: `The product you are trying to add - ${productID} does not exist!`,
    });
  }

  const cart = await Cart.findOne({ user: userID });

  // if cart exists
  const productExists = cart.cartItems.find(
    (item) => item.product == productID
  );

  if (!productExists) {
    return res.status(404).send({
      success: false,
      message: `These operation can not be performed on items which are not already added to cart!`,
    });
  }

  let updateAction = {};
  if (action === "increment") {
    if (productExists.quantity < 5)
      updateAction = {
        $inc: { "cartItems.$.quantity": 1 },
      };
    else {
      return res.status(500).send({
        success: false,
        message: `Max 5 products can be bought together!`,
      });
    }
  } else {
    if (productExists.quantity > 1)
      updateAction = {
        $inc: { "cartItems.$.quantity": -1 },
      };
    else {
      return res.status(500).send({
        success: false,
        message: `Quantity must be atleast 1!`,
      });
    }
  }

  try {
    await Cart.findOneAndUpdate(
      { user: userID, "cartItems.product": productID },
      updateAction,
      {
        new: true,
      }
    );

    const cartWithData = await Cart.findOne({
      user: userID,
    }).populate(
      "cartItems.product",
      "name img price discount categoryName rating brandName"
    );

    return res.status(200).json({ cart: cartWithData?.cartItems });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { id: productID } = req.params;
  const userID = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productID)) {
    return res.status(404).send({
      success: false,
      message: `Not a valid Product ID!`,
    });
  }

  const product = await Product.findById(productID);

  if (!product) {
    return res.status(404).send({
      success: false,
      message: `The product you are trying to remove - ${productID} does not exist!`,
    });
  }

  const cart = await Cart.findOne({ user: userID });

  if (!cart) {
    return res.status(404).send({
      success: false,
      message: `The cart does not exist!`,
    });
  }

  if (cart.cartItems.length === 0)
    return res.status(500).send({
      success: false,
      message: `Cart empty!`,
    });

  // if cart exists
  const productExists = cart.cartItems.find(
    (item) => item.product == productID
  );

  if (!productExists) {
    return res.status(404).send({
      success: false,
      message: `This product is not added to cart, can not be removed!`,
    });
  }

  try {
    await Cart.findOneAndUpdate(
      { user: userID },
      { $pull: { cartItems: { _id: productExists._id } } },
      { new: true }
    );

    return res.status(200).json({ success: true, productRemoved: productID });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
