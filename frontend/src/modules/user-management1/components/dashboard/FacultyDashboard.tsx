import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Edit, BookOpen, Calendar, Megaphone, Bell, Moon, Search, Menu, Award, Users, FileText, BarChart2, CheckSquare, Settings, Home, HelpCircle } from 'lucide-react';
import dayjs from 'dayjs';

import { Button } from '@/common/components/ui/button';
import { format } from 'date-fns'; // Add this import at the top if you have date-fns installed
import { ChartOptions } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import DashboardNav from './DashboardNav'

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

// Pie chart for students (gender distribution example)
const StudentPieChart = () => {
  const data = {
    labels: ['Boys', 'Girls'],
    datasets: [
      {
        data: [45414, 40270],
        backgroundColor: ['#3b82f6', '#f472b6'],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="h-40 flex items-center justify-center">
      <Pie data={data} options={{ plugins: { legend: { display: true, position: 'bottom' } } }} />
    </div>
  );
};

// Helper to generate roll numbers in format "23815A0405"
const getRollNo = (id: number) => {
  // Example: 23815A04${id.toString().padStart(2, '0')}
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

// Example: Faculty's teaching timetable (now with department names instead of 1A, 2A, etc.)
const facultyTimetable = [
  // Each array represents a day (Monday to Saturday)
  [
    { time: '8:00 AM', class: 'CSE', subject: 'Physics' },
    { time: '9:00 AM', class: 'ECE', subject: 'Physics' },
    { time: '10:00 AM', class: 'EEE', subject: 'Physics' },
    { time: '11:00 AM', rest: true },
    { time: '1:00 PM', class: 'MECH', subject: 'Chemistry' },
    { time: '2:00 PM', class: 'CSE', subject: 'Chemistry' },
  ],
  [
    { time: '8:00 AM', class: 'CSE', subject: 'Chemistry' },
    { time: '9:00 AM', class: 'EEE', subject: 'Physics' },
    { time: '10:00 AM', class: 'ECE', subject: 'Physics' },
    { time: '11:00 AM', class: 'MECH', subject: 'Physics' },
    { time: '1:00 PM', class: 'CSE', subject: '' },
    { time: '2:00 PM', rest: true },
  ],
  [
    { time: '8:00 AM', class: 'MECH', subject: 'Chemistry' },
    { time: '9:00 AM', class: 'CSE', subject: 'Physics' },
    { time: '10:00 AM', class: 'EEE', subject: 'Physics' },
    { time: '11:00 AM', class: 'ECE', subject: 'Physics' },
    { time: '1:00 PM', class: 'CSE', subject: 'Chemistry' },
    { time: '2:00 PM', class: 'EEE', subject: 'Physics' },
  ],
  [
    { time: '8:00 AM', class: 'CSE', subject: 'Chemistry' },
    { time: '9:00 AM', class: 'ECE', subject: 'Physics' },
    { time: '10:00 AM', class: 'MECH', subject: 'Chemistry' },
    { time: '11:00 AM', class: 'EEE', subject: 'Physics' },
    { time: '1:00 PM', class: 'CSE', subject: 'Chemistry' },
    { time: '2:00 PM', rest: true },
  ],
  [
    { time: '8:00 AM', class: 'CSE', subject: 'Physics' },
    { time: '9:00 AM', class: 'ECE', subject: 'Physics' },
    { time: '10:00 AM', class: 'EEE', subject: 'Physics' },
    { time: '11:00 AM', class: 'CSE', subject: 'Chemistry' },
    { time: '1:00 PM', class: 'MECH', subject: 'Chemistry' },
    { time: '2:00 PM', class: 'EEE', subject: 'Physics' },
  ],
  [
    { time: '8:00 AM', rest: true },
    { time: '9:00 AM', rest: true },
    { time: '10:00 AM', rest: true },
    { time: '11:00 AM', rest: true },
    { time: '1:00 PM', rest: true },
    { time: '2:00 PM', rest: true },
  ],
];

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

  // Exams section state
  const [selectedExamClass, setSelectedExamClass] = useState('A');
  const [selectedExamStudent, setSelectedExamStudent] = useState(1);
  const [examMarks, setExamMarks] = useState(0);
  const [bitPaperMarks, setBitPaperMarks] = useState(0);
  const [assignmentMarks, setAssignmentMarks] = useState(0);
  const [midTermScores, setMidTermScores] = useState<{[key:string]: number[]}>({}); // { 'A-1': [score1, score2] }

  const studentsForExam = classStudents[selectedExamClass];
  const selectedStudent = studentsForExam.find(s => s.id === selectedExamStudent);

  const calcMidTermScore = (exam: number, bit: number, assign: number) => {
    return Math.floor(exam/2) + Math.floor(bit/2) + assign;
  };

  const handleSaveMarks = () => {
    const key = `${selectedExamClass}-${selectedExamStudent}`;
    const score = calcMidTermScore(examMarks, bitPaperMarks, assignmentMarks);
    setMidTermScores(prev => {
      const arr = prev[key] ? [...prev[key], score] : [score];
      return { ...prev, [key]: arr.slice(-2) }; // keep max 2 mid-terms
    });
  };

  const getWeightedFinal = (scores: number[]) => {
    if (scores.length === 2) {
      const [a, b] = scores;
      const higher = Math.max(a, b);
      const lower = Math.min(a, b);
      return Math.round(higher * 0.8 + lower * 0.2);
    }
    return scores[0] || 0;
  };

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
    if (section === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSidebarOpen(false);
      return;
    }
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
        { section: 'my-profile', ref: myProfileRef },
        { section: 'dashboard', ref: dashboardRef },
        { section: 'timetable', ref: timetableRef },
        { section: 'attendance', ref: attendanceRef },
        { section: 'exams', ref: examsRef },
        { section: 'results', ref: resultsRef },
        { section: 'announcements', ref: announcementsRef },
      ];
      const scrollPosition = window.scrollY + 120; // Offset for nav

      let current = 'my-profile';
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

  // Attendance Graph for past 30 days
const Attendance30DaysGraph = () => {
  // Generate mock data for 30 days
  const today = new Date();
  const daysArr = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return d;
  });
  const labels = daysArr.map(d => format(d, 'MMM d'));
  // Mock attendance % (random for demo)
  const dataArr = daysArr.map(() => Math.floor(80 + Math.random() * 20));
  const data = {
    labels,
    datasets: [
      {
        label: 'Attendance %',
        data: dataArr,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
      },
      x: {
        ticks: { maxTicksLimit: 8 },
      },
    },
  };
  return (
    <div className="h-56 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

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
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">Past 30 Days Attendance</h4>
            <Attendance30DaysGraph />
          </div>
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
          {/* Mid Exam Marks Entry Section */}
          <div className="mt-6">
            <h3 className="font-semibold text-base mb-2">Mid Exam Marks Entry</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <label htmlFor="exam-class-select" className="sr-only">Select Class</label>
              <select
                id="exam-class-select"
                className="border rounded px-2 py-1 text-sm"
                value={selectedExamClass}
                onChange={e => {
                  setSelectedExamClass(e.target.value);
                  setSelectedExamStudent(1);
                }}
                aria-label="Select class for marks entry"
              >
                {classOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <label htmlFor="exam-student-select" className="sr-only">Select Student</label>
              <select
                id="exam-student-select"
                className="border rounded px-2 py-1 text-sm"
                value={selectedExamStudent}
                onChange={e => setSelectedExamStudent(Number(e.target.value))}
                aria-label="Select student for marks entry"
              >
                {studentsForExam.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({getRollNo(s.id)})</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <label htmlFor="exam-marks" className="text-xs font-medium">Exam (out of 30):</label>
              <input
                id="exam-marks"
                type="number"
                min={0}
                max={30}
                className="border rounded px-2 py-1 text-sm w-20"
                value={examMarks}
                onChange={e => setExamMarks(Number(e.target.value))}
                aria-label="Exam marks out of 30"
                placeholder="0"
              />
              <label htmlFor="bit-marks" className="text-xs font-medium">Bit Paper (out of 20):</label>
              <input
                id="bit-marks"
                type="number"
                min={0}
                max={20}
                className="border rounded px-2 py-1 text-sm w-20"
                value={bitPaperMarks}
                onChange={e => setBitPaperMarks(Number(e.target.value))}
                aria-label="Bit Paper marks out of 20"
                placeholder="0"
              />
              <label htmlFor="assignment-marks" className="text-xs font-medium">Assignment (out of 5):</label>
              <input
                id="assignment-marks"
                type="number"
                min={0}
                max={5}
                className="border rounded px-2 py-1 text-sm w-20"
                value={assignmentMarks}
                onChange={e => setAssignmentMarks(Number(e.target.value))}
                aria-label="Assignment marks out of 5"
                placeholder="0"
              />
              <button
                type="button"
                className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                onClick={handleSaveMarks}
                aria-label="Save marks"
              >
                Save
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-700">
              <div>Mid-term Score: <span className="font-semibold">{calcMidTermScore(examMarks, bitPaperMarks, assignmentMarks)}</span></div>
              <div>
                Weighted Final Score:{' '}
                <span className="font-semibold">
                  {getWeightedFinal(midTermScores[`${selectedExamClass}-${selectedExamStudent}`] || [calcMidTermScore(examMarks, bitPaperMarks, assignmentMarks)])}
                </span>
                {midTermScores[`${selectedExamClass}-${selectedExamStudent}`]?.length === 2 && (
                  <span className="ml-2 text-gray-500">(80% higher + 20% lower mid-term)</span>
                )}
              </div>
              <div className="mt-1 text-gray-500">(Scores are auto-calculated and saved per student. Only last 2 mid-terms are considered.)</div>
            </div>
          </div>
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
		<DashboardNav activeSection={activeSection} onNavClick={handleNavClick} dashboardType="faculty" />
    {/* Main Content */}
    <main className="flex-1 overflow-auto md:ml-20 pb-16 md:pb-0">
      <div className="p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6">
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
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Time</th>
                      {days.map(day => (
                        <th key={day} className="p-2 md:p-3 font-semibold text-center bg-gray-50">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot, rowIdx) => (
                      <tr key={slot}>
                        <td className="p-2 md:p-3 font-semibold text-center bg-gray-50">{slot}</td>
                        {facultyTimetable.map((dayArr, colIdx) => {
                          const cell = dayArr[rowIdx];
                          if (!cell) return <td key={colIdx} className="p-2 md:p-3 text-center"></td>;
                          if (cell.rest) {
                            return <td key={colIdx} className="p-2 md:p-3 text-center"><span className="inline-block bg-gray-100 text-gray-400 rounded-lg px-2 py-1 text-xs font-medium">Rest</span></td>;
                          }
                          return (
                            <td key={colIdx} className="p-2 md:p-3 text-center">
                              <span className="inline-block bg-blue-50 text-blue-700 rounded-lg px-2 py-1 text-xs font-medium">
                                {cell.class} - {cell.subject}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
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
                <StudentPieChart />
                <div className="flex justify-between mt-1 sm:mt-2 text-xs">
                  <span>Boys: 45,414</span>
                  <span>Girls: 40,270</span>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardContent>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Past 30 Days Attendance</h4>
                  <Attendance30DaysGraph />
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
              {/* Mid Exam Marks Entry Section */}
              <div className="mt-6">
                <h3 className="font-semibold text-base mb-2">Mid Exam Marks Entry</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <label htmlFor="exam-class-select" className="sr-only">Select Class</label>
                  <select
                    id="exam-class-select"
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedExamClass}
                    onChange={e => {
                      setSelectedExamClass(e.target.value);
                      setSelectedExamStudent(1);
                    }}
                    aria-label="Select class for marks entry"
                  >
                    {classOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <label htmlFor="exam-student-select" className="sr-only">Select Student</label>
                  <select
                    id="exam-student-select"
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedExamStudent}
                    onChange={e => setSelectedExamStudent(Number(e.target.value))}
                    aria-label="Select student for marks entry"
                  >
                    {studentsForExam.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({getRollNo(s.id)})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <label htmlFor="exam-marks" className="text-xs font-medium">Exam (out of 30):</label>
                  <input
                    id="exam-marks"
                    type="number"
                    min={0}
                    max={30}
                    className="border rounded px-2 py-1 text-sm w-20"
                    value={examMarks}
                    onChange={e => setExamMarks(Number(e.target.value))}
                    aria-label="Exam marks out of 30"
                    placeholder="0"
                  />
                  <label htmlFor="bit-marks" className="text-xs font-medium">Bit Paper (out of 20):</label>
                  <input
                    id="bit-marks"
                    type="number"
                    min={0}
                    max={20}
                    className="border rounded px-2 py-1 text-sm w-20"
                    value={bitPaperMarks}
                    onChange={e => setBitPaperMarks(Number(e.target.value))}
                    aria-label="Bit Paper marks out of 20"
                    placeholder="0"
                  />
                  <label htmlFor="assignment-marks" className="text-xs font-medium">Assignment (out of 5):</label>
                  <input
                    id="assignment-marks"
                    type="number"
                    min={0}
                    max={5}
                    className="border rounded px-2 py-1 text-sm w-20"
                    value={assignmentMarks}
                    onChange={e => setAssignmentMarks(Number(e.target.value))}
                    aria-label="Assignment marks out of 5"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                    onClick={handleSaveMarks}
                    aria-label="Save marks"
                  >
                    Save
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-700">
                  <div>Mid-term Score: <span className="font-semibold">{calcMidTermScore(examMarks, bitPaperMarks, assignmentMarks)}</span></div>
                  <div>
                    Weighted Final Score:{' '}
                    <span className="font-semibold">
                      {getWeightedFinal(midTermScores[`${selectedExamClass}-${selectedExamStudent}`] || [calcMidTermScore(examMarks, bitPaperMarks, assignmentMarks)])}
                    </span>
                    {midTermScores[`${selectedExamClass}-${selectedExamStudent}`]?.length === 2 && (
                      <span className="ml-2 text-gray-500">(80% higher + 20% lower mid-term)</span>
                    )}
                  </div>
                  <div className="mt-1 text-gray-500">(Scores are auto-calculated and saved per student. Only last 2 mid-terms are considered.)</div>
                </div>
              </div>
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
