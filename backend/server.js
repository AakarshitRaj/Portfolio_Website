// backend/server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ==========================================
// SECRETS - Stored securely in .env file
// ==========================================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
const MY_EMAIL = process.env.MY_EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD; // Gmail App Password

// ==========================================
// EMAIL TRANSPORTER (Nodemailer)
// ==========================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MY_EMAIL,
    pass: APP_PASSWORD
  }
});

// Verify connection once on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service not ready:', error.message);
  } else {
    console.log('📨 Email service ready to send messages');
  }
});

// ==========================================
// ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }

  if (password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
    return res.json({
      success: true,
      message: 'Login successful',
      token
    });
  }

  res.status(401).json({
    success: false,
    message: 'Incorrect password'
  });
});

// Submit contact form (saves to Google Sheets + sends email)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Save to Google Sheets via Apps Script
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('timestamp', new Date().toISOString());

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // Send email via Nodemailer
    const mailOptions = {
      from: MY_EMAIL,
      to: MY_EMAIL, // or another address where you want to receive messages
      subject: `New message from ${name}`,
      text: `📩 You got a new message from your portfolio site.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

// Get contact messages from Google Sheets (for admin)
app.get('/api/contacts', async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const data = await response.json();

    res.json({
      success: true,
      contacts: data
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
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
  console.log(`📧 Gmail email configured: ${MY_EMAIL ? 'Yes' : 'No'}`);
  console.log(`📊 Google Sheets configured: ${GOOGLE_SCRIPT_URL ? 'Yes' : 'No'}`);
});
