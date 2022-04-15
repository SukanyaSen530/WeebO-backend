import express from "express";
import { getOrders, createOrder } from "../controller/orders.js";

const orderRoutes = express.Router();

orderRoutes.get("/", getOrders);
orderRoutes.post("/", createOrder);

export default orderRoutes;
