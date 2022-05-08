import express from "express";
import { getUserById, registerUser, loginUser } from "../controller/users.js";

import protectedRoutes from "../middleware/auth.js";

const userRoutes = express.Router();

userRoutes.get("/user", protectedRoutes, getUserById);
userRoutes.post("/login", loginUser);
userRoutes.post("/signup", registerUser);

export default userRoutes;
