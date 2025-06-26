import { AttendanceRecord, AttendanceStatus } from "../types/attendance.types";

/**
 * Detects chronic absenteeism: 3 or more consecutive absents.
 */
export function detectChronicAbsenteeism(records: AttendanceRecord[]): boolean {
  let consecutiveAbsents = 0;
  // Sort by date ascending
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  for (const rec of sorted) {
    if (rec.status === AttendanceStatus.Absent) {
      consecutiveAbsents += 1;
      if (consecutiveAbsents >= 3) return true;
    } else {
      consecutiveAbsents = 0;
    }
  }
  return false;
}

/**
 * Detects sudden drop in attendance (>10% drop compared to previous week).
 * Returns true if such a drop is found.
 */
export function detectSuddenDrop(records: AttendanceRecord[]): boolean {
  // Group by week (ISO week)
  const weekMap: Record<string, { total: number; present: number }> = {};
  for (const rec of records) {
    const week = getISOWeek(rec.date);
    if (!weekMap[week]) weekMap[week] = { total: 0, present: 0 };
    weekMap[week].total += 1;
    if (rec.status === AttendanceStatus.Present) {
      weekMap[week].present += 1;
    }
  }
  const weeks = Object.keys(weekMap).sort();
  for (let i = 1; i < weeks.length; i++) {
    const prev = weekMap[weeks[i - 1]];
    const curr = weekMap[weeks[i]];
    const prevPct = prev.total ? prev.present / prev.total : 1;
    const currPct = curr.total ? curr.present / curr.total : 1;
    if (prevPct - currPct > 0.10) return true;
  }
  return false;
}

/**
 * Detects attendance improvement trend (consistent increase over 3 weeks).
 * Returns true if found.
 */
export function detectImprovementTrend(records: AttendanceRecord[]): boolean {
  // Group by week (ISO week)
  const weekMap: Record<string, { total: number; present: number }> = {};
  for (const rec of records) {
    const week = getISOWeek(rec.date);
    if (!weekMap[week]) weekMap[week] = { total: 0, present: 0 };
    weekMap[week].total += 1;
    if (rec.status === AttendanceStatus.Present) {
      weekMap[week].present += 1;
    }
  }
  const weeks = Object.keys(weekMap).sort();
  let streak = 0;
  for (let i = 1; i < weeks.length; i++) {
    const prev = weekMap[weeks[i - 1]];
    const curr = weekMap[weeks[i]];
    const prevPct = prev.total ? prev.present / prev.total : 0;
    const currPct = curr.total ? curr.present / curr.total : 0;
    if (currPct > prevPct) {
      streak += 1;
      if (streak >= 2) return true; // 3 weeks = 2 increases
    } else {
      streak = 0;
    }
  }
  return false;
}

/**
 * Helper: Get ISO week string (YYYY-WW) from date string.
 */
function getISOWeek(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getUTCFullYear();
  // Get Thursday of this week
  const d = new Date(date);
  d.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const weekNo = Math.ceil((((d.getTime() - new Date(d.getUTCFullYear(),0,1).getTime()) / 86400000) + 1) / 7);
  return `${year}-W${weekNo.toString().padStart(2, "0")}`;
}

/**
 * Detects and flags students at risk with reasons.
 * Returns: Array of { studentId, reasons: string[] }
 */
export function detectRiskStudents(records: AttendanceRecord[]): Array<{ studentId: string; reasons: string[] }> {
  // Group records by studentId
  const studentMap: Record<string, AttendanceRecord[]> = {};
  for (const rec of records) {
    if (!studentMap[rec.studentId]) studentMap[rec.studentId] = [];
    studentMap[rec.studentId].push(rec);
  }
  const flagged: Array<{ studentId: string; reasons: string[] }> = [];
  for (const [studentId, recs] of Object.entries(studentMap)) {
    const reasons: string[] = [];
    if (detectChronicAbsenteeism(recs)) reasons.push("Chronic absenteeism (3+ consecutive absents)");
    if (detectSuddenDrop(recs)) reasons.push("Sudden drop in attendance (>10% week-to-week)");
    if (detectImprovementTrend(recs)) reasons.push("Consistent improvement in attendance");
      if (reasons.length > 0) flagged.push({ studentId, reasons });
    }
    return flagged;
  }