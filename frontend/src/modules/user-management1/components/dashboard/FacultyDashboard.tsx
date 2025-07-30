import React, { useRef, useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import {
  Edit,
  BookOpen,
  Calendar,
  Megaphone,
  Bell,
  Moon,
  Search,
  Menu,
  Award,
  Users,
  FileText,
  BarChart2,
  CheckSquare,
  Settings,
  Home,
  HelpCircle,
} from "lucide-react";
import dayjs from "dayjs";
import apiClient from "@/api";
import { Button } from "@/common/components/ui/button";
import { format } from "date-fns"; // Add this import at the top if you have date-fns installed
import { ChartOptions } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import DashboardNav from "./DashboardNav";
import { toast } from "@/common/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/common/components/ui/avatar";

type FacultyDataItem = {
  subject: {
    id: string;
    name: string;
    department: string;
    year: string;
  };
  section: string;
  students: {
    id: string;
    name: string;
    rollNumber?: string;
  }[];
};

type AttendanceStudent = {
  studentId: string;
  name: string;
  rollNumber?: string;
  status?: string;
};

// Mock Attendance Data
const attendanceData = [
  { label: "Class A", attended: 18, total: 20 },
  { label: "Class B", attended: 12, total: 15 },
  { label: "Class C", attended: 8, total: 10 },
];

// Attendance Graph Component
const AttendanceGraph = () => {
  const chartData = {
    labels: attendanceData.map((item) => item.label),
    datasets: [
      {
        label: "Attendance",
        data: attendanceData.map((item) => (item.attended / item.total) * 100),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  // Chart options
  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255,255,255,0.1)", // lighter grid in dark mode
        },
        ticks: {
          callback: (v) => `${v}%`,
          font: { size: 11 },
          color: "#6b7280", // white in dark mode
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          font: { size: 11 },
          color: "#6b7280", // white in dark mode
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
    labels: ["Boys", "Girls"],
    datasets: [
      {
        data: [45414, 40270],
        backgroundColor: ["#3b82f6", "#f472b6"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: {
            label: string;
            parsed: number;
            dataset: { data: number[] };
          }) => {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${
              context.label
            }: ${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-48 flex items-center justify-center">
      <Pie data={data} options={options} />
    </div>
  );
};

// Helper to generate roll numbers in format "23815A0405"
const getRollNo = (id: string | number) => {
  return `23815A04${id.toString().padStart(2, "0")}`;
};

const AttendanceSwitch = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative w-10 h-6 rounded-full transition-colors duration-200 outline-none border-2 flex items-center ${
      checked ? "bg-green-400 border-green-400" : "bg-gray-200 border-gray-300"
    }`}
    aria-pressed={checked}
    aria-label={checked ? "Present" : "Absent"}
    disabled={disabled}
  >
    <span
      className={`absolute left-0 top-0 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? "translate-x-4" : "translate-x-1"
      }`}
    />
  </button>
);

// Example students for each class

// Example: Faculty's teaching timetable (now with department names instead of 1A, 2A, etc.)
const facultyTimetable = [
  // Each array represents a day (Monday to Saturday)
  [
    { time: "8:00 AM", class: "CSE", subject: "Physics" },
    { time: "9:00 AM", class: "ECE", subject: "Physics" },
    { time: "10:00 AM", class: "EEE", subject: "Physics" },
    { time: "11:00 AM", rest: true },
    { time: "1:00 PM", class: "MECH", subject: "Chemistry" },
    { time: "2:00 PM", class: "CSE", subject: "Chemistry" },
  ],
  [
    { time: "8:00 AM", class: "CSE", subject: "Chemistry" },
    { time: "9:00 AM", class: "EEE", subject: "Physics" },
    { time: "10:00 AM", class: "ECE", subject: "Physics" },
    { time: "11:00 AM", class: "MECH", subject: "Physics" },
    { time: "1:00 PM", class: "CSE", subject: "" },
    { time: "2:00 PM", rest: true },
  ],
  [
    { time: "8:00 AM", class: "MECH", subject: "Chemistry" },
    { time: "9:00 AM", class: "CSE", subject: "Physics" },
    { time: "10:00 AM", class: "EEE", subject: "Physics" },
    { time: "11:00 AM", class: "ECE", subject: "Physics" },
    { time: "1:00 PM", class: "CSE", subject: "Chemistry" },
    { time: "2:00 PM", class: "EEE", subject: "Physics" },
  ],
  [
    { time: "8:00 AM", class: "CSE", subject: "Chemistry" },
    { time: "9:00 AM", class: "ECE", subject: "Physics" },
    { time: "10:00 AM", class: "MECH", subject: "Chemistry" },
    { time: "11:00 AM", class: "EEE", subject: "Physics" },
    { time: "1:00 PM", class: "CSE", subject: "Chemistry" },
    { time: "2:00 PM", rest: true },
  ],
  [
    { time: "8:00 AM", class: "CSE", subject: "Physics" },
    { time: "9:00 AM", class: "ECE", subject: "Physics" },
    { time: "10:00 AM", class: "EEE", subject: "Physics" },
    { time: "11:00 AM", class: "CSE", subject: "Chemistry" },
    { time: "1:00 PM", class: "MECH", subject: "Chemistry" },
    { time: "2:00 PM", class: "EEE", subject: "Physics" },
  ],
  [
    { time: "8:00 AM", rest: true },
    { time: "9:00 AM", rest: true },
    { time: "10:00 AM", rest: true },
    { time: "11:00 AM", rest: true },
    { time: "1:00 PM", rest: true },
    { time: "2:00 PM", rest: true },
  ],
];

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
];
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  // Refs for each section
  const [facultyData, setFacultyData] = useState<FacultyDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayDate, setTodayDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [dashboardLoaded, setDashboardLoaded] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get("/dashboard/faculty");
        if (response.data && response.data.success) {
          setFacultyData(response.data.data || []);
          setLoading(false);
          const newToken = response.headers["refreshedtoken"];
          localStorage.setItem("authToken", newToken);
          setDashboardLoaded(true);
        } else {
          setError(response.data?.message || "Failed to fetch dashboard data");
        }
      } catch (err: unknown) {
        if (
          err &&
          typeof err === "object" &&
          err !== null &&
          "response" in err
        ) {
          const errorObj = err as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          setError(
            errorObj.response?.data?.message ||
              errorObj.message ||
              "Failed to fetch dashboard data"
          );
        } else {
          setError("Failed to fetch dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const sectionOptions = facultyData.map((item) => ({
    label: `${item.subject.name}-${item.subject.department}-${item.subject.year}Y-${item.section}`,
    value: `${item.subject.id}-${item.section}`,
  }));
  const myProfileRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const timetableRef = useRef<HTMLDivElement>(null);
  const attendanceRef = useRef<HTMLDivElement>(null);
  const examsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const announcementsRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  // State for active section
  const [activeSection, setActiveSection] = React.useState("my-profile");

  // Sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Class selection state
  const [selectedClass, setSelectedClass] = useState("");
  useEffect(() => {
    if (facultyData.length > 0 && !selectedClass) {
      setSelectedClass(
        `${facultyData[0].subject.id}-${facultyData[0].section}`
      );
    }
  }, [facultyData, selectedClass]);

  const studentsForSelectedClass = useMemo(
    () =>
      facultyData.find(
        (item) => `${item.subject.id}-${item.section}` === selectedClass
      )?.students || [],
    [facultyData, selectedClass]
  );

  // Attendance date state
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  // Format the agenda month and year based on attendanceDate
  const agendaMonthYear = format(new Date(attendanceDate), "MMMM yyyy");

  // Attendance state for selected class
  const [attendance, setAttendance] = useState<
    { id: string; name: string; rollNumber?: string; present: boolean }[]
  >([]);
  const [attendanceEditable, setAttendanceEditable] = useState(false);

  /**
   * Previous dates attendance
   * fetching and storing previous date attendance
   * ----------------------------------------------------------------
   */

  const isToday = (dateStr: string) => {
    const today = new Date();
    const selectedDate = new Date(dateStr);
    return (
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate()
    );
  };

  const isFutureDate = (dateStr: string) => {
    const today = new Date();
    const selectedDate = new Date(dateStr);
    return selectedDate > today;
  };

  useEffect(() => {
    if (!dashboardLoaded) return;
    if (!selectedClass || facultyData.length === 0) return;

    // For future dates, show empty attendance and disable editing
    if (isFutureDate(attendanceDate)) {
      setAttendance([]);
      setAttendanceEditable(false);
      return;
    }

    const fetchAttendance = async () => {
      try {
        const selected = facultyData.find(
          (item) => `${item.subject.id}-${item.section}` === selectedClass
        );
        if (!selected) return;

        const response = await apiClient.get(
          `/attendance/byDate?department=${selected.subject.department}&year=${selected.subject.year}&section=${selected.section}&subjectId=${selected.subject.id}&date=${attendanceDate}`
        );

        const att = response.data.attendance;
        if (att && att.students && att.students.length > 0) {
          // Attendance exists for this date
          setAttendance(
            att.students.map((s: AttendanceStudent) => ({
              id: s.studentId,
              name: s.name,
              rollNumber: s.rollNumber,
              present: s.status?.toLowerCase() === "present",
            }))
          );
          setAttendanceEditable(false);
        } else if (isToday(attendanceDate)) {
          // No attendance found for this date, initialize with students
          setAttendance(
            (studentsForSelectedClass || []).map((s) => ({
              id: s.id,
              name: s.name,
              rollNumber: s.rollNumber,
              present: false,
            }))
          );
          setAttendanceEditable(true);
        } else {
          setAttendance([]);
          setAttendanceEditable(false);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setAttendance([]);
        setAttendanceEditable(false);
      }
    };

    fetchAttendance();
  }, [
    selectedClass,
    attendanceDate,
    facultyData,
    studentsForSelectedClass,
    dashboardLoaded,
  ]);

  /**
   * fetch faculty timetable
   */
  const [rawTimetableData, setRawTimeTableData] = useState([]);
  useEffect(() => {
    if (!dashboardLoaded) return;
    const fetchTimeTable = async () => {
      const response = await apiClient.get("userData/mySchedule");
      setRawTimeTableData(response.data.timeTable);
      console.log(response.data.timeTable);
    };
    fetchTimeTable();
  }, [dashboardLoaded]);

  const days = [...new Set(rawTimetableData.map((entry) => entry.day))];

  const uniqueSlots = [
    ...new Set(
      rawTimetableData.map((entry) => `${entry.startTime} - ${entry.endTime}`)
    ),
  ].sort();

  const timeTableSlots = uniqueSlots.map((slot) => {
    const [startTime, endTime] = slot.split(" - ");
    return { startTime, endTime };
  });

  const timetableMap = {};
  rawTimetableData.forEach((entry) => {
    const timeKey = `${entry.startTime} - ${entry.endTime}`;
    if (!timetableMap[timeKey]) timetableMap[timeKey] = {};
    timetableMap[timeKey][entry.day] = entry;
  });

  // Exams section state
  const [selectedExamClass, setSelectedExamClass] = useState("A");
  const [selectedExamStudent, setSelectedExamStudent] = useState("");
  const [examMarks, setExamMarks] = useState(0);
  const [bitPaperMarks, setBitPaperMarks] = useState(0);
  const [assignmentMarks, setAssignmentMarks] = useState(0);
  const [midTermScores, setMidTermScores] = useState<{
    [key: string]: number[];
  }>({}); // { 'A-1': [score1, score2] }

  const studentsForExam =
    facultyData.find((item) => item.section === selectedExamClass)?.students ||
    [];
  const selectedStudent = studentsForExam.find(
    (s) => String(s.id) === selectedExamStudent
  );

  const calcMidTermScore = (exam: number, bit: number, assign: number) => {
    return Math.floor(exam / 2) + Math.floor(bit / 2) + assign;
  };

  const handleSaveMarks = () => {
    const key = `${selectedExamClass}-${selectedExamStudent}`;
    const score = calcMidTermScore(examMarks, bitPaperMarks, assignmentMarks);
    setMidTermScores((prev) => {
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
    "my-profile": myProfileRef,
    dashboard: dashboardRef,
    timetable: timetableRef,
    attendance: attendanceRef,
    exams: examsRef,
    results: resultsRef,
    announcements: announcementsRef,
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    const ref = sectionRefs[section];
    if (section === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsSidebarOpen(false);
      return;
    }
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Listen to scroll to update active section
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { section: "my-profile", ref: myProfileRef },
        { section: "dashboard", ref: dashboardRef },
        { section: "timetable", ref: timetableRef },
        { section: "attendance", ref: attendanceRef },
        { section: "exams", ref: examsRef },
        { section: "results", ref: resultsRef },
        { section: "announcements", ref: announcementsRef },
      ];
      const scrollPosition = window.scrollY + 120; // Offset for nav

      let current = "my-profile";
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

  // Top statistics data
  const stats = [
    {
      label: "Students",
      value: "124,684",
      color: "bg-yellow-100",
      icon: <Users className="text-yellow-500" />,
    },
    {
      label: "Teachers",
      value: "12,379",
      color: "bg-purple-100",
      icon: <Users className="text-purple-500" />,
    },
    {
      label: "Staffs",
      value: "29,300",
      color: "bg-blue-100",
      icon: <Users className="text-blue-500" />,
    },
    {
      label: "Awards",
      value: "95,800",
      color: "bg-orange-100",
      icon: <Award className="text-orange-500" />,
    },
  ];

  // Agenda data
  const agenda = [
    {
      time: "08:00 am",
      title: "Homeroom & Announcement",
      grade: "All Grade",
      color: "bg-gray-100",
    },
    {
      time: "10:00 am",
      title: "Math Review & Practice",
      grade: "Grade 3-5",
      color: "bg-yellow-100",
    },
    {
      time: "10:30 am",
      title: "Science Experiment & Discussion",
      grade: "Grade 6-8",
      color: "bg-green-100",
    },
  ];

  // Messages data
  const messages = [
    {
      name: "Dr. Lila Ramirez",
      message: "Please review the monthly attendance report...",
      time: "9:00 AM",
    },
    {
      name: "Ms. Heather Morris",
      message: "Don't forget to start training on obligations...",
      time: "2:00 PM",
    },
    {
      name: "Mr. Carl Jenkins",
      message: "Budgetary meeting for the next fiscal year...",
      time: "3:00 PM",
    },
    {
      name: "Other Dan Brooks",
      message: "Review the updated security protocols...",
      time: "4:00 PM",
    },
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
    const labels = daysArr.map((d) => format(d, "MMM d"));
    // Mock attendance % (random for demo)
    const dataArr = daysArr.map(() => Math.floor(80 + Math.random() * 20));
    const data = {
      labels,
      datasets: [
        {
          label: "Attendance %",
          data: dataArr,
          backgroundColor: "rgba(59, 130, 246, 0.3)",
          borderColor: "#3b82f6",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
      ],
    };
    const options: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
          labels: {
            font: { size: 12 },
            usePointStyle: true,
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#3b82f6",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context) => `Attendance: ${context.parsed}%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            callback: (v) => `${v}%`,
            font: { size: 11 },
            color: "#6b7280",
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 8,
            font: { size: 11 },
            color: "#6b7280",
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
    };
    return (
      <div className="h-64 w-full">
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
          <CardTitle className="text-lg font-semibold">
            Attendance Overview
          </CardTitle>
          <CardDescription>
            Current attendance statistics for your classes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceGraph />
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">
              Past 30 Days Attendance
            </h4>
            <Attendance30DaysGraph />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Exams section JSX
  const examsSection = (
    <div ref={examsRef} id="exams" className="scroll-mt-24">
      <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-white">
            Exams
          </CardTitle>
          <CardDescription className="dark:text-white">
            Upcoming and past exams overview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-gray-400 dark:text-white">
            [Exams content here]
          </span>
          {/* Mid Exam Marks Entry Section */}
          <div className="mt-6">
            <h3 className="font-semibold text-base mb-2 dark:text-white">
              Mid Exam Marks Entry
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <label htmlFor="exam-class-select" className="sr-only">
                Select Class
              </label>
              <select
                id="exam-class-select"
                className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                value={selectedExamClass}
                onChange={(e) => {
                  setSelectedExamClass(e.target.value);
                  setSelectedExamStudent("");
                }}
                aria-label="Select class for marks entry"
              >
                {sectionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label htmlFor="exam-student-select" className="sr-only">
                Select Student
              </label>
              <select
                id="exam-student-select"
                className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                value={selectedExamStudent}
                onChange={(e) => setSelectedExamStudent(e.target.value)}
                aria-label="Select student for marks entry"
              >
                {studentsForExam.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <label
                htmlFor="exam-marks"
                className="text-xs font-medium dark:text-white"
              >
                Exam (out of 30):
              </label>
              <input
                id="exam-marks"
                type="number"
                min={0}
                max={30}
                className="border rounded px-2 py-1 text-sm w-20 bg-white dark:bg-gray-700 dark:text-white"
                value={examMarks}
                onChange={(e) => setExamMarks(Number(e.target.value))}
                aria-label="Exam marks out of 30"
                placeholder="0"
              />
              <label
                htmlFor="bit-marks"
                className="text-xs font-medium dark:text-white"
              >
                Bit Paper (out of 20):
              </label>
              <input
                id="bit-marks"
                type="number"
                min={0}
                max={20}
                className="border rounded px-2 py-1 text-sm w-20 bg-white dark:bg-gray-700 dark:text-white"
                value={bitPaperMarks}
                onChange={(e) => setBitPaperMarks(Number(e.target.value))}
                aria-label="Bit Paper marks out of 20"
                placeholder="0"
              />
              <label
                htmlFor="assignment-marks"
                className="text-xs font-medium dark:text-white"
              >
                Assignment (out of 5):
              </label>
              <input
                id="assignment-marks"
                type="number"
                min={0}
                max={5}
                className="border rounded px-2 py-1 text-sm w-20 bg-white dark:bg-gray-700 dark:text-white"
                value={assignmentMarks}
                onChange={(e) => setAssignmentMarks(Number(e.target.value))}
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
            <div className="mt-2 text-xs text-gray-700 dark:text-white">
              <div>
                Mid-term Score:{" "}
                <span className="font-semibold dark:text-white">
                  {calcMidTermScore(examMarks, bitPaperMarks, assignmentMarks)}
                </span>
              </div>
              <div>
                Weighted Final Score:{" "}
                <span className="font-semibold dark:text-white">
                  {getWeightedFinal(
                    midTermScores[
                      `${selectedExamClass}-${selectedExamStudent}`
                    ] || [
                      calcMidTermScore(
                        examMarks,
                        bitPaperMarks,
                        assignmentMarks
                      ),
                    ]
                  )}
                </span>
                {midTermScores[`${selectedExamClass}-${selectedExamStudent}`]
                  ?.length === 2 && (
                  <span className="ml-2 text-gray-500 dark:text-white">
                    (80% higher + 20% lower mid-term)
                  </span>
                )}
              </div>
              <div className="mt-1 text-gray-500 dark:text-white">
                (Scores are auto-calculated and saved per student. Only last 2
                mid-terms are considered.)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section JSX
  const resultsSection = (
    <div ref={resultsRef} id="results" className="scroll-mt-24">
      <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-white">
            Results
          </CardTitle>
          <CardDescription className="dark:text-white">
            Results overview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-gray-400 dark:text-white">
            [Results content here]
          </span>
        </CardContent>
      </Card>
    </div>
  );

  // Announcements section JSX
  const announcementsSection = (
    <div ref={announcementsRef} id="announcements" className="scroll-mt-24">
      <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-white">
            Announcements
          </CardTitle>
          <CardDescription className="dark:text-white">
            Important announcements and updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-gray-400 dark:text-white">
            [Announcements content here]
          </span>
        </CardContent>
      </Card>
    </div>
  );

  // Faculty profile state
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    apiClient
      .get("/auth/me")
      .then((res) => {
        setFacultyProfile(res.data.user);
        setProfileLoading(false);
      })
      .catch((err) => {
        setProfileError("Failed to load profile");
        setProfileLoading(false);
      });
  }, []);

  const handleAttendanceSubmit = async () => {
    const selected = facultyData.find(
      (item) => `${item.subject.id}-${item.section}` === selectedClass
    );
    if (!selected) {
      toast({ title: "Selected class not found", variant: "destructive" });
      return;
    }
    const payload = {
      department: selected.subject.department,
      year: selected.subject.year,
      section: selected.section,
      subjectId: selected.subject.id,
      studentsAttendance: {
        date: attendanceDate,
        students: attendance.map((s) => ({
          studentId: s.id,
          status: s.present ? "Present" : "Absent",
        })),
      },
    };

    try {
      await apiClient.post("/attendance/mark", payload);
      toast({ title: "Attendance submitted successfully", variant: "default" });
      setAttendanceEditable(false);
      const response = await apiClient.get(
        `/attendance/byDate?department=${selected.subject.department}&year=${selected.subject.year}&section=${selected.section}&subjectId=${selected.subject.id}&date=${attendanceDate}`
      );

      const att = response.data.attendance;
      if (att && att.students && att.students.length > 0) {
        setAttendance(
          att.students.map((s: AttendanceStudent) => ({
            id: s.studentId,
            name: s.name,
            rollNumber: s.rollNumber,
            present: s.status?.toLowerCase() === "present",
          }))
        );
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast({
        title: "Something went Wrong",
        description:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (profileLoading || loading) return <div>Loading...</div>;
  if (profileError || error || !dashboardLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">
            {error || "OOps! something's wrong"}
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login Again/Log Out
          </button>
        </div>
      </div>
    );
  }
  return (
    /* Main Dashboard Layout */
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav
        activeSection={activeSection}
        onNavClick={handleNavClick}
        dashboardType="faculty"
      />
      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-20 pb-16 md:pb-0">
        <div className="p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          {/* My Profile Section */}
          <div ref={myProfileRef} className="space-y-4 md:space-y-6">
            <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                <Avatar className="w-16 h-16 md:w-20 md:h-20">
                  {facultyProfile?.profilePictureUrl ? (
                    <AvatarImage
                      src={`data:image/jpeg;base64,${facultyProfile.profilePictureUrl}`}
                      alt={`${facultyProfile?.firstName} ${facultyProfile?.lastName}`}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-600 text-white text-xl md:text-2xl">
                      {facultyProfile?.firstName?.[0]}
                      {facultyProfile?.lastName?.[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-2 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {facultyProfile?.firstName} {facultyProfile?.lastName}
                    </h2>
                    <button className="p-1 text-gray-400 dark:text-white hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-white mb-2 md:mb-4 text-sm md:text-base">
                    {facultyProfile?.email}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600 dark:text-white">
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {facultyProfile?.phoneNumber || facultyProfile?.phone}
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
          </div>

          {/* Dashboard Section */}
          <div ref={dashboardRef} className="pt-4 md:pt-8">
            <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <CardHeader>
                <CardTitle className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  Dashboard Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {/* Top Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                  {stats.map((stat, idx) => (
                    <Card
                      key={idx}
                      className={`${stat.color} dark:bg-gray-700`}
                    >
                      <CardContent className="flex items-center justify-between py-2 sm:py-4">
                        <div>
                          <div className="text-base sm:text-lg font-bold dark:text-white">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-white">
                            {stat.label}
                          </div>
                        </div>
                        <div className="text-xl sm:text-2xl">{stat.icon}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {/* Attendance Graph */}
                <Card className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <CardContent>
                    <AttendanceGraph />
                  </CardContent>
                </Card>
                {/* Awards */}
                <Card className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                      Awards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                        <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                            Best Teacher Award (2024)
                          </h4>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-white">
                            Awarded for outstanding teaching in Physics.
                          </p>
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
            <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-base md:text-lg dark:text-white">
                  Class Timetable
                </CardTitle>
                <CardDescription className="text-xs md:text-sm dark:text-white">
                  Weekly class schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm">
                    <thead>
                      <tr>
                        <th className="p-2 md:p-3 font-semibold text-center bg-gray-50 dark:bg-gray-700 dark:text-white">
                          Time
                        </th>
                        {days.map((day) => (
                          <th
                            key={day}
                            className="p-2 md:p-3 font-semibold text-center bg-gray-50 dark:bg-gray-700 dark:text-white"
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueSlots.map((slot, idx) => (
                        <tr key={idx}>
                          <td className="p-2 md:p-3 font-semibold text-center bg-gray-50 dark:bg-gray-700 dark:text-white">
                            {slot}
                          </td>
                          {days.map((day, colIdx) => {
                            const cell = timetableMap[slot]?.[day];

                            return (
                              <td
                                key={colIdx}
                                className="p-2 md:p-3 text-center"
                              >
                                {cell ? (
                                  <span className="inline-block bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-white rounded-lg px-2 py-1 text-xs font-medium">
                                    {cell.subject} - {cell.department} (Y
                                    {cell.year})
                                  </span>
                                ) : (
                                  <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-white rounded-lg px-2 py-1 text-xs font-medium">
                                    Rest
                                  </span>
                                )}
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
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg dark:text-white">
                    Attendance
                  </CardTitle>
                  {/* Class select dropdown, Date, and Submit button */}
                  <div className="mt-2 flex flex-row flex-wrap items-center gap-2 w-full">
                    <select
                      id="class-select"
                      className="border rounded px-2 py-1 text-sm flex-1 min-w-0 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      style={{ maxWidth: 120 }}
                    >
                      {sectionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      className="border rounded px-2 py-1 text-sm flex-1 min-w-0 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={attendanceDate}
                      max={todayDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      style={{ minWidth: 120, maxWidth: 140 }}
                    />
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={async () => {
                        if (attendance.length === 0) return;
                        const confirmed = window.confirm(
                          "Are you sure you want to submit attendance?"
                        );
                        if (confirmed) {
                          await handleAttendanceSubmit();
                        }
                      }}
                      disabled={attendance.length === 0 || !attendanceEditable}
                    >
                      Submit
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="w-full">
                      {/* Table header */}
                      <div className="grid grid-cols-3 bg-blue-50 dark:bg-blue-900 rounded-t-md py-2 px-2 font-semibold text-blue-700 dark:text-white text-xs mb-2">
                        <div>Name</div>
                        <div>Roll No</div>
                        <div>Status</div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {attendance.length === 0 ? (
                          <div className="col-span-3 text-center text-gray-500 dark:text-white py-4">
                            No students found.
                          </div>
                        ) : (
                          attendance.map((item, idx) => (
                            <div
                              key={item.id}
                              className="grid grid-cols-3 items-center bg-white dark:bg-gray-700 border rounded-md px-2 py-2 mb-2 shadow-sm"
                            >
                              {/* Name */}
                              <div className="truncate font-medium text-sm dark:text-white">
                                {item.name}
                              </div>
                              {/* Roll No */}
                              <div className="flex justify-start min-w-0">
                                <span className="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-white font-semibold text-xs px-2 py-1 rounded break-all min-w-0">
                                  {item.rollNumber}
                                </span>
                              </div>
                              {/* Status Switch and Label */}
                              <div className="flex items-center justify-end space-x-2">
                                <AttendanceSwitch
                                  checked={item.present}
                                  onChange={() =>
                                    attendanceEditable
                                      ? setAttendance((prev) =>
                                          prev.map((s, i) =>
                                            i === idx
                                              ? { ...s, present: !s.present }
                                              : s
                                          )
                                        )
                                      : undefined
                                  }
                                  disabled={!attendanceEditable}
                                />
                                {item.present ? (
                                  <span className="flex items-center px-2 py-1 rounded-full bg-green-50 dark:bg-green-900 text-green-600 dark:text-white text-xs font-semibold border border-green-200 dark:border-green-700">
                                    <svg
                                      className="w-3 h-3 mr-1 text-green-500 dark:text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    Present
                                  </span>
                                ) : (
                                  <span className="flex items-center px-2 py-1 rounded-full bg-red-50 dark:bg-red-900 text-red-600 dark:text-white text-xs font-semibold border border-red-200 dark:border-red-700">
                                    <svg
                                      className="w-3 h-3 mr-1 text-red-500 dark:text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                    Absent
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Exams Section */}
          <div ref={examsRef} className="pt-4 md:pt-8">
            {/* ...reuse your exams section, but styled like StudentDashboard... */}
            <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold dark:text-white">
                  Exams
                </CardTitle>
                <CardDescription className="dark:text-white">
                  Upcoming and past exams overview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-gray-400 dark:text-white">
                  [Exams content here]
                </span>
                {/* Mid Exam Marks Entry Section */}
                <div className="mt-6">
                  <h3 className="font-semibold text-base mb-2 dark:text-white">
                    Mid Exam Marks Entry
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <label htmlFor="exam-class-select" className="sr-only">
                      Select Class
                    </label>
                    <select
                      id="exam-class-select"
                      className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                      value={selectedExamClass}
                      onChange={(e) => {
                        setSelectedExamClass(e.target.value);
                        setSelectedExamStudent("");
                      }}
                      aria-label="Select class for marks entry"
                    >
                      {sectionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="exam-student-select" className="sr-only">
                      Select Student
                    </label>
                    <select
                      id="exam-student-select"
                      className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                      value={selectedExamStudent}
                      onChange={(e) => setSelectedExamStudent(e.target.value)}
                      aria-label="Select student for marks entry"
                    >
                      {studentsForExam.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.rollNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <label
                      htmlFor="exam-marks"
                      className="text-xs font-medium dark:text-white"
                    >
                      Exam (out of 30):
                    </label>
                    <input
                      id="exam-marks"
                      type="number"
                      min={0}
                      max={30}
                      className="border rounded px-2 py-1 text-sm w-20 bg-white dark:bg-gray-700 dark:text-white"
                      value={examMarks}
                      onChange={(e) => setExamMarks(Number(e.target.value))}
                      aria-label="Exam marks out of 30"
                      placeholder="0"
                    />
                    <label
                      htmlFor="bit-marks"
                      className="text-xs font-medium dark:text-white"
                    >
                      Bit Paper (out of 20):
                    </label>
                    <input
                      id="bit-marks"
                      type="number"
                      min={0}
                      max={20}
                      className="border rounded px-2 py-1 text-sm w-20 bg-white dark:bg-gray-700 dark:text-white"
                      value={bitPaperMarks}
                      onChange={(e) => setBitPaperMarks(Number(e.target.value))}
                      aria-label="Bit Paper marks out of 20"
                      placeholder="0"
                    />
                    <label
                      htmlFor="assignment-marks"
                      className="text-xs font-medium dark:text-white"
                    >
                      Assignment (out of 5):
                    </label>
                    <input
                      id="assignment-marks"
                      type="number"
                      min={0}
                      max={5}
                      className="border rounded px-2 py-1 text-sm w-20 bg-white dark:bg-gray-700 dark:text-white"
                      value={assignmentMarks}
                      onChange={(e) =>
                        setAssignmentMarks(Number(e.target.value))
                      }
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
                  <div className="mt-2 text-xs text-gray-700 dark:text-white">
                    <div>
                      Mid-term Score:{" "}
                      <span className="font-semibold dark:text-white">
                        {calcMidTermScore(
                          examMarks,
                          bitPaperMarks,
                          assignmentMarks
                        )}
                      </span>
                    </div>
                    <div>
                      Weighted Final Score:{" "}
                      <span className="font-semibold dark:text-white">
                        {getWeightedFinal(
                          midTermScores[
                            `${selectedExamClass}-${selectedExamStudent}`
                          ] || [
                            calcMidTermScore(
                              examMarks,
                              bitPaperMarks,
                              assignmentMarks
                            ),
                          ]
                        )}
                      </span>
                      {midTermScores[
                        `${selectedExamClass}-${selectedExamStudent}`
                      ]?.length === 2 && (
                        <span className="ml-2 text-gray-500 dark:text-white">
                          (80% higher + 20% lower mid-term)
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-gray-500 dark:text-white">
                      (Scores are auto-calculated and saved per student. Only
                      last 2 mid-terms are considered.)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div ref={resultsRef} className="pt-4 md:pt-8">
            {/* ...reuse your results section, but styled like StudentDashboard... */}
            <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold dark:text-white">
                  Results
                </CardTitle>
                <CardDescription className="dark:text-white">
                  Results overview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-gray-400 dark:text-white">
                  [Results content here]
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Announcements Section */}
          <div ref={announcementsRef} className="pt-4 md:pt-8">
            {/* ...reuse your announcements section, but styled like StudentDashboard... */}
            <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold dark:text-white">
                  Announcements
                </CardTitle>
                <CardDescription className="dark:text-white">
                  Important announcements and updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-gray-400 dark:text-white">
                  [Announcements content here]
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;
