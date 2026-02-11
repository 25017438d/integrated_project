import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import initializePassport from "./config/passport.js";
import connectDB from "./config/db.js";

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

// Passport setup
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", authRoutes);
app.use("/notices", noticeRoutes);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));