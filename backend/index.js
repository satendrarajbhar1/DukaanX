import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://dukaan-x.vercel.app",
  "https://dukaan-x-1poh.vercel.app",
];

// CLIENT_URLS set ho to wahi use hoga, warna defaultOrigins
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map((url) => url.trim().replace(/\/$/, ""))
  : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman/server-to-server requests mein origin nahi hota
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoute);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

// global error handler (multer errors etc.)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

const PORT = process.env.PORT || 8000;

connectDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});