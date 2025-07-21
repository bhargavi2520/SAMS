import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import DashboardNav from "./DashboardNav";
import { Bar, Pie } from "react-chartjs-2";
import {
  Users,
  UserCheck,
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
  Bell,
  ClipboardList,
  FileText,
  BarChart2,
  CheckSquare,
  Award,
  Megaphone,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/modules/user-management1/store/authStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/common/components/ui/carousel";
import { authService } from "@/modules/user-management1/services/auth.service";
import {
  UserRole,
  StudentProfile,
  FacultyProfile,
  AdminProfile,
  HODProfile,
} from "@/modules/user-management1/types/auth.types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/common/components/ui/dialog";
import apiClient from "@/api";
import HODAssignmentManager from "./HODAssignmentManager";

// --- Mock Data ---
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
    icon: <Activity className="h-4 w-4 text-orange-500" />,
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
];

const usersTable = [
  {
    name: "Aarav Kumar",
    email: "aarav.kumar@email.com",
    role: "STUDENT",
    status: "Active",
  },
  {
    name: "Meera Singh",
    email: "meera.singh@email.com",
    role: "FACULTY",
    status: "Active",
  },
  {
    name: "Rohan Das",
    email: "rohan.das@email.com",
    role: "HOD",
    status: "Inactive",
  },
  {
    name: "Isha Patel",
    email: "isha.patel@email.com",
    role: "ADMIN",
    status: "Active",
  },
];

const timetableTable = [
  // Year 1
  {
    class: "CSE",
    year: "1",
    day: "Monday",
    time: "08:00-09:00",
    subject: "Physics",
    faculty: "Dr. Sharma",
  },
  {
    class: "CSE",
    year: "1",
    day: "Tuesday",
    time: "09:00-10:00",
    subject: "Maths",
    faculty: "Dr. Kumar",
  },
  {
    class: "ECE",
    year: "1",
    day: "Monday",
    time: "08:00-09:00",
    subject: "Basic Electronics",
    faculty: "Ms. Rao",
  },
  {
    class: "MECH",
    year: "1",
    day: "Wednesday",
    time: "10:00-11:00",
    subject: "Mechanics",
    faculty: "Mr. Singh",
  },

  // Year 2
  {
    class: "CSE",
    year: "2",
    day: "Monday",
    time: "08:00-09:00",
    subject: "Data Structures",
    faculty: "Dr. Verma",
  },
  {
    class: "CSE",
    year: "2",
    day: "Monday",
    time: "09:00-10:00",
    subject: "Algorithms",
    faculty: "Dr. Gupta",
  },
  {
    class: "ECE",
    year: "2",
    day: "Tuesday",
    time: "09:00-10:00",
    subject: "Digital Circuits",
    faculty: "Prof. Iyer",
  },

  // Year 3
  {
    class: "CSE",
    year: "3",
    day: "Wednesday",
    time: "10:00-11:00",
    subject: "OS",
    faculty: "Dr. Gupta",
  },

  // Year 4
  {
    class: "MECH",
    year: "4",
    day: "Thursday",
    time: "11:00-12:00",
    subject: "Robotics",
    faculty: "Dr. Reddy",
  },
];

const reports = [
  {
    title: "Attendance Report",
    description: "Monthly attendance summary for all classes.",
  },
  {
    title: "Performance Report",
    description: "Academic performance trends and analytics.",
  },
  {
    title: "Communication Log",
    description: "Parent and student communication records.",
  },
];

const departmentStats = [
  { department: "CSE", students: 320, faculty: 20, hod: "Dr. Priya Sharma" },
  { department: "ECE", students: 210, faculty: 15, hod: "Dr. R. Sharma" },
  { department: "MECH", students: 180, faculty: 12, hod: "Dr. P. Singh" },
];

const announcements = [
  {
    title: "System Maintenance",
    content: "Scheduled maintenance on Sunday 2AM-4AM.",
    date: "2024-06-01",
  },
  {
    title: "New Academic Year",
    content: "Admissions open for 2024-25.",
    date: "2024-05-20",
  },
];

