
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, RegisterData } from '@/modules/user-management1/types/auth.types';
import { authService } from '@/modules/user-management1/services/auth.service';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (profileData: any) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API call - replace with actual API
          const mockResponse = await authService.login(credentials);
          
          set({
            user: mockResponse.user,
            token: mockResponse.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false
          });
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API call - replace with actual API
          const mockResponse = await authService.register(data);
          
          set({
            user: mockResponse.user,
            token: mockResponse.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: async (profileData: any) => {
        try {
          set({ isLoading: true, error: null });
          
          const updatedUser = await authService.updateProfile(profileData);
          
          set({
            user: updatedUser,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Profile update failed',
            isLoading: false
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
