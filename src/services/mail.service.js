import nodemailer from 'nodemailer';

// Create a Gmail transporter using OAuth2 authentication
// This connects to Gmail SMTP server with our OAuth2 credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    clientId: process.env.GOOGLE_CLIENT_ID
  },
});

// Verify that the transporter is properly configured and can connect to Gmail
// Runs on startup to check if credentials are valid
transporter.verify().then(() => {
  console.log('Email transporter is ready');
}).catch((error) => {
  console.error('Error setting up email transporter:', error);
});

// Low-level email sending function - direct interface to nodemailer
// This is the base service that actually sends emails
// Minimal validation, expects caller to provide all required parameters
export const sendEmail = async (to, subject, html, text) => {
    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text,
    };
    const details = await transporter.sendMail(mailOptions);
    console.log('Email sent:', details.response);
    return details;
  };  