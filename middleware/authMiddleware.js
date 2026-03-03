import fs from 'fs';

export const ensureAuth = (req, res, next) => {
  const entry = `ensureAuth: isAuth=${req.isAuthenticated()} cookies=${req.headers.cookie}\n`;
  try { fs.appendFileSync('auth-debug.log', entry); } catch {};

  if (req.isAuthenticated()) return next();
  // if request expects JSON (AJAX/fetch) send 401 instead of redirecting
  const acceptsJson = req.xhr || (req.headers.accept && req.headers.accept.includes("application/json"));
  if (acceptsJson) {
    return res.status(401).json({ error: "Authentication required" });
  }
  res.redirect("/login");
};