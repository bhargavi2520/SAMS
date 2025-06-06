import React, { useRef, useState, useEffect } from 'react';
// import { useAuthStore } from '@/store/authStore'; // Removed problematic import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import {
	Home,
	FileText, // For Exams
	ClipboardList, // For Subjects or Attendance
	BarChart2, // For Performance
	CheckSquare, // For Attendance
	Calendar, // For Timetable and new Calendar option
	MessageCircle, // For new Feedback option
	Megaphone, // For Notifications
	User, // For My Profile
	Settings,
	LogOut,
	Search,
	Bell, // For Notifications
	Moon,
	Edit,
	Users,
	DollarSign, // For Fee Details
	BookOpen, // For Subjects
	MessageSquare, // For Tutoring or Feedback
	FileBarChart, // For Reports
	HelpCircle,
	Award, // For Achievements and Awards
    Menu // Added Menu icon for mobile navigation
} from 'lucide-react';
// import { StudentProfile } from '@/types/auth.types'; // Original import commented out
import dayjs from 'dayjs';
import { Line, Doughnut, Bar } from 'react-chartjs-2'; // Added Bar for attendance graph
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title as ChartTitle,
	Tooltip,
	Legend,
	ArcElement,
	BarElement, // Added BarElement for bar chart
    ChartOptions // Import ChartOptions for explicit typing
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend, ArcElement, BarElement);

// Define StudentProfile interface locally as the external import was commented out
interface StudentProfile {
    firstName: string;
    lastName: string;
    email: string;
    cpf: string;
    birthDate: string;
    phone: string;
    // Add any other relevant student profile fields here if needed
}

const sidebarItems = [
    { label: 'My Profile', path: '#my-profile', icon: <User className="w-5 h-5" /> },
	{ label: 'Dashboard', path: '#dashboard', icon: <Home className="w-5 h-5" /> },
	{ label: 'Timetable', path: '#timetable', icon: <Calendar className="w-5 h-5" /> }, // Moved Timetable up
	{ label: 'Subjects Faculty', path: '#subjects-faculty', icon: <BookOpen className="w-5 h-5" /> }, // Moved Subjects Faculty below Timetable
	{ label: 'Exams', path: '#exams', icon: <FileText className="w-5 h-5" /> },
	{ label: 'Performance', path: '#performance', icon: <BarChart2 className="w-5 h-5" /> },
	{ label: 'Attendance', path: '#attendance', icon: <CheckSquare className="w-5 h-5" /> },
	{ label: 'Calendar', path: '#calendar', icon: <Calendar className="w-5 h-5" /> },
	{ label: 'Notifications', path: '#notifications', icon: <Bell className="w-5 h-5" /> },
	{ label: 'Feedback', path: '#feedback', icon: <MessageCircle className="w-5 h-5" /> },
];

const bottomSidebarItems = [
	{ label: 'Settings', path: '#settings', icon: <Settings className="w-5 h-5" /> },
	{ label: 'Help', path: '#help', icon: <HelpCircle className="w-5 h-5" /> },
];

