// import passport from "passport";
//import passportLocalMongoose from "passport-local-mongoose";
// import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import path from "path"
const configPath = path.resolve("src", "config", "uat.env");
dotenv.config({ path: configPath });
import findOrCreate from "mongoose-findorcreate";
import passport  from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
export const passport2 = passport;
// export const recaptcha2 = new recaptcha({
//   siteKey: process.env.RECAPTCHA_SITE_KEY,
//   secretKey: process.env.RECAPTCHA_SECRET_KEY,
// });

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });
//initialize 
passport2.use(
  new GoogleStrategy(
    {

      clientID: process.env.GOOGLE_CLIENT_ID, // google client id
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // google client secret
      // the callback url added while creating the Google auth app on the console
      callbackURL: "http://localhost:3000/auth/google/callback", 
      passReqToCallback: true,
    },

// returns the authenticated email profile
 async function (request, accessToken, refreshToken, profile, done) {
 // you can write some algorithms here based on your application models and all
 // an example - not related to this application

/*
   const exist = await User.findOne({ email: profile["emails"][0].value });
   if (!exist) {
        await User.create({
        email: profile["emails"][0].value,
          fullName: profile["displayName"],
          avatar: profile["photos"][0].value,
          username: profile["name"]["givenName"],
          verified: true,
        });
      }
    const user = await User.findOne({ email: profile["emails"][0].value });
 return done(null, user);
*/
     return done(null, profile);
    }
  )
);

// function to serialize a user/profile object into the session
passport2.serializeUser(function (user, done) {
  done(null, user);
});

// function to deserialize a user/profile object into the session
passport2.deserializeUser(function (user, done) {
  done(null, user);
});
