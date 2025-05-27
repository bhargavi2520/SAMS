
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { AdminProfile } from '@/types/auth.types';
import { Users, UserCheck, UserX, Shield, Activity, Database } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const profile = user?.profile as AdminProfile;

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
          System Administration
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome, {profile.firstName} {profile.lastName} - {profile.designation}
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">980</div>
            <p className="text-xs text-muted-foreground">78.6% of total users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">185</div>
            <p className="text-xs text-muted-foreground">across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-xs text-muted-foreground">uptime this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Administrator Profile</CardTitle>
            <CardDescription>Your administrative account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin ID</p>
                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {profile.adminId}
                </p>
              </div>
              {profile.employeeId && (
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Employee ID</p>
                  <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {profile.employeeId}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Designation</p>
                <p className="text-sm font-semibold">{profile.designation || 'Administrator'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Department</p>
                <p className="text-sm">{profile.department || 'System Administration'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact</p>
                <p className="text-sm">{profile.officialEmail}</p>
                {profile.phoneNumber && (
                  <p className="text-sm text-gray-600">{profile.phoneNumber}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access Permissions</CardTitle>
            <CardDescription>Your system access and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">User Management</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Academic Records</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Configuration</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reports & Analytics</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Backup</span>
                <Badge variant="default">Full Access</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent System Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest system events and administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <UserCheck className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">New User Registration</p>
                <p className="text-xs text-gray-600">5 new students registered today</p>
              </div>
              <Badge variant="outline" className="ml-auto">Today</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Database className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Database Backup</p>
                <p className="text-xs text-gray-600">Automatic backup completed successfully</p>
              </div>
              <Badge variant="outline" className="ml-auto">2 hours ago</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Shield className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Security Alert</p>
                <p className="text-xs text-gray-600">Multiple failed login attempts detected</p>
              </div>
              <Badge variant="outline" className="ml-auto">Yesterday</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-xs text-gray-600">Add, edit, or remove user accounts</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <Database className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold">System Reports</h3>
              <p className="text-xs text-gray-600">Generate system and user reports</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <Shield className="h-8 w-8 text-red-500 mb-2" />
              <h3 className="font-semibold">Security Settings</h3>
              <p className="text-xs text-gray-600">Configure security policies</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
