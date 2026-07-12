import { create } from 'zustand';

export const useAuthStore = create((set) => {
  // Retrieve initial state from localStorage if it exists
  const initialUser = JSON.parse(localStorage.getItem('auth_user') || 'null');
  const initialToken = localStorage.getItem('auth_token') || '';
  const initialRole = localStorage.getItem('auth_role') || '';
  const initialIsAuthenticated = !!initialToken;

  return {
    user: initialUser,
    token: initialToken,
    role: initialRole,
    isAuthenticated: initialIsAuthenticated,

    login: (user, token, role) => {
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_role', role);
      set({
        user,
        token,
        role,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      set({
        user: null,
        token: '',
        role: '',
        isAuthenticated: false,
      });
    },

    setUser: (user) => {
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user });
    },
  };
});
