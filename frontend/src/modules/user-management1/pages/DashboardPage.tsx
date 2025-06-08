import React from 'react';
import { useAuthStore } from '@/modules/user-management1/store/authStore';
import StudentDashboard from '@/modules/user-management1/components/dashboard/StudentDashboard';
import FacultyDashboard from '@/modules/user-management1/components/dashboard/FacultyDashboard';
import AdminDashboard from '@/modules/user-management1/components/dashboard/AdminDashboard';
import HODDashboard from '@/modules/user-management1/components/dashboard/HODDashboard';
import ClassTeacherDashboard from '@/modules/user-management1/components/dashboard/ClassTeacherDashboard';
import GuestDashboard from '@/modules/user-management1/components/dashboard/GuestDashboard';
import { Card, CardContent } from '@/common/components/ui/card';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Loading user information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  switch (user.role) {
    case 'STUDENT':
      return <StudentDashboard />;
    case 'FACULTY':
      return <FacultyDashboard />;
    case 'CLASS_TEACHER':
      return <ClassTeacherDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'HOD':
      return <HODDashboard />;
    case 'GUEST':
      return <GuestDashboard />;
    default:
      return (
        <div className="p-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Unknown Role</h2>
              <p className="text-gray-600">
                Your account role is not recognized. Please contact an administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      );
  }
};

export default DashboardPage;

// Inside your Quick Actions section:
<Link to="/admin/timetable" className="quick-action-link">
  Timetable Management
</Link>
