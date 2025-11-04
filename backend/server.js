// ==========================================
// server.js — Portfolio Backend with Brevo Email + Google Sheets
// ==========================================
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const brevoTransport = require('nodemailer-brevo-transport');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// ==========================================
// ENVIRONMENT VARIABLES
// ==========================================
const {
  ADMIN_PASSWORD,
  GOOGLE_SCRIPT_URL,
  MY_EMAIL,
  BREVO_API_KEY,
  PORT,
} = process.env;

// ==========================================
// EMAIL TRANSPORTER (Using Brevo API)
// ==========================================
const transporter = nodemailer.createTransport(
  brevoTransport({
    apiKey: BREVO_API_KEY,
  })
);

// Verify connection once on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service not ready:', error.message);
  } else {
    console.log('📨 Email service ready via Brevo API');
  }
});

// ==========================================
// ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (!password)
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });

  if (password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
    return res.json({
      success: true,
      message: 'Login successful',
      token,
    });
  }

  res.status(401).json({
    success: false,
    message: 'Incorrect password',
  });
});

// ==========================================
// CONTACT FORM: Save to Google Sheet + Send Email
// ==========================================
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });

    // Save to Google Sheets
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('timestamp', new Date().toISOString());

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    // Send email via Brevo
    const mailOptions = {
      from: MY_EMAIL,
      to: MY_EMAIL,
      subject: `📬 New Message from ${name}`,
      text: `You received a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
});

// ==========================================
// FETCH CONTACTS FROM GOOGLE SHEETS
// ==========================================
app.get('/api/contacts', async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const data = await response.json();

    res.json({
      success: true,
      contacts: data,
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
    });
  }
});

// ==========================================
// START SERVER
// ==========================================
const serverPort = PORT || 5000;
app.listen(serverPort, () => {
  console.log(`✅ Server running on port ${serverPort}`);
  console.log(`🔒 Admin password set: ${ADMIN_PASSWORD ? '✅ Yes' : '❌ No'}`);
  console.log(`📧 Brevo API key set: ${BREVO_API_KEY ? '✅ Yes' : '❌ No'}`);
  console.log(`📊 Google Script URL set: ${GOOGLE_SCRIPT_URL ? '✅ Yes' : '❌ No'}`);
});
