/*
// DEPRECATED: Test file for email sending - kept for reference
// To use: Uncomment the code below and run `node Backend/test_email.js`

import { sendEmail } from './src/services/mail.service.js';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  try {
    console.log("📧 Sending test email to harshit.fullstack24@gmail.com...");

    const html = `
      <h1>Test Email</h1>
      <p>Hello! This is a test email from your AI Assistant backend.</p>
      <p>If you received this, email sending is working correctly!</p>
      <br>
      <p><strong>Test Details:</strong></p>
      <ul>
        <li>Sender: harshit.fullstack24@gmail.com (Gmail OAuth2)</li>
        <li>Service: Node.js + Nodemailer</li>
        <li>Date: ${new Date().toLocaleString()}</li>
      </ul>
      <p style="color: green;">✅ Email system is operational!</p>
    `;

    const text = `
Test Email from AI Assistant

Hello! This is a test email from your AI Assistant backend.
If you received this, email sending is working correctly!

Test Details:
- Sender: harshit.fullstack24@gmail.com (Gmail OAuth2)
- Service: Node.js + Nodemailer
- Date: ${new Date().toLocaleString()}

✅ Email system is operational!
    `;

    await sendEmail(
      'harshit.fullstack24@gmail.com',
      '✅ AI Assistant - Email System Test',
      html,
      text
    );

    console.log("✅ Email sent successfully!");
    console.log("📍 Check your inbox at harshit.fullstack24@gmail.com");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    process.exit(1);
  }
}

testEmail();
*/
