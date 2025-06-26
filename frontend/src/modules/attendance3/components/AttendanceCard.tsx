import React from "react";

interface AttendanceCardProps {
  subjectName: string;
  percentage: number;
}

const getColor = (percentage: number) => {
  if (percentage >= 90) return "bg-green-100 text-green-800 border-green-400";
  if (percentage >= 75) return "bg-orange-100 text-orange-800 border-orange-400";
  return "bg-red-100 text-red-800 border-red-400";
};

const AttendanceCard: React.FC<AttendanceCardProps> = ({ subjectName, percentage }) => {
  const colorClass = getColor(percentage);

  return (
    <div className={`border rounded-lg p-4 shadow ${colorClass}`}>
      <div className="font-semibold text-lg mb-2">{subjectName}</div>
      <div className="text-3xl font-bold">{percentage.toFixed(1)}%</div>
    </div>
  );
};

export default AttendanceCard;