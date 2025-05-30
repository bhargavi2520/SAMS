import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  FileText,
  BarChart2,
  CheckSquare,
  Megaphone,
  Search,
  Bell,
  Users,
  Award,
} from 'lucide-react';

// Sidebar items for navigation
const sidebarItems = [
  { label: 'Home', icon: <Home className="w-5 h-5" />, section: 'home' },
  { label: 'Exams', icon: <FileText className="w-5 h-5" />, section: 'exams' },
  { label: 'Results', icon: <BarChart2 className="w-5 h-5" />, section: 'results' },
  { label: 'Attendance', icon: <CheckSquare className="w-5 h-5" />, section: 'attendance' },
  { label: 'Announcements', icon: <Megaphone className="w-5 h-5" />, section: 'announcements' },
];

// Optimized Sidebar Navigation (floating, compact, responsive, scroll to section)
const FacultySidebarNav = ({
  activeSection,
  onNavClick,
}: {
  activeSection: string;
  onNavClick: (section: string) => void;
}) => (
  <>
    {/* Desktop Sidebar */}
    <aside
      className="hidden md:flex fixed left-2 top-1/2 -translate-y-1/2 z-40 flex-col"
      style={{ minHeight: '340px' }}
    >
      <div
        className="flex flex-col gap-1 px-1 py-3 rounded-2xl shadow-xl bg-white/95 backdrop-blur-md"
        style={{
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.12)',
        }}
      >
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            className={`rounded-xl flex items-center justify-center transition-all duration-200
              ${activeSection === item.section
                ? 'bg-green-100 text-green-700 ring-2 ring-green-400'
                : 'hover:bg-gray-100 text-gray-700'
              }`}
            style={{
              width: 44,
              height: 44,
              fontWeight: 500,
              fontSize: 18,
              background: activeSection === item.section
                ? 'rgba(187,247,208,0.85)'
                : 'rgba(255,255,255,0.85)',
              boxShadow: '0 1px 4px 0 rgba(31, 38, 135, 0.08)',
            }}
            onClick={() => onNavClick(item.section)}
            type="button"
            aria-label={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </aside>

    {/* Mobile Bottom Navigation Bar */}
    <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[96vw] max-w-xs z-50 flex justify-center md:hidden">
      <div
        className="flex w-full justify-between px-1 py-1 rounded-2xl bg-white/90 backdrop-blur-md shadow border border-white/30"
        style={{
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.10)',
        }}
      >
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            className={`flex-1 flex flex-col items-center justify-center text-base font-medium transition-all duration-200 rounded-xl
              ${activeSection === item.section
                ? 'bg-green-100 text-green-700 scale-105 shadow'
                : 'hover:bg-gray-100 text-gray-700 scale-100'
              }`}
            style={{
              background: activeSection === item.section ? 'rgba(187,247,208,0.85)' : 'transparent',
              minHeight: 40,
            }}
            onClick={() => onNavClick(item.section)}
            type="button"
            aria-label={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </nav>
  </>
);

// Placeholder chart components
const DonutChart = () => (
  <div className="flex items-center justify-center h-24 sm:h-32">
    {/* Replace with actual chart */}
    <span className="text-gray-400">[Donut Chart]</span>
  </div>
);

