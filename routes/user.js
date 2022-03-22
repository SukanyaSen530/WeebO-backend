import express from "express";
import { getUserById, registerUser, loginUser } from "../controller/users.js";

const userRoutes = express.Router();

userRoutes.get("/:id", getUserById);
userRoutes.post("/login", loginUser);
userRoutes.post("/signup", registerUser);

export default userRoutes;
