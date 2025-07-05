import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import DashboardNav from './DashboardNav';
import { Bar, Pie } from 'react-chartjs-2';
import { Users, UserCheck, Activity, Database, LayoutDashboard, CalendarDays, Home, User, Settings, HelpCircle, BookOpen, Menu, Bell, ClipboardList, FileText, BarChart2, CheckSquare, Award, Megaphone } from 'lucide-react';
import { useAuthStore } from '@/modules/user-management1/store/authStore';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/common/components/ui/carousel';

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
  // Year 1
  { class: 'CSE', year: '1', day: 'Monday', time: '08:00-09:00', subject: 'Physics', faculty: 'Dr. Sharma' },
  { class: 'CSE', year: '1', day: 'Tuesday', time: '09:00-10:00', subject: 'Maths', faculty: 'Dr. Kumar' },
  { class: 'ECE', year: '1', day: 'Monday', time: '08:00-09:00', subject: 'Basic Electronics', faculty: 'Ms. Rao' },
  { class: 'MECH', year: '1', day: 'Wednesday', time: '10:00-11:00', subject: 'Mechanics', faculty: 'Mr. Singh' },
  
  // Year 2
  { class: 'CSE', year: '2', day: 'Monday', time: '08:00-09:00', subject: 'Data Structures', faculty: 'Dr. Verma' },
  { class: 'CSE', year: '2', day: 'Monday', time: '09:00-10:00', subject: 'Algorithms', faculty: 'Dr. Gupta' },
  { class: 'ECE', year: '2', day: 'Tuesday', time: '09:00-10:00', subject: 'Digital Circuits', faculty: 'Prof. Iyer' },

  // Year 3
  { class: 'CSE', year: '3', day: 'Wednesday', time: '10:00-11:00', subject: 'OS', faculty: 'Dr. Gupta' },

  // Year 4
  { class: 'MECH', year: '4', day: 'Thursday', time: '11:00-12:00', subject: 'Robotics', faculty: 'Dr. Reddy' },
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
  'user-management',
  'timetable-management',
  'reports',
  'department-management',
  'announcements',
  'settings',
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-01:00', '01:00-02:00'];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  const [selectedYear, setSelectedYear] = useState('1');
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const timetablesByBranch = useMemo(() => {
    const filtered = timetableTable.filter(row => row.year === selectedYear);
    return filtered.reduce((acc, row) => {
        const branch = row.class;
        if (!acc[branch]) {
            acc[branch] = [];
        }
        acc[branch].push(row);
        return acc;
    }, {});
  }, [selectedYear]);

  const branches = Object.keys(timetablesByBranch);

  const handleNavClick = (section) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTimetableEdit = () => {
    navigate('/admin/timetable');
  };

  const handleYearChange = (direction) => {
    const years = ['1', '2', '3', '4'];
    const currentIndex = years.indexOf(selectedYear);
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % years.length;
      setSelectedYear(years[nextIndex]);
    } else if (direction === 'prev') {
      const prevIndex = (currentIndex - 1 + years.length) % years.length;
      setSelectedYear(years[prevIndex]);
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
      <div className="max-w-6xl mx-auto py-6 px-4 space-y-10">
        {/* Admin Profile Section */}
        <section id="admin-profile" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><User className="w-6 h-6" /> Admin Profile</h2>
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div>
                <div className="flex flex-col sm:flex-row items-center sm:space-x-2 mb-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    System Administrator
                  </h2>
                </div>
                <p className="text-gray-600 mb-2 md:mb-4 text-sm md:text-base">
                  admin@college.edu
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Role:</span> Administrator
                  </div>
                  <div>
                    <span className="font-medium">Department:</span> IT Management
                  </div>
                </div>
                <div className="mt-4 md:mt-6">
                  <Button 
                    onClick={() => navigate('/profile')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* System Overview & Recent Activity */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><LayoutDashboard className="w-6 h-6" /> System Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {systemStats.map(stat => (
              <div key={stat.title} className={`rounded-lg p-4 flex flex-col items-center bg-white shadow-sm`}>
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-lg font-bold">{stat.value}</span>
                <span className="text-xs text-gray-600 mt-1 text-center">{stat.title}</span>
                <span className="text-xs text-gray-400 text-center">{stat.change}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <Pie data={pieData} options={{ maintainAspectRatio: false }}/>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Department Stats</CardTitle>
              </CardHeader>
              <CardContent><Bar data={barData} /></CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5" /> Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${activity.bg}`}>
                  <div className="flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto flex-shrink-0">{activity.badge}</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* User Management */}
        <section id="user-management" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Users className="w-6 h-6" /> User Management</h2>
          
          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-3">
            {usersTable.map((user, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="w-full">Edit</Button>
                  <Button variant="destructive" size="sm" className="w-full">Delete</Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto">
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><CalendarDays className="w-6 h-6" /> Timetable</h2>
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border">
                <Button onClick={() => handleYearChange('prev')} size="icon" variant="ghost">
                  &lt;
                </Button>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="font-semibold border-0 focus:ring-0"
                >
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
                <Button onClick={() => handleYearChange('next')} size="icon" variant="ghost">
                  &gt;
                </Button>
              </div>
            </div>
            <Button onClick={handleTimetableEdit} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
              <CalendarDays className="w-4 h-4 mr-2" />
              Create/Edit Timetable
            </Button>
          </div>
          
          {branches.length > 0 ? (
            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {branches.map((branch, index) => (
                  <CarouselItem key={index} className="basis-full">
                    <div className="p-1">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-center">{branch} - Year {selectedYear}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                          {/* Desktop: Grid View */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg text-sm border">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="py-2 px-3 text-left border">Day</th>
                                  {timeSlots.map(slot => (
                                    <th key={slot} className="py-2 px-3 text-center border">{slot}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {daysOfWeek.map(day => (
                                  <tr key={day} className="border-b last:border-b-0">
                                    <td className="py-2 px-3 font-semibold border bg-gray-50">{day}</td>
                                    {timeSlots.map(slot => {
                                      const entry = timetablesByBranch[branch]?.find(
                                        e => e.day === day && e.time === slot
                                      );
                                      return (
                                        <td key={slot} className="py-2 px-3 text-center border h-20">
                                          {entry ? (
                                            <div>
                                              <p className="font-semibold">{entry.subject}</p>
                                              <p className="text-xs text-gray-500">{entry.faculty}</p>
                                            </div>
                                          ) : (
                                            <span className="text-gray-400">-</span>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {/* Mobile: List View */}
                          <div className="md:hidden space-y-4">
                            {daysOfWeek.map(day => (
                              <div key={day}>
                                <h3 className="font-bold mb-2">{day}</h3>
                                <div className="space-y-2">
                                  {timetablesByBranch[branch]?.filter(e => e.day === day).length > 0 ? (
                                    timetablesByBranch[branch]
                                      .filter(e => e.day === day)
                                      .map((entry, idx) => (
                                        <div key={idx} className="p-3 rounded-lg bg-gray-50 border">
                                          <p className="font-semibold">{entry.subject}</p>
                                          <p className="text-sm text-gray-600">{entry.faculty}</p>
                                          <p className="text-sm text-gray-500 mt-1">{entry.time}</p>
                                        </div>
                                      ))
                                  ) : (
                                    <p className="text-sm text-gray-400">No classes scheduled.</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No timetables found for Year {selectedYear}.</p>
            </div>
          )}
        </section>

        {/* Reports */}
        <section id="reports" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BarChart2 className="w-6 h-6" /> Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.title} className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-start gap-4 border border-gray-100">
                <span className="text-3xl">📊</span>
                <div className="font-semibold text-lg text-gray-900">{report.title}</div>
                <div className="text-sm text-gray-700 flex-1">{report.description}</div>
                <Button className="mt-2 w-full">Generate Report</Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Department Management */}
        <section id="department-management" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Department Management</h2>
          
          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-3">
            {departmentStats.map((dept, idx) => (
              <Card key={idx} className="p-4">
                <p className="font-bold text-lg">{dept.department}</p>
                <p className="text-sm">HOD: {dept.hod}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Students: <span className="font-semibold">{dept.students}</span></span>
                  <span>Faculty: <span className="font-semibold">{dept.faculty}</span></span>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto">
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
                <div className="flex justify-between items-center">
                  <span className="font-semibold">System Backup</span>
                  <Button>Backup Now</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Security</span>
                  <Button>Update Settings</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">User Roles</span>
                  <Button>Manage Roles</Button>
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