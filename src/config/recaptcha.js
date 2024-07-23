import recaptcha from 'recaptcha2';

export const recaptcha2 = new recaptcha({
  siteKey: process.env.RECAPTCHA_SITE_KEY,
  secretKey: process.env.RECAPTCHA_SECRET_KEY
});

