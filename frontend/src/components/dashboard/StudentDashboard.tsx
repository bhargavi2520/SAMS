import React, { useRef, useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Home,
	FileText,
	ClipboardList,
	BarChart2,
	CheckSquare,
	Calendar,
	MessageCircle,
	Megaphone,
	User,
	Settings,
	LogOut,
} from 'lucide-react';
import { StudentProfile } from '@/types/auth.types';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

const sidebarItems = [
	{ label: 'Home', path: '#home', icon: <Home className="w-6 h-6" /> },
	{ label: 'Exams', path: '#exams', icon: <FileText className="w-6 h-6" /> },
	{ label: 'Results', path: '#results', icon: <BarChart2 className="w-6 h-6" /> },
	{ label: 'Attendance', path: '#attendance', icon: <CheckSquare className="w-6 h-6" /> },
	{ label: 'Announcements', path: '#announcements', icon: <Megaphone className="w-6 h-6" /> },
];

const schedule = [
	[
		{ time: '8:00 AM', subject: '4A - Physics' },
		{ time: '9:00 AM', subject: '3B - Physics' },
		{ time: '10:00 AM', subject: '2B - Physics' },
		{ time: '11:00 AM', subject: '1A - Chemistry' },
		{ time: '1:00 PM', subject: '6A - Chemisry' },
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

const getWeekDates = (date: dayjs.Dayjs) => {
	const startOfWeek = date.startOf('week').add(1, 'day'); // Monday
	return Array.from({ length: 6 }, (_, i) => startOfWeek.add(i, 'day')); // 6 days: Mon-Sat
};

const attendanceData = [
	{
		label: 'overall attendance',
		total: 150,
		attended: 120,
	},
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
];

// Example performance data (replace with real data as needed)
const performanceData = {
    labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5'],
    datasets: [
        {
            label: 'Percentage',
            data: [78, 82, 85, 80, 88],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.2)',
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#22c55e',
            fill: true,
        },
    ],
};

const performanceOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100,
            ticks: {
                stepSize: 10,
                callback: (value: number) => `${value}%`,
            },
        },
    },
};

const subjectDetails = [
    {
        subject: 'Physics',
        teacher: 'Dr. R. Sharma',
        book: 'Concepts of Physics (H.C. Verma)',
    },
    {
        subject: 'Chemistry',
        teacher: 'Ms. S. Rao',
        book: 'Modern Approach to Chemical Calculations (R.C. Mukherjee)',
    },
    {
        subject: 'Mathematics',
        teacher: 'Mr. A. Kumar',
        book: 'Mathematics for Class 12 (R.D. Sharma)',
    },
    {
        subject: 'Biology',
        teacher: 'Dr. P. Singh',
        book: 'Trueman’s Elementary Biology',
    },
    {
        subject: 'English',
        teacher: 'Mrs. N. Das',
        book: 'Hornbill (NCERT)',
    },
];

