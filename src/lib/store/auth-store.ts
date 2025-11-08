import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../schemas/auth-schemas';
import { EmployeeResponse } from '../schemas/employee-schemas';
import { AuthService, setAuthToken, setLogoutCallback } from '../services/auth-service';
import { setLocationAuthToken, setLocationLogoutCallback } from '../services/location-service';
import { setRoleAuthToken, setRoleLogoutCallback } from '../services/role-service';

interface AuthState {
  // State
  user: User | null;
  employee: EmployeeResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  employeeLoading: boolean;
  employeeError: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setEmployee: (employee: EmployeeResponse | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEmployeeLoading: (loading: boolean) => void;
  setEmployeeError: (error: string | null) => void;
  login: (user: User, token: string, employee?: EmployeeResponse | null) => void;
  logout: () => void;
  logoutAll: () => Promise<void>;
  clearError: () => void;
  clearEmployeeError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      employee: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true to prevent premature redirects
      error: null,
      employeeLoading: false,
      employeeError: null,

      // Actions
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
        // Ensure token consistency when user is cleared
        if (!user) {
          setAuthToken(null);
          setLocationAuthToken(null);
          setRoleAuthToken(null);
        }
      },

      setEmployee: (employee: EmployeeResponse | null) => {
        set({ employee, employeeError: null });
      },

      setToken: (token: string | null) => {
        set({ token });
        setAuthToken(token);
        setLocationAuthToken(token);
        setRoleAuthToken(token);
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setEmployeeLoading: (loading: boolean) => {
        set({ employeeLoading: loading });
      },

      setEmployeeError: (error: string | null) => {
        set({ employeeError: error });
      },

      login: (user: User, token: string, employee?: EmployeeResponse | null) => {
        set({
          user,
          employee: employee || null,
          token,
          isAuthenticated: true,
          error: null,
          employeeError: null,
        });
        setAuthToken(token);
        setLocationAuthToken(token);
        setRoleAuthToken(token);
      },

      logout: () => {
        set({
          user: null,
          employee: null,
          token: null,
          isAuthenticated: false,
          error: null,
          employeeError: null,
        });
        setAuthToken(null);
        setLocationAuthToken(null);
        setRoleAuthToken(null);
      },

      logoutAll: async () => {
        try {
          await AuthService.logoutAll();
        } catch (error) {
          console.error('Failed to logout from all sessions:', error);
        } finally {
          // Clear local state regardless of API call result
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
          setAuthToken(null);
          setLocationAuthToken(null);
          setRoleAuthToken(null);
        }
      },

      clearError: () => {
        set({ error: null });
      },

      clearEmployeeError: () => {
        set({ employeeError: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: AuthState) => ({
        user: state.user,
        employee: state.employee,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Validate auth state consistency after hydration
          const hasUser = !!state.user;
          const hasToken = !!state.token;
          const shouldBeAuthenticated = hasUser && hasToken;
          
          if (state.isAuthenticated !== shouldBeAuthenticated) {
            // Fix inconsistent state
            state.isAuthenticated = shouldBeAuthenticated;
            if (!shouldBeAuthenticated) {
              state.user = null;
              state.token = null;
              setAuthToken(null);
            }
          }
          
          // Ensure token is set in auth service if we have a valid token
          if (state.token && state.isAuthenticated) {
            setAuthToken(state.token);
            setLocationAuthToken(state.token);
            setRoleAuthToken(state.token);
          }
          
          // Set loading to false after hydration and validation
          state.isLoading = false;
        }
      },
    }
  )
);

// Set up logout callback for auth service 401 handling
setLogoutCallback(() => {
  useAuthStore.getState().logout();
});

// Set up logout callback for location service 401 handling
setLocationLogoutCallback(() => {
  useAuthStore.getState().logout();
});

// Set up logout callback for role service 401 handling
setRoleLogoutCallback(() => {
  useAuthStore.getState().logout();
});

// Ensure loading state is eventually set to false (fallback for hydration issues)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const state = useAuthStore.getState();
    if (state.isLoading) {
      useAuthStore.setState({ isLoading: false });
    }
  }, 1000); // 1 second timeout
}

// Selectors
export const useAuth = () => {
  const {
    user,
    employee,
    token,
    isAuthenticated,
    isLoading,
    error,
    employeeLoading,
    employeeError,
    setUser,
    setEmployee,
    setToken,
    setLoading,
    setError,
    setEmployeeLoading,
    setEmployeeError,
    login,
    logout,
    logoutAll,
    clearError,
    clearEmployeeError,
  } = useAuthStore();

  return {
    user,
    employee,
    token,
    isAuthenticated,
    isLoading,
    error,
    employeeLoading,
    employeeError,
    setUser,
    setEmployee,
    setToken,
    setLoading,
    setError,
    setEmployeeLoading,
    setEmployeeError,
    login,
    logout,
    logoutAll,
    clearError,
    clearEmployeeError,
  };
};