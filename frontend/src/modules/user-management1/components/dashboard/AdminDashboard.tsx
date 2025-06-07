import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { useAuthStore } from '@/modules/user-management1/store/authStore';
import { AdminProfile } from '@/modules/user-management1/types/auth.types';
import {
  Users,
  UserCheck,
  Shield,
  Activity,
  Database,
  LayoutDashboard,
  CalendarDays,
  Home,
  User,
  Settings,
  HelpCircle,
  BookOpen,
  Menu,
} from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Search, Bell, Moon, Edit } from 'lucide-react';
import DashboardNav from '../../../../components/dashboard/DashboardNav';

const systemStats = [
  { title: 'Total Users', value: '1,247', change: '+12 from last month', icon: <Users className="h-4 w-4 text-muted-foreground" /> },
  { title: 'Active Students', value: '980', change: '78.6% of total users', icon: <UserCheck className="h-4 w-4 text-muted-foreground" /> },
  { title: 'Faculty Members', value: '185', change: 'across all departments', icon: <Users className="h-4 w-4 text-muted-foreground" /> },
  { title: 'System Health', value: '99.9%', change: 'uptime this month', icon: <Activity className="h-4 w-4 text-muted-foreground" />, color: 'text-green-600' },
];

const recentActivity = [
  { title: 'New User Registration', description: '5 new students registered today', badge: 'Today', icon: <UserCheck className="h-4 w-4 text-green-500" />, bg: 'bg-green-50 dark:bg-green-900/20' },
  { title: 'Database Backup', description: 'Automatic backup completed successfully', badge: '2 hours ago', icon: <Database className="h-4 w-4 text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { title: 'Security Alert', description: 'Multiple failed login attempts detected', badge: 'Yesterday', icon: <Shield className="h-4 w-4 text-orange-500" />, bg: 'bg-orange-50 dark:bg-orange-900/20' },
];

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const profile = user?.profile as AdminProfile;
  const [activeSection, setActiveSection] = useState<string>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Section refs for scrolling (add more as needed)
  const dashboardRef = useRef<HTMLDivElement>(null);
  const manageUsersRef = useRef<HTMLDivElement>(null);
  const timetableRef = useRef<HTMLDivElement>(null);
  const systemReportsRef = useRef<HTMLDivElement>(null);
  const securitySettingsRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    Dashboard: dashboardRef,
    'Manage Users': manageUsersRef,
    Timetable: timetableRef,
    'System Reports': systemReportsRef,
    'Security Settings': securitySettingsRef,
  };

  // Add scroll listener to update activeSection
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { section: 'Dashboard', ref: dashboardRef },
        { section: 'Manage Users', ref: manageUsersRef },
        { section: 'Timetable', ref: timetableRef },
        { section: 'System Reports', ref: systemReportsRef },
        { section: 'Security Settings', ref: securitySettingsRef },
      ];
      const scrollPosition = window.scrollY + 120; // Offset for nav
      let current = 'Dashboard';
      for (const s of sections) {
        if (s.ref.current) {
          const offsetTop = s.ref.current.offsetTop;
          if (scrollPosition >= offsetTop) {
            current = s.section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (label: string) => {
    setActiveSection(label);
    const ref = sectionRefs[label];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <DashboardNav activeSection={activeSection} onNavClick={handleNavClick} dashboardType="admin" />
      <main className="flex-1 overflow-auto md:ml-20 pb-16 md:pb-0">
        <div className="p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg mr-2" onClick={toggleSidebar}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Moon className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm hidden md:block">
                  <div className="font-medium text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </div>
                  <div className="text-gray-500">{profile.email}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                System Administration
              </h1>
              <p className="text-gray-600">
                Welcome, {profile.firstName} {profile.lastName} - {profile.designation}
              </p>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${stat.color || ''}`}>{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent System Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>Latest system events and administrative actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${activity.bg}`}>
                      {activity.icon}
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">{activity.badge}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add other sections here (Manage Users, Timetable, etc.) with appropriate refs */}
          <div ref={manageUsersRef} className="pt-8">
            {/* Content for Manage Users section */}
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This section is under construction. Please check back later.</p>
              </CardContent>
            </Card>
          </div>

          {/* Example for Timetable section */}
          <div ref={timetableRef} className="pt-8">
            <Card>
              <CardHeader>
                <CardTitle>Timetable Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This section is under construction. Please check back later.</p>
              </CardContent>
            </Card>
          </div>

          {/* System Reports Section */}
          <div ref={systemReportsRef} className="pt-8">
            <Card>
              <CardHeader>
                <CardTitle>System Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This section is under construction. Please check back later.</p>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings Section */}
          <div ref={securitySettingsRef} className="pt-8">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This section is under construction. Please check back later.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;