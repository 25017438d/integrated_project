import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const renderForgot = (req, res) => {
  res.render("forgot", { user: req.user, error: req.flash("error"), success: req.flash("success") });
};

export const handleForgot = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      req.flash('error', 'Please enter your email');
      return res.redirect('/forgot');
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      req.flash('error', 'No account with that email found');
      return res.redirect('/forgot');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    // expire in 1 hour
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `${req.protocol}://${req.get('host')}/reset/${token}`;
    // If SMTP is configured, send email. Otherwise log to console (development)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: 'Password reset for Lost & Found',
          text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
          html: `<p>You requested a password reset. Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
        };

        await transporter.sendMail(mailOptions);
        req.flash('success', 'Password reset link sent to your email.');
      } catch (mailErr) {
        console.error('Email send error:', mailErr);
        console.log('Password reset link (development):', resetLink);
        req.flash('success', 'Password reset link generated. Check server console or your email.');
      }
    } else {
      console.log('Password reset link (development):', resetLink);
      req.flash('success', 'Password reset link generated. Check server console or your email.');
    }
    return res.redirect('/forgot');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating reset token');
    return res.redirect('/forgot');
  }
};

export const renderReset = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired');
      return res.redirect('/forgot');
    }
    res.render('reset', { user: req.user, token, error: req.flash('error'), success: req.flash('success') });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error validating reset token');
    return res.redirect('/forgot');
  }
};

export const handleReset = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      req.flash('error', 'All fields are required');
      return res.redirect(`/reset/${token}`);
    }

    if (newPassword !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect(`/reset/${token}`);
    }

    const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!complexity.test(newPassword)) {
      req.flash('error', 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
      return res.redirect(`/reset/${token}`);
    }

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired');
      return res.redirect('/forgot');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success', 'Password has been reset. You can now log in.');
    return res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error resetting password');
    return res.redirect('/forgot');
  }
};
