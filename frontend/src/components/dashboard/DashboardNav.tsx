import React from 'react';
import {
  Home, User, Calendar, BookOpen, FileText, BarChart2, CheckSquare, Bell, Menu, MessageCircle, Settings, HelpCircle, Users, Database, Shield, CalendarDays, UserCog, FileBarChart2
} from 'lucide-react';

// Nav configs for each dashboard type
const navConfig = {
  student: [
    { label: 'Dashboard', icon: <Home className="w-6 h-6" />, section: 'dashboard' },
    { label: 'Timetable', icon: <Calendar className="w-6 h-6" />, section: 'timetable' },
    { label: 'Subjects Faculty', icon: <BookOpen className="w-6 h-6" />, section: 'subjects-faculty' },
    { label: 'Exams', icon: <FileText className="w-6 h-6" />, section: 'exams' },
    { label: 'Performance', icon: <BarChart2 className="w-6 h-6" />, section: 'performance' },
    { label: 'Attendance', icon: <CheckSquare className="w-6 h-6" />, section: 'attendance' },
    { label: 'Notifications', icon: <Bell className="w-6 h-6" />, section: 'notifications' },
    { label: 'Feedback', icon: <MessageCircle className="w-6 h-6" />, section: 'feedback' },
  ],
  faculty: [
    { label: 'Dashboard', icon: <Home className="w-6 h-6" />, section: 'dashboard' },
    { label: 'Timetable', icon: <Calendar className="w-6 h-6" />, section: 'timetable' },
    { label: 'Attendance', icon: <CheckSquare className="w-6 h-6" />, section: 'attendance' },
    { label: 'Exams', icon: <FileText className="w-6 h-6" />, section: 'exams' },
    { label: 'Results', icon: <BarChart2 className="w-6 h-6" />, section: 'results' },
    { label: 'Announcements', icon: <Bell className="w-6 h-6" />, section: 'announcements' },
  ],
  admin: [
    { label: 'Dashboard', icon: <Home className="w-6 h-6" />, section: 'Dashboard' },
    { label: 'Timetable', icon: <CalendarDays className="w-6 h-6" />, section: 'Timetable' },
    { label: 'System Reports', icon: <Database className="w-6 h-6" />, section: 'System Reports' },
    { label: 'Security Settings', icon: <Shield className="w-6 h-6" />, section: 'Security Settings' },
  ],
  timetable: [
    { label: 'Timetable', icon: <Calendar className="w-6 h-6" />, section: 'Timetable' },
    // Add more if needed for Timetable dashboard
  ],
  class_teacher: [
    { label: 'Student Details', icon: <User className="w-6 h-6" />, section: 'student-details' },
    { label: 'Fee Management', icon: <BarChart2 className="w-6 h-6" />, section: 'fee-management' },
  ],
  hod: [
    { label: 'Dashboard', icon: <Home className="w-6 h-6" />, section: 'dashboard' },
    { label: 'Faculty Management', icon: <UserCog className="w-6 h-6" />, section: 'faculty-management' },
    { label: 'Student Management', icon: <Users className="w-6 h-6" />, section: 'student-management' },
    { label: 'Timetable', icon: <Calendar className="w-6 h-6" />, section: 'timetable' },
    { label: 'Exams', icon: <FileText className="w-6 h-6" />, section: 'exams' },
    { label: 'Announcements', icon: <Bell className="w-6 h-6" />, section: 'announcements' },
  ],
  guest: [
    { label: 'Guest Access', icon: <User className="w-6 h-6" />, section: 'guest-access' },
  ],
};

interface DashboardNavProps {
  activeSection: string;
  onNavClick: (section: string) => void;
  dashboardType: string;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ activeSection, onNavClick, dashboardType }) => {
  const navItems = navConfig[dashboardType] || navConfig.student;
  // Scroll to top if Home is clicked
  const handleNav = (section: string) => {
    if (section === 'dashboard' || section === 'Dashboard' || section === 'Timetable') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onNavClick(section);
  };
  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex flex-col items-start w-40 py-6 bg-transparent h-full fixed left-0 top-0 z-40 justify-center group">
        {navItems.map((item, idx) => (
          <div key={item.label} className="relative w-full flex flex-col items-start mb-6">
            <button
              onClick={() => handleNav(item.section)}
              className={`flex flex-col items-start focus:outline-none w-full ${activeSection === item.section ? 'text-blue-700' : 'text-blue-400 hover:text-blue-700'} bg-transparent transition-colors ml-3`}
              aria-label={item.label}
            >
              {item.icon }
            </button>
            <span
  onClick={() => handleNav(item.section)}
  className={`absolute left-12 top-1/2 -translate-y-1/2 text-xs rounded px-3 py-1 shadow-lg pointer-events-auto cursor-pointer z-50 font-semibold tracking-wide transition-colors text-center w-28
    ${activeSection === item.section
      ? 'bg-blue-600 text-white opacity-100 visible'
      : 'bg-transparent text-blue-700 opacity-0 invisible group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:opacity-100 group-hover:visible'}`}
  tabIndex={0}
  role="button"
>
  {item.label}
</span>
          </div>
        ))}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between px-2 py-2 z-50 h-16 items-center">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNav(item.section)}
            className={`flex flex-col items-center flex-1 ${activeSection === item.section ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
            style={{ minWidth: 0 }}
          >
            {item.icon}
            {/* Remove section name/label for mobile nav */}
          </button>
        ))}
      </nav>
    </>
  );
};

export default DashboardNav;
