import mongoose from "mongoose";
import Address from "../models/Address.js";

export const getAllAdresses = async (req, res) => {
  const userID = req.user._id;

  try {
    const addressData = await Address.find({
      user: userID,
    });

    return res.status(200).json({ addresses: addressData });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const createNewAddress = async (req, res) => {
  const userID = req.user._id;

  const newAddress = new Address({
    user: userID,
    ...req.body,
  });

  try {
    await newAddress.save();

    res.status(201).json({ success: true, address: newAddress });
  } catch (e) {
    res.status(409).json({ success: false, message: e.message });
  }
};

export const updateAddress = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    res
      .status(404)
      .send({ success: false, message: `No address found with id: ${id}` });

  const updatedAddress = req.body;

  try {
    const newUpdatedAddress = await Address.findByIdAndUpdate(
      id,
      updatedAddress,
      {
        new: true,
      }
    );

    res.status(200).json({ success: true, address: newUpdatedAddress });
  } catch (e) {
    res.status(409).json({ success: false, message: e.message });
  }
};

export const deleteAddress = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    res
      .status(404)
      .send({ success: false, message: `No Address found with id: ${id}` });

  try {
    await Address.findByIdAndRemove(id);

    res.status(200).json({ success: true, id: id });
  } catch (e) {
    res.status(409).json({ success: false, message: e.message });
  }
};
