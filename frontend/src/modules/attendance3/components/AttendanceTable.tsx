import React, { useMemo, useState } from "react";
import { AttendanceRecord, AttendanceStatus } from "../types/attendance.types";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  pageSize?: number;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, pageSize = 10 }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filter records by search (studentId or subjectId)
  const filtered = useMemo(() => {
    if (!search) return records;
    return records.filter(
      (rec) =>
        rec.studentId.toLowerCase().includes(search.toLowerCase()) ||
        rec.subjectId.toLowerCase().includes(search.toLowerCase())
    );
  }, [records, search]);

  // Pagination
  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  // Helper for row color
  const getRowClass = (rec: AttendanceRecord) => {
    if (rec.status === AttendanceStatus.Absent) return "bg-red-100";
    // Optionally, color-code by attendance % if you have that info
    return "";
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Search by student or subject"
          className="border px-2 py-1 rounded mr-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <span className="text-sm text-gray-500">
          Showing {paginated.length} of {filtered.length} records
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 border">Student ID</th>
              <th className="px-2 py-1 border">Subject ID</th>
              <th className="px-2 py-1 border">Date</th>
              <th className="px-2 py-1 border">Period</th>
              <th className="px-2 py-1 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((rec, idx) => (
              <tr key={idx} className={getRowClass(rec)}>
                <td className="px-2 py-1 border">{rec.studentId}</td>
                <td className="px-2 py-1 border">{rec.subjectId}</td>
                <td className="px-2 py-1 border">{rec.date}</td>
                <td className="px-2 py-1 border">{rec.period}</td>
                <td
                  className={`px-2 py-1 border font-semibold ${
                    rec.status === AttendanceStatus.Absent
                      ? "text-red-600"
                      : rec.status === AttendanceStatus.Present
                      ? "text-green-700"
                      : ""
                  }`}
                >
                  {rec.status}
                </td>
                </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-3">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="mx-2 text-sm text-gray-600">
            Page {page}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage((p) => (paginated.length < pageSize ? p : p + 1))}
            disabled={paginated.length < pageSize}
          >
            Next
          </button>
              </div>
            </div>
        );
      };
      
      export default AttendanceTable;