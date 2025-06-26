import React, { useEffect, useState } from "react";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import { analyticsService } from "../services/analytics.service";
import { useAttendanceStore } from "../store/attendance.store";
import { AttendanceRecord } from "../types/attendance.types";
import { detectRiskStudents } from "../utils/patternDetection";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// Mock class/section list (replace with API call in production)
const mockClasses = [
  { id: "CSE-A", name: "CSE - A" },
  { id: "CSE-B", name: "CSE - B" },
  { id: "ECE-A", name: "ECE - A" },
];

const AttendanceAnalytics: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>(mockClasses[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chart data states
  const [dailyAttendance, setDailyAttendance] = useState<{ date: string; percentage: number }[]>([]);
  const [subjectAttendance, setSubjectAttendance] = useState<{ subjectName: string; percentage: number }[]>([]);
  const [presentAbsent, setPresentAbsent] = useState<{ name: string; value: number }[]>([]);
  const [riskStudents, setRiskStudents] = useState<{ studentId: string; reasons: string[] }[]>([]);

  // Zustand store for attendance records (if needed)
  // const { records, fetchAttendance } = useAttendanceStore();

  // Fetch analytics data when class changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all attendance records for the selected class (replace with real API)
        const classRecords: AttendanceRecord[] = await analyticsService.getSubjectWiseAttendance(selectedClass);

        // 1. Line chart: attendance % over past 30 days
        const dateMap: Record<string, { total: number; present: number }> = {};
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          dateMap[key] = { total: 0, present: 0 };
        }
        classRecords.forEach((rec) => {
          const key = rec.date.slice(0, 10);
          if (dateMap[key]) {
            dateMap[key].total += 1;
            if (rec.status === "Present") dateMap[key].present += 1;
          }
        });
        setDailyAttendance(
          Object.entries(dateMap).map(([date, { total, present }]) => ({
            date,
            percentage: total ? parseFloat(((present / total) * 100).toFixed(1)) : 0,
          }))
        );

        // 2. Bar chart: subject-wise attendance %
        const subjMap: Record<string, { total: number; present: number }> = {};
        classRecords.forEach((rec) => {
          if (!subjMap[rec.subjectId]) subjMap[rec.subjectId] = { total: 0, present: 0 };
          subjMap[rec.subjectId].total += 1;
          if (rec.status === "Present" ) subjMap[rec.subjectId].present += 1;
        });
        setSubjectAttendance(
          Object.entries(subjMap).map(([subjectName, { total, present }]) => ({
            subjectName,
            percentage: total ? parseFloat(((present / total) * 100).toFixed(1)) : 0,
          }))
        );

        // 3. Pie chart: present vs absent for selected class
        let presentCount = 0,
          absentCount = 0;
        classRecords.forEach((rec) => {
          if (rec.status === "Present") presentCount += 1;
          else if (rec.status === "Absent") absentCount += 1;
        });
        setPresentAbsent([
          { name: "Present", value: presentCount },
          { name: "Absent", value: absentCount },
        ]);

        // 4. Risk students
        setRiskStudents(detectRiskStudents(classRecords));
      } catch (err) {
        setError(err.message || "Failed to fetch analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedClass]);

  // Badge color helper
  const getBadgeColor = (reasons: string[]) => {
    if (reasons.some((r) => r.toLowerCase().includes("chronic"))) return "bg-red-500";
    if (reasons.some((r) => r.toLowerCase().includes("drop"))) return "bg-yellow-400";
    if (reasons.some((r) => r.toLowerCase().includes("improvement"))) return "bg-green-500";
    return "bg-gray-300";
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Real-Time Attendance Analytics</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="font-medium">Class:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {mockClasses.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10 text-lg text-blue-600">Loading analytics...</div>
      ) : error ? (
        <div className="text-center py-10 text-lg text-red-600">{error}</div>
      ) : (
        <>
          <AnalyticsCharts
            dailyAttendance={dailyAttendance}
            subjectAttendance={subjectAttendance}
            presentAbsent={presentAbsent}
          />
          {/* Students at Risk */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Students at Risk</h2>
            {riskStudents.length === 0 ? (
              <div className="text-gray-500">No students flagged at risk.</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {riskStudents.map((stu) => (
                  <div
                    key={stu.studentId}
                    className={`flex items-center px-3 py-2 rounded text-white ${getBadgeColor(stu.reasons)}`}
                    data-tooltip-id={`tooltip-${stu.studentId}`}
                  >
                    <span className="font-semibold mr-2">{stu.studentId}</span>
                    <span className="text-xs">
                      {stu.reasons.join(", ")}
                    </span>
                    <Tooltip id={`tooltip-${stu.studentId}`} place="top" content={stu.reasons.join(", ")} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceAnalytics;