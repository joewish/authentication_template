// routes/authRoutes.js
import express from 'express';
import { passport2 } from '../config/recaptcha.js';
import {getSignup,postSignup,getSignin,signout,getHome,getResetPassword,postResetPassword,getForgotPassword,postForgotPassword} from '../controller/app.controller.js';
export const router = express.Router();
router.get('/', getSignup);
router.post('/signup', postSignup);
router.get('/signin', getSignin);
router.post('/signin', passport2.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/signin',
  failureFlash: true
}));
router.get('/signout', signout);
router.get('/home', getHome);
router.get('/reset/:token', getResetPassword);
router.post('/reset/:token', postResetPassword);
router.get('/forgot', getForgotPassword);
router.post('/forgot', postForgotPassword);

router.get('/auth/google', passport2.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport2.authenticate('google', { failureRedirect: '/signin' }), (req, res) => {
  res.redirect('/home');
});

