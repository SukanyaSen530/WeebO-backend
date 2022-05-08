import express from "express";
import { getOrders } from "../controller/orders.js";

const orderRoutes = express.Router();

orderRoutes.get("/", getOrders);

export default orderRoutes;
