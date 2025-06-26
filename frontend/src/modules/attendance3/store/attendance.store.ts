import { create } from "zustand";
import { AttendanceRecord, DailySummary } from "../types/attendance.types";

/**
 * Zustand store state and actions for attendance management.
 */
interface AttendanceStoreState {
  /** Array of attendance records */
  records: AttendanceRecord[];
  /** Currently selected subject ID */
  selectedSubjectId: string | null;
  /** Currently selected date (ISO string) */
  selectedDate: string | null;
  /** Loading state flag */
  loading: boolean;
  /** Error message, if any */
  error: string | null;
  /** Daily summary for analytics/reporting */
  dailySummary: DailySummary | null;

  /** Fetch attendance records for a subject and date */
  fetchAttendance: (subjectId: string, date: string) => Promise<void>;
  /** Mark (save) attendance records */
  markAttendance: (records: AttendanceRecord[]) => Promise<void>;
  /** Calculate daily summary from current records */
  calculateDailySummary: () => void;
  /** Sync offline attendance data with backend */
  syncOfflineData: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceStoreState>((set, get) => ({
  records: [],
  selectedSubjectId: null,
  selectedDate: null,
  loading: false,
  error: null,
  dailySummary: null,

  fetchAttendance: async (subjectId, date) => {
    set({ loading: true, error: null, selectedSubjectId: subjectId, selectedDate: date });
    try {
      // Replace with your API call
      const response = await fetch(`/api/attendance?subjectId=${subjectId}&date=${date}`);
      if (!response.ok) throw new Error("Failed to fetch attendance");
      const data: AttendanceRecord[] = await response.json();
      set({ records: data, loading: false });
      get().calculateDailySummary();
    } catch (error) {
      set({ error: error.message || "Error fetching attendance", loading: false });
    }
  },

  markAttendance: async (records) => {
    set({ loading: true, error: null });
    try {
      // Replace with your API call
      const response = await fetch(`/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(records),
      });
      if (!response.ok) throw new Error("Failed to mark attendance");
      set({ records, loading: false });
      get().calculateDailySummary();
    } catch (error) {
      set({ error: error.message || "Error marking attendance", loading: false });
    }
  },

  calculateDailySummary: () => {
    const { records, selectedDate } = get();
    if (!selectedDate) {
      set({ dailySummary: null });
      return;
    }
    const todaysRecords = records.filter(r => r.date === selectedDate);
    const presentCount = todaysRecords.filter(r => r.status === "Present").length;
    const absentCount = todaysRecords.filter(r => r.status === "Absent").length;
    const totalStudents = todaysRecords.length;
    set({
      dailySummary: {
        date: selectedDate,
        presentCount,
        absentCount,
        totalStudents,
      },
    });
  },

  syncOfflineData: async () => {
    // Example: sync local offline records with backend
    try {
      // Implement your offline sync logic here
      // For now, just a placeholder
      // await fetch("/api/attendance/sync", { ... });
    } catch (error) {
      set({ error: error.message || "Error syncing offline data" });
    }
  },
}));