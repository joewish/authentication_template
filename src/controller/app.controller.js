import { userSchema } from "../model/app.schema.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";
import axios from "axios";
import { error } from "console";
const User = mongoose.model("user", userSchema);
const url = "https://authentication-template.onrender.com";
export const getSignup = (req, res, next) => {
  res.status(201).render("landing");
};
export const postSignup = async (req, res) => {
  const { name, email, password, 'g-recaptcha-response': recaptchaResponse } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Set this in your environment variables
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  try {
    // ReCaptcha verification
    // const response = await axios.post(verificationUrl);
    // const { success } = response.data;
    // if (!success) {
    //   req.flash('message', 'Captcha verification failed. Please try again.');
    //   return res.redirect('/signup');
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
      if (existingUser.name === name && isPasswordMatch) {
        req.flash('message', {messages:'You are already registered. Please sign in.'});
        return res.render('home',{ user: existingUser });
      } else {
        req.flash('message', {messages:'you have entered the wrong password'});
        return res.render('signin',{error:false});
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      req.flash('message', {messages:'Signup successful! Please sign in.'});
      return res.render('signin',{error:false});
    }
  } catch (err) {
    console.error(err);
    req.flash('message', {messages:`name ${name} or email ${email} are alreday register to us. Please try to reset your password`});
    return res.render('signin',{error:false});
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

export const getResetPassword = async(req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash('message', { messages: 'Password reset token is invalid or has expired.' });
      return res.redirect('/forgot');
    }

    res.render('resetPassword', { token: req.params.token });
  } catch (err) {
    console.error(err);
    req.flash('message', { messages: 'An error occurred while processing your request.' });
    res.redirect('/forgot');
  }
};

export const postResetPassword = async (req, res) => {
  const { email, newPassword, newPassword2 } = req.body;
  if (newPassword !== newPassword2) {
    return res.render("resetPassword");
  }
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (req.body.newPassword === req.body.newPassword2) {
      user.password = req.body.newPassword; // Make sure to hash the password before saving
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      req.flash('message', { messages: 'Password has been successfully reset.' });
      res.render('signin',{error:false});
    } else {
      req.flash('message', { messages: 'Passwords do not match.' });
      res.redirect('/resetPassword');
    }
  } catch (err) {
    console.error(err);
    req.flash('message', { messages: 'An error occurred while resetting your password.' });
    res.redirect('forgot');
  }
};

export const getForgotPassword = (req, res) => {
  res.render("forgotPassword",{error:false});
};

export const postForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('message', {messages:'Guest User, you don\'t have an account created with us 🥲'});
      return res.render("forgotPassword", { error:true});
    }

    const token = crypto.randomBytes(20).toString('hex');
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

    const resetUrl = `${url}/reset/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    req.flash('message', {messages:`An email has been sent to ${user.email} with further instructions.`});
    return res.render("forgot");
  } catch (err) {
    console.error(err);
    req.flash('message', {messages:'Error sending the email'});
    return res.render("forgot");
  }
};
