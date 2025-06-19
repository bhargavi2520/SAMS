import React, { useState } from 'react';
import DashboardNav from '../../../components/dashboard/DashboardNav';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CSD', 'CSM'];
const years = ['1', '2', '3', '4'];
const sections = ['A', 'B', 'C'];
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
        Array.from({ length: Number(setup.periods) }, () => ({ subject: '', faculty: '', time: '' }))
      );
      setTimetable(emptyGrid);
      setStep(2);
    }
  };

  // Handle cell edit
  const handleCellChange = (dayIdx, periodIdx, field, value) => {
    setTimetable(prev => {
      const updated = prev.map(row => row.map(cell => ({ ...cell })));
      updated[dayIdx][periodIdx][field] = value;
      return updated;
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav activeSection={"Timetable"} onNavClick={() => {}} dashboardType="timetable" />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">Timetable Dashboard</h1>
        <p className="text-gray-600 mb-8">Build and edit your class timetable below.</p>

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
                    {Array.from({ length: Number(setup.periods) }, (_, periodIdx) => (
                      <td key={periodIdx} className="p-2 border min-w-[220px]">
                        <div className="flex flex-col gap-1">
                          <select
                            value={timetable[dayIdx]?.[periodIdx]?.subject || ''}
                            onChange={e => handleCellChange(dayIdx, periodIdx, 'subject', e.target.value)}
                            className="border rounded p-1 mb-1"
                          >
                            <option value="">Subject</option>
                            {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                          </select>
                          <select
                            value={timetable[dayIdx]?.[periodIdx]?.faculty || ''}
                            onChange={e => handleCellChange(dayIdx, periodIdx, 'faculty', e.target.value)}
                            className="border rounded p-1 mb-1"
                          >
                            <option value="">Teacher</option>
                            {faculties.map(fac => <option key={fac} value={fac}>{fac}</option>)}
                          </select>
                          <input
                            type="text"
                            value={timetable[dayIdx]?.[periodIdx]?.time || ''}
                            onChange={e => handleCellChange(dayIdx, periodIdx, 'time', e.target.value)}
                            className="border rounded p-1"
                            placeholder="Time (e.g. 9:00-10:00)"
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-6">
              <button
                className="bg-green-600 text-white rounded px-6 py-2 font-semibold hover:bg-green-700 transition"
                onClick={() => alert(JSON.stringify(timetable, null, 2))}
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