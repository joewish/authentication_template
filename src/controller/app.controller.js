import { userSchema } from "../model/app.schema.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../config/nodemailer.js";
import mongoose from "mongoose";
const User = mongoose.model("user", userSchema);
const url="http://localhost:3000"
export const getSignup = (req, res, next) => {
  res.status(201).render("landing");
};

export const postSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
      if (existingUser.name === name && isPasswordMatch) {
        return res.status(200).render("home", { user: existingUser});
      } else {
        return res.status(200).render("signin", { error: true });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      return res.render("home", { user: newUser.name });
    }
  } catch (err) {
        return res.render("error");
  }
};
export const getSignin = (req, res) => {
  res.render("signin", { error: false });
};

export const signout = (req, res) => {
  req.logout();
  res.render("landing", { error: false });
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
    // if (!user) {
    //   return res.render("forgot");
    // }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const transporter = nodemailer.createTransport({
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${url}/reset
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
