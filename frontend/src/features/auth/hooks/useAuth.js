import { useState } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    clearMessages();

    try {
      const data = await authService.login(emailOrUsername, password);
      setSuccessMessage('Login successful! Redirecting...');

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return true;
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    setLoading(true);
    clearMessages();

    try {
      await authService.register(username, email, password, confirmPassword);
      setSuccessMessage('Registration successful! Check your email to verify.');
      return true;
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    loading,
    errorMessage,
    successMessage,
    clearMessages,
  };
};
