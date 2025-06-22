export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT' | 'HOD' | 'GUEST';

export type UserProfile =
  | StudentProfile
  | FacultyProfile
  | AdminProfile
  | HODProfile
  | GuestProfile;


export interface BaseUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  role: UserRole;
  isVerified: boolean;
  is2faEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  profile?: UserProfile;
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
  confirmPassword?: string;
  role: UserRole;
  profileData: Partial<StudentProfile | FacultyProfile | AdminProfile | HODProfile | GuestProfile>;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
