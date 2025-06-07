import { useState, useEffect } from 'react';
import {
  fetchTimetableMetrics,
  fetchWeeklySchedule,
  FetchWeeklyScheduleParams,
} from '../services/timetable.service';
import { TimetableMetrics, TimetableEntry } from '../types/timetable.types';

export interface TimetableDashboardData {
  metrics: TimetableMetrics | null;
  schedule: TimetableEntry[] | null;
}

const useTimetable = (params?: FetchWeeklyScheduleParams) => {
  const [data, setData] = useState<TimetableDashboardData>({
    metrics: null,
    schedule: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch metrics and schedule data in parallel
        const [metricsData, scheduleData] = await Promise.all([
          fetchTimetableMetrics(),
          fetchWeeklySchedule(params),
        ]);
        setData({ metrics: metricsData, schedule: scheduleData });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred while fetching timetable data.'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [params]); // Re-run the effect if the params for weekly schedule change

  return { data, loading, error }; // Exporting error state is also good practice
};

export default useTimetable;