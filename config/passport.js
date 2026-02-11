import LocalStrategy from "passport-local";
import User from "../models/User.js";

export default function initializePassport(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "login_id" },
      async (login_id, password, done) => {
        try {
          const user = await User.findOne({ login_id });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          const isPasswordValid = await user.matchPassword(password);
          if (!isPasswordValid) {
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
