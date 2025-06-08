import React, { useState } from 'react';
import DashboardNav from '../../../../components/dashboard/DashboardNav';

const overviewStats = [
  { label: 'Class Strength', value: 48, icon: '👥', color: 'bg-blue-100 text-blue-800' },
  { label: 'Avg Attendance %', value: '92%', icon: '📅', color: 'bg-green-100 text-green-800' },
  { label: 'Avg Grade', value: 'B+', icon: '📊', color: 'bg-yellow-100 text-yellow-800' },
  { label: 'Pass Rate', value: '96%', icon: '✅', color: 'bg-purple-100 text-purple-800' },
];

const recentActivities = [
  { type: 'attendance', text: 'Attendance marked for 48 students', time: 'Today, 9:00 AM' },
  { type: 'counseling', text: 'Scheduled counseling for Student 12', time: 'Yesterday, 3:30 PM' },
  { type: 'parent', text: 'Parent meeting held for Student 7', time: '2 days ago' },
  { type: 'report', text: 'Generated progress report for Section A', time: '2 days ago' },
];

const quickActions = [
  { label: 'Mark Attendance', color: 'bg-blue-600 hover:bg-blue-700', icon: '📝' },
  { label: 'Send Parent Notification', color: 'bg-green-600 hover:bg-green-700', icon: '📢' },
  { label: 'Schedule Counseling', color: 'bg-yellow-500 hover:bg-yellow-600', icon: '💬' },
  { label: 'Generate Report', color: 'bg-purple-600 hover:bg-purple-700', icon: '📄' },
];

const assignmentDetails = {
  facultyId: 'FAC12345',
  facultyName: 'Dr. Priya Sharma',
  department: 'Physics',
  academicYear: '2024-2025',
  semester: 'IV',
  section: 'A',
  classStrength: 48,
};

const responsibilities = [
  {
    icon: '📝',
    title: 'Attendance Management',
    description: 'Mark and review daily attendance for all students in your class.'
  },
  {
    icon: '📢',
    title: 'Parent Communication',
    description: 'Send notifications and updates to parents regarding student progress.'
  },
  {
    icon: '💬',
    title: 'Counseling',
    description: 'Schedule and conduct counseling sessions for students in need.'
  },
  {
    icon: '📄',
    title: 'Report Generation',
    description: 'Generate academic and attendance reports for your class.'
  },
  {
    icon: '🗂️',
    title: 'Student Records',
    description: 'Access and update student personal and academic records.'
  },
  {
    icon: '📚',
    title: 'Academic Planning',
    description: 'Plan and coordinate academic activities and schedules.'
  },
];

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

const sectionIds = [
  'quick-stats',
  'quick-actions',
  'recent-activities',
  'assignment-details',
  'student-list',
  'weekly-timetable',
  'monitors-representatives',
  'communication',
];

const ClassTeacherDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  // Intersection Observer to update activeSection on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      let found = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            found = id;
          }
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <DashboardNav
        activeSection={activeSection}
        onNavClick={setActiveSection}
        dashboardType="class_teacher"
      />
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Quick Stats */}
        <section id="quick-stats">
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
        {/* Quick Actions */}
        <section id="quick-actions">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map(action => (
              <button
                key={action.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium shadow-sm transition-colors ${action.color}`}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </section>
        {/* Recent Activities */}
        <section id="recent-activities">
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
            {recentActivities.map((activity, idx) => (
              <li key={idx} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl">
                  {activity.type === 'attendance' && '📝'}
                  {activity.type === 'counseling' && '💬'}
                  {activity.type === 'parent' && '📢'}
                  {activity.type === 'report' && '📄'}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-gray-800">{activity.text}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {/* Assignment Details & Responsibilities */}
        <section id="assignment-details">
          <h2 className="text-xl font-bold mb-4">Assignment Details</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-2 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-gray-700">Faculty ID:</span> {assignmentDetails.facultyId}</div>
              <div><span className="font-medium text-gray-700">Faculty Name:</span> {assignmentDetails.facultyName}</div>
              <div><span className="font-medium text-gray-700">Department:</span> {assignmentDetails.department}</div>
              <div><span className="font-medium text-gray-700">Academic Year:</span> {assignmentDetails.academicYear}</div>
              <div><span className="font-medium text-gray-700">Semester:</span> {assignmentDetails.semester}</div>
              <div><span className="font-medium text-gray-700">Section:</span> {assignmentDetails.section}</div>
              <div><span className="font-medium text-gray-700">Class Strength:</span> {assignmentDetails.classStrength}</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Responsibilities & Access</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {responsibilities.map((resp, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                  <span className="text-2xl mt-1">{resp.icon}</span>
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">{resp.title}</div>
                    <div className="text-sm text-gray-700">{resp.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Student List */}
        <section id="student-list">
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
        <section id="weekly-timetable">
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
        <section id="monitors-representatives">
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
        <section id="communication">
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
      </div>
    </div>
  );
};

export default ClassTeacherDashboard;
