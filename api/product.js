import express from "express";
import { getAllProducts, getAProduct } from "../controller/products.js";

const productRoutes = express.Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getAProduct);

export default productRoutes;
