import React, { useMemo } from 'react';
import KpiCard from '../components/dashboard/KpiCard';
import WeeklySchedule from '../components/dashboard/WeeklySchedule';
import QuickActions from '../components/dashboard/QuickActions';
import useTimetable from '../hooks/useTimetable';
import { BookOpen, FlaskConical, Users, MapPin } from 'lucide-react';
import { TimetableEntry } from '../types/timetable.types'; // Still relevant for data.schedule
import DashboardNav from '../../../components/dashboard/DashboardNav';

interface KpiDataItem {
  title: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
}

const TimetableDashboard = () => {
  // Example: Fetch schedule for the current week.
  // You might want a more sophisticated way to determine the weekId or params.
  const { data, loading, error } = useTimetable({ weekId: 'current' }); // Using the hook

  // Memoize Kpi data to prevent re-computation if not needed
  const kpiDisplayData = useMemo(() => {
    if (!data?.metrics) return [];
    return [
      { title: "Total Classes", value: data.metrics.totalClasses, trend: "+5%", icon: <BookOpen className="h-5 w-5 text-muted-foreground" /> },
      { title: "Labs Scheduled", value: data.metrics.labsScheduled, trend: "-2%", icon: <FlaskConical className="h-5 w-5 text-muted-foreground" /> },
      // Add other KPIs based on data.metrics.
      // For example, if you add facultyOccupancy and roomUtilization to TimetableMetrics:
      // { title: "Faculty Occupancy", value: data.metrics.facultyOccupancy || 0, trend: "+1.2%", icon: <Users className="h-5 w-5 text-muted-foreground" /> },
      // { title: "Room Utilization", value: data.metrics.roomUtilization || 0, trend: "+3%", icon: <MapPin className="h-5 w-5 text-muted-foreground" /> },
    ];
  }, [data?.metrics]);

  // Determine the start of the week for WeeklySchedule
  // This is a simplified example; you'll need robust date logic
  const startOfWeekForSchedule = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    const newDate = new Date(today); // Create a new date object to avoid mutating `today` if it's used elsewhere
    newDate.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // Adjust to Monday
    newDate.setHours(0, 0, 0, 0); // Set to the beginning of the day
    return newDate;
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4 md:p-6 text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 md:p-6 text-center text-red-500">Error loading data: {error.message}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <DashboardNav activeSection={"Timetable"} onNavClick={() => {}} dashboardType="timetable" />
      <main className="flex-1 overflow-auto md:ml-20 pb-16 md:pb-0">
        <div className="p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Timetable Dashboard</h1>

          {/* KPI Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {kpiDisplayData.map((kpi) => (
              <KpiCard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value ?? 0} // Provide a fallback for value if it can be undefined
                trend={kpi.trend}
                icon={kpi.icon}
              />
            ))}
          </div>

          <QuickActions />

          <div className="overflow-x-auto w-full">
            <WeeklySchedule
              scheduleData={data?.schedule || []}
              title="Weekly Schedule"
              dateRange={{ startOfWeek: startOfWeekForSchedule }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimetableDashboard;