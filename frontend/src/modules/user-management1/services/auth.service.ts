import apiClient from '@/api'; // <-- Import our new API client
import { LoginCredentials, RegisterData, User, StudentProfile, FacultyProfile, AdminProfile, HODProfile, GuestProfile } from '@/modules/user-management1/types/auth.types';

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
      console.log('Sending registration data:', data);
      const response = await apiClient.post('/auth/register', data);
      console.log('Registration response:', response);
      const { token, user } = response.data;
      
      // Store the token for future requests
      if (token) {
        localStorage.setItem('authToken', token);
      }
      return { user, token };

    } catch (error: any) {
      // Re-throw the error message from the backend
      console.error('Registration error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  async updateProfile(profileData: Partial<StudentProfile | FacultyProfile | AdminProfile | HODProfile | GuestProfile>): Promise<User> {
    try {
      // Send a PUT request to your backend's /auth/profile endpoint (or similar)
      const response = await apiClient.put('/auth/profile', profileData);
      
      // Assuming the backend returns the updated user object
      return response.data.user;
    } catch (error: any) {
      // Re-throw the error message from the backend
      throw new Error(error.response?.data?.message || 'Profile update failed. Please try again.');
    }
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
