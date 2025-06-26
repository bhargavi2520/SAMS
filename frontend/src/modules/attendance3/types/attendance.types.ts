export enum AttendanceStatus {
  Present = "Present",
  Absent = "Absent",
}

/**
 * Represents a single attendance record for a student in a subject and period.
 */
export interface AttendanceRecord {
  studentId: string;
  subjectId: string;
  /** Date of the attendance record (ISO format: YYYY-MM-DD) */
  date: string;
  /** Period number (1 to 6) */
  period: number;
  /** Attendance status for the period */
  status: AttendanceStatus;
}

/**
 * Aggregated attendance data for a subject for a student.
 */
export interface SubjectAttendance {
  /** Unique identifier for the subject */
  subjectId: string;
  /** Name of the subject */
  subjectName: string;
  /** Total number of classes held */
  totalClasses: number;
  /** Number of classes attended by the student */
  attendedClasses: number;
  /** Attendance percentage (0-100) */
  attendancePercentage: number;
}

/**
 * Daily summary of attendance for analytics and reporting.
 */
export interface DailySummary {
  /** Date of the summary (ISO format: YYYY-MM-DD) */
  date: string;
  /** Number of students present */
  presentCount: number;
  /** Number of students absent */
  absentCount: number;
  /** Total number of students */
  totalStudents: number;
}