import mongoose from "mongoose";
import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  const userID = req.user._id;

  try {
    const wishListWithData = await Wishlist.findOne({
      user: userID,
    }).populate(
      "wishlistItems",
      "name img price discount tag inStock rating brandName"
    );

    return res
      .status(200)
      .json({ wishlist: wishListWithData?.wishlistItems || [] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createorAddToWishlist = async (req, res) => {
  const { id: productID } = req.body;
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
      message: `The product you are trying to add - ${productID} does not exist!`,
    });
  }

  const wishlist = await Wishlist.findOne({ user: userID });

  if (!wishlist) {
    const newWishlist = new Wishlist({
      user: userID,
      wishlistItems: [productID],
    });

    try {
      await newWishlist.save();

      const wishListWithData = await Wishlist.findOne({
        user: userID,
      }).populate(
        "wishlistItems",
        "name img price discount tag inStock rating brandName"
      );

      return res
        .status(200)
        .json({ wishlist: wishListWithData?.wishlistItems || [] });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    try {
      await Wishlist.findOneAndUpdate(
        { user: userID },
        { $addToSet: { wishlistItems: productID } },
        { new: true }
      );

      const wishListWithData = await Wishlist.findOne({
        user: userID,
      }).populate(
        "wishlistItems",
        "name img price discount tag inStock rating brandName"
      );

      return res
        .status(200)
        .json({ wishlist: wishListWithData?.wishlistItems || [] });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};

export const removeFromWishlist = async (req, res) => {
  const { id: productID } = req.body;
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

  const wishlist = await Wishlist.findOne({ user: userID });

  if (!wishlist) {
    return res.status(404).send({
      success: false,
      message: `The wishlist does not exist!`,
    });
  }

  if (wishlist.wishlistItems.length === 0)
    return res.status(404).send({
      success: false,
      message: `Wishlist empty!`,
    });

  const productExists = wishlist.wishlistItems.find(
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
      { user: userID },
      { $pull: { wishlistItems: productID } },
      { new: true }
    );
    return res.status(200).json({ success: true, productRemoved: productID });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
