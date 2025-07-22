import apiClient from '@/api';

export interface HODAssignment {
  _id: string;
  hodName: string,
  hodEmail : string,
  department: string;
  years: number;
  batch : string,
  createdAt: string;
  updatedAt: string;
}

export interface HODProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface CreateAssignmentData {
  hodId: string;
  department: string;
  years: number[];
}

export interface UpdateAssignmentData {
  department: string;
  year: number;
}

class HODService {
  // Get all HODs
  async getAllHODs(): Promise<HODProfile[]> {
    try {
      const response = await apiClient.get('/department/hods');
      return response.data.hods || [];
    } catch (error: any) {
      console.error('Error fetching HODs:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 404) {
        throw new Error('HOD management endpoints are not available. Please ensure the backend is properly deployed with the latest updates.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch HODs');
    }
  }

  // Get all department assignments
  async getDepartmentAssignments(): Promise<HODAssignment[]> {
    try {
      const response = await apiClient.get('/department/assignments');
      return response.data.assignments || [];
    } catch (error: any) {
      console.error('Error fetching department assignments:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 404) {
        throw new Error('HOD management endpoints are not available. Please ensure the backend is properly deployed with the latest updates.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch department assignments');
    }
  }

  // Get assignments by HOD ID
  async getAssignmentsByHOD(hodId: string): Promise<HODAssignment[]> {
    try {
      const response = await apiClient.get(`/department/assignments/hod/${hodId}`);
      return response.data.assignments || [];
    } catch (error: any) {
      console.error('Error fetching HOD assignments:', error);
      if (error.response?.status === 404) {
        throw new Error('HOD management endpoints are not available. Please ensure the backend is properly deployed with the latest updates.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch HOD assignments');
    }
  }

  // Create new assignment
  async createAssignment(data: CreateAssignmentData): Promise<{ message: string; success: boolean }> {
    try {
      const response = await apiClient.post('/department/assign', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      if (error.response?.status === 404) {
        throw new Error('HOD management endpoints are not available. Please ensure the backend is properly deployed with the latest updates.');
      }
      throw new Error(error.response?.data?.message || 'Failed to create assignment');
    }
  }

  // Update assignment
  async updateAssignment(assignmentId: string, data: UpdateAssignmentData): Promise<{ message: string; success: boolean }> {
    try {
      const response = await apiClient.put(`/department/assignments/${assignmentId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      if (error.response?.status === 404) {
        throw new Error('HOD management endpoints are not available. Please ensure the backend is properly deployed with the latest updates.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update assignment');
    }
  }

  // Remove assignment
  async removeAssignment(assignmentId: string): Promise<{ message: string; success: boolean }> {
    try {
      const response = await apiClient.delete(`/department/assignments/${assignmentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error removing assignment:', error);
      if (error.response?.status === 404) {
        throw new Error('HOD management endpoints are not available. Please ensure the backend is properly deployed with the latest updates.');
      }
      throw new Error(error.response?.data?.message || 'Failed to remove assignment');
    }
  }

  // Test backend connectivity
  async testBackendHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/api/health');
      return response.status === 200;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

export const hodService = new HODService(); 