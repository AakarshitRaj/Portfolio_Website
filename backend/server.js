// ==========================================
// server.js — Portfolio Backend with Brevo Email
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
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
const MY_EMAIL = process.env.MY_EMAIL;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

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

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });
  }

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

// Submit contact form (Save to Google Sheets + Send email)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

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

    // Send email using Brevo API
    const mailOptions = {
      from: MY_EMAIL,
      to: MY_EMAIL,
      subject: `New message from ${name}`,
      text: `📩 You got a new message from your portfolio site.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
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
      message: 'Failed to send message. Please try again.',
    });
  }
});

// Fetch contacts from Google Sheets
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔒 Admin password configured: ${ADMIN_PASSWORD ? 'Yes' : 'No'}`);
  console.log(`📧 Brevo API configured: ${BREVO_API_KEY ? 'Yes' : 'No'}`);
  console.log(`📊 Google Sheets configured: ${GOOGLE_SCRIPT_URL ? 'Yes' : 'No'}`);
});
