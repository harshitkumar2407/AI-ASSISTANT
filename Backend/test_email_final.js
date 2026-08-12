/*
// DEPRECATED: Final email test file - kept for reference
// To use: Uncomment the code below and run `node Backend/test_email_final.js`

import { sendEmail } from './src/services/mail.service.js';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  try {
    console.log("📧 Sending test email to harshit.fullstack24@gmail.com...");
    console.log("⏳ This may take a few seconds...\n");

    const html = `
      <h1 style="color: #667eea;">✅ Email System Test</h1>
      <p>Hello Harshit!</p>
      <p>Your email sending system is now <strong>fully operational</strong>!</p>
      <hr>
      <p><strong>Test Details:</strong></p>
      <ul>
        <li>✅ Gmail OAuth2 Configured</li>
        <li>✅ Refresh Token Valid</li>
        <li>✅ Email Service Working</li>
        <li>✅ Nodemailer Integration Complete</li>
      </ul>
      <p style="margin-top: 30px; color: green;">
        <strong>You can now:</strong>
      </p>
      <ul>
        <li>Register users with email verification</li>
        <li>Send password reset emails</li>
        <li>Send notification emails</li>
      </ul>
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        Sent at: ${new Date().toLocaleString()}<br>
        Service: AI Assistant Backend
      </p>
    `;

    const text = `
✅ Email System Test

Hello Harshit!

Your email sending system is now fully operational!

Test Details:
✅ Gmail OAuth2 Configured
✅ Refresh Token Valid
✅ Email Service Working
✅ Nodemailer Integration Complete

You can now:
- Register users with email verification
- Send password reset emails
- Send notification emails

Sent at: ${new Date().toLocaleString()}
Service: AI Assistant Backend
    `;

    await sendEmail(
      'harshit.fullstack24@gmail.com',
      '✅ AI Assistant - Email System Ready',
      html,
      text
    );

    console.log("✅ Email sent successfully!");
    console.log("📍 Check your inbox at harshit.fullstack24@gmail.com\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    process.exit(1);
  }
}

testEmail();
*/
