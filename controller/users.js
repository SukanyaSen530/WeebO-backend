import User from "../models/User.js";
import mongoose from "mongoose";

//GET USER PROFILE
export const getUserById = async (req, res) => {
  const userID = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userID))
    return res
      .status(404)
      .send({ success: false, message: `No user found with id: ${userID}` });
  else {
    try {
      const user = await User.findById(userID);
      return res.status(200).json({ success: true, user: user });
    } catch (e) {
      return res.status(500).json({ message: err.message });
    }
  }
};

//REGISTER
export const registerUser = async (req, res) => {
  const newUser = new User(req.body);

  const user = await User.findOne({ email: newUser.email });

  if (user)
    return res
      .status(400)
      .json({ success: false, message: "User already exists!" });

  try {
    await newUser.save();
    sendToken(newUser, 201, res);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("req", req.body);

  if (!email || !password)
    return res
      .status(422)
      .json({ success: false, message: "Please provide Email & Password!" });

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User Not Registered!" });

    //check password matches using method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials!" });
    } else {
      sendToken(user, 200, res, req);
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

//JWT TOKEN
const sendToken = (user, statusCode, res, req) => {
  const token = user.getSignedToken();
  const userWithoutPassword = {
    email: user.email,
    fullName: user.fullName,
    userName: user.userName,
    _id: user._id,
  };

  return res
    .status(statusCode)
    .json({ success: true, token, user: userWithoutPassword });
};
