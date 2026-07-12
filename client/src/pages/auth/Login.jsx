import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import apiClient from '../../services/core/apiClient';
import { RiSunLine, RiMoonLine, RiComputerLine } from 'react-icons/ri';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const isDevMode = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_ROLE_SELECTOR === 'true';
  const [devRole, setDevRole] = useState(() => {
    return localStorage.getItem('dev_role') || 'EMPLOYEE';
  });

  useEffect(() => {
    if (isDevMode && !localStorage.getItem('dev_role')) {
      localStorage.setItem('dev_role', 'EMPLOYEE');
    }
  }, [isDevMode]);

  const handleDevRoleChange = (val) => {
    setDevRole(val);
    localStorage.setItem('dev_role', val);
  };

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('auth_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    // Development Authentication Bypass Mode
    if (isDevMode) {
      setIsLoading(true);
      setTimeout(() => {
        const mockUser = {
          id: 'dev-user',
          full_name: 'Development User',
          email: 'dev@assetflow.local',
          role: devRole
        };
        const mockToken = 'dev-token-bypass-mode';
        loginStore(mockUser, mockToken, devRole);
        setIsLoading(false);
        navigate('/dashboard');
      }, 300);
      return;
    }

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Backend Request Payload: { email, password }
      const response = await apiClient.post('/api/auth/login', {
        email: email.toLowerCase().trim(),
        password,
      });

      const { user, token } = response.data.data;

      // Persist email if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem('auth_remembered_email', email);
      } else {
        localStorage.removeItem('auth_remembered_email');
      }

      // Perform state transition
      loginStore(user, token, user.role);
      
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Authentication failed. Please verify credentials.';
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
        
        {/* Theme Toggle Button inside login card */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-850 transition-all duration-200 cursor-pointer"
          title="Switch Login Page Theme"
        >
          {getThemeIcon()}
        </button>

        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-tr from-indigo-550 to-violet-550 dark:from-indigo-500 dark:to-violet-500 p-3 rounded-2xl text-white font-extrabold text-2xl tracking-wider shadow-lg shadow-indigo-650/15 dark:shadow-indigo-500/25 mb-4 select-none">
            AF
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sign In to AssetFlow</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">Enterprise Asset & Resource Management</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-450 text-xs font-semibold text-left select-none animate-fade-in">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email input field */}
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorMessage={errors.email}
            disabled={isLoading}
            required
          />

          {/* Password input field */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={errors.password}
            disabled={isLoading}
            required
          />

          {/* Remember me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs font-bold select-none text-slate-500 dark:text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            
            <button
              type="button"
              disabled={isLoading}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline cursor-pointer disabled:opacity-50"
              onClick={() => {
                alert('Contact your system administrator to reset forgotten passwords.');
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            className="mt-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500"
          >
            Sign In
          </Button>
        </form>

        {isDevMode && (
          <div className="mt-5 p-4 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl text-left select-none">
            <div className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Development Login Mode Enabled
            </div>
            <select
              value={devRole}
              onChange={(e) => handleDevRoleChange(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-amber-550/30 dark:border-amber-500/20 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="ASSET_MANAGER">ASSET_MANAGER</option>
              <option value="DEPARTMENT_HEAD">DEPARTMENT_HEAD</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>
          </div>
        )}

        <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-800/80 pt-6">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              disabled={isLoading}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline font-bold cursor-pointer disabled:opacity-50"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
