import React, { useState } from 'react';
import DashboardNav from '../../user-management1/components/dashboard/DashboardNav';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CSD', 'CSM'];
const years = ['1', '2', '3', '4'];
const sections = ['1', '2', '3'];
const subjects = ['Maths', 'Physics', 'Chemistry', 'English', 'Computer Science'];
const faculties = ['Dr. Smith', 'Prof. Wilson', 'Dr. Brown', 'Ms. Clark'];

const TimetableDashboard = () => {
  // Step 1: Setup form state
  const [setup, setSetup] = useState({
    branch: '',
    year: '',
    section: '',
    periods: 6,
  });
  const [step, setStep] = useState(1);

  // Step 2: Timetable grid state
  const [timetable, setTimetable] = useState([]); // 2D array: days x periods
  const [error, setError] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // Auto-dismiss error popup after 5 seconds
  useEffect(() => {
    if (showErrorPopup) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  // Handle setup form changes
  const handleSetupChange = (e) => {
    const { name, value } = e.target;
    setSetup(prev => ({ ...prev, [name]: value }));
  };

  // On setup submit, create empty timetable grid
  const handleSetupSubmit = (e) => {
    e.preventDefault();
    if (setup.branch && setup.year && setup.section && setup.periods > 0) {
      const emptyGrid = days.map(() =>
        Array.from({ length: Number(setup.periods) }, () => ({ subject: '', faculty: '', startTime: '', endTime: '', isBreak: false, breakLabel: '' }))
      );
      setTimetable(emptyGrid);
      setStep(2);
      setError('');
    }
  };

  // Check if Monday has timings filled
  const isMondayFilled = () => {
    if (!timetable[0]) return false;
    return timetable[0].some(cell => 
      cell.isBreak ? cell.breakLabel : (cell.startTime && cell.endTime)
    );
  };

  // Copy Monday's time layout to other days
  const copyMondayLayout = () => {
    if (!timetable[0]) return;
    
    setTimetable(prev => {
      const updated = prev.map((day, dayIdx) => {
        if (dayIdx === 0) return day; // Keep Monday as is
        
        return day.map((cell, periodIdx) => {
          const mondayCell = prev[0][periodIdx];
          return {
            ...cell,
            startTime: mondayCell.startTime,
            endTime: mondayCell.endTime,
            isBreak: mondayCell.isBreak,
            breakLabel: mondayCell.breakLabel
          };
        });
      });
      return updated;
    });
    setError('');
  };

  // Handle cell edit
  const handleCellChange = (dayIdx, periodIdx, field, value) => {
    setTimetable(prev => {
      const updated = prev.map(row => row.map(cell => ({ ...cell })));
      if (field === 'startTime' && periodIdx > 0 && !updated[dayIdx][periodIdx].isBreak) {
        const prevCell = updated[dayIdx][periodIdx - 1];
        if (!prevCell.isBreak && prevCell.endTime && value < prevCell.endTime) {
          const errorMessage = `The time is already assigned to Period ${periodIdx} (ends at ${prevCell.endTime}). Please choose a valid start time.`;
          setError(errorMessage);
          setShowErrorPopup(true);
          updated[dayIdx][periodIdx][field] = '';
          return updated;
        }
      }
      updated[dayIdx][periodIdx][field] = value;
      // If marking as break, clear other fields
      if (field === 'isBreak' && value) {
        updated[dayIdx][periodIdx].subject = '';
        updated[dayIdx][periodIdx].faculty = '';
        updated[dayIdx][periodIdx].startTime = '';
        updated[dayIdx][periodIdx].endTime = '';
      }
      if (field === 'isBreak' && !value) {
        updated[dayIdx][periodIdx].breakLabel = '';
      }
      setError('');
      return updated;
    });
  };

  // Validation for empty fields and overlapping times
  const validateTimetable = () => {
    for (let dayIdx = 0; dayIdx < timetable.length; dayIdx++) {
      const periods = timetable[dayIdx];
      // Check for empty fields (skip breaks)
      for (let periodIdx = 0; periodIdx < periods.length; periodIdx++) {
        const cell = periods[periodIdx];
        if (!cell.isBreak) {
          if (!cell.subject || !cell.faculty || !cell.startTime || !cell.endTime) {
            setError(`All fields must be filled. Missing at Day: ${days[dayIdx]}, Period: ${periodIdx + 1}`);
            return false;
          }
          // Check valid time order
          if (cell.startTime >= cell.endTime) {
            setError(`Start time must be before end time at Day: ${days[dayIdx]}, Period: ${periodIdx + 1}`);
            return false;
          }
        }
      }
      // Check for overlapping times within the same day (skip breaks)
      const sortedPeriods = periods
        .map((cell, idx) => ({ ...cell, idx }))
        .filter(cell => !cell.isBreak)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      for (let i = 1; i < sortedPeriods.length; i++) {
        if (sortedPeriods[i].startTime < sortedPeriods[i - 1].endTime) {
          setError(`Period ${sortedPeriods[i].idx + 1} on ${days[dayIdx]} starts before the previous period ends (Period ${sortedPeriods[i - 1].idx + 1} ends at ${sortedPeriods[i - 1].endTime}). Please fix the timings.`);
          return false;
        }
      }
    }
    setError('');
    return true;
  };

  // Handle timetable submit
  const handleTimetableSubmit = () => {
    if (validateTimetable()) {
      alert(JSON.stringify(timetable, null, 2));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav activeSection={"Timetable"} onNavClick={() => {}} dashboardType="timetable" />
      
      {/* Error Popup Notification */}
      {showErrorPopup && error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Time Conflict Error</span>
              </div>
              <p className="mt-1 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="ml-4 text-red-500 hover:text-red-700 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
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
                <button type="submit" className="w-full bg-blue-600 text-white rounded px-4 py-3 hover:bg-blue-700 transition font-medium text-base">Create Timetable</button>
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
                      <p className="text-blue-600 text-xs md:text-sm">Copy Monday's time layout to all other days to save time.</p>
                    </div>
                    <button
                      onClick={copyMondayLayout}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium text-sm md:text-base whitespace-nowrap"
                    >
                      Copy Monday Layout to All Days
                    </button>
                  </div>
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
                        const cell = timetable[dayIdx]?.[periodIdx] || {};
                        return (
                          <div key={periodIdx} className={`p-3 border rounded-lg ${cell.isBreak ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-sm text-gray-700">Period {periodIdx + 1}</span>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={!!cell.isBreak}
                                  onChange={e => handleCellChange(dayIdx, periodIdx, 'isBreak', e.target.checked)}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-600">Break</span>
                              </label>
                            </div>
                            
                            {cell.isBreak ? (
                              <input
                                type="text"
                                value={cell.breakLabel || ''}
                                onChange={e => handleCellChange(dayIdx, periodIdx, 'breakLabel', e.target.value)}
                                className="w-full border rounded p-2 text-sm"
                                placeholder="Break label (e.g. Lunch Break)"
                              />
                            ) : (
                              <div className="space-y-3">
                                <select
                                  value={cell.subject || ''}
                                  onChange={e => handleCellChange(dayIdx, periodIdx, 'subject', e.target.value)}
                                  className="w-full border rounded p-2 text-sm"
                                >
                                  <option value="">Select Subject</option>
                                  {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                </select>
                                <select
                                  value={cell.faculty || ''}
                                  onChange={e => handleCellChange(dayIdx, periodIdx, 'faculty', e.target.value)}
                                  className="w-full border rounded p-2 text-sm"
                                >
                                  <option value="">Select Teacher</option>
                                  {faculties.map(fac => <option key={fac} value={fac}>{fac}</option>)}
                                </select>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="time"
                                    value={cell.startTime || ''}
                                    onChange={e => handleCellChange(dayIdx, periodIdx, 'startTime', e.target.value)}
                                    className="border rounded p-2 text-sm"
                                    placeholder="Start Time"
                                  />
                                  <input
                                    type="time"
                                    value={cell.endTime || ''}
                                    onChange={e => handleCellChange(dayIdx, periodIdx, 'endTime', e.target.value)}
                                    className="border rounded p-2 text-sm"
                                    placeholder="End Time"
                                  />
                                </div>
                              </div>
                            )}
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
                          const cell = timetable[dayIdx]?.[periodIdx] || {};
                          return (
                            <td key={periodIdx} className={`p-2 border min-w-[240px] ${cell.isBreak ? 'bg-yellow-100' : ''}`}>
                              <div className="flex flex-col gap-1">
                                <label className="flex items-center gap-2 mb-1">
                                  <input
                                    type="checkbox"
                                    checked={!!cell.isBreak}
                                    onChange={e => handleCellChange(dayIdx, periodIdx, 'isBreak', e.target.checked)}
                                  />
                                  <span className="text-sm">Break</span>
                                </label>
                                {cell.isBreak ? (
                                  <input
                                    type="text"
                                    value={cell.breakLabel || ''}
                                    onChange={e => handleCellChange(dayIdx, periodIdx, 'breakLabel', e.target.value)}
                                    className="border rounded p-1"
                                    placeholder="Break label (e.g. Lunch Break)"
                                  />
                                ) : (
                                  <>
                                    <select
                                      value={cell.subject || ''}
                                      onChange={e => handleCellChange(dayIdx, periodIdx, 'subject', e.target.value)}
                                      className="border rounded p-1 mb-1"
                                    >
                                      <option value="">Subject</option>
                                      {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                    </select>
                                    <select
                                      value={cell.faculty || ''}
                                      onChange={e => handleCellChange(dayIdx, periodIdx, 'faculty', e.target.value)}
                                      className="border rounded p-1 mb-1"
                                    >
                                      <option value="">Teacher</option>
                                      {faculties.map(fac => <option key={fac} value={fac}>{fac}</option>)}
                                    </select>
                                    <div className="flex gap-1">
                                      <input
                                        type="time"
                                        value={cell.startTime || ''}
                                        onChange={e => handleCellChange(dayIdx, periodIdx, 'startTime', e.target.value)}
                                        className="border rounded p-1 w-1/2"
                                        placeholder="Start Time"
                                      />
                                      <input
                                        type="time"
                                        value={cell.endTime || ''}
                                        onChange={e => handleCellChange(dayIdx, periodIdx, 'endTime', e.target.value)}
                                        className="border rounded p-1 w-1/2"
                                        placeholder="End Time"
                                      />
                                    </div>
                                  </>
                                )}
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
                >
                  Submit Timetable
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

function useEffect(arg0: () => () => void, arg1: boolean[]) {
  throw new Error('Function not implemented.');
}
