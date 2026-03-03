import express from "express";
import passport from "passport";
import { registerUser, logoutUser } from "../controllers/authController.js";
import { renderForgot, handleForgot, renderReset, handleReset } from "../controllers/passwordController.js";

const router = express.Router();

router.get("/", (req, res) => res.render("index", { user: req.user }));

router.get("/register", (req, res) => res.render("register", { user: req.user, error: req.flash("error")[0], success: req.flash("success")[0] }));
router.post("/register", registerUser);

router.get("/login", (req, res) => res.render("login", { user: req.user, error: req.flash("error")[0], success: req.flash("success")[0] }));
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/notices",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", logoutUser);

// Password reset routes
router.get('/forgot', renderForgot);
router.post('/forgot', handleForgot);
router.get('/reset/:token', renderReset);
router.post('/reset/:token', handleReset);

export default router;