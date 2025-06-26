import React, { useEffect, useState } from "react";
import { AttendanceStatus, AttendanceRecord } from "../types/attendance.types";
import { analyticsService } from "../services/analytics.service";
import { useAttendanceStore } from "../store/attendance.store";
import { Button } from "@/common/components/ui/button";

// Mock student list (replace with API call in production)
const mockStudents = [
  { id: "stu1", name: "Alice" },
  { id: "stu2", name: "Bob" },
  { id: "stu3", name: "Charlie" },
];

// Mock subjects (replace with API call in production)
const mockSubjects = [
  { id: "MATH101", name: "Mathematics" },
  { id: "PHY101", name: "Physics" },
  { id: "CHEM101", name: "Chemistry" },
];

const statusOptions: AttendanceStatus[] = [
  AttendanceStatus.Present,
  AttendanceStatus.Absent,
];

export const MarkAttendance: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string>(mockSubjects[0].id);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { markAttendance } = useAttendanceStore();

  useEffect(() => {
    // Optionally fetch students and attendance for the selected subject/date
    setAttendance({});
  }, [subjectId, date]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const records: AttendanceRecord[] = mockStudents.map((stu) => ({
        studentId: stu.id,
        subjectId,
        date,
        period: 1, // You can extend this for multiple periods
        status: attendance[stu.id] || AttendanceStatus.Absent,
      }));
      await analyticsService.markAttendance(records);
      markAttendance(records);
    } catch (err) {
      setError(err.message || "Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
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
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full mt-4 border">
            <thead>
              <tr>
                <th className="px-2 py-1 border">Student</th>
                {statusOptions.map((status) => (
                  <th key={status} className="px-2 py-1 border">
                    {status}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((stu) => (
                <tr key={stu.id}>
                  <td className="px-2 py-1 border">{stu.name}</td>
                  {statusOptions.map((status) => (
                    <td className="px-2 py-1 border text-center" key={status}>
                      <input
                        type="radio"
                        name={`attendance-${stu.id}`}
                        value={status}
                        checked={attendance[stu.id] === status}
                        onChange={() => handleStatusChange(stu.id, status)}
                        disabled={loading}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && <div className="text-red-600">{error}</div>}
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Submit Attendance"}
                </Button>
              </form>
            </div>
          );
        };