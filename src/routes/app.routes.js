// routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import {getSignup,postSignup,getSignin,signout,getHome,getResetPassword,postResetPassword,getForgotPassword,postForgotPassword} from '../controller/app.controller.js';
export const router = express.Router();

router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.get('/signin', getSignin);
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/signin',
  failureFlash: true
}));
router.get('/signout', signout);
router.get('/home', getHome);
router.get('/reset', getResetPassword);
router.post('/reset', postResetPassword);
router.get('/forgot', getForgotPassword);
router.post('/forgot', postForgotPassword);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/signin' }), (req, res) => {
  res.redirect('/home');
});

