import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

// Routes
import productRoutes from "./api/product.js";
import userRoutes from "./api/user.js";
import wishlistRoutes from "./api/wishlist.js";
import cartRoutes from "./api/cart.js";
import addressRoutes from "./api/address.js";
import orderRoutes from "./api/order.js";
import paymentRoutes from "./api/payment.js";

// Middleware to check user authenticated
import protectedRoutes from "./middleware/auth.js";

//for accessing the .env file
dotenv.config();

const app = express();

//connecting to mongoDB
connectDB();

app.use(cors());
app.use(
  express.json({
    limit: "5mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("WeebO Backend");
});
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", protectedRoutes, wishlistRoutes);
app.use("/api/cart", protectedRoutes, cartRoutes);
app.use("/api/address", protectedRoutes, addressRoutes);
app.use("/api/order", protectedRoutes, orderRoutes);
app.use("/api/pay", paymentRoutes);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, (err) => {
  const port = server.address().port;
  if (err) console.log("Error in server setup");
  console.log(`Server running on ${port}`);
});


export default app;