const passport = require("passport");
const { Strategy } = require("passport-local");
const { isValidEmail, getUser } = require("../database/db");
const { comparePassword } = require("../utils/helpers");

passport.use(
  new Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        if (!email || !password) {
          return done(null, false, { message: "missing fields" });
        }
        const user = await isValidEmail(email);
        if (!user) {
          return done(null, false, { message: "user not found" });
        }
        if (!comparePassword(password, user.hashed)) {
          return done(null, false, { message: "incorrect password" });
        } else {
          return done(null, user);
        }
      } catch (e) {
        return done(e, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await getUser(userId);

    done(null, user);
  } catch (e) {
    done(e);
  }
});
