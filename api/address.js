import express from "express";
import {
  createNewAddress,
  deleteAddress,
  getAllAdresses,
  updateAddress,
} from "../controller/addresses.js";

const addressRoutes = express.Router();

addressRoutes.get("/", getAllAdresses);
addressRoutes.post("/", createNewAddress);
addressRoutes.put("/:id", updateAddress);
addressRoutes.delete("/:id", deleteAddress);

export default addressRoutes;
