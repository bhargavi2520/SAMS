import apiClient from '@/api';
import { LoginCredentials, RegisterData,BaseUserProfile, StudentProfile, FacultyProfile, AdminProfile, HODProfile, GuestProfile } from '@/modules/user-management1/types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: BaseUserProfile; token: string }> {
    try {
      // Send a POST request to your backend's /auth/login endpoint
      const response = await apiClient.post('/auth/login', credentials);
      
      const { token, user } = response.data;

      return { user, token };
    } catch (error: unknown) {
      // Re-throw the error message from the backend
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        // @ts-expect-error: error is narrowed but TS can't infer nested types
        throw new Error(error.response.data?.message || 'Login failed. Please try again.');
      }
      throw new Error('Login failed. Please try again.');
    }
  }
  
  async register(data: RegisterData): Promise<{ user: BaseUserProfile; token: string }> {
    try {
      // Send a POST request to your backend's /auth/register endpoint
      // Note: Ensure your backend expects data in this format
      console.log('Sending registration data:', data);
      const response = await apiClient.post('/auth/register', data);
      console.log('Registration response:', response);
      const { token, user } = response.data;
      
      return { user, token };

    } catch (error: unknown) {
      // Re-throw the error message from the backend
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        console.error('Registration error:', error.response?.data || error);
        // @ts-expect-error: error is narrowed but TS can't infer nested types
        throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }

  logout(): void {
  }

  async updateProfile(profileData: Partial<StudentProfile | FacultyProfile | AdminProfile | HODProfile | GuestProfile>): Promise<BaseUserProfile> {
    try {
      // Send a PUT request to your backend's /auth/profile endpoint (or similar)
      const response = await apiClient.put('/auth/profile', profileData);
      
      // Assuming the backend returns the updated user object
      return response.data.user;
    } catch (error: unknown) {
      // Re-throw the error message from the backend
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        // @ts-expect-error: error is narrowed but TS can't infer nested types
        throw new Error(error.response?.data?.message || 'Profile update failed. Please try again.');
      }
      throw new Error('Profile update failed. Please try again.');
    }
  }

  async updateProfilePhoto(file: File): Promise<BaseUserProfile> {
    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const response = await apiClient.put('/auth/profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.user;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        // @ts-expect-error: error is narrowed but TS can't infer nested types
        throw new Error(error.response?.data?.message || 'Profile photo update failed. Please try again.');
      }
      throw new Error('Profile photo update failed. Please try again.');
    }
  }

  async deleteProfilePhoto(): Promise<BaseUserProfile> {
    try {
      const response = await apiClient.delete('/auth/profile-photo');

      return response.data.user;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        // @ts-expect-error: error is narrowed but TS can't infer nested types
        throw new Error(error.response?.data?.message || 'Profile photo update failed. Please try again.');
      }
      throw new Error('Profile photo update failed. Please try again.');
    }
  }


    // Fetches the current user's profile using the stored auth token.
  async getProfile(): Promise<BaseUserProfile> {
    try {
       // This endpoint should be protected and return the user profile based on the provided token.
      const response = await apiClient.get('/auth/me');
      return response.data.user;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        console.error('Failed to fetch profile:', error.response?.data || error);
        // @ts-expect-error: error is narrowed but TS can't infer nested types
        throw new Error(error.response?.data?.message || 'Session expired or invalid.');
      }
      console.error('Failed to fetch profile:', error);
      throw new Error('Session expired or invalid.');
    }
  }

  // Fetch users by role (student, faculty, hod, admin)
  async fetchUsersByRole(role: string, data : any): Promise<any[]> {
    let endpoint = ''; 
    if(role == "STUDENT"){
      const response = await apiClient.get(`/userData/students?year=${data.year}&department=${data.department}&section=${data.section}`);
      return response.data.students || [];
    }
    else if (role === 'FACULTY') {
      endpoint = '/userData/faculties';
    } else if (role === 'HOD') {
      endpoint = '/department/hods';
    } else {
      endpoint = `/users?role=${role}`;
    }
    const response = await apiClient.get(endpoint);
     if (role === 'FACULTY') {
      return response.data.facultyNames || [];
    } else if (role === 'HOD') {
      return response.data.hods || [];
    } else {
      return response.data.users || [];
    }
  }
}

export const authService = new AuthService();
