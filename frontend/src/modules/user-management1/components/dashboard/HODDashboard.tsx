import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/common/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/common/components/ui/table";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import DashboardLayout from "@/common/components/dashboard/DashboardLayout";
import DashboardNav from "@/modules/user-management1/components/dashboard/DashboardNav";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Building2,
  BookOpen,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart2,
  ClipboardList,
  CalendarDays,
  FileBarChart2,
  Bell,
  UserCog,
  Loader2,
} from "lucide-react";
import apiClient from "@/api";
import { toast } from "@/common/hooks/use-toast";

// Mock Data
const summaryCards = [
  {
    label: "Total Students",
    value: 245,
    sub: "Active enrollments",
    icon: <Users className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    label: "Faculty Members",
    value: 18,
    sub: "Teaching staff",
    icon: <User className="w-5 h-5" />,
    color: "bg-green-100 text-green-800 border-green-300",
  },
  {
    label: "Active Subjects",
    value: 24,
    sub: "Current semester",
    icon: <BookOpen className="w-5 h-5" />,
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  {
    label: "Pending Approvals",
    value: 7,
    sub: "Requires attention",
    icon: <ClipboardList className="w-5 h-5" />,
    color: "bg-red-100 text-red-800 border-red-300",
  },
];

const recentActivities = [
  {
    title: "Leave Approval",
    desc: `Approved Dr. Smith's sick leave`,
    status: "completed",
    time: "2 hours ago",
  },
  {
    title: "Subject Assignment",
    desc: "Assigned Data Structures to Prof. Wilson",
    status: "completed",
    time: "4 hours ago",
  },
  {
    title: "Faculty Evaluation",
    desc: "Performance review for Dr. Brown",
    status: "pending",
    time: "1 day ago",
  },
  {
    title: "Report Generation",
    desc: "Monthly department report",
    status: "completed",
    time: "2 days ago",
  },
];

const pendingApprovals = [
  {
    type: "Leave Request",
    name: "Dr. Michael Smith",
    detail: "Medical Leave - 3 days",
    date: "2024-01-15",
    action: undefined,
  },
  {
    type: "Subject Assignment",
    name: "Prof. Lisa Wilson",
    detail: "Advanced Algorithms",
    date: "2024-01-14",
    action: undefined,
  },
  {
    type: "Timetable Change",
    name: "Dr. Robert Brown",
    detail: "Database Systems",
    date: "2024-01-13",
    action: undefined,
  },
];

const hodProfile = {
  employeeId: "HOD2024-001",
  name: "Dr. Priya Sharma",
  department: "Computer Science & Engineering",
  officialEmail: "priya.sharma@university.edu",
  personalEmail: "priya.sharma@gmail.com",
  phone: "+91 98765 43210",
  address: "123, University Road, City, State, 123456",
};

const facultyPerformance = [
  {
    name: "Dr. Michael Smith",
    rating: 4.8,
    badge: "Excellent",
    subjects: "AI, ML",
    students: 120,
  },
  {
    name: "Prof. Lisa Wilson",
    rating: 4.5,
    badge: "Very Good",
    subjects: "Algorithms",
    students: 90,
  },
  {
    name: "Dr. Robert Brown",
    rating: 4.1,
    badge: "Good",
    subjects: "DBMS",
    students: 80,
  },
  {
    name: "Dr. Emily Clark",
    rating: 3.7,
    badge: "Average",
    subjects: "Networks",
    students: 70,
  },
];

const studentPerformance = [
  { semester: "Semester 1", passRate: 92, failRate: 8 },
  { semester: "Semester 2", passRate: 89, failRate: 11 },
  { semester: "Semester 3", passRate: 94, failRate: 6 },
  { semester: "Semester 4", passRate: 90, failRate: 10 },
];

const badgeColor = (badge) => {
  switch (badge) {
    case "Excellent":
      return "bg-green-600 text-white";
    case "Very Good":
      return "bg-blue-600 text-white";
    case "Good":
      return "bg-yellow-500 text-white";
    case "Average":
      return "bg-gray-400 text-white";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const statusColor = (status) =>
  status === "completed"
    ? "bg-green-600 text-white"
    : "bg-yellow-400 text-black";

const HODDashboard = ({ isHOD = true }) => {
  const navigate = useNavigate();
  // Section refs for scroll navigation
  const dashboardRef = useRef(null);
  const userManagementRef = useRef(null);
  const teacherAssignmentRef = useRef(null);
  const timetableRef = useRef(null);
  const attendanceRef = useRef(null);
  const examsRef = useRef(null);
  const resultsRef = useRef(null);
  const announcementsRef = useRef(null);

  const [activeSection, setActiveSection] = useState("dashboard");
  const [activities, setActivities] = useState(recentActivities);
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAnnouncementTab, setShowAnnouncementTab] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [userTypeFilter, setUserTypeFilter] = useState("all"); // 'all', 'faculty', 'students'
  const yearOptions = [1, 2, 3, 4];

  // Teacher Assignment State
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedAssignmentYear, setSelectedAssignmentYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  /**
   * use effect for fetching assignments
   */
  const fetchAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const response = await apiClient.get("/userData/assignedSubjectsAndFaculties")
      if (response.data.success) {
        setAssignments(response.data.assignedSubjects);
      } else {
        toast({
          title: "Hey check this !!",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        title: "Failed to fetch assignments",
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setLoadingAssignments(false);
    }
  }
  useEffect(() => {
    fetchAssignments();
  }, [])



  // Mock data for dropdowns
  const facultyList = [
    "Dr. Michael Smith",
    "Prof. Lisa Wilson",
    "Dr. Robert Brown",
    "Dr. Emily Clark",
    "Prof. James Davis",
    "Dr. Sarah Johnson",
  ];

  const subjectsList = [
    "Data Structures",
    "Advanced Algorithms",
    "Database Systems",
    "Computer Networks",
    "Operating Systems",
    "Software Engineering",
    "Machine Learning",
    "Artificial Intelligence",
  ];

  const semesterList = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const sectionsList = ["1", "2", "3"];
  const yearsList = ["1", "2", "3", "4"];

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

  // Define sectionContent inside the component to access isHOD
  const sectionContent = {
    dashboard: (
      <>
        {/* Overview content (summary cards, activities, approvals) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryCards.map((card) => (
            <Card
              key={card.label}
              className={`flex flex-col items-start gap-2 shadow hover:shadow-lg transition-shadow border ${card.color} bg-white dark:bg-neutral-800`}
            >
              <CardContent className="flex flex-col gap-1 p-4 w-full">
                <div className="flex items-center gap-2 text-xs sm:text-sm mb-1">
                  {card.icon}
                  {card.label}
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {card.value}
                </div>
                <div className="text-xs sm:text-sm opacity-70">{card.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="bg-white dark:bg-neutral-800">
            <CardContent className="p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" /> Recent Activities
              </h2>
              <div className="space-y-4">
                {recentActivities.map((act, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-neutral-700 rounded p-3 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium text-sm md:text-base text-gray-900 dark:text-white">
                        {act.title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {act.desc}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                          act.status
                        )}`}
                      >
                        {act.status}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-400 mt-1">
                        {act.time}
                      </span>
                      {/* Only HOD can update status */}
                      {isHOD && (
                        <Button size="sm" className="mt-2" variant="outline">
                          Update Status
                        </Button>
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
              <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Pending Approvals
              </h2>
              <div className="space-y-4">
                {pendingApprovals.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-neutral-700 rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 transition-colors"
                  >
                    <div>
                      <span className="inline-block bg-gray-200 dark:bg-neutral-600 text-xs px-2 py-0.5 rounded mb-1 text-gray-700 dark:text-gray-200">
                        {item.type}
                      </span>
                      <div className="font-medium text-sm md:text-base text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {item.detail}
                      </div>
                    </div>
                    <div className="w-full flex flex-row justify-between items-center mt-2 md:mt-0 md:w-auto md:flex-col md:items-end md:gap-2">
                      <span className="text-xs sm:text-sm text-gray-400">
                        {item.date}
                      </span>
                      {/* Only HOD can approve/reject */}
                      {isHOD && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900"
                          >
                            Reject
                          </Button>
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
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5" /> Timetable
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
          <table className="min-w-full text-xs sm:text-sm text-center">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200 text-left">
                  Time
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Monday
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Tuesday
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Wednesday
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Thursday
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Friday
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Saturday
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  8:00 AM
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    MECH - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  9:00 AM
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    ECE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    ECE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    ECE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    ECE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  10:00 AM
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    EEE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    EEE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    EEE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    MECH - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    EEE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  11:00 AM
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    MECH - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    ECE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    EEE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  12:00 PM
                </td>
                <td>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Meeting
                  </span>
                </td>
                <td>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Meeting
                  </span>
                </td>
                <td>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Meeting
                  </span>
                </td>
                <td>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Meeting
                  </span>
                </td>
                <td>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Meeting
                  </span>
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  1:00 PM
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    MECH - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE -
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    MECH - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  2:00 PM
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    CSE - Chemistry
                  </span>
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    EEE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    EEE - Physics
                  </span>
                </td>
                <td>
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                    Rest
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-gray-500 dark:text-gray-300 mt-4">
          Timetable management and view goes here.
        </div>
      </div>
    ),
    attendance: (
      <div className="p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Attendance
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Attendance management and analytics go here.
        </div>
      </div>
    ),
    exams: (
      <div className="p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Exams
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Exam schedules, results, and management go here.
        </div>
        <div className="mt-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary">
            Exam Dates
          </h3>
          <table className="min-w-[300px] text-xs sm:text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                  Exam
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3">Mid 1</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">July 15, 2025</td>
              </tr>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3">Mid 2</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">August 20, 2025</td>
              </tr>
              <tr>
                <td className="px-3 py-2 sm:px-4 sm:py-3">Semester Exam</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  September 25, 2025
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    results: (
      <div className="p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5" /> Results
        </h2>
        <div className="text-gray-500 dark:text-gray-300">
          Results analytics and reports go here.
        </div>
      </div>
    ),
    announcements: (
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2>Announcements</h2>
          <Button
            className="ml-auto bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors text-sm font-medium"
            onClick={() => setShowAnnouncementTab(true)}
          >
            Make Announcement
          </Button>
        </div>
        {showAnnouncementTab ? (
          <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 mb-4 flex flex-col gap-3 border border-primary/30">
            <textarea
              className="w-full min-h-[80px] rounded border border-gray-300 dark:border-neutral-600 p-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your announcement here..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
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
                onClick={() => {
                  setShowAnnouncementTab(false);
                  setAnnouncementText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Department announcements and notifications go here.
        </div>
      </div>
    ),
  };

  // Scroll to section on nav click
  const sectionRefs = {
    dashboard: dashboardRef,
    "user-management": userManagementRef,
    "teacher-assignment": teacherAssignmentRef,
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
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { section: "dashboard", ref: dashboardRef },
        { section: "user-management", ref: userManagementRef },
        { section: "teacher-assignment", ref: teacherAssignmentRef },
        { section: "timetable", ref: timetableRef },
        { section: "attendance", ref: attendanceRef },
        { section: "exams", ref: examsRef },
        { section: "results", ref: resultsRef },
        { section: "announcements", ref: announcementsRef },
      ];
      const scrollPosition = window.scrollY + 120;
      let current = "dashboard";
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Teacher Assignment Handlers
  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    if (
      selectedFaculty &&
      selectedSubject &&
      selectedAssignmentYear &&
      selectedSemester &&
      selectedSection
    ) {
      // Reset form
      setSelectedFaculty("");
      setSelectedSubject("");
      setSelectedAssignmentYear("");
      setSelectedSemester("");
      setSelectedSection("");
      setIsClassTeacher(false);
      setShowAssignmentForm(false);
    }
  };

  const handleDeleteAssignment = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  const handleEditAssignment = (assignment) => {
    setSelectedFaculty(assignment.faculty);
    setSelectedSubject(assignment.subject);
    setSelectedAssignmentYear(assignment.year);
    setSelectedSemester(assignment.semester);
    setSelectedSection(assignment.section);
    setIsClassTeacher(assignment.isClassTeacher);
    setShowAssignmentForm(true);
    // Remove the assignment being edited
    setAssignments(assignments.filter((a) => a.id !== assignment.id));
  };

  // Handler to update activity status
  const handleUpdateStatus = (idx) => {
    setActivities((prev) =>
      prev.map((act, i) =>
        i === idx
          ? {
            ...act,
            status: act.status === "pending" ? "completed" : "pending",
          }
          : act
      )
    );
  };

  // Handler to approve/reject
  const handleApprovalAction = (idx, action) => {
    setApprovals((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, action } : item))
    );
  };

  // Ensure all approval items have an 'action' property in state, but not in the initial data
  // When mapping approvals, default to item.action if present, else undefined
  const approvalsWithAction = approvals.map((item) => ({
    ...item,
    action: item.action ?? undefined,
  }));

  /**---------------------------------
   * fetch data for subject assignment form
   */
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);

  /**
   * fetch faculties on focus of faculty field
   * in subject assignment form
   */

  const handleFacultyFocus = async () => {
    if (faculties.length > 0) return;
    const res = await apiClient.get("/userData/faculties");
    setFaculties(res.data.facultyNames);
  };

  // Fetch subjects after year & semester are selected and subject field is focused
  const handleSubjectFocus = async () => {
    if (subjects.length > 0) return;
    if (selectedYear && selectedSemester) {
      const res = await apiClient.get(
        `/subjectData/subjects?department=CSE&year=${Number(selectedAssignmentYear)}&semester=${Number(selectedSemester)}`
      );
      setSubjects(res.data.subjects);
    }
  };

  // Assign subject to faculty
  const handleAssign = async () => {
    try {
      const res = await apiClient.post("/subjectData/assignSubject", {
        subjectId: selectedSubject,
        facultyId: selectedFaculty,
        section: Number(selectedSection),
      });

      if (res.data.success) {
        toast({ title: "Subject assigned successfully", variant: "default" });
        fetchAssignments();
      } else {
        toast({ title: res.data.message || "Assignment failed", variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Assignment failed",
        description:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-4/4 mx-auto sm:w-full sm:max-w-7xl py-6 px-4 sm:px-6 lg:px-8 dark:bg-neutral-900 min-h-screen transition-colors flex">
      <DashboardNav
        activeSection={activeSection}
        onNavClick={handleNavClick}
        dashboardType="hod"
      />
      <div className="flex-1 w-full ml-0 md:ml-40">
        {" "}
        {/* Ensure inner div takes full width of its parent */}
        {/* Remove DashboardLayout if it adds extra space */}
        {/* <DashboardLayout /> */}
        <div className="p-4 sm:p-6 space-y-8 md:space-y-10">
          {/* Profile Section at the top (not in nav, always visible) */}
          <section className="scroll-mt-24 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
              <User className="w-6 h-6" /> Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-neutral-800 w-full">
                <CardContent className="p-4 md:p-6 flex flex-col gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2">
                    <User className="w-5 h-5" /> Primary Information
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Badge
                        variant="secondary"
                        className="bg-gray-200 dark:bg-neutral-700 text-sm"
                      >
                        <Building2 className="w-4 h-4 mr-1 inline" />{" "}
                        {hodProfile.department}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <span className="font-medium text-xs sm:text-sm">
                        Employee ID:
                      </span>{" "}
                      <span className="text-xs sm:text-sm">
                        {hodProfile.employeeId}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200">
                      <span className="font-medium text-xs sm:text-sm">
                        Name:
                      </span>{" "}
                      <span className="text-xs sm:text-sm">
                        {hodProfile.name}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => navigate('/profile')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium"
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-neutral-800 w-full">
                <CardContent className="p-4 md:p-6 flex flex-col gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5" /> Contact Information
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      <Mail className="w-4 h-4" />{" "}
                      <span className="font-medium">Official Email:</span>{" "}
                      {hodProfile.officialEmail}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      <Mail className="w-4 h-4" />{" "}
                      <span className="font-medium">Personal Email:</span>{" "}
                      {hodProfile.personalEmail}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      <Phone className="w-4 h-4" />{" "}
                      <span className="font-medium">Phone:</span>{" "}
                      {hodProfile.phone}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      <MapPin className="w-4 h-4" />{" "}
                      <span className="font-medium">Address:</span>{" "}
                      {hodProfile.address}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dashboard Section */}
          <section
            ref={dashboardRef}
            id="dashboard"
            className="scroll-mt-24 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {summaryCards.map((card) => (
                <Card
                  key={card.label}
                  className={`flex flex-col items-start gap-2 shadow hover:shadow-lg transition-shadow border ${card.color} bg-white dark:bg-neutral-800`}
                >
                  <CardContent className="flex flex-col gap-1 p-4 w-full">
                    <div className="flex items-center gap-2 text-xs sm:text-sm mb-1">
                      {card.icon}
                      {card.label}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold ">
                      {card.value}
                    </div>
                    <div className="text-xs sm:text-sm opacity-70">
                      {card.sub}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-neutral-800">
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" /> Recent Activities
                  </h3>
                  <div className="space-y-4">
                    {activities.map((act, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-neutral-700 rounded p-3 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-medium text-sm md:text-base text-gray-900 dark:text-white">
                            {act.title}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                            {act.desc}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                              act.status
                            )}`}
                          >
                            {act.status}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-400 mt-1">
                            {act.time}
                          </span>
                          {/* Only HOD can update status */}
                          {isHOD && (
                            <Button
                              size="sm"
                              className="mt-2"
                              variant="outline"
                              onClick={() => handleUpdateStatus(idx)}
                            >
                              Mark as{" "}
                              {act.status === "pending"
                                ? "Completed"
                                : "Pending"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-neutral-800">
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Pending Approvals
                  </h3>
                  <div className="space-y-4">
                    {approvalsWithAction.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-neutral-700 rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 transition-colors"
                      >
                        <div>
                          <span className="inline-block bg-gray-200 dark:bg-neutral-600 text-xs px-2 py-0.5 rounded mb-1 text-gray-700 dark:text-gray-200">
                            {item.type}
                          </span>
                          <div className="font-medium text-sm md:text-base text-gray-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                            {item.detail}
                          </div>
                        </div>
                        <div className="w-full flex flex-row justify-between items-center mt-2 md:mt-0 md:w-auto md:flex-col md:items-end md:gap-2">
                          <span className="text-xs sm:text-sm text-gray-400">
                            {item.date}
                          </span>
                          {/* Only HOD can approve/reject */}
                          {isHOD && !item.action && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() =>
                                  handleApprovalAction(idx, "approved")
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900"
                                onClick={() =>
                                  handleApprovalAction(idx, "rejected")
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {isHOD && item.action && (
                            <div className="flex gap-2 items-center">
                              {item.action === "approved" && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                                  Approved
                                </span>
                              )}
                              {item.action === "rejected" && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                                  Rejected
                                </span>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="ml-2"
                                onClick={() =>
                                  handleApprovalAction(idx, undefined)
                                }
                              >
                                Edit
                              </Button>
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

          {/* User Management Section */}
          <section
            ref={userManagementRef}
            id="user-management"
            className="scroll-mt-24 space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" /> User Management
            </h2>

            {/* Faculty Management Card */}
            <Card className="bg-white dark:bg-neutral-800">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                  <UserCog className="w-5 h-5" /> Faculty Management
                </h3>
                {/* Unified Table for all screen sizes, scrollable on small screens */}
                <div className="overflow-x-auto">
                  <Table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 text-left font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 text-left font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Rating
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 text-left font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Performance
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 text-left font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Subjects
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 text-left font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Students
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 text-center font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200">
                      {facultyPerformance.map((f, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 align-middle text-left text-xs sm:text-sm">
                            {f.name}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 align-middle text-left text-xs sm:text-sm">
                            {f.rating.toFixed(1)}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 align-middle text-left">
                            <Badge className={`${badgeColor(f.badge)} text-xs`}>
                              {f.badge}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 align-middle text-left text-xs sm:text-sm">
                            {f.subjects}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 align-middle text-left text-xs sm:text-sm">
                            {f.students}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/6 align-middle text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-primary/10"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Student Management Card */}
            <Card className="bg-white dark:bg-neutral-800">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Student Management
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="year-select"
                      className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Year:
                    </label>
                    <select
                      id="year-select"
                      className="ml-2 border border-gray-300 dark:border-neutral-600 rounded px-2 py-1 text-xs sm:text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                      {yearOptions.map((year) => (
                        <option
                          key={year}
                          value={year}
                          className="text-xs sm:text-sm"
                        >
                          {year} Year
                        </option>
                      ))}
                    </select>
                  </div>
                </h3>
                {/* Unified Table for all screen sizes, scrollable on small screens */}
                <div className="overflow-x-auto">
                  <Table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 ">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/4 text-left font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Semester
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/4 text-left font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Pass Rate
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/4 text-left font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Fail Rate
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 w-1/4 text-center font-bold text-primary text-xs sm:text-sm md:text-base"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                      {studentPerformance.map((s, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/4 align-middle text-left text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                            {s.semester}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/4 align-middle text-left">
                            <Badge className="bg-green-600 text-white text-xs">
                              {s.passRate}%
                            </Badge>
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/4 align-middle text-left">
                            <Badge className="bg-red-500 text-white text-xs">
                              {s.failRate}%
                            </Badge>
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 w-1/4 align-middle text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-primary/10 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200"
                            >
                              Report
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Teacher Assignment Section */}
          <section
            ref={teacherAssignmentRef}
            id="teacher-assignment"
            className="scroll-mt-24 space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
              <UserCog className="w-6 h-6" /> Teacher Assignment
            </h2>

            <Card className="bg-white dark:bg-neutral-800">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Subject Assignments
                  </h3>
                  <Button
                    onClick={() => setShowAssignmentForm(true)}
                    className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Assign Teacher
                  </Button>
                </div>

                {/* Assignment Form */}
                {showAssignmentForm && (
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 mb-6 border border-primary/30">
                    <h4 className="text-base font-semibold mb-4">
                      New Teacher Assignment
                    </h4>
                    <form
                      onSubmit={handleAssignmentSubmit}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Faculty
                        </label>
                        <select
                          value={selectedFaculty}
                          onChange={(e) => setSelectedFaculty(e.target.value)}
                          onFocus={handleFacultyFocus}
                          className="w-full border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select Faculty</option>
                          {faculties.map((f) => (
                            <option key={f.Id} value={f.Id}>
                              {f.firstName} {f.lastName} ({f.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Year
                        </label>
                        <select
                          value={selectedAssignmentYear}
                          onChange={(e) =>
                            setSelectedAssignmentYear(e.target.value)
                          }
                          className="w-full border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select Year</option>
                          {yearsList.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Semester
                        </label>
                        <select
                          value={selectedSemester}
                          onChange={(e) => setSelectedSemester(e.target.value)}
                          className="w-full border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select Semester</option>
                          {semesterList.map((semester) => (
                            <option key={semester} value={semester}>
                              {semester}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Subject
                        </label>
                        <select
                          value={selectedSubject}
                          onFocus={handleSubjectFocus}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          className="w-full border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={!selectedYear || !selectedSemester}
                          required
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name} ({s.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Section
                        </label>
                        <select
                          value={selectedSection}
                          onChange={(e) => setSelectedSection(e.target.value)}
                          className="w-full border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select Section</option>
                          {sectionsList.map((section) => (
                            <option key={section} value={section}>
                              {section}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="classTeacher"
                          checked={isClassTeacher}
                          onChange={(e) => setIsClassTeacher(e.target.checked)}
                          className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor="classTeacher"
                          className="text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                          Class Teacher
                        </label>
                      </div>

                      <div className="md:col-span-2 lg:col-span-3 flex gap-2 justify-end">
                        <Button
                          type="submit"
                          onClick={handleAssign}
                          className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors text-sm font-medium"
                          disabled={
                            !selectedFaculty ||
                            !selectedSubject ||
                            !selectedAssignmentYear ||
                            !selectedSemester ||
                            !selectedSection
                          }
                        >
                          Assign Teacher
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowAssignmentForm(false);
                            setSelectedFaculty("");
                            setSelectedSubject("");
                            setSelectedAssignmentYear("");
                            setSelectedSemester("");
                            setSelectedSection("");
                            setIsClassTeacher(false);
                          }}
                          className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-neutral-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Assignments Table */}
                <div className="overflow-x-auto">
                  {loadingAssignments ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (

                    <Table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                      <thead className="bg-gray-100 dark:bg-neutral-800">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-4 sm:py-3 text-left font-bold text-primary text-xs sm:text-sm"
                          >
                            Faculty
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-4 sm:py-3 text-left font-bold text-primary text-xs sm:text-sm"
                          >
                            Subject
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-4 sm:py-3 text-left font-bold text-primary text-xs sm:text-sm"
                          >
                            Year
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-4 sm:py-3 text-left font-bold text-primary text-xs sm:text-sm"
                          >
                            Semester
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-4 sm:py-3 text-left font-bold text-primary text-xs sm:text-sm"
                          >
                            Section
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-4 sm:py-3 text-left font-bold text-primary text-xs sm:text-sm"
                          >
                            Class Teacher
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-4 sm:py-3 text-left font-bold text-primary text-xs sm:text-sm"
                          >
                            Assigned Date
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-4 sm:py-3 text-center font-bold text-primary text-xs sm:text-sm"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                        {assignments.map((assignment) => (
                          <tr
                            key={assignment.id}
                            className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                          >
                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                              {assignment.faculty_name}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                              {assignment.subject_name}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                              {assignment.year}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                              {assignment.semester}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                              {assignment.section}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                              {assignment.isClassTeacher ? (
                                <Badge className="bg-green-600 text-white text-xs">
                                  Yes
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-400 text-white text-xs">
                                  No
                                </Badge>
                              )}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                              {assignment.assignment_date.split("T")[0]}
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-center">
                              <div className="flex gap-2 justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  // onClick={() => handleEditAssignment(assignment)}
                                  className="hover:bg-primary/10 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200"
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  // onClick={() =>
                                  //   handleDeleteAssignment(assignment.id)
                                  // }
                                  className="hover:bg-red-100 dark:hover:bg-red-900 border-red-300 dark:border-red-600 text-red-700 dark:text-red-200"
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Timetable Section */}
          <section ref={timetableRef} id="timetable" className="scroll-mt-24">
            <Card className="bg-white dark:bg-neutral-800 mb-6">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" /> Timetable
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
                  <table className="min-w-full text-xs sm:text-sm text-center">
                    <thead className="bg-gray-50 dark:bg-neutral-800">
                      <tr>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200 text-left">
                          Time
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                          Monday
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                          Tuesday
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                          Wednesday
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                          Thursday
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                          Friday
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-700 dark:text-gray-200">
                          Saturday
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                          8:00 AM
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            MECH - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                          9:00 AM
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            ECE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            ECE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            ECE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            ECE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                          10:00 AM
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            EEE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            EEE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            EEE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            MECH - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            EEE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                          11:00 AM
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            MECH - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            ECE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            EEE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                          12:00 PM
                        </td>
                        <td>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Meeting
                          </span>
                        </td>
                        <td>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Meeting
                          </span>
                        </td>
                        <td>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Meeting
                          </span>
                        </td>
                        <td>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Meeting
                          </span>
                        </td>
                        <td>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Meeting
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                          1:00 PM
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            MECH - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE -
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            MECH - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                          2:00 PM
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            CSE - Chemistry
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            EEE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                        <td>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            EEE - Physics
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            Rest
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-4">
                  Timetable management and view goes here.
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Exams Section */}
          <section ref={examsRef} id="exams" className="scroll-mt-24">
            <Card className="bg-white dark:bg-neutral-800 mb-6">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Exams
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  Exam schedules, results, and management go here.
                </div>
                <div className="mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary">
                    Exam Dates
                  </h3>
                  <table className="min-w-[300px] text-xs sm:text-sm border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                      <tr>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                          Exam
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3">Mid 1</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          July 15, 2025
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3">Mid 2</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          August 20, 2025
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          Semester Exam
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                          September 25, 2025
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Announcements Section */}
          <section
            ref={announcementsRef}
            id="announcements"
            className="scroll-mt-24"
          >
            <Card className="bg-white dark:bg-neutral-800 mb-6">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h2>Announcements</h2>
                  <Button
                    className="ml-auto mb-2 bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors text-sm font-medium"
                    onClick={() => setShowAnnouncementTab(true)}
                  >
                    Make Announcement
                  </Button>
                </div>
                {showAnnouncementTab ? (
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 mb-4 flex flex-col gap-3 border border-primary/30">
                    <textarea
                      className="w-full min-h-[80px] rounded border border-gray-300 dark:border-neutral-600 p-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Write your announcement here..."
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
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
                        onClick={() => {
                          setShowAnnouncementTab(false);
                          setAnnouncementText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  Department announcements and notifications go here.
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;
