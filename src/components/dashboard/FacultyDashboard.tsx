
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { FacultyProfile } from '@/types/auth.types';
import { Users, BookOpen, Calendar, Award, Mail, Phone, Building } from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuthStore();
  const profile = user?.profile as FacultyProfile;

  if (!profile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Profile information not available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {profile.designation} {profile.firstName} {profile.lastName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Department of {profile.department}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.yearsOfExperience}</div>
            <p className="text-xs text-muted-foreground">years</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">active subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">total students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employment</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="text-sm">
              {profile.employmentType}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Since {new Date(profile.dateOfJoining).getFullYear()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Your academic and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Employee ID</p>
                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {profile.employeeId}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Designation</p>
                <p className="text-sm font-semibold">{profile.designation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Department</p>
                <p className="text-sm">{profile.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Date of Joining</p>
                <p className="text-sm">{new Date(profile.dateOfJoining).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Your contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Official Email</p>
                  <p className="text-sm text-gray-600">{profile.officialEmail}</p>
                </div>
              </div>
              {profile.personalEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Personal Email</p>
                    <p className="text-sm text-gray-600">{profile.personalEmail}</p>
                  </div>
                </div>
              )}
              {profile.personalPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Personal Phone</p>
                    <p className="text-sm text-gray-600">{profile.personalPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Qualifications */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Qualifications</CardTitle>
          <CardDescription>Your educational background and specialization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Highest Qualification</p>
              <p className="text-lg font-semibold">{profile.highestQualification || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Specialization</p>
              <p className="text-sm">{profile.specialization || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Experience</p>
              <p className="text-sm">{profile.yearsOfExperience} years in teaching</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your recent teaching and administrative activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Class Scheduled</p>
                <p className="text-xs text-gray-600">Data Structures - Today at 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <BookOpen className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Assignment Created</p>
                <p className="text-xs text-gray-600">Algorithm Analysis - Due next week</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Users className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Student Meeting</p>
                <p className="text-xs text-gray-600">Project guidance session scheduled</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboard;
