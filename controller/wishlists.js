import mongoose from "mongoose";
import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  const userID = req.user._id;
  try {
    const wishListWithData = await Wishlist.findOne({
      userId: userID,
    }).populate("productIds", "name img price discount tag rating brandName");

    return res.status(200).json({ wishlist: wishListWithData?.productIds });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createorAddToWishlist = async (req, res) => {
  const { id: productID } = req.body;
  const userID = req.user._id;

  const product = await Product.findById(productID);

  if (!product) {
    return res.status(404).send({
      success: false,
      message: `The product you are trying to add - ${productID} does not exist!`,
    });
  }

  const wishlist = await Wishlist.findOne({ userId: userID });

  if (!wishlist) {
    const newWishlist = new Wishlist({
      userId: userID,
      productIds: [productID],
    });
    try {
      await newWishlist
        .save()
        .populate(
          "productIds",
          "name img price discount tag rating brandName,"
        );
      return res.status(200).json({ wishlist: newWishlist?.productIds });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    try {
      const updatedWishlist = await Wishlist.findOneAndUpdate(
        { userId: userID },
        { $addToSet: { productIds: productID } },
        { new: true }
      ).populate("productIds", "name img price discount tag rating brandName");

      return res.status(200).json({ wishlist: updatedWishlist?.productIds });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};

export const removeFromWishlist = async (req, res) => {
  const { id: productID } = req.body;
  const userID = req.user._id;

  if (
    !mongoose.Types.ObjectId.isValid(productID) ||
    !mongoose.Types.ObjectId.isValid(userID)
  ) {
    return res.status(404).send({
      success: false,
      message: `Not a valid Product or User ID!`,
    });
  }

  const product = await Product.findById(productID);

  if (!product) {
    return res.status(404).send({
      success: false,
      message: `The product you are trying to remove - ${productID} does not exist!`,
    });
  }

  const wishlist = await Wishlist.findOne({ userId: userID });

  if (!wishlist) {
    return res.status(404).send({
      success: false,
      message: `The wishlist does not exist!`,
    });
  }

  if (wishlist.productIds.length === 0)
    return res.status(404).send({
      success: false,
      message: `Wishlist empty!`,
    });

  const productExists = wishlist.productIds.find(
    (product) => product == productID
  );

  if (!productExists) {
    return res.status(404).send({
      success: false,
      message: `This product is not added to wishlist, can not be removed!`,
    });
  }

  try {
    await Wishlist.findOneAndUpdate(
      { userId: userID },
      { $pull: { productIds: productID } },
      { new: true }
    );
    return res.status(200).json({ success: true, productRemoved: productID });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
