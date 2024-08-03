import dotenv from "dotenv";
import path from "path"
const configPath = path.resolve("src", "config", "uat.env");
dotenv.config({ path: configPath });
import passport  from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {RecaptchaEnterpriseServiceClient} from '@google-cloud/recaptcha-enterprise';
export const passport2 = passport;
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
/**
  * Create an assessment to analyse the risk of a UI action.
  *
  * projectID: Your Google Cloud project ID.
  * recaptchaSiteKey: The reCAPTCHA key associated with the site/app
  * token: The generated token obtained from the client.
  * recaptchaAction: Action name corresponding to the token.
  */
async function createAssessment({
  // TO-DO: Replace the token and reCAPTCHA action variables before running the sample.
  projectID = "authenticator-1722679430033",
  recaptchaKey = process.env.RECAPTCHA_SECRET_KEY,
  token = "action-token",
  recaptchaAction = "action-name",
}) {
  // Create the reCAPTCHA client.
  // TODO: Cache the client generation code (recommended) or call client.close() before exiting the method.
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  // Build the assessment request.
  const request = ({
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  });

  const [ response ] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties.valid) {
    console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`);
    return null;
  }

  // Check if the expected action was executed.
  // The `action` property is set by user client in the grecaptcha.enterprise.execute() method.
  if (response.tokenProperties.action === recaptchaAction) {
    // Get the risk score and the reason(s).
    // For more information on interpreting the assessment, see:
    // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason);
    });

    return response.riskAnalysis.score;
  } else {
    console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
    return null;
  }
}