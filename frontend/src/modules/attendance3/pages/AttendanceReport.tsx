import React, { useEffect, useState } from "react";
import { attendanceService } from "../services/attendance.service";
import { reportService } from "../services/report.service";
import { AttendanceRecord } from "../types/attendance.types";
import { useAttendanceStore } from "../store/attendance.store";

// Mock subject list (replace with API call in production)
const mockSubjects = [
  { id: "MATH101", name: "Mathematics" },
  { id: "PHY101", name: "Physics" },
  { id: "CHEM101", name: "Chemistry" },
];

const ATTENDANCE_THRESHOLD = 75;

interface StudentReportRow {
  studentId: string;
  studentName: string;
  subject: string;
  attendancePercentage: number;
}

const AttendanceReport: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string>(mockSubjects[0].id);
  const [dateFrom, setDateFrom] = useState<string>(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10));
  const [dateTo, setDateTo] = useState<string>(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [reportRows, setReportRows] = useState<StudentReportRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Zustand store for possible global state
  const { records: storeRecords, fetchAttendance, loading: storeLoading, error: storeError } = useAttendanceStore();

  // Fetch attendance data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your backend API for subject-wise attendance in date range
        const allRecords: AttendanceRecord[] = await attendanceService.getSubjectWiseAttendance(subjectId);
        // Filter by date range
        const filtered = allRecords.filter(
          (rec) => rec.date >= dateFrom && rec.date <= dateTo
        );
        setRecords(filtered);

        // Group by student
        const studentMap: Record<string, { name: string; total: number; present: number }> = {};
        filtered.forEach((rec) => {
          // Replace with real student name lookup if available
          const studentName = rec.studentId;
          if (!studentMap[rec.studentId]) {
            studentMap[rec.studentId] = { name: studentName, total: 0, present: 0 };
          }
          studentMap[rec.studentId].total += 1;
          if (rec.status === "Present") {
            studentMap[rec.studentId].present += 1;
          }
        });

        const rows: StudentReportRow[] = Object.entries(studentMap).map(
          ([studentId, data]) => ({
            studentId,
            studentName: data.name,
            subject: mockSubjects.find((s) => s.id === subjectId)?.name || subjectId,
            attendancePercentage: data.total
              ? parseFloat(((data.present / data.total) * 100).toFixed(1))
              : 0,
          })
        );
        setReportRows(rows);
      } catch (err) {
        setError(err.message || "Failed to fetch attendance data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId, dateFrom, dateTo]);

  // Summary calculations
  const totalStudents = reportRows.length;
  const avgAttendance =
    totalStudents > 0
      ? parseFloat(
          (
            reportRows.reduce((sum, row) => sum + row.attendancePercentage, 0) /
            totalStudents
          ).toFixed(1)
        )
      : 0;
  const belowThreshold = reportRows.filter((row) => row.attendancePercentage < ATTENDANCE_THRESHOLD).length;

  // Download handlers
  const handleDownloadPDF = () => {
    reportService.generatePDFReport(records, mockSubjects.find((s) => s.id === subjectId)?.name || subjectId);
  };

  const handleExportExcel = () => {
    reportService.generateExcelReport(records);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Report</h1>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select
            className="border rounded px-2 py-1"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {mockSubjects.map((subj) => (
              <option key={subj.id} value={subj.id}>
                {subj.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={handleDownloadPDF}
            disabled={loading || records.length === 0}
          >
            Download PDF
          </button>
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            onClick={handleExportExcel}
            disabled={loading || records.length === 0}
          >
            Export Excel
          </button>
        </div>
      </div>
      {/* Summary Card */}
      <div className="flex gap-6 mb-6">
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="text-gray-500 text-sm">Total Students</div>
          <div className="text-2xl font-bold">{totalStudents}</div>
        </div>
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="text-gray-500 text-sm">Average Attendance %</div>
          <div className="text-2xl font-bold">{avgAttendance}%</div>
        </div>
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="text-gray-500 text-sm">Below {ATTENDANCE_THRESHOLD}%</div>
          <div className="text-2xl font-bold">{belowThreshold}</div>
        </div>
      </div>
      {/* Report Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">Student Name</th>
              <th className="px-3 py-2 text-left">Subject</th>
              <th className="px-3 py-2 text-left">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="text-center text-red-600 py-6">
                  {error}
                </td>
              </tr>
            ) : reportRows.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">
                  No data found.
                </td>
              </tr>
            ) : (
              reportRows.map((row) => (
                <tr
                  key={row.studentId}
                  className={row.attendancePercentage < ATTENDANCE_THRESHOLD ? "bg-red-50" : ""}
                >
                  <td className="px-3 py-2">{row.studentName}</td>
                  <td className="px-3 py-2">{row.subject}</td>
                  <td className="px-3 py-2 font-semibold">
                    {row.attendancePercentage}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;