import axios from "axios";
import { AttendanceRecord, SubjectAttendance } from "../types/attendance.types";

/**
 * Service for interacting with attendance-related backend endpoints.
 */
export const analyticsService = {
  /**
   * Fetch attendance records for a specific subject and date.
   * @param subjectId - The subject's unique ID
   * @param date - The date (ISO format: YYYY-MM-DD)
   */
  async getAttendanceByDate(subjectId: string, date: string): Promise<AttendanceRecord[]> {
    try {
      const res = await axios.get<AttendanceRecord[]>(
        `/api/attendance?subjectId=${subjectId}&date=${date}`
      );
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch attendance records.");
    }
  },

  /**
   * Mark (save) attendance records.
   * @param records - Array of attendance records to save
   */
  async markAttendance(records: AttendanceRecord[]): Promise<void> {
    try {
      await axios.post(`/api/attendance/mark`, records);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to mark attendance.");
    }
  },

  /**
   * Get attendance summary for a student across all subjects.
   * @param studentId - The student's unique ID
   */
  async getStudentAttendanceSummary(studentId: string): Promise<SubjectAttendance[]> {
    try {
      const res = await axios.get<SubjectAttendance[]>(
        `/api/attendance/summary?studentId=${studentId}`
      );
      return res.data;
    } catch (error) {
          throw new Error(error.response?.data?.message || "Failed to fetch student attendance summary.");
        }
      },

  /**
   * Get all students' attendance records for a given subject/class.
   * @param subjectId - The subject or class unique ID
   */
  async getSubjectWiseAttendance(subjectId: string): Promise<AttendanceRecord[]> {
    try {
      const res = await axios.get<AttendanceRecord[]>(
        `/api/attendance/subject?subjectId=${subjectId}`
      );
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch subject-wise attendance.");
    }
  },
    };