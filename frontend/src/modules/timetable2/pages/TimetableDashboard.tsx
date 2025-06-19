import React, { useState } from 'react';
import DashboardNav from '../../../components/dashboard/DashboardNav';

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

  // Handle cell edit
  const handleCellChange = (dayIdx, periodIdx, field, value) => {
    setTimetable(prev => {
      const updated = prev.map(row => row.map(cell => ({ ...cell })));
      if (field === 'startTime' && periodIdx > 0 && !updated[dayIdx][periodIdx].isBreak) {
        const prevCell = updated[dayIdx][periodIdx - 1];
        if (!prevCell.isBreak && prevCell.endTime && value < prevCell.endTime) {
          setError(`The time is already assigned to Period ${periodIdx} (ends at ${prevCell.endTime}). Please choose a valid start time.`);
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
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">Timetable Dashboard</h1>
        <p className="text-gray-600 mb-8">Build and edit your class timetable below.</p>
        {error && (
          <div className="mb-4 w-full max-w-2xl bg-red-100 text-red-700 px-4 py-2 rounded border border-red-300">{error}</div>
        )}
        {/* Step 1: Setup Form */}
        {step === 1 && (
          <section className="w-full max-w-xl bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Setup Timetable</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSetupSubmit}>
              <select name="branch" value={setup.branch} onChange={handleSetupChange} className="border rounded p-2" required>
                <option value="">Select Branch</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select name="year" value={setup.year} onChange={handleSetupChange} className="border rounded p-2" required>
                <option value="">Select Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select name="section" value={setup.section} onChange={handleSetupChange} className="border rounded p-2" required>
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
                className="border rounded p-2"
                placeholder="Number of Periods"
                required
              />
              <button type="submit" className="md:col-span-2 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition mt-2">Create Timetable</button>
            </form>
          </section>
        )}
        {/* Step 2: Editable Timetable Grid */}
        {step === 2 && (
          <section className="w-full max-w-5xl bg-white rounded-lg shadow p-6 mb-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Timetable for {setup.branch} - Year {setup.year} - Section {setup.section}</h2>
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
            <div className="flex justify-end mt-6">
              <button
                className="bg-green-600 text-white rounded px-6 py-2 font-semibold hover:bg-green-700 transition"
                onClick={handleTimetableSubmit}
              >
                Submit Timetable
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TimetableDashboard;