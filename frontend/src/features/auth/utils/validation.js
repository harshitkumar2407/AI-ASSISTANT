export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateUsername = (username) => {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const validatePassword = (password) => {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
};

export const calculatePasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
};

export const getPasswordStrengthColor = (strength) => {
  if (strength === 0) return '#d4d4d4';
  if (strength === 1) return '#f59e0b';
  if (strength === 2) return '#fbbf24';
  if (strength === 3) return '#10b981';
  return '#22c55e';
};

export const getPasswordStrengthText = (strength) => {
  const levels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return levels[strength] || 'Very weak';
};
