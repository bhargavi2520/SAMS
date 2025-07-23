import React, { useState, useEffect, useMemo } from 'react';
import DashboardNav from '../../user-management1/components/dashboard/DashboardNav';
import { toast } from "@/common/hooks/use-toast";
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import apiClient from '@/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CSD', 'CSM'];
const years = ['1', '2', '3', '4'];
const sections = ['1', '2', '3'];

// TypeScript interfaces
interface Subject {
  subject_id: string;
  subject_name: string;
  faculty_id?: string;
  faculty_name?: string;
}

interface TimetableCell {
  subject: string;
  faculty: string;
  facultyName: string;
  startTime: string;
  endTime: string;
}

const TimetableDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Parse query params
  const queryParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      branch: params.get('branch') || '',
      year: params.get('year') || '',
      section: params.get('section') || '',
    };
  }, [location.search]);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  // Step 1: Setup form state
  const [setup, setSetup] = useState({
    branch: queryParams.branch,
    year: queryParams.year,
    section: queryParams.section,
    periods: 6,
  });
  const [step, setStep] = useState(1);

  // Step 2: Timetable grid state
  const [timetable, setTimetable] = useState<TimetableCell[][]>([]); // 2D array: days x periods

  // Add these state variables at the top of the component:
  const [loading, setLoading] = useState(false);
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false);
  const [pendingTimetableData, setPendingTimetableData] = useState<any>(null);

  // Handle setup form changes
  const handleSetupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSetup(prev => ({ ...prev, [name]: value }));
  };

  const fillExistingTimetable = (timetableData: any, periods: number, subjectsList: Subject[]) => {
    const grid = days.map(day =>
      Array.from({ length: Number(periods) }, (_, periodIdx) => {
        const slotsForDay = timetableData.timeSlots.filter((s: any) => s.day === day);
        const slot = slotsForDay[periodIdx];
        if (slot) {
          const subjectObj = subjectsList.find(
            s => s.subject_name === slot.subject
          );
          return {
            subject: subjectObj ? subjectObj.subject_id : '', // <-- store subject_id
            faculty: slot.faculty,
            facultyName: subjectObj ? subjectObj.faculty_name : 'Unassigned',
            startTime: slot.startTime,
            endTime: slot.endTime,
          };
        }
        return { subject: '', faculty: '', facultyName: 'Unassigned', startTime: '', endTime: '' };
      })
    );
    setTimetable(grid);
    setStep(2);
  };

  // On setup submit, create empty timetable grid
  const handleSetupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.get(`/userData/checkTimetable?department=${setup.branch}&year=${setup.year}&section=${setup.section}`);
      if (response.data.subjects) {
        setSubjects(response.data.subjects);
      }
      if (response.data.exists) {
        setShowConfirmOverwrite(true);
        setPendingTimetableData({ timetable: response.data.timetable, periods: setup.periods, subjects: response.data.subjects });
        setLoading(false);
        return;
      }
    } catch (error: any) {
      setLoading(false);
      toast({ title: 'Error', description: error.response?.data?.message || error.message || 'Unknown error', variant: 'destructive' });
      return;
    }

    if (setup.branch && setup.year && setup.section && setup.periods > 0) {
      const emptyGrid = days.map(() =>
        Array.from({ length: Number(setup.periods) }, () => ({ subject: '', faculty: '', facultyName: 'Unassigned', startTime: '', endTime: '' }))
      );
      setTimetable(emptyGrid);
      setStep(2);
    }
    setLoading(false);
  };

  const handleConfirmOverwrite = () => {
    if (pendingTimetableData) {
      fillExistingTimetable(pendingTimetableData.timetable, pendingTimetableData.periods, pendingTimetableData.subjects);
      setShowConfirmOverwrite(false);
      setPendingTimetableData(null);
    }
  };
  
  const handleCancelOverwrite = () => {
    setShowConfirmOverwrite(false);
    setPendingTimetableData(null);
  };

  // Check if Monday has timings filled
  const isMondayFilled = () => {
    if (!timetable[0]) return false;
    // Check if all periods on Monday have start and end times
    return timetable[0].every(cell => cell.startTime && cell.endTime);
  };

  // Copy Monday's time layout to other days
  const copyMondayLayout = () => {
    if (!timetable[0]) return;
    setTimetable(prev => {
      return prev.map((day, dayIdx) => {
        if (dayIdx === 0) return day; // Keep Monday as is
        return day.map((cell, periodIdx) => ({
          ...cell,
          startTime: prev[0][periodIdx].startTime,
          endTime: prev[0][periodIdx].endTime,
        }));
      });
    });
  };

  // Handle cell edit
  const handleCellChange = (dayIdx: number, periodIdx: number, field: string, value: string) => {
    setTimetable(prev => {
      const updated = prev.map(row => row.map(cell => ({ ...cell })));
      if (field === 'subject') {
        const subjectObj = subjects.find(s => s.subject_id === value);
        updated[dayIdx][periodIdx].subject = value;
        updated[dayIdx][periodIdx].faculty = subjectObj ? subjectObj.faculty_id || '' : '';
        updated[dayIdx][periodIdx].facultyName = subjectObj ? subjectObj.faculty_name || 'Unassigned' : 'Unassigned';
      } else {
        updated[dayIdx][periodIdx][field] = value;
      }
      return updated;
    });
  };

  // Add this validation function to check data consistency
  const validateSubjectMapping = () => {
    const errors = [];
    
    for (let dayIdx = 0; dayIdx < timetable.length; dayIdx++) {
      const periods = timetable[dayIdx];
      for (let periodIdx = 0; periodIdx < periods.length; periodIdx++) {
        const cell = periods[periodIdx];
        if (cell.subject) {
          const subjectObj = subjects.find(s => s.subject_id === cell.subject);
          if (!subjectObj) {
            errors.push(`Invalid subject ID "${cell.subject}" at ${days[dayIdx]}, Period ${periodIdx + 1}`);
          }
        }
      }
    }
    
    return errors;
  };

  // Validation for empty fields and overlapping times
  const validateTimetable = () => {
    // Check for subject mapping errors first
    const subjectErrors = validateSubjectMapping();
    if (subjectErrors.length > 0) {
      toast({ 
        title: 'Subject Mapping Error', 
        description: `${subjectErrors[0]}. Please refresh the page and try again.`, 
        variant: 'destructive' 
      });
      return false;
    }

    for (let dayIdx = 0; dayIdx < timetable.length; dayIdx++) {
      const periods = timetable[dayIdx];
      for (let periodIdx = 0; periodIdx < periods.length; periodIdx++) {
        const cell = periods[periodIdx];
          if (!cell.subject || !cell.startTime || !cell.endTime) {
            toast({ title: 'Error', description: `All fields must be filled. Missing at Day: ${days[dayIdx]}, Period: ${periodIdx + 1}`, variant: 'destructive' });
            return false;
          }
          if (cell.startTime >= cell.endTime) {
            toast({ title: 'Error', description: `Start time must be before end time at Day: ${days[dayIdx]}, Period: ${periodIdx + 1}`, variant: 'destructive' });
            return false;
          }
      }
      const sortedPeriods = periods
        .map((cell, idx) => ({ ...cell, idx }))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      for (let i = 1; i < sortedPeriods.length; i++) {
        if (sortedPeriods[i].startTime < sortedPeriods[i - 1].endTime) {
          toast({ title: 'Error', description: `Period ${sortedPeriods[i].idx + 1} on ${days[dayIdx]} starts before the previous period ends (Period ${sortedPeriods[i - 1].idx + 1} ends at ${sortedPeriods[i - 1].endTime}). Please fix the timings.`, variant: 'destructive' });
          return false;
        }
      }
    }
    return true;
  };

  // Handle timetable submit - FIXED VERSION
  const handleTimetableSubmit = async () => {
    if (!validateTimetable()) {
      toast({ title: 'Error', description: 'Please fix the errors in the timetable.', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    
    // Add validation to ensure subjects array is loaded
    if (subjects.length === 0) {
      toast({ title: 'Error', description: 'Subjects not loaded. Please refresh and try again.', variant: 'destructive' });
      setLoading(false);
      return;
    }
    
    // Debug: Log the subjects array and timetable data
    console.log('Subjects array:', subjects);
    console.log('Timetable data:', timetable);
    
    try {
      const payload = {
        timeTable: timetable.map((dayArr, dayIndex) =>
          dayArr.map((cell, periodIndex) => {
            const subjectObj = subjects.find(s => s.subject_id === cell.subject);
           
            if (!subjectObj) {
              console.error(`Subject not found for ID: ${cell.subject}`);
              toast({ 
                title: 'Error', 
                description: `Subject not found for ID: ${cell.subject}. Please refresh and try again.`, 
                variant: 'destructive' 
              });
              throw new Error(`Subject not found: ${cell.subject}`);
            }
            
            return {
              subject: subjectObj.subject_name, 
              faculty: subjectObj.faculty_id,
              startTime: cell.startTime,
              endTime: cell.endTime,
            };
          })
        ),
        classDetails: {
          department: setup.branch,
          year: setup.year,
          section: setup.section,
        }
      };
      
      // Debug: Log the final payload
      console.log('Final payload:', JSON.stringify(payload, null, 2));
      
      const response = await apiClient.post('/userData/createTimeTable', payload);
      toast({ title: 'Success', description: response.data.message, variant: 'success' });
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({ title: 'Error', description: error.response?.data?.message || error.message || 'Submission failed', variant: 'destructive' });
    }
    setLoading(false);
  };

  // Auto-load timetable if query params are present
  useEffect(() => {
    if (queryParams.branch && queryParams.year && queryParams.section) {
      // Only run if not already at step 2
      if (step === 1) {
        // Simulate form submit
        (async () => {
          setLoading(true);
          try {
            const response = await apiClient.get(`/userData/checkTimetable?department=${queryParams.branch}&year=${queryParams.year}&section=${queryParams.section}`);
            if (response.data.subjects) {
              setSubjects(response.data.subjects);
            }
            if (response.data.exists) {
              fillExistingTimetable(response.data.timetable, setup.periods, response.data.subjects || []);
              setSetup(prev => ({ ...prev, branch: queryParams.branch, year: queryParams.year, section: queryParams.section }));
              setStep(2);
            } else {
              // If not exists, just fill setup and stay at step 1
              setSetup(prev => ({ ...prev, branch: queryParams.branch, year: queryParams.year, section: queryParams.section }));
            }
          } catch (error) {
            // fallback: just fill setup
            setSetup(prev => ({ ...prev, branch: queryParams.branch, year: queryParams.year, section: queryParams.section }));
          }
          setLoading(false);
        })();
      }
    }
  }, [queryParams.branch, queryParams.year, queryParams.section]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav activeSection={"Timetable"} onNavClick={() => {}} dashboardType="timetable" />
      
      {/* Confirmation Dialog for Overwrite */}
      {showConfirmOverwrite && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Timetable Exists</h3>
            <p className="mb-4">A timetable for this branch, year, and section already exists. Do you want to overwrite it?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleCancelOverwrite}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleConfirmOverwrite}>Overwrite</button>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Back Button */}
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center md:text-left">Timetable Dashboard</h1>
          <p className="text-gray-600 mb-6 md:mb-8 text-center md:text-left text-sm md:text-base">Build and edit your class timetable below.</p>
          
          {/* Step 1: Setup Form */}
          {step === 1 && (
            <section className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Setup Timetable</h2>
              <form className="space-y-4" onSubmit={handleSetupSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select name="branch" value={setup.branch} onChange={handleSetupChange} className="border rounded p-3 text-base" required>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select name="year" value={setup.year} onChange={handleSetupChange} className="border rounded p-3 text-base" required>
                    <option value="">Select Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select name="section" value={setup.section} onChange={handleSetupChange} className="border rounded p-3 text-base" required>
                    <option value="">Select Section</option>
                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    type="number"
                    name="periods"
                    min={1}
                    max={10}
                    value={setup.periods}
                    onChange={handleSetupChange}
                    className="border rounded p-3 text-base"
                    placeholder="Number of Periods"
                    required
                  />
                </div>
                <button 
                type="submit"
                 className="w-full bg-blue-600 text-white rounded px-4 py-3 hover:bg-blue-700 transition font-medium text-base"
                 disabled={loading}
                 >
                  {loading ? 'Loading...' : 'Create Timetable'}
                </button>
              </form>
            </section>
          )}
          
          {/* Step 2: Editable Timetable Grid */}
          {step === 2 && (
            <section className="w-full bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Edit Timetable for {setup.branch} - Year {setup.year} - Section {setup.section}</h2>
              
              {/* Copy Monday Layout Button */}
              {isMondayFilled() && (
                <div className="mb-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-blue-800 font-medium text-sm md:text-base">Monday timings are set!</p>
                      <p className="text-blue-600 text-xs md:text-sm">Copy Monday's <span title="Only start and end times will be copied, not subjects or faculty.">time layout</span> to all other days to save time.</p>
                    </div>
                    <button
                      onClick={copyMondayLayout}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium text-sm md:text-base whitespace-nowrap"
                      title="Only start and end times will be copied, not subjects or faculty."
                    >
                      Copy Monday Layout to All Days
                    </button>
                  </div>
                </div>
              )}

              {/* No subjects available message */}
              {subjects.length === 0 && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-center">
                  No subjects available for this class. Please assign subjects first.
                </div>
              )}

              {/* Mobile: Card-based layout */}
              <div className="md:hidden">
                {days.map((day, dayIdx) => (
                  <div key={day} className="mb-6 border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b">
                      <h3 className="font-semibold text-gray-800">{day}</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {Array.from({ length: Number(setup.periods) }, (_, periodIdx) => {
                        const cell = timetable[dayIdx]?.[periodIdx] || { subject: '', faculty: '', facultyName: 'Unassigned', startTime: '', endTime: '' };
                        return (
                          <div key={periodIdx} className={`p-3 border rounded-lg bg-gray-50 border-gray-200`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-sm text-gray-700">Period {periodIdx + 1}</span>
                            </div>
                              <div className="space-y-3">
                                <select
                                  value={cell.subject || ''}
                                  onChange={e => handleCellChange(dayIdx, periodIdx, 'subject', e.target.value)}
                                  className="w-full border rounded p-2 text-sm"
                                  disabled={subjects.length === 0}
                                >
                                  <option value="">Select Subject</option>
                                  {subjects.map(sub => <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>)}
                                </select>
                                <input
                                  type="text"
                                  value={cell.facultyName || 'Unassigned'}
                                  className="w-full border rounded p-2 text-sm bg-gray-100 cursor-not-allowed"
                                  placeholder="Teacher"
                                  disabled
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="time"
                                    value={cell.startTime || ''}
                                    onChange={e => handleCellChange(dayIdx, periodIdx, 'startTime', e.target.value)}
                                    className="border rounded p-2 text-sm"
                                    placeholder="Start Time"
                                    disabled={subjects.length === 0}
                                  />
                                  <input
                                    type="time"
                                    value={cell.endTime || ''}
                                    onChange={e => handleCellChange(dayIdx, periodIdx, 'endTime', e.target.value)}
                                    className="border rounded p-2 text-sm"
                                    placeholder="End Time"
                                    disabled={subjects.length === 0}
                                  />
                                </div>
                              </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Day / Period</th>
                      {Array.from({ length: Number(setup.periods) }, (_, pIdx) => (
                        <th key={pIdx} className="p-2 border">Period {pIdx + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day, dayIdx) => (
                      <tr key={day}>
                        <td className="p-2 border font-semibold bg-gray-50">{day}</td>
                        {Array.from({ length: Number(setup.periods) }, (_, periodIdx) => {
                          const cell = timetable[dayIdx]?.[periodIdx] || { subject: '', faculty: '', facultyName: 'Unassigned', startTime: '', endTime: '' };
                          return (
                            <td key={periodIdx} className={`p-2 border min-w-[240px]`}>
                              <div className="flex flex-col gap-1">
                                  <>
                                    <select
                                      value={cell.subject || ''}
                                      onChange={e => handleCellChange(dayIdx, periodIdx, 'subject', e.target.value)}
                                      className="border rounded p-1 mb-1"
                                      disabled={subjects.length === 0}
                                    >
                                      <option value="">Subject</option>
                                      {subjects.map(sub => <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>)}
                                    </select>
                                    <input
                                      type="text"
                                      value={cell.facultyName || 'Unassigned'}
                                      className="border rounded p-1 mb-1 bg-gray-100 cursor-not-allowed"
                                      placeholder="Teacher"
                                      disabled
                                    />
                                    <div className="flex gap-1">
                                      <input
                                        type="time"
                                        value={cell.startTime || ''}
                                        onChange={e => handleCellChange(dayIdx, periodIdx, 'startTime', e.target.value)}
                                        className="border rounded p-1 w-1/2"
                                        placeholder="Start Time"
                                        disabled={subjects.length === 0}
                                      />
                                      <input
                                        type="time"
                                        value={cell.endTime || ''}
                                        onChange={e => handleCellChange(dayIdx, periodIdx, 'endTime', e.target.value)}
                                        className="border rounded p-1 w-1/2"
                                        placeholder="End Time"
                                        disabled={subjects.length === 0}
                                      />
                                    </div>
                                  </>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-center md:justify-end mt-6">
                <button
                  className="w-full md:w-auto bg-green-600 text-white rounded px-6 py-3 font-semibold hover:bg-green-700 transition text-base"
                  onClick={handleTimetableSubmit}
                  disabled={loading || subjects.length === 0}
                >
                  {loading ? 'Submitting...' : 'Submit Timetable'}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default TimetableDashboard;