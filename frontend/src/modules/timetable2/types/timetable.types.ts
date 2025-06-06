export interface TimetableEntry {
  id: string;
  day: string; // e.g., 'Monday'
  timeSlot: string; // e.g., '09:00-10:00'
  subject: string;
  faculty: string;
  room: string;
  // Add other relevant fields
}

export interface TimetableMetrics {
  totalClasses: number;
  labsScheduled: number;
  // Add other relevant metrics
}