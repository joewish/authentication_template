import express, { urlencoded } from "express";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import session from "express-session";
import flash from "express-flash";
import expressEjsLayouts from "express-ejs-layouts";
import bodyParser from "body-parser";
import { router } from "./src/routes/app.routes.js";
const configPath = path.resolve("src", "config", "uat.env");
dotenv.config({ path: configPath });
const app = express();
app.use(
    session({
      secret: process.env.SESSION_SECRET, // session secret
      resave: false,
      saveUninitialized: false,
    })
  );
  
  // initialize passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(flash());
app.use("/", express.static(path.join("public")));
app.set("view engine", "ejs");
app.set("views", path.resolve("src", "views"));
// configure routes
app.use("/", router);

export default app;
