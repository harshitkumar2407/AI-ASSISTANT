import nodemailer from 'nodemailer';

// Create a Gmail transporter using OAuth2 authentication
// This connects to Gmail SMTP server with our OAuth2 credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

// High-level wrapper function around the email service
// This adds validation, error handling, and default values
// Provides safer email sending with built-in checks and error messages
export const sendEmail = async (to, subject, html, text = '') => {
  try {
    // Validate that all required email fields are provided
    // to, subject, and html are mandatory - text is optional (default = '')
    if (!to || !subject || !html) {
      throw new Error('Missing required email fields: to, subject, html');
    }

    // Prepare the email configuration object with sender and recipient info
    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text,
    };

    // Send the email through Gmail and get response details
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    // Catch any errors (validation errors, sending failures, etc)
    // Log error details for debugging
    console.error('Email sending error:', error.message);
    // Re-throw the error so the caller can handle it (e.g., in the controller)
    throw error;
  }
};
