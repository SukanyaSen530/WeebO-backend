import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";

//for accessing the .env file
dotenv.config();

const app = express();

//connecting to mongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("WeebO Backend");
});
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);

// app.use("/products", productRoutes);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, (err) => {
  const port = server.address().port;
  if (err) console.log("Error in server setup");
  console.log(`Server running on ${port}`);
});
