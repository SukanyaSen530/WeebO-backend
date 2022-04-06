import express from "express";
import {
  createNewAddress,
  deleteAddress,
  getAllAdresses,
  updateAddress,
} from "../controller/adresses";

const addressRoutes = express.Router();

addressRoutes.get("/", getAllAdresses);
addressRoutes.post("/", createNewAddress);
addressRoutes.post("/", updateAddress);
addressRoutes.delete("/:id", deleteAddress);

export default addressRoutes;
