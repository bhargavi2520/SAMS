import { AttendanceRecord, SubjectAttendance, DailySummary, AttendanceStatus } from "../types/attendance.types";

/**
 * Calculate attendance percentage.
 * @param attended - Number of attended classes
 * @param total - Total number of classes
 * @returns Percentage (0-100), returns 0 if total is 0
 */
export function calculatePercentage(attended: number, total: number): number {
  if (total === 0) return 0;
  return parseFloat(((attended / total) * 100).toFixed(1));
}

/**
 * Generate subject-wise attendance summary from attendance records.
 * @param records - Array of AttendanceRecord
 * @returns Array of SubjectAttendance
 */
export function getSubjectWiseSummary(records: AttendanceRecord[]): SubjectAttendance[] {
  const summaryMap: Record<string, { subjectName: string; total: number; attended: number }> = {};

  records.forEach((rec) => {
    if (!summaryMap[rec.subjectId]) {
      summaryMap[rec.subjectId] = {
        subjectName: rec.subjectId, // Replace with subject name lookup if available
        total: 0,
        attended: 0,
      };
    }
    summaryMap[rec.subjectId].total += 1;
    if (rec.status === AttendanceStatus.Present) {
      summaryMap[rec.subjectId].attended += 1;
    }
  });

  return Object.entries(summaryMap).map(([subjectId, data]) => ({
    subjectId,
    subjectName: data.subjectName,
    totalClasses: data.total,
    attendedClasses: data.attended,
    attendancePercentage: calculatePercentage(data.attended, data.total),
  }));
}

/**
 * Generate overall daily attendance summary from attendance records.
 * @param records - Array of AttendanceRecord
 * @returns DailySummary
 */
export function getOverallSummary(records: AttendanceRecord[]): DailySummary {
  const presentCount = records.filter(
    (rec) => rec.status === AttendanceStatus.Present
  ).length;
  const absentCount = records.filter((rec) => rec.status === AttendanceStatus.Absent).length;
  const totalStudents = records.length > 0 ? records.length : 0;
  const date = records.length > 0 ? records[0].date : "";

    return {
      date,
      presentCount,
      absentCount,
      totalStudents,
    };
  }