const sectionIds = [
  "overview",
  "user-management",
  "timetable-management",
  "reports",
  "department-management",
  "announcements",
  "settings",
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const timeSlots = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-01:00",
  "01:00-02:00",
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  const [selectedYear, setSelectedYear] = useState("1");
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [selectedSection, setSelectedSection] = useState("1");
  const [timetableData, setTimetableData] = useState([]); // fetched timetable
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableError, setTimetableError] = useState("");
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  const navigate = useNavigate();
  const authStore = useAuthStore();

  // User Management State
  const [userType, setUserType] = useState<UserRole>("STUDENT");
  const [users, setUsers] = useState<
    (
      | StudentProfile
      | FacultyProfile
      | AdminProfile
      | HODProfile
      | { [key: string]: unknown }
    )[]
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  // Add state for student year, branch, section
  const [studentYear, setStudentYear] = useState("1");
  const [studentBranch, setStudentBranch] = useState("CSE");
  const [studentSection, setStudentSection] = useState("1");

  // User Management Tab State
  const [userManagementTab, setUserManagementTab] = useState<
    "users" | "hod-assignments"
  >("users");

  // Modal state
  const [editUserModal, setEditUserModal] = useState<{
    open: boolean;
    user:
      | StudentProfile
      | FacultyProfile
      | AdminProfile
      | HODProfile
      | { [key: string]: unknown }
      | null;
  }>({ open: false, user: null });
  const [deleteUserModal, setDeleteUserModal] = useState<{
    open: boolean;
    user:
      | StudentProfile
      | FacultyProfile
      | AdminProfile
      | HODProfile
      | { [key: string]: unknown }
      | null;
  }>({ open: false, user: null });
  const [assignDeptModal, setAssignDeptModal] = useState<{
    open: boolean;
    user:
      | StudentProfile
      | FacultyProfile
      | AdminProfile
      | HODProfile
      | { [key: string]: unknown }
      | null;
  }>({ open: false, user: null });
  const [assignTeacherModal, setAssignTeacherModal] = useState<{
    open: boolean;
    user:
      | StudentProfile
      | FacultyProfile
      | AdminProfile
      | HODProfile
      | { [key: string]: unknown }
      | null;
  }>({ open: false, user: null });

  //load admin dashboard

  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const response = await apiClient.get("/dashboard/admin");
      const data = response.data;
      setAdminData(data.adminInfo);
      const newToken = response.headers["refreshedtoken"];
      localStorage.setItem("authToken", newToken);
      setDashboardLoaded(true);
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  // User Distribution State
  const [userCounts, setUserCounts] = useState({
    students: 0,
    faculty: 0,
    hods: 0,
  });

  useEffect(() => {
    if (!dashboardLoaded) return;
    let data = {};
    setLoadingUsers(true);
    if (userType == "STUDENT")
      data = {
        year: studentYear,
        department: studentBranch,
        section: studentSection,
      };
    authService
      .fetchUsersByRole(userType, data)
      .then(setUsers)
      .finally(() => setLoadingUsers(false));
  }, [userType, studentYear, studentBranch, studentSection, dashboardLoaded]);

  useEffect(() => {
    if (!dashboardLoaded) return;
    const fetchCounts = async () => {
      try {
        const students = await authService.fetchUsersByRole("STUDENT", {
          year: "",
          department: "",
          section: "",
        });
        const faculty = await authService.fetchUsersByRole("FACULTY", {});
        const hods = await authService.fetchUsersByRole("HOD", {});
        setUserCounts({
          students: students.length,
          faculty: faculty.length,
          hods: hods.length,
        });
      } catch (err) {
        setUserCounts({ students: 0, faculty: 0, hods: 0 });
      }
    };
    fetchCounts();
  }, [dashboardLoaded]);

  // Fetch timetable from backend when year, branch, or section changes
  useEffect(() => {
    if (!dashboardLoaded) return;
    async function fetchTimetable() {
      setTimetableLoading(true);
      setTimetableError("");
      setTimetableData([]);
      try {
        const res = await apiClient.get(
          `/userData/checkTimetable?department=${selectedBranch}&year=${selectedYear}&section=${selectedSection}`
        );
        if (
          res.data &&
          res.data.exists &&
          res.data.timetable &&
          res.data.timetable.timeSlots
        ) {
          setTimetableData(res.data.timetable.timeSlots);
        } else {
          setTimetableData([]);
        }
      } catch (err) {
        setTimetableError("Failed to fetch timetable.");
        setTimetableData([]);
      } finally {
        setTimetableLoading(false);
      }
    }
    fetchTimetable();
  }, [selectedYear, selectedBranch, selectedSection,dashboardLoaded

  ]);

  const timetablesByBranch = useMemo(() => {
    const filtered = timetableTable.filter((row) => row.year === selectedYear);
    return filtered.reduce((acc, row) => {
      const branch = row.class;
      if (!acc[branch]) {
        acc[branch] = [];
      }
      acc[branch].push(row);
      return acc;
    }, {});
  }, [selectedYear]);

  const branches = ["CSE", "ECE", "EEE", "MECH", "CSD", "CSM"];
  const sections = ["1", "2", "3"]; // You can adjust this as needed

  // Add state for dynamic department stats
  const [departmentStats, setDepartmentStats] = useState([]);
  const [departmentBarData, setDepartmentBarData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!dashboardLoaded) return;
    async function fetchDepartmentStats() {
      const stats = [];
      const studentCounts = [];
      for (const dept of branches) {
        // Fetch students in department
        let students = [];
        try {
          const res = await apiClient.get(
            `/userData/students?year=&department=${dept}&section=`
          );
          students = res.data.students || [];
        } catch (e) {
          students = [];
        }
        // Fetch HOD name (from department assignments)
        let hodName = "-";
        try {
          const res = await apiClient.get(`/department/assignments`);
          const assignments = res.data.assignments || [];
          const assignment = assignments.find((a) => a.department === dept);
          if (assignment && assignment.hod) {
            hodName = `${assignment.hod.firstName} ${assignment.hod.lastName}`;
          }
        } catch (e) {
          hodName = "-";
        }
        stats.push({
          department: dept,
          students: students.length,
          hod: hodName,
        });
        studentCounts.push(students.length);
      }
      setDepartmentStats(stats);
      setDepartmentBarData({
        labels: branches,
        datasets: [
          {
            label: "Students",
            data: studentCounts,
            backgroundColor: "#3b82f6",
          },
        ],
      });
    }
    fetchDepartmentStats();
  }, [dashboardLoaded]);

  const handleNavClick = (section) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTimetableEdit = () => {
    navigate("/admin/timetable");
  };

  const handleYearChange = (direction) => {
    const years = ["1", "2", "3", "4"];
    const currentIndex = years.indexOf(selectedYear);
    if (direction === "next") {
      const nextIndex = (currentIndex + 1) % years.length;
      setSelectedYear(years[nextIndex]);
    } else if (direction === "prev") {
      const prevIndex = (currentIndex - 1 + years.length) % years.length;
      setSelectedYear(years[prevIndex]);
    }
  };

  // Intersection Observer for active section
  useEffect(() => {
    if (!dashboardLoaded) return;
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new window.IntersectionObserver(
      observerCallback,
      observerOptions
    );
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [dashboardLoaded]);

  // Dynamically extract unique time slots from timetableData
  const dynamicTimeSlots = useMemo(() => {
    const slots = timetableData.map(
      (slot) => `${slot.startTime}-${slot.endTime}`
    );
    // Remove duplicates and sort by start time
    const unique = Array.from(new Set(slots));
    // Sort by start time (in minutes)
    unique.sort((a, b) => {
      const [aStart] = a.split("-");
      const [bStart] = b.split("-");
      const parse = (str) => {
        const [h, m] = str.split(":").map(Number);
        return h * 60 + m;
      };
      return parse(aStart) - parse(bStart);
    });
    return unique;
  }, [timetableData]);

  // Replace pieData with real-time data
  const pieData = useMemo(
    () => ({
      labels: ["Students", "Faculty", "HODs"],
      datasets: [
        {
          data: [userCounts.students, userCounts.faculty, userCounts.hods],
          backgroundColor: ["#3b82f6", "#f59e42", "#a855f7"],
          borderWidth: 1,
        },
      ],
    }),
    [userCounts]
  );

  const barData = {
    labels: ["CSE", "ECE", "MECH"],
    datasets: [
      {
        label: "Students",
        data: [320, 210, 180],
        backgroundColor: "#3b82f6",
      },
      {
        label: "Faculty",
        data: [20, 15, 12],
        backgroundColor: "#f59e42",
      },
    ],
  };

  // System stats for overview section
  const systemStats = [
    {
      title: "Total Users",
      value: (
        userCounts.students +
        userCounts.faculty +
        userCounts.hods
      ).toLocaleString(),
      change: "Total registered users",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Students",
      value: userCounts.students.toLocaleString(),
      change: "Current students",
      icon: <UserCheck className="h-4 w-4 text-blue-600" />,
    },
    {
      title: "Faculty Members",
      value: userCounts.faculty.toLocaleString(),
      change: "Current faculty",
      icon: <Users className="h-4 w-4 text-orange-500" />,
    },
    {
      title: "HODs",
      value: userCounts.hods.toLocaleString(),
      change: "Current HODs",
      icon: <Users className="h-4 w-4 text-purple-600" />,
    },
  ];
  if (loading) return (<div>Loading...</div>);
  if (!dashboardLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">
             OOps! something's wrong
          </div>
          <button
            onClick={() => {
              authStore.logout();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DashboardNav
        activeSection={activeSection}
        onNavClick={handleNavClick}
        dashboardType="admin"
      />
      <div className="max-w-6xl mx-auto py-6 px-4 space-y-10">
        {/* Admin Profile Section */}
        <section id="admin-profile" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <User className="w-6 h-6" /> Admin Profile
          </h2>
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
                    <span className="font-medium">Department:</span> IT
                    Management
                  </div>
                </div>
                <div className="mt-4 md:mt-6">
                  <Button
                    onClick={() => navigate("/profile")}
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
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" /> System Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {systemStats.map((stat) => (
              <div
                key={stat.title}
                className={`rounded-lg p-4 flex flex-col items-center bg-white shadow-sm`}
              >
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-lg font-bold">{stat.value}</span>
                <span className="text-xs text-gray-600 mt-1 text-center">
                  {stat.title}
                </span>
                <span className="text-xs text-gray-400 text-center">
                  {stat.change}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Department Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar
                  key={JSON.stringify(departmentBarData)}
                  data={departmentBarData}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${activity.bg}`}
                >
                  <div className="flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto flex-shrink-0">
                    {activity.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* User Management */}
        <section id="user-management" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" /> User Management
          </h2>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardContent className="p-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setUserManagementTab("users")}
                  className={`px-3 py-2 font-medium text-sm border-b-2 transition-colors ${
                    userManagementTab === "users"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setUserManagementTab("hod-assignments")}
                  className={`px-3 py-2 font-medium text-sm border-b-2 transition-colors ${
                    userManagementTab === "hod-assignments"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  HOD Assignments
                </button>
              </div>

              {/* Users Tab */}
              {userManagementTab === "users" && (
                <div>
                  <div className="mb-4 flex gap-2 items-center">
                    <label htmlFor="userType" className="font-semibold">
                      User Type:
                    </label>
                    <select
                      id="userType"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value as UserRole)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="HOD">HOD</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    {/* Show year, branch, section if Student is selected */}
                    {userType === "STUDENT" && (
                      <>
                        <label className="font-semibold ml-2">Year:</label>
                        <select
                          value={studentYear}
                          onChange={(e) => setStudentYear(e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                        <label className="font-semibold ml-2">Branch:</label>
                        <select
                          value={studentBranch}
                          onChange={(e) => setStudentBranch(e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="CSE">CSE</option>
                          <option value="ECE">ECE</option>
                          <option value="EEE">EEE</option>
                          <option value="MECH">MECH</option>
                          <option value="CSD">CSD</option>
                          <option value="CSM">CSM</option>
                        </select>
                        <label className="font-semibold ml-2">Section:</label>
                        <select
                          value={studentSection}
                          onChange={(e) => setStudentSection(e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          {/* Add more sections as needed */}
                        </select>
                      </>
                    )}
                  </div>
                  {loadingUsers ? (
                    <div>Loading...</div>
                  ) : (
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
                          {users.length > 0 ? (
                            users.map((user, idx) => {
                              const name =
                                "firstName" in user && "lastName" in user
                                  ? `${
                                      (
                                        user as
                                          | StudentProfile
                                          | FacultyProfile
                                          | HODProfile
                                      ).firstName
                                    } ${
                                      (
                                        user as
                                          | StudentProfile
                                          | FacultyProfile
                                          | HODProfile
                                      ).lastName
                                    }`
                                  : "name" in user
                                  ? (user as { name: string }).name
                                  : "";
                              const email =
                                "email" in user ? (user.email as string) : "";
                              const role =
                                "role" in user
                                  ? (user.role as string)
                                  : userType;
                              const status =
                                "status" in user
                                  ? (user.status as string)
                                  : "Active";
                              return (
                                <tr
                                  key={idx}
                                  className="border-b last:border-b-0"
                                >
                                  <td className="py-2 px-3">{name}</td>
                                  <td className="py-2 px-3">{email}</td>
                                  <td className="py-2 px-3">{role}</td>
                                  <td className="py-2 px-3">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        status === "Active"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {status}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 flex gap-2">
                                    <button
                                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                                      title="Edit"
                                      onClick={() =>
                                        setEditUserModal({ open: true, user })
                                      }
                                    >
                                      <span role="img" aria-label="Edit">
                                        ✏️
                                      </span>
                                    </button>
                                    <button
                                      className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                                      title="Delete"
                                      onClick={() =>
                                        setDeleteUserModal({ open: true, user })
                                      }
                                    >
                                      <span role="img" aria-label="Delete">
                                        🗑️
                                      </span>
                                    </button>
                                    {role === "HOD" && (
                                      <button
                                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                                        title="Assign Teacher"
                                        onClick={() =>
                                          setAssignTeacherModal({
                                            open: true,
                                            user,
                                          })
                                        }
                                      >
                                        Assign Teacher
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr className="border-b last:border-b-0">
                              <td colSpan={5} className="py-2 px-3 text-center">
                                No Users Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* HOD Assignments Tab */}
              {userManagementTab === "hod-assignments" && (
                <div>
                  <HODAssignmentManager />
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Timetable Management */}
        <div id="timetable-management" className="scroll-mt-24">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Timetable</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Redesigned Controls Row */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <label className="font-semibold" htmlFor="year-select">
                      Year:
                    </label>
                    <select
                      id="year-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="border rounded px-3 py-1 min-w-[90px] font-semibold focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="font-semibold" htmlFor="branch-select">
                      Branch:
                    </label>
                    <select
                      id="branch-select"
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="border rounded px-3 py-1 min-w-[90px] font-semibold focus:ring-2 focus:ring-blue-200"
                    >
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="font-semibold" htmlFor="section-select">
                      Section:
                    </label>
                    <select
                      id="section-select"
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="border rounded px-3 py-1 min-w-[90px] font-semibold focus:ring-2 focus:ring-blue-200"
                    >
                      {sections.map((section) => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate("/admin/timetable")}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg shadow font-semibold flex items-center gap-2"
                  >
                    <CalendarDays className="w-5 h-5" />
                    Create Timetable
                  </Button>
                  <Button
                    onClick={() =>
                      navigate(
                        `/admin/timetable?year=${selectedYear}&branch=${selectedBranch}&section=${selectedSection}`
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg shadow font-semibold flex items-center gap-2"
                  >
                    <CalendarDays className="w-5 h-5" />
                    Edit Timetable
                  </Button>
                </div>
              </div>
              {/* Timetable Table */}
              <div className="w-full">
                {timetableLoading ? (
                  <div className="text-center py-10 text-gray-500">
                    Loading timetable...
                  </div>
                ) : timetableError ? (
                  <div className="text-center py-10 text-red-500">
                    {timetableError}
                  </div>
                ) : timetableData.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No timetable found for {selectedBranch} Year {selectedYear}{" "}
                    Section {selectedSection}.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg text-sm border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-5 text-left border min-w-[120px] w-[140px]">
                            Time
                          </th>
                          {daysOfWeek.map((day) => (
                            <th
                              key={day}
                              className="py-2 px-3 text-center border min-w-[120px]"
                            >
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dynamicTimeSlots.map((slot) => {
                          const [start, end] = slot.split("-");
                          return (
                            <tr key={slot}>
                              <td className="py-2 px-5 font-semibold border bg-gray-50 min-w-[120px] w-[140px]">
                                {start} - {end}
                              </td>
                              {daysOfWeek.map((day) => {
                                const entry = timetableData.find(
                                  (e) =>
                                    e.day === day &&
                                    e.startTime === start &&
                                    e.endTime === end
                                );
                                return (
                                  <td
                                    key={day}
                                    className="py-2 px-3 text-center border h-20 align-top"
                                  >
                                    {entry ? (
                                      <div>
                                        <p className="font-semibold text-base">
                                          {entry.subject}
                                        </p>
                                        {typeof entry.facultyName ===
                                          "string" &&
                                        entry.facultyName.length > 0 &&
                                        !/^[0-9a-fA-F]{24}$/.test(
                                          entry.facultyName
                                        ) ? (
                                          <p className="text-xs text-gray-500 mt-1">
                                            {entry.facultyName}
                                          </p>
                                        ) : null}
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports */}
        <section id="reports" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="w-6 h-6" /> Reports
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card
                key={report.title}
                className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-start gap-4 border border-gray-100"
              >
                <span className="text-3xl">📊</span>
                <div className="font-semibold text-lg text-gray-900">
                  {report.title}
                </div>
                <div className="text-sm text-gray-700 flex-1">
                  {report.description}
                </div>
                <Button className="mt-2 w-full">Generate Report</Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Department Management */}
        <section id="department-management" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Department Management
          </h2>
          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-3">
            {departmentStats.map((dept, idx) => (
              <Card key={idx} className="p-4">
                <p className="font-bold text-lg">{dept.department}</p>
                <p className="text-sm">HOD: {dept.hod}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>
                    Students:{" "}
                    <span className="font-semibold">{dept.students}</span>
                  </span>
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
                  <th className="py-2 px-3 text-left">HOD</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-2 px-3">{dept.department}</td>
                    <td className="py-2 px-3">{dept.students}</td>
                    <td className="py-2 px-3">{dept.hod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Announcements */}
        <section id="announcements" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Megaphone className="w-6 h-6" /> Announcements
          </h2>
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
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6" /> Settings
          </h2>
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

      {/* Edit User Modal */}
      <Dialog
        open={editUserModal.open}
        onOpenChange={(open) =>
          setEditUserModal({ open, user: open ? editUserModal.user : null })
        }
      >
        <DialogContent>
          <DialogTitle>Edit User</DialogTitle>
          {/* TODO: Add edit user form here */}
          <DialogFooter>
            <button
              onClick={() => setEditUserModal({ open: false, user: null })}
            >
              Cancel
            </button>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete User Modal */}
      <Dialog
        open={deleteUserModal.open}
        onOpenChange={(open) =>
          setDeleteUserModal({ open, user: open ? deleteUserModal.user : null })
        }
      >
        <DialogContent>
          <DialogTitle>Delete User</DialogTitle>
          <p>Are you sure you want to delete this user?</p>
          <DialogFooter>
            <button
              onClick={() => setDeleteUserModal({ open: false, user: null })}
            >
              Cancel
            </button>
            <button>Delete</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Assign Department Modal (for HOD) */}
      <Dialog
        open={assignDeptModal.open}
        onOpenChange={(open) =>
          setAssignDeptModal({ open, user: open ? assignDeptModal.user : null })
        }
      >
        <DialogContent>
          <DialogTitle>Assign Department to HOD</DialogTitle>
          <p className="text-gray-600 mb-4">
            Use the dedicated HOD Management section above for assigning
            departments to HODs.
          </p>
          <DialogFooter>
            <button
              onClick={() => setAssignDeptModal({ open: false, user: null })}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Assign Teacher Modal (for HOD) */}
      <Dialog
        open={assignTeacherModal.open}
        onOpenChange={(open) =>
          setAssignTeacherModal({
            open,
            user: open ? assignTeacherModal.user : null,
          })
        }
      >
        <DialogContent>
          <DialogTitle>Assign Teacher to Class/Subject</DialogTitle>
          {/* TODO: Add teacher, class, subject dropdowns here */}
          <DialogFooter>
            <button
              onClick={() => setAssignTeacherModal({ open: false, user: null })}
            >
              Cancel
            </button>
            <button>Assign</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
