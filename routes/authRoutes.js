import express from "express";
import passport from "passport";
import { registerUser, logoutUser } from "../controllers/authController.js";

const router = express.Router();

router.get("/register", (req, res) => res.render("register"));
router.post("/register", registerUser);

router.get("/login", (req, res) => res.render("login"));
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/notices",
    failureRedirect: "/login",
  })
);

router.get("/logout", logoutUser);

export default router;