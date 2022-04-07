import mongoose from "mongoose";
import User from "./User.js";
const { Schema, model } = mongoose;

const AddressSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User Id is required!"],
    ref: User,
    select: false,
  },
  name: {
    type: String,
    required: [true, "Reciever name is required for address"],
  },
  area: String,
  city: String,
  state: String,
  pinCode: String,
  mobile: String,
  addressType: {
    type: String,
    enum: ["home", "work"],
    default: "home",
  },
});

const Address = model("address", AddressSchema);

export default Address;
