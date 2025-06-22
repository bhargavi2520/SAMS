import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import DashboardNav from './DashboardNav';
import { Bar, Pie } from 'react-chartjs-2';
import { Users, UserCheck, Activity, Database, LayoutDashboard, CalendarDays, Home, User, Settings, HelpCircle, BookOpen, Menu, Bell, ClipboardList, FileText, BarChart2, CheckSquare, Award, Megaphone } from 'lucide-react';

// --- Mock Data ---
const systemStats = [
  { title: 'Total Users', value: '1,247', change: '+12 from last month', icon: <Users className="h-4 w-4 text-muted-foreground" /> },
  { title: 'Active Students', value: '980', change: '78.6% of total users', icon: <UserCheck className="h-4 w-4 text-muted-foreground" /> },
  { title: 'Faculty Members', value: '185', change: 'across all departments', icon: <Users className="h-4 w-4 text-muted-foreground" /> },
  { title: 'System Health', value: '99.9%', change: 'uptime this month', icon: <Activity className="h-4 w-4 text-green-600" />, color: 'text-green-600' },
];

const recentActivity = [
  { title: 'New User Registration', description: '5 new students registered today', badge: 'Today', icon: <UserCheck className="h-4 w-4 text-green-500" />, bg: 'bg-green-50 dark:bg-green-900/20' },
  { title: 'Database Backup', description: 'Automatic backup completed successfully', badge: '2 hours ago', icon: <Database className="h-4 w-4 text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { title: 'Security Alert', description: 'Multiple failed login attempts detected', badge: 'Yesterday', icon: <Activity className="h-4 w-4 text-orange-500" />, bg: 'bg-orange-50 dark:bg-orange-900/20' },
];

const usersTable = [
  { name: 'Aarav Kumar', email: 'aarav.kumar@email.com', role: 'STUDENT', status: 'Active' },
  { name: 'Meera Singh', email: 'meera.singh@email.com', role: 'FACULTY', status: 'Active' },
  { name: 'Rohan Das', email: 'rohan.das@email.com', role: 'HOD', status: 'Inactive' },
  { name: 'Isha Patel', email: 'isha.patel@email.com', role: 'ADMIN', status: 'Active' },
];

const timetableTable = [
  { class: 'CSE', day: 'Monday', time: '8:00-9:00', subject: 'Physics', faculty: 'Dr. Sharma' },
  { class: 'ECE', day: 'Tuesday', time: '9:00-10:00', subject: 'Chemistry', faculty: 'Ms. Rao' },
  { class: 'MECH', day: 'Wednesday', time: '10:00-11:00', subject: 'Math', faculty: 'Mr. Kumar' },
];

const reports = [
  { title: 'Attendance Report', description: 'Monthly attendance summary for all classes.' },
  { title: 'Performance Report', description: 'Academic performance trends and analytics.' },
  { title: 'Communication Log', description: 'Parent and student communication records.' },
];

const departmentStats = [
  { department: 'CSE', students: 320, faculty: 20, hod: 'Dr. Priya Sharma' },
  { department: 'ECE', students: 210, faculty: 15, hod: 'Dr. R. Sharma' },
  { department: 'MECH', students: 180, faculty: 12, hod: 'Dr. P. Singh' },
];

const announcements = [
  { title: 'System Maintenance', content: 'Scheduled maintenance on Sunday 2AM-4AM.', date: '2024-06-01' },
  { title: 'New Academic Year', content: 'Admissions open for 2024-25.', date: '2024-05-20' },
];

const pieData = {
  labels: ['Students', 'Faculty', 'Admins'],
  datasets: [
    {
      data: [980, 185, 10],
      backgroundColor: ['#3b82f6', '#f59e42', '#10b981'],
      borderWidth: 1,
    },
  ],
};

const barData = {
  labels: ['CSE', 'ECE', 'MECH'],
  datasets: [
    {
      label: 'Students',
      data: [320, 210, 180],
      backgroundColor: '#3b82f6',
    },
    {
      label: 'Faculty',
      data: [20, 15, 12],
      backgroundColor: '#f59e42',
    },
  ],
};

const sectionIds = [
  'overview',
  'recent-activity',
  'user-management',
  'timetable-management',
  'reports',
  'department-management',
  'announcements',
  'settings',
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  const handleNavClick = (section) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Intersection Observer for active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new window.IntersectionObserver(observerCallback, observerOptions);
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DashboardNav activeSection={activeSection} onNavClick={handleNavClick} dashboardType="admin" />
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* System Overview */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><LayoutDashboard className="w-6 h-6" /> System Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {systemStats.map(stat => (
              <div key={stat.title} className={`rounded-lg p-4 flex flex-col items-center ${stat.color || ''} bg-white shadow-sm`}>
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-lg font-bold">{stat.value}</span>
                <span className="text-xs text-gray-600 mt-1">{stat.title}</span>
                <span className="text-xs text-gray-400">{stat.change}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent><Pie data={pieData} /></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Department Stats</CardTitle>
              </CardHeader>
              <CardContent><Bar data={barData} /></CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Activity */}
        <section id="recent-activity" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Activity className="w-6 h-6" /> Recent Activity</h2>
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
        </section>

        {/* User Management */}
        <section id="user-management" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Users className="w-6 h-6" /> User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-left">Role</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersTable.map((user, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-2 px-3">{user.name}</td>
                    <td className="py-2 px-3">{user.email}</td>
                    <td className="py-2 px-3">{user.role}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                    </td>
                    <td className="py-2 px-3 flex gap-2">
                      <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200" title="Edit"><span role="img" aria-label="Edit">✏️</span></button>
                      <button className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200" title="Delete"><span role="img" aria-label="Delete">🗑️</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Timetable Management */}
        <section id="timetable-management" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><CalendarDays className="w-6 h-6" /> Timetable Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">Class</th>
                  <th className="py-2 px-3 text-left">Day</th>
                  <th className="py-2 px-3 text-left">Time</th>
                  <th className="py-2 px-3 text-left">Subject</th>
                  <th className="py-2 px-3 text-left">Faculty</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timetableTable.map((row, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-2 px-3">{row.class}</td>
                    <td className="py-2 px-3">{row.day}</td>
                    <td className="py-2 px-3">{row.time}</td>
                    <td className="py-2 px-3">{row.subject}</td>
                    <td className="py-2 px-3">{row.faculty}</td>
                    <td className="py-2 px-3 flex gap-2">
                      <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200" title="Edit"><span role="img" aria-label="Edit">✏️</span></button>
                      <button className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200" title="Delete"><span role="img" aria-label="Delete">🗑️</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reports */}
        <section id="reports" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BarChart2 className="w-6 h-6" /> Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.title} className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-start gap-4 border border-gray-100">
                <span className="text-3xl">📊</span>
                <div className="font-semibold text-lg text-gray-900">{report.title}</div>
                <div className="text-sm text-gray-700 flex-1">{report.description}</div>
                <button className="mt-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">Generate Report</button>
              </div>
            ))}
          </div>
        </section>

        {/* Department/Faculty/Student Management */}
        <section id="department-management" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Department/Faculty/Student Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">Department</th>
                  <th className="py-2 px-3 text-left">Students</th>
                  <th className="py-2 px-3 text-left">Faculty</th>
                  <th className="py-2 px-3 text-left">HOD</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-2 px-3">{dept.department}</td>
                    <td className="py-2 px-3">{dept.students}</td>
                    <td className="py-2 px-3">{dept.faculty}</td>
                    <td className="py-2 px-3">{dept.hod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Announcements */}
        <section id="announcements" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Megaphone className="w-6 h-6" /> Announcements</h2>
          <div className="space-y-4">
            {announcements.map((a, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{a.title}</CardTitle>
                  <CardDescription>{a.date}</CardDescription>
                </CardHeader>
                <CardContent>{a.content}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section id="settings" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Settings className="w-6 h-6" /> Settings</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div>
                  <span className="font-semibold">System Backup:</span> <Button className="ml-2">Backup Now</Button>
                </div>
                <div>
                  <span className="font-semibold">Security:</span> <Button className="ml-2">Update Security Settings</Button>
                </div>
                <div>
                  <span className="font-semibold">User Roles:</span> <Button className="ml-2">Manage Roles</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;