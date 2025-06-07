import React, { useRef, useState, useEffect, useCallback } from 'react';
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
import { StudentProfile } from '../../types/auth.types'; 
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
import DashboardNav from '../../../../components/dashboard/DashboardNav';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend, ArcElement, BarElement);

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
    { label: 'overall attendance', attended: 10, total: 15 },
    { label: 'subject A', attended: 12, total: 15 },
    { label: 'subject B', attended: 15, total: 15 },
    { label: 'subject C', attended: 12, total: 15 },
    { label: 'subject D', attended: 15, total: 15 },
    { label: 'subject E', attended: 13, total: 15 },
    { label: 'subject F', attended: 14, total: 15 },
    { label: 'subject G', attended: 11, total: 15 },
    { label: 'subject H', attended: 12, total: 15 },
    { label: 'subject I', attended: 13, total: 15 },
    { label: 'subject J', attended: 15, total: 15 },
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

const GPA_Calculator = () => {
	const [grades, setGrades] = useState(mockGrades);
	const [gpa, setGpa] = useState<string | null>(null);

	const calculateGpa = useCallback(() => {
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
	}, [grades]);

	useEffect(() => {
		calculateGpa(); // Calculate GPA on initial load
	}, [grades, calculateGpa]);

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

// CircularProgress for attendance percentage (no percentage text inside)
const CircularProgress = ({ percent }: { percent: number }) => {
    let color = "#22c55e"; // green
    if (percent < 75) color = "#ef4444"; // red
    else if (percent < 90) color = "#3b82f6"; // blue

    const radius = 16;
    const stroke = 4;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const offset = circumference * (1 - percent / 100);

    return (
        <svg width={radius * 2} height={radius * 2}>
            <circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                stroke="#e5e7eb"
                strokeWidth={stroke}
                fill="none"
            />
            <circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                stroke={color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.3s" }}
            />
        </svg>
    );
};

const StudentDashboard = () => {
	 //const { user } = useAuthStore(); 
	// Mock studentProfile as useAuthStore is not available in this context
	const studentProfile: StudentProfile = {
		id: "1",
		userId: "user-1",
		firstName: "Marcela",
		lastName: "Santos",
		email: "marcela.santos@gmail.com",
		phoneNumber: "7894232145",
		profilePictureUrl: undefined,
		rollNumber: "2024PHY001",
		dateOfBirth: "2004-05-19",
		gender: "FEMALE",
		personalEmail: undefined,
		parentName: "Carlos Santos",
		parentPhone: "9876543210",
		currentSemester: 4,
		branch: "Physics",
		courseProgram: "BSc Physics",
		section: undefined,
		studentStatus: "ACTIVE",
		feeStatus: "PAID",
		enrollmentYear: 2022,
		current_academic_year: "2024-2025",
		currentAddress: "123 Main Street, City, Country",
		permanentAddress: "456 Secondary Street, City, Country",
		aparId: undefined,
	};


	const [activeSection, setActiveSection] = useState<string>('dashboard'); // Set initial active section to My Profile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar visibility

	// Section refs for scrolling
	const dashboardRef = useRef<HTMLDivElement>(null);
	const myProfileRef = useRef<HTMLDivElement>(null);
	const subjectsFacultyRef = useRef<HTMLDivElement>(null); // Renamed ref
	const timetableRef = useRef<HTMLDivElement>(null);
	const examsRef = useRef<HTMLDivElement>(null);
	const performanceRef = useRef<HTMLDivElement>(null);
	const attendanceRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const feedbackRef = useRef<HTMLDivElement>(null);


	const sectionRefs = {
		dashboard: dashboardRef,
		'my-profile': myProfileRef,
		'subjects-faculty': subjectsFacultyRef,
		timetable: timetableRef,
		exams: examsRef,
		performance: performanceRef,
		attendance: attendanceRef,
		notifications: notificationsRef,
		feedback: feedbackRef,
	};

	const handleNavClick = (section) => {
		setActiveSection(section);
		const ref = sectionRefs[section];
		if (ref && ref.current) {
			ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
			setIsSidebarOpen(false);
		}
	};

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

	// Add scroll listener to update activeSection
	useEffect(() => {
		const handleScroll = () => {
			const sections = [
				{ section: 'my-profile', ref: myProfileRef },
				{ section: 'dashboard', ref: dashboardRef },
				{ section: 'timetable', ref: timetableRef },
				{ section: 'subjects-faculty', ref: subjectsFacultyRef },
				{ section: 'exams', ref: examsRef },
				{ section: 'performance', ref: performanceRef },
				{ section: 'attendance', ref: attendanceRef },
				{ section: 'notifications', ref: notificationsRef },
				{ section: 'feedback', ref: feedbackRef },
			];
			const scrollPosition = window.scrollY + 120; // Offset for nav

			let current = 'my-profile';
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

	// Feedback form state (moved above conditional)
	const [feedbackRecipient, setFeedbackRecipient] = useState<string>('College');
	const [feedbackText, setFeedbackText] = useState<string>('');
	const [feedbackSubmitting, setFeedbackSubmitting] = useState<boolean>(false);
	const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);
	const [feedbackError, setFeedbackError] = useState<string | null>(null);

	// Build recipient options: College + all teachers from subjectsFaculty
	const feedbackRecipients = [
		{ label: 'College', value: 'College' },
		...subjectsFaculty.map((s) => ({ label: s.teacher, value: s.teacher }))
	];

	const handleFeedbackSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setFeedbackSubmitting(true);
		setFeedbackSuccess(false);
		setFeedbackError(null);
		// Simulate async submit
		setTimeout(() => {
			if (feedbackText.trim().length === 0) {
				setFeedbackError('Feedback cannot be empty.');
				setFeedbackSubmitting(false);
				return;
			}
			// Here you would send feedbackRecipient and feedbackText to backend
			setFeedbackSuccess(true);
			setFeedbackText('');
			setFeedbackRecipient('College');
			setFeedbackSubmitting(false);
		}, 1000);
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
			<DashboardNav activeSection={activeSection} onNavClick={handleNavClick} dashboardType="student" />
			<main className="flex-1 overflow-auto md:ml-20 pb-16 md:pb-0">
				<div className="p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6">
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
											<span className="font-medium">Date of birth:</span> {dayjs(studentProfile?.dateOfBirth).format('DD/MM/YYYY') || "18/02/1999"}
										</div>
										<div>
											<span className="font-medium">Phone:</span> {studentProfile?.phoneNumber || "(44) 99704-8887"}
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
						<Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-4 md:p-6">
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

								{/* Fee Due Details */}
								<Card className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
									<CardHeader>
										<CardTitle className="text-base md:text-lg font-semibold text-gray-900">Fee Due Details</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="overflow-x-auto w-full">
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
            <p className="text-gray-600 text-sm mb-4">Your attendance records.</p>
            {/* Desktop/tablet table */}
            <div className="overflow-x-auto mt-4 hidden sm:block">
                <table className="min-w-full text-xs md:text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-2 md:pb-3 font-semibold text-gray-500 text-left">Category</th>
                            <th className="pb-2 md:pb-3 font-semibold text-gray-500 text-center">Number of Classes<br className="hidden md:block" />Till Date</th>
                            <th className="pb-2 md:pb-3 font-semibold text-gray-500 text-center">Attended<br className="hidden md:block" />Classes</th>
                            <th className="pb-2 md:pb-3 font-semibold text-gray-500 text-center">Present<br className="hidden md:block" />Percentage</th>
                            <th className="pb-2 md:pb-3 font-semibold text-gray-500 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((item, index) => {
                            const percent = item.total > 0 ? Math.round((item.attended / item.total) * 100) : 0;
                            return (
                                <tr
                                    key={index}
                                    className={`transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                >
                                    <td className="py-3 px-2 text-gray-700 capitalize font-medium">{item.label}</td>
                                    <td className="py-3 px-2 text-center text-gray-700">{item.total}</td>
                                    <td className="py-3 px-2 text-center text-gray-700">{item.attended}</td>
                                    <td className="py-3 px-2 text-center text-gray-900 font-semibold">{percent}%</td>
                                    <td className="py-3 px-2 w-20 text-center">
                                        <CircularProgress percent={percent} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col gap-3 mt-2">
                {attendanceData.map((item, index) => {
                    const percent = item.total > 0 ? Math.round((item.attended / item.total) * 100) : 0;
                    return (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <CircularProgress percent={percent} />
                                <span className="ml-2 mr-2 text-base font-semibold text-gray-900">{percent}%</span>
                                <div>
                                    <div className="font-semibold text-gray-800 capitalize text-sm">{item.label}</div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-medium">{item.attended}</span> / {item.total} classes
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
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
					<div ref={feedbackRef} className="pt-4 md:pt-8 pb-8">
                        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-base md:text-lg">Feedback</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">We value your feedback! Please let us know your thoughts or suggestions below.</p>
                                <form onSubmit={handleFeedbackSubmit}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={feedbackRecipient}
                                        onChange={e => setFeedbackRecipient(e.target.value)}
                                        disabled={feedbackSubmitting}
                                    >
                                        {feedbackRecipients.map((r) => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={4}
                                        placeholder="Type your feedback here..."
                                        value={feedbackText}
                                        onChange={e => setFeedbackText(e.target.value)}
                                        disabled={feedbackSubmitting}
                                    />
                                    {feedbackError && <div className="text-red-600 text-xs mb-2">{feedbackError}</div>}
                                    {feedbackSuccess && <div className="text-green-600 text-xs mb-2">Thank you for your feedback!</div>}
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60"
                                        disabled={feedbackSubmitting}
                                    >
                                        {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
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

function useAuthStore(): { user: any; } {
	throw new Error('Function not implemented.');
}