const schedule = [
	[
		{ time: '8:00 AM', subject: '4A - Physics' },
		{ time: '9:00 AM', subject: '3B - Physics' },
		{ time: '10:00 AM', subject: '2B - Physics' },
		{ time: '11:00 AM', subject: '1A - Chemistry' },
		{ time: '1:00 PM', subject: '6A - Chemistry' },
		{ time: '2:00 PM', subject: '3C - Chemistry' },
	],
	[
		{ time: '8:00 AM', subject: '4A - Chemistry' },
		{ time: '9:00 AM', subject: '2B - Physics' },
		{ time: '10:00 AM', subject: '3A - Physics' },
		{ time: '11:00 AM', subject: '5A - Physics' },
		{ time: '1:00 PM', subject: '6C' },
		{ time: '2:00 PM', subject: '2D - Physics' },
	],
	[
		{ time: '8:00 AM', subject: '1A - Chemistry' },
		{ time: '9:00 AM', subject: '6A - Physics' },
		{ time: '10:00 AM', subject: '2B - Physics' },
		{ time: '11:00 AM', subject: '5B - Physics' },
		{ time: '1:00 PM', subject: '3C - Chemistry' },
		{ time: '2:00 PM', subject: '2C - Physics' },
	],
	[
		{ time: '8:00 AM', subject: '4A - Chemistry' },
		{ time: '9:00 AM', subject: '3B - Physics' },
		{ time: '10:00 AM', subject: '6B - Chemistry' },
		{ time: '11:00 AM', subject: '5C - Physics' },
		{ time: '1:00 PM', subject: '6A - Chemistry' },
		{ time: '2:00 PM', subject: '2B - Chemistry' },
	],
	[
		{ time: '8:00 AM', subject: '4A - Physics' },
		{ time: '9:00 AM', subject: '3B - Physics' },
		{ time: '10:00 AM', subject: '2B - Physics' },
		{ time: '11:00 AM', subject: '6A - Chemistry' },
		{ time: '1:00 PM', subject: '3C - Chemistry' },
		{ time: '2:00 PM', subject: '2A - Physics' },
	],
	[
		{ time: '8:00 AM', subject: 'Saturday Class' },
		{ time: '9:00 AM', subject: 'Saturday Class' },
		{ time: '10:00 AM', subject: 'Saturday Class' },
		{ time: '11:00 AM', subject: 'Saturday Class' },
		{ time: '1:00 PM', subject: 'Saturday Class' },
		{ time: '2:00 PM', subject: 'Saturday Class' },
	],
];

const announcements = [
	{ title: 'Exam Schedule Released', desc: 'Check the exams section for the latest schedule.' },
	{ title: 'Holiday Notice', desc: 'School will be closed on Friday for a public holiday.' },
];

const attendanceData = [
	{ label: 'Physics', attended: 12, total: 15 },
	{ label: 'Chemistry', attended: 15, total: 15 },
	{ label: 'Math', attended: 12, total: 15 },
	{ label: 'English', attended: 13, total: 15 },
	{ label: 'Biology', attended: 14, total: 15 },
];

const performanceData = {
	labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5'],
	datasets: [
		{
			label: 'Percentage',
			data: [78, 82, 85, 80, 88],
			borderColor: '#3b82f6',
			backgroundColor: 'rgba(59,130,246,0.1)',
			tension: 0.4,
			pointRadius: 5,
			pointBackgroundColor: '#3b82f6',
			fill: true,
		},
	],
};

const performanceOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: { display: false },
		title: { display: false },
	},
	scales: {
		y: {
			beginAtZero: true,
			max: 100,
			ticks: {
				stepSize: 20,
				callback: (value) => `${value}%`,
			},
			grid: {
				color: '#f1f5f9',
			},
		},
		x: {
			grid: {
				display: false,
			},
		},
	},
};

const progressData = {
	labels: ['Completed', 'Remaining'],
	datasets: [
		{
			data: [75, 25],
			backgroundColor: ['#3b82f6', '#e2e8f0'],
			borderWidth: 0,
			cutout: '75%',
		},
	],
};

const progressOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: { display: false },
		tooltip: { enabled: false },
	},
};

const skillsData = {
	labels: ['Communication', 'Persuasion', 'Organization', 'Self-awareness', 'Empathy', 'Entrepreneurship', 'Personal transformation', 'Others', 'Productivity', 'Planning', 'Engagement', 'Resilience', 'Efficiency', 'Problem Solving'],
	datasets: [
		{
			data: [90, 85, 95, 80, 88, 75, 82, 70, 92, 87, 78, 85, 90, 83],
			backgroundColor: 'rgba(59,130,246,0.1)',
			borderColor: '#3b82f6',
			borderWidth: 2,
			pointBackgroundColor: '#3b82f6',
			pointBorderColor: '#ffffff',
			pointBorderWidth: 2,
		},
	],
};