const BarChart = () => (
  <div className="flex items-center justify-center h-24 sm:h-32">
    {/* Replace with actual chart */}
    <span className="text-gray-400">[Bar Chart]</span>
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
      className={`absolute left-0 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
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

const FacultyDashboard = () => {
  // Refs for each section
  const homeRef = useRef<HTMLDivElement>(null);
  const examsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const attendanceRef = useRef<HTMLDivElement>(null);
  const announcementsRef = useRef<HTMLDivElement>(null);

  // State for active section
  const [activeSection, setActiveSection] = React.useState('home');

  // Class selection state
  const [selectedClass, setSelectedClass] = useState('A');

  // Attendance date state
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  // Attendance state for selected class
  const [attendance, setAttendance] = useState<{ id: number; name: string; present: boolean }[]>(
    classStudents[selectedClass].map((s) => ({ ...s, present: false }))
  );

  // Update attendance list when class changes
  React.useEffect(() => {
    setAttendance(classStudents[selectedClass].map((s) => ({ ...s, present: false })));
  }, [selectedClass]);

  // Scroll to section handler
  const handleNavClick = (section: string) => {
    setActiveSection(section);
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      home: homeRef,
      exams: examsRef,
      results: resultsRef,
      attendance: attendanceRef,
      announcements: announcementsRef,
    };
    const ref = refs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle checkbox toggle
  const handleAttendanceChange = (idx: number) => {
    setAttendance((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, present: !item.present } : item
      )
    );
  };

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

  // Placeholder data
  const stats = [
    { label: 'Students', value: '124,684', color: 'bg-yellow-100', icon: <Users className="text-yellow-500" /> },
    { label: 'Teachers', value: '12,379', color: 'bg-purple-100', icon: <Users className="text-purple-500" /> },
    { label: 'Staffs', value: '29,300', color: 'bg-blue-100', icon: <Users className="text-blue-500" /> },
    { label: 'Awards', value: '95,800', color: 'bg-orange-100', icon: <Award className="text-orange-500" /> },
  ];

  const agenda = [
    { time: '08:00 am', title: 'Homeroom & Announcement', grade: 'All Grade', color: 'bg-gray-100' },
    { time: '10:00 am', title: 'Math Review & Practice', grade: 'Grade 3-5', color: 'bg-yellow-100' },
    { time: '10:30 am', title: 'Science Experiment & Discussion', grade: 'Grade 6-8', color: 'bg-green-100' },
  ];

  const messages = [
    { name: 'Dr. Lila Ramirez', message: 'Please review the monthly attendance report...', time: '9:00 AM' },
    { name: 'Ms. Heather Morris', message: 'Don\'t forget to start training on obligations...', time: '2:00 PM' },
    { name: 'Mr. Carl Jenkins', message: 'Budgetary meeting for the next fiscal year...', time: '3:00 PM' },
    { name: 'Other Dan Brooks', message: 'Review the updated security protocols...', time: '4:00 PM' },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <FacultySidebarNav activeSection={activeSection} onNavClick={handleNavClick} />
      <div className="flex-1 ml-0 md:ml-16 p-1 sm:p-3 md:p-4">
        {/* Add horizontal padding for all cards */}
        <div className="px-2 sm:px-6 md:px-16 lg:px-32">
          {/* Home Section */}
          <div ref={homeRef} id="home" className="scroll-mt-24">
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
          </div>

          {/* Exams Section */}
          <div ref={examsRef} id="exams" className="scroll-mt-24">
            <Card className="mb-3">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Exams</CardTitle>
                <CardDescription>Upcoming and past exams overview.</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-gray-400">[Exams content here]</span>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div ref={resultsRef} id="results" className="scroll-mt-24">
            <Card className="mb-3">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Results</CardTitle>
                <CardDescription>Recent results and analytics.</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-gray-400">[Results content here]</span>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Section */}
          <div ref={attendanceRef} id="attendance" className="scroll-mt-24">
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

          {/* Announcements Section */}
          <div ref={announcementsRef} id="announcements" className="scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
              {/* Agenda */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Agenda</CardTitle>
                  <CardDescription>September 2030</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-1 text-xs text-gray-500">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    {[20, 21, 22, 23, 24, 25].map(day => (
                      <div key={day} className={`w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${day === 22 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{day}</div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {agenda.map((item, idx) => (
                      <div key={idx} className={`p-1 rounded ${item.color} mb-1`}>
                        <div className="text-xs text-gray-500">{item.time}</div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs">{item.grade}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 sm:space-y-2">
                    {messages.map((msg, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">{msg.name[0]}</div>
                        <div>
                          <div className="font-medium text-xs">{msg.name}</div>
                          <div className="text-xs text-gray-600">{msg.message}</div>
                          <div className="text-xs text-gray-400">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
