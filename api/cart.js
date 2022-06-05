import express from "express";
import {
  getCart,
  createorAddToCart,
  incrementDecrementQuantity,
  removeFromCart,
} from "../controller/carts.js";

const cartRoutes = express.Router();

cartRoutes.get("/", getCart);
cartRoutes.post("/add", createorAddToCart);
cartRoutes.post("/remove", removeFromCart);
cartRoutes.patch("/quantity/:id", incrementDecrementQuantity);


export default cartRoutes;
