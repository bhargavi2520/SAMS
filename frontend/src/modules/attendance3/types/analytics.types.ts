/**
 * Enum for attendance trend direction.
 */
export enum AttendanceTrendDirection {
  UP = "UP",
  DOWN = "DOWN",
  STABLE = "STABLE",
}

/**
 * Analytics for a subject's attendance.
 */
export interface SubjectAttendanceAnalytics {
  subjectName: string;
  attendancePercentage: number;
  trend: AttendanceTrendDirection;
  totalClasses: number;
}

/**
 * Student risk profile for attendance.
 */
export interface StudentRiskProfile {
  studentId: string;
  studentName: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
}

/**
 * Daily analytics summary for attendance.
 */
export interface DailyAnalyticsSummary {
  date: string;
  totalPresent: number;
  totalAbsent: number;
  classHeld: number;
}