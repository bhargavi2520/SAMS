import React, { useEffect } from "react";
import { useAttendanceStore } from "../store/attendance.store";
import { SubjectAttendance } from "../types/attendance.types";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export const AttendanceDashboard: React.FC = () => {
  const [subjects, setSubjects] = React.useState<SubjectAttendance[]>([]);
  const { records, selectedSubjectId, selectedDate, fetchAttendance } = useAttendanceStore();

  // Mock: Fetch subject attendance summary (replace with real API/service)
  useEffect(() => {
    // Replace with real API call if available
    async function fetchSummary() {
      // Example mock data
      const mock: SubjectAttendance[] = [
        {
          subjectId: "MATH101",
          subjectName: "Mathematics",
          totalClasses: 40,
          attendedClasses: 30,
          attendancePercentage: 75,
        },
        {
          subjectId: "PHY101",
          subjectName: "Physics",
          totalClasses: 38,
          attendedClasses: 25,
          attendancePercentage: 65.8,
        },
        {
          subjectId: "CHEM101",
          subjectName: "Chemistry",
          totalClasses: 42,
          attendedClasses: 39,
          attendancePercentage: 92.8,
        },
      ];
      setSubjects(mock);
    }
    fetchSummary();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.subjectId}
            className="bg-white rounded-lg shadow p-5 flex flex-col items-start relative"
          >
            <div className="flex items-center w-full">
              <span className="font-semibold text-lg">{subject.subjectName}</span>
              {subject.attendancePercentage < 75 && (
                <ExclamationTriangleIcon
                  className="w-6 h-6 text-yellow-500 ml-2"
                  title="Attendance below 75%"
                />
              )}
            </div>
            <div className="mt-2 text-gray-600 text-sm">
              <div>
                <span className="font-medium">Total Classes:</span> {subject.totalClasses}
              </div>
              <div>
                <span className="font-medium">Attended:</span> {subject.attendedClasses}
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold text-blue-600">
              {subject.attendancePercentage.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};