// Changed subjectDetails to subjectsFaculty
const subjectsFaculty = [
	{ faculty: 'Physics Department', teacher: 'Dr. R. Sharma', book: 'Concepts of Physics (H.C. Verma)' },
	{ faculty: 'Chemistry Department', teacher: 'Ms. S. Rao', book: 'Modern Approach to Chemical Calculations (R.C. Mukherjee)' },
	{ faculty: 'Mathematics Department', teacher: 'Mr. A. Kumar', book: 'Mathematics for Class 12 (R.D. Sharma)' },
	{ faculty: 'Biology Department', teacher: 'Dr. P. Singh', book: 'Trueman\'s Elementary Biology' },
	{ faculty: 'English Department', teacher: 'Mrs. N. Das', book: 'Hornbill (NCERT)' },
];

const coursesData = [
	{ id: 1, name: 'The Secret Sales Formula', category: 'Sales', progress: 100, status: 'Completed', lastAccess: '11/05/2024 17:59:23' },
	{ id: 2, name: 'One Sale Per Day', category: 'Sales', progress: 100, status: 'Completed', lastAccess: '11/05/2024 17:59:23' },
	{ id: 3, name: 'How to Vitalize Your Ad', category: 'Marketing', progress: 100, status: 'Completed', lastAccess: '11/05/2024 17:59:23' },
	{ id: 4, name: 'Basic Programming with React', category: 'Technology', progress: 25, status: 'In Progress', lastAccess: '12/05/2024 09:30:00' },
	{ id: 5, name: 'Fundamentals of Economics', category: 'Finance', progress: 50, status: 'In Progress', lastAccess: '10/05/2024 14:00:00' },
];

// Mock data for GPA
const mockGrades = [
    { subject: 'Physics', grade: 3.5, credits: 4 },
    { subject: 'Chemistry', grade: 4.0, credits: 3 },
    { subject: 'Mathematics', grade: 3.8, credits: 4 },
    { subject: 'English', grade: 3.2, credits: 3 },
];

// Mock data for Fee Due Details
const feeDetails = [
    { item: 'Tuition Fee', amount: '₹12000.00', dueDate: '2025-07-15', status: 'Due' },
    { item: 'Library Fine', amount: '₹50.00', dueDate: '2025-06-30', status: 'Overdue' },
    { item: 'Hostel Fee', amount: '₹3000.00', dueDate: '2025-08-01', status: 'Due' },
];

// Mock data for Achievements and Awards
const achievements = [
    { title: 'Dean\'s List', year: 2024, description: 'Achieved academic excellence in Fall 2024 semester.' },
    { title: 'Best Project Award', year: 2023, description: 'Awarded for outstanding final year project in Physics.' },
];

// Mock data for Certificates Issued
const issuedCertificates = [
    { name: 'Web Development Basics Certificate', date: '2023-09-01' },
    { name: 'Data Science Fundamentals Certificate', date: '2024-03-15' },
    { name: 'Advanced React Certificate', date: '2024-05-20' },
];

