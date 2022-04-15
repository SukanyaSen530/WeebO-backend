import express from "express";
import { checkoutPayment, checkoutComplete } from "../controller/payment.js";
import protectedRoutes from "../middleware/auth.js";

const paymentRoutes = express.Router();
paymentRoutes.post("/", protectedRoutes, checkoutPayment);
paymentRoutes.post("/webhook", checkoutComplete);
export default paymentRoutes;
