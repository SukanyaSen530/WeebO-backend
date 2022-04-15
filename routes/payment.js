import express from "express";
import { checkoutPayment } from "../controller/payment.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/", checkoutPayment);

export default paymentRoutes;
