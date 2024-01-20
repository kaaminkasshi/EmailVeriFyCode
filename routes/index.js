const express = require('express');
const router = express.Router();
const fs = require('fs');
const nodemailer = require('nodemailer');

// Load existing users and verification codes
const users = require('../Users.json');  // Use the correct relative path
const verificationCodes = require('../verificationCode.json');  

// Home route
router.get('/', (req, res) => {
  res.render('signup');
});

// Signup route
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Generate a 4-digit verification code
const verificationCode = Math.floor(1000 + Math.random() * 9000);

  // Save user details and verification code
  users.push({ name, email, password });
  verificationCodes[email] = verificationCode;

  // Send verification code via email
  sendVerificationEmail(email, verificationCode);

  res.render('emailVerify', { email });
});

// Email verification route
router.post('/verify', (req, res) => {
  const { email, verificationCode } = req.body;

  if (verificationCodes[email] && verificationCodes[email] == verificationCode) {
    res.render('login', { email });
  } else {
    res.send('Invalid verification code. Please try again.');
  }
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check user credentials
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.render('homeProfile', { name: user.name });
  } else {
    res.send('Invalid login credentials. Please try again.');
  }
});

// Function to send verification code via email
function sendVerificationEmail(email, verificationCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.G_ID,  // Provide a valid email address
    pass: process.env.EPASS // Add your Gmail password
    },
  });

  const mailOptions = {
    from: process.env.G_ID,
    to: email,
    subject: 'Email Verification Code',
    text: `Your email verification code is: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}

module.exports = router;

