import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/common/components/ui/card';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@/common/components/ui/table';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import DashboardLayout from '@/common/components/dashboard/DashboardLayout';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Mail, Phone, MapPin, User, Building2, BookOpen, Users, FileText, CheckCircle2, Clock, XCircle, BarChart2, ClipboardList, CalendarDays, FileBarChart2, Bell, UserCog } from 'lucide-react';

// Mock Data
const summaryCards = [
  { label: 'Total Students', value: 245, sub: 'Active enrollments', icon: <Users className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { label: 'Faculty Members', value: 18, sub: 'Teaching staff', icon: <User className="w-5 h-5" />, color: 'bg-green-100 text-green-800 border-green-300' },
  { label: 'Active Subjects', value: 24, sub: 'Current semester', icon: <BookOpen className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { label: 'Pending Approvals', value: 7, sub: 'Requires attention', icon: <ClipboardList className="w-5 h-5" />, color: 'bg-red-100 text-red-800 border-red-300' },
];

const recentActivities = [
  { title: 'Leave Approval', desc: `Approved Dr. Smith's sick leave`, status: 'completed', time: '2 hours ago' },
  { title: 'Subject Assignment', desc: 'Assigned Data Structures to Prof. Wilson', status: 'completed', time: '4 hours ago' },
  { title: 'Faculty Evaluation', desc: 'Performance review for Dr. Brown', status: 'pending', time: '1 day ago' },
  { title: 'Report Generation', desc: 'Monthly department report', status: 'completed', time: '2 days ago' },
];

const pendingApprovals = [
  { type: 'Leave Request', name: 'Dr. Michael Smith', detail: 'Medical Leave - 3 days', date: '2024-01-15', action: undefined },
  { type: 'Subject Assignment', name: 'Prof. Lisa Wilson', detail: 'Advanced Algorithms', date: '2024-01-14', action: undefined },
  { type: 'Timetable Change', name: 'Dr. Robert Brown', detail: 'Database Systems', date: '2024-01-13', action: undefined },
];

const hodProfile = {
  employeeId: 'HOD2024-001',
  name: 'Dr. Priya Sharma',
  department: 'Computer Science & Engineering',
  officialEmail: 'priya.sharma@university.edu',
  personalEmail: 'priya.sharma@gmail.com',
  phone: '+91 98765 43210',
  address: '123, University Road, City, State, 123456',
};

const facultyPerformance = [
  { name: 'Dr. Michael Smith', rating: 4.8, badge: 'Excellent', subjects: 'AI, ML', students: 120 },
  { name: 'Prof. Lisa Wilson', rating: 4.5, badge: 'Very Good', subjects: 'Algorithms', students: 90 },
  { name: 'Dr. Robert Brown', rating: 4.1, badge: 'Good', subjects: 'DBMS', students: 80 },
  { name: 'Dr. Emily Clark', rating: 3.7, badge: 'Average', subjects: 'Networks', students: 70 },
];

const studentPerformance = [
  { semester: 'Semester 1', passRate: 92, failRate: 8 },
  { semester: 'Semester 2', passRate: 89, failRate: 11 },
  { semester: 'Semester 3', passRate: 94, failRate: 6 },
  { semester: 'Semester 4', passRate: 90, failRate: 10 },
];

const subjectOptions = [
  { label: 'Timetable', icon: <CalendarDays className="w-8 h-8" />, desc: 'Manage class schedules and timings.' },
  { label: 'Assignments', icon: <FileText className="w-8 h-8" />, desc: 'Oversee assignment distribution and submissions.' },
  { label: 'Course Config', icon: <BookOpen className="w-8 h-8" />, desc: 'Configure course details and curriculum.' },
  { label: 'Analytics', icon: <BarChart2 className="w-8 h-8" />, desc: 'View subject-wise analytics and trends.' },
];

const reportOptions = [
  { label: 'Academic Performance', icon: <FileBarChart2 className="w-8 h-8" />, desc: 'Generate academic performance reports.' },
  { label: 'Faculty Performance', icon: <User className="w-8 h-8" />, desc: 'Analyze faculty performance metrics.' },
  { label: 'Student Progression', icon: <Users className="w-8 h-8" />, desc: 'Track student progression and outcomes.' },
  { label: 'Attendance', icon: <CheckCircle2 className="w-8 h-8" />, desc: 'Attendance statistics and trends.' },
];

const badgeColor = (badge) => {
  switch (badge) {
    case 'Excellent':
      return 'bg-green-600 text-white';
    case 'Very Good':
      return 'bg-blue-600 text-white';
    case 'Good':
      return 'bg-yellow-500 text-white';
    case 'Average':
      return 'bg-gray-400 text-white';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

const statusColor = (status) =>
  status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-400 text-black';

const sectionContent = {
  dashboard: (
    <>
      {/* Overview content (summary cards, activities, approvals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <Card key={card.label} className={`flex flex-col items-start gap-2 shadow hover:shadow-lg transition-shadow border ${card.color} bg-white dark:bg-neutral-800`}>
            <CardContent className="flex flex-col gap-1 p-4 w-full">
              <div className="flex items-center gap-2 text-sm mb-1">
                {card.icon}
                {card.label}
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs opacity-70">{card.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-white dark:bg-neutral-800">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-neutral-700 rounded p-3 flex items-center justify-between transition-colors">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{act.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">{act.desc}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(act.status)}`}>{act.status}</span>
                    <span className="text-xs text-gray-400 mt-1">{act.time}</span>
                    {/* Only HOD can update status */}
                    {true && (
                      <Button size="sm" className="mt-2" variant="outline">Update Status</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Pending Approvals */}
        <Card className="bg-white dark:bg-neutral-800">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Pending Approvals
            </h2>
            <div className="space-y-4">
              {pendingApprovals.map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-neutral-700 rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 transition-colors">
                  <div>
                    <span className="inline-block bg-gray-200 dark:bg-neutral-600 text-xs px-2 py-1 rounded mb-1 text-gray-700 dark:text-gray-200">{item.type}</span>
                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">{item.detail}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400">{item.date}</span>
                    {/* Only HOD can approve/reject */}
                    {true && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                        <Button size="sm" variant="outline" className="border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900">Reject</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  ),
  timetable: (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CalendarDays className="w-5 h-5" /> Timetable
      </h2>
      <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 text-left">Time</th>
              <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Monday</th>
              <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Tuesday</th>
              <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Wednesday</th>
              <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Thursday</th>
              <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Friday</th>
              <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Saturday</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 text-left font-medium">8:00 AM</td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Chemistry</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Physics</span></td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium">9:00 AM</td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium">10:00 AM</td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Chemistry</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium">11:00 AM</td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium">12:00 PM</td>
              <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
              <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
              <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
              <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
              <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium">1:00 PM</td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Chemistry</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE -</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Chemistry</span></td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium">2:00 PM</td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
              <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
              <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-gray-500 dark:text-gray-300 mt-4">Timetable management and view goes here.</div>
    </div>
  ),
  attendance: (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" /> Attendance
      </h2>
      <div className="text-gray-500 dark:text-gray-300">Attendance management and analytics go here.</div>
    </div>
  ),
  exams: (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" /> Exams
      </h2>
      <div className="text-gray-500 dark:text-gray-300">Exam schedules, results, and management go here.</div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-primary">Exam Dates</h3>
        <table className="min-w-[300px] text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Exam</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">Mid 1</td>
              <td className="px-4 py-2">July 15, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Mid 2</td>
              <td className="px-4 py-2">August 20, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Semester Exam</td>
              <td className="px-4 py-2">September 25, 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  results: (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BarChart2 className="w-5 h-5" /> Results
      </h2>
      <div className="text-gray-500 dark:text-gray-300">Results analytics and reports go here.</div>
    </div>
  ),
  announcements: (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5" /> Announcements
        <div className="flex-1" />
        <Button className="ml-auto bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors text-sm font-medium">Make Announcement</Button>
      </h2>
      <div className="text-gray-500 dark:text-gray-300">Department announcements and notifications go here.</div>
    </div>
  ),
};

// Accept a prop to determine if the user is HOD
const HODDashboard = ({ isHOD = true }) => {
  // Section refs for scroll navigation
  const dashboardRef = useRef(null);
  const facultyManagementRef = useRef(null);
  const studentManagementRef = useRef(null);
  const subjectManagementRef = useRef(null);
  const reportsRef = useRef(null);
  const timetableRef = useRef(null);
  const attendanceRef = useRef(null);
  const examsRef = useRef(null);
  const resultsRef = useRef(null);
  const announcementsRef = useRef(null);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [activities, setActivities] = useState(recentActivities);
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAnnouncementTab, setShowAnnouncementTab] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState([]); // For demo, local state
  const yearOptions = [1, 2, 3, 4];

  // Scroll to section on nav click
  const sectionRefs = {
    dashboard: dashboardRef,
    'faculty-management': facultyManagementRef,
    'student-management': studentManagementRef,
    'subject-management': subjectManagementRef,
    reports: reportsRef,
    timetable: timetableRef,
    attendance: attendanceRef,
    exams: examsRef,
    results: resultsRef,
    announcements: announcementsRef,
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    const ref = sectionRefs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { section: 'dashboard', ref: dashboardRef },
        { section: 'faculty-management', ref: facultyManagementRef },
        { section: 'student-management', ref: studentManagementRef },
        { section: 'subject-management', ref: subjectManagementRef },
        { section: 'reports', ref: reportsRef },
        { section: 'timetable', ref: timetableRef },
        { section: 'attendance', ref: attendanceRef },
        { section: 'exams', ref: examsRef },
        { section: 'results', ref: resultsRef },
        { section: 'announcements', ref: announcementsRef },
      ];
      const scrollPosition = window.scrollY + 120;
      let current = 'dashboard';
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

  // Handler to update activity status
  const handleUpdateStatus = (idx) => {
    setActivities((prev) =>
      prev.map((act, i) =>
        i === idx
          ? { ...act, status: act.status === 'pending' ? 'completed' : 'pending' }
          : act
      )
    );
  };

  // Handler to approve/reject
  const handleApprovalAction = (idx, action) => {
    setApprovals((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, action } : item
      )
    );
  };

  // Handler for announcement submit
  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (announcementText.trim()) {
      setAnnouncements([
        { text: announcementText, date: new Date().toLocaleString() },
        ...announcements,
      ]);
      setAnnouncementText("");
      setShowAnnouncementTab(false);
    }
  };

  // Ensure all approval items have an 'action' property in state, but not in the initial data
  // When mapping approvals, default to item.action if present, else undefined
  const approvalsWithAction = approvals.map(item => ({ ...item, action: item.action ?? undefined }));

  return (
    <div className="max-w-7xl mx-auto pt-2 px-1 md:px-4 dark:bg-neutral-900 min-h-screen transition-colors flex">
      <DashboardNav
        activeSection={activeSection}
        onNavClick={handleNavClick}
        dashboardType="hod"
      />
      <div className="flex-1 ml-0 md:ml-40">
        {/* Remove DashboardLayout if it adds extra space */}
        {/* <DashboardLayout /> */}
        <div className="p-1 md:p-2 space-y-8">
          {/* Profile Section at the top (not in nav, always visible) */}
          <section className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><User className="w-6 h-6" /> Profile</h2>
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
              <Card className="bg-white dark:bg-neutral-800 w-full">
                <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <User className="w-5 h-5" /> Primary Information
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-neutral-700 text-xs"><Building2 className="w-4 h-4 mr-1 inline" /> {hodProfile.department}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Employee ID:</span> {hodProfile.employeeId}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Name:</span> {hodProfile.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-neutral-800 w-full">
                <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5" /> Contact Information
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Mail className="w-4 h-4" /> <span className="font-medium">Official Email:</span> {hodProfile.officialEmail}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Mail className="w-4 h-4" /> <span className="font-medium">Personal Email:</span> {hodProfile.personalEmail}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Phone className="w-4 h-4" /> <span className="font-medium">Phone:</span> {hodProfile.phone}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <MapPin className="w-4 h-4" /> <span className="font-medium">Address:</span> {hodProfile.address}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dashboard Section */}
          <section ref={dashboardRef} id="dashboard" className="scroll-mt-24 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {summaryCards.map((card) => (
                <Card key={card.label} className={`flex flex-col items-start gap-2 shadow hover:shadow-lg transition-shadow border ${card.color} bg-white dark:bg-neutral-800`}>
                  <CardContent className="flex flex-col gap-1 p-4 w-full">
                    <div className="flex items-center gap-2 text-sm mb-1">
                      {card.icon}
                      {card.label}
                    </div>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="text-xs opacity-70">{card.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-neutral-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" /> Recent Activities
                  </h3>
                  <div className="space-y-4">
                    {activities.map((act, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-neutral-700 rounded p-3 flex items-center justify-between transition-colors">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{act.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">{act.desc}</div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(act.status)}`}>{act.status}</span>
                          <span className="text-xs text-gray-400 mt-1">{act.time}</span>
                          {/* Only HOD can update status */}
                          {isHOD && (
                            <Button size="sm" className="mt-2" variant="outline" onClick={() => handleUpdateStatus(idx)}>
                              Mark as {act.status === 'pending' ? 'Completed' : 'Pending'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-neutral-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Pending Approvals
                  </h3>
                  <div className="space-y-4">
                    {approvalsWithAction.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-neutral-700 rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 transition-colors">
                        <div>
                          <span className="inline-block bg-gray-200 dark:bg-neutral-600 text-xs px-2 py-1 rounded mb-1 text-gray-700 dark:text-gray-200">{item.type}</span>
                          <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">{item.detail}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-gray-400">{item.date}</span>
                          {/* Only HOD can approve/reject */}
                          {isHOD && !item.action && (
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprovalAction(idx, 'approved')}>Approve</Button>
                              <Button size="sm" variant="outline" className="border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900" onClick={() => handleApprovalAction(idx, 'rejected')}>Reject</Button>
                            </div>
                          )}
                          {isHOD && item.action && (
                            <div className="flex gap-2 items-center">
                              {item.action === 'approved' && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">Approved</span>
                              )}
                              {item.action === 'rejected' && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">Rejected</span>
                              )}
                              <Button size="sm" variant="outline" className="ml-2" onClick={() => handleApprovalAction(idx, undefined)}>Edit</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Faculty Management Section */}
          <section ref={facultyManagementRef} id="faculty-management" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><UserCog className="w-6 h-6" /> Faculty Management</h2>
            <Card className="bg-white dark:bg-neutral-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" /> Faculty Performance
                </h3>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/6 text-left font-bold text-primary text-base">Name</th>
                        <th scope="col" className="px-4 py-3 w-1/6 text-left font-bold text-primary text-base">Rating</th>
                        <th scope="col" className="px-4 py-3 w-1/6 text-left font-bold text-primary text-base">Performance</th>
                        <th scope="col" className="px-4 py-3 w-1/6 text-left font-bold text-primary text-base">Subjects</th>
                        <th scope="col" className="px-4 py-3 w-1/6 text-left font-bold text-primary text-base">Students</th>
                        <th scope="col" className="px-4 py-3 w-1/6 text-center font-bold text-primary text-base">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200">
                      {facultyPerformance.map((f, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                          <td className="px-4 py-3 w-1/6 align-middle text-left">{f.name}</td>
                          <td className="px-4 py-3 w-1/6 align-middle text-left">{f.rating.toFixed(1)}</td>
                          <td className="px-4 py-3 w-1/6 align-middle text-left"><Badge className={badgeColor(f.badge)}>{f.badge}</Badge></td>
                          <td className="px-4 py-3 w-1/6 align-middle text-left">{f.subjects}</td>
                          <td className="px-4 py-3 w-1/6 align-middle text-left">{f.students}</td>
                          <td className="px-4 py-3 w-1/6 align-middle text-center">
                            <Button size="sm" variant="outline" className="hover:bg-primary/10">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                  {facultyPerformance.map((f, idx) => (
                    <div key={idx} className="rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow p-4 flex flex-col gap-2 w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white text-base">{f.name}</span>
                        <Badge className={badgeColor(f.badge)}>{f.badge}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <span><span className="font-medium">Rating:</span> {f.rating.toFixed(1)}</span>
                        <span><span className="font-medium">Subjects:</span> {f.subjects}</span>
                        <span><span className="font-medium">Students:</span> {f.students}</span>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button size="sm" variant="outline" className="hover:bg-primary/10">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Student Management Section */}
          <section ref={studentManagementRef} id="student-management" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Users className="w-6 h-6" /> Student Management</h2>
            <Card className="bg-white dark:bg-neutral-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" /> Academic Performance
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <label htmlFor="year-select" className="text-sm font-medium text-gray-700 dark:text-gray-200">Year:</label>
                    <select
                      id="year-select"
                      className="ml-2 border border-gray-300 dark:border-neutral-600 rounded px-2 py-1 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={selectedYear}
                      onChange={e => setSelectedYear(Number(e.target.value))}
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year} Year</option>
                      ))}
                    </select>
                  </div>
                </h3>
                <div className="overflow-x-auto">
                  <Table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4 text-left font-bold text-primary text-base">Semester</th>
                        <th scope="col" className="px-4 py-3 w-1/4 text-left font-bold text-primary text-base">Pass Rate</th>
                        <th scope="col" className="px-4 py-3 w-1/4 text-left font-bold text-primary text-base">Fail Rate</th>
                        <th scope="col" className="px-4 py-3 w-1/4 text-center font-bold text-primary text-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200">
                      {studentPerformance.map((s, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                          <td className="px-4 py-3 w-1/4 align-middle text-left">{s.semester}</td>
                          <td className="px-4 py-3 w-1/4 align-middle text-left">
                            <Badge className="bg-green-600 text-white">{s.passRate}%</Badge>
                          </td>
                          <td className="px-4 py-3 w-1/4 align-middle text-left">
                            <Badge className="bg-red-500 text-white">{s.failRate}%</Badge>
                          </td>
                          <td className="px-4 py-3 w-1/4 align-middle text-center">
                            <Button size="sm" variant="outline" className="hover:bg-primary/10">Report</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Subject Management Section */}
          <section ref={subjectManagementRef} id="subject-management" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Subject Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {subjectOptions.map((opt, idx) => (
                <Card
                  key={idx}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-neutral-800 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    if (opt.label === 'Timetable' && timetableRef.current) {
                      timetableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setActiveSection('timetable');
                    }
                  }}
                >
                  <CardContent className="flex flex-col items-center">
                    <div className="mb-2">{opt.icon}</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{opt.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300 text-center">{opt.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Reports Section */}
          <section ref={reportsRef} id="reports" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FileBarChart2 className="w-6 h-6" /> Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {reportOptions.map((opt, idx) => (
                <Card key={idx} className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-neutral-800 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="mb-2">{opt.icon}</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{opt.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 text-center">{opt.desc}</div>
                </Card>
              ))}
            </div>
          </section>

          {/* Timetable Section */}
          <section ref={timetableRef} id="timetable" className="scroll-mt-24">
            <Card className="bg-white dark:bg-neutral-800 mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" /> Timetable
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
                  <table className="min-w-full text-sm text-center">
                    <thead className="bg-gray-50 dark:bg-neutral-800">
                      <tr>
                        <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 text-left">Time</th>
                        <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Monday</th>
                        <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Tuesday</th>
                        <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Wednesday</th>
                        <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Thursday</th>
                        <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Friday</th>
                        <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Saturday</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 text-left font-medium">8:00 AM</td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Chemistry</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Physics</span></td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-left font-medium">9:00 AM</td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-left font-medium">10:00 AM</td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Chemistry</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-left font-medium">11:00 AM</td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">ECE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-left font-medium">12:00 PM</td>
                        <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
                        <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
                        <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
                        <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
                        <td><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Meeting</span></td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-left font-medium">1:00 PM</td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Chemistry</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE -</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">MECH - Chemistry</span></td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-left font-medium">2:00 PM</td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">CSE - Chemistry</span></td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                        <td><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">EEE - Physics</span></td>
                        <td><span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Rest</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="text-gray-500 dark:text-gray-300 mt-4">Timetable management and view goes here.</div>
              </CardContent>
            </Card>
          </section>

          {/* Exams Section */}
          <section ref={examsRef} id="exams" className="scroll-mt-24">
            <Card className="bg-white dark:bg-neutral-800 mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Exams
                </h2>
                <div className="text-gray-500 dark:text-gray-300">Exam schedules, results, and management go here.</div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Exam Dates</h3>
                  <table className="min-w-[300px] text-sm border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Exam</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2">Mid 1</td>
                        <td className="px-4 py-2">July 15, 2025</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Mid 2</td>
                        <td className="px-4 py-2">August 20, 2025</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Semester Exam</td>
                        <td className="px-4 py-2">September 25, 2025</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Announcements Section */}
          <section ref={announcementsRef} id="announcements" className="scroll-mt-24">
            <Card className="bg-white dark:bg-neutral-800 mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Announcements
                  <div className="flex-1" />
                  <Button
                    className="ml-auto bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors text-sm font-medium"
                    onClick={() => setShowAnnouncementTab(true)}
                  >
                    Make Announcement
                  </Button>
                </h2>
                {showAnnouncementTab ? (
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 mb-4 flex flex-col gap-3 border border-primary/30">
                    <textarea
                      className="w-full min-h-[80px] rounded border border-gray-300 dark:border-neutral-600 p-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Write your announcement here..."
                      value={announcementText}
                      onChange={e => setAnnouncementText(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors text-sm font-medium"
                        onClick={handleAnnouncementSubmit}
                        disabled={!announcementText.trim()}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="outline"
                        className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-neutral-600"
                        onClick={() => { setShowAnnouncementTab(false); setAnnouncementText(''); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}
                <div className="text-gray-500 dark:text-gray-300">Department announcements and notifications go here.</div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;
