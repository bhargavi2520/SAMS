import axios from "axios";
import { AttendanceRecord, SubjectAttendance } from "../types/attendance.types";

/**
 * Service for handling API calls related to attendance.
 * Assumes backend is in FastAPI.
 */
const BASE_URL = "/api/attendance";

export const attendanceService = {
  /**
   * Get attendance records for a specific subject and date.
   */
  async getAttendanceByDate(subjectId: string, date: string): Promise<AttendanceRecord[]> {
    try {
      const res = await axios.get<AttendanceRecord[]>(
        `${BASE_URL}/by-date`,
        { params: { subject_id: subjectId, date } }
      );
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to fetch attendance by date.");
    }
  },

  /**
   * Mark (save) attendance records.
   */
  async markAttendance(records: AttendanceRecord[]): Promise<void> {
    try {
      await axios.post(`${BASE_URL}/mark`, records);
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to mark attendance.");
    }
  },

  /**
   * Get subject-wise attendance summary for a student.
   */
  async getStudentAttendanceSummary(studentId: string): Promise<SubjectAttendance[]> {
    try {
      const res = await axios.get<SubjectAttendance[]>(
        `${BASE_URL}/student-summary`,
        { params: { student_id: studentId } }
      );
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to fetch student attendance summary.");
    }
  },

  /**
   * Get all students' attendance for a subject.
   */
  async getSubjectWiseAttendance(subjectId: string): Promise<AttendanceRecord[]> {
    try {
      const res = await axios.get<AttendanceRecord[]>(
        `${BASE_URL}/subject`,
        { params: { subject_id: subjectId } }
      );
      return res.data;
    } catch (error) {
          throw new Error(error.response?.data?.detail || "Failed to fetch subject-wise attendance.");
        }
      }
    };