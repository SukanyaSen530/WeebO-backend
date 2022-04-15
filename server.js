import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";

import connectDB from "./config/db.js";

// Routes
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import wishlistRoutes from "./routes/wishlist.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";

// Middleware to check user authenticated
import protectedRoutes from "./middleware/auth.js";

//for accessing the .env file
dotenv.config();

const app = express();

//connecting to mongoDB
connectDB();
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log("error connecting", error);
});

app.use(cors());
app.use(
  express.json({
    limit: "5mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: store,
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
