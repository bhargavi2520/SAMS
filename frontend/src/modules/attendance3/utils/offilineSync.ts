import { AttendanceRecord } from "../types/attendance.types";
import { analyticsService } from "../services/analytics.service";

/**
 * Key used for storing attendance records in localStorage.
 */
const LOCAL_STORAGE_KEY = "offline_attendance_records";

/**
 * Cache attendance records locally for offline use.
 * This enables offline-first design: users can mark attendance without a network,
 * and data will be synced when online.
 */
export function cacheAttendanceLocally(records: AttendanceRecord[]) {
  const existing = getCachedAttendance();
  const merged = [...existing, ...records];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
}

/**
 * Retrieve cached attendance records from localStorage.
 */
export function getCachedAttendance(): AttendanceRecord[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? (JSON.parse(data) as AttendanceRecord[]) : [];
}

/**
 * Sync cached attendance records to the server and clear local cache on success.
 * Should be called when network connectivity is restored.
 */
export async function syncCachedAttendanceToServer(): Promise<void> {
  const cached = getCachedAttendance();
  if (cached.length === 0) return;
  await analyticsService.markAttendance(cached);
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}