import React, { useState } from 'react';

// Attendance Switch Component
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
import DashboardNav from '../../../../components/dashboard/DashboardNav';

const overviewStats = [
  { label: 'Class Strength', value: 48, icon: '👥', color: 'bg-blue-100 text-blue-800' },
  { label: 'Avg Attendance %', value: '92%', icon: '📅', color: 'bg-green-100 text-green-800' },
  { label: 'Avg Grade', value: 'B+', icon: '📊', color: 'bg-yellow-100 text-yellow-800' },
  { label: 'Pass Rate', value: '96%', icon: '✅', color: 'bg-purple-100 text-purple-800' },
];

// Removed recentActivities, quickActions, assignmentDetails, responsibilities

const studentList = [
  { rollNo: '2024PHY001', name: 'Aarav Kumar', attendance: 94, grade: 'A', status: 'Regular' },
  { rollNo: '2024PHY002', name: 'Meera Singh', attendance: 88, grade: 'B+', status: 'Monitor' },
  { rollNo: '2024PHY003', name: 'Rohan Das', attendance: 72, grade: 'C', status: 'Warning' },
  { rollNo: '2024PHY004', name: 'Isha Patel', attendance: 80, grade: 'B', status: 'Counseling' },
  { rollNo: '2024PHY005', name: 'Saanvi Rao', attendance: 97, grade: 'A+', status: 'Regular' },
  // ...more students
];

const statusColors: Record<string, string> = {
  Regular: 'bg-green-100 text-green-800',
  Monitor: 'bg-blue-100 text-blue-800',
  Counseling: 'bg-yellow-100 text-yellow-800',
  Warning: 'bg-red-100 text-red-800',
};

const attendanceColor = (attendance: number) => {
  if (attendance > 85) return 'text-green-600 font-bold';
  if (attendance >= 75) return 'text-yellow-600 font-bold';
  return 'text-red-600 font-bold';
};

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00'
];
const timetable = [
  ['Math', 'Physics', 'Chemistry', 'English', 'Break', 'Biology', 'PE', 'Library'],
  ['English', 'Math', 'Physics', 'Chemistry', 'Break', 'Biology', 'PE', 'Library'],
  ['Chemistry', 'English', 'Math', 'Physics', 'Break', 'Biology', 'PE', 'Library'],
  ['Physics', 'Chemistry', 'English', 'Math', 'Break', 'Biology', 'PE', 'Library'],
  ['Biology', 'PE', 'Library', 'Math', 'Break', 'Physics', 'Chemistry', 'English'],
  ['PE', 'Library', 'Math', 'Physics', 'Break', 'Chemistry', 'English', 'Biology'],
];
const monitors = [
  { name: 'Meera Singh', role: 'Monitor', contact: '9876543210', icon: '⭐' },
  { name: 'Aarav Kumar', role: 'Monitor', contact: '9876543211', icon: '⭐' },
];
const representatives = [
  { name: 'Isha Patel', role: 'Representative', contact: '9876543212', icon: '✔️' },
  { name: 'Rohan Das', role: 'Representative', contact: '9876543213', icon: '✔️' },
];

const communicationOptions = [
  {
    section: 'Parent Communication',
    color: 'bg-green-50',
    icon: '📧',
    actions: [
      { label: 'Bulk Email', icon: '✉️' },
      { label: 'Parent Meetings', icon: '👨‍👩‍👧‍👦' },
      { label: 'Individual Messages', icon: '💬' },
      { label: 'Urgent Notifications', icon: '🚨' },
    ],
  },
  {
    section: 'Student Counseling',
    color: 'bg-blue-50',
    icon: '🧑‍🏫',
    actions: [
      { label: 'Schedule Sessions', icon: '📅' },
      { label: 'View Records', icon: '📋' },
      { label: 'Group Counseling', icon: '👥' },
      { label: 'Disciplinary Actions', icon: '⚠️' },
    ],
  },
];

const reportOptions = [
  {
    icon: '📊',
    title: 'Class Performance',
    description: 'Analyze overall class performance, grade distribution, and trends.',
  },
  {
    icon: '👤',
    title: 'Individual Progress',
    description: 'Track individual student progress, strengths, and areas for improvement.',
  },
  {
    icon: '📅',
    title: 'Attendance Analysis',
    description: 'Detailed attendance breakdown and patterns for the class.',
  },
  {
    icon: '📞',
    title: 'Parent Communication Log',
    description: 'View and export logs of all parent communications.',
  },
  {
    icon: '🗂️',
    title: 'Counseling Records',
    description: 'Access and generate reports on student counseling sessions.',
  },
  {
    icon: '⚠️',
    title: 'Disciplinary Reports',
    description: 'Generate and review disciplinary action reports.',
  },
];

const sectionIds = [
  'quick-stats',
  'attendance-section',
  'student-list',
  'weekly-timetable',
  'monitors-representatives',
  'communication',
  'reports',
];

const ClassTeacherDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    if (section === 'quick-stats') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Attendance state for students
  const [attendance, setAttendance] = useState<{ rollNo: string; name: string; present: boolean }[]>(
    studentList.map((s) => ({ ...s, present: false }))
  );

  // Attendance date state
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  // Optimized scroll detection using Intersection Observer
  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <DashboardNav
        activeSection={activeSection}
        onNavClick={handleNavClick}
        dashboardType="class_teacher"
      />
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Quick Stats */}
        <section id="quick-stats" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {overviewStats.map(stat => (
              <div key={stat.label} className={`rounded-lg p-4 flex flex-col items-center ${stat.color} shadow-sm`}>
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-lg font-bold">{stat.value}</span>
                <span className="text-xs text-gray-600 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Attendance Section */}
        <section id="attendance-section" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Attendance</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={attendanceDate}
                onChange={e => setAttendanceDate(e.target.value)}
                style={{ minWidth: 120, maxWidth: 120 }}
              />
              <button
                type="button"
                className="px-3 py-1 rounded bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors"
                onClick={() => {
                  alert(`Attendance submitted for ${attendanceDate}!`);
                }}
              >
                Submit
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="w-full">
                {/* Table header: Name, Roll No, Attendance (2x for desktop) */}
                <div className="hidden md:grid md:grid-cols-2 bg-blue-50 rounded-t-md py-2 px-2 font-semibold text-blue-700 text-xs mb-2">
                  <div className="flex w-full text-center">
                    <div className="w-1/3">Name</div>
                    <div className="w-1/3">Roll No</div>
                    <div className="w-1/3">Attendance</div>
                  </div>
                  <div className="flex w-full text-center">
                    <div className="w-1/3">Name</div>
                    <div className="w-1/3">Roll No</div>
                    <div className="w-1/3">Attendance</div>
                  </div>
                </div>
                <div className="md:hidden grid grid-cols-3 bg-blue-50 rounded-t-md py-2 px-2 font-semibold text-blue-700 text-xs mb-2">
                  <div>Name</div>
                  <div>Roll No</div>
                  <div>Attendance</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {attendance.map((item, idx) => {
                    return (
                      <div
                        key={item.rollNo}
                        className="flex flex-col md:flex-row bg-white border rounded-md px-2 py-2 mb-2 shadow-sm"
                      >
                        {/* Desktop: 3 fields in a row, Mobile: stacked */}
                        <div className="flex w-full">
                          <div className="w-1/3 min-w-0 flex items-center">
                            <span className="font-medium text-sm truncate">{item.name}</span>
                          </div>
                          <div className="w-1/3 flex items-center justify-center">
                            <span className="bg-blue-50 text-blue-600 font-semibold text-xs px-2 py-1 rounded">
                              {item.rollNo}
                            </span>
                          </div>
                          <div className="w-1/3 flex items-center justify-end space-x-2">
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
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Student List */}
        <section id="student-list" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Student List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">Roll No</th>
                  <th className="py-2 px-3 text-left">Student Name</th>
                  <th className="py-2 px-3 text-left">Attendance %</th>
                  <th className="py-2 px-3 text-left">Current Grade</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-2 px-3">{student.rollNo}</td>
                    <td className="py-2 px-3">{student.name}</td>
                    <td className={`py-2 px-3 ${attendanceColor(student.attendance)}`}>{student.attendance}%</td>
                    <td className="py-2 px-3">{student.grade}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[student.status]}`}>{student.status}</span>
                    </td>
                    <td className="py-2 px-3 flex gap-2">
                      <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200" title="Message">
                        <span role="img" aria-label="Message">💬</span>
                      </button>
                      <button className="bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200" title="Report">
                        <span role="img" aria-label="Report">📄</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Weekly Timetable */}
        <section id="weekly-timetable" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Weekly Timetable</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-3 text-left">Time</th>
                  {weekDays.map(day => (
                    <th key={day} className="py-2 px-3 text-left">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, i) => (
                  <tr key={slot} className="border-b last:border-b-0">
                    <td className="py-2 px-3 font-semibold">{slot}</td>
                    {weekDays.map((_, j) => (
                      <td key={j} className="py-2 px-3">{timetable[j][i]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Monitors & Representatives */}
        <section id="monitors-representatives" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Class Monitors & Representatives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {monitors.map((m, idx) => (
              <div key={m.name} className="bg-yellow-50 rounded-lg p-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-semibold text-yellow-900 mb-1">{m.name} <span className="text-xs align-middle">({m.role})</span></div>
                  <div className="text-sm text-gray-700">Contact: {m.contact}</div>
                </div>
              </div>
            ))}
            {representatives.map((r, idx) => (
              <div key={r.name} className="bg-blue-50 rounded-lg p-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">✔️</span>
                <div>
                  <div className="font-semibold text-blue-900 mb-1">{r.name} <span className="text-xs align-middle">({r.role})</span></div>
                  <div className="text-sm text-gray-700">Contact: {r.contact}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Communication */}
        <section id="communication" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Communication</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communicationOptions.map((section) => (
              <div key={section.section} className={`rounded-lg shadow-sm p-6 flex flex-col gap-4 ${section.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold">{section.section}</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {section.actions.map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center gap-3 px-4 py-2 rounded-md bg-white hover:bg-gray-100 shadow text-gray-800 font-medium transition-colors"
                    >
                      <span className="text-xl">{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reports */}
        <section id="reports" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportOptions.map((report) => (
              <div key={report.title} className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-start gap-4 border border-gray-100">
                <span className="text-3xl">{report.icon}</span>
                <div className="font-semibold text-lg text-gray-900">{report.title}</div>
                <div className="text-sm text-gray-700 flex-1">{report.description}</div>
                <button className="mt-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                  Generate Report
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClassTeacherDashboard;