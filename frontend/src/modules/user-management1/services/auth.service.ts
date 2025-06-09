import apiClient from '@/api'; // <-- Import our new API client
import { LoginCredentials, RegisterData, User } from '@/modules/user-management1/types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      // Send a POST request to your backend's /auth/login endpoint
      const response = await apiClient.post('/auth/login', credentials);
      
      const { token, user } = response.data;

      // Store the token for future requests
      if (token) {
        localStorage.setItem('authToken', token);
      }

      return { user, token };
    } catch (error: any) {
      // Re-throw the error message from the backend
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  }
  
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    try {
      // Send a POST request to your backend's /auth/register endpoint
      // Note: Ensure your backend expects data in this format
      const response = await apiClient.post('/auth/register', data);
      
      const { token, user } = response.data;
      
      // Store the token for future requests
      if (token) {
        localStorage.setItem('authToken', token);
      }
      
      return { user, token };
    } catch (error: any) {
      // Re-throw the error message from the backend
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  // You can keep or remove the other methods as needed
  async verifyToken(token: string): Promise<User | null> {
    // This would require a backend endpoint like /auth/verify
    try {
        const response = await apiClient.get('/auth/me'); // Example endpoint
        return response.data.user;
    } catch (error) {
        return null;
    }
  }
}

export const authService = new AuthService();
