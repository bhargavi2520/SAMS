import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Edit, BookOpen, Calendar, Megaphone, Bell, Moon, Search, Menu, Award, Users, FileText, BarChart2, CheckSquare, Settings, Home, HelpCircle } from 'lucide-react';
import dayjs from 'dayjs';

import { Button } from '@/common/components/ui/button';
import { format } from 'date-fns'; // Add this import at the top if you have date-fns installed
import { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Mock Attendance Data
const attendanceData = [
	{ label: 'Class A', attended: 18, total: 20 },
	{ label: 'Class B', attended: 12, total: 15 },
	{ label: 'Class C', attended: 8, total: 10 },
];

// Attendance Graph Component
const AttendanceGraph = () => {
  const chartData = {
    labels: attendanceData.map(item => item.label),
    datasets: [
      {
        label: 'Attendance',
        data: attendanceData.map(item => (item.attended / item.total) * 100),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  // Chart options
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div className="h-64">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

// Placeholder chart components
const DonutChart = () => (
  <div className="flex items-center justify-center h-24 sm:h-32">
    {/* Replace with actual chart */}
    <span className="text-gray-400">[Donut Chart]</span>
  </div>
);

const LineChart = () => (
  <div className="flex items-center justify-center h-24 sm:h-32">
    {/* Replace with actual chart */}
    <span className="text-gray-400">[Line Chart]</span>
  </div>
);

// Helper to generate roll numbers in format "23815A0405"
const getRollNo = (id: number) => {
  // Example: 23815A0401, 23815A0402, ...
  return `23815A04${id.toString().padStart(2, '0')}`;
};

const AttendanceSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative w-10 h-6 rounded-full transition-colors duration-200 outline-none border-2 flex items-center ${
      checked ? 'bg-green-400 border-green-400' : 'bg-gray-200 border-gray-300'
    }`}
    aria-pressed={checked}
    aria-label={checked ? 'Present' : 'Absent'}
  >
    <span
      className={`absolute left-0 top-0 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? 'translate-x-4' : 'translate-x-1'
      }`}
    />
  </button>
);

const classOptions = [
  { label: 'Class A', value: 'A' },
  { label: 'Class B', value: 'B' },
  { label: 'Class C', value: 'C' },
];

// Example students for each class
const classStudents: Record<string, { id: number; name: string }[]> = {
  A: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: ['Akash Gupta', 'Brijesh Gupta', 'Cajeton D’souza', 'Danish Shaikh', 'Daniel Walter', 'Faisal Khan'][i % 6],
  })),
  B: Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: ['Riya Sharma', 'Amit Patel', 'Priya Singh', 'John Doe', 'Jane Smith'][i % 5],
  })),
  C: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: ['Sam Wilson', 'Peter Parker', 'Bruce Wayne', 'Clark Kent', 'Diana Prince'][i % 5],
  })),
};

// Example: Faculty's teaching timetable (replace with real data as needed)
const facultyTimetable = [
  // Each array represents a day (Monday to Saturday)
  [
    { time: '8:00 AM', subject: 'Physics - 4A' },
    { time: '9:00 AM', subject: 'Physics - 3B' },
    { time: '10:00 AM', subject: 'Physics - 2B' },
    { time: '11:00 AM', subject: 'Free' },
    { time: '1:00 PM', subject: 'Chemistry - 6A' },
    { time: '2:00 PM', subject: 'Free' },
  ],
  [
    { time: '8:00 AM', subject: 'Physics - 4A' },
    { time: '9:00 AM', subject: 'Physics - 2B' },
    { time: '10:00 AM', subject: 'Physics - 3A' },
    { time: '11:00 AM', subject: 'Free' },
    { time: '1:00 PM', subject: 'Free' },
    { time: '2:00 PM', subject: 'Physics - 2D' },
  ],
  [
    { time: '8:00 AM', subject: 'Free' },
    { time: '9:00 AM', subject: 'Physics - 6A' },
    { time: '10:00 AM', subject: 'Physics - 2B' },
    { time: '11:00 AM', subject: 'Physics - 5B' },
    { time: '1:00 PM', subject: 'Free' },
    { time: '2:00 PM', subject: 'Physics - 2C' },
  ],
  [
    { time: '8:00 AM', subject: 'Free' },
    { time: '9:00 AM', subject: 'Physics - 3B' },
    { time: '10:00 AM', subject: 'Free' },
    { time: '11:00 AM', subject: 'Physics - 5C' },
    { time: '1:00 PM', subject: 'Chemistry - 6A' },
    { time: '2:00 PM', subject: 'Free' },
  ],
  [
    { time: '8:00 AM', subject: 'Physics - 4A' },
    { time: '9:00 AM', subject: 'Physics - 3B' },
    { time: '10:00 AM', subject: 'Physics - 2B' },
    { time: '11:00 AM', subject: 'Free' },
    { time: '1:00 PM', subject: 'Chemistry - 3C' },
    { time: '2:00 PM', subject: 'Physics - 2A' },
  ],
  [
    { time: '8:00 AM', subject: 'Free' },
    { time: '9:00 AM', subject: 'Free' },
    { time: '10:00 AM', subject: 'Free' },
    { time: '11:00 AM', subject: 'Free' },
    { time: '1:00 PM', subject: 'Free' },
    { time: '2:00 PM', subject: 'Free' },
  ],
];

// Time slots for the timetable
const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const FacultyDashboard = () => {
  // Refs for each section
  const myProfileRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const timetableRef = useRef<HTMLDivElement>(null);
  const attendanceRef = useRef<HTMLDivElement>(null);
  const examsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const announcementsRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  // State for active section
  const [activeSection, setActiveSection] = React.useState('my-profile');

  // Sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Class selection state
  const [selectedClass, setSelectedClass] = useState('A');

  // Attendance date state
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  // Format the agenda month and year based on attendanceDate
  const agendaMonthYear = format(new Date(attendanceDate), 'MMMM yyyy');

  // Attendance state for selected class
  const [attendance, setAttendance] = useState<{ id: number; name: string; present: boolean }[]>(
    classStudents[selectedClass].map((s) => ({ ...s, present: false }))
  );

  // Update attendance list when class changes
  React.useEffect(() => {
    setAttendance(classStudents[selectedClass].map((s) => ({ ...s, present: false })));
  }, [selectedClass]);

  // Sidebar items (similar to StudentDashboard)
  const sidebarItems = [
    { label: 'My Profile', section: 'my-profile', icon: <Users className="w-5 h-5" /> },
    { label: 'Dashboard', section: 'dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'Timetable', section: 'timetable', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Attendance', section: 'attendance', icon: <CheckSquare className="w-5 h-5" /> },
    { label: 'Exams', section: 'exams', icon: <FileText className="w-5 h-5" /> },
    { label: 'Results', section: 'results', icon: <BarChart2 className="w-5 h-5" /> },
    { label: 'Announcements', section: 'announcements', icon: <Megaphone className="w-5 h-5" /> },
  ];
  const bottomSidebarItems = [
    { label: 'Settings', section: 'settings', icon: <Settings className="w-5 h-5" /> },
    { label: 'Help', section: 'help', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const sectionRefs = {
    'my-profile': myProfileRef,
    'dashboard': dashboardRef,
    'timetable': timetableRef,
    'attendance': attendanceRef,
    'exams': examsRef,
    'results': resultsRef,
    'announcements': announcementsRef,
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    const ref = sectionRefs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Listen to scroll to update active section
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { section: 'home', ref: homeRef },
        { section: 'exams', ref: examsRef },
        { section: 'results', ref: resultsRef },
        { section: 'attendance', ref: attendanceRef },
        { section: 'announcements', ref: announcementsRef },
      ];
      const scrollPosition = window.scrollY + 120; // Offset for nav

      let current = 'home';
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

  // Top statistics data
  const stats = [
    { label: 'Students', value: '124,684', color: 'bg-yellow-100', icon: <Users className="text-yellow-500" /> },
    { label: 'Teachers', value: '12,379', color: 'bg-purple-100', icon: <Users className="text-purple-500" /> },
    { label: 'Staffs', value: '29,300', color: 'bg-blue-100', icon: <Users className="text-blue-500" /> },
    { label: 'Awards', value: '95,800', color: 'bg-orange-100', icon: <Award className="text-orange-500" /> },
  ];

  // Agenda data
  const agenda = [
    { time: '08:00 am', title: 'Homeroom & Announcement', grade: 'All Grade', color: 'bg-gray-100' },
    { time: '10:00 am', title: 'Math Review & Practice', grade: 'Grade 3-5', color: 'bg-yellow-100' },
    { time: '10:30 am', title: 'Science Experiment & Discussion', grade: 'Grade 6-8', color: 'bg-green-100' },
  ];

  // Messages data
  const messages = [
    { name: 'Dr. Lila Ramirez', message: 'Please review the monthly attendance report...', time: '9:00 AM' },
    { name: 'Ms. Heather Morris', message: 'Don\'t forget to start training on obligations...', time: '2:00 PM' },
    { name: 'Mr. Carl Jenkins', message: 'Budgetary meeting for the next fiscal year...', time: '3:00 PM' },
    { name: 'Other Dan Brooks', message: 'Review the updated security protocols...', time: '4:00 PM' },
  ];

  // Placeholder BarChart component
  const BarChart = () => (
    <div className="flex items-center justify-center h-24 sm:h-32">
      <span className="text-gray-400">[Bar Chart]</span>
    </div>
  );

  // Home section JSX
  const homeSection = (
    <div ref={homeRef} id="home" className="scroll-mt-24 space-y-6">
      {/* Attendance Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Attendance Overview</CardTitle>
          <CardDescription>Current attendance statistics for your classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceGraph />
        </CardContent>
      </Card>
    </div>
  );

  // Exams section JSX
  const examsSection = (
    <div ref={examsRef} id="exams" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Exams</CardTitle>
          <CardDescription>Upcoming and past exams overview.</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-gray-400">[Exams content here]</span>
        </CardContent>
      </Card>
    </div>
  );

  // Results section JSX (placeholder)
  const resultsSection = (
    <div ref={resultsRef} id="results" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Results</CardTitle>
          <CardDescription>Results overview.</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-gray-400">[Results content here]</span>
        </CardContent>
      </Card>
    </div>
  );

  // Announcements section JSX
  const announcementsSection = (
    <div ref={announcementsRef} id="announcements" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Announcements</CardTitle>
          <CardDescription>Important announcements and updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-gray-400">[Announcements content here]</span>
        </CardContent>
      </Card>
    </div>
  );

  // Mock faculty profile (replace with real data or store)
  const facultyProfile = {
    firstName: "Dr. Lila",
    lastName: "Ramirez",
    email: "lila.ramirez@college.edu",
    department: "Physics",
    phone: "(44) 99888-7777",
    id: "FAC-2025-001",
    dob: "1980-05-12",
  };

  return (
	/* Main Dashboard Layout */
	<div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
		{/* Sidebar */}
		<aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between md:justify-start w-full">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <div>
            <span className="font-bold text-lg text-gray-900">Faculty Portal</span>
          </div>
        </div>
        {/* Close button for mobile sidebar */}
        <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg" onClick={toggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.section)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.section
                  ? 'bg-blue-50 text-blue-700 md:border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          {bottomSidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.section)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
    {/* Overlay for mobile sidebar */}
    {isSidebarOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}></div>
    )}

    {/* Main Content */}
    <main className="flex-1 overflow-auto">
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
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm hidden md:block">
              <div className="font-medium text-gray-900">
                {facultyProfile.firstName} {facultyProfile.lastName}
              </div>
              <div className="text-gray-500">{facultyProfile.email}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-4 md:p-6">
        {/* My Profile Section */}
        <div ref={myProfileRef} className="space-y-4 md:space-y-6">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-2 mb-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {facultyProfile.firstName} {facultyProfile.lastName}
                  </h2>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 mb-2 md:mb-4 text-sm md:text-base">{facultyProfile.email}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Faculty ID:</span> {facultyProfile.id}
                  </div>
                  <div>
                    <span className="font-medium">Department:</span> {facultyProfile.department}
                  </div>
                  <div>
                    <span className="font-medium">Date of birth:</span> {dayjs(facultyProfile.dob).format('DD/MM/YYYY')}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {facultyProfile.phone}
                  </div>
                </div>
                <div className="mt-4 md:mt-6">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Dashboard Section */}
        <div ref={dashboardRef} className="pt-4 md:pt-8">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <CardHeader>
              <CardTitle className="text-base md:text-lg font-semibold text-gray-900">Dashboard Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {/* Top Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                {stats.map((stat, idx) => (
                  <Card key={idx} className={stat.color}>
                    <CardContent className="flex items-center justify-between py-2 sm:py-4">
                      <div>
                        <div className="text-base sm:text-lg font-bold">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                      <div className="text-xl sm:text-2xl">{stat.icon}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Attendance Graph */}
              <Card className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                <CardContent>
                  <AttendanceGraph />
                </CardContent>
              </Card>
              {/* Awards */}
              <Card className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg font-semibold text-gray-900">Awards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                      <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">Best Teacher Award (2024)</h4>
                        <p className="text-xs md:text-sm text-gray-600">Awarded for outstanding teaching in Physics.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Timetable Section */}
        <div ref={timetableRef} className="pt-4 md:pt-8">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Class Timetable</CardTitle>
              <CardDescription className="text-xs md:text-sm">Weekly class schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {/* ...reuse your timetable table or similar structure as in StudentDashboard... */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Time</th>
                      <th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Monday</th>
                      <th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Tuesday</th>
                      <th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Wednesday</th>
                      <th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Thursday</th>
                      <th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Friday</th>
                      <th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Saturday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* ...map your schedule data here... */}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Section */}
        <div ref={attendanceRef} className="pt-4 md:pt-8">
          {/* ...reuse your attendance section, but styled like StudentDashboard... */}
          <div className="mb-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Attendance</CardTitle>
                {/* Class select dropdown, Date, and Submit button */}
                <div className="mt-2 flex flex-row flex-wrap items-center gap-2 w-full">
                  <select
                    id="class-select"
                    className="border rounded px-2 py-1 text-sm flex-1 min-w-0"
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                    style={{ maxWidth: 120 }}
                  >
                    {classOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 text-sm flex-1 min-w-0"
                    value={attendanceDate}
                    onChange={e => setAttendanceDate(e.target.value)}
                    style={{ minWidth: 120, maxWidth: 140 }}
                  />
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors flex-shrink-0"
                    onClick={() => {
                      // You can handle submit logic here, e.g., send attendance to server
                      alert(`Attendance submitted for ${attendanceDate}!`);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="w-full">
                    {/* Table header */}
                    <div className="grid grid-cols-3 bg-blue-50 rounded-t-md py-2 px-2 font-semibold text-blue-700 text-xs mb-2">
                      <div>Name</div>
                      <div>Roll No</div>
                      <div>Status</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {attendance.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-white border rounded-md px-2 py-2 mb-2 shadow-sm"
                        >
                          {/* Name */}
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm truncate">{item.name}</span>
                          </div>
                          {/* Roll No */}
                          <div className="flex-1 flex justify-center">
                            <span className="bg-blue-50 text-blue-600 font-semibold text-xs px-2 py-1 rounded">
                              {getRollNo(item.id)}
                            </span>
                          </div>
                          {/* Status Switch and Label */}
                          <div className="flex-1 flex items-center justify-end space-x-2">
                            <AttendanceSwitch
                              checked={item.present}
                              onChange={() =>
                                setAttendance((prev) =>
                                  prev.map((s, i) =>
                                    i === idx ? { ...s, present: !s.present } : s
                                  )
                                )
                              }
                            />
                            {item.present ? (
                              <span className="flex items-center px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold border border-green-200">
                                <svg className="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Present
                              </span>
                            ) : (
                              <span className="flex items-center px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
                                <svg className="w-3 h-3 mr-1 text-red-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                Absent
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Existing Students & Attendance Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Students</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart />
                <div className="flex justify-between mt-1 sm:mt-2 text-xs">
                  <span>Boys: 45,414</span>
                  <span>Girls: 40,270</span>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Attendance Overview</CardTitle>
                <CardDescription>Total Present vs Absent</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Exams Section */}
        <div ref={examsRef} className="pt-4 md:pt-8">
          {/* ...reuse your exams section, but styled like StudentDashboard... */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Exams</CardTitle>
              <CardDescription>Upcoming and past exams overview.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-gray-400">[Exams content here]</span>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div ref={resultsRef} className="pt-4 md:pt-8">
          {/* ...reuse your results section, but styled like StudentDashboard... */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Results</CardTitle>
              <CardDescription>Results overview.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-gray-400">[Results content here]</span>
            </CardContent>
          </Card>
        </div>

        {/* Announcements Section */}
        <div ref={announcementsRef} className="pt-4 md:pt-8">
          {/* ...reuse your announcements section, but styled like StudentDashboard... */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Announcements</CardTitle>
              <CardDescription>Important announcements and updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-gray-400">[Announcements content here]</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
  );
};

export default FacultyDashboard;
