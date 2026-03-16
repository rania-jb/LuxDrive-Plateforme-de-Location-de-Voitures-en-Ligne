const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: `"LuxDrive Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.COMPANY_EMAIL,
    replyTo: email,
    subject: `[LuxDrive Contact] ${subject}`,
    html: `<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 28px 32px;">
          <h2 style="color: white; margin: 0; font-size: 20px;">📩 Nouveau message — LuxDrive</h2>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: 700; color: #374151; width: 130px;">Nom :</td>
              <td style="padding: 10px 0; color: #111827;">${name}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 0; font-weight: 700; color: #374151;">Email :</td>
              <td style="padding: 10px 0; color: #111827;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 700; color: #374151;">Sujet :</td>
              <td style="padding: 10px 0; color: #111827;">${subject}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <h4 style="color: #374151; margin-bottom: 12px;">Message :</h4>
          <p style="color: #4b5563; line-height: 1.8; white-space: pre-line;">${message}</p>
        </div>
        <div style="background: #f9fafb; padding: 16px 32px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Vous pouvez répondre directement à cet email pour contacter ${name}</p>
        </div>
      </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send email. Please try again.' });
  }
});

module.exports = router;