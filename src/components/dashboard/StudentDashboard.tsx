
import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react';
import { StudentProfile } from '@/types/auth.types';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const studentProfile = user?.profile as StudentProfile;

  if (!studentProfile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Loading student information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'OVERDUE':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {studentProfile.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your academic dashboard
          </p>
        </div>
        <Avatar className="h-16 w-16">
          <AvatarImage src={studentProfile.profilePictureUrl} alt={studentProfile.firstName} />
          <AvatarFallback className="bg-blue-600 text-white text-lg">
            {studentProfile.firstName?.[0]}{studentProfile.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Status</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(studentProfile.studentStatus)}
              <Badge className={getStatusColor(studentProfile.studentStatus)}>
                {studentProfile.studentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Fee Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(studentProfile.studentStatus)}
              <Badge className={getStatusColor(studentProfile.studentStatus)}>
                {studentProfile.studentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Current CGPA */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentProfile.currentCGPA ? studentProfile.currentCGPA.toFixed(2) : 'N/A'}
            </div>
            {studentProfile.currentCGPA && (
              <Progress value={studentProfile.currentCGPA * 10} className="mt-2" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Roll Number</label>
                <p className="font-medium">{studentProfile.rollNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="font-medium">{new Date(studentProfile.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="font-medium">{studentProfile.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Blood Group</label>
                <p className="font-medium">{studentProfile.bloodGroup || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{studentProfile.personalEmail || user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{studentProfile.personalPhone || 'Not provided'}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span className="text-sm">{studentProfile.currentAddress || 'Not provided'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Academic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Program</label>
                <p className="font-medium">{studentProfile.courseProgram}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Branch</label>
                <p className="font-medium">{studentProfile.branch}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Semester</label>
                <p className="font-medium">{studentProfile.currentSemester}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Section</label>
                <p className="font-medium">{studentProfile.section || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Admission Year</label>
                <p className="font-medium">{studentProfile.admission_academic_year || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Year</label>
                <p className="font-medium">{studentProfile.current_academic_year || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent/Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Parent/Guardian Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Parent/Guardian Name</label>
              <p className="font-medium">{studentProfile.parentGuardianName || 'Not provided'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{studentProfile.parentPhone || 'Not provided'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              View Timetable
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Check Attendance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Award className="mr-2 h-4 w-4" />
              View Grades
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Fee Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
