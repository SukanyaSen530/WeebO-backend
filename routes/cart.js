import express from "express";
import {
  getCart,
  createorAddToCart,
  incrementDecrementQuantity,
  removeFromCart,
  clearCart,
} from "../controller/carts.js";

const cartRoutes = express.Router();

cartRoutes.get("/", getCart);
cartRoutes.post("/add", createorAddToCart);
cartRoutes.patch("/:id", incrementDecrementQuantity);
cartRoutes.delete("/:id", removeFromCart);
cartRoutes.post("/clearcart", clearCart);

export default cartRoutes;
