import { useCallback } from "react";
import { useAttendanceStore } from "../store/attendance.store";
import { AttendanceRecord } from "../types/attendance.types";
import { analyticsService } from "../services/analytics.service";
import { syncCachedAttendanceToServer } from "../utils/offilineSync";

/**
 * Custom hook for managing attendance operations with Zustand.
 */
export function useAttendance() {
  const {
    records,
    selectedSubjectId,
    selectedDate,
    loading,
    error,
    dailySummary,
    fetchAttendance,
    markAttendance,
    calculateDailySummary,
    syncOfflineData,
  } = useAttendanceStore();

  // Fetch attendance and update store
  const fetch = useCallback(
    async (subjectId: string, date: string) => {
      await fetchAttendance(subjectId, date);
    },
    [fetchAttendance]
  );

  // Mark attendance and update store
  const mark = useCallback(
    async (records: AttendanceRecord[]) => {
      await markAttendance(records);
    },
    [markAttendance]
  );

  // Sync offline data and refresh
  const sync = useCallback(async () => {
    await syncCachedAttendanceToServer();
    if (selectedSubjectId && selectedDate) {
      await fetchAttendance(selectedSubjectId, selectedDate);
    }
  }, [selectedSubjectId, selectedDate, fetchAttendance]);

  // Refresh attendance data
  const refresh = useCallback(async () => {
    if (selectedSubjectId && selectedDate) {
      await fetchAttendance(selectedSubjectId, selectedDate);
    }
  }, [selectedSubjectId, selectedDate, fetchAttendance]);

    return {
      records,
      selectedSubjectId,
      selectedDate,
      loading,
      error,
      dailySummary,
      fetchAttendance: fetch,
      markAttendance: mark,
      syncOfflineData: sync,
      refreshAttendance: refresh,
    };
  }