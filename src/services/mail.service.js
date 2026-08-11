import nodemailer from 'nodemailer';

let transporter = null;

// Create transporter lazily (on first use) to ensure env vars are loaded
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    // Verify connection on first creation
    transporter.verify().then(() => {
      console.log('✅ Email transporter is ready');
    }).catch((error) => {
      console.error('❌ Email transporter verification failed:', error.message);
    });
  }
  return transporter;
}

// Low-level email sending function - direct interface to nodemailer
export const sendEmail = async (to, subject, html, text) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
    text
  };
  try {
    const details = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    return details;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw error;
  }
};  