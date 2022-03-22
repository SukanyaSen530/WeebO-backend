import express from "express";

const productRoutes = express.Router();

productRoutes.get("/", (req, res) => {
  res.json("Hello MF");
});

export default productRoutes;
