import { userSchema } from "../model/app.schema.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { transporter } from "../config/nodemailer.js";
import mongoose from "mongoose";
const User = mongoose.model("user", userSchema);

export const getSignup = (req, res, next) => {
  res.status(201).render("landing");
};

export const postSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser.name == name) {
      if (existingUser.password == password) {
        res.status(200).render("home", { error: existingUser.email });
      } else {
        res.status(200).render("signin", { error: true });
      }
      //return res.render('home',{user:existingUser.name});
    } else {
      const newUser = new User({ name, email, password });
      await newUser.save();
      return res.render("home", { user: existingUser.name });
    }
  } catch (err) {
    console.error(err.message);
    return res.render("error");
  }
};

export const getSignin = (req, res) => {
  res.render("signin", { error: false });
};

export const signout = (req, res) => {
  req.logout();
  res.render("signin", { error: false });
};

export const getHome = (req, res) => {
  res.render("home", { user: req.user });
};

export const getResetPassword = (req, res) => {
  res.render("resetPassword");
};

export const postResetPassword = async (req, res) => {
  console.log(req.body);
  const { email, newPassword, newPassword2 } = req.body;
  if (newPassword !== newPassword2) {
    return res.render("resetPassword");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("resetPassword");
    }

    user.password = newPassword;
    await user.save();
    res.render("signin", { error: false });
  } catch (err) {
    res.render("resetPassword");
  }
};

export const getForgotPassword = (req, res) => {
  res.render("forgotPassword");
};

export const postForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("/forgot");
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    // req.flash('info', `An email has been sent to ${user.email} with further instructions.`);
    res.render("/forgot");
  } catch (err) {
    // req.flash('error', 'Error sending the email');
    res.render("/forgot");
  }
};
