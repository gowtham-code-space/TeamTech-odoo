import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('auth_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsLoading(true);

    // Simulate backend auth response delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Persist email if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem('auth_remembered_email', email);
      } else {
        localStorage.removeItem('auth_remembered_email');
      }

      // Backend Compatibility: payload is email, password.
      // Mock auth response maps to mock user and retrieves role dynamically
      // from 'dev_role' storage if configured, defaulting to Employee.
      const assignedRole = localStorage.getItem('dev_role') || 'Employee';
      const mockUser = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: email.split('@')[0],
        email: email,
        role: assignedRole,
      };

      // Perform state transition
      loginStore(mockUser, 'mock-jwt-token-payload', assignedRole);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background decoration blur paths */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      {/* Auth Card Frame */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-tr from-indigo-500 to-violet-500 p-3 rounded-2xl text-white font-extrabold text-2xl tracking-wider shadow-lg shadow-indigo-500/25 mb-4 select-none">
            AF
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to AssetFlow</h2>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">Enterprise Asset & Resource Management</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
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
          <div className="flex items-center justify-between text-xs font-semibold select-none">
            <label className="flex items-center gap-2 text-slate-450 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800/50 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            
            <button
              type="button"
              disabled={isLoading}
              className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                // Placeholder forgot password alert for hackathon scope
                alert('Reset password flow is future scope (Phase 4+).');
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
            className="mt-2"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
          <p className="text-slate-450 text-xs font-semibold">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              disabled={isLoading}
              className="text-indigo-400 hover:text-indigo-300 hover:underline font-bold cursor-pointer disabled:opacity-50"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
