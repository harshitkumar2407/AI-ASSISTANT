import { validationResult } from "express-validator";
import UserModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Register controller - creates new user account with email verification
export const register = async (req, res) => {
  try {
    // Step 1: Check for validation errors from express-validator middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Step 2: Extract request body data
    const { username, email, password, confirmPassword } = req.body;

    // Step 3: Verify passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Step 4: Check if user already exists (by email or username)
    const userExists = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email or username",
      });
    }

    // Step 5: Create new user in database
    const user = await UserModel.create({
      username,
      email,
      password,
    });

    // Step 6: Generate JWT token for email verification (expires in 1 day)
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send verification email
    try {
      const html = `<p>Hi ${user.username},</p>
      <p>Thank you for registering. Please verify your email by clicking the link below:</p>
      <a href="${process.env.WEBSITE_DOMAIN}/verify-email?token=${verificationToken}">Verify Email</a>`;

      const text = `Hi ${user.username},\n\nThank you for registering. Please verify your email by clicking the link below:\n${process.env.WEBSITE_DOMAIN}/verify-email?token=${verificationToken}`;

      await sendEmail(
        user.email,
        "Welcome to AI Assistant - Verify Your Email",
        html,
        text,
      );
    } catch (emailError) {
      console.warn("Email sending failed:", emailError.message);
      // Continue registration even if email fails
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate field value entered",
        field: Object.keys(error.keyPattern)[0],
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// Email verification controller - marks user's email as verified using JWT token
export const emailVerification = async (req, res) => {
  try {
    const { token } = req.query;

    // Verify and decode the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from decoded token
    const user = await UserModel.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is already verified
    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Mark email as verified and save
    user.verified = true;
    await user.save();

    // Send HTML response with success page
    res.status(200).send(`
      <html>
        <head>
          <title>Email Verified</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: green; }
          </style>
        </head>
        <body>
          <h1>Email verified successfully!</h1>
          <p>Your email has been verified. You can now log in to your account.</p>
        </body>
      </html>
    `);

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).send(`
      <html>
        <head>
          <title>Verification Failed</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: red; }
          </style>
        </head>
        <body>
          <h1>Email Verification Failed</h1>
          <p>The verification link is invalid or expired. Please request a new one.</p>
        </body>
      </html>
    `);
  }
};
    



// Login controller - authenticates user with email/username and password
export const login = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Check if user exists by email or username (at least one must be provided)
    const user = await UserModel.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or password",
      });
    }
    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email before logging in.",
      });
    }
    const token = jwt.sign({
                  userId: user._id,
                  username: user.username },
                  process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  }
  catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Get current user profile controller - returns authenticated user's details
export const getMe = async (req, res) => {
  const userId = req.user.userId;
  try {
    // Find user by ID and exclude password field
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};