import { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Check if either email or username is provided
    if (!formData.email && !formData.username) {
      newErrors.email = 'Please enter email or username';
    }

    // Validate email format if provided
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email || undefined,
            username: formData.username || undefined,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message || 'Login failed. Please check your credentials.'
        );
      } else {
        setSuccessMessage('Login successful! Redirecting...');
        // Store token if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        // Redirect after 1.5 seconds
        setTimeout(() => {
          window.location.href = '/chat';
        }, 1500);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        {/* Header */}
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your AI Assistant account</p>
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
            <p className="form-hint">or enter your username below</p>
          </div>

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
            <p className="form-hint">or use your email above</p>
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
              placeholder="Enter your password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.password && (
              <span className="form-error">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="auth-footer">
          <div className="footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="footer-link">
              Sign up
            </Link>
          </div>
          <div className="footer-text">
            <Link to="/forgot-password" className="footer-link">
              Forgot password?
            </Link>
          </div>
        </div>

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

export default Login;
