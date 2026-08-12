import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validatePassword } from '../utils/validation';
import '../styles/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const { login, loading, errorMessage, successMessage } = useAuth();

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Please enter email or username';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Invalid password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await login(formData.emailOrUsername, formData.password);

    if (success) {
      setTimeout(() => {
        window.location.href = '/chat';
      }, 1500);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your AI Assistant account</p>
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
            <label htmlFor="emailOrUsername" className="form-label">
              Email or Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              placeholder="your@email.com or username"
              className={`form-input ${errors.emailOrUsername ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.emailOrUsername && (
              <span className="form-error">{errors.emailOrUsername}</span>
            )}
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
              placeholder="Enter your password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.password && (
              <span className="form-error">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

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

export default Login;
