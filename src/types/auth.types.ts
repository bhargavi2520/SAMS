export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT' | 'HOD' | 'CLASS_TEACHER' | 'GUEST';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  is2faEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  profile?: StudentProfile | FacultyProfile | AdminProfile | HODProfile;
}

export interface StudentProfile {
  id: string;
  userId: string;
  rollNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  profilePictureUrl?: string;
  personalEmail?: string;
  personalPhone?: string;
  parentGuardianName?: string;
  parentPhone?: string;
  currentSemester: number;
  branch: string;
  courseProgram: string;
  section?: string;
  currentCGPA?: number;
  studentStatus: 'ACTIVE' | 'INACTIVE' | 'DROPOUT' | 'GRADUATED';
  feeStatus?: 'PAID' | 'PENDING' | 'OVERDUE' | 'EXEMPTED';
  admission_academic_year?: string;
  current_academic_year?: string;
  currentAddress?: string;
  permanentAddress?: string;
}

export interface FacultyProfile {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  employmentType: 'PERMANENT' | 'CONTRACT' | 'VISITING';
  officialEmail: string;
  personalEmail?: string;
  personalPhone?: string;
  profilePictureUrl?: string;
  highestQualification?: string;
  specialization?: string;
  yearsOfExperience: number;
}

export interface AdminProfile {
  id: string;
  userId: string;
  adminId: string;
  employeeId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  designation?: string;
  department?: string;
  officialEmail: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
}

export interface HODProfile {
  id: string;
  userId: string;
  facultyId: string;
  department: string;
  appointmentDate: string;
  tenureEndDate?: string;
  faculty: FacultyProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  profileData: Partial<StudentProfile | FacultyProfile | AdminProfile>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
