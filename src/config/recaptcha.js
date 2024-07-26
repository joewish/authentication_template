import recaptcha from "recaptcha2";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import GoogleStrategy from "passport-google-oauth20";
import findOrCreate from "mongoose-findorcreate";

export const recaptcha2 = new recaptcha({
  siteKey: process.env.RECAPTCHA_SITE_KEY,
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
});

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
