import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { AdminProfile } from "@/types/auth.types";
import {
  Users,
  UserCheck,
  Shield,
  Activity,
  Database,
  LayoutDashboard,
  CalendarDays,
  Home,
  User,
  Settings,
  HelpCircle,
  BookOpen,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search, Bell, Moon, Edit } from "lucide-react";

const sidebarItems = [
  {
    label: "Dashboard",
    path: "#dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "Manage Users",
    path: "#manage-users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Timetable",
    path: "#timetable",
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    label: "System Reports",
    path: "#system-reports",
    icon: <Database className="w-5 h-5" />,
  },
  {
    label: "Security Settings",
    path: "#security-settings",
    icon: <Shield className="w-5 h-5" />,
  },
];

const bottomSidebarItems = [
  {
    label: "Settings",
    path: "#settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: "Help",
    path: "#help",
    icon: <HelpCircle className="w-5 h-5" />,
  },
];

const systemStats = [
  {
    title: "Total Users",
    value: "1,247",
    change: "+12 from last month",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Active Students",
    value: "980",
    change: "78.6% of total users",
    icon: <UserCheck className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Faculty Members",
    value: "185",
    change: "across all departments",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "System Health",
    value: "99.9%",
    change: "uptime this month",
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,

    color: "text-green-600",
  },
];

const recentActivity = [
  {
    title: "New User Registration",
    description: "5 new students registered today",
    badge: "Today",
    icon: <UserCheck className="h-4 w-4 text-green-500" />,
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Database Backup",
    description: "Automatic backup completed successfully",
    badge: "2 hours ago",
    icon: <Database className="h-4 w-4 text-blue-500" />,
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Security Alert",
    description: "Multiple failed login attempts detected",
    badge: "Yesterday",
    icon: <Shield className="h-4 w-4 text-orange-500" />,
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
];

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const profile = user?.profile as AdminProfile;
  const [activeSection, setActiveSection] = useState<string>("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Section refs for scrolling (add more as needed)
  const dashboardRef = useRef<HTMLDivElement>(null);
  const manageUsersRef = useRef<HTMLDivElement>(null);
  const timetableRef = useRef<HTMLDivElement>(null);
  const systemReportsRef = useRef<HTMLDivElement>(null);
  const securitySettingsRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    Dashboard: dashboardRef,
    "Manage Users": manageUsersRef,
    Timetable: timetableRef,
    "System Reports": systemReportsRef,
    "Security Settings": securitySettingsRef,
  };

  const handleNavClick = (label: string) => {
    setActiveSection(label);
    const ref = sectionRefs[label];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between md:justify-start w-full">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <div>
              <span className="font-bold text-lg text-gray-900">
                Admin Portal
              </span>
            </div>
          </div>
          {/* Close button for mobile sidebar */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.label)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.label
                    ? "bg-blue-50 text-blue-700 md:border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                onClick={() => handleNavClick(item.label)}
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          {/* Dashboard Overview */}
          <div ref={dashboardRef} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                System Administration
              </h1>
              <p className="text-gray-600">
                Welcome, {profile.firstName} {profile.lastName} -{" "}
                {profile.designation}
              </p>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${stat.color || ""}`}>
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent System Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>
                  Latest system events and administrative actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${activity.bg}`}
                    >
                      {activity.icon}
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-600">
                          {activity.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {activity.badge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add other sections here (Manage Users, Timetable, etc.) with appropriate refs */}
          <div ref={manageUsersRef} className="pt-8">
            {/* Content for Manage Users section */}
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This section is under construction. Please check back later.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Example for Timetable section */}
          <div ref={timetableRef} className="pt-8">
            <Card>
              <CardHeader>
                <CardTitle>Timetable Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This section is under construction. Please check back later.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Reports Section */}
          <div ref={systemReportsRef} className="pt-8">
            <Card>
              <CardHeader>
                <CardTitle>System Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This section is under construction. Please check back later.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings Section */}
          <div ref={securitySettingsRef} className="pt-8">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This section is under construction. Please check back later.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
