import { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return Math.min(strength, 4); // Max 4
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message || 'Registration failed. Please try again.'
        );
      } else {
        setSuccessMessage(
          'Account created successfully! Check your email to verify your account.'
        );
        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setPasswordStrength(0);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return '#d4d4d4';
    if (passwordStrength === 1) return '#f59e0b';
    if (passwordStrength === 2) return '#fbbf24';
    if (passwordStrength === 3) return '#10b981';
    return '#22c55e';
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        {/* Header */}
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join AI Assistant and start chatting with AI</p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="alert alert-error slide-down">
            <span className="alert-icon">⚠️</span>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success slide-down">
            <span className="alert-icon">✓</span>
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="your_username"
              className={`form-input ${errors.username ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.username && (
              <span className="form-error">{errors.username}</span>
            )}
            <p className="form-hint">
              3+ characters, letters, numbers, and underscores only
            </p>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.email && (
              <span className="form-error">{errors.email}</span>
            )}
            <p className="form-hint">You'll need to verify this email</p>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.password && (
              <span className="form-error">{errors.password}</span>
            )}

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(),
                    }}
                  ></div>
                </div>
                <span className="strength-text">
                  {passwordStrength === 0 && 'Very weak'}
                  {passwordStrength === 1 && 'Weak'}
                  {passwordStrength === 2 && 'Fair'}
                  {passwordStrength === 3 && 'Good'}
                  {passwordStrength === 4 && 'Strong'}
                </span>
              </div>
            )}

            <p className="form-hint">
              At least 6 characters, 1 uppercase, 1 number
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="form-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="auth-footer">
          <div className="footer-text">
            Already have an account?{' '}
            <Link to="/login" className="footer-link">
              Sign in
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="auth-terms">
          By signing up, you agree to our{' '}
          <a href="#" className="footer-link">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="footer-link">
            Privacy Policy
          </a>
        </p>

        {/* Divider */}
        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        {/* Social Buttons */}
        <div className="social-buttons">
          <button type="button" className="social-btn google-btn">
            <span className="social-icon">🔍</span>
            Google
          </button>
          <button type="button" className="social-btn github-btn">
            <span className="social-icon">🐙</span>
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
