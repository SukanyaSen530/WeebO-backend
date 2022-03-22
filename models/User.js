import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "fullName is required!"],
    },
    userName: {
      type: String,
      required: [true, "username is required!"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, "email already exists!"],
      required: [true, "email is required!"],
    },
    password: {
      type: String,
      required: [true, "password is required!"],
      minlength: [6, "password must be min 6 characters long!"],
      trim: true,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//Password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Unhashing password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generating JWT Token
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

const User = model("user", UserSchema);

export default User;
