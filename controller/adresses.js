import mongoose from "mongoose";
import Address from "../models/Address";

export const getAllAdresses = async (req, res) => {
  const userID = req.user._id;

  try {
    const addressData = await Address.findOne({
      user: userID,
    });

    return res.status(200).json({ addresses: addressData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createNewAddress = async (req, res) => {
  const newAddress = new Address({
    user: userID,
    ...req.body,
  });

  try {
    await newAddress.save();

    res.status(201).json({ success: true, address: newAddress });
  } catch (err) {
    res.status(409).json({ success: false, message: error.message });
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
    const newUpdatedAddress = await IssueItem.findByIdAndUpdate(
      id,
      updatedAddress,
      {
        new: true,
      }
    );

    res.status(201).json({ success: true, address: newUpdatedAddress });
  } catch (e) {
    res.status(409).json({ success: false, message: error.message });
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

    res.status(201).json({ success: true, id: id });
  } catch (e) {
    res.status(409).json({ success: false, message: error.message });
  }
};
