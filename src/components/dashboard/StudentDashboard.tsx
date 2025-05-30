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
];

const announcements = [
	{ title: 'Exam Schedule Released', desc: 'Check the exams section for the latest schedule.' },
	{ title: 'Holiday Notice', desc: 'School will be closed on Friday for a public holiday.' },
];

const StudentDashboard = () => {
	const { user } = useAuthStore();
	const studentProfile = user?.profile as StudentProfile;
	const today = dayjs();
	const [selectedDate, setSelectedDate] = useState<number | null>(today.date());
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
					{/* Home Section */}
					<div ref={homeRef} id="home" className="xl:col-span-2 flex flex-col gap-4">
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
									<CardTitle>September 16 – 20</CardTitle>
									<CardDescription>Work Week</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="overflow-x-auto">
										<table className="min-w-[600px] w-full text-xs md:text-sm">
											<thead>
												<tr>
													<th className="p-2 font-bold text-center">Time</th>
													{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
														<th key={day} className="p-2 font-bold text-center">
															{day}
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
														{schedule.map((day, dayIdx) => (
															<td key={dayIdx} className="p-2 text-center">
																<span className="inline-block bg-blue-100 rounded px-2 py-1 min-w-[80px]">
																	{day[slotIdx]?.subject || ''}
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

					{/* Results Section */}
					<div ref={resultsRef} id="results" className="xl:col-span-2 flex flex-col gap-4">
						<Card className="rounded-xl shadow bg-white">
							<CardHeader>
								<CardTitle>Results</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">Your results and grades will appear here.</p>
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
								<p className="text-gray-600">Your attendance records will appear here.</p>
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

					{/* Calendar, Events (optional, keep if you want) */}
					<section className="space-y-4 md:space-y-6 w-full">
						<Card className="rounded-xl shadow bg-white">
							<CardHeader>
								<CardTitle>September 2024</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-7 gap-1 text-center text-xs">
									{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
										<div key={d} className="font-bold">
											{d}
										</div>
									))}
									{[...Array(30)].map((_, i) => {
										const day = i + 1;
										const isToday =
											today.month() === 8 && // September is month 8 (0-indexed)
											today.date() === day &&
											today.year() === 2024;
										const isSelected = selectedDate === day;
										return (
											<button
												key={i}
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
									})}
								</div>
							</CardContent>
						</Card>
					</section>
				</div>
			</main>

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
	);
};

export default StudentDashboard;
