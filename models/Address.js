import mongoose from "mongoose";
import User from "./User.js";
const { Schema, model } = mongoose;

const AddressSchema = new Schema({});

const Address = model("address", AddressSchema);

export default Address;
