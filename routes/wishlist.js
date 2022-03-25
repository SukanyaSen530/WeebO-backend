import express from "express";
import {
  getWishlist,
  createorAddToWishlist,
  removeFromWishlist,
} from "../controller/wishlists.js";

const wishlistRoutes = express.Router();

wishlistRoutes.get("/", getWishlist);
wishlistRoutes.post("/add", createorAddToWishlist);
wishlistRoutes.post("/remove", removeFromWishlist);

export default wishlistRoutes;
