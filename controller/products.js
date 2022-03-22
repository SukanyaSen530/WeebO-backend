import Product from "../models/Product.js";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
  try {
    const productList = await Product.find();
    res.status(200).json({ success: true, data: productList });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed fetching data!" });
  }
};

export const getAProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send({
      success: false,
      message: `The product - ${id} you are searching for does not exists!:`,
    });
  } else {
    const product = await Product.findById(id);

    res.status(200).json({ success: true, data: product });
  }
};
