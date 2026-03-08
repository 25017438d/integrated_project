import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { login_id, nickname, email, password } = req.body;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!login_id || !nickname || !email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/register");
    }

    if (login_id.length < 3) {
      req.flash("error", "Login ID must be at least 3 characters");
      return res.redirect("/register");
    }

    if (password.length < 8) {
      req.flash("error", "Password must be at least 8 characters");
      return res.redirect("/register");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash("error", "Please enter a valid email");
      return res.redirect("/register");
    }

    const existingUser = await User.findOne({ $or: [{ login_id }, { email }] });
    if (existingUser) {
      req.flash("error", "Login ID or email already exists");
      return res.redirect("/register");
    }

    const user = new User({
      login_id,
      nickname,
      email,
      password,
      profile_image,
    });

    await user.save();
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error registering user");
    res.redirect("/register");
  }
};

export const logoutUser = (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};
