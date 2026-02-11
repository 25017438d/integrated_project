import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import flash from "connect-flash";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import initializePassport from "./config/passport.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

dotenv.config();
connectDB();

const app = express();

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// Passport setup
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", authRoutes);
app.use("/notices", noticeRoutes);

// Server start
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("⏹️ SIGTERM received, closing server...");
  server.close(async () => {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("⏹️ SIGINT received, closing server...");
  server.close(async () => {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  });
});