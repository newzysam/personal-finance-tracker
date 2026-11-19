const nodemailer = require('nodemailer');

module.exports = async function sendResetCode(email, code) {
  if (!process.env.MAIL_HOST) {
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
      throw new Error('Email delivery is not configured for password resets');
    }
    console.log(`[DEV RESET] ${email}: ${code}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: false,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Your password reset code',
    text: `Your password reset code is ${code}. It expires soon.`
  });
};
