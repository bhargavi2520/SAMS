import { AttendanceRecord, AttendanceStatus } from "../types/attendance.types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Helper to format attendance records for download/export.
 * Converts dates to readable format and status to label.
 */
export function formatForDownload(records: AttendanceRecord[]) {
  return records.map((rec) => ({
    "Student ID": rec.studentId,
    "Subject ID": rec.subjectId,
    "Date": new Date(rec.date).toLocaleDateString(),
    "Period": rec.period,
    "Status": formatStatus(rec.status),
  }));
}

/**
 * Format attendance status for display.
 */
function formatStatus(status: AttendanceStatus): string {
  switch (status) {
    case AttendanceStatus.Present:
      return "Present";
    case AttendanceStatus.Absent:
      return "Absent";
    default:
      return status;
  }
}

/**
 * Generate a PDF attendance report using jsPDF and autoTable.
 */
export function generatePDFReport(records: AttendanceRecord[], subjectName: string) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Attendance Report: ${subjectName}`, 14, 18);

  const tableData = formatForDownload(records).map((row) => [
    row["Student ID"],
    row["Subject ID"],
    row["Date"],
    row["Period"],
    row["Status"],
  ]);

  autoTable(doc, {
    head: [["Student ID", "Subject ID", "Date", "Period", "Status"]],
    body: tableData,
    startY: 28,
    styles: { fontSize: 10 },
  });

  doc.save(`Attendance_Report_${subjectName.replace(/\s+/g, "_")}.pdf`);
}

/**
 * Generate an Excel attendance report using xlsx.
 */
export function generateExcelReport(records: AttendanceRecord[]) {
  const formatted = formatForDownload(records);
  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "Attendance_Report.xlsx");
  }
  
  export const reportService = {
  formatForDownload,
  generatePDFReport,
  generateExcelReport,
};