const StudentDashboard = () => {
	const { user } = useAuthStore();
	const studentProfile = user?.profile as StudentProfile;
	const today = dayjs();
	const [selectedDate, setSelectedDate] = useState<number>(today.date());
	const [selectedMonth, setSelectedMonth] = useState<number>(today.month());
	const [selectedYear, setSelectedYear] = useState<number>(today.year());

	const selectedDay = dayjs()
		.year(selectedYear)
		.month(selectedMonth)
		.date(selectedDate);

	const weekDates = getWeekDates(selectedDay);

	const [activeSection, setActiveSection] = useState<string>('Home');

	// Section refs for scrolling
	const homeRef = useRef<HTMLDivElement>(null);
	const examsRef = useRef<HTMLDivElement>(null);
	const resultsRef = useRef<HTMLDivElement>(null);
	const attendanceRef = useRef<HTMLDivElement>(null);
	const announcementsRef = useRef<HTMLDivElement>(null);

	const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
		Home: homeRef,
		Exams: examsRef,
		Results: resultsRef,
		Attendance: attendanceRef,
		Announcements: announcementsRef,
	};

	// Highlight nav icon on scroll (desktop & mobile)
	useEffect(() => {
		const sectionIds = ['Home', 'Exams', 'Results', 'Attendance', 'Announcements'];
		const sectionElements = sectionIds.map(id => sectionRefs[id]?.current);

		const handleScroll = () => {
			const scrollPosition = window.scrollY + 120; // Offset for nav height
			let found = false;
			for (let i = sectionElements.length - 1; i >= 0; i--) {
				const el = sectionElements[i];
				if (el && el.offsetTop <= scrollPosition) {
					setActiveSection(sectionIds[i]);
					found = true;
					break;
				}
			}
			if (!found) setActiveSection(sectionIds[0]);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleNavClick = (label: string) => {
		const ref = sectionRefs[label];
		if (ref && ref.current) {
			const yOffset = window.innerWidth < 768 ? -90 : -40; // Offset for mobile/desktop nav height
			const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
			setActiveSection(label);
		}
	};

	if (!studentProfile) {
		return (
			<div className="p-6">
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-gray-500">Loading student information...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-gray-50">
			{/* Desktop Vertical Navigation Bar */}
			<aside
				className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col"
				style={{ minHeight: '420px' }}
			>
				<div
					className="flex flex-col gap-2 px-2 py-6 rounded-2xl shadow-2xl border border-white/20"
					style={{
						background: 'rgba(255,255,255,0.25)',
						backdropFilter: 'blur(16px)',
						WebkitBackdropFilter: 'blur(16px)',
						boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
					}}
				>
					{sidebarItems.map((item) => (
						<Button
							key={item.label}
							variant="ghost"
							className={`p-0 m-0 bg-transparent rounded-xl flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    ${activeSection === item.label
								? 'bg-green-100 text-green-700 ring-2 ring-green-400'
								: 'hover:bg-white/40 text-gray-700'}`}
							style={{
								width: 56,
								height: 56,
								background: activeSection === item.label
									? 'rgba(187,247,208,0.85)'
									: 'rgba(255,255,255,0.85)',
								boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.10)',
								fontWeight: 500,
								fontSize: 22,
							}}
							onClick={() => handleNavClick(item.label)}
						>
							{item.icon}
						</Button>
					))}
				</div>
			</aside>

			{/* Main Content */}
			<main
				className="
                flex-1
                p-2
                md:p-8
                md:pl-32
                w-full
                flex
                justify-center
                items-start
                min-h-screen
            "
			>
				<div
					className="
                    w-[90vw]
                    md:w-full
                    max-w-5xl
                    mx-auto
                    grid
                    grid-cols-1
                    xl:grid-cols-[2fr_1fr]
                    gap-4
                    md:gap-8
                    px-2
                    md:px-0
                "
				>
					{/* Left: Home Section with Timetable */}
					<div ref={homeRef} id="home" className="flex flex-col gap-4">
						{/* Header row */}
						<div className="flex items-center justify-between mb-4 md:mb-8">
							<div className="flex items-center space-x-2">
								<span className="font-semibold text-lg text-gray-800">
									{`Hello ${studentProfile?.firstName || "Student"}, welcome back!`}
								</span>
							</div>
						</div>

						{/* Schedule */}
						<section className="w-full">
							<Card className="rounded-xl shadow bg-white">
								<CardHeader>
									<CardTitle>
										{weekDates[0].format('MMM D')} – {weekDates[5].format('D, YYYY')}
									</CardTitle>
									<CardDescription>
										Week of {weekDates[0].format('dddd')}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="overflow-x-auto">
										<table className="min-w-[600px] w-full text-xs md:text-sm">
											<thead>
												<tr>
													<th className="p-2 font-bold text-center">Time</th>
													{weekDates.map((date) => (
														<th key={date.format()} className="p-2 font-bold text-center">
															{date.format('ddd')}
															<br />
															<span className="text-xs font-normal">{date.format('D')}</span>
														</th>
													))}
												</tr>
											</thead>
											<tbody>
												{[...Array(6)].map((_, slotIdx) => (
													<tr key={slotIdx}>
														<td className="p-2 text-center font-semibold">
															{schedule[0][slotIdx]?.time}
														</td>
														{weekDates.map((_, dayIdx) => (
															<td key={dayIdx} className="p-2 text-center">
																<span className="inline-block bg-blue-100 rounded px-2 py-1 min-w-[80px]">
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
						</section>
					</div>

					{/* Right: Calendar and Subject Details */}
					<div className="flex flex-col gap-4">
						{/* Calendar */}
						<Card className="rounded-xl shadow bg-white">
							<CardHeader>
								<CardTitle>
									{dayjs().month(selectedMonth).format('MMMM')} {selectedYear}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
									{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
										<div key={d} className="font-bold">
											{d}
										</div>
									))}
									{(() => {
										const firstDay = dayjs()
											.year(selectedYear)
											.month(selectedMonth)
											.date(1);
										const daysInMonth = firstDay.daysInMonth();
										const startDay = (firstDay.day() + 6) % 7; // Monday as first day
										const cells = [];
										for (let i = 0; i < startDay; i++) {
											cells.push(<div key={`empty-${i}`}></div>);
										}
										for (let day = 1; day <= daysInMonth; day++) {
											const isToday =
												dayjs().isSame(
													dayjs()
														.year(selectedYear)
														.month(selectedMonth)
														.date(day),
													'day'
												);
											const isSelected = selectedDate === day && selectedMonth === selectedDay.month() && selectedYear === selectedDay.year();
											cells.push(
												<button
													key={day}
													className={`py-1 rounded w-full outline-none
                                                        ${isToday ? 'bg-green-300 font-bold' : ''}
                                                        ${isSelected ? 'ring-2 ring-green-500' : ''}
                                                        hover:bg-green-100 transition`}
													onClick={() => setSelectedDate(day)}
													type="button"
												>
													{day}
												</button>
											);
										}
										return cells;
									})()}
								</div>
								<div className="flex justify-between mt-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											if (selectedMonth === 0) {
												setSelectedMonth(11);
												setSelectedYear(selectedYear - 1);
											} else {
												setSelectedMonth(selectedMonth - 1);
											}
											setSelectedDate(1);
										}}
									>
										Prev
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											if (selectedMonth === 11) {
												setSelectedMonth(0);
												setSelectedYear(selectedYear + 1);
											} else {
												setSelectedMonth(selectedMonth + 1);
											}
											setSelectedDate(1);
										}}
									>
										Next
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Subject Details Section (right side on desktop, below calendar) */}
						<Card
							className="rounded-xl shadow bg-white flex-col hidden xl:flex"
							style={{
								height: 'calc(100% - 320px)',
								minHeight: '350px',
								maxHeight: '600px',
							}}
						>
							<CardHeader>
								<CardTitle>Subject & Teacher Details</CardTitle>
								<CardDescription>Key subjects, teachers, and reference books</CardDescription>
							</CardHeader>
							<CardContent
								className="overflow-y-auto"
								style={{
									flex: 1,
									minHeight: 0,
									maxHeight: '350px',
								}}
							>
								<table className="min-w-[300px] w-full text-xs md:text-sm">
									<thead>
										<tr>
											<th className="p-2 text-left font-bold">Subject</th>
											<th className="p-2 text-left font-bold">Teacher</th>
											<th className="p-2 text-left font-bold">Book Name</th>
										</tr>
									</thead>
									<tbody>
										{subjectDetails.map((s) => (
											<tr key={s.subject}>
												<td className="p-2">{s.subject}</td>
												<td className="p-2">{s.teacher}</td>
												<td className="p-2">{s.book}</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardContent>
						</Card>
					</div>

					{/* Subject Details Section for mobile (below timetable and calendar) */}
					<div className="block xl:hidden w-full mt-4">
						<Card className="rounded-xl shadow bg-white flex flex-col">
							<CardHeader>
								<CardTitle>Subject & Teacher Details</CardTitle>
								<CardDescription>Key subjects, teachers, and reference books</CardDescription>
							</CardHeader>
							<CardContent
								className="overflow-y-auto"
								style={{
									maxHeight: '300px',
								}}
							>
								<table className="min-w-[300px] w-full text-xs md:text-sm">
									<thead>
										<tr>
											<th className="p-2 text-left font-bold">Subject</th>
											<th className="p-2 text-left font-bold">Teacher</th>
											<th className="p-2 text-left font-bold">Book Name</th>
										</tr>
									</thead>
									<tbody>
										{subjectDetails.map((s) => (
											<tr key={s.subject}>
												<td className="p-2">{s.subject}</td>
												<td className="p-2">{s.teacher}</td>
												<td className="p-2">{s.book}</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardContent>
						</Card>
					</div>

					{/* Exams Section */}
					<div ref={examsRef} id="exams" className="xl:col-span-2 flex flex-col gap-4">
						<Card className="rounded-xl shadow bg-white">
							<CardHeader>
								<CardTitle>Exams</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">Your upcoming and past exams will appear here.</p>
							</CardContent>
						</Card>
					</div>

					{/* Performance Section */}
					<div ref={resultsRef} id="results" className="xl:col-span-2 flex flex-col gap-4">
						<Card className="rounded-xl shadow bg-white">
							<CardHeader>
								<CardTitle>Performance</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 mb-4">Your academic performance over recent terms:</p>
								<div className="w-full max-w-xl mx-auto">
                                    <Line data={performanceData} options={performanceOptions} />
                                </div>
							</CardContent>
						</Card>
					</div>

					{/* Attendance Section */}
					<div ref={attendanceRef} id="attendance" className="xl:col-span-2 flex flex-col gap-4">
						<Card className="rounded-xl shadow bg-white">
							<CardHeader>
								<CardTitle>Attendance</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="min-w-[500px] w-full text-xs md:text-sm">
										<thead>
											<tr>
												<th className="p-2 text-left font-bold">Subject</th>
												<th className="p-2 text-center font-bold">Number of Classes</th>
												<th className="p-2 text-center font-bold">Attended Classes</th>
												<th className="p-2 text-center font-bold">Present %</th>
												<th className="p-2 text-left font-bold">Progress</th>
											</tr>
										</thead>
										<tbody>
											{attendanceData.map((row, idx) => {
												const percent = row.total ? Math.round((row.attended / row.total) * 100) : 0;
												let barColor = 'bg-green-500';
												if (percent < 75) barColor = 'bg-red-400';
												else if (percent < 90) barColor = 'bg-blue-400';
												return (
													<tr key={row.label + idx}>
														<td className="p-2">{row.label}</td>
														<td className="p-2 text-center">{row.total}</td>
														<td className="p-2 text-center">{row.attended}</td>
														<td className="p-2 text-center">{percent}%</td>
														<td className="p-2">
															<div className="w-32 h-2 bg-gray-200 rounded">
																<div
																	className={`${barColor} h-2 rounded`}
																	style={{ width: `${percent}%` }}
																></div>
															</div>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Announcements Section */}
					<div ref={announcementsRef} id="announcements" className="xl:col-span-2 flex flex-col gap-4">
						<Card className="rounded-xl shadow bg-white">
							<CardHeader>
								<CardTitle>Announcements</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{announcements.map((a) => (
										<li key={a.title}>
											<div className="font-semibold">{a.title}</div>
											<div className="text-xs text-gray-600">{a.desc}</div>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					</div>

					{/* Bottom Navigation Bar (mobile only) */}
					<nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90vw] max-w-md z-50 flex justify-center md:hidden">
						<div
							className="flex w-full justify-between px-2 py-2 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg border border-white/30"
							style={{
								boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
								background: 'rgba(255,255,255,0.25)',
								backdropFilter: 'blur(12px)',
								WebkitBackdropFilter: 'blur(12px)',
							}}
						>
							{sidebarItems.map((item) => (
								<Button
									key={item.label}
									variant="ghost"
									className={`flex-1 flex flex-col items-center justify-center text-xl font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-xl
        ${activeSection === item.label
            ? 'bg-green-100 text-green-700 scale-105 shadow-lg'
            : 'hover:bg-white/30 text-gray-700 scale-100'}`}
									style={{
										background: activeSection === item.label ? 'rgba(187,247,208,0.85)' : 'transparent',
									}}
									onClick={() => handleNavClick(item.label)}
								>
									{item.icon}
								</Button>
							))}
						</div>
					</nav>
				</div>
			</main>
		</div>
	);
};

export default StudentDashboard;
