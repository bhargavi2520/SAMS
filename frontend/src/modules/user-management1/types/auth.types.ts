export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT' | 'HOD' | 'CLASS_TEACHER' | 'GUEST';

export interface User {
  name:string;
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  is2faEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  profile?: StudentProfile | FacultyProfile | AdminProfile | HODProfile | ClassTeacherProfile | GuestProfile;
}

export interface BaseUserProfile {
  id: string;
  userId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
}

export interface StudentProfile extends BaseUserProfile {
  rollNumber: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  personalEmail?: string;
  parentName?: string;
  parentPhone?: string;
  currentSemester: number;
  branch: string;
  courseProgram: string;
  section?: string;
  studentStatus: 'ACTIVE' | 'INACTIVE' | 'DROPOUT' | 'GRADUATED';
  feeStatus?: 'PAID' | 'PENDING' | 'OVERDUE' | 'EXEMPTED';
  enrollmentYear?: number;
  current_academic_year?: string;
  currentAddress?: string;
  permanentAddress?: string;
  aparId?: string;
}

export interface FacultyProfile extends BaseUserProfile {
  employeeId: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  employmentType: 'PERMANENT' | 'CONTRACT' | 'VISITING';
  officialEmail: string;
  highestQualification?: string;
  specialization?: string;
  yearsOfExperience: number;
}

export interface AdminProfile extends BaseUserProfile {
  adminId: string;
  employeeId?: string;
  designation?: string;
  department?: string;
}

export interface HODProfile extends BaseUserProfile {
  facultyId: string;
  department: string;
  appointmentDate: string;
  tenureEndDate?: string;
  faculty: FacultyProfile;
}

export interface ClassTeacherProfile extends BaseUserProfile {
  facultyId: string;
  classAssigned: string; 
  appointmentDate: string;
  tenureEndDate?: string;
  faculty: FacultyProfile;
}

export interface GuestProfile extends BaseUserProfile {
  affiliation?: string; 
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
  profileData: Partial<StudentProfile | FacultyProfile | AdminProfile | HODProfile | ClassTeacherProfile | GuestProfile>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
