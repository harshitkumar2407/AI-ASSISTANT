import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
} from '../utils/validation';
import '../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, loading, errorMessage, successMessage } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3+ chars, alphanumeric + underscore';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Min 6 chars, 1 uppercase, 1 number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (success) {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setPasswordStrength(0);

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join AI Assistant and start chatting with AI</p>
        </div>

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

        <form onSubmit={handleSubmit} className="auth-form">
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
            <p className="form-hint">3+ characters, letters, numbers, underscore</p>
          </div>

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
            <p className="form-hint">You'll verify this email</p>
          </div>

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
              placeholder="Create strong password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.password && (
              <span className="form-error">{errors.password}</span>
            )}

            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(passwordStrength),
                    }}
                  />
                </div>
                <span className="strength-text">
                  {getPasswordStrengthText(passwordStrength)}
                </span>
              </div>
            )}

            <p className="form-hint">Min 6 chars, 1 uppercase, 1 number</p>
          </div>

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
              placeholder="Re-enter password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="form-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <div className="footer-text">
            Already have account?{' '}
            <Link to="/login" className="footer-link">
              Sign in
            </Link>
          </div>
        </div>

        <p className="auth-terms">
          By signing up, you agree to our{' '}
          <a href="#" className="footer-link">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="footer-link">
            Privacy
          </a>
        </p>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-buttons">
          <button type="button" className="social-btn">
            <span className="social-icon">🔍</span>
            Google
          </button>
          <button type="button" className="social-btn">
            <span className="social-icon">🐙</span>
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
