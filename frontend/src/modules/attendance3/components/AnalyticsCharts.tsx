import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

/** Types for props */
interface DailyAttendancePoint {
  date: string;
  percentage: number;
}
interface SubjectAttendancePoint {
  subjectName: string;
  percentage: number;
}
interface PresentAbsentData {
  name: string;
  value: number;
}

interface AnalyticsChartsProps {
  dailyAttendance: DailyAttendancePoint[];
  subjectAttendance: SubjectAttendancePoint[];
  presentAbsent: PresentAbsentData[];
}

const COLORS = ["#22c55e", "#ef4444", "#f59e42", "#3b82f6"];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  dailyAttendance,
  subjectAttendance,
  presentAbsent,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {/* Line Chart: Daily Attendance % */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Daily Attendance %</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailyAttendance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Bar Chart: Subject-wise Attendance */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Subject-wise Attendance %</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={subjectAttendance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subjectName" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Bar dataKey="percentage" fill="#22c55e">
              {subjectAttendance.map((entry, idx) => (
                <Cell key={entry.subjectName} fill={entry.percentage < 75 ? "#ef4444" : "#22c55e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Pie Chart: Present vs Absent */}
      <div className="bg-white rounded shadow p-4 flex flex-col items-center">
        <h3 className="font-semibold mb-2">Present vs Absent</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={presentAbsent}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {presentAbsent.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};