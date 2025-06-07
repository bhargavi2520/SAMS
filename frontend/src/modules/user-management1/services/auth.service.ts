
import { LoginCredentials, RegisterData, User } from '@/modules/user-management1/types/auth.types';

// Mock data for demonstration - replace with actual API calls
const mockUsers: Record<string, User> = {
  'admin@sams.edu': {
    id: '1',
    email: 'admin@sams.edu',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    is2faEnabled: false,
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      id: '1',
      userId: '1',
      adminId: 'ADM001',
      firstName: 'System',
      lastName: 'Administrator',
      designation: 'System Administrator',
      department: 'IT',
      officialEmail: 'admin@sams.edu',
      phoneNumber: '+91-9876543210'
    }
  },
  'hod.cse@sams.edu': {
    id: '2',
    email: 'hod.cse@sams.edu',
    role: 'HOD',
    isActive: true,
    isVerified: true,
    is2faEnabled: false,
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      id: '2',
      userId: '2',
      facultyId: 'FAC001',
      department: 'Computer Science Engineering',
      appointmentDate: '2024-01-01',
      faculty: {
        id: 'FAC001',
        userId: '2',
        employeeId: 'EMP001',
        firstName: 'Dr. Rajesh',
        lastName: 'Kumar',
        designation: 'Professor & HOD',
        department: 'Computer Science Engineering',
        dateOfJoining: '2020-01-01',
        employmentType: 'PERMANENT',
        officialEmail: 'hod.cse@sams.edu',
        personalPhone: '+91-9876543211',
        highestQualification: 'Ph.D.',
        specialization: 'Machine Learning',
        yearsOfExperience: 15
      }
    }
  },
  'student@sams.edu': {
    id: '3',
    email: 'student@sams.edu',
    role: 'STUDENT',
    isActive: true,
    isVerified: true,
    is2faEnabled: false,
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      id: '3',
      userId: '3',
      rollNumber: '21CSE101',
      firstName: 'Priya',
      lastName: 'Sharma',
      dateOfBirth: '2003-05-15',
      gender: 'FEMALE',
      bloodGroup: 'O+',
      personalEmail: 'priya.personal@gmail.com',
      personalPhone: '+91-9876543212',
      parentGuardianName: 'Mr. Rajesh Sharma',
      parentPhone: '+91-9876543213',
      currentSemester: 6,
      branch: 'Computer Science Engineering',
      courseProgram: 'B.Tech',
      section: 'A',
      currentCGPA: 8.5,
      studentStatus: 'ACTIVE'
    }
  }
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers[credentials.email];
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In real implementation, verify password hash
    if (credentials.password !== 'password123') {
      throw new Error('Invalid password');
    }
    
    // Generate mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    return { user, token };
  }
  
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (mockUsers[data.email]) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      role: data.role,
      isActive: true,
      isVerified: false,
      is2faEnabled: false,
      createdAt: new Date().toISOString(),
      profile: data.profileData as any
    };
    
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    
    // Store in mock database
    mockUsers[data.email] = newUser;
    
    return { user: newUser, token };
  }
  
  async updateProfile(profileData: any): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock profile update logic
    throw new Error('Profile update not implemented in mock service');
  }
  
  async verifyToken(token: string): Promise<User | null> {
    // Simulate token verification
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In real implementation, verify JWT and return user
    return null;
  }
}

export const authService = new AuthService();
