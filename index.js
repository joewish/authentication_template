import express, { urlencoded }  from "express";
import dotenv from "dotenv";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
import bodyParser from "body-parser";
import {router} from "./src/routes/app.routes.js";
const configPath = path.resolve("src","config","uat.env")
dotenv.config({path:configPath})
const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
console.log(path.join("public"))
app.use("/",express.static(path.join('public')));
app.set("view engine", "ejs");
app.set("views", path.resolve("src","feature","tracker", "views"));
// configure routes
app.use("/",router);

export default app;
