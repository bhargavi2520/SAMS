import React from 'react';
import {
  Home, User, Calendar, BookOpen, FileText, BarChart2, CheckSquare, Bell, Menu, MessageCircle, Settings, HelpCircle, Users, Database, Shield, CalendarDays
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
};

const DashboardNav = ({ activeSection, onNavClick, dashboardType }) => {
  const navItems = navConfig[dashboardType] || navConfig.student;
  // Scroll to top if Home is clicked
  const handleNav = (section) => {
    if (section === 'dashboard' || section === 'Dashboard' || section === 'Timetable') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onNavClick(section);
  };
  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex flex-col items-center w-20 py-6 bg-transparent h-full fixed left-0 top-0 z-40 justify-center group">
        {navItems.map((item, idx) => (
          <div key={item.label} className="relative w-full flex flex-col items-center mb-6">
            <button
              onClick={() => handleNav(item.section)}
              className={`flex flex-col items-center focus:outline-none w-full ${activeSection === item.section ? 'text-blue-700' : 'text-blue-400 hover:text-blue-700'} bg-transparent transition-colors`}
            >
              {item.icon}
            </button>
            <span
              className={`absolute left-20 top-1/2 -translate-y-1/2 text-xs rounded px-3 py-1 shadow-lg pointer-events-none whitespace-nowrap z-50 min-w-max font-semibold tracking-wide transition-colors
                ${activeSection === item.section
                  ? 'bg-blue-600 text-white opacity-100 visible'
                  : 'bg-transparent text-blue-700 opacity-0 invisible group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:opacity-100 group-hover:visible'}`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between px-2 py-1 z-50">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNav(item.section)}
            className={`flex flex-col items-center flex-1 py-2 ${activeSection === item.section ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
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
