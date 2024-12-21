const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5000;

// In-memory storage for verification data (use a database in production)
const verificationData = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "mdmozammelhosen15701@gmail.com",
    pass: "efbsllcsjefrtqkm",
  },
});

// Generate a 6-digit verification code
const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000);

// Endpoint to send or resend the verification code
app.post("/send-verification", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }
  const verificationCode = generateVerificationCode();
  const expirationTime = Date.now() + 5 * 60 * 1000; // Code valid for 5 minutes

  // Save or update verification data
  verificationData[email] = {
    code: verificationCode,
    expiresAt: expirationTime,
  };
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 10px 0;
        border-bottom: 1px solid #dddddd;
      }
      .header h1 {
        font-size: 24px;
        color: #444444;
      }
      .content {
        text-align: center;
        padding: 20px;
      }
      .content h2 {
        font-size: 28px;
        color: #007BFF;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888888;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Crypto Verification</h1>
      </div>
      <div class="content">
        <p>Dear User,</p>
        <p>Your verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Crypto Inc. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
  try {
    // Send verification email
    await transporter.sendMail({
      from: `"Crypto" <${"mdmozammelhosen15701@gmail.com"}>`,
      to: email,
      subject: "Your Verification Code",
      // text: `Your verification code is ${verificationCode}. This code expires in 5 minutes.`,
      html: htmlContent,
    });

    res.status(200).json({
      message: "Verification email sent!",
      expirationTime: expirationTime,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send verification email." });
  }
});

// Endpoint to verify the code
app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required!" });
  }

  const data = verificationData[email];

  if (!data) {
    return res
      .status(400)
      .json({ message: "No verification data found for this email!" });
  }

  if (Date.now() > data.expiresAt) {
    return res.status(400).json({ message: "Verification code has expired!" });
  }

  if (Number(code) !== data.code) {
    return res.status(400).json({ message: "Invalid verification code!" });
  }

  // Code verified successfully
  delete verificationData[email]; // Clean up after verification
  res.status(200).json({ message: "Email verified successfully!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
