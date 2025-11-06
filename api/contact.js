import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Save to Google Sheets
    const formData = new URLSearchParams({
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    });

    await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Send Email (optional)
    if (process.env.MY_EMAIL && process.env.BREVO_SMTP_KEY) {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.BREVO_SMTP_KEY,
        },
      });

      await transporter.sendMail({
        from: process.env.MY_EMAIL,
        to: process.env.MY_EMAIL,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });
    }

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Contact error:", error);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
}