// New Calendar Component
const CalendarComponent = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [markedDates, setMarkedDates] = useState<string[]>([]); // Store dates as 'YYYY-MM-DD'

    const daysInMonth = currentMonth.daysInMonth();
    const firstDayOfMonth = currentMonth.startOf('month').day(); // 0 for Sunday, 1 for Monday

    const calendarDays = [];
    // Add leading empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const handleDayClick = (day: number | null) => {
        if (day === null) return;
        const dateString = currentMonth.date(day).format('YYYY-MM-DD');
        setMarkedDates(prevMarkedDates =>
            prevMarkedDates.includes(dateString)
                ? prevMarkedDates.filter(d => d !== dateString)
                : [...prevMarkedDates, dateString]
        );
    };

    const isMarked = (day: number | null) => {
        if (day === null) return false;
        const dateString = currentMonth.date(day).format('YYYY-MM-DD');
        return markedDates.includes(dateString);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <Button onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} variant="outline" className="px-3 py-1 text-sm">Previous</Button>
                <h3 className="text-lg font-semibold">{currentMonth.format('MMMMEEEE')}</h3>
                <Button onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} variant="outline" className="px-3 py-1 text-sm">Next</Button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="font-medium text-gray-700 text-sm">{day}</div>
                ))}
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-md cursor-pointer text-sm ${
                            day === null ? 'bg-gray-100' :
                            isMarked(day) ? 'bg-blue-600 text-white font-bold' :
                            'bg-gray-50 hover:bg-gray-200'
                        }`}
                        onClick={() => handleDayClick(day)}
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium">Marked Dates:</p>
                {markedDates.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {markedDates.sort().map(date => (
                            <li key={date}>{dayjs(date).format('DD MMMM Букмекерлар')}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No important dates marked yet.</p>
                )}
            </div>
        </div>
    );
};

const GPA_Calculator = () => {
    const [grades, setGrades] = useState(mockGrades);
    const [gpa, setGpa] = useState<string | null>(null);

    const calculateGpa = () => {
        let totalGradePoints = 0;
        let totalCredits = 0;
        grades.forEach(item => {
            totalGradePoints += item.grade * item.credits;
            totalCredits += item.credits;
        });
        if (totalCredits === 0) {
            setGpa('N/A');
        } else {
            setGpa((totalGradePoints / totalCredits).toFixed(2));
        }
    };

    useEffect(() => {
        calculateGpa(); // Calculate GPA on initial load
    }, [grades]);

    const handleGradeChange = (index: number, field: string, value: string) => {
        const newGrades = [...grades];
        newGrades[index] = { ...newGrades[index], [field]: parseFloat(value) || 0 };
        setGrades(newGrades);
    };

    const addSubject = () => {
        setGrades([...grades, { subject: '', grade: 0, credits: 0 }]);
    };

    return (
        <div className="p-4">
            <h4 className="text-lg font-semibold mb-4">GPA Calculator</h4>
            <div className="space-y-3">
                {grades.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                            type="text"
                            placeholder="Subject"
                            value={item.subject}
                            onChange={(e) => handleGradeChange(index, 'subject', e.target.value)}
                            className="w-full sm:flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="4"
                            placeholder="Grade (0-4)"
                            value={item.grade}
                            onChange={(e) => handleGradeChange(index, 'grade', e.target.value)}
                            className="w-full sm:w-24 border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                        <input
                            type="number"
                            step="1"
                            min="0"
                            placeholder="Credits"
                            value={item.credits}
                            onChange={(e) => handleGradeChange(index, 'credits', e.target.value)}
                            className="w-full sm:w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                    </div>
                ))}
            </div>
            <Button onClick={addSubject} variant="outline" className="mt-4 text-sm w-full sm:w-auto">Add Subject</Button>
            <div className="mt-4 text-lg font-bold text-gray-800">
                Calculated GPA: {gpa}
            </div>
        </div>
    );
};

const AttendanceGraph = () => {
    const chartData = {
        labels: attendanceData.map(item => item.label),
        datasets: [
            {
                label: 'Classes Attended',
                data: attendanceData.map(item => item.attended),
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
                borderWidth: 1,
            },
            {
                label: 'Total Classes',
                data: attendanceData.map(item => item.total),
                backgroundColor: '#e2e8f0',
                borderColor: '#e2e8f0',
                borderWidth: 1,
            },
        ],
    };

    // Explicitly define ChartOptions for the Bar chart
    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top', // This is now correctly typed as a literal
            },
            title: {
                display: false,
                text: 'Attendance Overview',
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                max: 15, // Max total classes in mock data
                ticks: {
                    stepSize: 5,
                },
            },
        },
    };

    return (
        <div className="p-4">
            <h4 className="text-lg font-semibold mb-4">Current Semester Attendance</h4>
            <p className="text-gray-600 mb-4">Current Semester: Fall 2025</p>
            <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};


const StudentDashboard = () => {
	// const { user } = useAuthStore(); // Removed problematic import
	// Mock studentProfile as useAuthStore is not available in this context
	const studentProfile: StudentProfile = {
		firstName: "Marcela",
		lastName: "Santos",
		email: "marcela.santos@gmail.com",
		cpf: "043.288.451-09", // Keeping CPF as it is a specific ID, can be changed to "National ID" or similar
		birthDate: "1999-02-18", //InvariantCulture-MM-DD format
		phone: "(44) 99704-8887",
		// Add any other relevant student profile fields here
	};


	const [activeSection, setActiveSection] = useState<string>('My Profile'); // Set initial active section to My Profile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar visibility

	// Section refs for scrolling
	const dashboardRef = useRef<HTMLDivElement>(null);
	const myProfileRef = useRef<HTMLDivElement>(null);
	const subjectsFacultyRef = useRef<HTMLDivElement>(null); // Renamed ref
	const timetableRef = useRef<HTMLDivElement>(null);
	const examsRef = useRef<HTMLDivElement>(null);
	const performanceRef = useRef<HTMLDivElement>(null);
	const attendanceRef = useRef<HTMLDivElement>(null);
	const calendarRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const feedbackRef = useRef<HTMLDivElement>(null);


	const sectionRefs = {
		Dashboard: dashboardRef,
		'My Profile': myProfileRef,
		'Subjects Faculty': subjectsFacultyRef, // Updated section ref
		Timetable: timetableRef,
		Exams: examsRef,
		Performance: performanceRef,
		Attendance: attendanceRef,
		Calendar: calendarRef,
		Notifications: notificationsRef,
		Feedback: feedbackRef, // Corrected syntax here
	};

	const handleNavClick = (label: string) => {
		setActiveSection(label);
		const ref = sectionRefs[label];
		if (ref && ref.current) {
			ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsSidebarOpen(false); // Close sidebar on navigation click
		}
	};

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

	// The `if (!studentProfile)` check is no longer strictly necessary since studentProfile is now mocked
	// but keeping it as a safeguard or if the mock logic changes in the future.
	if (!studentProfile) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-500">Loading student information...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
			{/* Sidebar */}
			<aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
				{/* Logo */}
				<div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between md:justify-start w-full">
					<div className="flex items-center space-x-2">
						<BookOpen className="w-6 h-6 text-blue-600" />
						<div>
							<span className="font-bold text-lg text-gray-900">Student Portal</span>
						</div>
					</div>
					{/* Close button for mobile sidebar */}
					<button className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg" onClick={toggleSidebar}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
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
										? 'bg-blue-50 text-blue-700 md:border-r-2 border-blue-700'
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}></div>
            )}

			{/* Main Content */}
			<main className="flex-1 overflow-auto">
				{/* Header */}
				<header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
                    {/* Mobile menu button */}
                    <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg mr-2" onClick={toggleSidebar}>
                        <Menu className="w-6 h-6" />
                    </button>
					<div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
						<div className="relative w-full md:w-auto">
							<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Search"
								className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
					<div className="flex items-center space-x-2 md:space-x-4">
						<button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
							<Bell className="w-5 h-5" />
						</button>
						<button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
							<Moon className="w-5 h-5" />
						</button>
						<div className="flex items-center space-x-2 md:space-x-3">
							<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
								<User className="w-4 h-4 text-white" />
							</div>
							<div className="text-sm hidden md:block"> {/* Hide on small screens */}
								<div className="font-medium text-gray-900">
									{studentProfile?.firstName || "Marcela"} {studentProfile?.lastName || "Santos"}
								</div>
								<div className="text-gray-500">{studentProfile?.email || "marcela.santos@gmail.com"}</div>
							</div>
						</div>
					</div>
				</header>

				{/* Dashboard Content */}
				<div className="p-4 md:p-6">
					{/* My Profile Section (now first) */}
					<div ref={myProfileRef} className="space-y-4 md:space-y-6">
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
							<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
								<div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
									<User className="w-8 h-8 md:w-10 md:h-10 text-white" />
								</div>
								<div className="flex-1">
									<div className="flex flex-col sm:flex-row items-center sm:space-x-2 mb-2">
										<h2 className="text-xl md:text-2xl font-bold text-gray-900">
											{studentProfile?.firstName || "Marcela"} {studentProfile?.lastName || "Santos"}
										</h2>
										<button className="p-1 text-gray-400 hover:text-gray-600">
											<Edit className="w-4 h-4" />
										</button>
									</div>
									<p className="text-gray-600 mb-2 md:mb-4 text-sm md:text-base">{studentProfile?.email || "marcela.santos@gmail.com"}</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
										<div>
											<span className="font-medium">National ID:</span> {studentProfile?.cpf || "043.288.451-09"}
										</div>
										<div>
											<span className="font-medium">Date of birth:</span> {dayjs(studentProfile?.birthDate).format('DD/MM/YYYY') || "18/02/1999"}
										</div>
										<div>
											<span className="font-medium">Phone:</span> {studentProfile?.phone || "(44) 99704-8887"}
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

					{/* Dashboard Section - Updated Content */}
					<div ref={dashboardRef} className="pt-4 md:pt-8">
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
							<CardHeader>
								<CardTitle className="text-base md:text-lg font-semibold text-gray-900">Dashboard Overview</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 md:space-y-6">
								{/* GPA Percentage Calculator */}
								<Card className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
									<CardContent>
										<GPA_Calculator />
									</CardContent>
								</Card>

								{/* Current Semester and Attendance Graph */}
								<Card className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
									<CardContent>
										<AttendanceGraph />
									</CardContent>
								</Card>

								{/* Fee Due Details */}
								<Card className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
									<CardHeader>
										<CardTitle className="text-base md:text-lg font-semibold text-gray-900">Fee Due Details</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="overflow-x-auto">
											<table className="min-w-full text-xs md:text-sm">
												<thead>
													<tr className="text-left border-b border-gray-200">
														<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Item</th>
														<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Amount</th>
														<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Due Date</th>
														<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Status</th>
													</tr>
												</thead>
												<tbody>
													{feeDetails.map((fee, index) => (
														<tr key={index} className="border-b border-gray-100 last:border-b-0">
															<td className="py-2 md:py-3 text-gray-600">{fee.item}</td>
															<td className="py-2 md:py-3 text-gray-600">{fee.amount}</td>
															<td className="py-2 md:py-3 text-gray-600">{fee.dueDate}</td>
															<td className="py-2 md:py-3">
																<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
																	fee.status === 'Due' ? 'bg-yellow-100 text-yellow-800' :
																	fee.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
																}`}>
																	{fee.status}
																</span>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</CardContent>
								</Card>

								{/* Achievements and Awards */}
								<Card className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
									<CardHeader>
										<CardTitle className="text-base md:text-lg font-semibold text-gray-900">Achievements and Awards</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3 md:space-y-4">
											{achievements.map((achievement, index) => (
												<div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100">
													<Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
													<div>
														<h4 className="font-semibold text-gray-900 text-sm md:text-base">{achievement.title} ({achievement.year})</h4>
														<p className="text-xs md:text-sm text-gray-600">{achievement.description}</p>
													</div>
												</div>
											))}
											{achievements.length === 0 && <p className="text-gray-500 text-sm">No achievements yet.</p>}
										</div>
									</CardContent>
								</Card>

								{/* Certificates Issued */}
								<Card className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
									<CardHeader>
										<CardTitle className="text-base md:text-lg font-semibold text-gray-900">Certificates Issued</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3 md:space-y-4">
											{issuedCertificates.map((certificate, index) => (
												<div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100">
													<FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
													<div>
														<h4 className="font-semibold text-gray-900 text-sm md:text-base">{certificate.name}</h4>
														<p className="text-xs md:text-sm text-gray-600">Issued on: {dayjs(certificate.date).format('DD MMMM Букмекерлар')}</p>
													</div>
												</div>
											))}
											{issuedCertificates.length === 0 && <p className="text-gray-500 text-sm">No certificates issued yet.</p>}
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
												<th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Monday</th>
												<th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Tuesday</th>
												<th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Wednesday</th>
												<th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Thursday</th>
												<th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Friday</th>
												<th className="p-2 md:p-3 font-semibold text-center bg-gray-50">Saturday</th>
											</tr>
										</thead>
										<tbody>
											{[...Array(6)].map((_, slotIdx) => (
												<tr key={slotIdx} className="border-b border-gray-100 last:border-b-0">
													<td className="p-2 md:p-3 text-center font-medium bg-gray-50">
														{schedule[0][slotIdx]?.time}
													</td>
													{[...Array(6)].map((_, dayIdx) => (
														<td key={dayIdx} className="p-2 md:p-3 text-center">
															<span className="inline-block bg-blue-50 text-blue-700 rounded-lg px-2 py-1 text-xs font-medium">
																{schedule[dayIdx]?.[slotIdx]?.subject || ''}
															</span>
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Subjects Faculty Section (now below Timetable) */}
					<div ref={subjectsFacultyRef} className="pt-4 md:pt-8">
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200">
							<CardHeader>
								<CardTitle className="text-base md:text-lg">Subjects Faculty Info</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 text-sm">Details about your subjects and their respective faculty.</p>
								<div className="overflow-x-auto mt-4">
									<table className="min-w-full text-xs md:text-sm">
										<thead>
											<tr className="text-left border-b border-gray-200">
												<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Faculty</th>
												<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Teacher</th>
												<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Recommended Book</th>
											</tr>
										</thead>
										<tbody>
											{subjectsFaculty.map((detail, index) => (
												<tr key={index} className="border-b border-gray-100 last:border-b-0">
													<td className="py-2 md:py-3 text-gray-600">{detail.faculty}</td>
													<td className="py-2 md:py-3 text-gray-600">{detail.teacher}</td>
													<td className="py-2 md:py-3 text-gray-600">{detail.book}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Exams Section */}
					<div ref={examsRef} className="pt-4 md:pt-8">
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200">
							<CardHeader>
								<CardTitle className="text-base md:text-lg">Exams</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 text-sm">Upcoming exams and results.</p>
								<div className="mt-3 md:mt-4 space-y-3 md:space-y-4">
									{announcements.map((announcement, index) => (
										<div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
											<Megaphone className="w-5 h-5 text-blue-600 flex-shrink-0" />
											<div>
												<h4 className="font-semibold text-gray-900 text-sm md:text-base">{announcement.title}</h4>
												<p className="text-xs md:text-sm text-gray-600">{announcement.desc}</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Performance Section */}
					<div ref={performanceRef} className="pt-4 md:pt-8">
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200">
							<CardHeader>
								<CardTitle className="text-base md:text-lg">Performance</CardTitle> {/* Corrected closing tag from </Title> to </CardTitle> */}
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 text-sm">Your academic performance overview.</p>
								<div className="h-48 md:h-64 mt-4">
									<Line data={performanceData} options={performanceOptions} />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Attendance Section */}
					<div ref={attendanceRef} className="pt-4 md:pt-8">
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200">
							<CardHeader>
								<CardTitle className="text-base md:text-lg">Attendance</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 text-sm">Your attendance records.</p>
								<div className="overflow-x-auto mt-4">
									<table className="min-w-full text-xs md:text-sm">
										<thead>
											<tr className="text-left border-b border-gray-200">
												<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Category</th>
												<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Attended</th>
												<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Total</th>
												<th className="pb-2 md:pb-3 text-xs md:text-sm font-medium text-gray-500">Percentage</th>
											</tr>
										</thead>
										<tbody>
											{/* Using the original attendanceData for this table, not the one for the graph */}
											{[
												{ label: 'overall attendance', total: 150, attended: 120 },
												{ label: 'subject A', total: 15, attended: 12 },
												{ label: 'subject B', total: 15, attended: 15 },
												{ label: 'subject C', total: 15, attended: 12 },
												{ label: 'subject D', total: 15, attended: 15 },
												{ label: 'subject E', total: 15, attended: 13 },
												{ label: 'subject F', total: 15, attended: 14 },
												{ label: 'subject G', total: 15, attended: 11 },
												{ label: 'subject H', total: 15, attended: 12 },
												{ label: 'subject I', total: 15, attended: 13 },
												{ label: 'subject J', total: 15, attended: 15 },
											].map((item, index) => (
												<tr key={index} className="border-b border-gray-100 last:border-b-0">
													<td className="py-2 md:py-3 text-gray-600 capitalize">{item.label}</td>
													<td className="py-2 md:py-3 text-gray-600">{item.attended}</td>
													<td className="py-2 md:py-3 text-gray-600">{item.total}</td>
													<td className="py-2 md:py-3 text-gray-600">
														{((item.attended / item.total) * 100).toFixed(0)}%
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Calendar Section */}
					<div ref={calendarRef} className="pt-4 md:pt-8">
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200">
							<CardHeader>
								<CardTitle className="text-base md:text-lg">Calendar</CardTitle>
							</CardHeader>
							<CardContent>
								<CalendarComponent /> {/* Integrated the new CalendarComponent */}
							</CardContent>
						</Card>
					</div>

					{/* Notifications Section */}
					<div ref={notificationsRef} className="pt-4 md:pt-8">
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200">
							<CardHeader>
								<CardTitle className="text-base md:text-lg">Notifications</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 text-sm">All your important notifications will appear here.</p>
								<div className="mt-3 md:mt-4 space-y-3 md:space-y-4">
									{announcements.map((announcement, index) => (
										<div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
											<Bell className="w-5 h-5 text-blue-600 flex-shrink-0" />
											<div>
												<h4 className="font-semibold text-gray-900 text-sm md:text-base">{announcement.title}</h4>
												<p className="text-xs md:text-sm text-gray-600">{announcement.desc}</p>
											</div>
										</div>
									))}
									<div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
										<Bell className="w-5 h-5 text-gray-600 flex-shrink-0" />
										<div>
											<h4 className="font-semibold text-gray-900 text-sm md:text-base">New Course Available</h4>
											<p className="text-xs md:text-sm text-gray-600">Check out the new "Advanced React Patterns" course!</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Feedback Section */}
					<div ref={feedbackRef} className="pt-4 md:pt-8">
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200">
							<CardHeader>
								<CardTitle className="text-base md:text-lg">Feedback</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 text-sm">Provide your valuable feedback to help us improve.</p>
								<form className="mt-3 md:mt-4 space-y-3 md:space-y-4">
									<div>
										<label htmlFor="feedbackSubject" className="block text-sm font-medium text-gray-700">Subject</label>
										<input
											type="text"
											id="feedbackSubject"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
											placeholder="Enter subject"
										/>
									</div>
									<div>
										<label htmlFor="feedbackMessage" className="block text-sm font-medium text-gray-700">Message</label>
										<textarea
											id="feedbackMessage"
											rows={4}
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
											placeholder="Write your feedback here..."
										></textarea>
									</div>
									<Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium">
										Submit Feedback
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export default StudentDashboard;