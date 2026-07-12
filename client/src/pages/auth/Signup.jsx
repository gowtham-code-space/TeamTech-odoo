import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import apiClient from '../../services/core/apiClient';
import { RiSunLine, RiMoonLine, RiComputerLine } from 'react-icons/ri';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const navigate = useNavigate();

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else if (nextTheme === 'light') {
      root.classList.add('light');
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isSystemDark ? 'dark' : 'light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <RiSunLine className="w-4 h-4 text-amber-500" />;
      case 'dark': return <RiMoonLine className="w-4 h-4 text-indigo-400" />;
      default: return <RiComputerLine className="w-4 h-4 text-slate-400 dark:text-slate-500" />;
    }
  };

  const validate = () => {
    const tempErrors = {};

    // Full Name Validation
    if (!fullName.trim()) {
      tempErrors.fullName = 'Full name is required';
    }

    // Email Validation
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }

    // Password Validation
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password Validation
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccess(false);

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Backend payload properties match backend database expectations: { full_name, email, password }
      const signupPayload = {
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: password,
      };

      await apiClient.post('/api/auth/signup', signupPayload);

      setIsLoading(false);
      setSuccess(true);
      
      // Redirect to login page after short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Registration failed. Please check input values.';
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-colors duration-200">
      {/* Background decoration blur paths */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl" />

      {/* Auth Card Frame */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl dark:shadow-2xl p-8 relative z-10">
        
        {/* Theme Toggle Button inside signup card */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-550 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-850 transition-all duration-200 cursor-pointer"
          title="Switch Signup Page Theme"
        >
          {getThemeIcon()}
        </button>

        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-tr from-indigo-550 to-violet-550 dark:from-indigo-500 dark:to-violet-500 p-3 rounded-2xl text-white font-extrabold text-2xl tracking-wider shadow-lg shadow-indigo-650/15 dark:shadow-indigo-500/25 mb-4 select-none">
            AF
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">Join AssetFlow as an Employee</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-450 text-xs font-semibold text-left select-none animate-fade-in">
            {apiError}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center select-none animate-fade-in">
            Registration successful! Redirecting to sign in...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Full Name */}
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            errorMessage={errors.fullName}
            disabled={isLoading || success}
            required
          />

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="john@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorMessage={errors.email}
            disabled={isLoading || success}
            required
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={errors.password}
            disabled={isLoading || success}
            required
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            errorMessage={errors.confirmPassword}
            disabled={isLoading || success}
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={isLoading || success}
            fullWidth
            className="mt-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-800/80 pt-6">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              disabled={isLoading || success}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline font-bold cursor-pointer disabled:opacity-50"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
