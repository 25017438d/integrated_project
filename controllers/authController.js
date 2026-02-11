import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { login_id, nickname, email, password } = req.body;
    const user = new User({ login_id, nickname, email, password });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
};

export const logoutUser = (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};