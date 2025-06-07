import React from 'react';
import { useAuthStore } from '@/modules/user-management1/store/authStore';
import StudentDashboard from '@/modules/user-management1/components/dashboard/StudentDashboard';
import FacultyDashboard from '@/modules/user-management1/components/dashboard/FacultyDashboard';
import AdminDashboard from '@/modules/user-management1/components/dashboard/AdminDashboard';
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
    case 'CLASS_TEACHER':
      return <FacultyDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'HOD':
      return <FacultyDashboard />; // HOD uses faculty dashboard with additional permissions
    case 'GUEST':
      return (
        <div className="p-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Guest Access</h2>
              <p className="text-gray-600">
                You have limited access to the system. Please contact an administrator 
                to upgrade your account permissions.
              </p>
            </CardContent>
          </Card>
        </div>
      );
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
