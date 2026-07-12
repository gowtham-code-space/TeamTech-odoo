import { create } from 'zustand';

export const useAuthStore = create((set) => {
  // Retrieve initial state from localStorage if it exists
  const initialUser = JSON.parse(localStorage.getItem('auth_user') || 'null');
  const initialToken = localStorage.getItem('auth_token') || '';
  const initialRole = localStorage.getItem('auth_role') || '';
  const initialOrganizationId = localStorage.getItem('auth_organization_id') || '';
  const initialTenantId = localStorage.getItem('auth_tenant_id') || '';
  const initialIsAuthenticated = !!initialToken;

  return {
    user: initialUser,
    token: initialToken,
    role: initialRole,
    organization_id: initialOrganizationId,
    tenant_id: initialTenantId,
    isAuthenticated: initialIsAuthenticated,

    login: (user, token, role, organization_id = '', tenant_id = '') => {
      const orgId = organization_id || user?.organization_id || '';
      const tenId = tenant_id || user?.tenant_id || '';
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_role', role);
      localStorage.setItem('auth_organization_id', orgId);
      localStorage.setItem('auth_tenant_id', tenId);
      set({
        user,
        token,
        role,
        organization_id: orgId,
        tenant_id: tenId,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('auth_organization_id');
      localStorage.removeItem('auth_tenant_id');
      set({
        user: null,
        token: '',
        role: '',
        organization_id: '',
        tenant_id: '',
        isAuthenticated: false,
      });
    },

    setUser: (user) => {
      localStorage.setItem('auth_user', JSON.stringify(user));
      const updates = { user };
      if (user && user.organization_id !== undefined) {
        localStorage.setItem('auth_organization_id', user.organization_id || '');
        updates.organization_id = user.organization_id || '';
      }
      if (user && user.tenant_id !== undefined) {
        localStorage.setItem('auth_tenant_id', user.tenant_id || '');
        updates.tenant_id = user.tenant_id || '';
      }
      set(updates);
    },
  };
});
