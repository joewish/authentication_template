import { userSchema } from '../model/app.schema.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {transporter} from '../config/nodemailer.js';
import recaptcha  from 'recaptcha2';
import {recaptcha2} from '../config/recaptcha.js';
import mongoose from 'mongoose';
const User = mongoose.model("user", userSchema)

export const getSignup = (req, res) => {
  res.render('signup');
};

export const postSignup = async (req, res) => {
  const { email, password, password2 } = req.body;
  if (password !== password2) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/signup');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already exists');
      return res.redirect('/signup');
    }

    const newUser = new User({ email, password });
    await newUser.save();
    res.redirect('/signin');
  } catch (err) {
    req.flash('error', 'Error creating account');
    res.redirect('/signup');
  }
};

export const getSignin = (req, res) => {
  res.render('signin');
};

export const signout = (req, res) => {
  req.logout();
  res.redirect('/signin');
};

export const getHome = (req, res) => {
  res.render('home', { user: req.user });
};

export const getResetPassword = (req, res) => {
  res.render('resetPassword');
};

export const postResetPassword = async (req, res) => {
  const { email, newPassword, newPassword2 } = req.body;
  if (newPassword !== newPassword2) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/reset');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'No user found with that email');
      return res.redirect('/reset');
    }

    user.password = newPassword;
    await user.save();
    res.redirect('/signin');
  } catch (err) {
    req.flash('error', 'Error resetting password');
    res.redirect('/reset');
  }
};

export const getForgotPassword = (req, res) => {
  res.render('forgotPassword');
};

export const postForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'No user found with that email');
      return res.redirect('/forgot');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);

    req.flash('info', `An email has been sent to ${user.email} with further instructions.`);
    res.redirect('/forgot');
  } catch (err) {
    req.flash('error', 'Error sending the email');
    res.redirect('/forgot');
  }
};
