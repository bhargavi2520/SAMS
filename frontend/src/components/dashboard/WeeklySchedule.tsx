import React from "react";
import { TimetableEntry } from "../../types/timetable.types"; // Assuming TimetableEntry might be used for other schedule items
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DateRange {
  startOfWeek: Date; // Should be the Monday of the week to display
}

interface WeeklyScheduleProps {
  dateRange: DateRange;
  scheduleData: TimetableEntry[]; // To be used for populating other schedule entries
  title?: string;
}

const getWeekDates = (monday: Date): { date: Date; label: string }[] => {
  const days = [];
  // Ensure consistent locale for day and date formatting
  const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
  });

  for (let i = 0; i < 5; i++) {
    // Monday to Friday
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    days.push({
      date: currentDate,
      label: `${dayFormatter.format(currentDate)} (${dateFormatter.format(currentDate)})`,
    });
  }
  return days;
};

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  dateRange,
  scheduleData, // This prop is accepted but not fully utilized in this specific implementation for the lunch break
  title = "Weekly Schedule",
}) => {
  const weekDayHeaders = getWeekDates(dateRange.startOfWeek);
  const lunchTimeSlot = "12:00 PM";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] min-w-[100px]">Time</TableHead>
                {weekDayHeaders.map((header) => (
                  <TableHead
                    key={header.label}
                    className="text-center min-w-[120px]"
                  >
                    {header.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Lunch Break Row */}
              <TableRow>
                <TableCell className="font-medium">{lunchTimeSlot}</TableCell>
                {weekDayHeaders.map((header) => (
                  <TableCell
                    key={`lunch-${header.label}`}
                    className="text-center bg-muted/30"
                  >
                    LUNCH BREAK
                  </TableCell>
                ))}
              </TableRow>
              {/* TODO: Render other schedule entries from scheduleData based on time and day */}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySchedule;
