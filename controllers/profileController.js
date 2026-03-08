import User from "../models/User.js";
import fs from "fs";
import path from "path";

export const getProfile = (req, res) => {
  res.render("profile", { user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { nickname, email, currentPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Validate current password if they're trying to change password or sensitive info
    if (!currentPassword) {
      req.flash("error", "Current password is required to update profile");
      return res.redirect("/profile");
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      req.flash("error", "Current password is incorrect");
      return res.redirect("/profile");
    }

    // Update nickname if provided
    const nicknameTrimmed = nickname ? nickname.trim() : "";

    if (nicknameTrimmed.length < 3) {
      req.flash("error", "Nickname must be at least 3 characters");
      return res.redirect("/profile");
    }

    user.nickname = nicknameTrimmed;

    // Update email if provided
    const emailTrimmed = email ? email.trim() : "";

    if (emailTrimmed && emailTrimmed !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        req.flash("error", "Invalid email format");
        return res.redirect("/profile");
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email: emailTrimmed, _id: { $ne: req.user._id } });
      if (existingEmail) {
        req.flash("error", "Email already in use");
        return res.redirect("/profile");
      }

      user.email = emailTrimmed;
    }

    await user.save();
    req.flash("success", "Profile updated successfully");
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error updating profile");
    res.redirect("/profile");
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Basic presence checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      req.flash("error", "All password fields are required");
      return res.redirect("/profile");
    }

    if (newPassword !== confirmPassword) {
      req.flash("error", "New passwords do not match");
      return res.redirect("/profile");
    }

    // Enforce modern password policy: min 8 characters
    if (newPassword.length < 8) {
      req.flash("error", "New password must be at least 8 characters");
      return res.redirect("/profile");
    }

    // Always operate on the logged-in user
    const user = await User.findById(req.user._id);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/profile");
    }

    // Ensure new password differs from current password
    const samePassword = await user.matchPassword(newPassword);

    if (samePassword) {
      req.flash("error", "New password must be different from current password");
      return res.redirect("/profile");
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      req.flash("error", "Current password is incorrect");
      return res.redirect("/profile");
    }

    user.password = newPassword;
    await user.save();
    req.flash("success", "Password updated successfully");
    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error updating password");
    res.redirect("/profile");
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      req.flash("error", "No image selected");
      return res.redirect("/profile");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/profile");
    }

    if (user.profile_image) {
      const oldImagePath = path.join(process.cwd(), "public", user.profile_image);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.profile_image = `/uploads/${req.file.filename}`;
    await user.save();

    req.flash("success", "Profile picture updated successfully");
    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error updating profile picture");
    return res.redirect("/profile");
  }
};
